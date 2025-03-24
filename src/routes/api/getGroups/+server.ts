import { json, error } from "@sveltejs/kit";
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url }): Promise<Response> => {

    // Getting faculty and mode and checking their validity
    let facultyId = url.searchParams.get("facultyId")
    let educationMode = url.searchParams.get("educationMode")

    if (!facultyId || !educationMode) {
        return error(400, "Query params must include facultyId and educationMode.")
    }

    // Requesting MSLU backend
    let groupUrl = new URL("http://schedule.mslu.by/backend/buttonClicked")
    groupUrl.searchParams.append("facultyId", facultyId)
    groupUrl.searchParams.append("educationForm", educationMode)
    const res = await fetch(groupUrl);

    // Convert the answer to the desired form and return the list of groups

    interface Group {
        value: string;
        label: string;
    }

    let groups: Group[] = [];

    if (res.ok) {
        const data = await res.json();
        for (let dataGroup of data.data) {
            groups.push({value: dataGroup.IdGroup, label: dataGroup.Name})
        }
    } else {
        console.error(res.status, res.statusText);
        return error(503, "Ошибка связи с сервером МГЛУ.");
    }

    return json(groups, {status: 200})
}