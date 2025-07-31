<script>
	import { ModeWatcher } from "mode-watcher";
	import "../app.css";
	let { children } = $props();
</script>

<ModeWatcher />

<div class="flex w-full flex-col items-center p-2">
	<div class="flex w-full flex-col lg:w-2/3">
		{@render children()}
	</div>
</div>
