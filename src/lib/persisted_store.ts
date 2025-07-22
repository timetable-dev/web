import type { Entity } from "./types";
import { persisted } from 'svelte-persisted-store'

// TODO: Invent a way of local data validation, e.g. using zod.
// In case data was corrupted by my code or by an investigating user
// and cannot be parsed as Entities[] replace it with [] and continue.
// Probably should overwrite serializer option of Persisted (defaults to JSON)
// to some custom made or use devalue with some error handling.
// 
// Also, how about copy-pasting the code of svelte-persisted-store to this file?
// It will remove one dependency and (maybe) svelte version conflict warning.
// This way zod can be used directly while parsing (+ throw error when writing non-Entity).

export const addedEntities = persisted<Entity[]>("entities", [])