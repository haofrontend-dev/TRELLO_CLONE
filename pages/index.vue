<script setup lang="ts">
import type { BoardDocument } from "~/server/models/Board.model";

// @ts-ignore
definePageMeta({
    middleware: "auth",
});

const { data, refresh } = useFetch<BoardDocument>("/api/boards");
const showCreateBoard = ref(false);
const selectedBoard = ref<BoardDocument | undefined>();

watchEffect(() => {
    if (!showCreateBoard.value) {
        selectedBoard.value = undefined;
    }
});
</script>

<template>
    <WrapperDefault>
        <template #actions>
            <UButton size="xs" @click="showCreateBoard = true">
                Create board
            </UButton>
        </template>

        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <BoardCard v-for="board in data" :key="board._id" :board="board" :on-edit="() => {
                selectedBoard = board
                showCreateBoard = true
            }" />
        </div>

        <USlideover v-model="showCreateBoard">
            <OverlayHeader
                :title="selectedBoard ? 'Update a board' : 'Create a board'"
                :on-click="() => (showCreateBoard = false)"
            />
            <div class="p-4">
                <FormBoard
                    :type="selectedBoard ? 'update' : 'create'"
                    :initial-data="selectedBoard"
                    :on-create="
                        () => {
                            refresh();
                            showCreateBoard = false;
                        }
                    "
                    :on-update="
                        () => {
                            refresh();
                            showCreateBoard = false;
                        }
                    "
                />
            </div>
        </USlideover>
    </WrapperDefault>
</template>

<style scoped></style>
