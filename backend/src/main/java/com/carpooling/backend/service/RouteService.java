package com.carpooling.backend.service;

import com.carpooling.backend.dto.GeoPoint;
import com.carpooling.backend.dto.RouteOption;

import java.util.List;

public interface RouteService {

    // Turns a place name (e.g. "Rewa") into coordinates. Restricted to
    // India since that's where this app operates.
    GeoPoint geocode(String place);

    // As-you-type location autocomplete: returns up to a few candidate
    // places matching a partial query, for search/offer-ride location fields.
    List<GeoPoint> suggest(String query);

    // Given two points, returns up to a few possible driving routes between
    // them, fastest first.
    List<RouteOption> getRoutes(GeoPoint from, GeoPoint to);
}
