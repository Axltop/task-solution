package com.techpods.jobtitles.text;

import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

class TokenizerTest {

    private final Tokenizer tokenizer = new Tokenizer();

    @Test
    void lowerCasesAndSplitsOnWhitespace() {
        assertEquals(List.of("software", "engineer"), tokenizer.tokenize("  Software   ENGINEER "));
    }

    @Test
    void splitsOnCommonSeparators() {
        assertEquals(List.of("dev", "ops", "engineer", "lead"), tokenizer.tokenize("Dev-Ops/Engineer, (Lead)"));
    }

    @Test
    void keepsTechnologySymbols() {
        assertEquals(List.of("c#", "c++", ".net", "node.js"), tokenizer.tokenize("C# C++ .NET Node.js"));
    }

    @Test
    void dropsTrailingDotsAndStrayPunctuation() {
        assertEquals(List.of("sr", "accountant"), tokenizer.tokenize("Sr. Accountant!"));
    }

    @Test
    void returnsEmptyListForBlankOrPunctuationOnlyText() {
        assertEquals(List.of(), tokenizer.tokenize("   "));
        assertEquals(List.of(), tokenizer.tokenize("-- ,, !!"));
    }

    @Test
    void rejectsNull() {
        assertThrows(NullPointerException.class, () -> tokenizer.tokenize(null));
    }
}
