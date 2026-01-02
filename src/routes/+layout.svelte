<script lang="ts">
    import "../app.css";
    import { ModeWatcher } from "mode-watcher";
    import { savedEntities } from "./saved-entities.svelte";
    import { goto, afterNavigate } from "$app/navigation";
    import Header from "./Header.svelte";
    import { onMount } from "svelte";

    let { children } = $props();

    onMount(() => {
        if (savedEntities.length > 0) {
            goto(`/${savedEntities[0].uuid}`)
        }
    })

</script>

<ModeWatcher />

<div class="flex w-full flex-row justify-center">
    <div class="flex w-full flex-col lg:w-2/3 p-3">
        <Header />
        {@render children()}
    </div>
</div>
