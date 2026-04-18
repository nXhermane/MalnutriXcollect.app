#!/usr/bin/env bun

import { execSync } from 'child_process';
import fs from 'fs';

function setOutput(key, value) {
  const outputFile = process.env.GITHUB_OUTPUT;
  if (outputFile) {
    fs.appendFileSync(outputFile, `${key}=${value}\n`);
  } else {
    console.log(`OUTPUT: ${key}=${value}`);
  }
}

const args = process.argv.slice(2);
const version = args[0];
const platform = args[1] || 'android';

if (!version) {
  console.error('Error: Version argument is required.');
  process.exit(1);
}

try {
  console.log(`Fetching EAS builds for platform=${platform}...`);
  const stdout = execSync(
    `bunx eas-cli build:list --json --limit 15 --platform ${platform} --non-interactive`,
    { encoding: 'utf-8' },
  );

  const builds = JSON.parse(stdout);

  if (!Array.isArray(builds)) {
    throw new Error('EAS CLI did not return an array of builds.');
  }

  const expectedMessage = `release: v${version}`;

  const targetBuild = builds.find(
    (b) => b.appVersion === version || (b.message && b.message.includes(expectedMessage)),
  );

  if (!targetBuild) {
    console.log(`No matching build found for version ${version}.`);
    setOutput('build_status', 'NOT_FOUND');
    process.exit(0);
  }

  console.log(`Found build id=${targetBuild.id}, status=${targetBuild.status}`);
  setOutput('build_status', targetBuild.status);

  if (targetBuild.status === 'FINISHED') {
    const url = targetBuild.artifacts?.buildUrl || '';
    setOutput('artifact_url', url);
  }
} catch (error) {
  console.error('Failed to parse EAS builds json:', error.message);
  process.exit(1);
}
