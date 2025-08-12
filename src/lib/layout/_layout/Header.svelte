<script lang="ts">
    import { ToggleGroup, Button, DropdownMenu } from "bits-ui";
    import { AddDialog } from "$lib/layout";
    import { addedEntities } from "$lib/persisted";
    import EllipsisVertical from "@lucide/svelte/icons/ellipsis-vertical";
    import Plus from "@lucide/svelte/icons/plus";
    import X from "@lucide/svelte/icons/x";
    import ArrowLeftToLine from "@lucide/svelte/icons/arrow-left-to-line";

    let { selectedEntityId = $bindable() }: { selectedEntityId: string | undefined } = $props();

    let addDialogOpen = $state<boolean>(false);

    function getEntityPosition(entity_id: string | number): number {
        return addedEntities.current.findIndex(({ id }) => id === entity_id);
    }

    function deleteEntity(entity_id: string) {
        const index = addedEntities.current.findIndex((entity) => entity.id === entity_id);
        if (index != -1) {
            addedEntities.current.splice(index, 1);
        }
        console.log(`Deleted ${entity_id}`);
    }

    function makeEntityDefault(entity_id: string) {
        const index = addedEntities.current.findIndex((entity) => entity.id === entity_id);
        if (index != -1) {
            const entity = addedEntities.current.splice(index, 1);
            addedEntities.current.unshift(...entity);
        }
        console.log(`Made default ${entity_id}`);
    }
</script>

<AddDialog bind:selectedEntityId bind:dialogOpen={addDialogOpen} />

{#snippet entity_selector()}
    <!-- Container styling -->
    <ToggleGroup.Root
        type="single"
        bind:value={selectedEntityId}
        class="scrollbar-hidden px-3 flex w-full flex-nowrap items-center gap-2 overflow-scroll"
    >
        {#each addedEntities.current as entity}
            <!-- Individual element styling -->
            <div
                class="flex cursor-pointer flex-row flex-nowrap items-center
                            gap-1 rounded-xl border-[1.5px] border-zinc-300 pr-1.5
                            text-slate-800 transition-all duration-150

                            hover:bg-zinc-50 active:scale-[0.99]
                            has-data-[state=on]:border-sky-500 has-data-[state=on]:bg-sky-100
                            has-data-[state=on]:text-sky-700 hover:has-data-[state=on]:bg-sky-100

                            lg:pr-1 dark:border-zinc-500
                            dark:text-zinc-50 hover:dark:bg-zinc-700
                            dark:has-data-[state=on]:border-sky-700 dark:has-data-[state=on]:bg-sky-800
                            dark:has-data-[state=on]:text-white hover:dark:has-data-[state=on]:bg-sky-800
                            "
            >
                <!-- Entity name -->
                <ToggleGroup.Item
                    value={entity.id}
                    class="flex cursor-pointer flex-row py-2 pl-4 text-lg text-nowrap whitespace-nowrap lg:py-1.5 lg:pl-3.5"
                >
                    {entity.name}
                </ToggleGroup.Item>

                <!-- Ellipsis menu -->
                <DropdownMenu.Root>
                    <!-- Ellipsis button -->
                    <DropdownMenu.Trigger
                        class="cursor-pointer rounded-full p-1 transition-all duration-100 hover:bg-white/10 active:scale-[0.98] data-[state=open]:bg-sky-500/10 dark:data-[state=open]:bg-white/10"
                    >
                        <EllipsisVertical />
                    </DropdownMenu.Trigger>

                    <!-- Dropdown content -->
                    <DropdownMenu.Portal>
                        <DropdownMenu.Content
                            side="bottom"
                            align="end"
                            sideOffset={0}
                            class="flex flex-col gap-1 rounded-lg border-1 border-zinc-300 bg-zinc-50
                                   p-1 shadow-sm data-[state=open]:animate-scale-in data-[state=closed]:animate-scale-out
                                   dark:border-zinc-700 dark:bg-zinc-800"
                        >
                            <!-- Make default button -->
                            {#if getEntityPosition(entity.id) !== 0}
                                <DropdownMenu.Item>
                                    <Button.Root
                                        onclick={() => {
                                            makeEntityDefault(entity.id);
                                        }}
                                        class="flex flex-row flex-nowrap items-center gap-3
                                            rounded-md px-4 py-2 font-medium text-zinc-900 transition-all duration-150
                                            hover:bg-zinc-100 lg:py-1.5 dark:text-zinc-50 dark:hover:bg-zinc-700"
                                    >
                                        <ArrowLeftToLine size={22} />
                                        В начало
                                    </Button.Root>
                                </DropdownMenu.Item>
                            {/if}

                            <!-- Delete button -->
                            <DropdownMenu.Item>
                                <Button.Root
                                    onclick={() => {
                                        deleteEntity(entity.id);
                                    }}
                                    class="flex w-full flex-row flex-nowrap items-center gap-3
                                           rounded-md px-4 py-2 font-medium text-red-500 transition-all duration-150
                                           hover:bg-red-100 lg:py-1.5 dark:text-red-300 dark:hover:bg-zinc-700"
                                >
                                    <X size={22} />
                                    Закрыть
                                </Button.Root>
                            </DropdownMenu.Item>
                        </DropdownMenu.Content>
                    </DropdownMenu.Portal>
                </DropdownMenu.Root>
            </div>
        {/each}

        <!-- ??? -->
        <!-- <div class="text-zinc-50 dark:text-zinc-800 select-none">AT</div>  -->
    </ToggleGroup.Root>
{/snippet}

<!-- rounded-xl? -->
<div
    class="flex w-full flex-col gap-3
            rounded-2xl bg-zinc-50 py-3
            outline-1 outline-zinc-200 md:w-2/3 lg:w-full
            lg:flex-nowrap lg:gap-4 dark:bg-zinc-800 dark:outline-zinc-700"
>
    <div class="flex px-3 flex-row gap-2 flex-wrap lg:flex-nowrap justify-between">
        <!-- Logo -->
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

        <!-- Entity selector on desktop -->
        <div class="hidden lg:flex w-full scrollbar-hidden overflow-x-scroll">
            {@render entity_selector()}
        </div>

        <!-- Add button -->
        <div class="flex aspect-square self-center">
            <Button.Root
                onclick={() => (addDialogOpen = true)}
                class="flex flex-row rounded-xl bg-sky-100 p-3 transition-all duration-150 outline-[1.5px] outline-sky-300 dark:outline-zinc-600 hover:bg-sky-200 active:scale-[0.98] dark:bg-zinc-700 dark:hover:bg-zinc-600"
            >
                <Plus class="flex text-sky-800 dark:text-white" />
            </Button.Root>
        </div>
    </div>

    <!-- Entity selector on mobile (shown only if there are added entities) -->
    {#if addedEntities.current.length > 0}
        <div class="flex lg:hidden flex-nowrap scrollbar-hidden overflow-x-scroll">
            {@render entity_selector()}
        </div>
    {/if}
</div>
