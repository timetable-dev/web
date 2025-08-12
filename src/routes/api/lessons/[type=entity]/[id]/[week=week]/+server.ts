import type { RequestHandler } from "./$types";
import type { WeekData, DebugData, LessonsApiResponse } from "$lib/types";
import { MSLU_BACKEND_ENDPOINT } from "$env/static/private";
import { transform } from "./transform";
import { json, error } from "@sveltejs/kit";

export const GET: RequestHandler = async ({ params }): Promise<Response> => {
    const id = params.id;
    const type = params.type;
    const week = params.week;

    const debugData: DebugData = {}

    const fetchUrl = new URL(MSLU_BACKEND_ENDPOINT);

    if (type === "group") {
        fetchUrl.pathname = "/backend";
        fetchUrl.searchParams.append("groupId", id);
    } else {
        fetchUrl.pathname = "/backend/teachers";
        fetchUrl.searchParams.append("teacherId", id);
    }

    fetchUrl.searchParams.append("weekType", week);

    const msluRequestStart = performance.now();
    const res = await fetch(fetchUrl);
    debugData.mslu_response = performance.now() - msluRequestStart;

    if (!res.ok) {
        console.error(res.status, res.statusText);
        return error(503, "Сервер МГЛУ вне зоны доступа.");
    }

    let weekData: WeekData;
    const data = await res.json().then((data) => data.data);

    const transformStart = performance.now();
    try {
        weekData = transform(data, type); // Magic happens here, see transform.ts
    } catch (err) {
        console.error(err);
        return error(503, "Неверный ответ сервера МГЛУ.");
    }
    debugData.data_transform = performance.now() - transformStart;

    const response: LessonsApiResponse = {
        week: weekData,
        debug: debugData,
    };

    return json(response);
};
