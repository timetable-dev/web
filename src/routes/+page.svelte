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
            onclick={() => {
                entityModalOpen = true;
            }}
            class="flex flex-row items-center justify-center gap-3 w-full px-4 py-3 outline-[1.5px] rounded-lg cursor-pointer transition-all duration-150 active:scale-[0.98]
                bg-sky-100 text-sky-800 outline-sky-400 hover:bg-sky-300 hover:text-sky-900 hover:outline-sky-500
                dark:bg-sky-900 dark:text-sky-50 dark:outline-sky-700 hover:dark:bg-sky-800 hover:dark:text-sky-50 hover:dark:outline-sky-700"
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
                bg-zinc-100 text-zinc-800 outline-zinc-200 hover:bg-zinc-200 hover:outline-zinc-300
                dark:bg-zinc-700 dark:text-zinc-50 dark:outline-zinc-600 hover:dark:bg-zinc-800 hover:dark:outline-zinc-700"
        >
            <p class="truncate pr-2 font-medium">Как это работает?</p>
        </Button.Root>
    </div>
</div>

<!-- Modals -->
<EntityModal bind:open={entityModalOpen} />
<AboutModal bind:open={infoModalOpen} />