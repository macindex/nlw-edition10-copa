import Fastify from 'fastify'
import { PrismaClient } from '@prisma/client'
import cors from '@fastify/cors'
import { z } from 'zod'
import sui from 'short-unique-id'

const prisma = new PrismaClient({ 
    log: ['query'],

 })

async function bootstrap() {
    const fastify = Fastify({
        logger: true,
    })

    await fastify.register(cors, {
        origin: true,
    })

    fastify.post('/pools', async (request, reply) => {
        
        const createPoolBody = z.object({
            title: z.string(),
        })
        
        const { title } = createPoolBody.parse(request.body)

        const generate = new sui({ length: 6 })
        const code = String(generate()).toUpperCase()
        await prisma.pool.create({
            data: {
                title,
                code
            }
        })
        
        return reply.status(201).send({ code })
        // return { title }
    })
    await fastify.listen({ port: 3333 })
    // await fastify.listen({ port: 3333, host: '0.0.0.0' })
}

bootstrap()
