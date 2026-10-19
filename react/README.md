# Product Rating widget

A React version of a "Product Rating" card: a headline label, a star score, the provider badge, and a breakdown of reviews by star level.

## Getting started

Requires Node 20+ (see `.nvmrc`).

```bash
npm install
npm run dev            # http://localhost:5173
npm test               # Jest + Testing Library
npm run test:coverage  # with a 90% coverage threshold
npm run lint           # ESLint incl. react/prop-types and jsx-a11y
npm run build
```

## Stack

- React 18 + Vite
- styled-components with a shared `ThemeProvider` theme (`src/theme.js`)
- PropTypes on every component
- Jest, React Testing Library, `jest-styled-components` and `jest-axe`
- Poppins from Google Fonts (`index.html`)

## Components

```
ProductRating            container: <section> card, works out score and label
├── RatingSummary        "EXCELLENT" heading, StarRating, "4.6 OUT OF 5"
│   └── StarRating       row of Star tiles; partial fill for fractional scores
│       └── Star         one yellow tile with a white star, fill 0–1
├── ProviderBadge        "Product Rating" + provider logo (src/assets/logo.png)
└── RatingBreakdown      <ul> of RatingBar, ordered from 5 stars down to 1
    └── RatingBar        "5 ★", proportional bar, review count
StarIcon                 shared decorative star: src/assets/star.svg as a CSS mask, coloured via `color`
```

`src/utils/rating.js` holds pure helpers: total, weighted average, label thresholds and percentage.

```jsx
<ProductRating
  distribution={{ 5: 952, 4: 171, 3: 55, 2: 14, 1: 40 }}
  average={4.6}          // optional; computed from distribution when omitted
  maxRating={5}          // optional
  caption="Product Rating"
  logoSrc={logoUrl}     // optional; defaults to src/assets/logo.png
/>
```

## Responsive behaviour

- The card is `width: min(100%, 420px)`, so it fills small screens and stops growing at the design width.
- Padding, gaps and font sizes use `clamp()`.
- Star tiles are flex items with `aspect-ratio: 1`, so they shrink to fit.
- Each breakdown row is a CSS grid (`auto 1fr 4ch`). The star label has a fixed-width digit and the count column is a fixed 4 characters, so every row's bar starts and ends at the same place and only the bar changes width.

## Accessibility

- The card is a `<section>` labelled by its heading, which gives it a named region.
- The label is real text ("Excellent"). It is shown in uppercase with CSS, so screen readers don't spell it out letter by letter.
- The star row is a single `role="img"` with the name "Rated 4.6 out of 5 stars". The individual tiles are decorative.
- Each bar is a `role="progressbar"`. It has a name ("5 stars"), `aria-valuenow` set to the percentage, and an `aria-valuetext` such as "952 reviews (77%)". The visible "5 ★" and count repeat that information, so they are `aria-hidden` to avoid it being read twice.
- Decorative graphics (the star icons and the logo) are `aria-hidden`.
- The provider logo is decorative (`alt=""` and `aria-hidden`), so the badge is announced as "Product Rating" only.
- `jest-axe` runs against the full widget, and `eslint-plugin-jsx-a11y` runs in lint.

## Note on the score

The design's counts (952 / 171 / 55 / 14 / 40) total 1,232 reviews and give a weighted average of 5,677 / 1,232 = **4.608**, which rounds to the **4.6** shown in the design. The demo therefore passes only the `distribution` and lets `ProductRating` compute the score. The optional `average` prop is there for callers whose headline score comes from somewhere other than the breakdown (for example a provider that weights recent reviews); when it is given, it wins.
