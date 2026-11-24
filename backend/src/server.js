import app from './app.js';
import { config } from './config/index.js';
import { runMigrations } from './database/migrate.js';
import { store } from './database/db.js';
import { seedDatabase } from './database/seed.js';

async function bootstrap() {
  try {
    // 1. Run migrations and sync if PostgreSQL is configured
    await runMigrations();
    await store.syncFromPostgres();

    // 2. Ensure baseline RBAC structure and Master Admin account exist
    await seedDatabase();

    // 3. Start Express HTTP Server
    const server = app.listen(config.port, () => {
      console.log('====================================================');
      console.log(`🏔️  MOUNTAIN AND MEMORIES CENTRAL BUSINESS API`);
      console.log(`🚀  Server running on http://localhost:${config.port}`);
      console.log(`🌐  CORS enabled for origins: ${config.corsOrigins.join(', ')}`);
      console.log(`🔑  Master Admin ID: ${config.masterAdmin.empId} (${config.masterAdmin.email})`);
      console.log('====================================================');
    });

    return server;
  } catch (err) {
    console.error('Fatal initialization error:', err);
    process.exit(1);
  }
}

bootstrap();
