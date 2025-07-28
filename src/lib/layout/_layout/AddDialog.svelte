<script lang="ts">
    import type { Entity } from "$lib/types";
    import { Select, Combobox, SkeletonSmall } from "$lib/components";
    import { Dialog, Tabs, RadioGroup, Label } from "bits-ui";
    import { addedEntities } from "$lib/entities";

    type SelectItem = { value: string, label: string }
    
    let { dialogOpen = $bindable(false), selectedEntityId = $bindable() }: {dialogOpen: boolean, selectedEntityId: string | undefined} = $props();

    let faculties: SelectItem[] = [
        {value: "202", label: "ФАЯ"},
        {value: "196", label: "ФНЯ"},
        {value: "222", label: "ФРЯ"},
        {value: "221", label: "ФКЯиК"},
        {value: "193", label: "ФМК"},
        {value: "203", label: "ПФ"},
        {value: "217", label: "Магистратура"},
    ];

    let selectedType = $state<"group" | "teacher">("group");
    let selectedFaculty = $state<SelectItem>();
    let selectedMode = $state<"1" | "2" | "">("");

    let selectedFacultyValue = $state<string>();

    $effect(() => {
        selectedFaculty = faculties.find(({ value }) => value === selectedFacultyValue)
    })

    // Automatically fetching either a list of groups if group tab is active
    // and faculty and mode are selected or a list of teachers if teacher tab is active.

    let groupList = $state<Promise<SelectItem[]>>();
    let teacherList = $state<Promise<SelectItem[]>>();

    let selectedGroup = $state<SelectItem>()
    let selectedTeacher = $state<SelectItem>()

    async function getGroups(selectedFaculty: any, selectedMode: any): Promise<SelectItem[]> {
        const res = await fetch(`/api/groups/${selectedFaculty.value}/${selectedMode}`);
        return await res.json()
    }

    async function getTeachers(): Promise<SelectItem[]> {
        let res = await fetch("/api/teachers")
        return await res.json()
    }

    $effect(() => {
        if (selectedType === "group" && selectedFaculty && selectedMode) {
            groupList = getGroups(selectedFaculty, selectedMode)
        } else if (selectedType === "teacher") {
            teacherList = getTeachers()
        }
    })

    // Submitting entity

    let submitButtonActive = $state<boolean>(false)
    let submitButtonStyle = $derived((
        submitButtonActive
        ? "bg-blue-500 text-white hover:bg-blue-600 cursor-pointer"
        : "bg-zinc-50 text-zinc-400 cursor-not-allowed dark:bg-zinc-800"
    ))

    $effect(() => {
        if (selectedType === "group" && selectedGroup) {
            submitButtonActive = true

        } else if (selectedType === "teacher" && selectedTeacher) {
            submitButtonActive = true
        }
    })

    function clearInput() {
        selectedType = "group";
        selectedFaculty = undefined;
        selectedMode = "";
        selectedGroup = undefined;
        selectedTeacher = undefined;
        groupList = undefined;
        teacherList = undefined;
        submitButtonActive = false;
    }

    function submitEntityAndClose() {
        if (selectedType === "group" && selectedGroup) {
            const selectedEntity: Entity = { id: crypto.randomUUID(), name: selectedGroup.label, mslu_id: selectedGroup.value, type: "group"};
            addedEntities.current.push(selectedEntity);
            selectedEntityId = selectedEntity.id;
        } else if (selectedType === "teacher" && selectedTeacher) {
            const selectedEntity: Entity = { id: crypto.randomUUID(), name: selectedTeacher.label, mslu_id: selectedTeacher.value, type: "teacher"};
            addedEntities.current.push(selectedEntity);
            selectedEntityId = selectedEntity.id;
        }

        clearInput();
    }

</script>

<Dialog.Root bind:open={dialogOpen}>
    <Dialog.Trigger />
    <Dialog.Portal>
        <Dialog.Overlay
            class="fixed inset-0 z-50 bg-black/50 dark:bg-zinc-800/80"
        />
        <Dialog.Content
            class="fixed left-1/2 top-1/2 translate-[-50%] p-2 pt-4 z-50 flex flex-col gap-3 outline-1 rounded-lg w-[90%] md:w-2/3 lg:w-1/3 shadow-md
                  bg-white outline-zinc-300 text-zinc-950 dark:text-zinc-50 dark:bg-zinc-900 dark:outline-zinc-800"
        >
            <!-- Заголовок: Добавить расписание -->
            <Dialog.Title class="text-xl font-medium text-center mb-1 text-zinc-900 dark:text-white">Добавить расписание</Dialog.Title>
            
            <!-- Для групп / Для преподавателей -->
            <Tabs.Root bind:value={selectedType}>
                <Tabs.List class="grid w-full grid-cols-2 gap-1 rounded-md p-1 font-medium inset-shadow-sm dark:inset-shadow-none
                                  bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-white">
                    <Tabs.Trigger
                        value="group"
                        class="p-2 rounded-sm text-nowrap truncate
                               text-zinc-800 dark:text-zinc-200 data-[state=active]:text-zinc-950 dark:data-[state=active]:text-zinc-50
                               data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-700
                               data-[state=active]:shadow-sm dark:data-[state=active]:shadow-none"
                        >
                        Группы
                    </Tabs.Trigger>
                    <Tabs.Trigger
                        value="teacher"
                        class="p-2 rounded-sm text-nowrap truncate
                            text-zinc-800 dark:text-zinc-200 data-[state=active]:text-zinc-950 dark:data-[state=active]:text-zinc-50
                            data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-700
                            data-[state=active]:shadow-sm dark:data-[state=active]:shadow-none"
                        >
                        Преподаватели
                    </Tabs.Trigger>
                </Tabs.List>

                <!-- Для групп -->
                <Tabs.Content value="group" class="flex flex-col">

                    <!-- Выбор факультета -->
                    <Label.Root class="p-2 my-1.5 text-zinc-900 dark:text-zinc-100 font-medium">Выбери факультет:</Label.Root>
                    <Select items={faculties} bind:selectedItem={selectedFaculty} placeholder="Факультет"/>

                    <!-- Выбор формы обучения -->
                    <Label.Root class="p-2 my-1.5 text-zinc-900 dark:text-zinc-100 font-medium">Выбери форму обучения:</Label.Root>
                    <RadioGroup.Root bind:value={selectedMode} class="flex flex-col gap-3 pl-6">
                        <div class="flex flex-row gap-4 items-center">
                            <RadioGroup.Item id="offline" value="1" class="cursor-pointer size-5 rounded-full transition-all ease-in-out border-2 border-zinc-700 dark:border-zinc-100 data-[state=checked]:border-[6px] data-[state=checked]:border-blue-500 dark:data-[state=checked]:border-blue-400"/>
                            <Label.Root for="offline" class="cursor-pointer text-foreground dark:text-foreground-dark">Очная</Label.Root>
                        </div>
                        <div class="flex flex-row gap-4 items-center">
                            <RadioGroup.Item id="online" value="2" class="cursor-pointer size-5 rounded-full transition-all ease-in-out border-2 border-zinc-700 dark:border-zinc-100 data-[state=checked]:border-[6px] data-[state=checked]:border-blue-500 dark:data-[state=checked]:border-blue-400"/>
                            <Label.Root for="online" class="cursor-pointer text-foreground dark:text-foreground-dark">Заочная</Label.Root>
                        </div>
                    </RadioGroup.Root>

                    <!-- Выбор группы -->
                    {#if groupList}
                        {#await groupList}
                            <SkeletonSmall />
                        {:then response} 
                            <Label.Root class="p-2 my-1.5 text-zinc-900 dark:text-zinc-100 font-medium">Выбери группу:</Label.Root>
                            <Combobox items={response} placeholder="Номер группы" bind:selectedItem={selectedGroup}/>
                        {/await}
                    {/if}
                </Tabs.Content>

                <!-- Для преподавателей -->
                <Tabs.Content value="teacher" class="flex flex-col">
                    {#if teacherList}
                        {#await teacherList}
                            <SkeletonSmall />
                        {:then response}
                            <Label.Root class="p-2 my-1.5 text-zinc-900 dark:text-zinc-100 font-medium">Выберите преподавателя:</Label.Root>
                            <Combobox items={response} placeholder="Фамилия И. О." bind:selectedItem={selectedTeacher}/>
                        {/await}
                    {/if}
                </Tabs.Content>
            </Tabs.Root>

            <!-- Отмена / Добавить -->
            <div class="grid w-full gap-2 grid-cols-2 mt-2">
                <Dialog.Close onclick={clearInput} class="py-2.5 font-medium cursor-pointer active:scale-[0.98] rounded-md transition-all duration-150 bg-zinc-100 dark:bg-zinc-600 hover:bg-zinc-200 dark:hover:bg-zinc-700">
                    Отмена
                </Dialog.Close>
                <Dialog.Close onclick={() => {submitEntityAndClose()}} class="py-2.5 font-medium rounded-md transition-all duration-150 active:scale-[0.98] {submitButtonStyle}">
                    Добавить
                </Dialog.Close>
            </div>
        </Dialog.Content>
    </Dialog.Portal>
</Dialog.Root>