import { z } from "zod";
import type { Lesson } from "$lib/types";

const MsluDataSchema = z.array(z.object({

    TimeIn: z.iso.time(),
    TimeOut: z.iso.time(),

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
    DateIn: z.string(),
    DateOut: z.string(),
}))

export function forGroups(data: any): Lesson[] {

    const lessons: Lesson[] = []; 
    const validatedItems = MsluDataSchema.parse(data)

    for (const item of validatedItems) {
        lessons.push({
            day_number: item.DayNumber,
            start_time: item.TimeIn,
            end_time: item.TimeOut,
            title: item.Discipline,
            type: item.Discipline_Type,
            groups: [item.Group],
            teacher: item.FIO_teacher,
            room: item.Classroom,
        })
    }

    return lessons;
}

export function forTeachers(data: any): Lesson[] {

    const lessons: Lesson[] = [];
    const validatedItems = MsluDataSchema.parse(data)

    for (const item of validatedItems) {
        const existingItem = lessons.find(
            (lesson) => 
                lesson.day_number == item.DayNumber &&
                lesson.start_time == item.TimeIn &&
                lesson.end_time == item.TimeOut &&
                lesson.title == item.Discipline &&
                lesson.type == item.Discipline_Type &&
                lesson.room == item.Classroom
        );
        if (existingItem) {
            existingItem.groups.push(item.Group);
        } else {
            lessons.push({
                day_number: item.DayNumber,
                start_time: item.TimeIn,
                end_time: item.TimeOut,
                title: item.Discipline,
                type: item.Discipline_Type,
                room: item.Classroom,
                groups: [item.Group],
            })
        }

    }

    return lessons;
}