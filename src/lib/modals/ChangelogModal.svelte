<script lang="ts">
    import { Dialog } from "bits-ui";
    let { open = $bindable() }: { open: boolean } = $props();
</script>

<Dialog.Root bind:open > 

    <!-- Overlay -->
    <Dialog.Overlay class="bits-ui-overlay bg-overlay data-[state=open]:animate-fade-in data-[state=closed]:animate-fade-out" />

    <!-- Modal contents -->
    <Dialog.Content class="bits-ui-modal flex flex-col bg-bg data-[state=open]:animate-scale-in data-[state=closed]:animate-scale-out" >

        <!-- Modal title -->
        <Dialog.Title class="text-center text-xl pt-1 pb-4">Что нового</Dialog.Title>

        <ul class="w-full overflow-y-auto px-1 space-y-1 list-inside list-disc">
            <li>Начнём с того, что всё снова работает, это уже здорово :D</li>
            <li>Улучшено сообщение об ошибке, теперь там есть ссылка на официальный сайт.</li>
            <li>Ссылка на оф. сайт появилась и прямо под расписанием, чтобы быстро его сверять.</li>
            <li>Добавлены звания преподавателям (простите, что забыл в прошлой версии).</li>
            <li>Переделано окошко открытия расписания: теперь оно лучше управляется с клавиатуры, а ещё у него новый дизайн.</li>
            <li>Переписано взаимодействие с бекендом (не вуза, а этого сайта), всё стало понятнее и, возможно, даже быстрее.</li>
            <li>Немного переделан дизайн в целом, унифицированы цвета.</li>
        </ul>

        <Dialog.Close
            class="cursor-pointer duration-150 transition-colors w-full mt-4 text-center border-[1.5px] p-2.5 rounded-lg bg-bg-elevated border-border text-fg hover:bg-bg-elevated-hover "
        >
            Понятно
        </Dialog.Close>
    
    </Dialog.Content>
</Dialog.Root>