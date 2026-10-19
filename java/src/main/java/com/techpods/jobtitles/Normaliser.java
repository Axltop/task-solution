package com.techpods.jobtitles;

import com.techpods.jobtitles.exception.NoMatchFoundException;
import com.techpods.jobtitles.similarity.SimilarityScorer;
import com.techpods.jobtitles.similarity.TokenSetSimilarityScorer;

import java.util.Collection;
import java.util.HashSet;
import java.util.List;
import java.util.Locale;
import java.util.Objects;
import java.util.Optional;
import java.util.Set;

/**
 * Maps a free-text job title to the most similar title from a fixed list of normalized titles.
 *
 * <p>Every normalized title gets a quality score {@code q} in {@code [0.0, 1.0]} from a
 * {@link SimilarityScorer}. The title with the highest score wins. If two titles have the same
 * score, the one listed first wins. If the best score is below {@code minimumScore}, there is no
 * match.
 *
 * <p>Instances are immutable and thread-safe, provided the injected scorer is.
 */
public class Normaliser {

    public static final List<String> DEFAULT_TITLES =
            List.of("Architect", "Software engineer", "Quantity surveyor", "Accountant");

    public static final double DEFAULT_MINIMUM_SCORE = 0.3;

    private final List<String> normalisedTitles;
    private final SimilarityScorer scorer;
    private final double minimumScore;

    /** Uses the default titles from the specification and the default token-based scorer. */
    public Normaliser() {
        this(DEFAULT_TITLES);
    }

    public Normaliser(Collection<String> normalisedTitles) {
        this(normalisedTitles, new TokenSetSimilarityScorer(), DEFAULT_MINIMUM_SCORE);
    }

    public Normaliser(Collection<String> normalisedTitles, SimilarityScorer scorer, double minimumScore) {
        this.normalisedTitles = validateTitles(normalisedTitles);
        this.scorer = Objects.requireNonNull(scorer, "scorer must not be null");
        if (Double.isNaN(minimumScore) || minimumScore < 0.0 || minimumScore > 1.0) {
            throw new IllegalArgumentException("minimumScore must be within [0.0, 1.0] but was " + minimumScore);
        }
        this.minimumScore = minimumScore;
    }

    /**
     * Returns the normalized title that best matches {@code jobTitle}.
     *
     * @throws IllegalArgumentException if {@code jobTitle} is null or blank
     * @throws NoMatchFoundException    if no title reaches the minimum score
     */
    public String normalise(String jobTitle) {
        return findBestMatch(jobTitle)
                .map(MatchResult::title)
                .orElseThrow(() -> new NoMatchFoundException(jobTitle, minimumScore));
    }

    /**
     * Returns the best match with its score, or an empty {@link Optional} if no title reaches the
     * minimum score.
     *
     * @throws IllegalArgumentException if {@code jobTitle} is null or blank
     */
    public Optional<MatchResult> findBestMatch(String jobTitle) {
        if (jobTitle == null || jobTitle.isBlank()) {
            throw new IllegalArgumentException("Job Title must not be null or blank");
        }

        // The constructor guarantees at least one title, so the first one seeds the best match.
        String first = normalisedTitles.get(0);
        MatchResult best = new MatchResult(first, checkedScore(jobTitle, first));
        for (String candidate : normalisedTitles.subList(1, normalisedTitles.size())) {
            double score = checkedScore(jobTitle, candidate);
            if (score > best.score()) {
                best = new MatchResult(candidate, score);
            }
        }
        return best.score() >= minimumScore ? Optional.of(best) : Optional.empty();
    }

    public List<String> getNormalisedTitles() {
        return normalisedTitles;
    }

    public double getMinimumScore() {
        return minimumScore;
    }

    private double checkedScore(String input, String candidate) {
        double score = scorer.score(input, candidate);
        if (Double.isNaN(score) || score < 0.0 || score > 1.0) {
            throw new IllegalStateException(
                    "Scorer " + scorer.getClass().getName() + " returned " + score
                            + " for '" + input + "' vs '" + candidate + "'; expected a value within [0.0, 1.0]");
        }
        return score;
    }

    private static List<String> validateTitles(Collection<String> titles) {
        Objects.requireNonNull(titles, "Normalized Titles must not be null");
        if (titles.isEmpty()) {
            throw new IllegalArgumentException("Normalized Titles must not be empty");
        }
        Set<String> seen = new HashSet<>();
        for (String title : titles) {
            if (title == null || title.isBlank()) {
                throw new IllegalArgumentException("Normalized Titles must not contain null or blank entries");
            }
            if (!seen.add(title.trim().toLowerCase(Locale.ROOT))) {
                throw new IllegalArgumentException("Normalized Titles contains a duplicate: '" + title + "'");
            }
        }
        return List.copyOf(titles);
    }
}
