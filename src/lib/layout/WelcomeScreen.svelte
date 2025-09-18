<script lang="ts">
    import { EntityModal, AboutAppModal, ChangelogModal } from "$lib/modals";
    import { addedEntities } from "$lib/persisted";
    import { Button } from "bits-ui";
    import Plus from "@lucide/svelte/icons/plus";

    let { selectedEntityId = $bindable() }: { selectedEntityId: string | undefined } = $props();

    let infoDialogOpen = $state(false);
    let addDialogOpen = $state(false);
    let changelogOpen = $state(false);

</script>

<div class="flex w-full flex-col items-center gap-8 self-center md:w-2/3 lg:w-1/2">
    {#if addedEntities.current.length >= 1}
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
                addDialogOpen = true;
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
                infoDialogOpen = true;
            }}
            class="flex flex-row items-center justify-center gap-3 w-full px-4 py-3 outline-[1.5px] rounded-lg cursor-pointer transition-all duration-150 active:scale-[0.98]
                bg-zinc-100 text-zinc-800 outline-zinc-200 hover:bg-zinc-200 hover:outline-zinc-300
                dark:bg-zinc-700 dark:text-zinc-50 dark:outline-zinc-600 hover:dark:bg-zinc-800 hover:dark:outline-zinc-700"
        >
            <p class="truncate pr-2 font-medium">Как это работает?</p>
        </Button.Root>

        <Button.Root
            onclick={() => {
                changelogOpen = true;
            }}
            class="flex flex-row items-center justify-center gap-3 w-full px-4 py-3 outline-[1.5px] rounded-lg cursor-pointer transition-all duration-150 active:scale-[0.98]
                bg-zinc-100 text-zinc-800 outline-zinc-200 hover:bg-zinc-200 hover:outline-zinc-300
                dark:bg-zinc-700 dark:text-zinc-50 dark:outline-zinc-600 hover:dark:bg-zinc-800 hover:dark:outline-zinc-700"
        >
            <p class="truncate pr-2 font-medium">Что нового?</p>
        </Button.Root>
    </div>
</div>

<!-- Dialogs -->
<AboutAppModal bind:open={infoDialogOpen} />
<EntityModal bind:selectedEntityId bind:open={addDialogOpen} />
<ChangelogModal bind:open={changelogOpen} />