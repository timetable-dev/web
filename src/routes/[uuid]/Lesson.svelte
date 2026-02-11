<script lang="ts">
    import type { Lesson } from "$lib/types";
    import { Dialog } from "bits-ui";
    import { Icon as LucideIcon } from "@lucide/svelte";
    import Sunrise from "@lucide/svelte/icons/sunrise";
    import Sunset from "@lucide/svelte/icons/sunset";
    import User from "@lucide/svelte/icons/user";
    import MapPin from "@lucide/svelte/icons/map-pin";
    import Presentation from "@lucide/svelte/icons/presentation";
    import BookCheck from "@lucide/svelte/icons/book-check";

    const { lesson }: { lesson: Lesson } = $props();

    // svelte-ignore state_referenced_locally
    const st = lesson.start_time.slice(0, 5);
    // svelte-ignore state_referenced_locally
    const et = lesson.end_time.slice(0, 5);
    // svelte-ignore state_referenced_locally
    const entity = lesson.teacher || lesson.groups.join(", ");
    // svelte-ignore state_referenced_locally
    const entityFull = lesson.teacherFull || lesson.groups.join(", ");

    // svelte-ignore state_referenced_locally
    // const typeStyling: string =
    //     lesson.type === "Практ"
    //         ? "bg-rose-100 text-rose-800 outline-rose-200 dark:bg-rose-950 dark:text-rose-100 dark:outline-rose-800"
    //         : lesson.type === "Лек"
    //           ? "bg-emerald-100 text-emerald-800 outline-emerald-200 dark:bg-emerald-950 dark:text-emerald-100 dark:outline-emerald-800"
    //           : lesson.type === "Сем"
    //             ? "bg-amber-100 text-amber-800 outline-amber-200 dark:bg-amber-950 dark:text-amber-100 dark:outline-amber-800"
    //             : "bg-zinc-100 text-zinc-800 dark:bg-zinc-700 dark:text-zinc-200";

    // svelte-ignore state_referenced_locally
    const typeStyling: string =
        lesson.type === "Практ"
            ? "bg-red-100 text-red-800 outline-red-200 dark:bg-red-950 dark:text-red-100 dark:outline-red-800"
            : lesson.type === "Лек"
              ? "bg-green-100 text-green-800 outline-green-200 dark:bg-green-950 dark:text-green-100 dark:outline-green-800"
              : lesson.type === "Сем"
                ? "bg-amber-100 text-amber-800 outline-amber-200 dark:bg-amber-950 dark:text-amber-100 dark:outline-amber-800"
                : "bg-zinc-100 text-zinc-800 dark:bg-zinc-700 dark:text-zinc-200";
</script>

{#snippet infoBlock(text: string, icon: typeof LucideIcon)}
    {@const Icon = icon}
    <div class="flex flex-row gap-4 items-center w-full p-3 rounded-md bg-zinc-100 dark:bg-zinc-800">
        <span class="grid place-content-center">
            <Icon color="#71717b" size="22" />
        </span>
        <p class="w-full">{text}</p>
    </div>
{/snippet}

<Dialog.Root>
    <Dialog.Trigger
        class="my-1 py-2.5 grid w-full cursor-pointer grid-cols-5 gap-1 rounded-md bg-zinc-50 text-zinc-950 dark:bg-zinc-800 dark:text-zinc-50"
    >
        <div class="col-span-1 w-full flex flex-col items-center-safe justify-center">
            <div class="">{st}</div>
            <div class="opacity-65">{et}</div>
        </div>
        <div class="col-span-3 w-full flex flex-col justify-center">
            <div class="text-start wrap-anywhere line-clamp-2">{lesson.title}</div>
            <div class="text-start truncate opacity-65">{entity}</div>
        </div>
        <div class="col-span-1 w-full flex flex-col items-center-safe justify-center">
            <div class="wrap-anywhere line-clamp-2">{lesson.room}</div>
            <div class="wrap-anywhere line-clamp-2 rounded-sm px-1 text-sm {typeStyling}">
                {lesson.type}
            </div>
        </div>
    </Dialog.Trigger>
    <Dialog.Portal>
        <Dialog.Overlay
            class="fixed inset-0 z-49 bg-black/50 dark:bg-zinc-800/80 data-[state=open]:animate-fade-in data-[state=closed]:animate-fade-out"
        />
        <Dialog.Content
            class="dialog-center flex flex-col gap-2 p-4 rounded-xl w-[90%] md:w-2/3 lg:w-1/3 outline-1
				   data-[state=open]:animate-scale-in data-[state=closed]:animate-scale-out
				   bg-white outline-zinc-300 dark:bg-zinc-900 dark:outline-zinc-800"
        >
            <div class="flex flex-row gap-2">
                {@render infoBlock(st, Sunrise)}
                {@render infoBlock(et, Sunset)}
            </div>
            <div class="flex flex-col gap-2">
                {@render infoBlock(lesson.titleFull, BookCheck)}
                {@render infoBlock(entityFull, User)}
            </div>
            <div class="flex flex-row gap-2">
                {@render infoBlock(lesson.type, Presentation)}
                {@render infoBlock(lesson.room, MapPin)}
            </div>

            <Dialog.Close
                class="w-full mt-2 p-2 rounded-lg cursor-pointer outline-1 duration-100 active:scale-[0.98]
				bg-zinc-100 text-zinc-900 outline-zinc-200 hover:bg-zinc-200 hover:outline-zinc-300
				dark:bg-zinc-700 dark:text-zinc-50 dark:outline-zinc-600 hover:dark:bg-zinc-800 hover:dark:outline-zinc-700"
            >
                Закрыть
            </Dialog.Close>
        </Dialog.Content>
    </Dialog.Portal>
</Dialog.Root>
