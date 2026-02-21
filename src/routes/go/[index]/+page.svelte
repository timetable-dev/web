<script lang="ts">
    import { savedEntities } from "../../saved-entities.svelte";
    import { goto } from "$app/navigation";
    import { onMount } from "svelte";
    import { page } from "$app/state";

    onMount(() => {
        const int = parseInt(page.params.index ?? "");
        if (!isNaN(int) && int < savedEntities.length && int >= 0) {
            goto(`/${savedEntities[int].uuid}`)
        } else {
            goto("/")
        }
    })

</script>