import { z } from 'zod';

export const SelectArray = z.array(z.object({
    value: z.string(),
    label: z.string(),
}));

export const MsluLessons = z.array(z.object({

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