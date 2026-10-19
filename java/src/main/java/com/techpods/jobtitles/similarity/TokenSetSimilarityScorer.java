package com.techpods.jobtitles.similarity;

import com.techpods.jobtitles.text.Tokenizer;

import java.util.List;
import java.util.Objects;

/**
 * Scores two multi-word titles by comparing their tokens.
 *
 * <p>Each token in one title is paired with its most similar token in the other title (using the
 * token-level scorer). The average best score is computed in both directions and the two averages
 * are themselves averaged, giving a symmetric score in {@code [0.0, 1.0]}:
 *
 * <pre>
 *   q = ( avg_{t in A} max_{u in B} s(t, u) + avg_{u in B} max_{t in A} s(t, u) ) / 2
 * </pre>
 *
 * <p>Word order does not matter, and extra words ("Chief", "Senior") lower the score
 * without preventing a match.
 *
 * <p>Token pairs scoring below {@code minimumTokenScore} count as {@code 0.0}. This stops letters
 * that unrelated words happen to share (e.g. "chef" vs "architect") from adding up to a false
 * match, while typos ("acountant" vs "accountant", 0.9) still count.
 */
public final class TokenSetSimilarityScorer implements SimilarityScorer {

    private final Tokenizer tokenizer;
    private final SimilarityScorer tokenScorer;
    private final double minimumTokenScore;

    public static final double DEFAULT_MINIMUM_TOKEN_SCORE = 0.5;

    public TokenSetSimilarityScorer() {
        this(new Tokenizer(), new LevenshteinTokenSimilarity(), DEFAULT_MINIMUM_TOKEN_SCORE);
    }

    public TokenSetSimilarityScorer(Tokenizer tokenizer, SimilarityScorer tokenScorer, double minimumTokenScore) {
        this.tokenizer = Objects.requireNonNull(tokenizer, "tokenizer must not be null");
        this.tokenScorer = Objects.requireNonNull(tokenScorer, "tokenScorer must not be null");
        if (Double.isNaN(minimumTokenScore) || minimumTokenScore < 0.0 || minimumTokenScore > 1.0) {
            throw new IllegalArgumentException(
                    "minimumTokenScore must be within [0.0, 1.0] but was " + minimumTokenScore);
        }
        this.minimumTokenScore = minimumTokenScore;
    }

    @Override
    public double score(String a, String b) {
        Objects.requireNonNull(a, "a must not be null");
        Objects.requireNonNull(b, "b must not be null");

        List<String> tokensA = tokenizer.tokenize(a);
        List<String> tokensB = tokenizer.tokenize(b);
        if (tokensA.isEmpty() || tokensB.isEmpty()) {
            return 0.0;
        }
        return (averageBestMatch(tokensA, tokensB) + averageBestMatch(tokensB, tokensA)) / 2.0;
    }

    private double averageBestMatch(List<String> from, List<String> to) {
        double total = 0.0;
        for (String source : from) {
            double best = 0.0;
            for (String target : to) {
                best = Math.max(best, tokenScorer.score(source, target));
            }
            total += best >= minimumTokenScore ? best : 0.0;
        }
        return total / from.size();
    }
}
