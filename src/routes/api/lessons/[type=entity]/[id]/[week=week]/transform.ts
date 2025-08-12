import type { Lesson, WeekData, DayName } from "$lib/types";
import * as v from "valibot"

const MsluDataSchema = v.array(
    v.object({
        // TimeIn: v.union([
        //     v.pipe(v.string(), v.isoTimeSecond()),
        //     v.pipe(v.string(), v.isoTimestamp()),
        // ]),
        TimeIn: v.pipe(v.string(), v.isoTimeSecond()),
        TimeOut: v.pipe(v.string(), v.isoTimeSecond()),
        DateIn: v.string(),
        DateOut: v.string(),

        Day: v.union([
            v.literal("Понедельник"),
            v.literal("Вторник"),
            v.literal("Среда"),
            v.literal("Четверг"),
            v.literal("Пятница"),
            v.literal("Суббота"),
        ]),
        DayNumber: v.pipe(v.number(), v.integer(), v.minValue(1), v.maxValue(6)),

        Classroom: v.string(),
        Discipline: v.string(),
        Discipline_Type: v.string(),
        FIO_teacher: v.optional(v.string()), // Absent for teachers
        Group: v.string(),

        // Fields I don't care about
        Lesson: v.number(),
        Faculty: v.string(),
        IdGroup: v.string(),
        IdSchedule: v.number(),
    }),
);

// Day names and their numbers to check later
const dayNameToNumber: Record<DayName, number> = {
    Понедельник: 1,
    Вторник: 2,
    Среда: 3,
    Четверг: 4,
    Пятница: 5,
    Суббота: 6,
};

// Function to validate and transform MSLU response 
export function transform(data: any, type: "group" | "teacher"): WeekData {
    // Validate data with Valibot
    const validatedItems = v.parse(MsluDataSchema, data);

    // Group by day
    const groupedItems = Object.groupBy(validatedItems, (item) => item.Day);

    const weekData: WeekData = {
        Понедельник: { lessons: [], date: "" },
        Вторник: { lessons: [], date: "" },
        Среда: { lessons: [], date: "" },
        Четверг: { lessons: [], date: "" },
        Пятница: { lessons: [], date: "" },
        Суббота: { lessons: [], date: "" },
    };

    for (const [day, items] of Object.entries(groupedItems)) {
        // Check DayName <-> DayNumber consistency
        for (const item of items) {
            if (item.DayNumber !== dayNameToNumber[day as DayName]) {
                throw new Error("Inconsistent Day and DayNumber");
            }
        }

        // Check that all DateIn and DateOut are the same and equal
        const dateInSet = new Set(items.map((item) => item.DateIn));
        const dateOutSet = new Set(items.map((item) => item.DateOut));
        if (dateInSet.size !== 1 || dateOutSet.size !== 1 || items[0].DateIn !== items[0].DateOut) {
            throw new Error("Inconsistent or different DateIn/DateOut values for day");
        }

        // For groups, keep each lesson as is
        if (type === "group") {
            weekData[day as DayName] = {
                date: items[0].DateIn,
                lessons: items.map((item) => ({
                    start_time: item.TimeIn,
                    end_time: item.TimeOut,
                    title: item.Discipline,
                    type: item.Discipline_Type,
                    groups: [item.Group],
                    teacher: item.FIO_teacher,
                    room: item.Classroom,
                })),
            };

        // For teachers, combine groups for the same lesson
        } else {
            const lessons: Lesson[] = [];
            for (const item of items) {
                const existing = lessons.find(
                    (lesson) =>
                        lesson.start_time === item.TimeIn &&
                        lesson.end_time === item.TimeOut &&
                        lesson.title === item.Discipline &&
                        lesson.type === item.Discipline_Type &&
                        lesson.room === item.Classroom,
                );
                if (existing) {
                    existing.groups.push(item.Group);
                } else {
                    lessons.push({
                        start_time: item.TimeIn,
                        end_time: item.TimeOut,
                        title: item.Discipline,
                        type: item.Discipline_Type,
                        room: item.Classroom,
                        groups: [item.Group],
                    });
                }
            }
            weekData[day as DayName] = {
                date: items[0].DateIn,
                lessons,
            };
        }
    }

    return weekData;
}
