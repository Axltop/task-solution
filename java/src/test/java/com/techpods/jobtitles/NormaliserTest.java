package com.techpods.jobtitles;

import com.techpods.jobtitles.exception.NoMatchFoundException;
import com.techpods.jobtitles.similarity.SimilarityScorer;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;
import org.junit.jupiter.params.provider.NullAndEmptySource;
import org.junit.jupiter.params.provider.ValueSource;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

class NormaliserTest {

    private final Normaliser normaliser = new Normaliser();

    @Nested
    @DisplayName("normalise() with the default titles")
    class DefaultTitles {

        @ParameterizedTest(name = "\"{0}\" -> \"{1}\"")
        @CsvSource({
                // Examples from the specification
                "Java engineer,      Software engineer",
                "C# engineer,        Software engineer",
                "Accountant,         Accountant",
                "Chief Accountant,   Accountant",
                // Exact matches for every normalised title
                "Architect,          Architect",
                "Software engineer,  Software engineer",
                "Quantity surveyor,  Quantity surveyor",
                // Case, whitespace and punctuation variations
                "'  java ENGINEER  ', Software engineer",
                "SOFTWARE-ENGINEER,  Software engineer",
                "'Accountant (Chief)', Accountant",
                // Extra words and different word order
                "Senior Software Engineer, Software engineer",
                "Engineer Software,  Software engineer",
                "Lead Solutions Architect, Architect",
                "Senior Quantity Surveyor, Quantity surveyor",
                // Typos
                "Acountant,          Accountant",
                "Architekt,          Architect",
                "Quantity surveyer,  Quantity surveyor",
        })
        void returnsBestMatchingTitle(String input, String expected) {
            assertEquals(expected, normaliser.normalise(input));
        }

        @Test
        void exactMatchScoresOne() {
            MatchResult result = normaliser.findBestMatch("Accountant").orElseThrow();

            assertEquals("Accountant", result.title());
            assertEquals(1.0, result.score(), 1e-9);
        }

        @Test
        void partialMatchScoresBetweenZeroAndOne() {
            MatchResult result = normaliser.findBestMatch("Chief Accountant").orElseThrow();

            assertTrue(result.score() > normaliser.getMinimumScore() && result.score() < 1.0,
                    "unexpected score " + result.score());
        }

        @ParameterizedTest
        @ValueSource(strings = {"Zzz", "Nurse", "Chef", "Doctor", "Teacher", "12345", "###"})
        void unrelatedInputHasNoMatch(String input) {
            assertEquals(Optional.empty(), normaliser.findBestMatch(input));
            NoMatchFoundException exception =
                    assertThrows(NoMatchFoundException.class, () -> normaliser.normalise(input));
            assertEquals(input, exception.getInput());
        }

        @ParameterizedTest
        @NullAndEmptySource
        @ValueSource(strings = {"   ", "\t\n"})
        void rejectsNullOrBlankInput(String input) {
            assertThrows(IllegalArgumentException.class, () -> normaliser.normalise(input));
            assertThrows(IllegalArgumentException.class, () -> normaliser.findBestMatch(input));
        }
    }

    @Nested
    @DisplayName("custom configuration")
    class CustomConfiguration {

        @Test
        void usesCustomTitles() {
            Normaliser custom = new Normaliser(List.of("Nurse", "Doctor"));

            assertEquals("Nurse", custom.normalise("Senior Staff Nurse"));
            assertEquals("Doctor", custom.normalise("Junior doctor"));
        }

        @Test
        void usesInjectedScorer() {
            SimilarityScorer prefersLongestTitle = (input, candidate) -> candidate.length() / 100.0;
            Normaliser custom = new Normaliser(List.of("Short", "Much longer title"), prefersLongestTitle, 0.0);

            assertEquals("Much longer title", custom.normalise("anything"));
        }

        @Test
        void tiesAreBrokenByListOrder() {
            SimilarityScorer constant = (input, candidate) -> 0.5;

            assertEquals("First", new Normaliser(List.of("First", "Second"), constant, 0.0).normalise("x"));
            assertEquals("Second", new Normaliser(List.of("Second", "First"), constant, 0.0).normalise("x"));
        }

        @Test
        void scoreEqualToMinimumIsAccepted() {
            SimilarityScorer constant = (input, candidate) -> 0.4;

            assertEquals("Title", new Normaliser(List.of("Title"), constant, 0.4).normalise("x"));
            assertThrows(NoMatchFoundException.class,
                    () -> new Normaliser(List.of("Title"), constant, 0.41).normalise("x"));
        }

        @ParameterizedTest
        @ValueSource(doubles = {-0.01, 1.01, Double.NaN})
        void rejectsScorerOutputOutsideRange(double badScore) {
            Normaliser custom = new Normaliser(List.of("Title"), (input, candidate) -> badScore, 0.0);

            assertThrows(IllegalStateException.class, () -> custom.normalise("x"));
        }

        @Test
        void titlesAreDefensivelyCopiedAndUnmodifiable() {
            List<String> titles = new ArrayList<>(List.of("Nurse"));
            Normaliser custom = new Normaliser(titles);
            titles.add("Doctor");

            assertEquals(List.of("Nurse"), custom.getNormalisedTitles());
            // The mutation is the point: it proves the returned list is unmodifiable.
            //noinspection DataFlowIssue
            assertThrows(UnsupportedOperationException.class, () -> custom.getNormalisedTitles().add("Doctor"));
        }
    }

    @Nested
    @DisplayName("constructor validation")
    class ConstructorValidation {

        @Test
        void rejectsNullTitles() {
            assertThrows(NullPointerException.class, () -> new Normaliser(null));
        }

        @Test
        void rejectsEmptyTitles() {
            assertThrows(IllegalArgumentException.class, () -> new Normaliser(List.of()));
        }

        @Test
        void rejectsNullTitleEntry() {
            assertThrows(IllegalArgumentException.class, () -> new Normaliser(Arrays.asList("Nurse", null)));
        }

        @Test
        void rejectsBlankTitleEntry() {
            assertThrows(IllegalArgumentException.class, () -> new Normaliser(List.of("Nurse", "  ")));
        }

        @Test
        void rejectsDuplicateTitlesIgnoringCase() {
            assertThrows(IllegalArgumentException.class, () -> new Normaliser(List.of("Nurse", " NURSE ")));
        }

        @Test
        void rejectsNullScorer() {
            assertThrows(NullPointerException.class, () -> new Normaliser(List.of("Nurse"), null, 0.5));
        }

        @ParameterizedTest
        @ValueSource(doubles = {-0.1, 1.1, Double.NaN})
        void rejectsMinimumScoreOutsideRange(double minimumScore) {
            assertThrows(IllegalArgumentException.class,
                    () -> new Normaliser(List.of("Nurse"), (a, b) -> 1.0, minimumScore));
        }
    }
}
