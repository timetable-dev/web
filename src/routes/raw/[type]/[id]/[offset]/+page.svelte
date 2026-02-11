<script lang="ts">
    import { getRawLessons, type MsluData } from "$lib/remote/lessons.remote";
    import { page } from "$app/state";

    let lessons = $state<Promise<MsluData>>()

    if (page.params.type === "group" && typeof page.params.id === "string") {
        const weekOffset = Number(page.params.offset)
        lessons = getRawLessons({ id: page.params.id, type: "group", weekOffset: weekOffset });
    } else if (page.params.type === "teacher" && typeof page.params.id === "string") {
        const weekOffset = Number(page.params.offset)
        lessons = getRawLessons({ id: page.params.id, type: "teacher", weekOffset: weekOffset });
    }
</script>

{#if lessons}
    {#await lessons}
        <p>Loading...</p>
    {:then lessons}
        <table class="overflow-scroll border-collapse">
            <thead>
                <tr>
                    <th class="border px-1">dateIn</th>
                    <th class="border px-1">dateOut</th>
                    <th class="border px-1">timeIn</th>
                    <th class="border px-1">timeOut</th>
                    <th class="border px-1">lessonNumber</th>
                    <th class="border px-1">day</th>
                    <th class="border px-1">dayNumber</th>
                    <th class="border px-1">classroom</th>
                    <th class="border px-1">discipline</th>
                    <th class="border px-1">disciplineFull</th>
                    <th class="border px-1">disciplineType</th>
                    <th class="border px-1">disciplineTypeId</th>
                    <th class="border px-1">groupName</th>
                    <th class="border px-1">idSchedule</th>
                    <th class="border px-1">faculty</th>
                    <th class="border px-1">idF</th>
                    <th class="border px-1">idGroup</th>
                    <th class="border px-1">isEven</th>
                </tr>
            </thead>
            <tbody>
                {#each lessons as lesson}            
                <tr class="text-nowrap">
                    <td class="border px-1">{lesson.dateIn}</td>
                    <td class="border px-1">{lesson.dateOut}</td>
                    <td class="border px-1">{lesson.timeIn}</td>
                    <td class="border px-1">{lesson.timeOut}</td>
                    <td class="border px-1">{lesson.lessonNumber}</td>
                    <td class="border px-1">{lesson.day}</td>
                    <td class="border px-1">{lesson.dayNumber}</td>
                    <td class="border px-1">{lesson.classroom}</td>
                    <td class="border px-1">{lesson.discipline}</td>
                    <td class="border px-1">{lesson.disciplineFull}</td>
                    <td class="border px-1">{lesson.disciplineType}</td>
                    <td class="border px-1">{lesson.disciplineTypeId}</td>
                    <td class="border px-1">{lesson.groupName}</td>
                    <td class="border px-1">{lesson.idSchedule}</td>
                    <td class="border px-1">{lesson.faculty}</td>
                    <td class="border px-1">{lesson.idF}</td>
                    <td class="border px-1">{lesson.idGroup}</td>
                    <td class="border px-1">{lesson.isEven}</td>
                </tr>
            {/each}
            </tbody>
        </table>
    {/await}
{/if}