---
title: "Tracked Values"
description: "Persist prior state by conditions"
pubDate: "Jul 28 2025"
tags: ["react"]
collection: "react"
implementation: ["use-track-value.ts", "use-throwing-transform-track-value.ts"]
usage: ["use-track-value.example.tsx", "use-throwing-transform-track-value.example.tsx"]
---

## Context

Basic hook to check if scroll position of the specified element ref has exceeded a threshold. If an elements is not specified, `window.scrollY` is used. The threshold is _not_ inclusive.

This hook will default to `false` when used in a server-side rendering environment and only update when hooks run on the client.

The advantage to this hook is it that does not cause unnecessary re-renders when scrolling; it does the scroll comparison outside of React.
