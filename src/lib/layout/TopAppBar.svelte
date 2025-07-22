<script lang="ts">
    import { ToggleGroup, Button, DropdownMenu } from "bits-ui";
    import { AddEntityDialog } from "$lib/components";
    import { flyAndScale } from "$lib/transitions";
    import { mode } from "mode-watcher";
    import { addedEntities } from "$lib/persisted_store";
    import { EllipsisVertical, Trash2, Plus } from 'lucide-svelte';
    
    let { selectedEntityId = $bindable() }: { selectedEntityId:  string | undefined } = $props();
    
    let addEntityDialogOpen = $state<boolean>(false);

    function submitNewEntity() {
        const newEntityId = [...$addedEntities][$addedEntities.length - 1].id;
        selectedEntityId = newEntityId;
    }

    function deleteEntity(entity_id: string) {
        $addedEntities = $addedEntities.filter((entity) => entity.id !== entity_id);
        selectedEntityId = $addedEntities[0].id;
    }

</script>

<div class="flex flex-row flex-wrap gap-2 px-3 py-3 lg:py-1
            lg:flex-nowrap lg:gap-4
            w-full md:w-2/3 lg:w-full rounded-xl outline-1
            bg-zinc-50 dark:bg-zinc-800 outline-zinc-200 dark:outline-zinc-700">

    <!-- Logo -->
    <div class="flex order-1 grow h-16 p-1">
        {#if mode.current === "dark"}
            <img src="/logo/logo-dark.svg" alt="Расписание МГЛУ" />
        {:else}
            <img src="/logo/logo-light.svg" alt="Расписание МГЛУ" />
        {/if}
    </div>

    <!-- Entity selector -->
    <div class="flex items-center grow overflow-x-scroll order-3 lg:order-2 scrollbar-hidden">
        <ToggleGroup.Root class="flex flex-row gap-2 items-center w-full" type="single" bind:value={selectedEntityId}>

            {#each $addedEntities as entity}
                <div class="flex flex-row flex-nowrap items-center rounded-xl
                            gap-1 pr-1.5 lg:pr-1
                            cursor-pointer active:scale-[0.99]
                            transition-all duration-100
                            border-[1.5px]

                            text-slate-800
                            dark:text-zinc-50
                            has-data-[state=on]:text-sky-700
                            dark:has-data-[state=on]:text-white

                            has-data-[state=on]:bg-sky-100
                            dark:has-data-[state=on]:bg-sky-800

                            hover:bg-zinc-50
                            hover:dark:bg-zinc-700
                            hover:has-data-[state=on]:bg-sky-100
                            hover:dark:has-data-[state=on]:bg-sky-800

                            border-zinc-300
                            dark:border-zinc-500
                            has-data-[state=on]:border-sky-500
                            dark:has-data-[state=on]:border-sky-700
                            ">
                    
                    <!-- Entity name -->
                    <!-- NOTE: maybe base pl-3.5 -->
                    <ToggleGroup.Item
                        value={entity.id}
                        class="flex flex-row pl-4 lg:pl-3.5 py-2 lg:py-1.5 text-nowrap text-lg whitespace-nowrap cursor-pointer"> 
                        {entity.name}
                    </ToggleGroup.Item>

                    <!-- Ellipsis menu -->
                    <DropdownMenu.Root>

                        <!-- Ellipsis button -->
                        <DropdownMenu.Trigger class="p-1 cursor-pointer active:scale-[0.98] data-[state=open]:bg-sky-500/10 dark:data-[state=open]:bg-white/10 hover:bg-white/10 transition-all duration-100 rounded-full">
                            <EllipsisVertical />
                        </DropdownMenu.Trigger>

                        <!-- Dropdown content -->
                        <DropdownMenu.Content
                            transition={flyAndScale}
                            side="bottom" align="end" sideOffset={0}
                            class="flex flex-col p-1 border-1 rounded-md shadow-sm
                                   bg-zinc-50 border-zinc-300
                                   dark:bg-zinc-800 dark:border-zinc-700">

                            <!-- Delete button -->
                            <DropdownMenu.Item>
                                <Button.Root
                                    on:click={() => {deleteEntity(entity.id)}}
                                    class="py-2 lg:py-1.5 px-4 font-medium transition-all duration-150 rounded-md
                                        flex flex-row flex-nowrap items-center gap-3
                                        hover:bg-red-100 text-red-500
                                        dark:hover:bg-zinc-700 dark:text-red-300">
                                    <Trash2 size={22}/>
                                    Удалить
                                </Button.Root>
                            </DropdownMenu.Item>

                            <!-- TODO in future version: "Make default" action button -->

                        </DropdownMenu.Content>
                    </DropdownMenu.Root>
                </div>
            {/each}

            <!-- <div class="text-zinc-50 dark:text-zinc-800 select-none">AT</div>  -->
            
        </ToggleGroup.Root>
        
    </div>

    <!-- Add button -->
    <div class="flex aspect-square self-center order-2 lg:order-3 shrink">
        <Button.Root on:click={() => (addEntityDialogOpen = true)} class="flex flex-row p-3 active:scale-[0.98] bg-blue-100 dark:bg-zinc-700 hover:bg-blue-200 dark:hover:bg-zinc-600 transition-all duration-100 rounded-xl">
            <Plus class="flex text-blue-800 dark:text-white"/>
        </Button.Root>
    </div>

</div>

<AddEntityDialog newEntitySubmitted={submitNewEntity} bind:dialogOpen={addEntityDialogOpen} />