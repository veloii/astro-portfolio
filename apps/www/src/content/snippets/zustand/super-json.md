---
title: "Zustand Superjson Storage"
description: "Safely store non-primitive types in a store"
pubDate: "Feb 22 2025"
tags: ["zustand"]
implementation: "superjson.ts"
usage: "superjson.example.ts"
---

## Context

Same API as the built-in `createJSONStorage()` but with `superjson`.

This means `Date`, `Map`, `Set` and `BigInt` can be safely stored.
