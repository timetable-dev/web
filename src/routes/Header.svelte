<script lang="ts">
    import { goto } from "$app/navigation";
    import { Button } from "bits-ui";
    import { savedEntities } from "./saved-entities.svelte";
    import EntityModal from "./EntityModal.svelte";
    import Entities from "./HeaderEntities.svelte";
    import Plus from "@lucide/svelte/icons/plus";

    let entityModalOpen = $state(false);

</script>

<EntityModal bind:open={entityModalOpen} />

<div class="flex w-full flex-col gap-3
            rounded-2xl bg-zinc-50 py-3
            outline-1 outline-zinc-200 self-center md:w-2/3 lg:w-full
            lg:flex-nowrap lg:gap-4 dark:bg-zinc-800 dark:outline-zinc-700"
>
    <div class="flex px-3 flex-row gap-2 flex-nowrap justify-between">
        <!-- Logo -->
        <Button.Root class="cursor-pointer" onclick={() => goto("/")}>
            <img
                src="/logo/logo-dark.svg"
                alt="Расписание БГУИЯ"
                class="ml-1 hidden h-12 min-w-max translate-y-[0.050rem] overflow-hidden dark:block"
            />
            <img
                src="/logo/logo-light.svg"
                alt="Расписание БГУИЯ"
                class="ml-1 block h-12 min-w-max translate-y-[0.100rem] overflow-hidden dark:hidden"
            />
        </Button.Root>

        <!-- Entity selector on desktop -->
        <div class="hidden lg:flex w-full scrollbar-hidden overflow-x-scroll">
            <Entities />
        </div>

        <!-- Add button -->
        <div class="flex aspect-square self-center">
            <Button.Root
                onclick={() => (entityModalOpen = true)}
                class="flex flex-row rounded-xl bg-sky-100 p-3 transition-all duration-150 outline-[1.5px] outline-sky-300 dark:outline-zinc-600 hover:bg-sky-200 active:scale-[0.98] dark:bg-zinc-700 dark:hover:bg-zinc-600"
            >
                <Plus class="flex text-sky-800 dark:text-white" />
            </Button.Root>
        </div>
    </div>

    <!-- Entity selector on mobile (shown only if there are added entities) -->
    {#if savedEntities.length > 0}
        <div class="flex lg:hidden flex-nowrap scrollbar-hidden overflow-x-scroll">
            <Entities />
        </div>
    {/if}
</div>
