---
title: "Zustand Store Provider"
description: "Wrapper to scope your stores via a React context"
pubDate: "Feb 22 2025"
tags: ["zustand"]
implementation: "provider.tsx"
usage: "provider.example.tsx"
---

## Context

This allows for your stores to be scoped via a React context. It exports a function to wrap your store with any arguments being forwarded through props.

The default behaviour of the exported `use` hook will throw if no provider is in scope.

If you need direct access to the `StoreApi`, you can `.useRoot()` on the hook. This is rarely necessary and only needed for using `.getState` and `.setState` on the store.
