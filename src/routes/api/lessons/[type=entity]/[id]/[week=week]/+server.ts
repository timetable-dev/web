import type { RequestHandler } from './$types';
import type { TimetableData } from "$lib/types";
import { forGroups, forTeachers } from "./utils";
import { json, error } from "@sveltejs/kit";
import { MSLU_BACKEND_ENDPOINT } from '$env/static/private';

export const GET: RequestHandler = async ({ params }): Promise<Response> => {

    const id = params.id;
    const type = params.type;
    const week = params.week;

    const fetchUrl = new URL(MSLU_BACKEND_ENDPOINT || "http://schedule.mslu.by");

    if (type === "group") {
        fetchUrl.pathname = "/backend";
        fetchUrl.searchParams.append("groupId", id);
    } else {
        fetchUrl.pathname = "/backend/teachers";
        fetchUrl.searchParams.append("teacherId", id);
    }

    fetchUrl.searchParams.append("weekType", week);
    const res = await fetch(fetchUrl);

    if (!res.ok) {
        console.error(res.status, res.statusText);
        return error(503, "Сервер МГЛУ вне зоны доступа.");
    }

    let lessons;
    const data = await res.json().then((data) => data.data);
    
    try {
        if (type === "group") {
            lessons = forGroups(data);
        } else {
            lessons = forTeachers(data);
        }
    } catch (err) {
        console.error(err);
        return error(503, "Неверный ответ сервера МГЛУ.");
    }

    const timetableData: TimetableData = {
        mon: [],
        tue: [],
        wed: [],
        thu: [],
        fri: [],
        sat: [],
    }

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
            return error(503, "Неверный ответ сервера МГЛУ.")
        }
    }

    return json(timetableData)
}