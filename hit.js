import { createClient } from 'redis';

// Vercel'e Redis entegrasyonunu ekleyip projene bağladığında
// REDIS_URL env değişkeni otomatik olarak eklenir.
let client;

async function getClient() {
  if (!client) {
    client = createClient({ url: process.env.REDIS_URL });
    client.on('error', (err) => console.error('Redis error', err));
  }
  if (!client.isOpen) {
    await client.connect();
  }
  return client;
}

export default async function handler(req, res) {
  try {
    const redis = await getClient();
    const count = await redis.incr('bilgisayar-xi-visits');
    res.status(200).json({ value: count });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Sayaç okunamadı' });
  }
}
