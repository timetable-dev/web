<script lang="ts">
    import type { Selected } from 'bits-ui';
    import { Combobox } from "bits-ui"
    import { flyAndScale } from "$lib/transitions"

    let {items = $bindable(),
         selectedItem = $bindable(),
         placeholder}:
        {items: {value: string, label: string}[],
         selectedItem: {value: string, label: string} | undefined,
         placeholder: string | undefined} = $props()

    let inputValue = $state<string>("");
    let touchedInput = $state<boolean>(true);
    let filteredItems = $state<{value: string, label: string}[]>([])

    $effect(() => {
        filteredItems = inputValue && touchedInput
            ? items.filter((item) => item.label.toLowerCase().includes(inputValue.toLowerCase()))
            : items;
    })

</script>

<Combobox.Root items={filteredItems} bind:inputValue bind:selected={selectedItem} bind:touchedInput preventScroll={false}>
    <div class="flex flex-row relative">
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevrons-up-down absolute start-3 top-1/2 size-6 -translate-y-1/2 text-zinc-400"><path d="m7 15 5 5 5-5"/><path d="m7 9 5-5 5 5"/></svg>
    <Combobox.Input
        class="w-full inline-flex p-3 pl-11 rounded-md border-2 outline-0 focus:ring-2 ring-offset-2 truncate transition-all duration-150
               text-zinc-800 bg-zinc-50 border-zinc-200 ring-offset-zinc-50 focus:ring-blue-600
               dark:text-white dark:bg-zinc-800 dark:border-zinc-700 dark:ring-offset-zinc-800 dark:focus:ring-blue-400"
        placeholder={placeholder}
        aria-label="Выбери группу"
    />
    </div>
    <Combobox.Content
        class="w-full px-1 py-3 max-h-52 overflow-y-auto border-2 rounded-md
               bg-zinc-50 border-zinc-200 dark:bg-zinc-800 dark:border-zinc-700"
        transition={flyAndScale}
        sideOffset={8}
    >
        {#each filteredItems as item}
                <Combobox.Item
                    class="flex w-full py-2.5 pl-5 pr-3 rounded-md transition-all duration-150
                           text-zinc-950 data-[highlighted]:bg-zinc-200 hover:bg-zinc-100
                           dark:text-white dark:data-[highlighted]:bg-zinc-600 dark:hover:bg-zinc-700"
                    value={item.value}
                    label={item.label}>
                {item.label}
                </Combobox.Item>
        {:else}
            <span class="block px-4 py-0.5 text-zinc-600 dark:text-zinc-300">
                Нет доступных вариантов
            </span>
        {/each}
    </Combobox.Content>
</Combobox.Root>