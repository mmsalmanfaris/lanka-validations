# Instructions for AI coding agents

`lanka-validations` is a zero-dependency TypeScript library that validates Sri Lankan identifiers and data. Read [CONTRIBUTING.md](CONTRIBUTING.md) before changing code; it is the source of truth when this file and it disagree.

## Commits

Use the format in [CONTRIBUTING.md#commit-messages](CONTRIBUTING.md#commit-messages): `<type>: <emoji> <description>`, with exactly one gitmoji after the conventional type, for example `fix: 🐛 reject letters in postal codes`. Keep the type first. Mark breaking changes with `type!:` and a `BREAKING CHANGE:` footer. Use emojis only in commit subjects, never in docs or code comments.

## Branches

Base work on `development` and open pull requests against it. Do not commit to `main`.

## Before committing

Run the checks CI runs:

```bash
npm run typecheck && npm run lint && npm run format:check && npm run docs
npm run test:coverage && npm run lint:package && npm run size
```

## Rules

- No runtime dependencies.
- Validators take `unknown` input and must never throw on it; the property tests in `tests/properties.test.ts` enforce this.
- Every exported function, type, and constant needs a TSDoc comment (`npm run docs` fails otherwise).
- Reference-table changes need an official source (DRP, TRCSL, CBSL, DMT, Sri Lanka Post, IRD, DCS) recorded in `src/reference-data/metadata.ts`.
- Behaviour changes go in `CHANGELOG.md` under the unreleased version.
- Never use real NIC, passport, phone, or bank numbers in tests, examples, or issues.
- Do not commit `docs/` (private notes) or generated output (`dist/`, `coverage/`, `api-docs/`).
