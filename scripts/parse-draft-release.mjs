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

try {
  console.log('Fetching GitHub releases...');
  const stdout = execSync(`gh release list --json tagName,isDraft --limit 10`, {
    encoding: 'utf-8',
  });
  const releases = JSON.parse(stdout);

  if (!Array.isArray(releases)) {
    throw new Error('GH CLI did not return an array.');
  }

  const draftReleases = releases.filter((r) => r.isDraft === true);

  if (draftReleases.length === 0) {
    console.log('No draft releases found. Exiting.');
    setOutput('has_draft', 'false');
    process.exit(0);
  }

  const targetDraft = draftReleases[0];
  const tag = targetDraft.tagName;
  const version = tag.startsWith('v') ? tag.substring(1) : tag;

  console.log(`Found draft release for tag: ${tag} (version: ${version})`);
  setOutput('has_draft', 'true');
  setOutput('draft_tag', tag);
  setOutput('draft_version', version);
} catch (error) {
  console.error('Failed to parse GitHub releases json:', error.message);
  process.exit(1);
}
