<script>
    import { ModeWatcher } from "mode-watcher";
    let { children } = $props()
    import "../app.css";
</script>

<ModeWatcher />

<div class="flex flex-col items-center w-full p-2">
    <div class="flex flex-col w-full lg:w-2/3">
        {@render children()}
    </div>
</div>