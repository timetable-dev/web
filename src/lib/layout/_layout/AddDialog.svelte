<script lang="ts">
	import type { Entity } from "$lib/types";
	import { Select, Combobox, SkeletonSmall } from "$lib/components";
	import { Dialog, Tabs, RadioGroup, Label } from "bits-ui";
	import { addedEntities } from "$lib/persisted";

	type SelectItem = { value: string; label: string };

	let {
		dialogOpen = $bindable(false),
		selectedEntityId = $bindable()
	}: { dialogOpen: boolean; selectedEntityId: string | undefined } = $props();

	let faculties: SelectItem[] = [
		{ value: "202", label: "ФАЯ" },
		{ value: "196", label: "ФНЯ" },
		{ value: "222", label: "ФРЯ" },
		{ value: "221", label: "ФКЯиК" },
		{ value: "193", label: "ФМК" },
		{ value: "203", label: "ПФ" },
		{ value: "217", label: "Магистратура" }
	];

	let selectedType = $state<"group" | "teacher">("group");
	let selectedFaculty = $state<SelectItem>();
	let selectedMode = $state<"1" | "2" | "">("");

	let selectedFacultyValue = $state<string>();

	$effect(() => {
		selectedFaculty = faculties.find(({ value }) => value === selectedFacultyValue);
	});

	// Automatically fetching either a list of groups if group tab is active
	// and faculty and mode are selected or a list of teachers if teacher tab is active.

	let groupList = $state<Promise<SelectItem[]>>();
	let teacherList = $state<Promise<SelectItem[]>>();

	let selectedGroup = $state<SelectItem>();
	let selectedTeacher = $state<SelectItem>();

	async function getGroups(selectedFaculty: any, selectedMode: any): Promise<SelectItem[]> {
		const res = await fetch(`/api/groups/${selectedFaculty.value}/${selectedMode}`);
		return await res.json();
	}

	async function getTeachers(): Promise<SelectItem[]> {
		let res = await fetch("/api/teachers");
		return await res.json();
	}

	$effect(() => {
		if (selectedType === "group" && selectedFaculty && selectedMode) {
			groupList = getGroups(selectedFaculty, selectedMode);
		} else if (selectedType === "teacher") {
			teacherList = getTeachers();
		}
	});

	// Submitting entity

	let submitButtonActive = $state<boolean>(false);
	let submitButtonStyle = $derived(
		submitButtonActive
			? "bg-blue-500 text-white hover:bg-blue-600 cursor-pointer"
			: "bg-zinc-50 text-zinc-400 cursor-not-allowed dark:bg-zinc-800"
	);

	$effect(() => {
		if (selectedType === "group" && selectedGroup) {
			submitButtonActive = true;
		} else if (selectedType === "teacher" && selectedTeacher) {
			submitButtonActive = true;
		}
	});

	function clearInput() {
		selectedType = "group";
		selectedFaculty = undefined;
		selectedMode = "";
		selectedGroup = undefined;
		selectedTeacher = undefined;
		groupList = undefined;
		teacherList = undefined;
		submitButtonActive = false;
	}

	function submitEntityAndClose() {
		if (selectedType === "group" && selectedGroup) {
			const selectedEntity: Entity = {
				id: crypto.randomUUID(),
				name: selectedGroup.label,
				mslu_id: selectedGroup.value,
				type: "group"
			};
			addedEntities.current.push(selectedEntity);
			selectedEntityId = selectedEntity.id;
		} else if (selectedType === "teacher" && selectedTeacher) {
			const selectedEntity: Entity = {
				id: crypto.randomUUID(),
				name: selectedTeacher.label,
				mslu_id: selectedTeacher.value,
				type: "teacher"
			};
			addedEntities.current.push(selectedEntity);
			selectedEntityId = selectedEntity.id;
		}

		clearInput();
	}
</script>

<Dialog.Root bind:open={dialogOpen}>
	<Dialog.Trigger />
	<Dialog.Portal>
		<Dialog.Overlay class="fixed inset-0 z-49 bg-black/50 dark:bg-zinc-800/80 data-[state=open]:animate-fade-in data-[state=closed]:animate-fade-out" />
		<Dialog.Content
			class="dialog-center flex w-[90%] flex-col gap-3 rounded-xl bg-white p-2 pt-4 text-zinc-950 shadow-md outline-1
                  outline-zinc-300 md:w-2/3 lg:w-1/3 dark:bg-zinc-900 dark:text-zinc-50 dark:outline-zinc-800
				  data-[state=open]:animate-scale-in data-[state=closed]:animate-scale-out"
		>
			<!-- Заголовок: Добавить расписание -->
			<Dialog.Title class="mb-1 text-center text-xl font-medium text-zinc-900 dark:text-white"
				>Добавить расписание</Dialog.Title
			>

			<!-- Для групп / Для преподавателей -->
			<Tabs.Root bind:value={selectedType}>
				<Tabs.List
					class="grid w-full grid-cols-2 gap-1 rounded-md bg-zinc-100 p-1 font-medium text-zinc-900
                                  inset-shadow-sm dark:bg-zinc-800 dark:text-white dark:inset-shadow-none"
				>
					<Tabs.Trigger
						value="group"
						class="truncate rounded-sm p-2 text-nowrap
                               text-zinc-800 data-[state=active]:bg-white data-[state=active]:text-zinc-950 data-[state=active]:shadow-sm
                               dark:text-zinc-200 dark:data-[state=active]:bg-zinc-700
                               dark:data-[state=active]:text-zinc-50 dark:data-[state=active]:shadow-none"
					>
						Группы
					</Tabs.Trigger>
					<Tabs.Trigger
						value="teacher"
						class="truncate rounded-sm p-2 text-nowrap
                            text-zinc-800 data-[state=active]:bg-white data-[state=active]:text-zinc-950 data-[state=active]:shadow-sm
                            dark:text-zinc-200 dark:data-[state=active]:bg-zinc-700
                            dark:data-[state=active]:text-zinc-50 dark:data-[state=active]:shadow-none"
					>
						Преподаватели
					</Tabs.Trigger>
				</Tabs.List>

				<!-- Для групп -->
				<Tabs.Content value="group" class="flex flex-col">
					<!-- Выбор факультета -->
					<Label.Root class="my-1.5 p-2 font-medium text-zinc-900 dark:text-zinc-100"
						>Выбери факультет:</Label.Root
					>
					<Select
						items={faculties}
						bind:selectedItem={selectedFaculty}
						placeholder="Факультет"
					/>

					<!-- Выбор формы обучения -->
					<Label.Root class="my-1.5 p-2 font-medium text-zinc-900 dark:text-zinc-100"
						>Выбери форму обучения:</Label.Root
					>
					<RadioGroup.Root bind:value={selectedMode} class="flex flex-col gap-3 pl-6">
						<div class="flex flex-row items-center gap-4">
							<RadioGroup.Item
								id="offline"
								value="1"
								class="size-5 cursor-pointer rounded-full border-2 border-zinc-700 transition-all ease-in-out data-[state=checked]:border-[6px] data-[state=checked]:border-blue-500 dark:border-zinc-100 dark:data-[state=checked]:border-blue-400"
							/>
							<Label.Root
								for="offline"
								class="text-foreground dark:text-foreground-dark cursor-pointer"
								>Очная</Label.Root
							>
						</div>
						<div class="flex flex-row items-center gap-4">
							<RadioGroup.Item
								id="online"
								value="2"
								class="size-5 cursor-pointer rounded-full border-2 border-zinc-700 transition-all ease-in-out data-[state=checked]:border-[6px] data-[state=checked]:border-blue-500 dark:border-zinc-100 dark:data-[state=checked]:border-blue-400"
							/>
							<Label.Root
								for="online"
								class="text-foreground dark:text-foreground-dark cursor-pointer"
								>Заочная</Label.Root
							>
						</div>
					</RadioGroup.Root>

					<!-- Выбор группы -->
					{#if groupList}
						{#await groupList}
							<SkeletonSmall />
						{:then response}
							<Label.Root
								class="my-1.5 p-2 font-medium text-zinc-900 dark:text-zinc-100"
								>Выбери группу:</Label.Root
							>
							<Combobox
								items={response}
								placeholder="Номер группы"
								bind:selectedItem={selectedGroup}
							/>
						{/await}
					{/if}
				</Tabs.Content>

				<!-- Для преподавателей -->
				<Tabs.Content value="teacher" class="flex flex-col">
					{#if teacherList}
						{#await teacherList}
							<SkeletonSmall />
						{:then response}
							<Label.Root
								class="my-1.5 p-2 font-medium text-zinc-900 dark:text-zinc-100"
								>Выберите преподавателя:</Label.Root
							>
							<Combobox
								items={response}
								placeholder="Фамилия И. О."
								bind:selectedItem={selectedTeacher}
							/>
						{/await}
					{/if}
				</Tabs.Content>
			</Tabs.Root>

			<!-- Отмена / Добавить -->
			<div class="mt-2 grid w-full grid-cols-2 gap-2">
				<Dialog.Close
					onclick={clearInput}
					class="cursor-pointer rounded-md bg-zinc-100 py-2.5 font-medium transition-all duration-150 hover:bg-zinc-200 active:scale-[0.98] dark:bg-zinc-600 dark:hover:bg-zinc-700"
				>
					Отмена
				</Dialog.Close>
				<Dialog.Close
					onclick={() => {
						submitEntityAndClose();
					}}
					class="rounded-md py-2.5 font-medium transition-all duration-150 active:scale-[0.98] {submitButtonStyle}"
				>
					Добавить
				</Dialog.Close>
			</div>
		</Dialog.Content>
	</Dialog.Portal>
</Dialog.Root>
