import { FastifyInstance } from "fastify";
import axios from "axios";
import { z } from "zod";
import { prismaClient } from "../lib/prisma";

export async function authRoutes(app: FastifyInstance) {
    app.post("/register", async (req, res) => {
        const bodySchema = z.object({
            code: z.string(),
        });

        const { code } = bodySchema.parse(req.body);
        const accessTokenResponse = await axios.post(
            `https://github.com/login/oauth/access_token?code=${code}&client_id=${process.env.GITHUB_CLIENT_ID}&client_secret=${process.env.GITHUB_CLIENT_SECRET}`,
            null,
            {
                headers: {
                    Accept: "application/json", // Defines the type of return
                },
            }
        );

        const githubRes = accessTokenResponse.data;
        const { access_token } = githubRes;

        const userResponse = await axios.get("https://api.github.com/user", {
            headers: {
                Authorization: `Bearer ${access_token}`,
            },
        });

        const userSchema = z.object({
            id: z.number(),
            login: z.string(),
            name: z.string(),
            avatar_url: z.string().url(),
        });

        const userInfo = userSchema.parse(userResponse.data);

        let user = await prismaClient.user.findUnique({
            where: {
                githubId: userInfo.id,
            },
        });

        if (!user) {
            user = await prismaClient.user.create({
                data: {
                    githubId: userInfo.id,
                    login: userInfo.login,
                    name: userInfo.name,
                    avatarUrl: userInfo.avatar_url,
                },
            });
        }

        const token = app.jwt.sign(
            {
                name: user.name,
                avatar_url: user.avatarUrl,
            },
            {
                sub: user.id,
                expiresIn: "30 days",
            }
        );

        return { token };
    });
}
