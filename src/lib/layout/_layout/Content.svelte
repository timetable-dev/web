<script lang="ts">
    import type { Entity, LessonsApiResponse, DayName, WeekType } from "$lib/types";
    import { AddDialog, InfoDialog, WeekPicker, Lesson } from "$lib/layout";
    import { SkeletonLarge } from "$lib/components";
    import { addedEntities, showDebug, bannerClosed } from "$lib/persisted";
    import { error } from "@sveltejs/kit";
    import { Button } from "bits-ui";
    import Plus from "@lucide/svelte/icons/plus";
    import ExternalLink from "@lucide/svelte/icons/external-link";
    import { onMount } from "svelte";

    // Props: local storage id of the selected entity
    let { selectedEntityId = $bindable() }: { selectedEntityId: string | undefined } = $props();

    // Deriving selected entity from local storage by id
    let selectedEntity = $derived<Entity | undefined>(
        addedEntities.current.find(({ id }) => id === selectedEntityId),
    );

    function getErrorMessage(err: any): string {
        try {
            const errorObject = JSON.parse(err);
            const errorMessage = errorObject.user_message ?? "Неизвестная ошибка";
            return errorMessage;
        } catch {
            return "Неизвестная ошибка";
        }
    }

    // Selected week and dialog's open states
    let selectedWeek = $state<WeekType>("currentWeek");
    let infoDialogOpen = $state(false);
    let addDialogOpen = $state(false);

    let totalRequestTime = $state<number>();

    let showBanner = $state(false);
    const bannerId = "upd-direct-links";

    onMount(() => {
        if (bannerClosed.current !== bannerId) {
            showBanner = true;
        }
    })

    // Getting lessons from the api
    async function getLessons(entity: Entity): Promise<LessonsApiResponse> {
        const apiRequestStart = performance.now();
        const url = `/api/lessons/${entity.type}/${entity.mslu_id}/${selectedWeek}`;
        const res = await fetch(url);
        totalRequestTime = performance.now() - apiRequestStart;
        if (res.ok) {
            return await res.json();
        } else {
            const errorObject = await res.json();
            return error(res.status, {
                message: errorObject.message,
                user_message: errorObject.user_message,
            });
        }
    }
</script>

<!-- Snippet code for a single day: Monday, Tuesday... -->
{#snippet weekDay(dayName: DayName, response: LessonsApiResponse)}
    {@const formattedDate: string = response.week[dayName].date !== "" ? Intl.DateTimeFormat("ru-RU", {
		day: "numeric",
		month: "short",
	}).format(new Date(response.week[dayName].date)) : ""}

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
                    href="http://www.timetable.bsufl.by/schedule/{selectedEntity.base64}"
                >
                    <p>Открыть</p>
                    <span><ExternalLink size={16}/></span>
                </a>
            </div>

            {#if response.debug && showDebug.current}
                <div
                    class="mt-8 flex flex-col self-center rounded-xl px-6 py-3 text-zinc-800 outline-2 outline-zinc-500 outline-dashed dark:text-zinc-100"
                >
                    <p>Mslu response: {(response.debug.mslu_response ?? 0).toFixed(4)} ms</p>
                    <p>Data transform: {(response.debug.data_transform ?? 0).toFixed(4)} ms</p>
                    <p>Total response: {(totalRequestTime ?? 0).toFixed(4)} ms</p>
                </div>
            {/if}

            <!-- In case of error, render error message and some instructions -->
        {:catch err}
            {@const errorMessage = getErrorMessage(err)}
            <div
                class="mt-2 rounded-xl flex w-full flex-col gap-4 self-center bg-zinc-50 p-4 text-pretty text-zinc-950 outline-1 outline-zinc-200 md:w-2/3 dark:bg-zinc-800 dark:text-zinc-50 dark:outline-zinc-700"
            >
                <p class="pt-2 pb-1 text-center text-xl">Произошла ошибка</p>
                <p
                    class="rounded-lg bg-orange-100 px-4 py-3 break-words outline-1 outline-orange-300 text-orange-900 dark:bg-amber-950 dark:text-amber-50 dark:outline-amber-700"
                >
                    {errorMessage}
                </p>
                <p>
                    Страшно, очень страшно. Если бы мы знали, что это такое, но мы не знаем, что это такое.
                </p>
                <p>
                    Попробуйте открыть это расписание на официальном сайте по ссылке ниже или перейдите на 
                    <a
                        class="underline"
                        target="_blank"
                        rel="noreferrer noopener"
                        href="http://www.timetable.bsufl.by"
                        >главную
                    </a>.
                </p>
                <a
                    target="_blank"
                    rel="noreferrer noopener"
                    class="flex flex-row gap-3 justify-center items-center outline-1 rounded-lg p-3 bg-zinc-100 outline-zinc-300 text-zinc-900 dark:bg-zinc-700 dark:outline-zinc-600 dark:text-zinc-50"
                    href="http://www.timetable.bsufl.by/schedule/{selectedEntity.base64}"
                >
                    <p>Открыть на оф. сайте</p>
                    <span><ExternalLink size={16}/></span>
                </a>
            </div>
        {/await}

        <!-- Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36 -->

        <!-- When no entity is selected, render welcome screen -->
    {:else}
        {#if showBanner}
            <div
                class="flex flex-col gap-2 outline-1 md:w-2/3 lg:w-full self-center rounded-xl px-4 py-3 bg-lime-100 dark:bg-green-950 text-lime-900 dark:text-green-50 outline-lime-300 dark:outline-green-800"
            >
            <p class="w-full">
                Мы починили запросы к серверу БГУИЯ, улучшили сообщение об ошибке и добавили звания перподавателям
                (простите, пожалуйста, что забыли в прошлой версии). А ещё добавили прямые ссылки на официальный сайт
                под каждым расписанием. Спасибо, что пользуетесь нашим приложением! Низкий поклон разработчикам БГУИЯ
                за улучшения на вашей стороне. АТ
            </p>
            <button
                class="mt-2 px-8 py-2 rounded-lg bg-lime-200 dark:bg-green-800"
            >
                Понятно
            </button>
        {/if}
        </div>
        <div class="flex w-full flex-col items-center gap-8 self-center md:w-2/3 lg:w-1/2">
            {#if addedEntities.current.length >= 1}
                <p class="pt-36 text-center text-xl text-balance">
                    Выберите расписание из списка выше или откройте ещё одно
                </p>
            {:else}
                <p class="pt-12 text-center text-xl text-balance">
                    Откройте новое расписание для группы или преподавателя
                </p>
            {/if}
            <div class="flex flex-col gap-3">
                <Button.Root
                    onclick={() => {
                        addDialogOpen = true;
                    }}
                    class="flex flex-row items-center justify-center gap-3 w-full px-4 py-3 outline-[1.5px] rounded-lg cursor-pointer transition-all duration-150 active:scale-[0.98]
						bg-sky-100 text-sky-800 outline-sky-400 hover:bg-sky-300 hover:text-sky-900 hover:outline-sky-500
						dark:bg-sky-900 dark:text-sky-50 dark:outline-sky-700 hover:dark:bg-sky-800 hover:dark:text-sky-50 hover:dark:outline-sky-700"
                >
                    <span>
                        <Plus size={22} />
                    </span>
                    <p class="truncate pr-2 font-medium">Открыть расписание</p>
                </Button.Root>

                <Button.Root
                    onclick={() => {
                        infoDialogOpen = true;
                    }}
                    class="flex flex-row items-center justify-center gap-3 w-full px-4 py-3 outline-[1.5px] rounded-lg cursor-pointer transition-all duration-150 active:scale-[0.98]
						bg-zinc-100 text-zinc-800 outline-zinc-200 hover:bg-zinc-200 hover:outline-zinc-300
						dark:bg-zinc-700 dark:text-zinc-50 dark:outline-zinc-600 hover:dark:bg-zinc-800 hover:dark:outline-zinc-700"
                >
                    <p class="truncate pr-2 font-medium">Как это работает?</p>
                </Button.Root>
                <div class="absolute bottom-10 left-1/2 -translate-x-1/2">
                    <!-- Use mailto link -->
                    <a href="mailto:timetable-dev@yandex.by" class="text-zinc-600 dark:text-zinc-300">timetable-dev@yandex.by</a>
                </div>
            </div>
        </div>
    {/if}
</div>

<!-- Dialogs and week picker -->
<InfoDialog bind:open={infoDialogOpen} />
<AddDialog bind:selectedEntityId bind:dialogOpen={addDialogOpen} />
{#if selectedEntity}
    <WeekPicker bind:selectedWeek />
{/if}
