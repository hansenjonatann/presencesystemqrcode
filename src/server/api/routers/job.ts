import {z} from 'zod'
import { createTRPCRouter, protectedProcedure, publicProcedure } from '../trpc'
import { db } from '~/server/db'

export const JobRoutes = createTRPCRouter({
    get: publicProcedure.query(async () => {
        await db.job.findMany({
            include: {
                users: true
            }
        })
    }),

    getWithPagination: publicProcedure.input(z.object({page: z.number().default(1)})).mutation(async ({input}) => {
        const limit = 10
        const offset = (input.page - 1) * limit
        const totalJobs = await db.job.count()
        const jobs = await db.job.findMany({
            take: limit , 
            skip: offset
        })

        return {
            total: totalJobs, 
            jobs 
        }
    }),

    create: publicProcedure.input(z.object({name: z.string() , desc: z.string().nullable()})).mutation(async ({input}) => {
        await db.job.create({
            data: {
                name: input.name , 
                desc: input.desc

            }
        })
    }),

    delete: protectedProcedure.input(z.object({id: z.string()})).mutation(async ({input }) => {

        await db.job.delete({
            where: {
                id: input.id
            }
        })


    })
})