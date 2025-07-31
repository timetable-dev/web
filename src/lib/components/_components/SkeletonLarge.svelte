<script lang="ts">
	let { class: className = "" }: { class: string } = $props();
</script>

<div class={className}>
	<div class="flex flex-col gap-4">
		<div class="h-8 w-1/2 animate-pulse rounded-md bg-zinc-200 dark:bg-zinc-700"></div>
		<div class="h-14 w-full animate-pulse rounded-md bg-zinc-200 dark:bg-zinc-700"></div>
		<div class="h-14 w-full animate-pulse rounded-md bg-zinc-200 dark:bg-zinc-700"></div>
	</div>
</div>
