import NextAuth from "next-auth";
import TwitchProvider from "next-auth/providers/twitch";

const handler = NextAuth({
  providers: [
    TwitchProvider({
      clientId: process.env.TWITCH_CLIENT_ID,
      clientSecret: process.env.TWITCH_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      // Добавляем данные пользователя в сессию
      session.user.id = token.sub;
      return session;
    },
  },
});

export { handler as GET, handler as POST };