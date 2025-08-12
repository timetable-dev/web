<script lang="ts">
    let { ...restProps }: { class?: string } = $props();
</script>

<div class={restProps.class || ""}>
    <div class="mt-4 flex flex-col gap-4">
        <div class="h-6 w-1/2 animate-pulse rounded-md bg-zinc-200 dark:bg-zinc-700"></div>
        <div class="h-12 w-full animate-pulse rounded-md bg-zinc-200 dark:bg-zinc-700"></div>
    </div>
</div>
