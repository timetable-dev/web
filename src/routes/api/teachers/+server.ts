// import { MSLU_BACKEND_ENDPOINT } from '$env/static/private';
import type { RequestHandler } from "./$types";
import { MSLU_BACKEND_ENDPOINT } from "$env/static/private";
import { json, error } from "@sveltejs/kit";
import * as v from "valibot";

const MsluResponseSchema = v.object({
    data: v.array(
        v.object({
            IdTeacher: v.number(),
            FIO_teacher: v.string(),
        })
    )
})

export const GET: RequestHandler = async (): Promise<Response> => {
    const endpoint = MSLU_BACKEND_ENDPOINT;
    const res = await fetch(`${endpoint}/backend/getTeacherNames`);

    // Checking if the response is ok
    if (!res.ok) {
        console.error(res.status, res.statusText);
        return error(503, "Ошибка связи с сервером МГЛУ.");
    }

    try {
        const data = await res.json(); // Parse the response as JSON
        const parsedData = v.parse(MsluResponseSchema, data); // Validate its structure
        const teachers = parsedData.data.map(
            // Map the data to SelectItem format
            ({ IdTeacher, FIO_teacher }) => ({
                value: IdTeacher,
                label: FIO_teacher,
            }),
        );
        console.info("Fetched teachers from MSLU backend.");
        return json(teachers, { status: 200 });
    } catch (err) {
        console.error("Error parsing MSLU response: ", err);
        return error(503, "Неверный ответ сервера МГЛУ.");
    }
};
