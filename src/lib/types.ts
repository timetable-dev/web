// export type EntityType = "group" | "teacher"; TODO: not used for now but should be to have a single source of thruth

/** Represents a single entity (group or teacher) saved in local storage. */
export interface Entity {
	id: string;
	name: string;
	type: "group" | "teacher";
	mslu_id: string | number;
}

/** Returned by groups and teachers api endpoints.
 * Can be passed directly to Select and Combobox items property. */
export interface SelectItem {
	value: string;
	label: string;
}

/** Represents a single lesson in the timetable.
 * Only time is included because days and dates are handled by the WeekData type. */
export interface Lesson {
	start_time: string;
	end_time: string;
	title: string;
	type: string;
	room: string;
	teacher?: string;
	groups: string[];
}

/** Is used for type checking when grouping by day in /lessons API endpoint. */
export type DayName = "Понедельник" | "Вторник" | "Среда" | "Четверг" | "Пятница" | "Суббота";

/** Represents a single day's data (date and lessons) in the timetable. */
export type DayData = {
	date: string;
	lessons: Lesson[];
};

/** Two of the above types combined, is used in /lessons API endpoint. */
export type WeekData = Record<DayName, DayData>;

/** Debug information for API responses. */
export interface DebugData {
	from_cache: boolean;
	mslu_response: number;
	data_transform: number;
}

/** Represents the response from the /groups and /teachers API endpoints (with debug data). */
export interface EntitiesApiResponse {
	entities: Entity[];
	debug: DebugData;
}
/** Represents the response from the /lessons API endpoint (with debug data). */
export interface LessonsApiResponse {
	week: WeekData;
	debug: DebugData;
}
