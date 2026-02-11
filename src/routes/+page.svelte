<script lang="ts">
    import { Button } from "bits-ui";
    import { savedEntities } from "./saved-entities.svelte";
    import EntityModal from "./EntityModal.svelte";
    import AboutModal from "./AboutModal.svelte";
    import Plus from "@lucide/svelte/icons/plus";

    let entityModalOpen = $state(false);
    let infoModalOpen = $state(false);

</script>

<div class="flex w-full flex-col items-center gap-8 self-center md:w-2/3 lg:w-1/2">
    {#if savedEntities.length >= 1}
        <p class="pt-36 text-center text-xl text-balance">
            Выберите расписание из списка выше или откройте ещё одно
        </p>
    {:else}
        <p class="pt-36 text-center text-xl text-balance">
            Откройте новое расписание для группы или преподавателя
        </p>
    {/if}
    <div class="flex flex-col gap-2">
        <Button.Root
            onclick={() => { entityModalOpen = true; }}
            class="flex flex-row items-center justify-center gap-3 w-full px-4 py-3 outline-[1.5px] rounded-lg cursor-pointer transition-all duration-150 active:scale-[0.98]
                   bg-bg-accent text-fg-accent outline-border-accent hover:bg-bg-accent-hover hover:text-fg-accent-alt hover:outline-border-accent-alt"
        >
            <span>
                <Plus size={22} />
            </span>
            <p class="truncate pr-2 font-medium">Открыть расписание</p>
        </Button.Root>

        <Button.Root
            onclick={() => {
                infoModalOpen = true;
            }}
            class="flex flex-row items-center justify-center gap-3 w-full px-4 py-3 outline-[1.5px] rounded-lg cursor-pointer transition-all duration-150 active:scale-[0.98]
                bg-bg-elevated-2 text-fg outline-border hover:bg-hover hover:outline-border-alt"
        >
            <p class="truncate pr-2 font-medium">Как это работает?</p>
        </Button.Root>
    </div>
</div>

<!-- Modals -->
<EntityModal bind:open={entityModalOpen} />
<AboutModal bind:open={infoModalOpen} />