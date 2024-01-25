<script lang="ts" setup>
import type { z } from "zod";
import ListSchema from "~/schemas/List.schema";
import type { ListDocument } from "~/server/models/List.model";

interface Props {
    type: "create" | "update";
    initialData?: ListDocument;
    boardId: string
    onCreate?: () => void;
    onUpdate?: () => void;
}

const props = withDefaults(defineProps<Props>(), {
    type: "create",
});

const isLoading = ref(false);
const formState = reactive<Partial<ListDocument>>({
    name: undefined,
    board: props.boardId
});

const toast = useToast();

const handleForm = async (
    // @ts-ignore
    event: FormSubmitEvent<z.output<typeof ListSchema>>
) => {
    try {
        isLoading.value = true;

        if (props.type === "update" && props.initialData!._id) {
            await useFetch(`/api/lists/${props.initialData?._id}`, {
                method: "PUT",
                body: event.data,
                watch: false,
            });

            props.onUpdate?.();
            toast.add({
                title: "Board updated",
            });
        } else {
            await useFetch("/api/lists", {
                method: "POST",
                body: event.data,
                watch: false,
            });

            props.onCreate?.();
            toast.add({
                title: "Board created",
            });
        }
    } catch (error) {
    } finally {
        isLoading.value = false;
    }
};

watchEffect(() => {
    if (props.type === "update" && props.initialData) {
        formState.name = props.initialData.name;
        formState.board = props.initialData.board;
    }
});

</script>

<template>
    <UForm :state="formState" :schema="ListSchema" @submit="handleForm">
        <UFormGroup class="mb-4" name="name" label="Name">
            <UInput v-model="formState.name"></UInput>
        </UFormGroup>
       
        <UButton block type="submit" :loading="isLoading">
            {{ type === "create" ? "Create List" : "Update List" }}
        </UButton>
    </UForm>
</template>

<style></style>
