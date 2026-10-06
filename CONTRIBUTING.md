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

- Node.js 18 or higher
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
- `npm run test:coverage`: Generates test coverage reports.
- `npm run build`: Bundles the library with tsup and emits TypeScript declarations.
- `npm run prepublishOnly`: Runs build and test validation before release.

---

## Design Principles and Standards

1. **Zero Runtime Dependencies**: The core library must remain completely dependency-free. Do not add external runtime packages.
2. **TypeScript Strictness**: Code must pass strict TypeScript compilation without type assertions (`any`, `@ts-ignore`).
3. **Data Accuracy**: Every validation rule must align with official Sri Lankan standards (DRP, TRCSL, CBSL, DMT, IRD).
4. **Comprehensive Unit Tests**: Every validator, parser, and converter must include thorough unit tests covering both valid scenarios and edge-case invalid inputs.
5. **No Emojis**: Keep documentation, code comments, and commit messages clean, professional, and free of emojis.

---

## Pull Request Guidelines

1. Ensure all tests pass and the build succeeds:
   ```bash
   npm run build && npm run test
   ```
2. Commit your changes using conventional commit messages:
   - `feat: add national driving license category G1 validation`
   - `fix: resolve leap year day calculation for non-leap years`
   - `docs: update phone number examples in README`
3. Push your branch to your fork:
   ```bash
   git push origin feat/your-feature-name
   ```
4. Open a Pull Request targeting the **`development`** branch on GitHub.
5. Provide a clear description of the changes made, the rationale, and any relevant issue references.

---

## Contact and Questions

For questions or security concerns, reach out to the project maintainer:

- Author: M.M. Salman Faris
- Email: [mmsalmanfaris@outlook.com](mailto:mmsalmanfaris@outlook.com)
- GitHub: [@mmsalmanfaris](https://github.com/mmsalmanfaris)
