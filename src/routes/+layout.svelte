<script lang="ts">
    import "../app.css";
    import { ModeWatcher } from "mode-watcher";
    import { savedEntities } from "./saved-entities.svelte";
    import { goto } from "$app/navigation";
    import Header from "./Header.svelte";
    import { onMount } from "svelte";
    import { page } from "$app/state";

    let { children } = $props();

    onMount(() => {
        if (savedEntities.length > 0 && page.route.id === "/") {
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
