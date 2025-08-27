<script lang="ts">
    import { showDebug } from "$lib/persisted";
    import { Dialog, Switch } from "bits-ui";
    import { Icon as LucideIcon } from "@lucide/svelte";
    import RotateCw from "@lucide/svelte/icons/rotate-cw";
    import CirclePlus from "@lucide/svelte/icons/circle-plus";
    import MousePointer2 from "@lucide/svelte/icons/mouse-pointer-2";
    import Github from "@lucide/svelte/icons/github";

    let { open: infoDialogOpen = $bindable() }: { open: boolean } = $props();

    let debugMenuOpen = $state<boolean>(false);
    let version = $state<string>("v 1.0-pr.5");
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
            class="flex h-min w-min rounded-md border-[1.5px] border-sky-400 bg-sky-100 p-3 text-sky-600 dark:border-sky-800 dark:bg-sky-900 dark:text-sky-200"
        >
            <Icon size="20" />
        </span>
        <p class="hyphens-auto" lang="ru">
            {text}
        </p>
    </div>
{/snippet}

<Dialog.Root
    bind:open={infoDialogOpen}
    onOpenChange={() => {
        debugMenuOpen = false;
        counter = 0;
    }}
>
    <Dialog.Portal>
        <Dialog.Overlay
            class="fixed inset-0 z-49 bg-black/50 dark:bg-zinc-800/80 data-[state=open]:animate-fade-in data-[state=closed]:animate-fade-out"
        />
        <Dialog.Content
            class="data-[state=open]:animate-scale-in data-[state=closed]:animate-scale-out dialog-center flex max-h-3/4 w-[90%] flex-col rounded-xl bg-white
                    outline-zinc-300 md:w-1/2 lg:max-h-5/6 lg:w-1/3 dark:bg-zinc-900 dark:outline-zinc-800"
        >
            <!-- Title -->
            <Dialog.Title class="py-4 text-center text-xl font-medium">О приложении</Dialog.Title>

            <!-- Info -->
            <div class="scrollbar-hidden flex flex-col gap-6 overflow-y-auto px-5">
                <!-- Icon cards -->
                {@render infoCard(
                    "Чтобы открыть расписание, нажмите на плюсик, а чтобы закрыть – на три точки -> «Закрыть».",
                    CirclePlus,
                )}
                {@render infoCard(
                    "Самое актуальное расписание загружается автоматически при каждом обновлении страницы.",
                    RotateCw,
                )}
                {@render infoCard(
                    "Нажмите на занятие, чтобы просмотреть подробную информацию о нём.",
                    MousePointer2,
                )}

                <!-- Card with image -->
                <div class="flex flex-col gap-2 md:flex-row md:gap-4">
                    <img class="flex aspect-square h-12 w-12 rounded-md" src="/icons/64m.svg" alt="" />
                    <div class="flex flex-col gap-1">
                        <p class="hyphens-auto" lang="ru">Добавьте приложение на главный экран:</p>
                        <ul class="flex list-none flex-col gap-1">
                            <li>• В меню Chrome выберите «Добавить на гл. экран» -> «Установить»;</li>
                            <li>• В Safari нажмите «Поделиться» -> «На экран “Домой”» -> «Добавить».</li>
                        </ul>
                    </div>
                </div>
            </div>

            <!-- Debug menu -->
            {#if debugMenuOpen}
                <div class="flex flex-col w-full p-3">
                    <a
                        href="https://github.com/timetable-dev/web"
                        target="_blank"
                        rel="noreferrer noopener"
                        class="flex w-full flex-row content-center justify-center-safe gap-2 rounded-md bg-zinc-800 p-3 font-medium text-zinc-50"
                    >
                        <Github size={22} />
                        GitHub
                    </a>
                    <div class="flex flex-row items-center justify-between p-3">
                        <p>Show debug info</p>
                        <Switch.Root
                            bind:checked={showDebug.current}
                            class="block w-14 h-8 cursor-pointer items-center rounded-full outline-1 outline-zinc-300 dark:outline-zinc-700 data-[state=checked]:bg-sky-600 data-[state=unchecked]:bg-zinc-100 dark:data-[state=unchecked]:bg-zinc-800"
                        >
                            <Switch.Thumb
                                class="block aspect-square rounded-full w-6 m-1 bg-zinc-200 data-[state=checked]:translate-x-6 transition-transform duration-150"
                            />
                        </Switch.Root>
                    </div>
                </div>
            {/if}

            <!-- Controls -->
            <div class="flex flex-row items-center justify-between p-3">
                <button
                    class="rounded-md py-2.5 pr-12 pl-6 text-zinc-500 duration-75 active:scale-[0.95] active:bg-zinc-200 active:transition-all dark:text-zinc-400 active:dark:bg-zinc-700"
                    onclick={showDebugMenu}
                >
                    {version}
                </button>

                <Dialog.Close
                    class="cursor-pointer rounded-md bg-zinc-100 px-6 py-2.5 font-medium text-zinc-800  outline-1
								   outline-zinc-200 transition-all duration-150 hover:bg-zinc-200 hover:outline-zinc-300 active:scale-[0.98] 
           						   dark:bg-zinc-700 dark:text-zinc-50 dark:outline-zinc-600 hover:dark:bg-zinc-800 hover:dark:outline-zinc-700"
                >
                    Понятно
                </Dialog.Close>
            </div>
        </Dialog.Content>
    </Dialog.Portal>
</Dialog.Root>
