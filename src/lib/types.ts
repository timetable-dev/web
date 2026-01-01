/** Internal MSLU backend week id used when getting lessons.
 * Простите за этот индусский код; чтобы было нормально, нужно переписать свойства Tabs из Bits UI,
 * чтобы они принимали number, но мне пока не хочется в это вникать */
export type WeekOffset = "-6" | "-5" | "-4" | "-3" | "-2" | "-1" | "0" | "1" | "2" | "3" | "4" | "5" | "6";

/** Constant used when making API requests */
export type EntityType = "group" | "teacher";

/** Represents a single entity (group or teacher) saved in local storage. */
export interface Entity {
    id: string;
    name: string;
    type: EntityType;
    mslu_id: string;
    base64: string;
}

/** Represents a single entity (group or teacher) returned by the API. */
export interface ResponseEntity {
    id: string;
    name: string;
    label: string;
    base64: string;
}

/** Returned by groups and teachers api endpoints.
 * Can be passed directly to Select and Combobox items property. */
export interface SelectItem<ValueType, LabelType> {
    value: ValueType;
    label: LabelType;
}

/** Represents a single lesson in the timetable.
 * Only time is included because days and dates are handled by the WeekData type. */
export interface Lesson {
    start_time: string;
    end_time: string;
    title: string;
    titleFull: string;
    type: string;
    room: string;
    teacher?: string;
    teacherFull?: string;
    groups: string[];
}

/** Is used for type checking when grouping by day in /lessons API endpoint. */
export type DayName = "Понедельник" | "Вторник" | "Среда" | "Четверг" | "Пятница" | "Суббота";

/** Represents a single day's data (date and lessons) in the timetable. */
export type DayData = {
    date: string;
    lessons: Lesson[];
};

/** DayName and DayData combined, is used in /lessons API endpoint. */
export type WeekData = Record<DayName, DayData>;

/** Debug information for API responses. */
export interface DebugData {
    mslu_response?: number;
    data_transform?: number;
}

/** Represents the response from the /groups and /teachers API endpoints (with debug data). */
export interface EntitiesResponse {
    entities: Entity[];
    debug?: DebugData;
}
/** Represents the response from the /lessons API endpoint (with debug data). */
export interface LessonsResponse {
    week: WeekData;
    debug: DebugData;
}
