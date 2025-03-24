<script lang="ts">
    let {class: className = ""}: {class: string} = $props()
</script>

<div class={className}>
    <div class="flex gap-4 flex-col">
        <div class="w-1/2 h-8 bg-zinc-200 dark:bg-zinc-700 rounded-md animate-pulse"></div>
        <div class="w-full h-14 bg-zinc-200 dark:bg-zinc-700 rounded-md animate-pulse"></div>
        <div class="w-full h-14 bg-zinc-200 dark:bg-zinc-700 rounded-md animate-pulse"></div>
    </div>
</div>