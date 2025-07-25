<script lang="ts">
    import { Dialog } from "bits-ui";
    import { Sunrise, Sunset, User, MapPin, Presentation, BookCheck } from "lucide-svelte";
    import type { Lesson } from "$lib/types";

    const {lesson}: {lesson: Lesson} = $props();

    let infoOpen = $state(false)

    // svelte-ignore non_reactive_update
    let entity: string;

    // svelte-ignore non_reactive_update
    let typeStyling: string = "";

    const st = lesson.start_time.slice(0, 5); // TODO?: Adequate time conversion
    const et = lesson.end_time.slice(0, 5);   // TODO?: Adequate time conversion

    if (lesson.teacher) {
        entity = lesson.teacher
    } else {
        entity = lesson.groups.join(", ");
    };

    // if (lesson.type === "Практ") {
    //     typeStyling = "underline decoration-solid decoration-2 decoration-rose-500 dark:decoration-rose-400";
    // } else if (lesson.type === "Лек") {
    //     typeStyling = "underline decoration-solid decoration-2 decoration-emerald-500 dark:decoration-emerald-300";
    // } else if (lesson.type === "Сем") {
    //     typeStyling = "underline decoration-solid decoration-2 decoration-yellow-500 dark:decoration-amber-300"
    // }

    if (lesson.type === "Практ") {
        typeStyling = "bg-rose-100 text-rose-800 outline-rose-200 dark:bg-rose-900 dark:text-rose-200 dark:outline-rose-800";
    } else if (lesson.type === "Лек") {
        typeStyling = "bg-emerald-100 text-emerald-800 outline-emerald-200 dark:bg-emerald-900 dark:text-emerald-200 dark:outline-emerald-800";
    } else if (lesson.type === "Сем") {
        typeStyling = "bg-amber-100 text-amber-800 outline-amber-200 dark:bg-amber-900 dark:text-amber-200 dark:outline-amber-800"
    }

    // NOTE: Think about type styling of badge with background color instead of colored underline
    
</script>

<!-- TODO: Address a11y warnings -->
<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div onclick={() => {infoOpen = !infoOpen}} class="my-1 w-full py-2 pr-1 grid grid-cols-5 gap-1 cursor-pointer bg-zinc-50 dark:bg-zinc-800 text-zinc-950 dark:text-zinc-50 rounded-md">
    <div class="flex flex-col justify-center">
        <div class="justify-self-start text-center font-medium">{st}</div>
        <div class="justify-self-start text-center font-medium opacity-65">{et}</div>
    </div>
    <div class="flex flex-col justify-center col-span-3">
        <div class="line-clamp-2 text-lg">{lesson.title}</div>
        <div class="truncate rounded-sm opacity-70">{entity}</div>
    </div>
    <div class="flex flex-col gap-0.5 justify-center">
        <div class="justify-self-start line-clamp-2 font-medium">{lesson.room}</div>
        <div class="justify-self-start truncate text-sm rounded-sm w-min px-1 {typeStyling}">{lesson.type}</div>
    </div>
</div>

<Dialog.Root bind:open={infoOpen}>
    <Dialog.Portal >
        <Dialog.Overlay
            transitionConfig={{ duration: 150 }}
            class="fixed inset-0 z-50 bg-black/50 dark:bg-zinc-800/80"
        />
        <Dialog.Content
            class="fixed left-1/2 top-1/2 translate-[-50%] flex flex-col gap-2 p-5 pb-4 z-50 outline-1 rounded-lg w-[90%] md:w-2/3 lg:w-1/3
                 bg-white outline-zinc-300 dark:bg-zinc-900 dark:outline-zinc-800"
        >

        <div class="flex flex-row gap-2">
            <div class="flex flex-row gap-4 w-1/2 px-4 py-3 text-center rounded-md bg-zinc-100 dark:bg-zinc-800">
                <Sunrise color="#71717b" />
                <p class="w-full">{st}</p>
            </div>
            <div class="flex flex-row gap-4 w-1/2 px-4 py-3 text-center rounded-md bg-zinc-100 dark:bg-zinc-800">
                <Sunset color="#71717b" />
                <p class="w-full">{et}</p>
            </div>
        </div>
        <div class="flex flex-col gap-2">
            <div class="flex flex-row gap-8 w-full px-4 py-3 rounded-md bg-zinc-100 dark:bg-zinc-800">
                <BookCheck color="#71717b" />
                <p class="w-full">{lesson.title}</p>
            </div>
            <div class="flex flex-row gap-8 w-full px-4 py-3 rounded-md bg-zinc-100 dark:bg-zinc-800">
                <User color="#71717b" />
                <p class="w-full">{entity}</p>
            </div>
        </div>
        <div class="flex flex-row gap-2">
            <div class="flex flex-row gap-4 w-1/2 px-4 py-3 text-center rounded-md bg-zinc-100 dark:bg-zinc-800">
                <Presentation color="#71717b" />
                <p class="w-full">{lesson.type}</p>
            </div>
            <div class="flex flex-row gap-4 w-1/2 px-4 py-3 text-center rounded-md bg-zinc-100 dark:bg-zinc-800">
                <MapPin color="#71717b" />
                <p class="w-full">{lesson.room}</p>
            </div>
        </div>

        <Dialog.Close
            class="flex self-end px-6 py-2 mt-2 outline-1 duration-100 active:scale-[0.98] text-zinc-900 dark:text-zinc-50 outline-zinc-200 dark:outline-zinc-600 bg-zinc-100 dark:bg-zinc-700 rounded-lg cursor-pointer hover:bg-zinc-200 hover:dark:bg-zinc-800 hover:dark:outline-zinc-700">
            Закрыть
        </Dialog.Close>

        </Dialog.Content>
    </Dialog.Portal>
</Dialog.Root>
