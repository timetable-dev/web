import type { RequestHandler } from "./$types";
import type { WeekData, DebugData, LessonsApiResponse } from "$lib/types";
import { transform } from "./utils";
import { json, error } from "@sveltejs/kit";

export const GET: RequestHandler = async ({ params }): Promise<Response> => {
	const id = params.id;
	const type = params.type;
	const week = params.week;

	// TODO: Find more elegant way, don't like this approach.
	let msluRequestStart: number;
	let msluRequestTotal: number;
	let transformStart: number;
	let transformTotal: number;

	const fetchUrl = new URL("https://bbaf9a53f261s823eb2e.containers.yandexcloud.net"); // "http://schedule.mslu.by"

	if (type === "group") {
		fetchUrl.pathname = "/backend";
		fetchUrl.searchParams.append("groupId", id);
	} else {
		fetchUrl.pathname = "/backend/teachers";
		fetchUrl.searchParams.append("teacherId", id);
	}

	fetchUrl.searchParams.append("weekType", week);

	msluRequestStart = Date.now();
	const res = await fetch(fetchUrl);
	msluRequestTotal = Date.now() - msluRequestStart;

	if (!res.ok) {
		console.error(res.status, res.statusText);
		return error(503, "Сервер МГЛУ вне зоны доступа.");
	}

	let weekData: WeekData;
	const data = await res.json().then((data) => data.data);

	transformStart = Date.now();
	try {
		weekData = transform(data, type); // Magic happens here, see utils.ts
	} catch (err) {
		console.error(err);
		return error(503, "Неверный ответ сервера МГЛУ.");
	}
	transformTotal = Date.now() - transformStart;

	const debugData: DebugData = {
		from_cache: false, // This is a placeholder, caching logic is not implemented yet
		mslu_response: msluRequestTotal,
		data_transform: transformTotal
	};

	const response: LessonsApiResponse = {
		week: weekData,
		debug: debugData
	};

	return json(response);
};
