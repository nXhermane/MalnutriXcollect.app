#!/usr/bin/env bun

import fs from 'fs';

// Read the commit message file
const commitMsgFile = process.argv[2];
const msg = fs.readFileSync(commitMsgFile, 'utf8').trim();

// Regex for conventional commits: <type>(<scope>): <description>
const conventionalRegex =
  /^(feat|fix|docs|style|refactor|test|chore)(\(.+\))?: .+/;

if (!conventionalRegex.test(msg)) {
  console.error(`
Invalid commit message format.

Expected format:
  <type>(<scope>): <description>

Examples:
  feat(auth): add login with Google
  fix(modal): prevent crash on close
  chore(deps): bump react to v19

See: https://www.conventionalcommits.org/
  `);
  process.exit(1);
}

console.log('✅ Valid commit message format');