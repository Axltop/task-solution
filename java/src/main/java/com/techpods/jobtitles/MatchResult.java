package com.techpods.jobtitles;

import java.util.Objects;

/**
 * The normalised title chosen for an input, together with its quality score {@code q}.
 */
public record MatchResult(String title, double score) {

    public MatchResult {
        Objects.requireNonNull(title, "title must not be null");
        if (Double.isNaN(score) || score < 0.0 || score > 1.0) {
            throw new IllegalArgumentException("score must be within [0.0, 1.0] but was " + score);
        }
    }
}
