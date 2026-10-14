# Contributing to Lanka Validations

Thank you for your interest in contributing to `lanka-validations`. We welcome bug reports, feature suggestions, documentation enhancements, and code contributions from the community.

Please take a few moments to review these guidelines before submitting a contribution.

---

## Code of Conduct

All contributors and participants are expected to maintain a welcoming, respectful, and inclusive environment.

---

## Branching Strategy

Our primary branches are organized as follows:

- `main`: Production-ready releases only.
- `development`: Active integration and staging branch.

All feature branches, bug fixes, and pull requests must be based on and targeted to the **`development`** branch.

### Creating a Branch

```bash
git checkout development
git pull origin development
git checkout -b feat/your-feature-name
```

Use semantic prefixes for branch names:
- `feat/` for new features or validators
- `fix/` for bug fixes
- `docs/` for documentation updates
- `test/` for adding or updating test suites
- `refactor/` for code restructuring without changing behavior

---

## Development Setup

### Prerequisites

- Node.js 20 or higher
- npm 9 or higher (or pnpm / yarn / bun)
- Git

### Installation

1. Fork the repository on GitHub.
2. Clone your fork locally:
   ```bash
   git clone https://github.com/<your-username>/lanka-validations.git
   cd lanka-validations
   ```
3. Install dependencies:
   ```bash
   npm install
   ```

### Available Scripts

- `npm test`: Runs the test suite once with Vitest.
- `npm run test:watch`: Runs tests in interactive watch mode.
- `npm run test:coverage`: Runs tests with coverage and fails below the thresholds in `vitest.config.mts`.
- `npm run typecheck`: Type-checks the source with `tsc --noEmit`.
- `npm run build`: Bundles the library and its CommonJS (`.d.ts`) and ESM (`.d.mts`) declarations with tsup.
- `npm run lint:package`: Builds, then checks the package with publint and arethetypeswrong.
- `npm run check:package`: Installs the packed tarball into a fresh project and imports every entry point.
- `npm run prepublishOnly`: Runs all of the above before a release.

---

## Design Principles and Standards

1. **Zero Runtime Dependencies**: The core library must remain completely dependency-free. Do not add external runtime packages.
2. **TypeScript Strictness**: Code must pass strict TypeScript compilation without type assertions (`any`, `@ts-ignore`).
3. **Data Accuracy**: Every validation rule must align with official Sri Lankan standards (DRP, TRCSL, CBSL, DMT, IRD).
4. **Comprehensive Unit Tests**: Every validator, parser, and converter must include thorough unit tests covering both valid scenarios and edge-case invalid inputs.
5. **Emojis Only in Commit Subjects**: Keep documentation and code comments free of emojis. Commit subjects carry exactly one emoji for their type; see [Commit Messages](#commit-messages).

---

## Pull Request Guidelines

1. Ensure the same checks CI runs pass locally:
   ```bash
   npm run typecheck && npm run test:coverage && npm run lint:package
   ```
2. Commit your changes following [Commit Messages](#commit-messages).
3. Push your branch to your fork:
   ```bash
   git push origin feat/your-feature-name
   ```
4. Open a Pull Request targeting the **`development`** branch on GitHub.
5. Provide a clear description of the changes made, the rationale, and any relevant issue references.

---

## Commit Messages

Commits follow [Conventional Commits](https://www.conventionalcommits.org/) with one [gitmoji](https://gitmoji.dev/) after the type:

```
<type>: <emoji> <description>

<optional body: what changed and why>
```

The type stays first so changelog and release tooling can still parse it. Use the emoji that matches the type:

| Type | Emoji | Use for |
| --- | --- | --- |
| `feat` | ✨ | A new validator, option, or public API |
| `fix` | 🐛 | A bug fix |
| `fix` | 🔒️ | A security fix (input bypass, data exposure) |
| `perf` | ⚡️ | A performance improvement |
| `refactor` | ♻️ | A code change that neither fixes a bug nor adds a feature |
| `test` | ✅ | Adding or updating tests |
| `docs` | 📝 | Documentation only |
| `style` | 🎨 | Formatting only, no behavior change |
| `build` | 📦️ | Build output, packaging, or dependencies |
| `ci` | 👷 | CI workflows |
| `chore` | 🔧 | Tooling and configuration |
| `revert` | ⏪️ | Reverting an earlier commit |

Add `!` after the type for breaking changes and explain them in a `BREAKING CHANGE:` footer:

```
fix!: 🐛 stop accepting NIC numbers as TINs

BREAKING CHANGE: isValidTIN('921234567V') now returns false.
```

Examples:

- `feat: ✨ add national driving license category G1 validation`
- `fix: 🐛 resolve leap year day calculation for non-leap years`
- `docs: 📝 update phone number examples in README`

These rules apply to every commit, including commits written by AI coding assistants.

---

## Contact and Questions

For questions or security concerns, reach out to the project maintainer:

- Author: M.M. Salman Faris
- Email: [mmsalmanfaris@outlook.com](mailto:mmsalmanfaris@outlook.com)
- GitHub: [@mmsalmanfaris](https://github.com/mmsalmanfaris)

