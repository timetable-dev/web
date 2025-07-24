export type EntityType = "group" | "teacher";

export interface Entity {
    id: string;
    name: string;
    type: EntityType;
    mslu_id: string | number;
}

export interface Lesson {
    day_number: number;
    start_time: string;
    end_time: string;
    title: string;
    type: string;
    room: string;
    teacher?: string;
    groups: string[];
}

export interface TimetableData {
    mon: Lesson[];
    tue: Lesson[];
    wed: Lesson[];
    thu: Lesson[];
    fri: Lesson[];
    sat: Lesson[];
}

// The following code is not used for now

// interface Week {
//     msluId: WeekId;
//     nameNom: string;
//     nameAcc: string;
//     nameShort: string;
// }

// export const Weeks = new Map<WeekId, Week>([
//     ["currentWeek", { 
//         msluId: "currentWeek", 
//         nameNom: "Текущая неделя", 
//         nameAcc: "текущую неделю", 
//         nameShort: "Тек. нед." 
//     }],
//     ["nextWeek", { 
//         msluId: "nextWeek", 
//         nameNom: "Следующая неделя", 
//         nameAcc: "следующую неделю", 
//         nameShort: "След. нед." 
//     }],
//     ["thirdWeek", { 
//         msluId: "thirdWeek", 
//         nameNom: "Третья неделя", 
//         nameAcc: "третью неделю", 
//         nameShort: "3-я нед." 
//     }],
//     ["fourthWeek", { 
//         msluId: "fourthWeek", 
//         nameNom: "Четвёртая неделя", 
//         nameAcc: "четвёртую неделю", 
//         nameShort: "4-я нед." 
//     }]
// ]);
