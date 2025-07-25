<script lang="ts">
    import { WeekPicker, SkeletonLarge, ErrorView, AddEntityDialog } from "$lib/components";
    import type { Entity, TimetableData } from "$lib/types"
    import { addedEntities } from "$lib/persisted_entities";
    import { LessonView } from "$lib/components";
    import { Plus } from "lucide-svelte";
    import InfoDialog from "$lib/components/InfoDialog.svelte";

    type Week = "currentWeek" | "nextWeek" | "thirdWeek" | "fourthWeek";

    let selectedWeek = $state<Week>("currentWeek")

    let infoDialogOpen = $state(false)

    let { selectedEntityId = $bindable() }: { selectedEntityId: string | undefined } = $props()
    let selectedEntity: Entity | undefined = $derived(
        addedEntities.current.find(({ id }) => id === selectedEntityId)
    );

    let timetableData = $state<Promise<TimetableData>>()
    let isSkeletonInTransition = $state<boolean>(false)

    let addEntityDialogOpen = $state<boolean>(false)

    $effect(() => {
        if (selectedEntity) {

            async function getTimetableData(): Promise<TimetableData> {
                const url = `/api/lessons/${selectedEntity?.type}/${selectedEntity?.mslu_id}/${selectedWeek}`;
                const res = await fetch(url, {method: 'GET', });
                if (res.ok) {
                    return await res.json();
                } else {
                    const err = await res.statusText
                    throw new Error(err)
                }
            }
            
            timetableData = getTimetableData();
        } else {
            timetableData = undefined;
        }
        
    })

</script>

<div class="flex flex-col w-full text-balance pb-24 pt-2">

    {#if timetableData}
        {#await timetableData}    
            <div
                onintrostart={() => (isSkeletonInTransition = true)}
                onoutrostart={() => (isSkeletonInTransition = true)}
                onintroend={() => (isSkeletonInTransition = false)}
                onoutroend={() => (isSkeletonInTransition = false)}
                class="flex flex-col md:flex-row pt-2 gap-6 md:gap-8"
            >
                <SkeletonLarge class="w-full md:w-1/2"/>
                <SkeletonLarge class="w-full md:w-1/2"/>
            </div>
        {:then response}

            {#if !isSkeletonInTransition}

                <div class="flex flex-col md:flex-row md:gap-8">
                    <div class="w-full md:w-1/2">

                        <p class="font-medium text-xl p-2 text-zinc-800 dark:text-zinc-50">Понедельник</p>
                        {#if response.mon.length > 0}
                            {#each response.mon as lesson}
                                <LessonView {lesson}/>
                            {/each}
                        {:else}
                            <p class="p-2 pl-10 px-2 pb-3 opacity-50">Нет занятий</p>
                        {/if}

                        <p class="font-medium text-xl p-2 text-zinc-800 dark:text-zinc-50">Вторник</p>
                        {#if response.tue.length > 0}
                            {#each response.tue as lesson}
                                <LessonView {lesson}/>
                            {/each}
                        {:else}
                            <p class="p-2 pl-10 px-2 pb-3 opacity-50">Нет занятий</p>
                        {/if}

                        <p class="font-medium text-xl p-2 text-zinc-800 dark:text-zinc-50">Среда</p>
                        {#if response.wed.length > 0}
                            {#each response.wed as lesson}
                                <LessonView {lesson}/>
                            {/each}
                        {:else}
                            <p class="p-2 pl-10 px-2 pb-3 opacity-50">Нет занятий</p>
                        {/if}

                    </div>

                    <div class="w-full md:w-1/2">

                        <p class="font-medium text-xl p-2 text-zinc-800 dark:text-zinc-50">Четверг</p>
                        {#if response.thu.length > 0}
                            {#each response.thu as lesson}
                                <LessonView {lesson}/>
                            {/each}
                        {:else}
                            <p class="p-2 pl-10 px-2 pb-3 opacity-50">Нет занятий</p>
                        {/if}

                        <p class="font-medium text-xl p-2 text-zinc-800 dark:text-zinc-50">Пятница</p>
                        {#if response.fri.length > 0}
                            {#each response.fri as lesson}
                                <LessonView {lesson}/>
                            {/each}
                        {:else}
                            <p class="p-2 pl-10 px-2 pb-3 opacity-50">Нет занятий</p>
                        {/if}

                        <p class="font-medium text-xl p-2 text-zinc-800 dark:text-zinc-50">Суббота</p>
                        {#if response.sat.length > 0}
                            {#each response.sat as lesson}
                                <LessonView {lesson}/>
                            {/each}
                        {:else}
                            <p class="p-2 pl-10 px-2 pb-3 opacity-50">Нет занятий</p>
                        {/if}

                    </div>
                </div>

                <p class="pt-8 text-center opacity-80">Источник: <a class="underline" target="_blank" rel="noreferrer noopener" href="http://schedule.mslu.by">schedule.mslu.by</a></p>

            {/if}
        
        {:catch e}
            <ErrorView error={e} />
        {/await}
    {:else}
        <div class="flex flex-col self-center items-center gap-8 w-full md:w-2/3 lg:w-1/2">
            <p class="pt-36 text-center text-xl text-balance">
                Откройте новое расписание или выберите одно из добавленных
            </p>
            <div class="flex flex-col gap-2">
                <button
                    onclick={() => {addEntityDialogOpen = true}}
                    class="flex flex-row items-center gap-2 font-medium w-max pr-4 pl-3 py-2.5 rounded-lg outline-1 cursor-pointer transition-all duration-150 active:scale-[0.98]
                           bg-blue-600 dark:bg-sky-900 text-blue-50 dark:text-sky-50 outline-blue-500 dark:outline-sky-800"
                >
                <Plus />
                Открыть расписание
                </button>
                            <button
                    onclick={() => {infoDialogOpen = true}}
                    class="flex flex-row w-full justify-center align-middle items-center gap-3 font-medium pr-4 pl-3 py-2.5 rounded-lg outline-1 cursor-pointer transition-all duration-100 active:scale-[0.98]
                           text-zinc-900 dark:text-zinc-50 outline-zinc-200 dark:outline-zinc-600 bg-zinc-100 dark:bg-zinc-700 hover:bg-zinc-200 hover:dark:bg-zinc-800 hover:dark:outline-zinc-700"
                >
                <!-- <InfoIcon size="21" class="text-zinc-800 dark:text-zinc-50"/> -->
                Как это работает?
                </button>
            </div>
        </div>

    {/if}
</div>

<InfoDialog bind:open = {infoDialogOpen}/>

<WeekPicker bind:selectedWeek/>
<AddEntityDialog bind:selectedEntityId bind:dialogOpen={addEntityDialogOpen} />