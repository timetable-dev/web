<script lang="ts">
    import type { WeekType } from "$lib/types";
    import { addedEntities } from "$lib/persisted";

    import { getLessons } from "$lib/remote/lessons.remote";
    
    // Layout
    import Days from "./ContentDays.svelte";
    import ContentError from "./ContentError.svelte";
    import WelcomeScreen from "./WelcomeScreen.svelte";
    import WeekPicker from "./WeekPicker.svelte";

    // Props: local storage id of a selected entity
    let { selectedEntityId = $bindable() }: { selectedEntityId: string | undefined } = $props();

    let selectedWeek = $state<WeekType>("currentWeek");

    interface LessonsParams {
        id: string;
        type: "group" | "teacher";
        week: WeekType;
    }

    let selectedEntity = $derived(addedEntities.current.find(({ id }) => id === selectedEntityId));
    let lessonsParams = $state<LessonsParams>();

    $effect(() => {
        if (selectedEntity) {
            lessonsParams = {
                id: selectedEntity.mslu_id,
                type: selectedEntity.type,
                week: selectedWeek,
            }
        } else {
            lessonsParams = undefined;
        }
    });

    let totalRequestTime = $state<number>();

</script>

{#snippet skeleton()}
    <div class="w-full md:w-1/2">
        <div class="flex flex-col gap-4">
            <div class="h-8 w-1/2 animate-pulse rounded-md bg-zinc-200 dark:bg-zinc-700"></div>
            <div class="h-14 w-full animate-pulse rounded-md bg-zinc-200 dark:bg-zinc-700"></div>
            <div class="h-14 w-full animate-pulse rounded-md bg-zinc-200 dark:bg-zinc-700"></div>
        </div>
    </div>
{/snippet}

<div class="flex w-full flex-col pt-2 pb-24">
    <!-- When entity is selected => lesson params are available, render schedule -->
    {#if lessonsParams && selectedEntity}

        {#await getLessons(lessonsParams)}
            <!-- Show skeleton during promise pending -->
            <div class="flex flex-col gap-6 pt-2 md:flex-row md:gap-8">
                {@render skeleton()}
                {@render skeleton()}
            </div>

        {:then lessons}
            <!-- When promise is fulfilled render actual schedule -->
            <Days {lessons} {totalRequestTime} base64={selectedEntity.base64} />

        {:catch err}
            <!-- In case of error, render error message and some instructions to the user -->
            <ContentError {err} base64={selectedEntity.base64} />
        {/await}

    {:else}
        <!-- When no entity is selected, render welcome screen -->
        <WelcomeScreen bind:selectedEntityId />
    {/if}

</div>

<!-- Week picker (absolute) -->
{#if selectedEntity}
    <WeekPicker bind:selectedWeek />
{/if}