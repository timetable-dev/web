import type { ParamMatcher } from "@sveltejs/kit";

export const match = ((
	param: string
): param is "currentWeek" | "nextWeek" | "thirdWeek" | "fourthWeek" => {
	return ["currentWeek", "nextWeek", "thirdWeek", "fourthWeek"].includes(param);
}) satisfies ParamMatcher;
