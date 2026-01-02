<script lang="ts">
    import { getLessons } from "$lib/remote/lessons.remote";
    import { Cached } from '$lib/cached';
    import { page } from '$app/state';
    import { goto } from '$app/navigation';
    import WeekPicker from './WeekPicker.svelte';
    import Days from "./Days.svelte";
    import Error from "./Error.svelte";

    let entity = $derived(Cached.loadSavedEntity(page.params.uuid || ""));
    let weekOffset = $state(0);

    $effect(() => {
        if (!entity) {
            goto("/")
        }
    })

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

{#if entity}
    <div class="flex w-full flex-col pt-2 pb-24">
        {#await getLessons({id: entity.bsuflId, type: entity.type, weekOffset: weekOffset})}
            <!-- Show skeleton during promise pending -->
            <div class="flex flex-col gap-6 pt-2 md:flex-row md:gap-8">
                {@render skeleton()}
                {@render skeleton()}
            </div>

        {:then lessons}
            <!-- When promise is fulfilled render actual schedule -->
            <Days {lessons} base64={entity.base64} />

        {:catch err}
            <!-- In case of error, render error message and some instructions to the user -->
            <Error {err} base64={entity.base64} />
        {/await}
    </div>
{:else}
    <p>Расписание не найдено, возвращаемся домой...</p>
{/if}

<WeekPicker bind:weekOffset/>