<script lang="ts" setup>
import draggable from "vuedraggable";
import type { ListDocument } from "~/server/models/List.model";

interface Props {
    lists: ListDocument[];
    boardId: string;
}

const props = defineProps<Props>();

const listActions = ref([
    [
        {
            label: "Add card",
            icon: "i-heroicons-plus-circle",
        },
    ],
    [
        {
            label: "Delete",
            icon: "i-heroicons-trash",
        },
    ],
]);

const handleSort = async (e:any) => {
    await useFetch(`/api/boards/${props.boardId}`, {
        method: 'PUT',
        body: {
            lists: props.lists.flatMap(item => item._id)
        },
        watch: false
    })
    
}
</script>

<template>
    <div>
        <draggable
            :list="lists"
            handle=".list-handle"
            :scroll-sensitivity="500"
            force-fallback="true"
            item-key="_id"
            ghost-class="ghost-board"
            drag-class="dragging-board"
            class="flex gap-4 h-[80vh] overflow-x-auto pb-2"
            @sort="handleSort"
        >
            <template #item="{ element }">
                <div class="flex">
                    <div
                        class="w-72 shadow flex-none bg-white dark:bg-gray-800 rounded-lg flex flex-col"
                    >
                        <!-- List Header -->
                        <div
                            class="p-2 border-b dark:border-gray-700 flex items-center justify-between list-handle"
                        >
                            <h3 class="font-medium">
                                {{ element.name }}
                            </h3>

                            <UDropdown :items="listActions">
                                <UIcon name="i-heroicons-cog-6-tooth" />
                            </UDropdown>
                        </div>
                        <!-- ./ List Header -->

                        <!-- List Body -->
                        <div
                            class="list-body p-2 flex-1 overflow-y-hidden"
                        ></div>
                        <!-- ./ List Body -->

                        <!-- List Footer -->
                        <div
                            class="p-1 border-t dark:border-gray-700 text-center"
                        >
                            <UButton block>Add card</UButton>
                        </div>
                        <!-- ./ List Footer -->
                    </div>
                </div>
            </template>
        </draggable>
    </div>
</template>

<style>
.ghost-board > div {
    @apply opacity-50;
}

.ghost-board > div > div {
    @apply invisible;
}

.dragging-board  {
    @apply shadow-2xl transform rotate-2 cursor-grabbing
}

.sortable-chosen {
    opacity: 1 !important;
}
</style>
