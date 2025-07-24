<script lang="ts">
    import { TimetableContent, TopBar } from "$lib/layout";
    import { addedEntities } from "$lib/persisted_entities";

    let selectedEntityId = $state<string | undefined>(
        addedEntities.current.length ? addedEntities.current[0].id : undefined
    )
</script>

<div class="flex flex-col items-center w-full p-2">
    <TopBar bind:selectedEntityId />
    <TimetableContent bind:selectedEntityId/>
</div>
