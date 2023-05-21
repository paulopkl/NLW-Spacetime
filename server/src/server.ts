import fastify from "fastify";
import { memoriesRoutes } from "./routes/memories";
import cors from "@fastify/cors";
import multipart from "@fastify/multipart";
import jwt from "@fastify/jwt";
import "dotenv/config";
import { authRoutes } from "./routes/auth";
import { uploadRoutes } from "./routes/upload";
import { resolve } from "path";

const app = fastify();

app.register(multipart);
app.register(require("@fastify/static"), {
    root: resolve(__dirname, "..", "uploads"),
    prefix: "/uploads/",
});
app.register(cors, {
    origin: true, // ["http://meu-site.com", "..."]
});
app.register(jwt, {
    secret: "spacetime", // Token is always signed with this secret
});
app.register(memoriesRoutes);
app.register(uploadRoutes);
app.register(authRoutes);

const port = 3333;
app.listen({
    port,
    host: "0.0.0.0",
}).then(() => console.log(`HTTP Server running on http://localhost:${port}`));
