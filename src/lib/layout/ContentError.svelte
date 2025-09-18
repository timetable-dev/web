<script lang="ts">
    import ExternalLink from "@lucide/svelte/icons/external-link";

    let { err, base64 }: { err: any, base64: string } = $props()

    let errorMessage = $derived.by((): string => {
        try {
            const errorObject = JSON.parse(err);
            const errorMessage = errorObject.message ?? "Неизвестная ошибка";
            return errorMessage;
        } catch {
            return "Неизвестная ошибка";
        }
    })
</script>

<div
    class="mt-2 rounded-xl flex w-full flex-col gap-4 self-center bg-zinc-50 p-4 text-pretty text-zinc-950 outline-1 outline-zinc-200 md:w-2/3 dark:bg-zinc-800 dark:text-zinc-50 dark:outline-zinc-700"
>
    <p class="pt-2 pb-1 text-center text-xl">Произошла ошибка</p>
    <p
        class="rounded-lg px-4 py-3 break-words outline-1 bg-orange-50 outline-orange-200 text-orange-800 dark:bg-amber-950 dark:text-amber-50 dark:outline-amber-700"
    >
        {errorMessage}
    </p>
    <p>
        Страшно, очень страшно. Если бы мы знали, что это такое, но мы не знаем, что это такое.
    </p>
    <p>
        Попробуйте открыть это расписание на официальном сайте по ссылке ниже или перейдите на 
        <a
            class="underline"
            target="_blank"
            rel="noreferrer noopener"
            href="http://www.timetable.bsufl.by"
            >главную
        </a>.
    </p>
    <a
        target="_blank"
        rel="noreferrer noopener"
        class="flex flex-row gap-3 justify-center items-center outline-1 rounded-lg p-3 bg-zinc-100 outline-zinc-300 text-zinc-900 dark:bg-zinc-700 dark:outline-zinc-600 dark:text-zinc-50"
        href="http://www.timetable.bsufl.by/schedule/{base64}"
    >
        <p>Открыть на оф. сайте</p>
        <span><ExternalLink size={16}/></span>
    </a>
</div>