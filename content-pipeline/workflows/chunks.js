export const meta = {
  name: 'quran-grammar-chunks',
  description: 'Author Urdu grammar lessons per chunk for Surahs 18, 23, 32, 36, 55 and double-verify each chunk',
  phases: [
    { title: 'Author', detail: 'one author per chunk writes every word, ayah and phrase' },
    { title: 'Verify', detail: 'two independent reviewers: grammar lens and meaning/tafsir lens' },
    { title: 'Fix', detail: 'fixer applies verified corrections and re-validates' },
    { title: 'Confirm', detail: 'fresh full review of the fixed chunk; loops while serious issues remain' },
  ],
}

// Absolute path of this folder; pass args.work when the repository lives elsewhere.
const W = (args && args.work) || '/Users/me/Projects/quran-grammar/content-pipeline'
const PRE = `You are one agent in a multi-agent pipeline that writes Urdu grammar lessons for the Quran Grammar app (repository /Users/me/Projects/quran-grammar). Work only inside ${W}. The ONLY file you may create or change is the chunk file named in your task, and only if your role is author or fixer; reviewers change no files. Never modify anything in meta/, libs/, packets/, scripts/, guide/ or another chunk — report shared-data problems in your result instead. Never edit other repository files, never run git, and do not use the network. Everything you need is in the files named below — do not explore other scripts or repository files. Read ${W}/guide/authoring-guide.md completely before anything else; it is the binding style and accuracy guide. These lessons teach the Quran to Urdu-speaking learners: accuracy matters more than speed.`

const AUTHOR = {
  type: 'object',
  properties: {
    validatorOk: { type: 'boolean' },
    words: { type: 'integer' },
    ayahs: { type: 'integer' },
    notes: { type: 'string' },
  },
  required: ['validatorOk', 'words', 'ayahs', 'notes'],
}
const ISSUE = {
  type: 'object',
  properties: {
    ref: { type: 'string', description: 'word id like 18:1:2, ayah key like 18:1, or 18:1 phrase 2' },
    field: { type: 'string' },
    severity: { type: 'string', enum: ['critical', 'major', 'minor'] },
    problem: { type: 'string' },
    fix: { type: 'string', description: 'exact replacement text whenever possible' },
  },
  required: ['ref', 'field', 'severity', 'problem', 'fix'],
}
const ISSUES = {
  type: 'object',
  properties: {
    checkedWords: { type: 'integer' },
    checkedAyahs: { type: 'integer' },
    issues: { type: 'array', items: ISSUE },
    libraryIssues: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          kind: { type: 'string', enum: ['lexeme', 'root', 'rule'] },
          key: { type: 'string' },
          problem: { type: 'string' },
          fix: { type: 'string' },
        },
        required: ['kind', 'key', 'problem', 'fix'],
      },
    },
    summary: { type: 'string' },
  },
  required: ['checkedWords', 'checkedAyahs', 'issues', 'libraryIssues', 'summary'],
}
const FIXED = {
  type: 'object',
  properties: {
    validatorOk: { type: 'boolean' },
    applied: { type: 'integer' },
    rejected: {
      type: 'array',
      items: {
        type: 'object',
        properties: { ref: { type: 'string' }, field: { type: 'string' }, reason: { type: 'string' } },
        required: ['ref', 'field', 'reason'],
      },
    },
    notes: { type: 'string' },
  },
  required: ['validatorOk', 'applied', 'rejected', 'notes'],
}

const SEVERITY = `Severity: critical = corrupted or misquoted Quranic Arabic; a translation/tafsir that misstates the meaning or creed; wrong case, mood, voice, verb form, word class or syntactic role; wrong lexical meaning. major = incomplete translation (a clause dropped), a tafsir detail not supported by the provided tafsir, an inaccurate morphology/syntax detail, a wrong or missing important rule id, a verb note inconsistent with its lexeme entry, a phrase misanalysed. minor = wording, Urdu spelling, clarity, length. Give an exact replacement in "fix" whenever possible. Report only problems you can justify from the packet or established Arabic grammar — do not pad the list; an empty list is a valid result. If a shared library entry (lexeme paradigm, root entry or rule) is wrong, report it under libraryIssues (do not report it as a chunk issue).`

function paths(chunk) {
  const surah = chunk.split('-')[0]
  return {
    chunk,
    packet: `${W}/packets/${surah}/${chunk}.json`,
    file: `${W}/chunks/${surah}/${chunk}.json`,
    rules: `${W}/libs/rules.json`,
    validate: `python3 -I ${W}/scripts/validate_chunk.py ${W} ${chunk}`,
  }
}

function authorPrompt(p) {
  return `${PRE}

TASK: author lesson chunk ${p.chunk}.
Inputs:
1. Packet ${p.packet}: plannedAyahs and plannedWordIds; for every word the exact Quranic text (arabic), QAC segments/features, qacMorphologyEnglish, qacIrabArabic, the derived pos and root, English glosses; for every ayah the QAC grammar notes, two English translations and three tafsir texts (Muyassar, Sa'di, Ibn Kathir abridged); the verified verb-paradigm entries (lexemes, keyed by each verb word's lexemeKey) and root entries for this chunk; the previous and next ayah for context.
2. Rule library ${p.rules}: use only these ids, following each rule's appliesWhenEnglish.
Write ${p.file} exactly in the guide's JSON format. Work ayah by ayah; before writing each word, read its QAC segments, qacMorphologyEnglish and qacIrabArabic. Every verb's verbNoteUrdu must agree with its lexeme entry and the occurrence's QAC aspect, mood, voice and person. Copy Arabic quotations exactly from the packet's arabic strings.
Then run: ${p.validate}
Fix every error and re-run until it passes; take warnings seriously. Finally re-read the whole file once against the guide's accuracy checklist and correct anything wrong.
Return validatorOk, the numbers of words and ayahs written, and notes on alternative analyses or uncertainties.`
}

function grammarReview(p) {
  return `${PRE}

You are REVIEWER 1 — GRAMMAR (صرف و نحو) — for lesson chunk ${p.chunk}. Authored file: ${p.file}. Sources: packet ${p.packet}. Rule library: ${p.rules}.
Check EVERY word field by field against the packet:
- morphologyUrdu: word class, derivation/pattern, gender, number, case or mood with its sign, definiteness, voice, verb form, attached pronouns — must match the QAC segments/features and qacMorphologyEnglish.
- syntaxUrdu: the i‘rab role must agree with qacIrabArabic and the ayah's qacGrammarNotesArabic (or be an explicitly flagged, recognised alternative).
- posUrdu (correct make-up, names the word type), lemma (correct citation form with vowels; verbs: active 3rd-person masculine singular perfect), segments (correct division, roles and piece meanings), ruleIds (each rule's appliesWhenEnglish holds; no important applicable rule missing).
- verbNoteUrdu: consistent with the lexeme entry and with this occurrence's aspect, mood (and its cause), voice, person/number/gender and pronouns.
- phrases: constructions correctly identified, labelled and explained; every word covered.
- Arabic quoted inside Urdu text must match the packet's arabic strings exactly.
Also run ${p.validate}.
${SEVERITY}`
}

function meaningReview(p) {
  return `${PRE}

You are REVIEWER 2 — MEANING, TAFSIR AND URDU — for lesson chunk ${p.chunk}. Authored file: ${p.file}. Sources: packet ${p.packet}.
Check:
- meaningUrdu of every word: the correct contextual meaning (compare both English glosses and the translations), including attached particles/pronouns.
- dictionaryUrdu of every word: lexically correct, consistent with the root entry, no invented etymology.
- translationUrdu of every ayah: complete (no clause dropped), faithful, fluent; address forms per the guide (آپ for the Prophet ﷺ, تم for people, ہم for the divine plural); consistent with the meaning of Sahih International and Taqi Usmani.
- tafsirUrdu: every statement supported by the provided tafsir texts; no invented narrations, names, numbers or stories; no single view presented as the only one where the sources differ; mainstream Sunni presentation; original wording, not a sentence-by-sentence translation.
- themeUrdu apt; phrase explanations clear.
- Urdu quality everywhere: correct spelling with Urdu letters (ی ک ہ ے), grammar, natural phrasing, terminology per the guide.
- Every Arabic quotation inside Urdu text matches the packet's arabic strings exactly.
Also run ${p.validate}.
${SEVERITY}`
}

function fixPrompt(p, issues, round) {
  return `${PRE}

You are the FIXER (round ${round}) for lesson chunk ${p.chunk}. File: ${p.file}. Sources: packet ${p.packet}; rules ${p.rules}.
Reviewers reported the issues below. For each one, verify it yourself against the packet and established Arabic grammar. If correct, apply it (improve the replacement if it is itself flawed or would break consistency with other fields). If wrong, leave the file unchanged for it and record a precise reason. Never introduce new errors, never change unrelated text, and keep the JSON structure, ids and order intact. When you change one field, update any other field of the same word/ayah that would otherwise contradict it.
Then run: ${p.validate}  — fix every error until it passes.

Issues:
${JSON.stringify(issues, null, 1)}

Return validatorOk, how many fixes you applied, the rejected issues with reasons, and short notes.`
}

function confirmPrompt(p, issues, fixed, round) {
  return `${PRE}

You are the CONFIRMING REVIEWER (round ${round}) for lesson chunk ${p.chunk}. File: ${p.file}. Sources: packet ${p.packet}; rules ${p.rules}.
1. Check that every accepted fix below was applied correctly and introduced no new error or contradiction.
2. Judge every rejection: if the rejected issue is in fact valid, report it again.
3. With fresh eyes, re-check EVERY word and ayah in the file across both lenses — grammar (morphology, syntax, segments, lemma, ruleIds, verb notes, phrases) and meaning (word meanings, dictionary notes, translations, tafsir, Urdu quality, exact Arabic quotations).
Run ${p.validate} too.

Previously reported issues: ${JSON.stringify(issues, null, 1)}
Fixer result: ${JSON.stringify(fixed, null, 1)}

${SEVERITY}`
}

async function runChunk(chunk) {
  const p = paths(chunk)
  const blockingReasons = []
  const libraryIssues = []
  const confirms = []
  const issues = []
  const count = (list, sev) => list.filter((x) => x.severity === sev).length
  const validAuthor = (r) => r?.validatorOk === true && Number.isSafeInteger(r.words) && r.words > 0
    && Number.isSafeInteger(r.ayahs) && r.ayahs > 0
  const validReview = (r) => r && Array.isArray(r.issues) && Array.isArray(r.libraryIssues)
    && r.checkedWords === authored.words && r.checkedAyahs === authored.ayahs
  const result = (authored, fixed, lastFix) => ({
    chunk,
    status: blockingReasons.length ? 'blocked' : 'ai-reviewed',
    scholarlyReview: 'pending',
    blockingReasons,
    authored,
    reviewIssues: issues.length,
    reviewCritical: count(issues, 'critical'),
    reviewMajor: count(issues, 'major'),
    fix1: fixed ? { applied: fixed.applied, rejected: fixed.rejected.length, validatorOk: fixed.validatorOk } : null,
    confirms,
    finalFix: lastFix === fixed ? null : lastFix,
    libraryIssues,
  })
  let authored = await agent(authorPrompt(p), { label: `${chunk}:author`, phase: 'Author', schema: AUTHOR })
  if (!validAuthor(authored)) {
    authored = await agent(
      `${authorPrompt(p)}\n\nA previous attempt may have left ${p.file} incomplete or invalid. Inspect it, keep what is correct, finish or repair it, and make the validator pass.`,
      { label: `${chunk}:author-retry`, phase: 'Author', schema: AUTHOR },
    )
  }
  if (!validAuthor(authored)) {
    blockingReasons.push('Author did not produce a validated chunk')
    return result(authored, null, null)
  }
  const reviews = await parallel([
    () => agent(grammarReview(p), { label: `${chunk}:verify-grammar`, phase: 'Verify', schema: ISSUES }),
    () => agent(meaningReview(p), { label: `${chunk}:verify-meaning`, phase: 'Verify', schema: ISSUES }),
  ])
  reviews.forEach((r, i) => {
    if (!validReview(r)) {
      blockingReasons.push(`Missing or malformed ${i === 0 ? 'grammar' : 'meaning'} review`)
      return
    }
    issues.push(...r.issues.map((x) => ({ ...x, reviewer: i === 0 ? 'grammar' : 'meaning' })))
    libraryIssues.push(...r.libraryIssues)
  })
  if (blockingReasons.length) return result(authored, null, null)
  let fixed = { validatorOk: true, applied: 0, rejected: [], notes: 'no issues reported' }
  if (issues.length) {
    fixed = await agent(fixPrompt(p, issues, 1), { label: `${chunk}:fix-1`, phase: 'Fix', schema: FIXED, effort: 'high' })
  }
  if (!fixed || fixed.validatorOk !== true || !Array.isArray(fixed.rejected)) {
    blockingReasons.push('Initial fixer did not produce a validated result')
    return result(authored, null, null)
  }
  let lastIssues = issues
  let lastFix = fixed
  const maxRounds = Number.isSafeInteger(args?.maxConfirmRounds) && args.maxConfirmRounds > 0
    ? Math.min(args.maxConfirmRounds, 10) : 3
  let confirmed = false
  for (let round = 1; round <= maxRounds; round++) {
    const confirm = await agent(confirmPrompt(p, lastIssues, lastFix, round), {
      label: `${chunk}:confirm-${round}`,
      phase: 'Confirm',
      schema: ISSUES,
    })
    if (!validReview(confirm)) {
      blockingReasons.push(`Missing or malformed confirmation round ${round}`)
      break
    }
    libraryIssues.push(...confirm.libraryIssues)
    confirms.push({ round, issues: confirm.issues })
    if (!confirm.issues.length) {
      confirmed = true
      break
    }
    // Never finish on an unconfirmed edit, including fixes of minor findings.
    if (round === maxRounds) break
    lastFix = await agent(fixPrompt(p, confirm.issues, round + 1), {
      label: `${chunk}:fix-${round + 1}`,
      phase: 'Fix',
      schema: FIXED,
      effort: 'high',
    })
    if (!lastFix || lastFix.validatorOk !== true || !Array.isArray(lastFix.rejected)) {
      blockingReasons.push(`Fixer after confirmation round ${round} failed validation`)
      break
    }
    lastIssues = confirm.issues
  }
  if (!confirmed) blockingReasons.push('No clean confirmation of the final chunk')
  if (libraryIssues.length) blockingReasons.push('Shared library findings require adjudication')
  log(
    `${chunk}: review ${issues.length} (${count(issues, 'critical')} critical, ${count(issues, 'major')} major); confirm rounds ${confirms
      .map((c) => c.issues.length)
      .join('/')}`,
  )
  return result(authored, fixed, lastFix)
}

const chunks = (args && args.chunks) || []
log(`Running ${chunks.length} chunks`)
const results = await parallel(chunks.map((c) => () => runChunk(c)))
return { results }
