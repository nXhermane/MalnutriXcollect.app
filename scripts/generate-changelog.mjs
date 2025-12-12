#!/usr/bin/env bun

import { execSync } from 'child_process';
import fs from 'fs';

// Get the latest two tags
const tagsRaw = execSync('git tag --sort=-v:refname', { encoding: 'utf-8' });
const tags = tagsRaw.trim().split('\n');

if (tags.length < 2) {
  console.warn('Not enough tags to generate changelog.');
  process.exit(0);
}

const [latestTag, previousTag] = tags;

console.log(`Generating changelog between ${previousTag} and ${latestTag}`);

// Fetch commits between tags
const commits = execSync(
  `git log --pretty=format:"%h - %s (%an)" ${previousTag}..${latestTag}`,
  { encoding: 'utf-8' }
);

// Format changelog entry
const date = new Date().toISOString().split('T')[0];
const isBeta = latestTag.includes('-beta');

const newEntry = `
## [${latestTag}] - ${date}
${commits.split('\n').map(line => `- ${line}`).join('\n')}
`;

// Read existing changelog
let changelog = '';
const changelogPath = 'CHANGELOG.md';

if (fs.existsSync(changelogPath)) {
  changelog = fs.readFileSync(changelogPath, 'utf8');
}

// Prepend new entry
const updatedChangelog = `${newEntry}\n${changelog}`;

fs.writeFileSync(changelogPath, updatedChangelog);

console.log('Changelog updated!');