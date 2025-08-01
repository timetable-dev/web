<script lang="ts">
	import { Dialog, Button } from "bits-ui";
	import { ButtonSecondary } from "$lib/components";
	import { Icon as LucideIcon } from "@lucide/svelte";
	import RotateCw from "@lucide/svelte/icons/rotate-cw";
	import CirclePlus from "@lucide/svelte/icons/circle-plus";
	import MousePointer2 from "@lucide/svelte/icons/mouse-pointer-2";
	import Github from "@lucide/svelte/icons/github";

	let { open: infoDialogOpen = $bindable() }: { open: boolean } = $props();

	let debugMenuOpen = $state<boolean>(false);
	let version = $state<string>("v 0.2");
	let counter: number = 0;

	function showDebugMenu() {
		if (counter < 5) {
			counter += 1;
			console.log(`Click ${6 - counter} more time${counter == 5 ? "" : "s"}`);
		} else if (counter == 5) {
			counter = 0;
			debugMenuOpen = true;
		}
	}
</script>

{#snippet infoCard(text: string, icon: typeof LucideIcon)}
	{@const Icon = icon}
	<div class="flex flex-col gap-2 md:flex-row md:gap-4">
		<span
			class="flex h-min w-min rounded-md border-2 bg-sky-100 p-2.5 text-sky-600 dark:bg-sky-900 dark:text-sky-200 border-sky-400 dark:border-sky-800"
		>
			<Icon size="20" />
		</span>
		<p class="hyphens-auto" lang="ru">
			{text}
		</p>
	</div>
{/snippet}

<Dialog.Root bind:open={infoDialogOpen}
	onOpenChange={() => {debugMenuOpen = false; counter = 0}}
>
	<Dialog.Portal>
		<Dialog.Overlay class="fixed inset-0 z-50 bg-black/50 dark:bg-zinc-800/80" />
		<Dialog.Content
			class="fixed top-1/2 left-1/2 z-50 flex max-h-3/4 lg:max-h-5/6 w-[90%] translate-[-50%] flex-col rounded-xl bg-white outline-zinc-300
                    md:w-1/2 lg:w-1/3 dark:bg-zinc-900 dark:outline-zinc-800 data-[state=open]:animate-scale-in data-[state=closed]:animate-scale-out"
		>
			<!-- Title -->
			<Dialog.Title class="text-center font-medium py-4 text-xl">
				О приложении
			</Dialog.Title>

			<!-- Info -->
			<div class="scrollbar-hidden flex flex-col gap-6 overflow-y-auto px-5">

				<!-- Icon cards -->
				{@render infoCard(
					"Чтобы добавить расписание, нажмите на плюсик, а чтобы удалить – на три точки -> «Удалить».",
					CirclePlus
				)}
				{@render infoCard(
					"Самое актуальное расписание загружается автоматически при каждом обновлении страницы.",
					RotateCw
				)}
				{@render infoCard(
					"Нажмите на занятие, чтобы просмотреть подробную информацию о нём.",
					MousePointer2
				)}

				<!-- Card with image -->
				<div class="flex flex-col gap-2 md:flex-row md:gap-4">
					<img
						class="flex aspect-square h-11 w-11 rounded-md"
						src="/icons/64m.svg"
						alt=""
					/>
					<div class="flex flex-col gap-1">			
						<p class="hyphens-auto" lang="ru">
							Добавьте приложение на главный экран:
						</p>
						<ul class="flex flex-col list-disc list-inside gap-1">
							<li>В меню Chrome выберите «Добавить на гл. экран» ⭢ «Установить»;</li>
							<li>В Safari нажмите «Поделиться» ⭢ «На экран “Домой”» ⭢ «Добавить».</li>
						</ul>
					</div>
				</div>
			</div>

			<!-- Debug menu -->
			{#if debugMenuOpen}
				<div class="flex w-full p-3">
					<a
						href="https://github.com/timetable-dev/web"
						target="_blank"
						rel="noreferrer noopener"
						class="flex flex-row justify-center-safe content-center gap-2 font-medium w-full p-3 bg-zinc-800 text-zinc-50 rounded-md"
					>
						<Github size={22}/>
						GitHub
					</a>
				</div>
			{/if}

			<!-- Controls -->
			<div class="flex flex-row items-center justify-between p-3">
				<button class="pl-6 pr-12 py-2.5 rounded-md active:transition-all duration-75 text-zinc-500 dark:text-zinc-400 active:bg-zinc-200 active:dark:bg-zinc-700 active:scale-[0.95]"
                        onclick={showDebugMenu}
                >
                    {version}
                </button>

				<Dialog.Close class="cursor-pointer rounded-md px-6 py-2.5 font-medium transition-all duration-150  active:scale-[0.98]
								   bg-zinc-100 text-zinc-800 outline-1 outline-zinc-200 hover:bg-zinc-200 hover:outline-zinc-300 
           						   dark:bg-zinc-700 dark:text-zinc-50 dark:outline-zinc-600 hover:dark:bg-zinc-800 hover:dark:outline-zinc-700">
					Понятно
				</Dialog.Close>
			</div>
		</Dialog.Content>
	</Dialog.Portal>
</Dialog.Root>
