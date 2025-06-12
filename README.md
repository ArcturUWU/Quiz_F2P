<div align="left" style="position: relative;">
<img src="https://img.icons8.com/?size=512&id=55494&format=png" align="right" width="30%" style="margin: -20px 0 0 20px;">
<h1>QUIZ_F2P</h1>
<p align="left">
	<em><code>❯ Best free alternative for cards learning</code></em>
</p>
<p align="left">
	<img src="https://img.shields.io/github/license/ArcturUWU/Quiz_F2P?style=social&logo=opensourceinitiative&logoColor=white&color=7d00ff" alt="license">
	<img src="https://img.shields.io/github/last-commit/ArcturUWU/Quiz_F2P?style=social&logo=git&logoColor=white&color=7d00ff" alt="last-commit">
	<img src="https://img.shields.io/github/languages/top/ArcturUWU/Quiz_F2P?style=social&color=7d00ff" alt="repo-top-language">
	<img src="https://img.shields.io/github/languages/count/ArcturUWU/Quiz_F2P?style=social&color=7d00ff" alt="repo-language-count">
</p>
<p align="left">Built with the tools and technologies:</p>
<p align="left">
	<img src="https://img.shields.io/badge/npm-CB3837.svg?style=social&logo=npm&logoColor=white" alt="npm">
	<img src="https://img.shields.io/badge/Autoprefixer-DD3735.svg?style=social&logo=Autoprefixer&logoColor=white" alt="Autoprefixer">
	<img src="https://img.shields.io/badge/HTML5-E34F26.svg?style=social&logo=HTML5&logoColor=white" alt="HTML5">
	<img src="https://img.shields.io/badge/PostCSS-DD3A0A.svg?style=social&logo=PostCSS&logoColor=white" alt="PostCSS">
	<img src="https://img.shields.io/badge/JavaScript-F7DF1E.svg?style=social&logo=JavaScript&logoColor=black" alt="JavaScript">
	<br>
	<img src="https://img.shields.io/badge/React-61DAFB.svg?style=social&logo=React&logoColor=black" alt="React">
	<img src="https://img.shields.io/badge/TypeScript-3178C6.svg?style=social&logo=TypeScript&logoColor=white" alt="TypeScript">
	<img src="https://img.shields.io/badge/Vite-646CFF.svg?style=social&logo=Vite&logoColor=white" alt="Vite">
	<img src="https://img.shields.io/badge/ESLint-4B32C3.svg?style=social&logo=ESLint&logoColor=white" alt="ESLint">
</p>
</div>
<br clear="right">

## 🔗 Table of Contents

I. [📍 Overview](#-overview)
II. [👾 Features](#-features)
III. [📁 Project Structure](#-project-structure)
IV. [🚀 Getting Started](#-getting-started)
V. [📌 Project Roadmap](#-project-roadmap)
VI. [🔰 Contributing](#-contributing)
VII. [🎗 License](#-license)
VIII. [🙌 Acknowledgments](#-acknowledgments)

---

## 📍 Overview

<code>❯ Neon Quizlet is a free, open-source alternative to Quizlet — built for learners who are tired of paywalls and limitations. Whether you're cramming for exams or casually studying new topics, Neon Quizlet offers powerful tools without locking essential features behind a subscription.

❯Inspired by the vibrant chaos of a neon-lit Tokyo night, the interface is bold, energetic, and unapologetically wild — designed to make studying feel less like a chore and more like a cyberpunk trip.

❯P.S. sub in source is NOT REAL. DO NOT ENTER any real data or payment(if you want to pass sub - enter random numbers) or registrate with real passwords and mail because Security for now is bad.</code>

---

## 👾 Features

Here are the upcoming milestones planned for **Neon Quizlet**:

### ✅ MVP Completed
- Flashcards mode
- Test mode
- Open-answer mode
- Neon cyberpunk UI
- Unlimited usage (no time or feature locks)

---

### 🧠 In Progress / Coming Soon

#### 🔡 Spelling Mode
> A typing-based mode where users practice correct spelling — great for language learners and memorization drills.

#### 🤖 AI-Powered Features
> Integration of AI to:
- Suggest related terms or definitions
- Generate practice questions automatically
- Provide smart feedback in learning mode

#### 🎓 More Learning Modes
> Expanding beyond flashcards/tests:
- Multiple choice
- Matching pairs
- Cloze deletion
- Audio-based training

#### 📤 Shareable Term Sets
> Users will be able to publish their term lists and share them via links or searchable tags.

#### ⚔️ Study Competitions
> Competitive multiplayer sessions using public term sets:
- Real-time duels
- Timed challenges
- Leaderboards

---

### 🛠️ Later Ideas (Backlog)
- Mobile app (PWA or native)
- Import/export via CSV, Anki, etc.
- Group collaboration / team study
- Account system (optional, privacy-friendly)
- Custom themes & accessibility settings

---

## 📁 Project Structure

```sh
└── Quiz_F2P/
    ├── eslint.config.js
    ├── index.html
    ├── package-lock.json
    ├── package.json
    ├── postcss.config.js
    ├── src
    │   ├── App.tsx
    │   ├── components
    │   │   ├── features
    │   │   ├── layout
    │   │   └── ui
    │   ├── contexts
    │   │   ├── AuthContext.tsx
    │   │   ├── ModuleContext.tsx
    │   │   └── ThemeContext.tsx
    │   ├── index.css
    │   ├── main.tsx
    │   ├── pages
    │   │   ├── CheckoutPage.tsx
    │   │   ├── CreateModulePage.tsx
    │   │   ├── EditModulePage.tsx
    │   │   ├── HomePage.tsx
    │   │   ├── LoginPage.tsx
    │   │   ├── ModuleDetailPage.tsx
    │   │   ├── ModulesPage.tsx
    │   │   ├── PricingPage.tsx
    │   │   ├── ProfilePage.tsx
    │   │   ├── RegisterPage.tsx
    │   │   ├── StatsPage.tsx
    │   │   └── StudyPage.tsx
    │   ├── types
    │   │   └── index.ts
    │   ├── utils
    │   │   ├── storage.ts
    │   │   └── studyHelpers.ts
    │   └── vite-env.d.ts
    ├── tailwind.config.js
    ├── tsconfig.app.json
    ├── tsconfig.json
    ├── tsconfig.node.json
    └── vite.config.ts
```


### 📂 Project Index
<details open>
	<summary><b><code>QUIZ_F2P/</code></b></summary>
	<details> <!-- __root__ Submodule -->
		<summary><b>__root__</b></summary>
		<blockquote>
			<table>
			<tr>
				<td><b><a href='https://github.com/ArcturUWU/Quiz_F2P/blob/master/postcss.config.js'>postcss.config.js</a></b></td>
				<td><code>❯ REPLACE-ME</code></td>
			</tr>
			<tr>
				<td><b><a href='https://github.com/ArcturUWU/Quiz_F2P/blob/master/tsconfig.node.json'>tsconfig.node.json</a></b></td>
				<td><code>❯ REPLACE-ME</code></td>
			</tr>
			<tr>
				<td><b><a href='https://github.com/ArcturUWU/Quiz_F2P/blob/master/package-lock.json'>package-lock.json</a></b></td>
				<td><code>❯ REPLACE-ME</code></td>
			</tr>
			<tr>
				<td><b><a href='https://github.com/ArcturUWU/Quiz_F2P/blob/master/tsconfig.json'>tsconfig.json</a></b></td>
				<td><code>❯ REPLACE-ME</code></td>
			</tr>
			<tr>
				<td><b><a href='https://github.com/ArcturUWU/Quiz_F2P/blob/master/tailwind.config.js'>tailwind.config.js</a></b></td>
				<td><code>❯ REPLACE-ME</code></td>
			</tr>
			<tr>
				<td><b><a href='https://github.com/ArcturUWU/Quiz_F2P/blob/master/tsconfig.app.json'>tsconfig.app.json</a></b></td>
				<td><code>❯ REPLACE-ME</code></td>
			</tr>
			<tr>
				<td><b><a href='https://github.com/ArcturUWU/Quiz_F2P/blob/master/package.json'>package.json</a></b></td>
				<td><code>❯ REPLACE-ME</code></td>
			</tr>
			<tr>
				<td><b><a href='https://github.com/ArcturUWU/Quiz_F2P/blob/master/vite.config.ts'>vite.config.ts</a></b></td>
				<td><code>❯ REPLACE-ME</code></td>
			</tr>
			<tr>
				<td><b><a href='https://github.com/ArcturUWU/Quiz_F2P/blob/master/index.html'>index.html</a></b></td>
				<td><code>❯ REPLACE-ME</code></td>
			</tr>
			<tr>
				<td><b><a href='https://github.com/ArcturUWU/Quiz_F2P/blob/master/eslint.config.js'>eslint.config.js</a></b></td>
				<td><code>❯ REPLACE-ME</code></td>
			</tr>
			</table>
		</blockquote>
	</details>
	<details> <!-- src Submodule -->
		<summary><b>src</b></summary>
		<blockquote>
			<table>
			<tr>
				<td><b><a href='https://github.com/ArcturUWU/Quiz_F2P/blob/master/src/main.tsx'>main.tsx</a></b></td>
				<td><code>❯ REPLACE-ME</code></td>
			</tr>
			<tr>
				<td><b><a href='https://github.com/ArcturUWU/Quiz_F2P/blob/master/src/index.css'>index.css</a></b></td>
				<td><code>❯ REPLACE-ME</code></td>
			</tr>
			<tr>
				<td><b><a href='https://github.com/ArcturUWU/Quiz_F2P/blob/master/src/App.tsx'>App.tsx</a></b></td>
				<td><code>❯ REPLACE-ME</code></td>
			</tr>
			<tr>
				<td><b><a href='https://github.com/ArcturUWU/Quiz_F2P/blob/master/src/vite-env.d.ts'>vite-env.d.ts</a></b></td>
				<td><code>❯ REPLACE-ME</code></td>
			</tr>
			</table>
			<details>
				<summary><b>types</b></summary>
				<blockquote>
					<table>
					<tr>
						<td><b><a href='https://github.com/ArcturUWU/Quiz_F2P/blob/master/src/types/index.ts'>index.ts</a></b></td>
						<td><code>❯ REPLACE-ME</code></td>
					</tr>
					</table>
				</blockquote>
			</details>
			<details>
				<summary><b>contexts</b></summary>
				<blockquote>
					<table>
					<tr>
						<td><b><a href='https://github.com/ArcturUWU/Quiz_F2P/blob/master/src/contexts/ThemeContext.tsx'>ThemeContext.tsx</a></b></td>
						<td><code>❯ REPLACE-ME</code></td>
					</tr>
					<tr>
						<td><b><a href='https://github.com/ArcturUWU/Quiz_F2P/blob/master/src/contexts/ModuleContext.tsx'>ModuleContext.tsx</a></b></td>
						<td><code>❯ REPLACE-ME</code></td>
					</tr>
					<tr>
						<td><b><a href='https://github.com/ArcturUWU/Quiz_F2P/blob/master/src/contexts/AuthContext.tsx'>AuthContext.tsx</a></b></td>
						<td><code>❯ REPLACE-ME</code></td>
					</tr>
					</table>
				</blockquote>
			</details>
			<details>
				<summary><b>components</b></summary>
				<blockquote>
					<details>
						<summary><b>features</b></summary>
						<blockquote>
							<table>
							<tr>
								<td><b><a href='https://github.com/ArcturUWU/Quiz_F2P/blob/master/src/components/features/StudyResults.tsx'>StudyResults.tsx</a></b></td>
								<td><code>❯ REPLACE-ME</code></td>
							</tr>
							<tr>
								<td><b><a href='https://github.com/ArcturUWU/Quiz_F2P/blob/master/src/components/features/PremiumBanner.tsx'>PremiumBanner.tsx</a></b></td>
								<td><code>❯ REPLACE-ME</code></td>
							</tr>
							<tr>
								<td><b><a href='https://github.com/ArcturUWU/Quiz_F2P/blob/master/src/components/features/QuizQuestion.tsx'>QuizQuestion.tsx</a></b></td>
								<td><code>❯ REPLACE-ME</code></td>
							</tr>
							<tr>
								<td><b><a href='https://github.com/ArcturUWU/Quiz_F2P/blob/master/src/components/features/FlashCard.tsx'>FlashCard.tsx</a></b></td>
								<td><code>❯ REPLACE-ME</code></td>
							</tr>
							<tr>
								<td><b><a href='https://github.com/ArcturUWU/Quiz_F2P/blob/master/src/components/features/StudyModeSelector.tsx'>StudyModeSelector.tsx</a></b></td>
								<td><code>❯ REPLACE-ME</code></td>
							</tr>
							<tr>
								<td><b><a href='https://github.com/ArcturUWU/Quiz_F2P/blob/master/src/components/features/ModuleForm.tsx'>ModuleForm.tsx</a></b></td>
								<td><code>❯ REPLACE-ME</code></td>
							</tr>
							<tr>
								<td><b><a href='https://github.com/ArcturUWU/Quiz_F2P/blob/master/src/components/features/WritingQuestion.tsx'>WritingQuestion.tsx</a></b></td>
								<td><code>❯ REPLACE-ME</code></td>
							</tr>
							<tr>
								<td><b><a href='https://github.com/ArcturUWU/Quiz_F2P/blob/master/src/components/features/ModuleCard.tsx'>ModuleCard.tsx</a></b></td>
								<td><code>❯ REPLACE-ME</code></td>
							</tr>
							</table>
						</blockquote>
					</details>
					<details>
						<summary><b>layout</b></summary>
						<blockquote>
							<table>
							<tr>
								<td><b><a href='https://github.com/ArcturUWU/Quiz_F2P/blob/master/src/components/layout/Header.tsx'>Header.tsx</a></b></td>
								<td><code>❯ REPLACE-ME</code></td>
							</tr>
							<tr>
								<td><b><a href='https://github.com/ArcturUWU/Quiz_F2P/blob/master/src/components/layout/Layout.tsx'>Layout.tsx</a></b></td>
								<td><code>❯ REPLACE-ME</code></td>
							</tr>
							</table>
						</blockquote>
					</details>
					<details>
						<summary><b>ui</b></summary>
						<blockquote>
							<table>
							<tr>
								<td><b><a href='https://github.com/ArcturUWU/Quiz_F2P/blob/master/src/components/ui/Textarea.tsx'>Textarea.tsx</a></b></td>
								<td><code>❯ REPLACE-ME</code></td>
							</tr>
							<tr>
								<td><b><a href='https://github.com/ArcturUWU/Quiz_F2P/blob/master/src/components/ui/Button.tsx'>Button.tsx</a></b></td>
								<td><code>❯ REPLACE-ME</code></td>
							</tr>
							<tr>
								<td><b><a href='https://github.com/ArcturUWU/Quiz_F2P/blob/master/src/components/ui/Empty.tsx'>Empty.tsx</a></b></td>
								<td><code>❯ REPLACE-ME</code></td>
							</tr>
							<tr>
								<td><b><a href='https://github.com/ArcturUWU/Quiz_F2P/blob/master/src/components/ui/ProgressBar.tsx'>ProgressBar.tsx</a></b></td>
								<td><code>❯ REPLACE-ME</code></td>
							</tr>
							<tr>
								<td><b><a href='https://github.com/ArcturUWU/Quiz_F2P/blob/master/src/components/ui/Card.tsx'>Card.tsx</a></b></td>
								<td><code>❯ REPLACE-ME</code></td>
							</tr>
							<tr>
								<td><b><a href='https://github.com/ArcturUWU/Quiz_F2P/blob/master/src/components/ui/Badge.tsx'>Badge.tsx</a></b></td>
								<td><code>❯ REPLACE-ME</code></td>
							</tr>
							<tr>
								<td><b><a href='https://github.com/ArcturUWU/Quiz_F2P/blob/master/src/components/ui/Input.tsx'>Input.tsx</a></b></td>
								<td><code>❯ REPLACE-ME</code></td>
							</tr>
							<tr>
								<td><b><a href='https://github.com/ArcturUWU/Quiz_F2P/blob/master/src/components/ui/Modal.tsx'>Modal.tsx</a></b></td>
								<td><code>❯ REPLACE-ME</code></td>
							</tr>
							</table>
						</blockquote>
					</details>
				</blockquote>
			</details>
			<details>
				<summary><b>pages</b></summary>
				<blockquote>
					<table>
					<tr>
						<td><b><a href='https://github.com/ArcturUWU/Quiz_F2P/blob/master/src/pages/PricingPage.tsx'>PricingPage.tsx</a></b></td>
						<td><code>❯ REPLACE-ME</code></td>
					</tr>
					<tr>
						<td><b><a href='https://github.com/ArcturUWU/Quiz_F2P/blob/master/src/pages/LoginPage.tsx'>LoginPage.tsx</a></b></td>
						<td><code>❯ REPLACE-ME</code></td>
					</tr>
					<tr>
						<td><b><a href='https://github.com/ArcturUWU/Quiz_F2P/blob/master/src/pages/HomePage.tsx'>HomePage.tsx</a></b></td>
						<td><code>❯ REPLACE-ME</code></td>
					</tr>
					<tr>
						<td><b><a href='https://github.com/ArcturUWU/Quiz_F2P/blob/master/src/pages/CreateModulePage.tsx'>CreateModulePage.tsx</a></b></td>
						<td><code>❯ REPLACE-ME</code></td>
					</tr>
					<tr>
						<td><b><a href='https://github.com/ArcturUWU/Quiz_F2P/blob/master/src/pages/StudyPage.tsx'>StudyPage.tsx</a></b></td>
						<td><code>❯ REPLACE-ME</code></td>
					</tr>
					<tr>
						<td><b><a href='https://github.com/ArcturUWU/Quiz_F2P/blob/master/src/pages/ModulesPage.tsx'>ModulesPage.tsx</a></b></td>
						<td><code>❯ REPLACE-ME</code></td>
					</tr>
					<tr>
						<td><b><a href='https://github.com/ArcturUWU/Quiz_F2P/blob/master/src/pages/EditModulePage.tsx'>EditModulePage.tsx</a></b></td>
						<td><code>❯ REPLACE-ME</code></td>
					</tr>
					<tr>
						<td><b><a href='https://github.com/ArcturUWU/Quiz_F2P/blob/master/src/pages/ProfilePage.tsx'>ProfilePage.tsx</a></b></td>
						<td><code>❯ REPLACE-ME</code></td>
					</tr>
					<tr>
						<td><b><a href='https://github.com/ArcturUWU/Quiz_F2P/blob/master/src/pages/StatsPage.tsx'>StatsPage.tsx</a></b></td>
						<td><code>❯ REPLACE-ME</code></td>
					</tr>
					<tr>
						<td><b><a href='https://github.com/ArcturUWU/Quiz_F2P/blob/master/src/pages/ModuleDetailPage.tsx'>ModuleDetailPage.tsx</a></b></td>
						<td><code>❯ REPLACE-ME</code></td>
					</tr>
					<tr>
						<td><b><a href='https://github.com/ArcturUWU/Quiz_F2P/blob/master/src/pages/CheckoutPage.tsx'>CheckoutPage.tsx</a></b></td>
						<td><code>❯ REPLACE-ME</code></td>
					</tr>
					<tr>
						<td><b><a href='https://github.com/ArcturUWU/Quiz_F2P/blob/master/src/pages/RegisterPage.tsx'>RegisterPage.tsx</a></b></td>
						<td><code>❯ REPLACE-ME</code></td>
					</tr>
					</table>
				</blockquote>
			</details>
			<details>
				<summary><b>utils</b></summary>
				<blockquote>
					<table>
					<tr>
						<td><b><a href='https://github.com/ArcturUWU/Quiz_F2P/blob/master/src/utils/studyHelpers.ts'>studyHelpers.ts</a></b></td>
						<td><code>❯ REPLACE-ME</code></td>
					</tr>
					<tr>
						<td><b><a href='https://github.com/ArcturUWU/Quiz_F2P/blob/master/src/utils/storage.ts'>storage.ts</a></b></td>
						<td><code>❯ REPLACE-ME</code></td>
					</tr>
					</table>
				</blockquote>
			</details>
		</blockquote>
	</details>
</details>

---
## 🚀 Getting Started

### ☑️ Prerequisites

Before getting started with Quiz_F2P, ensure your runtime environment meets the following requirements:

- **Programming Language:** TypeScript
- **Package Manager:** Npm


### ⚙️ Installation

Install Quiz_F2P using one of the following methods:

**Build from source:**

1. Clone the Quiz_F2P repository:
```sh
❯ git clone https://github.com/ArcturUWU/Quiz_F2P
```

2. Navigate to the project directory:
```sh
❯ cd Quiz_F2P
```

3. Install the project dependencies:


**Using `npm`** &nbsp; [<img align="center" src="https://img.shields.io/badge/npm-CB3837.svg?style={badge_style}&logo=npm&logoColor=white" />](https://www.npmjs.com/)

```sh
❯ npm install
```




### 🤖 Usage
Run Quiz_F2P using the following command:
**Using `npm`** &nbsp; [<img align="center" src="https://img.shields.io/badge/npm-CB3837.svg?style={badge_style}&logo=npm&logoColor=white" />](https://www.npmjs.com/)

```sh
❯ npm start
```


### 🧪 Testing
Run the test suite using the following command:
**Using `npm`** &nbsp; [<img align="center" src="https://img.shields.io/badge/npm-CB3837.svg?style={badge_style}&logo=npm&logoColor=white" />](https://www.npmjs.com/)

```sh
❯ npm test
```
# sub in source is NOT REAL. DO NOT ENTER any real data or payment(if you want to pass sub - enter random numbers) or registrate with real passwords and mail because Security for now is bad.

## 🎗 License

This project is protected under the MIT License.
