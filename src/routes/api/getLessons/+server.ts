// NOTE: This api route is deprecated but was left for now just in case

import { json, error, type RequestHandler } from "@sveltejs/kit";
import { forGroups, forTeachers } from "./utils";

export const GET: RequestHandler = async ({ url }): Promise<Response> => {

    // Search params
    const entityId = url.searchParams.get("entityId")
    const entityType = url.searchParams.get("entityType")
    const weekType = url.searchParams.get("weekType")

    let _fetchUrl: string;
    let _fetchParam: string;

    // Choosing MSLU endpoint and type param depending on the entity type
    // In case of search params invalid returning 400
    if (!entityId || !entityType || !weekType) {
        return error(400, "Query params must include entityId, entityType and weekType.")
    } else if (entityType === "group") {
        _fetchUrl = "http://schedule.mslu.by/backend/";
        _fetchParam = "groupId"
    } else if (entityType === "teacher") {
        _fetchUrl = "http://schedule.mslu.by/backend/teachers";
        _fetchParam = "teacherId"
    } else {
        return error(400, "Param entityType must be either group or teacher.")
    }

    // Composing MSLU backend URL
    const fetchUrl = new URL(_fetchUrl);
    fetchUrl.searchParams.append(_fetchParam, entityId)
    fetchUrl.searchParams.append("weekType", weekType)

    // Requesting MSLU backend
    const res = await fetch(fetchUrl);
    let lessons;

    if (res.ok) {
        const data = await res.json().then((data) => data.data); // Array<{ [key: string]: string | number }>
        try {
            if (entityType == "group") {
                lessons = forGroups(data)
            } else if (entityType == "teacher") {
                lessons = forTeachers(data)
            }
        } catch (e) {
            return error(502, "Ошибка обработки данных с сервера МГЛУ.")
        }
    } else {
        return error(503, "Ошибка связи с сервером МГЛУ.");
    }

    return json(lessons)
}