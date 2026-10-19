# Software Engineering Technical Assessment

Two independent projects, one per part of the assessment. They share no code or build, so run each one from its own folder. Each folder's README holds the design rationale and testing evidence.

| Part | Folder | What it is | Stack |
|---|---|---|---|
| 1. Object Oriented Programming | [`java/`](java/README.md) | **Job Title Normaliser**: maps a free-text job title to the closest title from a list of normalised titles | Java 17+, Maven (wrapper included), JUnit 5 |
| 2. UI | [`react/`](react/README.md) | **Product Rating widget**: the rating card design as a set of React components | React 18, Vite, styled-components, PropTypes, Jest + Testing Library |

## Quick start

**Part 1: Java** (needs JDK 17 or newer)

```bash
cd java
./mvnw clean test      # build and run all unit tests (mvnw.cmd on Windows)
./mvnw -q exec:java    # interactive console: type job titles, 'exit' to quit
```

```java
Normaliser n = new Normaliser();
n.normalise("Java engineer");    // "Software engineer"
n.normalise("C# engineer");      // "Software engineer"
n.normalise("Chief Accountant"); // "Accountant"
```

**Part 2: React** (needs Node 20, see `react/.nvmrc`)

```bash
cd react
npm install
npm run dev            # http://localhost:5173
npm test               # Jest + React Testing Library
npm run test:coverage  # fails below 90% coverage
npm run lint           # ESLint, including react/prop-types and jsx-a11y
```

## Where to look

- **Part 1:** the matching pipeline, the per-title score table, defensive-coding behaviour and test evidence are in [`java/README.md`](java/README.md).
- **Part 2:** the component tree, responsive behaviour, accessibility decisions and a note on how the 4.6 score is derived are in [`react/README.md`](react/README.md).

Both projects import into an IDE as they are. Open `java/pom.xml` as a Maven project, and open `react/` as a Node project.
