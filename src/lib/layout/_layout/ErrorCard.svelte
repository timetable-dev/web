<script lang="ts">
    import { isHttpError, type HttpError } from "@sveltejs/kit";

    let {error: errorObject}: {error: HttpError | any} = $props()
    const errorMessage = isHttpError(errorObject) ? errorObject : errorObject.message
</script>

<div class="flex flex-col self-center gap-4 w-full md:w-2/3 mt-2 p-4 rounded-lg text-pretty outline-1 bg-orange-100 outline-orange-300 text-orange-950 dark:bg-zinc-800 dark:outline-zinc-700 dark:text-zinc-50">
    <p class="text-center text-2xl pt-2">Упс...</p>
    <p>Произошла ошибка следующего характера:</p>
    <p class="p-4 break-words outline-1 rounded-lg bg-orange-200 outline-orange-300 dark:bg-amber-950 dark:outline-amber-700 dark:text-amber-50">{errorMessage}</p>
    <p>Пожалуйста, проверьте ваше интернет-соединение, подождите несколько минут и перезагрузите страницу.</p>
    <p>Если ошибка сохраняется, рекомендуем пользоваться официальным сайтом <a class="underline" target="_blank" rel="noreferrer noopener" href="http://schedule.mslu.by">schedule.mslu.by</a> или, если он тоже не работает, расписанием на стенде, пока мы всё не починим.</p>
</div>