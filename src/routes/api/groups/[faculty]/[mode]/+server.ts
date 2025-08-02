// import { MSLU_BACKEND_ENDPOINT } from '$env/static/private';
import type { RequestHandler } from "./$types";
import { MSLU_BACKEND_ENDPOINT } from "$env/static/private";
import { json, error } from "@sveltejs/kit";
import { z } from "zod";

const MsluResponse = z.object({
	data: z.array(
		z.object({
			IdGroup: z.number(),
			Name: z.string()
		})
	)
});

export const GET: RequestHandler = async ({ params }): Promise<Response> => {
	const endpoint = MSLU_BACKEND_ENDPOINT;
	const faculty = params.faculty;
	const mode = params.mode;

	// Requesting MSLU backend
	let groupUrl = new URL(`${endpoint}/backend/buttonClicked`);
	groupUrl.searchParams.append("facultyId", faculty);
	groupUrl.searchParams.append("educationForm", mode);
	const res = await fetch(groupUrl);

	// Checking if the response is ok
	if (!res.ok) {
		console.error(res.status, res.statusText);
		return error(503, "Ошибка связи с сервером МГЛУ.");
	}

	try {
		const data = await res.json(); // Parse the response as JSON
		const parsedData = MsluResponse.parse(data); // Validate its structure
		const groups = parsedData.data.map(
			// Map the data to SelectArray format
			({ IdGroup, Name }) => ({
				value: IdGroup,
				label: Name
			})
		);
		console.info("Fetched groups from MSLU backend.");
		return json(groups, { status: 200 });
	} catch (err) {
		console.error("Error parsing MSLU response:", err);
		return error(503, "Неверный ответ сервера МГЛУ.");
	}
};
