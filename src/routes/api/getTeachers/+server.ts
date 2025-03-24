import { json, error } from "@sveltejs/kit";
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async (): Promise<Response> => {

    // Requesting MSLU backend
    let res = await fetch("http://schedule.mslu.by/backend/getTeacherNames");
    
    // Convert the answer to the desired form and return the list of groups

    interface Teachers {
        value: string;
        label: string;
    }

    let teachers: Teachers[] = [];

    if (res.ok) {
        let data = await res.json();
        for (let dataTeacher of data.data) {
            teachers.push({value: dataTeacher.IdTeacher, label: dataTeacher.FIO_teacher})
        }
    } else {
        console.error(res.status, res.statusText);
        return error(503, "Ошибка связи с сервером МГЛУ.");
    }

    return json(teachers, {status: 200})
}