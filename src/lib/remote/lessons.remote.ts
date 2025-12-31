import type { Lesson, WeekData, DayName, DebugData, LessonsResponse } from "$lib/types";
import { today, startOfWeek, endOfWeek, parseDate } from "@internationalized/date";
import { MSLU_BACKEND_ENDPOINT } from "$env/static/private";
import { query } from '$app/server';
import { error } from "@sveltejs/kit";
import * as v from "valibot";


// Schemas

const MsluDataSchema = v.array(
    v.object({
        dateIn: v.pipe(v.string(), v.isoDate()),
        dateOut: v.pipe(v.string(), v.isoDate()),
        timeIn: v.pipe(v.string(), v.isoTime()),
        timeOut: v.pipe(v.string(), v.isoTime()),

        lessonNumber: v.number(), // TODO: Check lesson number to time

        day: v.union([
            v.literal("Понедельник"),
            v.literal("Вторник"),
            v.literal("Среда"),
            v.literal("Четверг"),
            v.literal("Пятница"),
            v.literal("Суббота"),
        ]),
        dayNumber: v.pipe(v.number(), v.integer(), v.minValue(1), v.maxValue(6)),

        classroom: v.string(),

        discipline: v.string(),
        disciplineFull: v.string(),
        disciplineType: v.string(),
        disciplineTypeId: v.number(),

        // Absent for teachers
        teacherF: v.optional(v.string()),
        teacherN: v.optional(v.string()),
        teacherO: v.optional(v.string()),
        teacherNamePost: v.optional(v.string()),
        groupName: v.string(),

        // Fields I don't care about
        idSchedule: v.number(),
        faculty: v.string(),
        idF: v.number(),
        idGroup: v.number(),
    }),
);

const LessonsRequestSchema = v.object({
    id: v.string(),
    type: v.union([v.literal("group"), v.literal("teacher")]),
    weekOffset: v.pipe(v.string(), v.toNumber()),
})


// Helper functions

function getWeekBoundaries(weekOffset: number): { weekStart: string; weekEnd: string } {
    const currentDate = today("Europe/Minsk");
    const currentWeekStart = startOfWeek(currentDate, "ru-RU", "mon");
    const currentWeekEnd = endOfWeek(currentDate, "ru-RU", "mon");

    let offsetDays = weekOffset * 7;

    return {
        weekStart: currentWeekStart.add({ days: offsetDays }).toString(),
        weekEnd: currentWeekEnd.add({ days: offsetDays }).toString(),
    };
}

function getWeekSpan(weekOffset: number): string[] {
    const { weekStart, weekEnd } = getWeekBoundaries(weekOffset);
    const start = parseDate(weekStart);
    return Array.from([0, 1, 2, 3, 4, 5], (i) => start.add({ days: i }).toString());
}

// Function to validate and transform MSLU response
function transform(data: any, type: "group" | "teacher", weekOffset: number): WeekData {
    // Validate data with Valibot
    const validatedItems = v.parse(MsluDataSchema, data);

    // Group by day
    const groupedItems = Object.groupBy(validatedItems, (item) => item.day);

    const weekSpan = getWeekSpan(weekOffset);

    const weekData: WeekData = {
        Понедельник: { lessons: [], date: weekSpan[0] },
        Вторник: { lessons: [], date: weekSpan[1] },
        Среда: { lessons: [], date: weekSpan[2] },
        Четверг: { lessons: [], date: weekSpan[3] },
        Пятница: { lessons: [], date: weekSpan[4] },
        Суббота: { lessons: [], date: weekSpan[5] },
    };

    // Day names and their numbers to check later
    const dayNameToNumber: Record<DayName, number> = {
        Понедельник: 1,
        Вторник: 2,
        Среда: 3,
        Четверг: 4,
        Пятница: 5,
        Суббота: 6,
    };

    const weekBoundaries = getWeekBoundaries(weekOffset);

    for (const [day, items] of Object.entries(groupedItems)) {
        // Check DayName <-> DayNumber consistency
        for (const item of items) {
            if (item.dayNumber !== dayNameToNumber[day as DayName]) {
                throw new Error("Inconsistent Day and DayNumber");
            }
        }

        // Check that all dateIn and dateOut are the same and correspond to current's week mon and sun
        // const dateInSet = new Set(items.map((item) => item.dateIn));
        // const dateOutSet = new Set(items.map((item) => item.dateOut));
        // if (dateInSet.size !== 1 || dateOutSet.size !== 1 || items[0].dateIn !== weekBoundaries.weekStart || items[0].dateOut !== weekBoundaries.weekEnd) {
        //     throw new Error("Inconsistent or unexpected DateIn/DateOut values");
        // }

        // For groups, keep each lesson as is
        if (type === "group") {
            weekData[day as DayName].lessons = items.map((item) => ({
                start_time: item.timeIn,
                end_time: item.timeOut,
                title: item.discipline,
                titleFull: item.disciplineFull,
                type: item.disciplineType,
                groups: [item.groupName],
                teacher:
                    `${item.teacherNamePost} ${item.teacherN ? item.teacherN[0] : ""}. ${item.teacherO ? item.teacherO[0] : ""}. ${item.teacherF ?? ""}`.trim(),
                teacherFull: `${item.teacherNamePost} ${item.teacherN ?? ""} ${item.teacherO ?? ""} ${item.teacherF ?? ""}`.trim(),
                room: item.classroom,
            }));

        // For teachers, combine groups for the same lesson
        } else {
            const lessons: Lesson[] = [];
            for (const item of items) {
                const existing = lessons.find(
                    (lesson) =>
                        lesson.start_time === item.timeIn &&
                        lesson.end_time === item.timeOut &&
                        lesson.title === item.discipline &&
                        lesson.titleFull === item.disciplineFull &&
                        lesson.type === item.disciplineType &&
                        lesson.room === item.classroom,
                );
                if (existing) {
                    existing.groups.push(`${item.groupName} ${item.faculty}`);
                } else {
                    lessons.push({
                        start_time: item.timeIn,
                        end_time: item.timeOut,
                        title: item.discipline,
                        titleFull: item.disciplineFull,
                        type: item.disciplineType,
                        room: item.classroom,
                        groups: [item.groupName],
                    });
                }
            }
            weekData[day as DayName].lessons = lessons;
        }
    }

    return weekData;
}

// Main function
export const getLessons = query(LessonsRequestSchema, async (params): Promise<LessonsResponse> => {

    const { weekStart, weekEnd } = getWeekBoundaries(params.weekOffset);

    const debugData: DebugData = {};

    const fetchUrl = new URL(MSLU_BACKEND_ENDPOINT);

    if (params.type === "group") {
        fetchUrl.pathname = "/api/api/groupschedule";
        fetchUrl.searchParams.append("startDate", weekStart);
        fetchUrl.searchParams.append("endDate", weekEnd);
        fetchUrl.searchParams.append("idGroup", params.id);
    } else {
        fetchUrl.pathname = "/api/api/teacherschedule";
        fetchUrl.searchParams.append("startDate", weekStart);
        fetchUrl.searchParams.append("endDate", weekEnd);
        fetchUrl.searchParams.append("idTeacher", params.id);
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

    // Timeout error (15 seconds)
    } catch(err) {
        console.error(err);
        throw error(503, "Сервер БГУИЯ не отвечает.");
    }

    debugData.mslu_response = performance.now() - msluRequestStart;

    // Checking if the response is ok
    if (!res.ok) {
        console.error(res.status, res.statusText);
        throw error(503, "Сервер БГУИЯ вне зоны доступа.");
    }

    let weekData: WeekData;
    const data = await res.json();

    const transformStart = performance.now();

    try {
        // Magic happens here
        weekData = transform(data, params.type, params.weekOffset);
    } catch (err) {
        // In case BSUFL backend response's structure is unexpected
        console.error("Error parsing MSLU response:", err);
        throw error(503, "Неверный ответ сервера БГУИЯ.");
    }
    debugData.data_transform = performance.now() - transformStart;

    return {
        week: weekData,
        debug: debugData,
    };
});
