# AI Prompt Manager

A modern React application for managing, organizing, and using AI prompts with dynamic variable support.

## 🌐 Live Demo

**[https://elenatabakov.github.io/AI-Prompt-Manager/](https://elenatabakov.github.io/AI-Prompt-Manager/)**

![React](https://img.shields.io/badge/React-19.2-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.1-06B6D4?logo=tailwindcss)
![Vite](https://img.shields.io/badge/Vite-7.2-646CFF?logo=vite)

##  Time Spent

**Total: ~4 hours**

| Task | Hours |
|------|-------|
| Initial setup & core components | 1 |
| Template system with inline variables | 1 |
| Accessibility & keyboard shortcuts | 0.5 |
| Theming & color palette | 0.5 |
| Refactoring & code organization | 0.5 |
| Deployment & documentation | 0.5 |

##  How to Run

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/ElenaTabakov/AI-Prompt-Manager.git
cd AI-Prompt-Manager/ai-prompt-manager

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Available Scripts

```bash
npm run dev      # Start dev server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

##  Architectural Decisions

### 1. **Custom Hooks for Logic Separation**

Extracted business logic into reusable hooks:
- `usePromptFilters` — filtering, search, and pagination logic
- `usePrompts` — CRUD operations with undo/redo support
- `useLocalStorage` — persistent state management
- `useCopyToClipboard` — clipboard operations
- `useDebounce` — optimized search input

**Why:** Keeps components focused on UI, makes logic testable and reusable.

### 2. **Component Composition**

Split large components into smaller, focused pieces:
```
prompts/
├── PromptList.tsx      # Main list container
├── PromptCard.tsx      # Individual prompt card
├── PromptForm.tsx      # Create/edit form
├── CategoryTag.tsx     # Reusable category badge
├── categoryStyles.ts   # Shared category colors
└── NoResults.tsx       # Empty state
```

**Why:** Single Responsibility Principle, easier maintenance, better code reuse.

### 3. **CSS Variables for Theming**

Used CSS custom properties for theme colors instead of Tailwind's built-in dark mode:
```css
:root {
  --color-bg-page: #f9fafb;
  --color-text-primary: #111827;
}
.dark {
  --color-bg-page: #111827;
  --color-text-primary: #f9fafb;
}
```

**Why:** Instant theme switching without class recalculation, easier to extend with additional themes.

### 4. **"Load More" Pagination**

Implemented infinite scroll pattern instead of traditional page numbers.

**Why:** Better mobile UX, simpler implementation, works well with filtering.

### 5. **Template Variables with Inline Inputs**

Variables like `{topic}` render as inline editable inputs within the template text.

**Why:** More intuitive UX — users see exactly where their input goes, WYSIWYG experience.

##  Accessibility Features

This project puts **strong emphasis on accessibility**:

### Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Alt + N` | Create new prompt |
| `Ctrl + K` | Focus search |
| `Ctrl + Z` | Undo |
| `Ctrl + Y` | Redo |
| `Alt + T` | Toggle dark/light theme |
| `Escape` | Close modal |

### ARIA & Screen Reader Support

- All interactive elements have proper `aria-labels`
- Live regions announce search results (`aria-live="polite"`)
- Form inputs have associated labels and error messages
- Focus management in modals
- Keyboard navigation support throughout

### Visual Accessibility

- Sufficient color contrast ratios
- Focus indicators on all interactive elements
- Reduced motion support (`prefers-reduced-motion`)
- Clear visual hierarchy

## 🔮 What I Would Improve With More Time

### 1. **Backend Integration**
Currently uses localStorage. Would add:
- REST API or GraphQL backend
- User authentication
- Cloud sync across devices
- Sharing prompts with others

### 2. **Advanced Features**
- Folders/collections for organizing prompts
- Tags system with autocomplete
- Prompt versioning/history
- Import from popular AI tools (ChatGPT, Claude)
- Markdown support in templates

### 3. **Testing**
- Unit tests for hooks (Jest/Vitest)
- Component tests (React Testing Library)
- E2E tests (Playwright/Cypress)
- Accessibility audits (axe-core)

### 4. **Performance**
- Virtual scrolling for large lists
- Service Worker for offline support
- Optimistic UI updates

##  Assumptions Made

1. **Single User** — No authentication needed, all data is local to the browser
2. **Modern Browser** — Targets browsers supporting ES2020+ features
3. **English UI** — No internationalization (i18n) required for MVP
4. **Simple Categories** — Predefined categories sufficient, with ability to add custom ones
5. **Template Syntax** — `{variable}` format is intuitive and doesn't conflict with prompt content
6. **Local Storage** — 5MB limit is sufficient for typical use (hundreds of prompts)

##  Project Structure

```
src/
├── components/
│   ├── layout/         # Header, layout components
│   ├── prompts/        # Prompt-related components
│   └── ui/             # Reusable UI components
├── context/            # React Context providers
├── hooks/              # Custom React hooks
├── types/              # TypeScript type definitions
└── utils/              # Utility functions
```

## 🛠️ Tech Stack

- **React 19** — UI library with latest features
- **TypeScript** — Type safety
- **Tailwind CSS 4** — Utility-first styling
- **Vite** — Fast build tool
- **Headless UI** — Accessible UI primitives

##  License

MIT

---

Built with ❤️ and attention to accessibility
