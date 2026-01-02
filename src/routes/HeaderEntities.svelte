<script lang="ts">
    import { Cached } from "$lib/cached";
    import { savedEntities } from "./saved-entities.svelte";
    import { Button, DropdownMenu } from "bits-ui";
    import { goto } from "$app/navigation";
    import { page } from "$app/state";
    import { clsx } from "clsx";
    import X from "@lucide/svelte/icons/x";
    import House from "@lucide/svelte/icons/house";
    import Arrow from "@lucide/svelte/icons/arrow-left-to-line";
    import Ellipsis from "@lucide/svelte/icons/ellipsis-vertical";

    /** Function to check if entity is first in `savedEntities`
     * it order not to display `Make default button`*/
    function isEntityFirst(uuid: string): boolean {
        const index = savedEntities.findIndex((entity) => entity.uuid === uuid);
        return index === 0 ? true : false;
    }

    function deleteEntity(uuid: string) {
        // Get entity index by uuid
        const index = savedEntities.findIndex((entity) => entity.uuid === uuid);

        // Delete it from saved by index and update cache
        if (index != -1) {
            savedEntities.splice(index, 1);
            Cached.updateSaved(savedEntities);
        }

        // In case deleted entity is currently open go home
        if (page.params.uuid === uuid) {
            goto("/")
        }
    }

    function makeEntityDefault(uuid: string) {
        // Get entity index by uuid
        const index = savedEntities.findIndex((entity) => entity.uuid === uuid);

        // Get entity index by uuid
        if (index != -1) {
            const entity = savedEntities.splice(index, 1);
            savedEntities.unshift(...entity);
            Cached.updateSaved(savedEntities);
        }
    }

</script>

<div class="flex px-3 lg:px-0 flex-row items-center flex-nowrap w-full gap-1 overflow-scroll scrollbar-hidden">
    <a href="/" class="flex items-center justify-center lg:hidden rounded-lg border-[1.5px] border-border bg-bg-elevated h-11 lg:h-10 aspect-square cursor-pointer">
        <House size={22}/>
    </a>
    {#each savedEntities as savedEntity}
        <div class={clsx("flex flex-row flex-nowrap h-11 lg:h-10 rounded-lg border-[1.5px]", {
            "border-border-accent bg-bg-accent": savedEntity.uuid === page.params.uuid,
            "border-border bg-none": savedEntity.uuid !== page.params.uuid,
        })}>
            <Button.Root
                class="text-nowrap pl-4 cursor-pointer"
                onclick={async () => {await goto(`/${savedEntity.uuid}`)}}
            >
                {savedEntity.name}
            </Button.Root>
            <DropdownMenu.Root>
                <DropdownMenu.Trigger class={clsx("flex aspect-square m-1 cursor-pointer items-center justify-center rounded-full", {
                        "hover:bg-bg-accent-alt": savedEntity.uuid === page.params.uuid,
                        "hover:bg-bg-elevated": savedEntity.uuid !== page.params.uuid,
                    })}>
                    <Ellipsis size={20}/>
                </DropdownMenu.Trigger>
                <DropdownMenu.Portal>
                    <DropdownMenu.Content
                        side="bottom"
                        align="end"
                        sideOffset={0}
                        class="flex flex-col rounded-lg border border-zinc-300 bg-zinc-50
                                p-1 shadow-sm data-[state=open]:animate-scale-in data-[state=closed]:animate-scale-out
                                dark:border-zinc-700 dark:bg-zinc-800"
                    >
                        <!-- Make default button -->
                        {#if !isEntityFirst(savedEntity.uuid)}
                            <DropdownMenu.Item>
                                <Button.Root
                                    onclick={() => {
                                        makeEntityDefault(savedEntity.uuid);
                                    }}
                                    class="flex flex-row flex-nowrap items-center gap-3
                                        rounded-md px-3 py-2 text-zinc-900 transition-all duration-150
                                        hover:bg-zinc-100 lg:py-1.5 dark:text-zinc-50 dark:hover:bg-zinc-700"
                                >
                                    <Arrow size={21} />
                                    В начало
                                </Button.Root>
                            </DropdownMenu.Item>
                        {/if}

                        <!-- Delete button -->
                        <DropdownMenu.Item>
                            <Button.Root
                                onclick={() => {
                                    deleteEntity(savedEntity.uuid);
                                }}
                                class="flex w-full flex-row flex-nowrap items-center gap-3
                                        rounded-md px-3 py-2 text-red-500 transition-all duration-150
                                        hover:bg-red-100 lg:py-1.5 dark:text-red-300 dark:hover:bg-zinc-700"
                            >
                                <X size={21} />
                                Закрыть
                            </Button.Root>
                        </DropdownMenu.Item>
                    </DropdownMenu.Content>
                </DropdownMenu.Portal>
            </DropdownMenu.Root>
        </div>

    {/each}
</div>