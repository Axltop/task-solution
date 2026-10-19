# Job Title Normaliser

Maps a free-text job title to the closest title from a list of normalised (ideal) job titles.

```java
Normaliser n = new Normaliser();
n.normalise("Java engineer");    // "Software engineer"
n.normalise("C# engineer");      // "Software engineer"
n.normalise("Chief Accountant"); // "Accountant"
```

## Requirements

- JDK 17 or newer. The compiler targets Java 17; the project was tested on JDK 25.
- Nothing else. The included Maven Wrapper (`mvnw`) downloads Maven 3.9.9 on first use.

## Build, test, run

```bash
./mvnw clean test       # compile and run all unit tests
./mvnw -q exec:java     # interactive prompt (App.java): type job titles, 'exit' to quit
```

On Windows, use `mvnw.cmd`.

**IDE:** open the `java` folder (or `pom.xml`) in IntelliJ IDEA, Eclipse or VS Code. It imports as a standard Maven project. Run `App` or any test class directly.

## How matching works

For every normalised title, the input gets a quality score `q`, where `0.0 <= q <= 1.0`. The title with the highest score wins.

1. **Tokenise** (`text.Tokenizer`): lower-case the text and split it on whitespace and separators (`- / , ( )` …). `#`, `+` and `.` are kept, so `C#`, `C++` and `.NET` stay whole.
2. **Token similarity** (`similarity.LevenshteinTokenSimilarity`): `1 - editDistance / longerLength`. An exact match scores `1.0`, and a one-letter typo in a 10-letter word scores `0.9`.
3. **Title similarity** (`similarity.TokenSetSimilarityScorer`): every token is paired with its best match in the other title. The average is taken in both directions, and the two averages are themselves averaged:

   `q = ( avg_{a in input} best(a) + avg_{c in candidate} best(c) ) / 2`

   Token pairs scoring below `0.5` count as `0`. This stops words that merely share letters ("chef" vs "architect", 0.33) from adding up to a false match.
4. **Select** (`Normaliser`): the highest `q` wins, and ties go to the title listed first. If the best `q` is below `minimumScore` (default `0.3`), `normalise` throws `NoMatchFoundException`, and `findBestMatch` returns `Optional.empty()`.

Scores for the specification inputs and a few extras:

| Input                    | Architect | Software engineer | Quantity surveyor | Accountant | Result |
|--------------------------|-----------|-------------------|-------------------|------------|--------|
| Java engineer            | 0.00 | **0.50** | 0.00 | 0.00 | Software engineer |
| C# engineer              | 0.00 | **0.50** | 0.00 | 0.00 | Software engineer |
| Accountant               | 0.00 | 0.00 | 0.00 | **1.00** | Accountant |
| Chief Accountant         | 0.00 | 0.00 | 0.00 | **0.75** | Accountant |
| Senior Software Engineer | 0.00 | **0.83** | 0.00 | 0.00 | Software engineer |
| Lead Solutions Architect | **0.67** | 0.00 | 0.00 | 0.00 | Architect |
| Acountant (typo)         | 0.00 | 0.00 | 0.00 | **0.90** | Accountant |
| Nurse                    | 0.00 | 0.00 | 0.00 | 0.00 | no match |

## Project structure

```
src/main/java/com/techpods/jobtitles/
├── App.java                     interactive console: reads titles until 'exit'
├── Normaliser.java              public façade: normalise() / findBestMatch()
├── MatchResult.java             immutable (title, score) record, validates 0 <= score <= 1
├── exception/NoMatchFoundException.java
├── text/Tokenizer.java
└── similarity/
    ├── SimilarityScorer.java              strategy interface: score(a, b) -> [0, 1]
    ├── LevenshteinTokenSimilarity.java    word-level scorer
    └── TokenSetSimilarityScorer.java      title-level scorer, composes a word-level scorer
src/test/java/...                          one test class per production class
```

## Design notes

- **Strategy pattern and dependency inversion:** `Normaliser` depends on the `SimilarityScorer` interface, not on a concrete algorithm. `TokenSetSimilarityScorer` also depends on a `SimilarityScorer` for comparing single words. A different algorithm (Jaro-Winkler, synonyms, embeddings) can be plugged in without touching `Normaliser`.
- **Single responsibility:** tokenising, word scoring, title scoring and best-match selection each live in their own class.
- **Immutability and thread safety:** fields are `final`, the titles are copied with `List.copyOf` (an unmodifiable copy), and `MatchResult` is a record.
- **Convenience and flexibility:** `new Normaliser()` works exactly as in the specification. Overloaded constructors accept custom titles, a custom scorer and a custom threshold.

## Defensive coding

| Situation | Behaviour |
|---|---|
| `normalise(null)`, `normalise("")`, `normalise("   ")` | `IllegalArgumentException` |
| Null, empty, null-entry, blank-entry or duplicate (case-insensitive) title list | rejected in the constructor |
| `minimumScore` / `minimumTokenScore` outside `[0, 1]` or NaN | `IllegalArgumentException` |
| Injected scorer returns a value outside `[0, 1]` or NaN | `IllegalStateException`, naming the scorer and the inputs |
| `MatchResult` built with an invalid score | `IllegalArgumentException` |
| Caller changes the list they passed in after construction | no effect (defensive copy) |
| No title is similar enough | `NoMatchFoundException`, never a silent wrong answer |

## Test evidence

`./mvnw clean test` runs 89 JUnit 5 tests, all passing:

```
Tests run: 30  -- NormaliserTest$DefaultTitles        (spec examples, case/whitespace, typos, no-match, blank input)
Tests run:  8  -- NormaliserTest$CustomConfiguration  (custom titles, injected scorer, tie-break, threshold edge, bad scorer)
Tests run:  9  -- NormaliserTest$ConstructorValidation
Tests run: 17  -- TokenSetSimilarityScorerTest        (identity, symmetry, bounds, word order, noise cut-off)
Tests run:  9  -- LevenshteinTokenSimilarityTest
Tests run:  6  -- TokenizerTest
Tests run:  8  -- MatchResultTest
Tests run:  2  -- AppTest                            (console output for a match and for no match)
Tests run: 89, Failures: 0, Errors: 0, Skipped: 0
BUILD SUCCESS
```

`./mvnw -q exec:java` session:

```
Enter a job title to normalise, or 'exit' to quit.
> Java engineer
Java engineer -> Software engineer (q = 0.50)
> C# engineer
C# engineer -> Software engineer (q = 0.50)
> Chief Accountant
Chief Accountant -> Accountant (q = 0.75)
> Nurse
Nurse -> no match
> exit
Bye.
```

Full per-test reports are written to `target/surefire-reports/`.

## Assumptions and limitations

- Matching is lexical. "Java engineer" matches "Software engineer" through the shared word *engineer*, not because the code knows Java is software. Inputs with no lexical overlap, such as "Developer", produce no match rather than a guess. A synonym map or embedding-based `SimilarityScorer` would be the natural next step, and it fits behind the existing interface.
- When nothing matches, the result is an exception, not `null` or the original input. This makes the failure explicit, and callers who prefer not to catch exceptions can use `findBestMatch`.
