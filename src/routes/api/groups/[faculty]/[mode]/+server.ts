// import { MSLU_BACKEND_ENDPOINT } from '$env/static/private';
import type { RequestHandler } from "./$types";
import { MSLU_BACKEND_ENDPOINT } from "$env/static/private";
import { json, error } from "@sveltejs/kit";
import * as v from "valibot";

const MsluResponseSchema = v.array(
    v.object({
        idGroup: v.number(),
        name: v.string(),
        idF: v.number(),
        facultName: v.string(),
        idFormaTime: v.number(),
        year: v.number(),
    }),
);

export const GET: RequestHandler = async ({ params }): Promise<Response> => {
    const endpoint = MSLU_BACKEND_ENDPOINT;
    const faculty = params.faculty;
    const mode = params.mode;

    // Requesting MSLU backend
    let groupUrl = new URL(`${endpoint}/api/searchGroups`);
    groupUrl.searchParams.append("idF", faculty);
    groupUrl.searchParams.append("idFormaTime", mode);
    groupUrl.searchParams.append("query", "");

    let res: Response;

    try {
        res = await fetch(groupUrl, { signal: AbortSignal.timeout(15000) });
    } catch {
        console.error("Timeout error");
        return error(503, { message: "Service Unavailable", user_message: "Сервер БГУИЯ вне зоны доступа." });
    }

    // Checking if the response is ok
    if (!res.ok) {
        console.error(res.status, res.statusText);
        return error(503, { message: "Service Unavailable", user_message: "Сервер БГУИЯ вне зоны доступа." });
    }

    try {
        const data = await res.json(); // Parse the response as JSON
        const parsedData = v.parse(MsluResponseSchema, data); // Validate its structure
        const groups = parsedData.map(
            // Map the data to SelectItem format
            ({ idGroup, name, year }) => ({
                value: idGroup,
                label: `${name} ${year}`,
            }),
        );
        console.info("Fetched groups from MSLU backend.");
        return json(groups, { status: 200 });
    } catch (err) {
        console.error("Error parsing MSLU response:", err);
        return error(503, { message: "Service Unavailable", user_message: "Неверный ответ сервера БГУИЯ." });
    }
};
