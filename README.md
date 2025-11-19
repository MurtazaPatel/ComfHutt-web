# ComfHutt - Intelligent Fractional Real Estate

A premium, Next.js-based frontend for ComfHutt, the world's first self-evolving property network. This project converts the original static HTML site into a modern, component-based React application with a focus on "Google-clean" aesthetics and "Apple-premium" feel.

## 🚀 Project Overview

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **Animations:** Framer Motion
- **Icons:** Lucide React
- **Font:** Inter (via `next/font`)

## 🛠️ Setup & Installation

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd comfhutt-next
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Run the development server:**
    ```bash
    npm run dev
    ```

4.  Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## ✨ Key Features & Improvements

### 🎨 UI/UX Redesign (Before vs. After)

| Feature | Original (HTML/CSS) | New (Next.js + Tailwind) |
| :--- | :--- | :--- |
| **Structure** | Monolithic `index.html` | Modular React Components (`/components`) |
| **Styling** | Custom CSS + Inline Styles | Tailwind CSS v4 Utility Classes |
| **Responsiveness** | Basic media queries | Mobile-first Tailwind approach |
| **Animations** | CSS Keyframes & JS Observers | **Framer Motion** for smooth, physics-based reveals |
| **Interactivity** | Vanilla JS DOM manipulation | **React Hooks** (`useState`, `useEffect`) |
| **Forms** | Static HTML form | Controlled React components with simulation logic |
| **Typography** | Standard Web Fonts | Optimized `next/font` (Inter) |
| **Icons** | Inline SVG | **Lucide React** (Consistent, scalable) |

### 🧩 Component Architecture

-   **`Navbar`**: Responsive glassmorphism header with a mobile menu overlay.
-   **`Hero`**: High-impact landing section with a typing effect and staggered reveal animations.
-   **`Problem`**: Grid layout highlighting market challenges with hover effects.
-   **`Solution`**: Feature showcase with custom icon wrappers and clean typography.
-   **`Validator`**: Interactive AI demo simulating property analysis with conditional result rendering.
-   **`Roadmap`**: Vertical timeline with active/inactive states and pulse animations.
-   **`CTA`**: "Live Preview" section featuring a property card and investment simulation.
-   **`Footer`**: Clean, multi-column footer with navigation links.

### 💎 Design System Highlights

-   **Glassmorphism**: Extensive use of `bg-white/5` and `backdrop-blur` for a modern, layered feel.
-   **Gradients**: Subtle text gradients (`gradient-text`) and background auroras (`aurora-bg`) add depth without clutter.
-   **Micro-interactions**: Buttons and cards scale slightly on hover; customized focus rings on inputs.
-   **Whitespace**: Increased padding and margin (`py-20 md:py-48`) for a breathable, luxury layout.

## 🔮 Future Backend Integration

To turn this frontend into a fully functional dApp/Platform, consider the following integrations:

1.  **API Routes (`/app/api`)**:
    -   Create endpoints for form submissions (e.g., `/api/validate-property`).
    -   Fetch dynamic property data from a database.

2.  **Database (PostgreSQL / Supabase)**:
    -   Store user profiles, property listings, and investment records.
    -   Use Prisma ORM for type-safe database access.

3.  **Authentication (Clerk / NextAuth)**:
    -   Implement user sign-up/login.
    -   Protect dashboard routes.

4.  **Web3 Integration (Wagmi / RainbowKit)**:
    -   Replace the "Connect Wallet" buttons with actual wallet connection logic.
    -   Interact with smart contracts for tokenization and escrow.

5.  **AI Service**:
    -   Connect the `Validator` component to a real Python/FastAPI backend running the AI model.

## 📄 License

[MIT](LICENSE)
