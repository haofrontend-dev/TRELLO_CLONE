<script setup lang="ts">
import { reactive, ref } from "vue";
import z from "zod";

// @ts-ignore
import SigninSchema from "~/schemas/Signin.schema";

const isLoading = ref(false);
const formState = reactive({
    email: undefined,
    password: undefined,
});

// @ts-ignore
const router = useRouter();

// @ts-ignore
const { signIn } = useAuth();

const handleSingin = async (
    // @ts-expect-error
    event: FormSubmitEvent<z.output<typeof SigninSchema>>
) => {
    try {
        isLoading.value = true;
        const res = await signIn("credentials", {
            email: event.data.email,
            password: event.data.password,
            redirect: false,
        });

        if (!res?.error) {
            router.push("/");
        }
    } catch (error) {
    } finally {
        isLoading.value = false;
    }
};
</script>
<template>
    <WrapperAuth title="Login to your account">
        <!-- Form -->
        <UForm :state="formState" :schema="SigninSchema" @submit="handleSingin">
            <UFormGroup class="mb-4" name="email" label="Email">
                <UInput v-model="formState.email" type="email"></UInput>
            </UFormGroup>
            <UFormGroup class="mb-4" name="password" label="Password">
                <UInput v-model="formState.password" type="password"></UInput>
            </UFormGroup>

            <UButton block :loading="isLoading" type="submit">Signin</UButton>
        </UForm>
        <!-- ./Form -->
    </WrapperAuth>
</template>
<style scoped></style>
