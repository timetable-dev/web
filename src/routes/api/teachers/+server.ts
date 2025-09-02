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
        res = await fetch(`${endpoint}/api/api/searchTeachers?query=`, {
            signal: AbortSignal.timeout(15000),
            credentials: "omit",
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:142.0) Gecko/20100101 Firefox/142.0",
                "Accept": "application/json",
                "Accept-Language": "en-US,en;q=0.5",
                "X-Request-Origin": "http://www.timetable.bsufl.by",
                "X-Timestamp": Date.now().toString(),
                "X-Request-Id": crypto.randomUUID(),
                "Sec-GPC": "1",
                "Priority": "u=4",
                "Pragma": "no-cache",
                "Cache-Control": "no-cache"
            },
            referrer: "http://www.timetable.bsufl.by/",
            method: "GET",
            mode: "cors",
        });
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
