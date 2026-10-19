package com.techpods.jobtitles;

import java.util.Locale;
import java.util.Optional;
import java.util.Scanner;

/**
 * Reads job titles from standard input, one per line, and prints the normalized title for each.
 * Type {@code exit} (or send end-of-input) to close the program.
 */
public final class App {

    public static final String EXIT_COMMAND = "exit";

    private App() {
    }

    public static void main(String[] args) {
        Normaliser normaliser = new Normaliser();
        runConsole(normaliser);
    }

    private static void runConsole(Normaliser normaliser) {
        System.out.println("Enter a job title to normalise, or '" + EXIT_COMMAND + "' to quit.");

        try (Scanner scanner = new Scanner(System.in)) {
            while (true) {
                System.out.print("> ");
                if (!scanner.hasNextLine()) {
                    break;
                }
                String input = scanner.nextLine().trim();
                if (input.equalsIgnoreCase(EXIT_COMMAND)) {
                    break;
                }
                if (input.isEmpty()) {
                    continue;
                }
                System.out.println(describe(input, normaliser.findBestMatch(input)));
            }
        }
        System.out.println("Bye.");
    }

    /** Formats one console line, e.g. {@code "Java engineer -> Software engineer (q = 0.50)"}. */
    static String describe(String input, Optional<MatchResult> match) {
        return match
                .map(result -> String.format(Locale.ROOT, "%s -> %s (q = %.2f)", input, result.title(), result.score()))
                .orElse(input + " -> no match");
    }
}
