# Project Structure & Organization

## 📁 Clear Separation of Concerns

This project follows a strict layered architecture:

```
src/
├── types/          # TypeScript type definitions & interfaces ONLY
├── data/           # Core game data (species, keywords, etc.)
├── lib/            # Business logic & utility functions
├── hooks/          # React Query hooks for data fetching
├── components/     # React UI components
└── routes/         # Page-level components
```

## 🎯 Layer Responsibilities

### `/types` - Type Definitions
**What goes here**: TypeScript interfaces, types, enums
**What doesn't**: Data, functions, logic

Example:
```ts
// ✅ types/keywords.ts
export type Keyword = 'IMPERIUM' | 'CHAOS' | ...;
export interface KeywordDefinition { ... }

// ❌ NOT HERE
export const KEYWORD_DEFINITIONS = { ... };  // This is DATA
export function validateKeywords() { ... };   // This is LOGIC
```

### `/data` - Core Game Data
**What goes here**: Constants, game rules, static data
**What doesn't**: Types, business logic, React hooks

Example:
```ts
// ✅ data/keywords.ts
export const KEYWORD_DEFINITIONS: Record<string, KeywordDefinition> = {
  'IMPERIUM': { ... },
  'CHAOS': { ... }
};

// ❌ NOT HERE  
export function validateKeywords() { ... };  // This is LOGIC
```

### `/lib` - Business Logic
**What goes here**: Pure functions, utilities, validations
**What doesn't**: React hooks, UI components, data

Example:
```ts
// ✅ lib/keywords.ts
export function keywordMatches(keywords, condition) { ... }
export function areKeywordsCompatible(keywords) { ... }

// ❌ NOT HERE
export const useKeywords = () => { ... };  // This is a HOOK
```

### `/hooks` - React Query Hooks
**What goes here**: React Query hooks, data fetching
**What doesn't**: Business logic, UI components

Example:
```ts
// ✅ hooks/use-keywords.ts
export function useKeywordsByCategory(category) {
  return useQuery({
    queryKey: ['keywords', category],
    queryFn: () => getKeywordsByCategory(category)
  });
}

// ❌ NOT HERE
export function validateKeywords() { ... };  // This is LOGIC
```

### `/components` - UI Components
**What goes here**: React components, JSX, UI logic
**What doesn't**: Business logic, data definitions

Example:
```tsx
// ✅ components/codex/keywords-browser.tsx
export function KeywordsBrowser() {
  const { data } = useKeywordsByCategory('faction');
  return <div>{/* UI */}</div>;
}

// ❌ NOT HERE
export function validateKeywords() { ... };  // This is LOGIC
```

## 📦 Import Flow

```
routes/
  ↓ imports
components/
  ↓ imports
hooks/
  ↓ imports
lib/ ← business logic
  ↓ imports
data/ ← game data
  ↓ imports
types/ ← type definitions
```

**Rule**: Lower layers can import from higher layers, but not vice versa.

## ✅ Examples by Feature

### Keywords System

```
types/keywords.ts       → Type definitions (Keyword, KeywordDefinition, etc.)
data/keywords.ts        → KEYWORD_DEFINITIONS database
lib/keywords.ts         → keywordMatches(), areKeywordsCompatible()
hooks/use-keywords.ts   → useKeywordsByCategory(), useKeywordSearch()
components/.../keywords-browser.tsx → UI component
```

### Species System

```
types/species.ts        → Species interface
types/property-system.ts → Property types
data/species.ts         → HUMAN, ADEPTUS_ASTARTES, etc.
hooks/use-species.ts    → useSpeciesList(), useSpecies()
components/.../species-browser.tsx → UI component
```

## 🚫 Anti-Patterns to Avoid

### ❌ Mixing Data and Types
```ts
// DON'T put data in types file
// types/keywords.ts
export const KEYWORD_DEFINITIONS = { ... };  // ❌
```

### ❌ Mixing Logic and Data
```ts
// DON'T put logic in data file
// data/keywords.ts
export function validateKeywords() { ... };  // ❌
```

### ❌ Business Logic in Components
```tsx
// DON'T put complex logic in components
// components/keywords-browser.tsx
export function KeywordsBrowser() {
  // ❌ Complex validation logic here
  const isValid = keywords.every(k => ...);
  
  // ✅ Instead, call lib function
  const isValid = areKeywordsCompatible(keywords);
}
```

### ❌ React Hooks in lib/
```ts
// DON'T put hooks in lib
// lib/keywords.ts
export function useKeywordValidation() { ... };  // ❌ Goes in hooks/
```

## 📋 Checklist When Adding New Features

- [ ] Create types in `/types`
- [ ] Add data in `/data`
- [ ] Write logic in `/lib`
- [ ] Create hooks in `/hooks`
- [ ] Build UI in `/components`
- [ ] Verify imports follow the flow (types ← data ← lib ← hooks ← components)

## 🎯 Benefits

1. **Clear Boundaries**: Easy to find where code belongs
2. **Testability**: Pure functions in `/lib` are easy to test
3. **Reusability**: Logic can be used in multiple components
4. **Maintainability**: Changes are localized to specific layers
5. **Team Collaboration**: Clear ownership of different layers
