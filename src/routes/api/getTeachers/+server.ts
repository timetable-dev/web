import { json, error } from "@sveltejs/kit";
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async (): Promise<Response> => {

    // const ENDPOINT = "http://schedule.mslu.by"
    // const ENDPOINT = "http://localhost:3000"
    const ENDPOINT = "https://bbaf9a53f261s823eb2e.containers.yandexcloud.net"

    // Requesting MSLU backend
    let res = await fetch(`${ENDPOINT}/backend/getTeacherNames`);
    
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