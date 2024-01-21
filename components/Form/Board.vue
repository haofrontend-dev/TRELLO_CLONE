<script lang="ts" setup>
import type { z } from "zod";
import BoardSchema from "~/schemas/Board.schema";
import type { BoardDocument } from "~/server/models/Board.model";

interface Props {
    type: "create" | "update";
    initialData?: BoardDocument;
    onCreate?: () => void;
    onUpdate?: () => void;
}

const props = withDefaults(defineProps<Props>(), {
    type: "create",
});

const isLoading = ref(false);
const formState = reactive<Partial<BoardDocument>>({
    name: undefined,
    coverImage: undefined,
});

const toast = useToast();

const handleForm = async (
    // @ts-ignore
    event: FormSubmitEvent<z.output<typeof BoardSchema>>
) => {
    try {
        isLoading.value = true;

        if (props.type === "update" && props.initialData!._id) {
            await useFetch(`/api/boards/${props.initialData?._id}`, {
                method: "PUT",
                body: event.data,
                watch: false,
            });

            props.onUpdate?.();
            toast.add({
                title: "Board updated",
            });
        } else {
            await useFetch("/api/boards", {
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
        formState.coverImage = props.initialData.coverImage;
    }

    // if (props.type === 'create') {
    //   formState.name = undefined
    //   formState.coverImage = undefined
    // }
});
</script>

<template>
    <UForm :state="formState" :schema="BoardSchema" @submit="handleForm">
        <UFormGroup class="mb-4" name="name" label="Name">
            <UInput v-model="formState.name"></UInput>
        </UFormGroup>
        <UFormGroup class="mb-4" name="coverImage" label="Cover Image">
            <ImagePicker v-model="formState.coverImage" />
        </UFormGroup>
        <UButton block type="submit" :loading="isLoading">
            {{ type === "create" ? "Create Board" : "Update Board" }}
        </UButton>
    </UForm>
</template>

<style></style>
