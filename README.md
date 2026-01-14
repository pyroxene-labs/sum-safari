# SumSafari 🦁

> A safari-themed math practice game designed to make learning arithmetic fun and accessible.

SumSafari challenges players to solve math problems (Addition, Subtraction, Multiplication, Division) against the clock to "collect" animals. It features adaptive difficulty, comprehensive scoring, and a focus on accessibility.

[**Play Now**](https://pyroxene-labs.github.io/sum-safari/)

## 🚀 Features

- **Customizable Sessions**: Toggle operations, set difficulty (Easy/Medium/Hard), and choose session duration.
- **Fun Rewards**: Collect unique animal emojis for every correct answer.
- **Accessible Design**: Full keyboard navigation, screen reader support (ARIA), and reduced motion compliance.
- **Robust Scoring**: Points for speed, accuracy, and difficulty multipliers.

## 🛠️ Tech Stack

- **Framework**: Vue 3 + TypeScript
- **Build Tool**: Vite
- **State Management**: Vue Composables (Pinia-like pattern)
- **Testing**:
  - Unit/Component: Vitest + Vue Test Utils
  - E2E: Playwright
- **Styling**: Vanilla CSS (Variables + Scoped)

## 📦 Setup & Development

### Prerequisites

- Node.js (v18+)
- npm

### Installation

```bash
# Clone the repository
git clone https://github.com/pyroxene-labs/sum-safari.git

# Navigate to directory
cd sum-safari

# Install dependencies
npm install
```

### Running Locally

```bash
npm run dev
```
Visit `http://localhost:5173` to start exploring.

### Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint to fix code style issues |
| `npm run test:unit` | Run Unit & Component tests (Vitest) |
| `npm run test:e2e` | Run End-to-End tests (Playwright) |

## 🧪 Testing

We use **Vitest** for unit logic (e.g., scoring math) and **Playwright** for full customer journeys.

```bash
# Run Unit Tests
npm run test:unit

# Run E2E Tests
npm run test:e2e
```

## 🤝 Contributing

1. Fork the repo
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.
