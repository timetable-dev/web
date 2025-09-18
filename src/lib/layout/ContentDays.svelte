<script lang="ts">
    import type { LessonsResponse, DayName } from "$lib/types";
    import { showDebug } from "$lib/persisted";
    import Lesson from "./ContentLesson.svelte";
    import ExternalLink from "@lucide/svelte/icons/external-link";

    interface Props {
        lessons: LessonsResponse;
        totalRequestTime: number | undefined;
        base64: string;
    }

    let { lessons, base64, totalRequestTime }: Props = $props();

</script>

<!-- Snippet for a single day: Monday, Tuesday... -->
{#snippet weekDay(dayName: DayName, lessons: LessonsResponse)}
    {@const formattedDate: string = lessons.week[dayName].date !== "" ? Intl.DateTimeFormat("ru-RU", {
		day: "numeric",
		month: "short",
	}).format(new Date(lessons.week[dayName].date)) : ""}

    {@const dateString: string = (
        formattedDate === "3 сент." ? "День прощанья"
        : formattedDate === "31 дек." ? "С новым годом!"
        : ""
    )}

    <div class="flex flex-row p-2 items-center justify-between">
        <p class="text-xl font-medium text-zinc-800 dark:text-zinc-50">{dayName}</p>
        <p class="text-zinc-500 dark:text-zinc-400">{formattedDate}</p>
    </div>
    {#if dateString}
        <div
            class="outline-1 text-center w-full p-1 rounded-md text-sm
                    text-zinc-700 outline-zinc-300 bg-zinc-50 dark:text-zinc-300 dark:outline-zinc-700 dark:bg-zinc-800"
        >
            {dateString}
        </div>
    {/if}
    {#if lessons.week[dayName].lessons.length > 0}
        {#each lessons.week[dayName].lessons as lesson}
            <Lesson {lesson} />
        {/each}
    {:else}
        <p class="p-2 px-2 pb-3 pl-10 opacity-50">Нет занятий</p>
    {/if}
{/snippet}

<!-- Each day with its lessons -->
<div class="flex flex-col md:flex-row md:gap-8">
    <div class="w-full md:w-1/2">
        {@render weekDay("Понедельник", lessons)}
        {@render weekDay("Вторник", lessons)}
        {@render weekDay("Среда", lessons)}
    </div>
    <div class="w-full md:w-1/2">
        {@render weekDay("Четверг", lessons)}
        {@render weekDay("Пятница", lessons)}
        {@render weekDay("Суббота", lessons)}
    </div>
</div>

<!-- Links to the official website -->
<div class="mt-8 p-2 flex flex-col md:flex-row outline-1 rounded-xl bg-zinc-50 text-zinc-900 outline-zinc-200 dark:bg-zinc-800 dark:text-zinc-50 dark:outline-zinc-700">
    <p class="p-2">
        Источник: <a
            class="underline"
            target="_blank"
            rel="noreferrer noopener"
            href="http://www.timetable.bsufl.by">www.timetable.bsufl.by</a
        >
    </p>
    <p class="p-2 pb-5">
        Откройте это расписание на официальном сайте по ссылке ниже:
    </p>
    <a
        target="_blank"
        rel="noreferrer noopener"
        class="flex flex-row gap-3 justify-center items-center outline-1 rounded-lg p-2 bg-zinc-100 outline-zinc-300 text-zinc-900 dark:bg-zinc-700 dark:outline-zinc-600 dark:text-zinc-50"
        href="http://www.timetable.bsufl.by/schedule/{base64}"
    >
        <p>Открыть</p>
        <span><ExternalLink size={16}/></span>
    </a>
</div>

<!-- Debug info if available and enabled -->
{#if lessons.debug && showDebug.current}
    <div
        class="mt-8 flex flex-col self-center rounded-xl px-6 py-3 text-zinc-800 outline-2 outline-zinc-500 outline-dashed dark:text-zinc-100"
    >
        <p>Mslu response: { (lessons.debug.mslu_response ?? 0).toFixed(4) } ms</p>
        <p>Data transform: { (lessons.debug.data_transform ?? 0).toFixed(4) } ms</p>
        <p>Total response: { (totalRequestTime ?? 0).toFixed(4) } ms</p>
    </div>
{/if}