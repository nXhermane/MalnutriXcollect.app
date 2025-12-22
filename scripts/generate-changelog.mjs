#!/usr/bin/env bun

import { execSync } from 'child_process';
import fs from 'fs';

// Get the latest two tags
const tagsRaw = execSync('git tag --sort=-v:refname', { encoding: 'utf-8' });
const tags = tagsRaw.trim().split('\n').filter(tag => tag.length > 0);

const date = new Date().toISOString().split('T')[0];
let newEntry = '';

if (tags.length < 2) {
  console.warn('Not enough tags to generate full changelog. Creating initial entry.');
  
  const currentTag = tags[0] || 'v1.0.0-beta.1';
  const isBeta = currentTag.includes('-beta');
  
  // Get all commits if this is the first tag
  let commits = '';
  try {
    commits = execSync(
      `git log --pretty=format:"%h - %s (%an)"`,
      { encoding: 'utf-8' }
    );
  } catch (error) {
    commits = 'Initial release';
  }
  
  newEntry = `
## [${currentTag}] - ${date}
${commits ? commits.split('\n').map(line => `- ${line}`).join('\n') : '- Initial beta release'}
`;
} else {
  const [latestTag, previousTag] = tags;
  
  console.log(`Generating changelog between ${previousTag} and ${latestTag}`);
  
  // Fetch commits between tags
  const commits = execSync(
    `git log --pretty=format:"%h - %s (%an)" ${previousTag}..${latestTag}`,
    { encoding: 'utf-8' }
  );
  
  const isBeta = latestTag.includes('-beta');
  
  newEntry = `
## [${latestTag}] - ${date}
${commits.split('\n').filter(line => line.length > 0).map(line => `- ${line}`).join('\n')}
`;
}

// Read existing changelog if it exists
let existingChangelog = '';
const changelogPath = 'CHANGELOG.md';

if (fs.existsSync(changelogPath)) {
  existingChangelog = fs.readFileSync(changelogPath, 'utf8');
  console.log('Existing CHANGELOG.md found, prepending new entry...');
} else {
  console.log('Creating new CHANGELOG.md...');
  // Add header for new changelog
  existingChangelog = `# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).
`;
}

// Prepend new entry to existing changelog
const updatedChangelog = existingChangelog.includes('# Changelog')
  ? existingChangelog.replace(
      /# Changelog[\s\S]*?\n\n/,
      `# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).
${newEntry}
`
    )
  : `${newEntry}\n${existingChangelog}`;

// Write updated changelog
fs.writeFileSync(changelogPath, updatedChangelog);

console.log('✅ Changelog updated successfully!');