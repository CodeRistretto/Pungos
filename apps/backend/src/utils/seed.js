import 'dotenv/config';
import mongoose from 'mongoose';
import UGCEvent from '../models/UGCEvent.js';

async function run() {
  await mongoose.connect(process.env.MONGODB_URI, { dbName: 'pungos' });
  console.log('Mongo conectado');

  await UGCEvent.deleteMany({}); // limpiar demo

  const names = ['Ana', 'Carlos', 'Lupita', 'Jorge', 'María', 'Leo'];
  const nets = ['instagram', 'tiktok', 'google'];

  const docs = Array.from({ length: 18 }).map((_, i) => ({
    user: { name: names[i % names.length], email: `user${i}@test.com` },
    businessId: 'demo-biz',
    network: nets[i % nets.length],
    postUrl: 'https://instagram.com/p/abc123',
    postId: `post_${1000 + i}`,
    mediaType: 'image',
    evidenceUrl: `https://picsum.photos/seed/ugc-${i}/800/500`,
    status: 'pending',
    detectedAt: new Date(Date.now() - i * 3600e3),
  }));

  await UGCEvent.insertMany(docs);
  console.log(`Seed OK: ${docs.length} UGC pending`);
  await mongoose.disconnect();
}
run().catch((e) => {
  console.error(e);
  process.exit(1);
});
