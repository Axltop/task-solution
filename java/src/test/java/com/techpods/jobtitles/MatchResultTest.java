package com.techpods.jobtitles;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertThrows;

class MatchResultTest {

    @ParameterizedTest
    @ValueSource(doubles = {0.0, 0.5, 1.0})
    void acceptsScoresWithinRange(double score) {
        assertDoesNotThrow(() -> new MatchResult("Title", score));
    }

    @ParameterizedTest
    @ValueSource(doubles = {-0.001, 1.001, Double.NaN, Double.POSITIVE_INFINITY})
    void rejectsScoresOutsideRange(double score) {
        assertThrows(IllegalArgumentException.class, () -> new MatchResult("Title", score));
    }

    @Test
    void rejectsNullTitle() {
        assertThrows(NullPointerException.class, () -> new MatchResult(null, 0.5));
    }
}
