package com.techpods.jobtitles.similarity;

import java.util.Objects;

/**
 * Scores two single tokens using normalised Levenshtein (edit) distance:
 * {@code q = 1 - distance / max(length)}. Tolerates small typos such as "acountant".
 */
public final class LevenshteinTokenSimilarity implements SimilarityScorer {

    @Override
    public double score(String a, String b) {
        Objects.requireNonNull(a, "a must not be null");
        Objects.requireNonNull(b, "b must not be null");

        if (a.equals(b)) {
            return 1.0;
        }
        int maxLength = Math.max(a.length(), b.length());
        if (a.isEmpty() || b.isEmpty()) {
            return 0.0;
        }
        return 1.0 - (double) distance(a, b) / maxLength;
    }

    /** Classic dynamic-programming edit distance using two rolling rows. */
    static int distance(String a, String b) {
        int[] previous = new int[b.length() + 1];
        int[] current = new int[b.length() + 1];
        for (int j = 0; j <= b.length(); j++) {
            previous[j] = j;
        }
        for (int i = 1; i <= a.length(); i++) {
            current[0] = i;
            for (int j = 1; j <= b.length(); j++) {
                int substitutionCost = a.charAt(i - 1) == b.charAt(j - 1) ? 0 : 1;
                current[j] = Math.min(
                        Math.min(current[j - 1] + 1, previous[j] + 1),
                        previous[j - 1] + substitutionCost);
            }
            int[] swap = previous;
            previous = current;
            current = swap;
        }
        return previous[b.length()];
    }
}
