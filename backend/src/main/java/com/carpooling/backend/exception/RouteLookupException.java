package com.carpooling.backend.exception;

// Thrown when we can't geocode a place name or find a driving route between
// two points — e.g. the place doesn't exist, or the mapping services are
// unreachable. Caught by GlobalExceptionHandler and turned into a 400 with
// a message the frontend can show directly.
public class RouteLookupException extends RuntimeException {

    public RouteLookupException(String message) {
        super(message);
    }
}
