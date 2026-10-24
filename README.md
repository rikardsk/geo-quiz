# 🌍 Geo Quiz Monorepo

An interactive collection of geography map and trivia quiz applications built with **React 19**, **TypeScript**, **Tailwind CSS**, and **Vite**.

Test your knowledge of capitals, flags, geographical boundaries, and regions across different parts of the world!

---

## 🎮 Included Quizzes

| Quiz | Region | Focus | Map |
| :--- | :--- | :--- | :--- |
| **StateQuiz** | 🇺🇸 United States | 50 States, State Capitals, Abbreviations | Interactive US Map |
| **EUQuiz** | 🇪🇺 Europe / European Union | European Countries, Capitals, Flags | Interactive Europe Map |
| **SAQuiz** | 🌎 South America | South American Nations, Capitals, Flags | Interactive South America Map |
| **LAQuiz** | 🌎 Central America & Caribbean | Central America & Caribbean Nations, Capitals, Flags | Interactive Central America & Caribbean Map |
| **CanadaQuiz** | 🇨🇦 Canada | 10 Provinces & 3 Territories, Capitals | Interactive Canada Map |
| **SwedishCountiesQuiz** | 🇸🇪 Sweden | 21 Counties (Län), County Seats, Regions | Interactive Sweden Map |

---

## ⚡ Getting Started

This repository uses **npm workspaces** to manage all quiz applications in one place.

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or newer recommended)
- `npm` (v7 or newer for workspaces support)

### Installation
Install dependencies for all quizzes from the root:
```bash
npm install
```

### Running a Quiz
To start the local development server for any quiz:
```bash
# Example: European Union Quiz
npm run dev --workspace=EUQuiz

# Example: US State Quiz
npm run dev --workspace=StateQuiz

# Example: South America Quiz
npm run dev --workspace=SAQuiz

# Example: Central America & Caribbean Quiz
npm run dev --workspace=LAQuiz

# Example: Canada Quiz
npm run dev --workspace=CanadaQuiz

# Example: Swedish Counties Quiz
npm run dev --workspace=SwedishCountiesQuiz

# Or navigate directly into the folder:
cd EUQuiz
npm run dev
```

### Running Tests
Run Vitest across all projects simultaneously:
```bash
npm test
```
Or test an individual quiz:
```bash
npm test --workspace=EUQuiz
```

### Building for Production
Build all quizzes:
```bash
npm run build
```
Or build a single quiz:
```bash
npm run build --workspace=EUQuiz
```

---

## 🛠️ Tech Stack

- **Framework**: [React 19](https://react.dev/)
- **Build Tool**: [Vite](https://vite.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Testing**: [Vitest](https://vitest.dev/)
