<script lang="ts">
	import type { Lesson } from "$lib/types";
	import { Dialog } from "bits-ui";
	import Sunrise from "@lucide/svelte/icons/sunrise";
	import Sunset from "@lucide/svelte/icons/sunset";
	import User from "@lucide/svelte/icons/user";
	import MapPin from "@lucide/svelte/icons/map-pin";
	import Presentation from "@lucide/svelte/icons/presentation";
	import BookCheck from "@lucide/svelte/icons/book-check";

	const { lesson }: { lesson: Lesson } = $props();

	let infoOpen = $state(false);

	// svelte-ignore non_reactive_update
	let entity: string;

	// svelte-ignore non_reactive_update
	let typeStyling: string = "";

	const st = lesson.start_time.slice(0, 5); // TODO?: Adequate time conversion
	const et = lesson.end_time.slice(0, 5); // TODO?: Adequate time conversion

	if (lesson.teacher) {
		entity = lesson.teacher;
	} else {
		entity = lesson.groups.join(", ");
	}

	if (lesson.type === "Практ") {
		typeStyling =
			"bg-rose-100 text-rose-800 outline-rose-200 dark:bg-rose-950 dark:text-rose-100 dark:outline-rose-800";
	} else if (lesson.type === "Лек") {
		typeStyling =
			"bg-emerald-100 text-emerald-800 outline-emerald-200 dark:bg-emerald-950 dark:text-emerald-100 dark:outline-emerald-800";
	} else if (lesson.type === "Сем") {
		typeStyling =
			"bg-amber-100 text-amber-800 outline-amber-200 dark:bg-amber-950 dark:text-amber-100 dark:outline-amber-800";
	}

	// NOTE: Think about type styling of badge with background color instead of colored underline
</script>

<!-- TODO: Address a11y warnings -->
<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
	onclick={() => {
		infoOpen = !infoOpen;
	}}
	class="my-1 grid w-full cursor-pointer grid-cols-5 gap-1 rounded-md bg-zinc-50 py-2 pr-1 text-zinc-950 dark:bg-zinc-800 dark:text-zinc-50"
>
	<div class="flex flex-col justify-center">
		<div class="justify-self-start text-center font-medium">{st}</div>
		<div class="justify-self-start text-center font-medium opacity-65">{et}</div>
	</div>
	<div class="col-span-3 flex flex-col justify-center">
		<div class="line-clamp-2">{lesson.title}</div>
		<!-- text-lg -->
		<div class="truncate rounded-sm opacity-70">{entity}</div>
	</div>
	<div class="flex flex-col justify-center gap-0.5">
		<div class="line-clamp-2 justify-self-start font-medium">{lesson.room}</div>
		<div class="w-min justify-self-start truncate rounded-sm px-1 text-sm {typeStyling}">
			{lesson.type}
		</div>
	</div>
</div>

<Dialog.Root bind:open={infoOpen}>
	<Dialog.Portal>
		<Dialog.Overlay class="fixed inset-0 z-50 bg-black/50 dark:bg-zinc-800/80" />
		<Dialog.Content
			class="fixed top-1/2 left-1/2 z-50 flex w-[90%] translate-[-50%] flex-col gap-2 rounded-lg bg-white p-5 pb-4 outline-1 outline-zinc-300
                 md:w-2/3 lg:w-1/3 dark:bg-zinc-900 dark:outline-zinc-800"
		>
			<div class="flex flex-row gap-2">
				<div
					class="flex w-1/2 flex-row gap-4 rounded-md bg-zinc-100 px-4 py-3 text-center dark:bg-zinc-800"
				>
					<Sunrise color="#71717b" />
					<p class="w-full">{st}</p>
				</div>
				<div
					class="flex w-1/2 flex-row gap-4 rounded-md bg-zinc-100 px-4 py-3 text-center dark:bg-zinc-800"
				>
					<Sunset color="#71717b" />
					<p class="w-full">{et}</p>
				</div>
			</div>
			<div class="flex flex-col gap-2">
				<div
					class="flex w-full flex-row gap-8 rounded-md bg-zinc-100 px-4 py-3 dark:bg-zinc-800"
				>
					<BookCheck color="#71717b" />
					<p class="w-full">{lesson.title}</p>
				</div>
				<div
					class="flex w-full flex-row gap-8 rounded-md bg-zinc-100 px-4 py-3 dark:bg-zinc-800"
				>
					<User color="#71717b" />
					<p class="w-full">{entity}</p>
				</div>
			</div>
			<div class="flex flex-row gap-2">
				<div
					class="flex w-1/2 flex-row gap-4 rounded-md bg-zinc-100 px-4 py-3 text-center dark:bg-zinc-800"
				>
					<Presentation color="#71717b" />
					<p class="w-full">{lesson.type}</p>
				</div>
				<div
					class="flex w-1/2 flex-row gap-4 rounded-md bg-zinc-100 px-4 py-3 text-center dark:bg-zinc-800"
				>
					<MapPin color="#71717b" />
					<p class="w-full">{lesson.room}</p>
				</div>
			</div>

			<Dialog.Close
				class="mt-2 flex cursor-pointer self-end rounded-lg bg-zinc-100 px-6 py-2 text-zinc-900 outline-1 outline-zinc-200 duration-100 hover:bg-zinc-200 active:scale-[0.98] dark:bg-zinc-700 dark:text-zinc-50 dark:outline-zinc-600 hover:dark:bg-zinc-800 hover:dark:outline-zinc-700"
			>
				Закрыть
			</Dialog.Close>
		</Dialog.Content>
	</Dialog.Portal>
</Dialog.Root>
