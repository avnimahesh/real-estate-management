import FastifyCors from "@fastify/cors";

export const setFastifyCors = function (fastify) {
  fastify.register(FastifyCors, {
    // put your options here
    origin: [
      "http://localhost:9000",
      "http://localhost:8100",
      "http://54.67.78.130:4200",
    ],
  });
};
