import app from './app';
import { runMigration } from './database/migrate';
import { generateZod } from './utils/generate-zod';

const port = process.env.PORT || 2000;
const jsonSchemaPath = './schema.json';

async function bootstrap() {
  try {
    await runMigration(jsonSchemaPath);
  } catch (e) {
    console.log('Database not connected, skipping migration');
  }
  
  generateZod(jsonSchemaPath);
  
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
}

bootstrap();
