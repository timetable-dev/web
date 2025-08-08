<script lang="ts">
	import { isHttpError, type HttpError } from "@sveltejs/kit";

	let { error: errorObject }: { error: HttpError | any } = $props();
	const errorMessage = isHttpError(errorObject) ? errorObject : errorObject.message;
</script>

<div
	class="mt-2 flex w-full flex-col gap-4 self-center rounded-lg bg-orange-100 p-4 text-pretty text-orange-950 outline-1 outline-orange-300 md:w-2/3 dark:bg-zinc-800 dark:text-zinc-50 dark:outline-zinc-700"
>
	<p class="pt-2 text-center text-2xl">Упс...</p>
	<p>Произошла ошибка следующего характера:</p>
	<p
		class="rounded-lg bg-orange-200 p-4 break-words outline-1 outline-orange-300 dark:bg-amber-950 dark:text-amber-50 dark:outline-amber-700"
	>
		{errorMessage}
	</p>
	<p>
		Пожалуйста, проверьте ваше интернет-соединение, подождите несколько минут и перезагрузите
		страницу.
	</p>
	<p>
		Если ошибка сохраняется, рекомендуем пользоваться официальным сайтом <a
			class="underline"
			target="_blank"
			rel="noreferrer noopener"
			href="http://schedule.mslu.by">schedule.mslu.by</a
		> или, если он тоже не работает, расписанием на стенде, пока мы всё не починим.
	</p>
</div>
