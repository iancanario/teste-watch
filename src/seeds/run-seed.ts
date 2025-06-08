import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { seedAdmin } from './admin.seed';

config(); // Load environment variables

// Validate required environment variables
const requiredEnvVars = ['DB_HOST', 'DB_PORT', 'DB_USER', 'DB_PASS', 'DB_NAME'];
const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingEnvVars.length > 0) {
  console.error('Missing required environment variables:', missingEnvVars.join(', '));
  process.exit(1);
}

async function runSeed() {
  const dataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5432'),
    username: process.env.DB_USER,
    password: String(process.env.DB_PASS), // Ensure password is a string
    database: process.env.DB_NAME,
    entities: ['src/**/*.entity.ts'],
    synchronize: true, // Be careful with this in production
    ssl: process.env.DB_SSL === 'true' ? {
      rejectUnauthorized: false
    } : false
  });

  try {
    console.log('Attempting to connect to database...');
    console.log('Database config:', {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      username: process.env.DB_USER,
      database: process.env.DB_NAME,
      ssl: process.env.DB_SSL === 'true'
    });

    await dataSource.initialize();
    console.log('Database connection established');

    await seedAdmin(dataSource);
    
    await dataSource.destroy();
    console.log('Seed completed successfully');
  } catch (error) {
    console.error('Error during seed:', error);
    if (error instanceof Error) {
      console.error('Error details:', error.message);
    }
    process.exit(1);
  }
}

runSeed(); 