<script lang="ts">
    import { Content, Header } from "$lib/layout";
    import { addedEntities } from "$lib/entities";

    let selectedEntityId = $state<string | undefined>(
        addedEntities.current.length ? addedEntities.current[0].id : undefined
    )
</script>

<div class="flex flex-col items-center w-full p-2">
    <Header bind:selectedEntityId />
    <Content bind:selectedEntityId/>
</div>
