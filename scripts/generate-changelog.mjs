#!/usr/bin/env bun

import { execSync } from 'child_process';
import fs from 'fs';

const pkg = JSON.parse(fs.readFileSync('package.json', 'utf-8'));
const newVersion = pkg.version;
const newTag = `v${newVersion}`;

let tagsRaw = '';
try {
  tagsRaw = execSync('git tag --sort=-v:refname', { encoding: 'utf-8' });
} catch (_) {
  tagsRaw = '';
}

const tags = tagsRaw
  .trim()
  .split('\n')
  .filter((tag) => tag.length > 0);
const latestGitTag = tags[0];

const date = new Date().toISOString().split('T')[0];
console.log(`Generating changelog for upcoming release ${newTag}...`);

const range = latestGitTag ? `${latestGitTag}..HEAD` : '';

let rawGitLog = '';
try {
  const logCmd = range
    ? `git log ${range} --pretty=format:"%h - %s (%an)%n%b%n---COMMIT_DELIMITER---"`
    : `git log --pretty=format:"%h - %s (%an)%n%b%n---COMMIT_DELIMITER---"`;
  rawGitLog = execSync(logCmd, { encoding: 'utf-8' });
} catch (error) {
  console.warn('Could not fetch git log.', error.message);
}

function formatCommits(rawLog) {
  if (!rawLog) return '- Initial release or no readable commits';

  const blocks = rawLog
    .split('---COMMIT_DELIMITER---')
    .map((c) => c.trim())
    .filter(Boolean);

  if (blocks.length === 0) return '- No notable changes.';

  return blocks
    .map((block) => {
      const lines = block.split('\n').filter((l) => l.trim().length > 0);
      if (lines.length === 0) return '';

      const subject = lines[0];
      const body = lines.slice(1);

      let formatted = `- **${subject}**`;
      if (body.length > 0) {
        formatted += '\n' + body.map((line) => `  > ${line}`).join('\n');
      }
      return formatted;
    })
    .filter(Boolean)
    .join('\n\n');
}

const formattedCommits = formatCommits(rawGitLog);

const newEntry = `## [${newTag}] - ${date}\n\n${formattedCommits}\n`;

let existingChangelog = '';
const changelogPath = 'CHANGELOG.md';

if (fs.existsSync(changelogPath)) {
  existingChangelog = fs.readFileSync(changelogPath, 'utf8');
} else {
  existingChangelog = `# Changelog\n\nAll notable changes to this project will be documented in this file.\n\nThe format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),\nand this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).\n`;
}

const updatedChangelog = existingChangelog.includes('# Changelog')
  ? existingChangelog.replace(
      /# Changelog[\s\S]*?\n(\n)?/,
      `# Changelog\n\nAll notable changes to this project will be documented in this file.\n\nThe format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),\nand this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).\n\n${newEntry}\n`,
    )
  : `${newEntry}\n${existingChangelog}`;

fs.writeFileSync(changelogPath, updatedChangelog);
console.log('✅ Changelog updated successfully!');

// Write release notes for the current version only (used as GitHub release body)
const releaseNotesPath = 'RELEASE_NOTES.md';
fs.writeFileSync(releaseNotesPath, newEntry);
console.log(`✅ Release notes written to ${releaseNotesPath}`);
