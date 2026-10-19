package com.techpods.jobtitles.similarity;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

class LevenshteinTokenSimilarityTest {

    private final LevenshteinTokenSimilarity similarity = new LevenshteinTokenSimilarity();

    @ParameterizedTest(name = "distance({0}, {1}) = {2}")
    @CsvSource({
            "kitten,    sitting,   3",
            "flaw,      lawn,      2",
            "accountant, acountant, 1",
            "same,      same,      0",
            "'',        abc,       3",
    })
    void computesEditDistance(String a, String b, int expected) {
        assertEquals(expected, LevenshteinTokenSimilarity.distance(a, b));
        assertEquals(expected, LevenshteinTokenSimilarity.distance(b, a));
    }

    @Test
    void identicalTokensScoreOne() {
        assertEquals(1.0, similarity.score("engineer", "engineer"));
        assertEquals(1.0, similarity.score("", ""));
    }

    @Test
    void completelyDifferentTokensScoreZero() {
        assertEquals(0.0, similarity.score("abc", "xyz"));
        assertEquals(0.0, similarity.score("", "abc"));
    }

    @Test
    void scoreIsNormalisedByLongerToken() {
        // one edit across 10 characters
        assertEquals(0.9, similarity.score("accountant", "acountant"), 1e-9);
    }

    @Test
    void rejectsNullArguments() {
        assertThrows(NullPointerException.class, () -> similarity.score(null, "a"));
        assertThrows(NullPointerException.class, () -> similarity.score("a", null));
    }
}
