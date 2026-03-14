---
title: "Notes on Building Calm Software"
date: "2026-01-26"
excerpt: "Fast interfaces are not enough. Calm software reduces cognitive friction at every step."
tags: ["Engineering", "Product", "UX"]
---

Most product discussions focus on speed, features, or growth loops.
I care about something quieter: **cognitive load**.

Software can be technically fast and still mentally exhausting.

## What Calm Feels Like

Calm software does not demand constant interpretation.
It makes states obvious and actions predictable.

- The user always knows where they are.
- The next action is clear.
- Errors are specific and reversible.

## A Practical Rule

For every screen I design, I ask:

> What is the one decision this page is asking the user to make?

If the page asks for more than one decision, I split it.

## Engineering Implications

This is not only a design problem.
It is a system problem.

### Stable data contracts

When APIs return inconsistent structures, UI complexity explodes.
So I prefer explicit contracts and predictable fallbacks:

```ts
type UserCard = {
  id: string;
  name: string;
  headline: string | null;
  status: "active" | "pending" | "disabled";
};
```

### Fewer states, better states

I avoid hidden loading states and ambiguous empty states.
Each view should have a deliberate response to:

1. loading
2. success
3. empty
4. error

## Closing

People remember how software made them feel while working.
Calm products create trust.  
Trust creates retention.  
Retention creates durable products.

