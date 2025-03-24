<script lang="ts">
    import { TimetableContent, TopAppBar } from "$lib/layout";
    import { ErrorView } from "$lib/components";
    import { addedEntities } from "$lib/stores";

    let selectedEntityId = $state<string | undefined>(
        [...$addedEntities].length ? [...$addedEntities][0].id : undefined
    )
</script>

<div class="flex flex-col items-center w-full p-2">
    <TopAppBar bind:selectedEntityId />
    <TimetableContent bind:selectedEntityId/>
</div>
