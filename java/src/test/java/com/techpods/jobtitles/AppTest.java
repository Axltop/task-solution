package com.techpods.jobtitles;

import org.junit.jupiter.api.Test;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;

class AppTest {

    @Test
    void describesAMatchWithItsScore() {
        assertEquals("Java engineer -> Software engineer (q = 0.50)",
                App.describe("Java engineer", Optional.of(new MatchResult("Software engineer", 0.5))));
    }

    @Test
    void describesAMissingMatchInsteadOfFailing() {
        assertEquals("Nurse -> no match", App.describe("Nurse", Optional.empty()));
    }
}
