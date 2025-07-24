import type { ParamMatcher } from '@sveltejs/kit';

export const match = ((param: string): param is ("group" | "teacher") => {
    return param === "group" || param === "teacher";
}) satisfies ParamMatcher;