<script lang="ts">
    import type { SelectItem, WeekOffset } from "$lib/types";
    import { today, startOfWeek, endOfWeek, DateFormatter } from "@internationalized/date";
    import { Tabs, Separator, Select, type BitsElementAttributes } from "bits-ui";
    import Calendar from "@lucide/svelte/icons/calendar";
    import Content from "./Content.svelte";

    type Props = { weekOffset: WeekOffset };
    let { weekOffset = $bindable("0") }: Props = $props();

    interface SelectWeek {
        weekOffset: WeekOffset;
        label: string;
    }

    const expandedWeeks: () => SelectWeek[] = () => {
        const offsets = [-6, -5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6];
        const expandedWeeks: SelectWeek[] = [];

        const formatter = new DateFormatter("ru-RU", {
            day: "numeric",
            month: "short",
        })

        offsets.forEach((weekOffset) => {
            const currentDate = today("Europe/Minsk");
            const offsetDays = weekOffset * 7;
            const weekStart = startOfWeek(currentDate, "ru-RU", "mon").add({ days: offsetDays });
            const weekEnd = endOfWeek(currentDate, "ru-RU", "mon").add({ days: offsetDays });

            expandedWeeks.push({
                weekOffset: weekOffset.toString() as WeekOffset, // !!!
                label: `${formatter.format(weekStart.toDate("Europe/Minsk"))} – ${formatter.format(weekEnd.toDate("Europe/Minsk"))}`
            })
        })
        return expandedWeeks;
    }

    const weeks: SelectItem<WeekOffset, string>[] = [
        { label: "Пред. нед.", value: "-1" },
        { label: "Тек. нед.", value: "0" },
        { label: "След. нед.", value: "1" },
    ];

</script>

<Tabs.Root
    bind:value={weekOffset}
    class="flex fixed w-full h-14 md:h-13 inset-x-0 bottom-3 justify-center-safe overflow-scroll scrollbar-hidden"
>
    <Tabs.List
        class="flex flex-row items-center gap-1 rounded-lg bg-bg border-1 border-border-alt px-1"
    >
        {#each weeks as week}
            <Tabs.Trigger
                value={week.value.toString()}
                class="flex items-center cursor-pointer rounded-md w-min px-3 h-12 md:h-11 text-nowrap whitespace-nowrap transition-all duration-150
                        active:scale-[0.98] data-[state=active]:bg-zinc-200
                        hover:data-[state=inactive]:bg-zinc-200/50 dark:data-[state=active]:bg-zinc-600
                        dark:hover:data-[state=inactive]:bg-zinc-200/10"
            >
                <p>{week.label}</p>
            </Tabs.Trigger>
        {/each}
        <Separator.Root orientation="vertical" class="w-[1px] h-full bg-border-alt"/>
        <Select.Root type="single"
            bind:value={weekOffset}>
            <Select.Trigger>
                <span class="flex w-12 md:w-11 h-12 md:h-11 rounded-md items-center justify-center hover:bg-bg-elevated duration-150">
                    <Calendar size=22/>
                </span>
            </Select.Trigger>
            <Select.Portal>
                <Select.Content
                    class="flex flex-col m-2 bg-bg rounded-lg p-1 border-1 border-border-alt h-64 overflow-scroll data-[state=open]:animate-fade-in data-[state=closed]:animate-fade-out"
                >
                    {#each expandedWeeks() as expandedWeek}
                        <Select.Item
                            class="bg-bg px-6 py-2 md:px-4 md:py-1.5 rounded-md hover:bg-bg-elevated data-[selected]:bg-bg-elevated cursor-pointer" value={expandedWeek.weekOffset} >
                            {expandedWeek.label}
                        </Select.Item>
                    {/each}
                </Select.Content>
            </Select.Portal>
        </Select.Root>
    </Tabs.List>
</Tabs.Root>
