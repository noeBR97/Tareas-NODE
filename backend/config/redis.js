import { createClient } from 'redis';

export const redisClient = createClient();

redisClient.on('connect', () => {
    console.log('🟢 Redis conectado');
});

redisClient.on('error', (err) => {
    console.error('🔴 Redis error', err);
});

await redisClient.connect();