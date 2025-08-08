<script lang="ts">
    import type { SelectItem } from "$lib/types";
    import { Select } from "bits-ui";
    import ChevronRight from "@lucide/svelte/icons/chevron-right";

    interface Props {
        items: SelectItem<string, string>[];
        selectedItem: SelectItem<string, string> | undefined;
        placeholder?: string;
    }

    let { items, selectedItem = $bindable(), placeholder }: Props = $props();
    const selectedLabel = $derived(selectedItem?.label ?? placeholder ?? "");
</script>

<Select.Root
    type="single"
    onValueChange={(value) => {
        selectedItem = items.find((item) => item.value === value);
    }}
>
    <Select.Trigger
        class="flex w-full cursor-pointer gap-3 truncate rounded-md border-2 border-zinc-200 bg-zinc-50 p-3 text-zinc-800 ring-offset-2 ring-offset-zinc-50
               outline-0 transition-all duration-150 focus:ring-2 focus:ring-blue-600
               dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:ring-offset-zinc-800 dark:focus:ring-blue-400"
    >
        <ChevronRight class="text-zinc-500 dark:text-zinc-400" />
        {#if selectedItem}
            <span>{selectedLabel}</span>
        {:else}
            <span class="text-zinc-500 dark:text-zinc-400">{selectedLabel}</span>
        {/if}
    </Select.Trigger>
    <Select.Content
        class="data-[state=open]:animate-scale-in data-[state=closed]:animate-scale-out mt-2 flex max-h-52 w-[var(--bits-select-anchor-width)] flex-col overflow-y-auto rounded-md
               border-2 border-zinc-200
               bg-zinc-50
               px-1 py-3 dark:border-zinc-700 dark:bg-zinc-800"
    >
        {#each items as item}
            <Select.Item
                class="flex w-full rounded-md px-5 py-2.5 text-zinc-950 transition-all duration-100
                        active:scale-[0.95] data-[highlighted]:bg-zinc-100 data-[selected]:bg-zinc-200
                        dark:text-white dark:data-[highlighted]:bg-zinc-700 dark:data-[selected]:bg-zinc-600"
                value={item.value}
                label={item.label}
            >
                {item.label}
            </Select.Item>
        {/each}
    </Select.Content>
</Select.Root>
