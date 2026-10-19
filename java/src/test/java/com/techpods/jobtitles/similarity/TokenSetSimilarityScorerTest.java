package com.techpods.jobtitles.similarity;

import com.techpods.jobtitles.text.Tokenizer;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;
import org.junit.jupiter.params.provider.ValueSource;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

class TokenSetSimilarityScorerTest {

    private final TokenSetSimilarityScorer scorer = new TokenSetSimilarityScorer();

    @Test
    void identicalTitlesScoreOne() {
        assertEquals(1.0, scorer.score("Software engineer", "software ENGINEER"), 1e-9);
    }

    @Test
    void wordOrderDoesNotMatter() {
        assertEquals(1.0, scorer.score("engineer software", "software engineer"), 1e-9);
    }

    @Test
    void emptyTokenListsScoreZero() {
        assertEquals(0.0, scorer.score("", "Accountant"));
        assertEquals(0.0, scorer.score("Accountant", "!!!"));
    }

    @Test
    void sharedWordScoresHigherThanUnrelatedTitle() {
        double shared = scorer.score("Java engineer", "Software engineer");
        double unrelated = scorer.score("Java engineer", "Accountant");

        assertTrue(shared > unrelated, shared + " should be greater than " + unrelated);
    }

    @Test
    void extraWordsLowerTheScoreWithoutRemovingTheMatch() {
        // tokens: chief|accountant vs accountant -> (avg(0.0, 1.0) + 1.0) / 2 = 0.75
        assertEquals(0.75, scorer.score("Chief Accountant", "Accountant"), 1e-9);
    }

    @Test
    void weakTokenSimilarityIsTreatedAsNoMatch() {
        // "chef" vs "architect" share a few letters (Levenshtein similarity 0.33) but are unrelated
        assertEquals(0.0, scorer.score("Chef", "Architect"));
    }

    @Test
    void typosStillCountAsTokenMatches() {
        assertEquals(0.9, scorer.score("Acountant", "Accountant"), 1e-9);
    }

    @ParameterizedTest(name = "score(\"{0}\", \"{1}\") is symmetric and within [0, 1]")
    @CsvSource({
            "Java engineer,       Software engineer",
            "C# engineer,         Architect",
            "Chief Accountant,    Quantity surveyor",
            "a,                   a very long job title indeed",
            "Zzz,                 Accountant",
    })
    void isSymmetricAndBounded(String a, String b) {
        double forward = scorer.score(a, b);
        double backward = scorer.score(b, a);

        assertEquals(forward, backward, 1e-9);
        assertTrue(forward >= 0.0 && forward <= 1.0, "score out of range: " + forward);
    }

    @Test
    void delegatesTokenComparisonToInjectedScorer() {
        SimilarityScorer alwaysHalf = (a, b) -> 0.5;
        TokenSetSimilarityScorer custom = new TokenSetSimilarityScorer(new Tokenizer(), alwaysHalf, 0.0);

        assertEquals(0.5, custom.score("anything at all", "something else"), 1e-9);
    }

    @Test
    void rejectsNullArguments() {
        assertThrows(NullPointerException.class, () -> scorer.score(null, "a"));
        assertThrows(NullPointerException.class, () -> scorer.score("a", null));
        assertThrows(NullPointerException.class, () -> new TokenSetSimilarityScorer(null, (a, b) -> 0, 0.5));
        assertThrows(NullPointerException.class, () -> new TokenSetSimilarityScorer(new Tokenizer(), null, 0.5));
    }

    @ParameterizedTest
    @ValueSource(doubles = {-0.1, 1.1, Double.NaN})
    void rejectsMinimumTokenScoreOutsideRange(double minimumTokenScore) {
        assertThrows(IllegalArgumentException.class,
                () -> new TokenSetSimilarityScorer(new Tokenizer(), (a, b) -> 0, minimumTokenScore));
    }
}
