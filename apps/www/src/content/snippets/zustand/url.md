---
title: "Zustand URL Storage"
description: "Store your store's state in a search parameter"
pubDate: "Feb 22 2025"
tags: ["zustand"]
dependencies: ["../state-serialization.ts"]
implementation: "url.ts"
usage: "url.example.ts"
---

## Context

Allows you to store your state within `window.location.search`. It uses the `state-serialization` snippet, which utilizes `superjson` (_subject to change_) for stringifying and parsing.
This means `Date`, `Map`, `Set` and `BigInt` can be safely stored.
