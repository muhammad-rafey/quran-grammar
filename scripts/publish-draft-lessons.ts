import { createHash } from 'node:crypto';
import { readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { isStudyData } from '../packages/core/src/validate';

// Superseded (2026-11-26): lessons are packages/core/data/lessons/surah-N.json, built for all 114
// Surahs by content-pipeline/full-quran (which carries the published lessons' grammar layer over).
// The TypeScript lesson modules this script wrote (packages/core/src/lessons/) no longer exist, so
// it refuses to run; the original implementation is kept below for reference.
console.error(
  'npm run publish:drafts is superseded by content-pipeline/full-quran.\n' +
    'Lessons now live in packages/core/data/lessons/surah-N.json; packages/core/src/lessons/ was removed.\n' +
    'Rebuild them with: python3 -I content-pipeline/full-quran/scripts/build.py content-pipeline/full-quran assemble .\n' +
    'See content-pipeline/full-quran/README.md. Nothing was written.',
);
process.exit(1);

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const authorization = JSON.parse(
  await readFile(resolve(root, 'content-pipeline/draft-publication.json'), 'utf8'),
) as {
  status: string;
  scholarlyReview: string;
  surahs: Array<{ number: number; contentSha256: string; studySha256: string; work?: string }>;
};
// Each entry's drafts live in its pipeline work directory (default: the original five-Surah folder).
const workDir = (entry: { work?: string }) => {
  const work = entry.work ?? 'content-pipeline';
  if (!/^content-pipeline(\/[a-z0-9-]+)?$/.test(work)) throw new Error(`Invalid work directory: ${work}`);
  return work;
};
if (authorization.status !== 'owner-authorized-draft-publication' || authorization.scholarlyReview !== 'pending')
  throw new Error('Explicit draft-publication authorization is required.');

// Validate the entire authorized snapshot before writing any runtime file.
const outputs = await Promise.all(authorization.surahs.map(async (entry) => {
  const wrapper = JSON.parse(await readFile(resolve(root, `${workDir(entry)}/drafts/surah-${entry.number}.json`), 'utf8'));
  if (wrapper.reviewStatus !== 'scholarly-review-pending' || wrapper.contentSha256 !== entry.contentSha256 || !isStudyData(wrapper.study))
    throw new Error(`Surah ${entry.number}: missing, invalid or changed review snapshot.`);
  const json = JSON.stringify(wrapper.study, null, 2);
  const digest = createHash('sha256').update(JSON.stringify(wrapper.study)).digest('hex');
  if (wrapper.study.surah.number !== entry.number || digest !== entry.studySha256)
    throw new Error(`Surah ${entry.number}: content differs from the owner-authorized draft.`);
  return {
    path: resolve(root, `packages/core/src/lessons/surah-${entry.number}.ts`),
    source: `// Owner-authorized published draft; scholarly review is still pending.\n// Provenance: content-pipeline/draft-publication.json and ${workDir(entry).replace(/^content-pipeline\/?/, '')}${entry.work ? '/' : ''}drafts/surah-${entry.number}.json\nimport type { StudyData } from '../types';\n\nexport const study${entry.number}: StudyData = ${json};\n`,
  };
}));
for (const output of outputs) await writeFile(output.path, output.source);
console.log(`Published ${outputs.length} exact draft snapshots; no scholarly approvals were changed.`);
