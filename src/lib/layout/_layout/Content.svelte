<script lang="ts">
	import type { Entity, LessonsApiResponse, DayName } from "$lib/types";
	import { AddDialog, InfoDialog, WeekPicker, Lesson, Error } from "$lib/layout";
	import { SkeletonLarge } from "$lib/components";
	import { addedEntities } from "$lib/persisted";
	import { Button } from "bits-ui";
	import Plus from "@lucide/svelte/icons/plus";

	// Props: local storage id of the selected entity
	let { selectedEntityId = $bindable() }: { selectedEntityId: string | undefined } = $props();

	// Selected week and dialog's open states
	type Week = "currentWeek" | "nextWeek" | "thirdWeek" | "fourthWeek";
	let selectedWeek = $state<Week>("currentWeek");
	let infoDialogOpen = $state(false);
	let addDialogOpen = $state(false);
	let showDebugInfo = $state(false);

	// Getting selected entity from local storage by id
	let selectedEntity = $derived<Entity | undefined>(
		addedEntities.current.find(({ id }) => id === selectedEntityId)
	);

	// Getting lessons from the api
	async function getLessons(entity: Entity): Promise<LessonsApiResponse> {
		const url = `/api/lessons/${entity.type}/${entity.mslu_id}/${selectedWeek}`;
		const res = await fetch(url);
		if (res.ok) {
			return await res.json();
		} else {
			throw new Error(res.statusText);
		}
	}
</script>

<!-- Snippet code for a single day: Monday, Tuesday... -->
{#snippet weekDay(dayName: DayName, response: LessonsApiResponse)}

{@const formattedDate: string = response.week[dayName].date !== "" ? Intl.DateTimeFormat("ru-RU", {
		day: "numeric",
		month: "short",
	}).format(new Date(response.week[dayName].date)) : ""}

<div class="flex flex-row p-2 items-center justify-between">
		<p class="text-xl font-medium text-zinc-800 dark:text-zinc-50">{dayName}</p>
		<p class="text-zinc-500 dark:text-zinc-400">{formattedDate === "3 сент." ? "День прощанья" : formattedDate}</p>
	</div>
	{#if response.week[dayName].lessons.length > 0}
		{#each response.week[dayName].lessons as lesson}
			<Lesson {lesson} />
		{/each}
	{:else}
		<p class="p-2 px-2 pb-3 pl-10 opacity-50">Нет занятий</p>
	{/if}
{/snippet}

<!-- Content -->
<div class="flex w-full flex-col pt-2 pb-24">
	<!-- When entity is selected, render schedule -->
	{#if selectedEntity}
		{#await getLessons(selectedEntity)}
			<div class="flex flex-col gap-6 pt-2 md:flex-row md:gap-8">
				<SkeletonLarge class="w-full md:w-1/2" />
				<SkeletonLarge class="w-full md:w-1/2" />
			</div>
		{:then response}
			<div class="flex flex-col md:flex-row md:gap-8">
				<div class="w-full md:w-1/2">
					{@render weekDay("Понедельник", response)}
					{@render weekDay("Вторник", response)}
					{@render weekDay("Среда", response)}
				</div>
				<div class="w-full md:w-1/2">
					{@render weekDay("Четверг", response)}
					{@render weekDay("Пятница", response)}
					{@render weekDay("Суббота", response)}
				</div>
			</div>

			<p class="pt-8 text-center opacity-80">
				Источник: <a
					class="underline"
					target="_blank"
					rel="noreferrer noopener"
					href="http://schedule.mslu.by">schedule.mslu.by</a
				>
			</p>

			{#if response.debug && showDebugInfo}
				<div
					class="mt-8 flex flex-col self-center rounded-xl px-6 py-3 text-zinc-800 outline-2 outline-zinc-500 outline-dashed dark:text-zinc-100"
				>
					<p>From cache: {response.debug.from_cache}</p>
					<p>Mslu response: {response.debug.mslu_response} ms</p>
					<p>Data transform: {response.debug.data_transform} ms</p>
				</div>
			{/if}
		{:catch err}
			<Error error={err} />
		{/await}

		<!-- When no entity is selected, render welcome screen -->
	{:else}
		<div class="flex w-full flex-col items-center gap-8 self-center md:w-2/3 lg:w-1/2">
			{#if addedEntities.current.length >= 1}
				<p class="pt-36 text-center text-xl text-balance">
					Выберите расписание из списка выше или откройте ещё одно
				</p>
			{:else}
				<p class="pt-36 text-center text-xl text-balance">
					Откройте новое расписание для группы или преподавателя
				</p>
			{/if}
			<div class="flex flex-col gap-3">

				<Button.Root
					onclick={() => {
						addDialogOpen = true;
					}}
					class="flex flex-row items-center justify-center gap-3 w-full px-4 py-3 lg:py-2.5 outline-2 rounded-lg cursor-pointer transition-all duration-100 active:scale-[0.98]
						bg-sky-200 text-sky-800 outline-sky-500 hover:bg-sky-300 hover:text-sky-900 hover:outline-sky-600
						dark:bg-sky-900 dark:text-sky-50 dark:outline-sky-700 hover:dark:bg-sky-800 hover:dark:text-sky-50 hover:dark:outline-sky-700"
				>
					<span>
						<Plus size={22} />
					</span>
					<p class="truncate pr-2 font-medium">
						Открыть расписание
					</p>
				</Button.Root>

				<Button.Root
					onclick={() => {
						addDialogOpen = true;
					}}
					class="flex flex-row items-center justify-center gap-3 w-full px-4 py-3 lg:py-2.5 outline-2 rounded-lg cursor-pointer transition-all duration-100 active:scale-[0.98]
						bg-zinc-100 text-zinc-800 outline-zinc-200 hover:bg-zinc-200 hover:outline-zinc-300
						dark:bg-zinc-700 dark:text-zinc-50 dark:outline-zinc-600 hover:dark:bg-zinc-800 hover:dark:outline-zinc-700"
				>
					<span>
						<!-- <Plus size={22} /> -->
					</span>
					<p class="truncate pr-2 font-medium">
						Как это работает?
					</p>
				</Button.Root>
			</div>
		</div>
	{/if}
</div>

<!-- Dialogs and week picker -->
<InfoDialog bind:open={infoDialogOpen} bind:debugOn={showDebugInfo}/>
<AddDialog bind:selectedEntityId bind:dialogOpen={addDialogOpen} />
{#if selectedEntity}
	<WeekPicker bind:selectedWeek />
{/if}
