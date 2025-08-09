import type { Entity } from "./types";
import { PersistedState } from "runed";
import * as v from "valibot"

const AddedEntitiesSchema = v.array(
    v.object({
        id: v.pipe(v.string(), v.uuid()),
        name: v.string(),
        type: v.union([v.literal("group"), v.literal("teacher")]),
        mslu_id: v.union([v.string(), v.number()]),
    }),
);

type Serializer<T> = {
    serialize: (value: T) => string;
    deserialize: (value: string) => T | undefined;
};

const entitiesSerializer: Serializer<Entity[]> = {
    deserialize: (value: string): Entity[] => {
        try {
            const entities = v.parse(AddedEntitiesSchema, JSON.parse(value));
            return entities;
        } catch (err) {
            console.warn(err, "Error parsing local storage. Fallback to empty list.");
            return [];
        }
    },
    serialize: (value: Entity[]): string => {
        try {
            const entities = v.parse(AddedEntitiesSchema, value);
            return JSON.stringify(entities);
        } catch (err) {
            console.warn(
                err,
                "Error serializing provided object. Written empty list to local storage.",
            );
            return "[]";
        }
    },
};

export const addedEntities = new PersistedState<Entity[]>("added_entities", [], {
    serializer: entitiesSerializer,
});
