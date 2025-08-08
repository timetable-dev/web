<script lang="ts">
	import type { SelectItem } from "$lib/types";
	import { Combobox } from "bits-ui";

	let {
		items = $bindable(),
		selectedItem = $bindable(),
		placeholder
	}: {
		items: SelectItem<string, string>[];
		selectedItem: SelectItem<string, string> | undefined;
		placeholder?: string;
	} = $props();

	let open = $state(false);
	let searchValue = $state<string>("");

	const filteredItems = $derived(
		searchValue === ""
			? items
			: items.filter((item) => item.label.toLowerCase().includes(searchValue.toLowerCase()))
	);
</script>

<Combobox.Root
	type="single"
	bind:open
	onValueChange={(value) => {
		selectedItem = items.find((item) => item.value === value);
	}}
>
	<div class="relative flex flex-row">
		<!-- TODO: Replace with corresponding Lucide icon -->
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
			class="lucide lucide-chevrons-up-down absolute start-3 top-1/2 size-6 -translate-y-1/2 text-zinc-400"
			><path d="m7 15 5 5 5-5" /><path d="m7 9 5-5 5 5" /></svg
		>
		<Combobox.Input
			onclick={() => (open = !open)}
			oninput={(e) => (searchValue = e.currentTarget.value)}
			{placeholder}
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
		{#each filteredItems as item}
			<Combobox.Item
				class="flex w-full rounded-md px-5 py-2.5 text-zinc-950 transition-all duration-100
                        active:scale-[0.95] data-[highlighted]:bg-zinc-100 data-[selected]:bg-zinc-200
                        dark:text-white dark:data-[highlighted]:bg-zinc-700 dark:data-[selected]:bg-zinc-600"
				value={item.value}
				label={item.label}
			>
				{item.label}
			</Combobox.Item>
		{:else}
			<span class="px-4 py-0.5 text-zinc-600 dark:text-zinc-300">
				Нет доступных вариантов
			</span>
		{/each}
	</Combobox.Content>
</Combobox.Root>
