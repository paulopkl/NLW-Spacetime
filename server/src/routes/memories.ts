import { FastifyInstance } from "fastify";
import { prismaClient } from "../lib/prisma";
import { z } from "zod";

export async function memoriesRoutes(app: FastifyInstance) {
    app.addHook("preHandler", async (request) => {
        // Before every route in this module, verify the JWT Token
        await request.jwtVerify();
    });

    app.get("/memories", async (req) => {
        const memories = await prismaClient.memory.findMany({
            where: {
                userId: req.user.sub,
            },
            orderBy: {
                createdAt: "asc",
            },
        });

        return memories.map((memory) => {
            return {
                id: memory.id,
                coverUrl: memory.coverUrl,
                excerpt: memory.content.substring(0, 117).concat("..."),
                createdAt: memory.createdAt,
            };
        });
    });

    app.get("/memories/:id", async (req, res) => {
        const paramsSchema = z.object({
            id: z.string().uuid(),
        });

        const { id } = paramsSchema.parse(req.query);
        const memory = await prismaClient.memory.findUniqueOrThrow({
            where: { id },
        });

        if (!memory.isPublic && memory.userId != req.user.sub) {
            return res.status(401).send();
        }

        return memory;
    });

    app.post("/memories", async (req, res) => {
        const bodySchema = z.object({
            content: z.string(),
            coverUrl: z.string(),
            isPublic: z.coerce.boolean().default(false), // .coerce. Converts "NaN, null, undefined, 0" to false
        });

        const { content, coverUrl, isPublic } = bodySchema.parse(req.body);
        const createdMemory = await prismaClient.memory.create({
            data: {
                content,
                coverUrl,
                isPublic,
                userId: req.user.sub,
            },
        });

        return createdMemory;
    });

    app.put("/memories/:id", async (req, res) => {
        const paramsSchema = z.object({
            id: z.string().uuid(),
        });

        const { id } = paramsSchema.parse(req.query);

        const bodySchema = z.object({
            content: z.string(),
            coverUrl: z.string(),
            isPublic: z.coerce.boolean().default(false),
        });

        const { content, coverUrl, isPublic } = bodySchema.parse(req.body);

        let memory = await prismaClient.memory.findUniqueOrThrow({
            where: {
                id,
            },
        });

        if (memory.userId != req.user.sub) {
            return res.status(401).send();
        }

        const updatedMemory = await prismaClient.memory.update({
            where: { id },
            data: {
                content,
                coverUrl,
                isPublic,
            },
        });

        return updatedMemory;
    });

    app.delete("/memories/:id", async (req, res) => {
        const paramsSchema = z.object({
            id: z.string(),
        });

        const { id } = paramsSchema.parse(req.body);

        let memory = await prismaClient.memory.findUniqueOrThrow({
            where: {
                id,
            },
        });

        if (memory.userId != req.user.sub) {
            return res.status(401).send();
        }

        await prismaClient.memory.delete({
            where: { id },
        });
    });
}
