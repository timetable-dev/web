import { json, error, type RequestHandler } from "@sveltejs/kit";
import { forGroups, forTeachers } from "./utils";
import { type TimetableData, type Lesson } from "$lib/types";

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
            } else {
                return error(502, "Ошибка обработки данных с сервера МГЛУ.")
            }
        } catch (e) {
            return error(502, "Ошибка обработки данных с сервера МГЛУ.")
        }
    } else {
        return error(503, "Сервер МГЛУ вне зоны доступа.");
    }

    // Composing timetable data
    const timetableData: TimetableData = {
        mon: [],
        tue: [],
        wed: [],
        thu: [],
        fri: [],
        sat: [],
    } // NOTE: How about moving this to a class constructor

    for (const lesson of lessons) {
        if (lesson.day_number === 1) {
            timetableData.mon.push(lesson)
        } else if (lesson.day_number === 2) {
            timetableData.tue.push(lesson)
        } else if (lesson.day_number === 3) {
            timetableData.wed.push(lesson)
        } else if (lesson.day_number === 4) {
            timetableData.thu.push(lesson)
        } else if (lesson.day_number === 5) {
            timetableData.fri.push(lesson)
        } else if (lesson.day_number === 6) {
            timetableData.sat.push(lesson)
        } else {
            return error(502, "Ошибка обработки данных с сервера МГЛУ.")
        }
    }

    return json(timetableData)
}