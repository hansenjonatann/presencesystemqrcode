import { PrismaAdapter } from "@auth/prisma-adapter";
import { compare } from "bcrypt-ts";
import { type DefaultSession, type NextAuthConfig } from "next-auth";
import Credentials from 'next-auth/providers/credentials'

import { db } from "~/server/db";



declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      // ...other properties
      // role: UserRole;
    } & DefaultSession["user"];
  }

}



export const authConfig = {
  providers: [
    Credentials({
      name: 'credentials' , 
      credentials: {
        username: {type:'text'},
        password: {type: 'Password'}
      },

      async authorize(credentials: any) {
        const user = await db.user.findFirst({
          where: {
            username: credentials?.username
          }
        })

        if(!user) throw new Error('User not registered!')
        
        const isValidPassword = compare(credentials?.password , user.password)

        if(!isValidPassword) throw new Error('Invalid credentials!')
        
        return {id: user.id , name: user.name , username: user.username , role: user.role , profile:user.profile}
      }
    },)
  ],
  session: {
    strategy: 'jwt'
  },

  adapter: PrismaAdapter(db),
  callbacks: {
   async jwt({user , token} : any) {
    if(user) {
      token.id = user.id 
    token.name = user.name 
    token.username = user.username
    token.role = user.role
    token.profile = user.profile
    }
    return token
   },

   async session({session , token}: any){
    if(token) {
      session.user = {
        id : token.id ,
        name: token.name , 
        username: token.username ,
        role: token.role ,
        profile: token.profile

      }
      return session
    }
   }
  },
  secret: process.env.AUTH_SECRET
} satisfies NextAuthConfig;
