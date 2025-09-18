<script lang="ts">
    import type { ResponseEntity, SelectItem } from "$lib/types";
    import type { RemoteQuery } from "@sveltejs/kit";
    import { RadioGroup, Label, Select, Combobox } from "bits-ui";
    import { getGroups } from "$lib/remote/entities.remote";
    import Chevrons from "@lucide/svelte/icons/chevrons-up-down";
    import TextCursorInput from "@lucide/svelte/icons/text-cursor-input";

    let { selectedGroup = $bindable(undefined) }:
        { selectedGroup: ResponseEntity | undefined }= $props()

    const faculties: SelectItem<string, string>[] = [
        { value: "202", label: "ФАЯ" },
        { value: "196", label: "ФНЯ" },
        { value: "222", label: "ФРЯ" },
        { value: "221", label: "ФКЯиК" },
        { value: "193", label: "ФМК" },
        { value: "203", label: "ПФ" },
        { value: "217", label: "Магистратура" },
    ];

    let open = $state(false);
    let value = $state<string>();

    let selectedFaculty = $state<SelectItem<string, string>>();
    let selectedMode = $state<"1" | "0">();

    let groups = $state<RemoteQuery<ResponseEntity[]>>();
    let searchValue = $state<string>("");

    let filteredGroups = $state<ResponseEntity[]>([]);

    $effect(() => {
        if (searchValue && groups && groups.current) {
            filteredGroups = groups.current.filter((group) => group.name.toLowerCase().includes(searchValue.toLowerCase()));
        } else if (groups && groups.current) {
            filteredGroups = groups.current;
        } else {
            filteredGroups = [];
        }
    })

    $effect(() => {
        if (selectedFaculty && selectedMode) {
            groups = getGroups({ faculty: selectedFaculty.value, mode: selectedMode});
        };
    })

    $effect(() => {
        if (filteredGroups) {
            selectedGroup = filteredGroups.find((group) => group.id === value);
        };
    })
    
</script>

<!-- Selecting faculty -->
<Label.Root class="pt-3 pb-2 font-medium text-fg" for="faculty">Выбери факультет</Label.Root>
<Select.Root items={faculties} type="single" onValueChange={(v) => {selectedFaculty = faculties.find((i) => i.value === v)}}>

    <!-- Input field with selected faculty's name or placeholder -->
    <Select.Trigger
        id="faculty"
        class="w-full h-12 rounded-xl border-[1.5px] cursor-pointer
                bg-bg-elevated border-border text-fg
                transition-all duration-150
                focus:outline-2 focus:outline-offset-2 focus:outline-focus">
        <div class="flex flex-row w-full justify-between">
            {#if selectedFaculty}
                <span class="px-4">{selectedFaculty.label}</span>
            {:else}
                <span class="px-4 text-fg-muted">Факультет</span>
            {/if}
            <span>
                <Chevrons class="mx-3 text-fg-muted"/>
            </span>
        </div>
    </Select.Trigger>

    <!-- Faculties list -->
    <Select.Content class="data-[state=open]:animate-scale-in data-[state=closed]:animate-scale-out mt-2 flex max-h-52 w-[var(--bits-select-anchor-width)] flex-col overflow-y-auto rounded-xl
                    border-[1.5px] border-border bg-bg
                    p-1"> 
        {#each faculties as faculty}
            <Select.Item
                class="w-full cursor-pointer p-2 active:scale-[0.95] data-[highlighted]:bg-bg-elevated data-[selected]:bg-bg-accent rounded-lg"
                value={faculty.value}
                label={faculty.label}
            >
                {faculty.label}
            </Select.Item>
        {/each}
    </Select.Content>
</Select.Root>

<!-- Selecting education mode -->
<Label.Root class="pt-3 pb-2 font-medium text-fg" for="education-mode">Выбери форму обучения</Label.Root>
<RadioGroup.Root class="flex flex-col gap-1" id="education-mode"
    onValueChange={(value) => {value === "0" || value === "1" ? selectedMode = value : undefined}}
>
    <Label.Root
        for="offline"
        class="flex flex-row items-center gap-4 w-full h-12 rounded-xl cursor-pointer border-[1.5px]
                transition-all duration-150 active:scale-[99%]
                bg-bg-elevated border-border text-fg
                has-data-[state=checked]:bg-bg-accent has-data-[state=checked]:border-border-accent has-data-[state=checked]:text-fg-accent"
    >
        <RadioGroup.Item
            id="offline"
            value="1"
            class="shrink-0 ml-4 size-5 rounded-full border-[1.5px] data-[state=checked]:border-5
                    transition-all duration-150
                    bg-bg-elevated data-[state=checked]:bg-bg-accent border-border data-[state=checked]:border-border-accent-alt
                    focus:outline-2 focus:outline-offset-2 focus:outline-focus"
        />
        <span class="grow">Очная</span>
    </Label.Root>
    <Label.Root
        for="online"
        class="flex flex-row items-center gap-4 w-full h-12 rounded-xl cursor-pointer border-[1.5px]
                transition-all duration-150 active:scale-[99%]
                bg-bg-elevated border-border text-fg
                has-data-[state=checked]:bg-bg-accent has-data-[state=checked]:border-border-accent has-data-[state=checked]:text-fg-accent"
    >
        <RadioGroup.Item
            id="online"
            value="0"
            class="shrink-0 ml-4 size-5 rounded-full border-[1.5px] data-[state=checked]:border-5
                    transition-all duration-150
                    bg-bg-elevated data-[state=checked]:bg-bg-accent border-border data-[state=checked]:border-border-accent-alt
                    focus:outline-2 focus:outline-offset-2 focus:outline-focus"
        />
        <span class="grow">Заочная</span>
    </Label.Root>
</RadioGroup.Root>

<!-- Selecting group -->
{#if groups}
    <Label.Root class="pt-3 pb-2 font-medium text-fg" for="group">Выбери группу</Label.Root>
    {#await groups}
        <div class="h-12 w-full cursor-wait animate-pulse rounded-lg bg-skeleton"></div>
    {:then}
        <Combobox.Root type="single" bind:open bind:value >
            <div class="relative">
                <span class="absolute end-4 top-1/2 size-6 -translate-y-1/2 text-zinc-400">
                    <TextCursorInput />
                </span>
                <Combobox.Input
                    oninput={(e) => {
                        searchValue = e.currentTarget.value;
                    }}
                    onclick={() => open = !open}
                    placeholder="Введите номер"
                    class="px-5 w-full h-12 rounded-xl border-[1.5px] cursor-text
                            bg-bg-elevated border-border
                            transition-all duration-150
                            focus:outline-2 focus:outline-offset-2 focus:outline-focus"
                />
            </div>
            <Combobox.Content
                class="data-[state=open]:animate-scale-in data-[state=closed]:animate-scale-out mt-2 flex max-h-52 w-[var(--bits-combobox-anchor-width)] flex-col overflow-y-auto rounded-xl
                    border-[1.5px] border-border bg-bg
                    p-1"
            >
                {#each filteredGroups as group}
                    <Combobox.Item
                        class="flex w-full rounded-md cursor-pointer px-4 py-2.5 text-fg transition-all duration-100
                                active:scale-[0.95] data-[highlighted]:bg-bg-elevated data-[selected]:bg-bg-accent"
                        value={group.id}
                        label={group.name}
                    >
                        {group.name}
                    </Combobox.Item>
                {:else}
                    <span class="px-4 py-0.5 text-zinc-600 dark:text-zinc-300"> Нет доступных вариантов </span>
                {/each}
            </Combobox.Content>
        </Combobox.Root>    
    {:catch err}
        <p class="p-3 w-full rounded-xl border-border bg-bg-elevated">{JSON.parse(err).message}</p>
    {/await}
{/if}