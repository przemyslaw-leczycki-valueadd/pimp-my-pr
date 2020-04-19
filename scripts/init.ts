import { config } from 'dotenv';
import * as fs from 'fs';

config();

const { GITHUB_CLIENT_ID, GITLAB_CLIENT_ID, GITLAB_CLIENT_SECRET } = process.env;

function initPmpWebEnvironment(): void {
  const devEnvironmentFile = 'libs/pmp-web/core/src/lib/environment/environment.ts';
  const prodEnvironmentFile = 'libs/pmp-web/core/src/lib/environment/environment.prod.ts';

  fs.copyFileSync(
    'libs/pmp-web/core/src/lib/environment/environment.sample.ts',
    devEnvironmentFile
  );
  fs.copyFileSync(
    'libs/pmp-web/core/src/lib/environment/environment.prod.sample.ts',
    prodEnvironmentFile
  );

  replaceInFile('{{githubClientId}}', GITHUB_CLIENT_ID, devEnvironmentFile);
  replaceInFile('{{githubClientId}}', GITHUB_CLIENT_ID, prodEnvironmentFile);
  replaceInFile('{{gitlabClientId}}', GITLAB_CLIENT_ID, devEnvironmentFile);
  replaceInFile('{{gitlabClientId}}', GITLAB_CLIENT_ID, prodEnvironmentFile);
  replaceInFile('{{gitlabClientSecret}}', GITLAB_CLIENT_SECRET, devEnvironmentFile);
  replaceInFile('{{gitlabClientSecret}}', GITLAB_CLIENT_SECRET, prodEnvironmentFile);
}

function replaceInFile(from: string, to: string, file: string): void {
  const fileContent = fs.readFileSync(file, 'utf8');
  const newContent = fileContent.replace(from, to);

  fs.writeFileSync(file, newContent, 'utf8');
}

initPmpWebEnvironment();
