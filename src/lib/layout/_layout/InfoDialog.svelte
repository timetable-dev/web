<script lang="ts">
    import { Dialog } from "bits-ui";
    import { ButtonSecondary } from "$lib/components";
    import RotateCw from "@lucide/svelte/icons/rotate-cw";
    import CirclePlus from "@lucide/svelte/icons/circle-plus";
    import MousePointer2 from "@lucide/svelte/icons/mouse-pointer-2";

    let { open = $bindable() }: {open: boolean} = $props()

    let version = $state<string>("v 0.2");
    let counter = $state<number>(0);
    let timeout = $state<boolean>(true)

    function revealGithub() {
        if (counter < 5) {
            counter += 1;
            console.log(`Click ${6 - counter} more time${counter == 5 ? "" : "s"}`)
        } else if (counter == 5) {
            counter += 1;
            version = "GitHub";
            setTimeout(() => {
                timeout = false;
                console.log("Timeout ended")
            }, 1000);
        } else if (counter == 6 && !timeout) {
            console.log("Going to GitHub")
            window.location.href = "https://github.com/timetable-dev/web"
        } else {
            console.log("Wait a second...")
        }
    }
</script>

<Dialog.Root bind:open>
    <Dialog.Portal>
        <Dialog.Overlay
            class="fixed inset-0 z-50 bg-black/50 dark:bg-zinc-800/80"
        />
        <Dialog.Content
            class="fixed left-1/2 top-1/2 translate-[-50%] z-50
                    flex flex-col gap-6 rounded-xl w-[90%] md:w-1/2 lg:w-1/3 max-h-5/6 p-5 pt-8
                    bg-white outline-zinc-300 dark:bg-zinc-900 dark:outline-zinc-800">

            <div class="flex flex-col overflow-y-auto scrollbar-hidden gap-6">
                <div class="flex flex-col md:flex-row gap-2 md:gap-4">
                    <div class="flex w-min h-min p-2.5 rounded-md bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-200">
                        <CirclePlus size="20" />
                    </div>
                    <p class="text-balance">Чтобы добавить расписание, нажмите на плюсик, а чтобы удалить – на три точки ⭢ «Удалить».</p>
                </div>
                <div class="flex flex-col md:flex-row gap-2 md:gap-4">
                    <div class="flex w-min h-min p-2.5 rounded-md bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-200">
                        <RotateCw size="20" />
                    </div>
                    <p class="text-balance">Самое актуальное расписание загружается автоматически при каждом обновлении страницы.</p>
                </div>
                <div class="flex flex-col md:flex-row gap-2 md:gap-4">
                    <div class="flex w-min h-min p-2.5 rounded-md bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-200">
                        <MousePointer2 size="20" />
                    </div>
                    <p class="text-balance">Нажмите на занятие, чтобы просмотреть подробную информацию о нём.</p>
                </div>
                <div class="flex flex-col md:flex-row gap-2 md:gap-4">
                    <img class="flex aspect-square w-10 h-10 rounded-md" src="/icons/192.png" alt="">
                    <p class="text-balance">Добавьте приложение на главный экран: в Chrome выберите «Добавить на гл. экран» в меню, а в Safari нажмите «Поделиться» ⭢ «На экран “Домой”» ⭢ «Добавить».</p>
                </div>
            </div>

            <div class="flex flex-row justify-between items-center">

                <!-- <button class="pl-6 pr-12 py-2 rounded-md active:transition-all duration-75
                                active:bg-zinc-200 active:dark:bg-zinc-700 active:scale-[0.95]"
                        onclick={revealGithub}
                                >
                                {version}
                </button> -->

                <Dialog.Close>
                    <ButtonSecondary text="Понятно" />     
                </Dialog.Close>
            </div>

        </Dialog.Content>
    </Dialog.Portal>
</Dialog.Root>