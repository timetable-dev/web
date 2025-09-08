<script lang="ts">
    import type { ResponseEntity } from "$lib/types";
    import { Combobox } from "bits-ui";
    import ChevronsUpDown from "@lucide/svelte/icons/chevrons-up-down";
    import { Debounced } from "runed";

    let {
        groups = $bindable(),
        selectedGroup = $bindable(),
   }: {
        groups: ResponseEntity[];
        selectedGroup: ResponseEntity | undefined;
    } = $props();

    let open = $state(false);
    let searchValue = $state<string>("");
    const debouncedSearchValue = new Debounced(() => searchValue, 500);

    $inspect(debouncedSearchValue.current);

    const filteredGroups = $derived(
        debouncedSearchValue.current === ""
            ? groups
            : groups.filter((group) => group.name.toLowerCase().includes(debouncedSearchValue.current.toLowerCase()))
    );
</script>

<Combobox.Root
    type="single"
    bind:open
    onValueChange={(value) => {
        selectedGroup = filteredGroups.find((group) => group.mslu_id === value);
    }}
>
    <div class="relative flex flex-row">
        <span class="absolute start-3 top-1/2 size-6 -translate-y-1/2 text-zinc-400">
            <ChevronsUpDown />
        </span>
        <Combobox.Input
            oninput={(e) => {
                searchValue = e.currentTarget.value;
            }}
            onclick={() => (open = !open)}
            placeholder="Введите фамилию"
            class="flex w-full truncate rounded-md border-2 border-zinc-200 bg-zinc-50 p-3 pl-11 text-zinc-800 ring-offset-2 ring-offset-zinc-50
               outline-0 transition-all duration-150 focus:ring-2 focus:ring-blue-600
               dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:ring-offset-zinc-800 dark:focus:ring-blue-400"
        />
    </div>
    <Combobox.Content
        class="data-[state=open]:animate-scale-in data-[state=closed]:animate-scale-out mt-2 flex max-h-52 w-[var(--bits-combobox-anchor-width)] flex-col overflow-y-auto rounded-md
               border-2 border-zinc-200
               bg-zinc-50
               px-1 py-3 dark:border-zinc-700 dark:bg-zinc-800"
    >
        {#each filteredGroups as group}
            <Combobox.Item
                class="flex w-full rounded-md px-5 py-2.5 text-zinc-950 transition-all duration-100
                        active:scale-[0.95] data-[highlighted]:bg-zinc-100 data-[selected]:bg-zinc-200
                        dark:text-white dark:data-[highlighted]:bg-zinc-700 dark:data-[selected]:bg-zinc-600"
                value={group.mslu_id}
                label={group.name}
            >
                {group.name}
            </Combobox.Item>
        {:else}
            <span class="px-4 py-0.5 text-zinc-600 dark:text-zinc-300"> Нет доступных вариантов </span>
        {/each}
    </Combobox.Content>
</Combobox.Root>
