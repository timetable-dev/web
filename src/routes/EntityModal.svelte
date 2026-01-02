<script lang="ts">
    import type { ResponseEntity, SavedEntity, EntityType } from "$lib/types";
    import EntityModalGroup from "./EntityModalGroup.svelte"
    import EntityModalTeacher from "./EntityModalTeacher.svelte"
    import { savedEntities } from "./saved-entities.svelte";
    import { Dialog, Tabs } from "bits-ui";
    import { Cached } from "$lib/cached";
    import { goto } from "$app/navigation";

    let { open = $bindable(false) }: { open: boolean } = $props();

    let selectedType = $state<EntityType>("group");
    let selectedGroup = $state<ResponseEntity>();
    let selectedTeacher = $state<ResponseEntity>();

    let disabled = $state(true);

    $effect(() => {
        if (selectedGroup || selectedTeacher) {
            disabled = false;
        } else {
            disabled = true;
        }
    })

    function submitEntity() {
        if (selectedType === "group" && selectedGroup) {
            const entity: SavedEntity = {
                uuid: crypto.randomUUID(),
                name: selectedGroup.label,
                type: "group",
                bsuflId: selectedGroup.id,
                base64: selectedGroup.base64,
                customName: "",
            }
            savedEntities.push(entity);
            Cached.updateSaved(savedEntities);
            goto(`/${entity.uuid}`);
        } else if (selectedType === "teacher" && selectedTeacher) {
            const entity: SavedEntity = {
                uuid: crypto.randomUUID(),
                name: selectedTeacher.label,
                type: "teacher",
                bsuflId: selectedTeacher.id,
                base64: selectedTeacher.base64,
                customName: "",
            }
            savedEntities.push(entity);
            Cached.updateSaved(savedEntities);
            goto(`${entity.uuid}`);
        }
    }
        
</script>

<Dialog.Root bind:open > 

    <!-- Overlay -->
    <Dialog.Overlay class="bits-ui-overlay bg-overlay data-[state=open]:animate-fade-in data-[state=closed]:animate-fade-out" />

    <!-- Modal contents -->
    <Dialog.Content class="bits-ui-modal overflow-auto bg-bg data-[state=open]:animate-scale-in data-[state=closed]:animate-scale-out" >

        <!-- Modal title -->
        <Dialog.Title class="text-center text-xl pt-1 pb-4">Открыть расписание</Dialog.Title>
        <Tabs.Root bind:value={selectedType}>

            <!-- Group / teacher select (as tabs) -->
            <Tabs.List
                class="grid grid-cols-2 gap-1 w-full h-12 rounded-xl">
                    <Tabs.Trigger 
                        value="group"
                        class="rounded-l-xl cursor-pointer rounded-r-sm border-[1.5px]
                               transition-all duration-150 active:scale-[99%]
                               bg-bg-elevated border-border text-fg focus:outline-focus
                               data-[state=active]:bg-bg-accent data-[state=active]:border-border-accent data-[state=active]:text-fg-accent"
                    >
                        Группы
                    </Tabs.Trigger>
                    <Tabs.Trigger 
                        value="teacher"
                        class="rounded-r-xl cursor-pointer rounded-l-sm border-[1.5px]
                               transition-all duration-150 active:scale-[99%]
                               bg-bg-elevated border-border text-fg focus:outline-focus
                               data-[state=active]:bg-bg-accent data-[state=active]:border-border-accent data-[state=active]:text-fg-accent"
                    >
                        Преподаватели
                    </Tabs.Trigger>
            </Tabs.List>

            <!-- Group tab -->
            <Tabs.Content value="group" class="flex flex-col"> 
                {#if selectedType === "group"}
                    <EntityModalGroup bind:selectedGroup/>
                {/if}
            </Tabs.Content>

            <!-- Teacher tab -->
            <Tabs.Content value="teacher"> 
                {#if selectedType === "teacher"}
                    <EntityModalTeacher bind:selectedTeacher/>
                {/if}
            </Tabs.Content>
        </Tabs.Root>

        <!-- Submit and close buttons -->
        <div class="grid grid-cols-2 pt-4 gap-1">
            <Dialog.Close class="h-11.5 border-[1.5px] rounded-xl cursor-pointer bg-bg-elevated border-border text-fg">Отмена</Dialog.Close>
            <Dialog.Close {disabled} onclick={() => submitEntity()} class="h-11.5 border-[1.5px] rounded-xl cursor-pointer disabled:cursor-not-allowed disabled:bg-bg-elevated-alt disabled:border-border disabled:text-fg-muted bg-bg-accent border-border-accent text-fg-accent">Продолжить</Dialog.Close>
        </div>
    </Dialog.Content>
</Dialog.Root>