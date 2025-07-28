import { z } from "zod";
import type { Lesson, WeekData, DayName } from "$lib/types";

// Давайте сразу предупрежу, вот эта вся ебатория, O которой я даже считать боюсь, нужна только потому, что я:
// а) не могу повлиять на вид ответа сервера МГЛУ и б) не хочу случайно показать людям неправильное расписание, ведь это сразу respect--,
// да и подставить кого-нибудь могу, пусть лучше увидят ошибку и на оф сайт пойдут. Поэтому я сначала проверяю всё зодом, потом сверяю что даты и номера дней совпадают,
// а потом ещё объединяю группы у преподов, потому что сервер их возвращает не списком, а по отдельности (бред, конечно, но что поделать).
// TODO: Можно ещё сверять, что среда это реально, допустим, 3 сентября, но это уже слишком, мне вообще фронт надо допиливать.

// Собственно, схема для валидации
const MsluDataSchema = z.array(z.object({

    TimeIn: z.iso.time(),
    TimeOut: z.iso.time(),
    DateIn: z.string(),
    DateOut: z.string(),

    Day: z.union([
        z.literal("Понедельник"),
        z.literal("Вторник"),
        z.literal("Среда"),
        z.literal("Четверг"),
        z.literal("Пятница"),
        z.literal("Суббота")]),
    DayNumber: z.number().int().gte(1).lte(6),

    Classroom: z.string(),
    Discipline: z.string(),
    Discipline_Type: z.string(),
    FIO_teacher: z.string().optional(), // Absent for teachers
    Group: z.string(),
    
    // Fields I don't care about
    Lesson: z.number(),
    Faculty: z.string(),
    IdGroup: z.string(),
    IdSchedule: z.number(),
}))

// Названия дней недели и их номера, чтобы потом сверять    
const dayNameToNumber: Record<DayName, number> = {
    "Понедельник": 1,
    "Вторник": 2,
    "Среда": 3,
    "Четверг": 4,
    "Пятница": 5,
    "Суббота": 6,
};

// Функция для трансформации данных в нужный формат
export function transform(data: any, type: "group" | "teacher"): WeekData {

    // Validate data with Zod
    const validatedItems = MsluDataSchema.parse(data);

    // Group by day
    const groupedItems = Object.groupBy(validatedItems, item => item.Day);

    const weekData: WeekData = {
        "Понедельник": { lessons: [], date: "" },
        "Вторник": { lessons: [], date: "" },
        "Среда": { lessons: [], date: "" },
        "Четверг": { lessons: [], date: "" },
        "Пятница": { lessons: [], date: "" },
        "Суббота": { lessons: [], date: "" },
    };

    for (const [day, items] of Object.entries(groupedItems)) {

        // Check DayName <-> DayNumber consistency
        for (const item of items) {
            if (item.DayNumber !== dayNameToNumber[day as DayName]) {
                throw new Error("Inconsistent Day and DayNumber");
            }
        }

        // Check that all DateIn and DateOut are the same and equal
        const dateInSet = new Set(items.map(item => item.DateIn));
        const dateOutSet = new Set(items.map(item => item.DateOut));
        if (dateInSet.size !== 1 || dateOutSet.size !== 1 || items[0].DateIn !== items[0].DateOut) {
            throw new Error("Inconsistent or different DateIn/DateOut values for day");
        }

        // For groups, keep each lesson as is
        if (type === "group") {
            weekData[day as DayName] = {
                date: items[0].DateIn,
                lessons: items.map(item => ({
                    start_time: item.TimeIn,
                    end_time: item.TimeOut,
                    title: item.Discipline,
                    type: item.Discipline_Type,
                    groups: [item.Group],
                    teacher: item.FIO_teacher,
                    room: item.Classroom,
                }))
            };

        // For teachers, combine groups for the same lesson
        } else {
            const lessons: Lesson[] = [];
            for (const item of items) {
                const existing = lessons.find(
                    lesson =>
                        lesson.start_time === item.TimeIn &&
                        lesson.end_time === item.TimeOut &&
                        lesson.title === item.Discipline &&
                        lesson.type === item.Discipline_Type &&
                        lesson.room === item.Classroom
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
