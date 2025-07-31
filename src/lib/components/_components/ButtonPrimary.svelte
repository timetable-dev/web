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
	class="flex w-full cursor-pointer flex-row items-center justify-center gap-3 rounded-lg bg-sky-200 px-4 py-2.5 text-sky-800 outline-2 outline-sky-500 transition-all
           duration-100 hover:bg-sky-300 hover:text-sky-900 hover:outline-sky-600 active:scale-[0.98] disabled:cursor-not-allowed
           disabled:bg-zinc-200 disabled:text-zinc-600 disabled:outline-zinc-300 disabled:hover:bg-zinc-200 disabled:hover:outline-zinc-300 dark:bg-sky-900 
           dark:text-sky-50 dark:outline-sky-700 hover:dark:bg-sky-800 hover:dark:text-sky-50 hover:dark:outline-sky-700
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
