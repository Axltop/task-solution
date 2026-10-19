package com.techpods.jobtitles.similarity;

/**
 * Strategy for scoring how similar two strings are.
 *
 * <p>Contract: implementations must return a quality score {@code q} where
 * {@code 0.0 <= q <= 1.0}; {@code 1.0} means identical, {@code 0.0} means nothing in common.
 * Arguments must not be {@code null}.
 */
@FunctionalInterface
public interface SimilarityScorer {

    double score(String a, String b);
}
