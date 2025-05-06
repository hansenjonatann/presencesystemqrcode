import {z} from 'zod'
import { createTRPCRouter, protectedProcedure, publicProcedure } from '../trpc'
import { db } from '~/server/db'
import { hashSync } from 'bcrypt-ts'
import cloudinary from '~/app/lib/cloudinary'

export const AuthRoutes = createTRPCRouter({
    signup: publicProcedure.input(z.object({name: z.string() ,  username: z.string(), email: z.string() , password: z.string(), address: z.string().nullable() , profile: z.string().optional()})).mutation(async ({input}) => {
        const existingUser = await db.user.findUnique({
            where: {
                username: input.username
            }
        })



        if(existingUser) throw new Error('User already exists!') 

            let profileUrl = '';
      if (input.profile) {
        try {
          const uploadResult = await cloudinary.uploader.upload(input.profile, {
            folder: 'presence-system-profile',
            public_id: `profile-${input.username}-${Date.now()}`,
          });
          profileUrl = uploadResult.secure_url;
        } catch (error) {
          console.error('Cloudinary upload error:', error);
          throw new Error('Failed to upload profile image');
        }
      }

        const hashedPassword = hashSync(input.password , 10)

        const newUser = await db.user.create({
            data: {
                name: input.name, 
                email: input.email,
                password: hashedPassword, 
                username: input.username,
                address: input.address,
                profile: profileUrl
                
            }
        })

        return newUser

    }),

    updateProfile: protectedProcedure.input(z.object({name: z.string() , address: z.string().nullable() })).mutation(async ({input , ctx}) => {
        const userId = ctx.session.user.id 

        const updatedUser = await db.user.update({
            data: {
                name: input.name , 
                address: input.address
            },
            where: {
                id: userId
            }
        })
        return updatedUser
    })

})