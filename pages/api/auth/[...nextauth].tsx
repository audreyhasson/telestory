import NextAuth from 'next-auth';
import CredentialsProvider from "next-auth/providers/credentials";
import { MongoClient } from 'mongodb';
import { compare } from 'bcryptjs';
import { verifyPassword } from '../../../lib/auth';
import { connectToDatabase } from '../../../lib/db';

export default NextAuth({
//   session: {
//     strategy: "jwt",
//   },
  providers: [
        CredentialsProvider({
          // The name to display on the sign in form (e.g. 'Sign in with...')
          name: 'my-project',
          // The credentials is used to generate a suitable form on the sign in page.
          // You can specify whatever fields you are expecting to be submitted.
          // e.g. domain, username, password, 2FA token, etc.
          // You can pass any HTML attribute to the <input> tag through the object.
          credentials: {
            email: {
              label: 'email',
              type: 'email',
              placeholder: 'jsmith@example.com',
            },
            password: { label: 'Password', type: 'password' },
          },
          async authorize(credentials, req) {
            const client = await connectToDatabase();
    
            const usersCollection = client.db("starterData").collection('users');
    
            const user = await usersCollection.findOne({
              email: credentials.email,
            });

            if (!user) {
                client.close();
                throw new Error('No user found!');
            }
    
            const isValid = await verifyPassword(
                credentials.password,
                user.passHash
            );
    
            if (!isValid) {
                client.close();
                throw new Error('Could not log you in!');
                return null
            }
    
            client.close();
            return user
          },
        }),
  ], callbacks: {
    async session ({ session }){
        const client = await connectToDatabase();
    
        const usersCollection = client.db("starterData").collection('users');

        const user = await usersCollection.findOne({
            email: session.user.email,
        });

        session.user = user;
        return session;
    }
  }, secret: process.env.AUTH_SECRET,
  pages: {
    signIn: '/../../auth',
    //signOut: '/auth/signout',
    //error: '/auth/error', // Error code passed in query string as ?error=
    //verifyRequest: '/auth/verify-request', // (used for check email message)
  }
});