<script lang="ts">
    import { ToggleGroup, Button, DropdownMenu } from "bits-ui";
    import { AddEntityDialog } from "$lib/components";
    import { addedEntities } from "$lib/persisted_store";
    import { EllipsisVertical, Trash2, Plus, ArrowLeftToLine } from 'lucide-svelte';
    
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

    function makeEntityDefault(entity_id: string) {
        $addedEntities = $addedEntities.filter((entity) => entity.id !== entity_id);
        selectedEntityId = $addedEntities[0].id;
    }

</script>

{#snippet entity_selector()}

    <!-- Container styling -->
    <ToggleGroup.Root class="flex flex-nowrap gap-2 w-full items-center overflow-scroll scrollbar-hidden" type="single" bind:value={selectedEntityId}>

            {#each $addedEntities as entity}

                <!-- Individual element styling -->
                <div class="flex flex-row flex-nowrap gap-1 items-center
                            pr-1.5 lg:pr-1 rounded-xl border-[1.5px] cursor-pointer
                            transition-all duration-100 active:scale-[0.99]

                            text-slate-800 dark:text-zinc-50
                            border-zinc-300 dark:border-zinc-500
                            hover:bg-zinc-50 hover:dark:bg-zinc-700

                            has-data-[state=on]:text-sky-700 dark:has-data-[state=on]:text-white
                            has-data-[state=on]:border-sky-500 dark:has-data-[state=on]:border-sky-700
                            has-data-[state=on]:bg-sky-100 dark:has-data-[state=on]:bg-sky-800                            
                            hover:has-data-[state=on]:bg-sky-100 hover:dark:has-data-[state=on]:bg-sky-800
                            ">
                    
                    <!-- Entity name -->
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
                            side="bottom" align="end" sideOffset={0}
                            class="flex flex-col p-1 border-1 rounded-lg gap-1 shadow-sm
                                   bg-zinc-50 border-zinc-300
                                   dark:bg-zinc-800 dark:border-zinc-700">

                            <!-- Make default button -->
                            <DropdownMenu.Item>
                                <Button.Root
                                    on:click={() => {console.log(`Made ${entity.id} default`)}}
                                    class="flex flex-row flex-nowrap gap-3 items-center
                                           px-4 py-2 lg:py-1.5 font-medium transition-all duration-150 rounded-md
                                           text-zinc-900 dark:text-zinc-50 hover:bg-zinc-100 dark:hover:bg-zinc-700">
                                    <ArrowLeftToLine size={22}/>
                                    В начало
                                </Button.Root>
                            </DropdownMenu.Item>

                            <!-- Delete button -->
                            <DropdownMenu.Item>
                                <Button.Root
                                    on:click={() => {deleteEntity(entity.id)}}
                                    class="flex flex-row flex-nowrap gap-3 items-center
                                           px-4 py-2 lg:py-1.5 font-medium transition-all duration-150 rounded-md
                                           text-red-500 dark:text-red-300 hover:bg-red-100 dark:hover:bg-zinc-700">
                                    <Trash2 size={22}/>
                                    Удалить
                                </Button.Root>
                            </DropdownMenu.Item>

                        </DropdownMenu.Content>
                    </DropdownMenu.Root>
                </div>
            {/each}

            <!-- ??? -->
            <div class="text-zinc-50 dark:text-zinc-800 select-none">AT</div> 
            
        </ToggleGroup.Root>
{/snippet}

<div class="flex flex-row flex-wrap gap-2 px-3 p-3
            lg:flex-nowrap lg:gap-4 justify-between
            w-full md:w-2/3 lg:w-full rounded-xl outline-1
            bg-zinc-50 dark:bg-zinc-800 outline-zinc-200 dark:outline-zinc-700">

    <!-- Logo -->
    <img src="/logo/logo-dark.svg" alt="Расписание МГЛУ" class="hidden dark:block h-12 min-w-max ml-1 overflow-hidden"/>
    <img src="/logo/logo-light.svg" alt="Расписание МГЛУ" class="block dark:hidden h-12 min-w-max ml-1 overflow-hidden"/>

    <!-- Entity selector -->
    <div class="flex items-center grow overflow-x-scroll order-3 lg:order-2 scrollbar-hidden">
        {@render entity_selector()}
    </div>

    <!-- Add button -->
    <div class="flex aspect-square self-center order-2 lg:order-3 shrink">
        <Button.Root on:click={() => (addEntityDialogOpen = true)} class="flex flex-row p-3 active:scale-[0.98] bg-blue-100 dark:bg-zinc-700 hover:bg-blue-200 dark:hover:bg-zinc-600 transition-all duration-100 rounded-xl">
            <Plus class="flex text-blue-800 dark:text-white"/>
        </Button.Root>
    </div>

</div>

<AddEntityDialog newEntitySubmitted={submitNewEntity} bind:dialogOpen={addEntityDialogOpen} />