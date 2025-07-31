<script lang="ts">
	import { Button } from "bits-ui";
	import type { Icon as IconType } from "@lucide/svelte";

	interface Props {
		text: string;
		disabled?: boolean;
		onclick?: () => void;
		icon?: typeof IconType;
	}

	let { text, disabled = false, onclick, icon }: Props = $props();
</script>

<Button.Root
	{onclick}
	{disabled}
	class="flex w-full cursor-pointer flex-row items-center justify-center gap-3 rounded-lg bg-zinc-100 px-6 py-2.5 text-zinc-800 outline-2 outline-zinc-200 transition-all
           duration-100 hover:bg-zinc-200 hover:outline-zinc-300 active:scale-[0.98] disabled:cursor-not-allowed
           disabled:bg-zinc-200 disabled:text-zinc-600 disabled:outline-zinc-300 disabled:hover:bg-zinc-200 disabled:hover:outline-zinc-300 
           dark:bg-zinc-700 dark:text-zinc-50 dark:outline-zinc-600 hover:dark:bg-zinc-800 hover:dark:outline-zinc-700
           disabled:dark:bg-zinc-800 disabled:dark:text-zinc-200 disabled:dark:outline-zinc-700 disabled:hover:dark:bg-zinc-800 disabled:hover:dark:outline-zinc-700"
>
	{#if icon && text}
		{@const Icon = icon}
		<span>
			<Icon size={22} />
		</span>
		<p class="truncate pr-2 font-medium">
			{text}
		</p>
	{:else if icon && !text}
		{@const Icon = icon}
		<span>
			<Icon size={22} />
		</span>
	{:else if text && !icon}
		<p class="truncate font-medium">
			{text}
		</p>
	{/if}
</Button.Root>
