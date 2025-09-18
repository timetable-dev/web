import { MSLU_BACKEND_ENDPOINT } from "$env/static/private";
import { type ResponseEntity } from "$lib/types";
import { query } from '$app/server';
import * as v from "valibot";
import { error } from "@sveltejs/kit";

const GroupResponseSchema = v.array(
    v.object({
        idGroup: v.number(),
        name: v.string(),
        idF: v.number(),
        facultName: v.string(),
        idFormaTime: v.number(),
        year: v.number(),
    }),
);

const TeacherResponseSchema = v.array(
    v.object({
        idTeacher: v.number(),
        nameF: v.string(),
        nameI: v.string(),
        nameO: v.string(),
        isDeleted: v.boolean(),
        namePost: v.string(),
    }),
);

const GroupRequestSchema = v.object({
    faculty: v.string(),
    mode: v.union([v.literal("0"), v.literal("1")]),
})


export const getGroups = query(GroupRequestSchema, async (params): Promise<ResponseEntity[]> => {

    // Composing BSUFL backend url
    let groupUrl = new URL(`${MSLU_BACKEND_ENDPOINT}/api/api/searchGroups`);
    groupUrl.searchParams.append("idF", params.faculty);
    groupUrl.searchParams.append("idFormaTime", params.mode);
    groupUrl.searchParams.append("query", "");

    let res: Response;

    // Requesting BSUFL backend
    try {
        res = await fetch(groupUrl, {
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

    // Timeout error (15 seconds)
    } catch(err) {
        console.error(err);
        throw error(503, "Сервер БГУИЯ не отвечает.");
    }

    // Checking if the response is ok
    if (!res.ok) {
        console.error(res.status, res.statusText);
        throw error(503, "Сервер БГУИЯ вне зоны доступа.");
    }

    try {
        // Parsing the response as JSON and validating its structure
        const data = await res.json();
        const parsedData = v.parse(GroupResponseSchema, data);

        // Mapping the data to ResponseEntity format and returning
        return parsedData.map(
            (group) => ({
                id: group.idGroup.toString(),
                name: `${group.name} ${group.year}`,
                label: group.name,
                base64: Buffer.from(JSON.stringify(group)).toString('base64url'),
            }),
        );

    // In case BSUFL backend response's structure is unexpected
    } catch (err) {
        console.error("Error parsing MSLU response:", err);
        throw error(503, "Неверный ответ сервера БГУИЯ.");
    }
});


export const getTeachers = query(async (): Promise<ResponseEntity[]> => {

    let res: Response;

    // Requesting BSUFL backend
    try {
        res = await fetch(`${MSLU_BACKEND_ENDPOINT}/api/api/searchTeachers?query=`, {
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

    // Timeout error (15 seconds)
    } catch(err) {
        console.error(err);
        throw error(503, "Сервер БГУИЯ не отвечает.")
    }

    // Checking if the response is ok
    if (!res.ok) {
        console.error(res.status, res.statusText);
        throw error(503, "Сервер БГУИЯ вне зоны доступа.");
    }

    /** Shorthand for composing teacher's full name from fist, last and middle names */
    function getFullName (f: string, i: string, o: string) {
        return `${f} ${i} ${o.length > 1 ? o : ""}`.trim();
    }

    /** Shorthand for composing teacher's shortened name from fist, last and middle names */
    function getShortenedName (f: string, i: string, o: string) {
        return i.length > 0 && o.length > 1
               ? `${i[0]}. ${o[0]}. ${f}` // Russian name
               : `${f} ${i}`              // Foreign name
    }

    try {
        // Parsing the response as JSON and validating its structure
        const data = await res.json();
        const parsedData = v.parse(TeacherResponseSchema, data);

        // Mapping the data to ResponseEntity format and returning
        return parsedData.map(
            (teacher) => ({
                id: teacher.idTeacher.toString(),
                name: getFullName(teacher.nameF, teacher.nameI, teacher.nameO),
                label: getShortenedName(teacher.nameF, teacher.nameI, teacher.nameO),
                base64: Buffer.from(JSON.stringify(teacher)).toString('base64url'),
            })
        )

    // In case BSUFL backend response's structure is unexpected
    } catch (err) {
        console.error("Error parsing MSLU response:", err);
        throw error(503, "Неверный ответ сервера БГУИЯ.");
    }
});