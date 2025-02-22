---
title: "Zustand Draft Store"
description: "Update your store in batch through a clone"
pubDate: "Feb 22 2025"
tags: ["zustand"]
implementation: "draft-store.tsx"
usage: "draft-store.example.tsx"
---

## Context

This allows for a store to be updated in batch by modifying state in a cloned store and pushing to the original store when ready.

This is particularly useful in user interfaces when you don't want updates to a store in a UI to proprogate before the user has finished.

- `createDraftStore` will immediately wrap and create a copy of the store with the additional methods.
- `createDraftStoreContext` will call `createDraftStore` within a React provider.

If the original store is modifed when a draft store instance is living, the draft store will _not_ be updated.

On `push()`, the **entire** store will be updated, including state that has _not_ been modified.
