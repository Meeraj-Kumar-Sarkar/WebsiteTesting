import app from './app.js';
import { config } from './config/index.js';
import { runMigrations } from './database/migrate.js';
import { store } from './database/db.js';
import { seedDatabase } from './database/seed.js';

async function bootstrap() {
  try {
    // 1. Run migrations if PostgreSQL configured
    await runMigrations();

    // 2. If store has no users, automatically seed demo baseline
    if (store.get('users').length === 0) {
      await seedDatabase();
    }

    // 3. Start Express HTTP Server
    const server = app.listen(config.port, () => {
      console.log('====================================================');
      console.log(`🏔️  MOUNTAIN AND MEMORIES CENTRAL BUSINESS API`);
      console.log(`🚀  Server running on http://localhost:${config.port}`);
      console.log(`🌐  CORS enabled for origins: ${config.corsOrigins.join(', ')}`);
      console.log(`🔑  Master Admin: EMP-1001 (admin@mountainandmemories.com / Password@123)`);
      console.log('====================================================');
    });

    return server;
  } catch (err) {
    console.error('Fatal initialization error:', err);
    process.exit(1);
  }
}

bootstrap();
