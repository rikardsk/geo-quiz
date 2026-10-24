# Features & Roadmap

## Currently Implemented

### 1. Interactive Vector SVG Map
* **SVG Vector Engine:** Crisp, responsive Albers equal-area projection map.
* **Distinct Regional Color Palette:**
  * **West:** Sky Blue (`#38bdf8`)
  * **Midwest:** Emerald / Mint (`#34d399`)
  * **South:** Warm Amber (`#fbbf24`)
  * **Northeast:** Purple / Iris (`#a78bfa`)
* **State Selection & Highlighting:**
  * Vibrant Rose highlight (`#f43f5e`) for the currently selected state.
  * Hover highlight with floating tooltip displaying state name and capital.
  * **Interactive Capital Pin & Beacon:** When any state is clicked, a marker appears showing its capital city location (similar to Washington, D.C.), complete with an animated radar pulse and labeled badge (e.g. `★ Austin`).
  * **Capital Pins Toggle:** Optional button to toggle visible pin markers for all 50 state capitals across the nation.
  * **Browse All States Directory Modal:** A modal dialog featuring all 50 US states and capitals with instant search, regional filter pills, and explored checkmarks.
  * Support for all 50 states plus the District of Columbia.
* **Dividers & Borders:** Crisp boundary strokes and separate insets for Alaska and Hawaii.

### 2. State & Capital Inspector Card
* **Full Information:** Displays state name, capital, postal abbreviation, geographic region, and nickname.
* **Exploration Status:** Marks states as explored once clicked.
* **Navigation Controls:** Next, Previous, and Random state selection buttons for discovery.

### 3. Explorer Dashboard & Search
* **Exploration Progress Tracker:** Shows count and percentage of states visited (e.g., `12 / 51 (24%)`).
* **Region Filtering:** One-click filter pills to focus on West, Midwest, South, or Northeast.
* **Instant Search & Autocomplete:** Search states by name, capital, or 2-letter abbreviation.

### 4. Interactive Quiz: Find the State
* **Strictly 50 US States:** Excludes Washington, D.C. by default so that quiz totals and scores are accurately out of 50 points.
* **Quiz Start Modal:** Launches a dedicated welcome modal whenever you enter the quiz, allowing you to choose your game mode (with **States Only** pre-selected as recommended default).
* **Game Modes:** Choose between **States Only** (*Find California on the map*), **Capitals Challenge** (*Which state has the capital Sacramento?*), or **Mixed Mode**.
* **Prominent Question Banner:** The active question is displayed directly below the map in a large, readable heading (`text-2xl` to `text-3xl`).
* **Correct State Badges & Completion Fill:** States correctly answered during the quiz receive a little green checkmark pin badge (`✓`) and a soft emerald tone, letting you visually watch your progress conquer the map.
* **Smart Pool Rotation:** Already answered states are automatically excluded from subsequent questions until the entire map is completed.
* **Direct Map Interaction:** Player clicks the matching state directly on the SVG map.
* **Instant Visual Feedback:** Correct states flash emerald green (`#10b981`), while incorrect guesses flash coral red (`#ef4444`) with friendly correction hints.
* **Score & Streak Tracking:** Real-time accuracy percentage, score counter, current streak (`🔥`), and best streak tracking.
* **Regional Hints:** One-click hint narrows down the search by identifying and highlighting the state's geographic region.
* **Skip & Reset Controls:** Skip difficult questions, restart, or switch quiz modes at any time.

### 5. What happens when you win - Win modal?

### 6. Cheat/help/Show it button for when you don't know an answer and give up

---

## Planned / Roadmap Features

### 1. Settings & Customization
* **Washington, D.C. & Territories Toggle:** A settings menu allowing users to configure whether Washington, D.C. and U.S. Territories are included in the quiz and exploration counts.

### 2. Additional Quiz Modes
* **Identify the Capital (Multiple Choice):** Given a highlighted state, pick the correct capital from 4 choices.
* **Capital Spelling Challenge:** Type the name of the capital for a highlighted state.

### 3. Gamification & Challenges
* **Timed Speedruns:** Timed challenge to locate all 50 states as fast as possible.
* **Difficulty Levels:** Casual (with hints) vs. Hardcore (blank map without borders or labels).

### 4. Audio & Accessibility
* **Pronunciation:** Native browser text-to-speech to pronounce state and capital names aloud.
* **Full Keyboard Navigation:** Complete tab/arrow key navigation and screen-reader accessibility.

### 5. Shortcut Keys

### 6. High score list Modal

### 7. Full screen ability

### 8. NFL teams and Quiz

### 9. EU and South America as next project

