package com.carpooling.backend.controller;

import com.carpooling.backend.dto.GeoPoint;
import com.carpooling.backend.dto.RouteOption;
import com.carpooling.backend.dto.RouteSearchResponse;
import com.carpooling.backend.service.RouteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/routes")
@CrossOrigin(origins = "*")
public class RouteController {

    @Autowired
    private RouteService routeService;

    // GET /api/routes/search?pickup=Rewa&drop=Bhopal
    // Geocodes both locations and returns up to a few candidate driving
    // routes between them, for the driver to pick from before publishing a ride.
    @GetMapping("/search")
    public ResponseEntity<RouteSearchResponse> searchRoutes(
            @RequestParam String pickup,
            @RequestParam String drop) {

        GeoPoint from = routeService.geocode(pickup);
        GeoPoint to = routeService.geocode(drop);
        List<RouteOption> routes = routeService.getRoutes(from, to);

        return ResponseEntity.ok(new RouteSearchResponse(from, to, routes));
    }

    // GET /api/routes/suggest?query=re
    // As-you-type location autocomplete for the pickup/dropoff/search fields —
    // returns up to 5 candidate places without requiring a full route lookup.
    @GetMapping("/suggest")
    public ResponseEntity<List<GeoPoint>> suggestLocations(@RequestParam String query) {
        return ResponseEntity.ok(routeService.suggest(query));
    }
}
