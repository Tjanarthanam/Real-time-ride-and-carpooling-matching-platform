package com.carpooling.backend.dto;

import java.util.List;

// Response for GET /api/routes/search — the resolved pickup/drop points
// plus every candidate route found between them.
public class RouteSearchResponse {

    private GeoPoint pickup;
    private GeoPoint drop;
    private List<RouteOption> routes;

    public RouteSearchResponse() {
    }

    public RouteSearchResponse(GeoPoint pickup, GeoPoint drop, List<RouteOption> routes) {
        this.pickup = pickup;
        this.drop = drop;
        this.routes = routes;
    }

    public GeoPoint getPickup() {
        return pickup;
    }

    public void setPickup(GeoPoint pickup) {
        this.pickup = pickup;
    }

    public GeoPoint getDrop() {
        return drop;
    }

    public void setDrop(GeoPoint drop) {
        this.drop = drop;
    }

    public List<RouteOption> getRoutes() {
        return routes;
    }

    public void setRoutes(List<RouteOption> routes) {
        this.routes = routes;
    }
}
