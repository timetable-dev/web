<script lang="ts">
    import { Button } from "bits-ui";
    import type { Icon as IconType } from "@lucide/svelte";

    interface Props {
        text: string;
        disabled?: boolean;
        onclick?: () => void;
        icon?: typeof IconType;
    };

    let { text, disabled = false, onclick, icon }: Props = $props();

</script>

<Button.Root
    {onclick}
    disabled={disabled}
    class="flex flex-row justify-center items-center gap-3 w-full px-4 py-2.5 rounded-lg outline-2 transition-all duration-100 active:scale-[0.98] cursor-pointer disabled:cursor-not-allowed
           text-sky-800 hover:text-sky-900 bg-sky-200 hover:bg-sky-300 outline-sky-500 hover:outline-sky-600
           dark:text-sky-50 hover:dark:text-sky-50 dark:bg-sky-900 hover:dark:bg-sky-800 dark:outline-sky-700 hover:dark:outline-sky-700 
           disabled:text-zinc-600 disabled:bg-zinc-200 disabled:hover:bg-zinc-200 disabled:outline-zinc-300 disabled:hover:outline-zinc-300
           disabled:dark:text-zinc-200 disabled:dark:bg-zinc-800 disabled:hover:dark:bg-zinc-800 disabled:dark:outline-zinc-700 disabled:hover:dark:outline-zinc-700"
> 
    {#if icon && text}
        {@const Icon = icon}
        <span>
            <Icon size={22}/>
        </span>
        <p class="truncate font-medium pr-2">
            {text}
        </p>
    {:else if icon && !text}
        {@const Icon = icon}
        <span>
            <Icon size={22}/>
        </span>
    {:else if text && !icon}
        <p class="truncate font-medium">
            {text}
        </p>
    {/if}
</Button.Root>