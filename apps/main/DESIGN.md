# ComfHutt Choices Module Design

## Overview
The Choices module captures high-intent leads by asking them to self-segment into "Investors" or "Property Owners". It replaces traditional contact forms with a multi-step, interactive card.

## Microcopy Strategy
- **Tone:** Minimal, luxe, direct.
- **Goal:** Reduce cognitive load.
- **Labels:** "Your Goal", "Quick Check", "Final Step".
- **Actions:** "Continue", "Get Access".

## Accessibility (A11y)
- **Forms:** All inputs have associated labels (visible or `aria-label`).
- **Slider:** Range input supports keyboard navigation.
- **Validation:** Error messages use `role="alert"`.
- **Contrast:** Checked against WCAG AA standards for emerald/blue accents.

## Analytics Events
The component emits the following events (currently logged to console, can be piped to Vercel Analytics/Mixpanel):

| Event Name | Payload | Trigger |
|---|---|---|
| `choices.started` | `{}` | User interacts with first step |
| `choices.step` | `{ step: number, value: string }` | User completes a step |
| `choices.submitted` | `{ intent: string, nps: number }` | Form successfully submitted |

## Database Schema
Two tables managed via Supabase/Prisma:
1. **leads**: Stores unique contacts (email key).
2. **choice_responses**: Stores each interaction/submission linked to a lead.