<script lang="ts">
    import type { ResponseEntity } from "$lib/types";
    import { getTeachers } from "$lib/remote/entities.remote";
    import { Label, Combobox } from "bits-ui";
    import TextCursorInput from "@lucide/svelte/icons/text-cursor-input";

    let { selectedTeacher = $bindable(undefined) }:
        { selectedTeacher: ResponseEntity | undefined }= $props()

    let open = $state(false);
    let value = $state<string>();
    
    let teachers = $state(getTeachers());
    let searchValue = $state<string>("");

    let filteredTeachers = $derived(
        searchValue && teachers.current
            ? teachers.current.filter((teacher) => teacher.name.toLowerCase().includes(searchValue.toLowerCase()))
            : teachers.current ? teachers.current
            : []
    );

    $effect(() => {
        if (filteredTeachers) {
            selectedTeacher = filteredTeachers.find((teacher) => teacher.id === value);
        };
    })
</script>

<div class="p-2 pt-3">
    <Label.Root class="font-medium text-fg" for="teacher">Выберите преподавателя</Label.Root>
</div>

{#await teachers}
    <div class="h-12 w-full animate-pulse rounded-lg bg-skeleton cursor-wait"></div>
{:then}
    <Combobox.Root type="single" bind:open bind:value >
        <div class="relative">
            <span class="absolute cursor-pointer duration-150 transition-colors hover:bg-bg-elevated-alt end-2 top-1/2 size-8 p-1 rounded-md -translate-y-1/2 text-fg-muted">
                <TextCursorInput onclick={()=> {open = !open}}/>
            </span>
            <Combobox.Input
                oninput={(e) => {
                    searchValue = e.currentTarget.value;
                }}
                placeholder="Введите фамилию"
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
            {#each filteredTeachers as teacher}
                <Combobox.Item
                    class="flex w-full rounded-md px-4 py-2.5 text-fg transition-all duration-100 cursor-pointer
                            active:scale-[0.95] data-[highlighted]:bg-bg-elevated data-[selected]:bg-bg-accent"
                    value={teacher.id}
                    label={teacher.name}
                >
                    {teacher.name}
                </Combobox.Item>
            {:else}
                <span class="px-4 py-0.5 text-zinc-600 dark:text-zinc-300"> Нет доступных вариантов </span>
            {/each}
        </Combobox.Content>
    </Combobox.Root>
{:catch err}
    <p class="p-3 w-full rounded-xl border-border bg-bg-elevated">{JSON.parse(err).message}</p>
{/await}