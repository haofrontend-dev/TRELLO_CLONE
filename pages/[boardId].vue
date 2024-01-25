<script lang="ts" setup>
import type { BoardDocument } from "~/server/models/Board.model";
import type { ListDocument } from "~/server/models/List.model";

const { boardId } = useRoute().params;

const { data, refresh } = await useFetch<BoardDocument>(`/api/boards/${boardId}`);

const selectedList = ref<ListDocument | undefined>();
const showListCreate = ref(false);

if (!data.value) {
    throw createError({
        statusCode: 404,
        message: 'Board not found'
    })
}
</script>

<template>
    <WrapperDefault v-if="data" class="h-screen" :style="{
        backgroundImage: `url(${data.coverImage})`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
    }">
        <template #actions>
            <UButton size="xs" @click="showListCreate = true"
                >Create list</UButton
            >
        </template>

        <h1 class="text-3xl font-semibold mb-4 inline-block ">{{ data.name }}</h1>

        <!-- List Container -->
        <ListContainer :lists="data.lists" :board-id="boardId"></ListContainer>
        <!-- ./ List Container -->

        <USlideover v-model="showListCreate">
            <OverlayHeader
                :title="selectedList ? 'Update list' : 'Create list'"
                :on-click="
                    () => {
                        showListCreate = false;
                    }
                "
            >
            </OverlayHeader>
            <div class="p-4">
                <FormList
                    :type="selectedList ? 'update' : 'create'"
                    :initial-data="selectedList"
                    :board-id="(boardId as string)"
                    :on-create="
                        () => {
                            refresh();
                            showListCreate = false;
                        }
                    "
                ></FormList>
            </div>
        </USlideover>
    </WrapperDefault>
</template>

<style></style>
