package com.carpooling.backend.service;

import com.carpooling.backend.dto.GeoPoint;
import com.carpooling.backend.dto.RouteOption;
import com.carpooling.backend.exception.RouteLookupException;
import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Locale;
import java.util.concurrent.CompletableFuture;

// Free, key-less mapping services, now called from the backend instead of
// directly from the browser:
//  - Nominatim (OpenStreetMap) for turning a place name into coordinates
//  - OSRM demo server for turning two coordinates into one or more driving routes
@Service
public class RouteServiceImpl implements RouteService {

    private static final String NOMINATIM_URL = "https://nominatim.openstreetmap.org/search";
    private static final String OSRM_URL = "https://router.project-osrm.org/route/v1/driving";

    // Roughly covers all of India — biases/restricts Nominatim results so
    // "rewa" resolves to Rewa, Madhya Pradesh rather than a same-named place
    // elsewhere, and keeps the search area small (faster + fewer wrong matches).
    private static final String INDIA_VIEWBOX = "68.0,37.5,97.5,6.5"; // left,top,right,bottom

    // Fare policy: ₹5 per kilometre, rounded to the nearest rupee.
    private static final int FARE_PER_KM = 5;

    // Two routes are "the same" for our purposes if their distance and
    // duration are both within a small tolerance — avoids showing
    // near-identical polylines as separate options.
    private static final double DUPLICATE_DISTANCE_TOLERANCE_KM = 0.3;
    private static final double DUPLICATE_DURATION_TOLERANCE_MIN = 1.0;

    private static final int MAX_ROUTE_OPTIONS = 4;

    @Autowired
    private RestTemplate restTemplate;

    @Override
    public GeoPoint geocode(String place) {
        List<GeoPoint> results = queryNominatim(place, 1);
        if (results.isEmpty()) {
            throw new RouteLookupException(
                    "Could not find \"" + place + "\" in India. Try a more specific name (e.g. add the state).");
        }
        return results.get(0);
    }

    @Override
    public List<GeoPoint> suggest(String query) {
        if (query == null || query.trim().length() < 2) {
            return List.of();
        }
        return queryNominatim(query.trim(), 5);
    }

    // Shared Nominatim lookup used by both geocode() (exact best match) and
    // suggest() (as-you-type candidate list). Never throws on a lookup miss —
    // callers decide how to handle an empty result.
    private List<GeoPoint> queryNominatim(String place, int limit) {
        URI url = UriComponentsBuilder.fromHttpUrl(NOMINATIM_URL)
                .queryParam("format", "json")
                .queryParam("limit", limit)
                .queryParam("countrycodes", "in")
                .queryParam("viewbox", INDIA_VIEWBOX)
                .queryParam("bounded", 1)
                .queryParam("q", place)
                .build()
                .toUri();

        HttpHeaders headers = new HttpHeaders();
        headers.set("Accept-Language", "en");
        // Unlike browsers (which send one automatically), server-to-server
        // requests need a descriptive User-Agent per Nominatim's usage policy,
        // or requests can get blocked.
        headers.set("User-Agent", "CarPoolingApp/1.0 (server-side route lookup)");

        JsonNode results;
        try {
            ResponseEntity<JsonNode> response =
                    restTemplate.exchange(url, HttpMethod.GET, new HttpEntity<>(headers), JsonNode.class);
            results = response.getBody();
        } catch (RestClientException ex) {
            throw new RouteLookupException("Could not reach the map lookup service. Please try again.");
        }

        if (results == null || !results.isArray() || results.isEmpty()) {
            return List.of();
        }

        List<GeoPoint> points = new ArrayList<>();
        for (JsonNode node : results) {
            points.add(new GeoPoint(
                    node.get("lat").asDouble(),
                    node.get("lon").asDouble(),
                    node.get("display_name").asText()));
        }
        return points;
    }

    @Override
    public List<RouteOption> getRoutes(GeoPoint from, GeoPoint to) {
        // OSRM's own `alternatives=true` flag is quite conservative — for a
        // lot of origin/destination pairs it only ever returns the single
        // fastest route, even though a perfectly reasonable alternative (e.g.
        // avoiding the highway) exists. So instead of relying on that flag
        // alone, we ask OSRM a few different ways in parallel and merge
        // whatever comes back:
        //   1. The default fastest route + any alternatives OSRM volunteers.
        //   2. A route that avoids motorways/highways (usually "local roads").
        //   3. A route that avoids toll roads, where that differs from the above.
        CompletableFuture<List<JsonNode>> baseFuture =
                CompletableFuture.supplyAsync(() -> fetchOsrmRoutes(from, to, "alternatives=true"));
        CompletableFuture<List<JsonNode>> noMotorwayFuture =
                CompletableFuture.supplyAsync(() -> fetchOsrmRoutes(from, to, "alternatives=false&exclude=motorway"));
        CompletableFuture<List<JsonNode>> noTollFuture =
                CompletableFuture.supplyAsync(() -> fetchOsrmRoutes(from, to, "alternatives=false&exclude=toll"));

        List<JsonNode> base = baseFuture.join();
        List<JsonNode> noMotorway = noMotorwayFuture.join();
        List<JsonNode> noToll = noTollFuture.join();

        if (base.isEmpty() && noMotorway.isEmpty() && noToll.isEmpty()) {
            throw new RouteLookupException("No driving route found between those locations.");
        }

        List<JsonNode> allCandidates = new ArrayList<>();
        allCandidates.addAll(base);
        allCandidates.addAll(noMotorway);
        allCandidates.addAll(noToll);

        List<RouteOption> merged = new ArrayList<>();
        for (JsonNode routeNode : allCandidates) {
            RouteOption option = toRouteOption(routeNode);
            boolean alreadyHaveIt = merged.stream().anyMatch(existing -> isDuplicate(existing, option));
            if (!alreadyHaveIt) {
                merged.add(option);
            }
        }

        // Fastest first, so index 0 always matches the "Fastest Route" label in the UI.
        merged.sort(Comparator.comparingDouble(RouteOption::getDurationMin));

        return merged.size() > MAX_ROUTE_OPTIONS ? merged.subList(0, MAX_ROUTE_OPTIONS) : merged;
    }

    // Fires one request against OSRM with the given extra query params.
    // Returns an empty list (instead of throwing) on failure, so one bad or
    // unsupported request (e.g. an unsupported "exclude" class in some
    // regions) never breaks the overall route search.
    private List<JsonNode> fetchOsrmRoutes(GeoPoint from, GeoPoint to, String extraParams) {
        String url = String.format(Locale.ROOT,
                "%s/%f,%f;%f,%f?overview=full&geometries=geojson&%s",
                OSRM_URL, from.getLon(), from.getLat(), to.getLon(), to.getLat(), extraParams);

        try {
            JsonNode data = restTemplate.getForObject(URI.create(url), JsonNode.class);
            if (data == null || !"Ok".equals(data.path("code").asText()) || !data.has("routes")) {
                return List.of();
            }
            List<JsonNode> routes = new ArrayList<>();
            data.get("routes").forEach(routes::add);
            return routes;
        } catch (RestClientException ex) {
            return List.of();
        }
    }

    private RouteOption toRouteOption(JsonNode routeNode) {
        double distanceKm = routeNode.get("distance").asDouble() / 1000.0;
        double durationMin = routeNode.get("duration").asDouble() / 60.0;

        List<List<Double>> coordinates = new ArrayList<>();
        // GeoJSON gives [lon, lat] pairs — Leaflet (on the frontend) wants [lat, lon]
        for (JsonNode pair : routeNode.get("geometry").get("coordinates")) {
            coordinates.add(List.of(pair.get(1).asDouble(), pair.get(0).asDouble()));
        }

        RouteOption option = new RouteOption();
        option.setDistanceKm(distanceKm);
        option.setDurationMin(durationMin);
        option.setFare((int) Math.round(distanceKm * FARE_PER_KM));
        option.setCoordinates(coordinates);
        return option;
    }

    private boolean isDuplicate(RouteOption a, RouteOption b) {
        boolean distanceClose = Math.abs(a.getDistanceKm() - b.getDistanceKm()) < DUPLICATE_DISTANCE_TOLERANCE_KM;
        boolean durationClose = Math.abs(a.getDurationMin() - b.getDurationMin()) < DUPLICATE_DURATION_TOLERANCE_MIN;
        return distanceClose && durationClose;
    }
}
