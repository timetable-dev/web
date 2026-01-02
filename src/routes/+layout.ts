import { Cached } from "$lib/cached";
import { savedEntities } from "./saved-entities.svelte";

export const ssr = false;

savedEntities.push(...Cached.loadSaved());