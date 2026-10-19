package com.techpods.jobtitles.exception;

/**
 * Thrown when no normalised title is similar enough to the input.
 */
public class NoMatchFoundException extends RuntimeException {

    private final String input;

    public NoMatchFoundException(String input, double minimumScore) {
        super("No normalised job title matches '" + input + "' with a score of at least " + minimumScore);
        this.input = input;
    }

    public String getInput() {
        return input;
    }
}
