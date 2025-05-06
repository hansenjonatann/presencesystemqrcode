import {z} from 'zod'
import { adminProcedure, createTRPCRouter, protectedProcedure } from '../trpc'
import { db } from '~/server/db'

export const PermissionRoutes = createTRPCRouter({
    get: protectedProcedure.input(z.object({page: z.number().default(1)})).query(async ({input , ctx}) => {
        const limit = 5
        const offset = (input.page - 1) * limit
        const userId = ctx.session.user.id
        return await db.permission.findMany({
            where: {
                userId
            },
          
            take: limit , 
            skip: offset
        })
    }),

    create: protectedProcedure
    .input(
      z.object({
        reason: z.string().min(1, 'Reason is required'),
      })
    )
    .mutation(async ({ input, ctx }) => {
        
      const permission = await db.permission.create({
        data: {
          userId: ctx.session.user.id,
          reason: input.reason,
          status: 'PENDING', // Default status
        },
      });

      return permission;
    }),

    getAll: adminProcedure.query( async ({ctx}) => {
        return await db.permission.findMany({
            include: {
                user: true
            }
        })
    }),

    declinePermission: adminProcedure.input(z.object({id: z.string()})).mutation(async ({input} ) => {
        return await db.permission.update({
            data: {
                status: 'DECLINE'
            },
            where: {
                id: input.id
            }
        })
    }),

    approvePermission: adminProcedure.input(z.object({id: z.string()})).mutation(async ({input} ) => {
        return await db.permission.update({
            data: {
                status: 'APPROVE'
            },
            where: {
                id: input.id
            }
        })
    })


})