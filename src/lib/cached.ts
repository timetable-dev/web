import type { SavedEntity, WeekData } from "./types";
import * as v from "valibot";

const SavedEntitiesSchema = v.array(
    v.object({
        uuid: v.pipe(v.string(), v.uuid()),
        name: v.string(),
        type: v.union([v.literal("group"), v.literal("teacher")]),
        bsuflId: v.string(),
        base64: v.string(),
        customName: v.string(),
    }),
);

export class Cached {

    static #localStorageKey = "saved_entities";

    static loadSaved(): SavedEntity[] {
        const localStorageData = localStorage.getItem(this.#localStorageKey);
        try {
            return v.parse(SavedEntitiesSchema, JSON.parse(localStorageData || ""));
        } catch (err) {
            console.warn(err, "Error parsing local storage. Fallback to empty list.");
            return [];
        }
    }

    static loadSavedEntity(entityUuid: string): SavedEntity | undefined {
        return this.loadSaved().find(({ uuid }) => uuid === entityUuid);
    }

    static updateSaved(entities: SavedEntity[]) {
        try {
            const validatedEntities = v.parse(SavedEntitiesSchema, entities);
            localStorage.setItem(this.#localStorageKey, JSON.stringify(validatedEntities))
        } catch (err) {
            console.warn(err, "Error parsing or writing object provided. Local storage not modified.");
        }
    }

    static saveWeek(uuid: string, offset: number): void {

    }

    static loadWeek(uuid: string, offset: number): WeekData | null {
        return null
    }
}