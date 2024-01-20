// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    devtools: { enabled: true },

    runtimeConfig: {
        auth: {
            secret: process.env.AUTH_SECRET,
            origin: process.env.AUTH_ORIGIN,
        },
    },
    modules: ["@nuxt/ui", "nuxt-server-utils", "@sidebase/nuxt-auth"],
    ui: {},
    nuxtServerUtils: {
        mongodbUri: process.env.MONGODB_URL,
    },

    auth: {
        baseURL: process.env.AUTH_ORIGIN,
        provider: {
            type: "authjs",
        },
    },
});
