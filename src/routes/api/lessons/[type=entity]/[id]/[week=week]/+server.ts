import type { RequestHandler } from "./$types";
import type { WeekData, DebugData, LessonsApiResponse } from "$lib/types";
import { MSLU_BACKEND_ENDPOINT } from "$env/static/private";
import { transform, getWeekBoundaries } from "./utils";
import { json, error } from "@sveltejs/kit";

export const GET: RequestHandler = async ({ params }): Promise<Response> => {
    const id = params.id;
    const type = params.type;
    const week = params.week;

    const { weekStart, weekEnd } = getWeekBoundaries(params.week);

    const debugData: DebugData = {};

    const fetchUrl = new URL(MSLU_BACKEND_ENDPOINT);

    if (type === "group") {
        fetchUrl.pathname = "/api/api/groupschedule";
        fetchUrl.searchParams.append("startDate", weekStart);
        fetchUrl.searchParams.append("endDate", weekEnd);
        fetchUrl.searchParams.append("idGroup", id);
    } else {
        fetchUrl.pathname = "/api/api/teacherschedule";
        fetchUrl.searchParams.append("startDate", weekStart);
        fetchUrl.searchParams.append("endDate", weekEnd);
        fetchUrl.searchParams.append("idTeacher", id);
    }

    const msluRequestStart = performance.now();
    let res: Response;
    try {
        res = await fetch(fetchUrl, {
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
    debugData.mslu_response = performance.now() - msluRequestStart;

    if (!res.ok) {
        console.error(res.status, res.statusText);
        return error(503, { message: "Service Unavailable", user_message: "Сервер БГУИЯ вне зоны доступа." });
    }

    let weekData: WeekData;
    const data = await res.json();

    const transformStart = performance.now();
    try {
        weekData = transform(data, type, week); // Magic happens here, see transform.ts
    } catch (err) {
        console.error(err);
        return error(503, { message: "Service Unavailable", user_message: "Неверный ответ сервера БГУИЯ." });
    }
    debugData.data_transform = performance.now() - transformStart;

    const response: LessonsApiResponse = {
        week: weekData,
        debug: debugData,
    };

    return json(response);
};
