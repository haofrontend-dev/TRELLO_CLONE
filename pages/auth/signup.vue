<script setup lang="ts">
import { reactive, ref } from "vue";
import { z } from "zod";
// @ts-ignore
import SignupSchema from "~/schemas/Signup.schema";

const isLoading = ref(false);
const formStatus = reactive({
    name: undefined,
    email: undefined,
    password: undefined,
    passwordConfirm: undefined,
});

// @ts-ignore
const router = useRouter();

const handleSubmit = async (
    // @ts-expect-error
    event: FormSubmitEvent<z.output<typeof SignupSchema>>
) => {
    try {
        isLoading.value = true;
        // @ts-ignore
        await useFetch("/api/auth/signup", {
            method: "POST",
            body: event.data,
            watch: false,
        });

        // @ts-ignore
        useToast().add({
            title: "Account created!",
            description:
                " Your account has been created successfully, Redirecting you to the sign in page",
            timeout: 2000,
        });

        router.push("/auth/signin");
    } catch (error) {
        // @ts-ignore
        useToast().add({
            title: "Error",
            // @ts-ignore
            description: error?.message || "Something went wrong",
        });
    } finally {
        isLoading.value = false;
    }
};
</script>

<template>
    <WrapperAuth>
        <UForm
            :state="formStatus"
            :schema="SignupSchema"
            @submit="handleSubmit"
        >
            <UFormGroup class="mb-4" name="name" label="Name">
                <UInput v-model="formStatus.name"> </UInput>
            </UFormGroup>
            <UFormGroup class="mb-4" name="email" label="Email">
                <UInput v-model="formStatus.email" type="email"> </UInput>
            </UFormGroup>
            <UFormGroup class="mb-4" name="password" label="Password">
                <UInput v-model="formStatus.password" type="password"> </UInput>
            </UFormGroup>
            <UFormGroup class="mb-4" name="password" label="Confirm Password">
                <UInput
                    v-model="formStatus.passwordConfirm"
                    type="password"
                ></UInput>
            </UFormGroup>
            <UButton block type="submit" :loading="isLoading">
                Create account</UButton
            >
        </UForm>
    </WrapperAuth>
</template>

<style scoped></style>
