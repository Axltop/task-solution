package com.techpods.jobtitles.text;

import java.util.Arrays;
import java.util.List;
import java.util.Locale;
import java.util.Objects;
import java.util.regex.Pattern;

/**
 * Splits a job title into lower-case word tokens.
 *
 * <p>Characters that carry meaning in technology titles ({@code #}, {@code +}, {@code .}) are kept
 * inside tokens, so "C#", "C++" and ".NET" survive intact. Trailing dots ("Sr.") are dropped.
 */
public final class Tokenizer {

    private static final Pattern SEPARATORS = Pattern.compile("[\\s,/\\\\\\-_()\\[\\]|&;:]+");
    private static final Pattern DISALLOWED = Pattern.compile("[^\\p{L}\\p{N}#+.]");
    private static final Pattern TRAILING_DOTS = Pattern.compile("\\.+$");

    public List<String> tokenize(String text) {
        Objects.requireNonNull(text, "text must not be null");

        return Arrays.stream(SEPARATORS.split(text.toLowerCase(Locale.ROOT).trim()))
                .map(token -> DISALLOWED.matcher(token).replaceAll(""))
                .map(token -> TRAILING_DOTS.matcher(token).replaceAll(""))
                .filter(token -> !token.isEmpty())
                .toList();
    }
}
