---
title: "React Scroll Threshold"
description: "Performantly check the scroll position of an element"
pubDate: "Feb 22 2025"
tags: ["react"]
collection: "react"
implementation: "use-scroll-threshold.ts"
usage: "use-scroll-threshold.example.tsx"
---

## Context

Basic hook to check if scroll position of the specified element ref has exceeded a threshold. If an elements is not specified, `window.scrollY` is used. The threshold is _not_ inclusive.

This hook will default to `false` when used in a server-side rendering environment and only update when hooks run on the client.

The advantage to this hook is it that does not cause unnecessary re-renders when scrolling; it does the scroll comparison outside of React.
