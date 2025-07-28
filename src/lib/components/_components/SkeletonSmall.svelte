<script lang="ts">
    let {...restProps}: {class?: string} = $props()
</script>

<div class={restProps.class || ""}>
    <div class="flex gap-4 flex-col mt-4">
        <div class="w-1/2 h-6 bg-zinc-200 dark:bg-zinc-700 rounded-md animate-pulse"></div>
        <div class="w-full h-12 bg-zinc-200 dark:bg-zinc-700 rounded-md animate-pulse"></div>
    </div>
</div>