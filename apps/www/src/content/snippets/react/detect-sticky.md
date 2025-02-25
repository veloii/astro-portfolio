---
title: "React Detect Sticky"
description: "Watch for sticky elements being hoisted"
pubDate: "Feb 22 2025"
tags: ["react"]
collection: "react"
implementation: "use-detect-sticky.ts"
usage: "use-detect-sticky.example.tsx"
---

## Context

A basic hook to watch for when sticky elements are hoisted to their set position. This is useful for conditionally showing "Scroll to top" buttons.

The caveat is the sticky element must have a `-1px` offset.
