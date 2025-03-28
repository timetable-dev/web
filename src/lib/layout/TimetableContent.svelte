<script lang="ts">
    import { fade } from "$lib/transitions";
    import { WeekPicker, SkeletonLarge, ErrorView, AddEntityDialog } from "$lib/components";
    import type { Entity, TimetableData } from "$lib/types"
    import { addedEntities } from "$lib/stores";
    import { LessonView } from "$lib/components";
    import { Plus } from "lucide-svelte";

    type Week = "currentWeek" | "nextWeek" | "thirdWeek" | "fourthWeek";

    let selectedWeek = $state<Week>("currentWeek")

    function submitNewEntity() {
        const newEntityId = [...$addedEntities][$addedEntities.length - 1].id;
        selectedEntityId = newEntityId;
    }

    let { selectedEntityId = $bindable() }: { selectedEntityId: string | undefined } = $props()
    let selectedEntity: Entity | undefined = $derived(
        $addedEntities.find(({ id }) => id === selectedEntityId)
    );

    let timetableData = $state<Promise<TimetableData>>()
    let isSkeletonInTransition = $state<boolean>(false)

    let addEntityDialogOpen = $state<boolean>(false)

    $effect(() => {
        if (selectedEntity) {
            async function getTimetableData(entity: Entity, week: Week): Promise<TimetableData> {
                const res = await fetch( 
                    `/api/getTimetableData?entityId=${selectedEntity?.mslu_id}&entityType=${selectedEntity?.type}&weekType=${selectedWeek}`, 
                    {method: 'GET', },
                );
                if (res.ok) {
                    return await res.json();
                } else {
                    const err = await res.statusText
                    throw new Error(err)
                }
            }
            timetableData = getTimetableData(selectedEntity, selectedWeek);
        } else {
            timetableData = undefined;
        }
        
    })

</script>

<div class="flex flex-col w-full text-balance pb-24 pt-2">

    {#if timetableData}
        {#await timetableData}    
            <div
                transition:fade={{ duration: 200 }}
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
                Добавьте новое расписание или выберите одно из добавленных
            </p>
            <button
                onclick={() => {addEntityDialogOpen = true}}
                class="flex flex-row items-center gap-2 font-medium w-max pr-4 pl-3 py-2.5 rounded-lg outline-1 cursor-pointer transition-all duration-150 active:scale-[0.98]
                       bg-blue-600 dark:bg-sky-900 text-blue-50 dark:text-sky-50 outline-blue-500 dark:outline-sky-800"
            >
            <Plus />
            Добавить расписание
            </button>
        </div>

    {/if}
</div>

<WeekPicker bind:selectedWeek/>
<AddEntityDialog newEntitySubmitted={submitNewEntity} bind:dialogOpen={addEntityDialogOpen} />