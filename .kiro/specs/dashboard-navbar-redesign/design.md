# Design Document: Dashboard & Navbar Redesign

## Overview

This design document outlines the implementation approach for redesigning the Dashboard and Navbar components to match the professional blue color palette established in the Login/Auth pages. The redesign creates visual consistency across the application using the same gradient backgrounds, animated floating shapes, card styling, and interactive states.

## Architecture

The redesign follows a CSS-first approach, modifying the existing component styles without changing the React component logic. The architecture maintains:

```
client/src/
├── components/
│   ├── Navbar.js          # Minor JSX updates for background shapes
│   └── Navbar.css         # Complete style overhaul
├── pages/
│   ├── Dashboard.js       # Add background shapes container
│   └── Dashboard.css      # Complete style overhaul
```

### Design System Color Palette

| Token | Value | Usage |
|-------|-------|-------|
| `--bg-dark` | `#0a1628` | Primary dark background |
| `--bg-mid` | `#1e3a5f` | Gradient midpoint |
| `--bg-accent` | `#0d47a1` | Gradient endpoint, headers |
| `--primary-dark` | `#1565c0` | Primary buttons, accents |
| `--primary` | `#1976d2` | Links, focus states |
| `--primary-light` | `#2196f3` | Hover states, highlights |
| `--text-primary` | `#0d47a1` | Headers, important text |
| `--text-secondary` | `#546e7a` | Labels, descriptions |
| `--surface` | `rgba(255, 255, 255, 0.95)` | Cards, panels |
| `--border-light` | `#e3f2fd` | Input borders, dividers |

## Components and Interfaces

### Dashboard Component Updates

**JSX Changes:**
- Add `bg-shapes` container with 6 animated shape elements (matching Auth page)
- Wrap existing content in a `dashboard-content` container for proper z-indexing

**CSS Changes:**
- Background: Replace black gradient with blue gradient
- Stat cards: White backgrounds with blue accents and shadows
- Highlighted cards: Blue gradient backgrounds
- Task items: Blue left border on hover
- Priority badges: Blue-themed color variations
- View All button: Blue gradient styling

### Navbar Component Updates

**JSX Changes:**
- No structural changes required

**CSS Changes:**
- Background: Dark blue (`#0a1628`) with backdrop blur
- Links: White text with blue underline on hover
- Logout button: Blue gradient matching Auth primary button
- Mobile menu: Blue-themed slide-out panel

## Data Models

No data model changes required. This is a purely visual/CSS redesign.

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

Based on the prework analysis, most acceptance criteria are visual styling requirements that are best verified through example-based tests or visual inspection. The testable properties focus on structural and accessibility requirements:

**Property 1: Dashboard background shapes structure**
*For any* Dashboard render, the component SHALL contain exactly 6 shape elements within a bg-shapes container
**Validates: Requirements 1.2**

**Property 2: Stat card highlight class application**
*For any* stat card marked as highlighted, the component SHALL have the `highlight` CSS class applied
**Validates: Requirements 1.4**

**Property 3: Reduced motion accessibility**
*For any* user with prefers-reduced-motion enabled, the floating shape animations SHALL be disabled via CSS media query
**Validates: Requirements 5.4**

## Error Handling

This feature is a CSS/styling redesign with minimal error scenarios:

1. **Missing CSS classes**: Components will fall back to default browser styling
2. **Animation performance**: Use `will-change` and GPU-accelerated properties to prevent jank
3. **Browser compatibility**: Use vendor prefixes where needed for backdrop-filter

## Testing Strategy

### Unit Testing Approach

Given this is primarily a CSS redesign, unit tests will focus on:
- Verifying correct CSS classes are applied to components
- Checking that background shape elements are rendered
- Validating responsive breakpoint behavior

### Property-Based Testing

Property-based testing is not well-suited for this feature as it involves visual styling rather than data transformations. The acceptance criteria are best verified through:
- Visual regression testing (manual or automated screenshot comparison)
- Example-based unit tests for DOM structure
- Accessibility audits for focus states and reduced motion

### Visual Testing Checklist

| Component | Test Case |
|-----------|-----------|
| Dashboard | Background gradient matches Auth page |
| Dashboard | 6 floating shapes render with animations |
| Dashboard | Stat cards have white/blue styling |
| Dashboard | Highlighted cards have blue gradient |
| Dashboard | Task items show blue border on hover |
| Navbar | Dark blue background with blur |
| Navbar | Links show blue underline on hover |
| Navbar | Logout button has blue gradient |
| Navbar | Mobile menu slides from right |
| All | Focus states show blue rings |
| All | Reduced motion disables animations |
