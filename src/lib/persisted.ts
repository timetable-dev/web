import type { Entity } from "./types";
import { PersistedState } from "runed";
import { z } from "zod";

const AddedEntities = z.array(
    z.object({
        id: z.uuid(),
        name: z.string(),
        type: z.union([z.literal("group"), z.literal("teacher")]),
        mslu_id: z.union([z.string(), z.number()]),
    }),
);

type Serializer<T> = {
    serialize: (value: T) => string;
    deserialize: (value: string) => T | undefined;
};

const entitiesSerializer: Serializer<Entity[]> = {
    deserialize: (value: string): Entity[] => {
        try {
            const entities = AddedEntities.parse(JSON.parse(value));
            return entities;
        } catch (err) {
            console.warn(err, "Error parsing local storage. Fallback to empty list.");
            return [];
        }
    },
    serialize: (value: Entity[]): string => {
        try {
            const entities = AddedEntities.parse(value);
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
