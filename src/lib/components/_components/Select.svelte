<script lang="ts">
    import type { SelectItem } from "$lib/types";
    import { Select } from "bits-ui"
    import ChevronRight from "@lucide/svelte/icons/chevron-right";

    interface Props {
        items: SelectItem[];
        selectedItem: SelectItem | undefined;
        placeholder?: string;
    }

    let { items, selectedItem = $bindable(), placeholder}: Props = $props();
    const selectedLabel = $derived(selectedItem?.label ?? placeholder ?? "")

</script>

<Select.Root type="single"
    onValueChange={(value) => {
        selectedItem = items.find(item => item.value === value);
    }}>
    <Select.Trigger class="flex w-full p-3 gap-3 rounded-md border-2 outline-0 focus:ring-2 ring-offset-2 cursor-pointer truncate transition-all duration-150
               text-zinc-800 bg-zinc-50 border-zinc-200 ring-offset-zinc-50 focus:ring-blue-600
               dark:text-white dark:bg-zinc-800 dark:border-zinc-700 dark:ring-offset-zinc-800 dark:focus:ring-blue-400"
    >
    <ChevronRight class="text-zinc-500 dark:text-zinc-400"/>
    {#if selectedItem}
        <span>{selectedLabel}</span>
    {:else}
        <span class="text-zinc-500 dark:text-zinc-400">{selectedLabel}</span>
    {/if}
    </Select.Trigger>
    <Select.Content
        class="flex flex-col px-1 py-3 mt-2 max-h-52 overflow-y-auto border-2 rounded-md
               data-[state=open]:animate-scale-in data-[state=closed]:animate-scale-out
               w-[var(--bits-select-anchor-width)]
               bg-zinc-50 border-zinc-200 dark:bg-zinc-800 dark:border-zinc-700"
        >
        {#each items as item}
            <Select.Item
                class="flex w-full py-2.5 px-5 rounded-md transition-all duration-100 active:scale-[0.95]
                        text-zinc-950 data-[highlighted]:bg-zinc-100 data-[selected]:bg-zinc-200
                        dark:text-white dark:data-[highlighted]:bg-zinc-700 dark:data-[selected]:bg-zinc-600"
                value={item.value}
                label={item.label}>
            {item.label}
            </Select.Item>
        {/each}
    </Select.Content>
</Select.Root>