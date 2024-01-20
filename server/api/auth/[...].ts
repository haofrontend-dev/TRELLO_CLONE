import { NuxtAuthHandler } from "#auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { User } from "~/server/models/User.model";

export default NuxtAuthHandler({
    secret: useRuntimeConfig().auth.secret,
    providers: [
        // @ts-ignore
        CredentialsProvider.default({
            name: "credentials",
            origin: useRuntimeConfig().auth.origin,

            async authorize(credentials: { email: string; password: string }) {
                // Login Logic

                const user = await User.findOne({ email: credentials.email });

                if (!user) {
                    return null;
                }

                const isValid = await User.comparePassword(
                    credentials.password
                );

                if (!isValid) {
                    return null;
                }

                return user.toObject();
            },
        }),
    ],

    session: {
        strategy: "jwt",
    },

    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token = {
                    ...token,
                    ...user,
                };
            }

            return token;
        },

        async session({ session }) {},
    },
});
