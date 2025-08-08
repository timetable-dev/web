<script lang="ts">
    import { Content, Header } from "$lib/layout";
    import { addedEntities } from "$lib/persisted";
    import { ModeWatcher } from "mode-watcher";
    import "../app.css";

    let selectedEntityId = $state<string | undefined>(
        addedEntities.current.length ? addedEntities.current[0].id : undefined,
    );
</script>

<ModeWatcher />

<div class="flex w-full flex-row justify-center">
    <div class="flex w-full flex-col lg:w-2/3 p-3">
        <Header bind:selectedEntityId />
        <Content bind:selectedEntityId />
    </div>
</div>
