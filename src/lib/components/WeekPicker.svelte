<script lang="ts">
    import { Tabs } from "bits-ui";

    type WeekValue = "currentWeek" | "nextWeek" | "thirdWeek" | "fourthWeek"

    let { selectedWeek = $bindable("currentWeek") }: { selectedWeek: WeekValue} = $props();

    interface Week {
        label: string;
        value: WeekValue;
    }

    const weeks: Week[] = [
        {label: "Тек. нед.",  value: "currentWeek"},
        {label: "След. нед.", value: "nextWeek"},
        {label: "3-я нед.", value: "thirdWeek"},
        {label: "4-я нед.", value: "fourthWeek"},
    ]

</script>

<Tabs.Root
    bind:value = {selectedWeek}
    class="fixed inset-x-0 bottom-0 w-full flex justify-center">
    <Tabs.List class="flex flex-row justify-center gap-1 p-2 m-2 w-full w-max rounded-lg md:mb-1.5 md:p-1
                    bg-zinc-50 dark:bg-zinc-800 outline-1 outline-zinc-200 dark:outline-zinc-700">

        {#each weeks as week}
            <Tabs.Trigger
                value={week.value}
                class="flex shrink p-2 cursor-pointer rounded-md overflow-hidden text-nowrap whitespace-nowrap transition-all duration-150
                        data-[state=active]:bg-zinc-200 dark:data-[state=active]:bg-zinc-600
                        hover:data-[state=inactive]:bg-zinc-200/50 dark:hover:data-[state=inactive]:bg-zinc-200/10
                        active:scale-[0.98]">
                <p>{week.label}</p>
            </Tabs.Trigger>
        {/each}
        
    </Tabs.List>
</Tabs.Root>