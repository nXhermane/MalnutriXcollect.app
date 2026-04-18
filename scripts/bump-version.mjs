#!/usr/bin/env bun

import { execSync } from 'child_process';
import fs from 'fs';

function run(cmd) {
  return execSync(cmd, { encoding: 'utf-8' }).trim();
}

function setOutput(key, value) {
  const outputFile = process.env.GITHUB_OUTPUT;
  if (outputFile) {
    fs.appendFileSync(outputFile, `${key}=${value}\n`);
  } else {
    console.log(`OUTPUT: ${key}=${value}`);
  }
}

function parseSemVer(version) {
  const match = version.match(/^(\d+)\.(\d+)\.(\d+)(?:-beta\.(\d+))?$/);
  if (match) {
    return {
      major: Number(match[1]),
      minor: Number(match[2]),
      patch: Number(match[3]),
      beta: match[4] ? Number(match[4]) : null,
      isBeta: !!match[4],
    };
  }
  return { major: 1, minor: 0, patch: 0, beta: 1, isBeta: true };
}

let latestTag = '';
try {
  latestTag = run('git describe --tags --abbrev=0');
} catch {
  latestTag = '';
}

const range = latestTag ? `${latestTag}..HEAD` : 'HEAD';
let rawCommits = '';
try {
  rawCommits = run(`git log ${range} --pretty=format:"%B%n---COMMIT_DELIMITER---"`);
} catch (e) {
  console.log('Error fetching git log.', e.message);
}

if (!rawCommits || rawCommits.trim() === '---COMMIT_DELIMITER---') {
  console.log('No new commits since last tag. Skipping release.');
  setOutput('bumped', 'false');
  setOutput('new_tag', latestTag || 'v1.0.0');
  process.exit(0);
}

const commits = rawCommits
  .split('---COMMIT_DELIMITER---')
  .map((c) => c.trim())
  .filter(Boolean);
console.log(`Found ${commits.length} commit(s) since ${latestTag || 'beginning'}`);

let bumpType = null;

for (const msg of commits) {
  const isBreaking = msg.includes('!:') || /BREAKING CHANGE:/i.test(msg);
  const typeMatch = msg.match(
    /^(feat|fix|perf|refactor|chore|style|test|build|ci|docs)(\([^)]+\))?!?:/,
  );

  if (isBreaking) {
    bumpType = 'major';
    break;
  } else if (typeMatch) {
    const type = typeMatch[1];
    if (type === 'feat' && bumpType !== 'major') {
      bumpType = 'minor';
    } else if (!bumpType) {
      bumpType = 'patch';
    }
  }
}

const pkg = JSON.parse(fs.readFileSync('package.json', 'utf-8'));
const currentVersion = pkg.version || '1.0.0';
const parsed = parseSemVer(currentVersion);

let branch = process.env.GITHUB_REF_NAME;
if (!branch) {
  try {
    branch = run('git rev-parse --abbrev-ref HEAD');
    if (branch === 'HEAD') throw new Error('Detached HEAD');
  } catch {
    branch = 'main';
  }
}

const targetIsBeta = branch === 'beta';
let newVersion;

if (targetIsBeta) {
  if (parsed.isBeta) {
    newVersion = `${parsed.major}.${parsed.minor}.${parsed.patch}-beta.${parsed.beta + 1}`;
  } else {
    if (!bumpType) bumpType = 'patch';
    if (bumpType === 'major') newVersion = `${parsed.major + 1}.0.0-beta.1`;
    else if (bumpType === 'minor') newVersion = `${parsed.major}.${parsed.minor + 1}.0-beta.1`;
    else newVersion = `${parsed.major}.${parsed.minor}.${parsed.patch + 1}-beta.1`;
  }
} else {
  if (!bumpType) {
    console.log('No releasable commits found. Skipping.');
    setOutput('bumped', 'false');
    setOutput('new_tag', latestTag || `v${currentVersion}`);
    process.exit(0);
  }

  if (parsed.isBeta) {
    if (bumpType === 'major') newVersion = `${parsed.major + 1}.0.0`;
    else if (bumpType === 'minor') newVersion = `${parsed.major}.${parsed.minor + 1}.0`;
    else newVersion = `${parsed.major}.${parsed.minor}.${parsed.patch}`;
  } else {
    if (bumpType === 'major') newVersion = `${parsed.major + 1}.0.0`;
    else if (bumpType === 'minor') newVersion = `${parsed.major}.${parsed.minor + 1}.0`;
    else newVersion = `${parsed.major}.${parsed.minor}.${parsed.patch + 1}`;
  }
}

const newTag = `v${newVersion}`;
console.log(
  `Bumping (${bumpType ?? 'beta-increment'}): ${currentVersion} → ${newVersion} on branch ${branch}`,
);

pkg.version = newVersion;
fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2) + '\n');

let appConfig = fs.readFileSync('app.config.ts', 'utf-8');
appConfig = appConfig.replace(/version:\s*['"][^'"]+['"]/, `version: '${newVersion}'`);
fs.writeFileSync('app.config.ts', appConfig);

console.log(`✅ Version bumped to ${newVersion}`);
setOutput('bumped', 'true');
setOutput('new_tag', newTag);
setOutput('is_beta', targetIsBeta ? 'true' : 'false');
