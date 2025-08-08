<script lang="ts">
	import type { SelectItem, WeekType } from "$lib/types";
	import { Tabs } from "bits-ui";

	type Props = { selectedWeek: WeekType };
	let { selectedWeek = $bindable("currentWeek") }: Props = $props();

	const weeks: SelectItem<WeekType, string>[] = [
		{ label: "Тек. нед.", value: "currentWeek" },
		{ label: "След. нед.", value: "nextWeek" },
		{ label: "3-я нед.", value: "thirdWeek" },
		{ label: "4-я нед.", value: "fourthWeek" }
	];
</script>

<Tabs.Root bind:value={selectedWeek} class="fixed inset-x-0 bottom-0 flex w-full justify-center-safe overflow-scroll scrollbar-hidden">
	<Tabs.List
		class="m-2 flex w-max flex-row justify-center gap-1 rounded-lg bg-zinc-50 p-1 outline-1
                    outline-zinc-200 md:mb-1.5 dark:bg-zinc-800 dark:outline-zinc-700"
	>
		{#each weeks as week}
			<Tabs.Trigger
				value={week.value}
				class="flex shrink cursor-pointer overflow-hidden rounded-md p-2.5 md:p-2 text-nowrap whitespace-nowrap transition-all duration-150
                        active:scale-[0.98] data-[state=active]:bg-zinc-200
                        hover:data-[state=inactive]:bg-zinc-200/50 dark:data-[state=active]:bg-zinc-600
                        dark:hover:data-[state=inactive]:bg-zinc-200/10"
			>
				<p>{week.label}</p>
			</Tabs.Trigger>
		{/each}
	</Tabs.List>
</Tabs.Root>
