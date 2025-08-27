import { today, startOfWeek, endOfWeek, parseDate } from "@internationalized/date";
import type { Lesson, WeekData, DayName, WeekType } from "$lib/types";
import * as v from "valibot";

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

export function getWeekBoundaries(week: WeekType): { weekStart: string; weekEnd: string } {
    const currentDate = today("Europe/Minsk");
    const currentWeekStart = startOfWeek(currentDate, "ru-RU", "mon");
    const currentWeekEnd = endOfWeek(currentDate, "ru-RU", "mon");

    let offsetDays: number;
    switch (week) {
        case "currentWeek":
            offsetDays = 0;
            break;
        case "nextWeek":
            offsetDays = 7;
            break;
        case "thirdWeek":
            offsetDays = 14;
            break;
        case "fourthWeek":
            offsetDays = 21;
            break;
    }

    return {
        weekStart: currentWeekStart.add({ days: offsetDays }).toString(),
        weekEnd: currentWeekEnd.add({ days: offsetDays }).toString(),
    };
}

export function getWeekSpan(week: WeekType): string[] {
    const { weekStart, weekEnd } = getWeekBoundaries(week);
    const start = parseDate(weekStart);
    return Array.from([0, 1, 2, 3, 4, 5], (i) => start.add({ days: i }).toString());
}

// Function to validate and transform MSLU response
export function transform(data: any, type: "group" | "teacher", week: WeekType): WeekData {
    // Validate data with Valibot
    const validatedItems = v.parse(MsluDataSchema, data);

    // Group by day
    const groupedItems = Object.groupBy(validatedItems, (item) => item.day);

    const weekSpan = getWeekSpan(week);

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

    const weekBoundaries = getWeekBoundaries(week);

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
                    `${item.teacherN ? item.teacherN[0] : ""}. ${item.teacherO ? item.teacherO[0] : ""}. ${item.teacherF ?? ""}`.trim(),
                teacherFull: `${item.teacherF ?? ""} ${item.teacherN ?? ""} ${item.teacherO ?? ""}`.trim(),
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
