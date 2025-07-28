<script lang="ts">
    import type { Entity, LessonsApiResponse, DayName } from "$lib/types"
    import { SkeletonLarge, ButtonPrimary, ButtonSecondary } from "$lib/components";
    import { AddDialog, InfoDialog, WeekPicker, LessonCard, ErrorCard } from "$lib/layout";
    import { addedEntities } from "$lib/entities";
    import Plus from "@lucide/svelte/icons/plus";
    
    // Props: local storage id of the selected entity
    let { selectedEntityId = $bindable() }: { selectedEntityId: string | undefined } = $props()

    // Selected week and dialog's open states
    type Week = "currentWeek" | "nextWeek" | "thirdWeek" | "fourthWeek";
    let selectedWeek = $state<Week>("currentWeek")
    let infoDialogOpen = $state(false)
    let addDialogOpen = $state(false)

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
    <p class="font-medium text-xl p-2 text-zinc-800 dark:text-zinc-50">{dayName}</p>
    <p>{response.week[dayName].date}</p>
    {#if response.week[dayName].lessons.length > 0}
        {#each response.week[dayName].lessons as lesson}
            <LessonCard {lesson}/>
        {/each}
    {:else}
        <p class="p-2 pl-10 px-2 pb-3 opacity-50">Нет занятий</p>
    {/if}
{/snippet}

<!-- Content -->
<div class="flex flex-col w-full text-balance pb-24 pt-2">

    <!-- When entity is selected, render schedule -->
    {#if selectedEntity}
        {#await getLessons(selectedEntity)}    
            <div class="flex flex-col md:flex-row pt-2 gap-6 md:gap-8" >
                <SkeletonLarge class="w-full md:w-1/2"/>
                <SkeletonLarge class="w-full md:w-1/2"/>
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

            <p class="pt-8 text-center opacity-80">Источник: <a class="underline" target="_blank" rel="noreferrer noopener" href="http://schedule.mslu.by">schedule.mslu.by</a></p>

            {#if response.debug}
                <div class="flex text-zinc-800 dark:text-zinc-100 outline-zinc-500 flex-col px-6 py-3 mt-8 self-center outline-2 outline-dashed rounded-xl">
                    <p>From cache: {response.debug.from_cache}</p>
                    <p>Mslu response: {response.debug.mslu_response} ms</p>
                    <p>Data transform: {response.debug.data_transform} ms</p>
                </div>
            {/if}
        
        {:catch err}
            <ErrorCard error={err} />
        {/await}

    <!-- When no entity is selected, render welcome screen -->
    {:else}

        <div class="flex flex-col self-center items-center gap-8 w-full md:w-2/3 lg:w-1/2">
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
                <ButtonPrimary 
                    text="Открыть расписание"
                    onclick={() => {addDialogOpen = true}}
                    icon={Plus}
                />
                <ButtonSecondary 
                    text="Как это работает?"
                    onclick={() => {infoDialogOpen = true}}
                />
            </div>
        </div>
    {/if}
</div>

<!-- Dialogs and week picker -->
<InfoDialog bind:open = {infoDialogOpen}/>
<AddDialog bind:selectedEntityId bind:dialogOpen={addDialogOpen} />
{#if selectedEntity}
    <WeekPicker bind:selectedWeek/>
{/if}
