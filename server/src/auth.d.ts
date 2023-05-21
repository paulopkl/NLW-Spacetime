import "@fastify/jwt";
declare module "@fastify/jwt" {
    interface FastifyJWT {
        payload: {
            name: string;
            avatar_url: string;
        };
        user: {
            sub: string;
            name: string;
            avatar_url: string;
        };
    }
}
