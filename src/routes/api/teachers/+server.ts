// import { MSLU_BACKEND_ENDPOINT } from '$env/static/private';
import type { RequestHandler } from "./$types";
import { MSLU_BACKEND_ENDPOINT } from "$env/static/private";
import { json, error } from "@sveltejs/kit";
import * as v from "valibot";

const MsluResponseSchema = v.array(
    v.object({
        idTeacher: v.number(),
        nameF: v.string(),
        nameI: v.string(),
        nameO: v.string(),
        isDeleted: v.boolean(),
        namePost: v.string(),
    }),
);

export const GET: RequestHandler = async (): Promise<Response> => {
    const endpoint = MSLU_BACKEND_ENDPOINT;

    let res: Response;

    try {
        res = await fetch(`${endpoint}/api/searchTeachers?query=`, { signal: AbortSignal.timeout(15000) });
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
        const teachers = parsedData.map(
            // Map the data to SelectItem format
            ({ idTeacher, nameF, nameI, nameO }) => ({
                value: idTeacher,
                label: `${nameF} ${nameI} ${nameO}`,
            }),
        );
        console.info("Fetched teachers from MSLU backend.");
        return json(teachers, { status: 200 });
    } catch (err) {
        console.error("Error parsing MSLU response: ", err);
        return error(503, { message: "Service Unavailable", user_message: "Неверный ответ сервера БГУИЯ." });
    }
};
