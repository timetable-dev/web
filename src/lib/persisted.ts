import type { Entity } from "./types";
import { PersistedState } from "runed";
import * as v from "valibot"

type Serializer<T> = {
    serialize: (value: T) => string;
    deserialize: (value: string) => T | undefined;
};

const AddedEntitiesSchema = v.array(
    v.object({
        id: v.pipe(v.string(), v.uuid()),
        name: v.string(),
        type: v.union([v.literal("group"), v.literal("teacher")]),
        mslu_id: v.union([v.string(), v.number()]),
    }),
);

const ShowDebugSchema = v.boolean()

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

const debugSerializer: Serializer<boolean> = {
    deserialize: (value: string): boolean => {
        try {
            const showDebug = v.parse(ShowDebugSchema, JSON.parse(value));
            return showDebug;
        } catch (err) {
            console.warn(err, "Error parsing local storage. Fallback to false.");
            return false;
        }
    },
    serialize: (value: boolean): string => {
        try {
            const showDebug = v.parse(ShowDebugSchema, value);
            return JSON.stringify(showDebug);
        } catch (err) {
            console.warn(
                err,
                "Error serializing provided value. Written false to local storage.",
            );
            return "false";
        }
    },
};

export const addedEntities = new PersistedState<Entity[]>("added_entities", [], {
    serializer: entitiesSerializer,
});

export const showDebug = new PersistedState<boolean>("show_debug", false, {
    serializer: debugSerializer,
});