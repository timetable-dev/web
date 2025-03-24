<script lang="ts">
    import { Dialog, ToggleGroup, Button, DropdownMenu } from "bits-ui";
    import { RotateCw, CirclePlus, ListCollapse } from "lucide-svelte";
    import { AddEntityDialog } from "$lib/components";
    import { flyAndScale, fade } from "$lib/transitions";
    import { mode } from "mode-watcher";
    import { addedEntities } from "$lib/stores";
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

    let version = $state<string>("v 0.1");
    let counter = $state<number>(0);
    let timeout = $state<boolean>(true)

    function revealGithub() {
        if (counter < 5) {
            counter += 1;
            console.log(`Click ${6 - counter} more time${counter == 5 ? "" : "s"}`)
        } else if (counter == 5) {
            counter += 1;
            version = "GitHub";
            setTimeout(() => {
                timeout = false;
                console.log("Timeout ended")
            }, 1000);
        } else if (counter == 6 && !timeout) {
            console.log("Going to GitHub")
            window.location.href = "https://github.com/timetable-dev/web"
        } else {
            console.log("Wait a second...")
        }
    }

</script>

<div class="relative flex flex-col rounded-xl
            lg:flex-row gap-2 lg:gap-4 outline-1
            py-3 lg:py-1
            w-full md:w-2/3 lg:w-full
            bg-zinc-50 dark:bg-zinc-800 outline-zinc-200 dark:outline-zinc-700">

    <!-- Logo -->
    <!-- <div class="flex order-1 grow pl-2.5 lg:grow-0"> -->
    <div class="flex pl-2.5 lg:shrink-0 ">
        {#if $mode == "dark"}
            <img src="/logo-dark.svg" alt="Расписание МГЛУ" class="h-16 lg:p-1"/>
        {:else}
            <img src="/logo-light.svg" alt="Расписание МГЛУ" class="h-16 lg:p-1"/>
        {/if}
    </div>

    <!-- Info -->
    <div class="absolute top-6 lg:top-[16px] right-4 lg:right-3 flex items-center">
        <Dialog.Root>
            <Dialog.Trigger class="hover:bg-zinc-200 dark:hover:bg-zinc-700 duration-200 p-2 mr-2 rounded-lg cursor-pointer">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-info text-zinc-800 dark:text-white"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
            </Dialog.Trigger>
            <Dialog.Portal>
                <Dialog.Overlay
                    transition={fade}
                    transitionConfig={{ duration: 150 }}
                    class="fixed inset-0 z-50 bg-black/50 dark:bg-zinc-800/80"
                />
                <Dialog.Content
                    transition={flyAndScale}
                    class="fixed left-1/2 top-1/2 translate-[-50%] z-50
                           flex flex-col gap-6 rounded-lg w-[90%] md:w-1/2 lg:w-1/3 max-h-5/6 p-5 pt-8
                         bg-white outline-zinc-300 dark:bg-zinc-900 dark:outline-zinc-800">

                    <div class="flex flex-col overflow-y-auto gap-8">
                        <div class="flex flex-col md:flex-row gap-2 md:gap-4">
                            <div class="flex w-min h-min p-2.5 rounded-md bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-200">
                                <RotateCw size="22" />
                            </div>
                            <p class="text-lg text-balance">Самое свежее расписание загружается автоматически при каждом обновлении страницы.</p>
                        </div>
                        <div class="flex flex-col md:flex-row gap-2 md:gap-4">
                            <div class="flex w-min h-min p-2.5 rounded-md bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-200">
                                <CirclePlus size="22" />
                            </div>
                            <p class="text-lg text-balance">Чтобы добавить расписание, нажмите на плюсик, а чтобы удалить – на три точки.</p>
                        </div>
                        <div class="flex flex-col md:flex-row gap-2 md:gap-4">
                            <div class="flex w-min h-min p-2.5 rounded-md bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-200">
                                <ListCollapse size="22" />
                            </div>
                            <p class="text-lg text-balance">Нажмите на занятие, чтобы посмотреть подробную информацию о нём.</p>
                        </div>
                    </div>

                    <div class="flex flex-row justify-between items-center">

                        <button class="pl-6 pr-12 py-2 rounded-md active:transition-all duration-75
                                       active:bg-zinc-200 active:dark:bg-zinc-700 active:scale-[0.95]"
                                onclick={revealGithub}
                                       >
                                       {version}
                        </button>

                        <Dialog.Close
                            class="flex self-end px-6 py-2 mt-2 outline-1 rounded-lg cursor-pointer duration-100 active:scale-[0.98]
                                   text-zinc-900 dark:text-zinc-50 outline-zinc-200 dark:outline-zinc-600 bg-zinc-100 dark:bg-zinc-700 hover:bg-zinc-200 hover:dark:bg-zinc-800 hover:dark:outline-zinc-700">
                            Понятно
                        </Dialog.Close>
                    </div>

                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    </div>

    <!-- Entity selector -->
    <div class="flex px-3 items-center overflow-x-scroll scrollbar-hidden lg:mr-20">
        <ToggleGroup.Root class="flex flex-row gap-2 items-center w-full h-max" type="single" bind:value={selectedEntityId}>

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
                        class="flex flex-row pl-4 lg:pl-3.5 py-2 lg:py-1.5  text-nowrap text-lg whitespace-nowrap cursor-pointer"> 
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

            <!-- Add schedule button -->
            <Button.Root on:click={() => (addEntityDialogOpen = true)} class="p-2.5 shrink-0 active:scale-[0.98] bg-zinc-100 dark:bg-zinc-700 hover:bg-zinc-200 dark:hover:bg-zinc-600 transition-all duration-100 rounded-full">
                <Plus />
            </Button.Root>
            <div class="text-zinc-50 dark:text-zinc-800 select-none">AT</div> 

            <AddEntityDialog newEntitySubmitted={submitNewEntity} bind:dialogOpen={addEntityDialogOpen} />
        </ToggleGroup.Root>
    </div>
</div>