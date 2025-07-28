<script lang="ts">
    import type { SelectItem } from "$lib/types";
    import { Combobox } from "bits-ui"

    let {items = $bindable(),
         selectedItem = $bindable(),
         placeholder}:
        {items: SelectItem[],
         selectedItem: SelectItem | undefined,
         placeholder?: string } = $props()

    let open = $state(false)
    let searchValue = $state<string>("");

    const filteredItems = $derived(
        searchValue === ""
        ? items
        : items.filter((item) =>
            item.label.toLowerCase().includes(searchValue.toLowerCase())
            )
    );

</script>

<Combobox.Root
    type="single"
    bind:open
    onValueChange={(value) => {
        selectedItem = items.find(item => item.value === value);
    }}>
    <div class="flex flex-row relative">
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevrons-up-down absolute start-3 top-1/2 size-6 -translate-y-1/2 text-zinc-400"><path d="m7 15 5 5 5-5"/><path d="m7 9 5-5 5 5"/></svg>
    <Combobox.Input
        onclick={() => (open = !open)}
        oninput={(e) => (searchValue = e.currentTarget.value)}
        placeholder={placeholder}
        class="w-full flex p-3 pl-11 rounded-md border-2 outline-0 focus:ring-2 ring-offset-2 truncate transition-all duration-150
               text-zinc-800 bg-zinc-50 border-zinc-200 ring-offset-zinc-50 focus:ring-blue-600
               dark:text-white dark:bg-zinc-800 dark:border-zinc-700 dark:ring-offset-zinc-800 dark:focus:ring-blue-400"
    />
    </div>
    <Combobox.Content
        class="flex flex-col px-1 py-3 mt-2 max-h-52 overflow-y-auto border-2 rounded-md
               data-[state=open]:animate-scale-in data-[state=closed]:animate-scale-out
               w-[var(--bits-combobox-anchor-width)]
               bg-zinc-50 border-zinc-200 dark:bg-zinc-800 dark:border-zinc-700"
    >
        {#each filteredItems as item}
            <Combobox.Item
                class="flex w-full py-2.5 px-5 rounded-md transition-all duration-100 active:scale-[0.95]
                        text-zinc-950 data-[highlighted]:bg-zinc-100 data-[selected]:bg-zinc-200
                        dark:text-white dark:data-[highlighted]:bg-zinc-700 dark:data-[selected]:bg-zinc-600"
                value={item.value}
                label={item.label}>
            {item.label}
            </Combobox.Item>
        {:else}
            <span class="px-4 py-0.5 text-zinc-600 dark:text-zinc-300">
                Нет доступных вариантов
            </span>
        {/each}
    </Combobox.Content>
</Combobox.Root>