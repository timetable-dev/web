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
    class="flex flex-row justify-center items-center gap-3 w-full px-6 py-2.5 rounded-lg outline-2 transition-all duration-100 active:scale-[0.98] cursor-pointer disabled:cursor-not-allowed
           text-zinc-800 bg-zinc-100 hover:bg-zinc-200 outline-zinc-200 hover:outline-zinc-300
           dark:text-zinc-50 dark:bg-zinc-700 hover:dark:bg-zinc-800 dark:outline-zinc-600 hover:dark:outline-zinc-700 
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

