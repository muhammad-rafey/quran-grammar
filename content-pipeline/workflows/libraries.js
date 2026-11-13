export const meta = {
  name: 'quran-grammar-libraries',
  description: 'Author and double-verify the shared grammar-rule, verb-paradigm and root libraries for an expansion edition',
  phases: [
    { title: 'Rules', detail: 'rule library: author, two independent verifiers, fix, confirm' },
    { title: 'Lexemes', detail: 'verb-paradigm batches: author, two verifiers, fix, confirm' },
    { title: 'Roots', detail: 'root-meaning batches: author, two verifiers, fix, confirm' },
  ],
}

// Absolute path of this folder; pass args.work when the repository lives elsewhere.
const W = (args && args.work) || '/Users/me/Projects/quran-grammar/content-pipeline'
// Human-readable Surah list of this work directory's edition (prompts only).
const SL = (args && args.surahLabel) || 'Surahs 18, 23, 32, 36, 55'
const PRE = `You are one agent in a multi-agent pipeline that builds Urdu grammar lessons for the Quran Grammar app (repository /Users/me/Projects/quran-grammar). Work only inside ${W}. Never edit any other repository file, never run git, and do not use the network. First read ${W}/guide/authoring-guide.md completely. For house style, read the existing lesson /Users/me/Projects/quran-grammar/packages/core/src/lessons/surah-108.ts (read-only) and ${W}/meta/style-exemplars.json. Accuracy matters more than speed: these explanations teach the Quran to learners.`

const AUTHOR = {
  type: 'object',
  properties: {
    validatorOk: { type: 'boolean' },
    count: { type: 'integer' },
    notes: { type: 'string' },
  },
  required: ['validatorOk', 'count', 'notes'],
}
const ISSUES = {
  type: 'object',
  properties: {
    checked: { type: 'integer' },
    issues: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          ref: { type: 'string' },
          field: { type: 'string' },
          severity: { type: 'string', enum: ['critical', 'major', 'minor'] },
          problem: { type: 'string' },
          fix: { type: 'string' },
        },
        required: ['ref', 'field', 'severity', 'problem', 'fix'],
      },
    },
    summary: { type: 'string' },
  },
  required: ['checked', 'issues', 'summary'],
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

const SEVERITY = `Severity: critical = factually wrong grammar/morphology/root/paradigm, wrong or misleading religious meaning, corrupted Arabic; major = inaccurate or incomplete statement, wrong tagging criterion, inconsistency with conventions or with a duplicate entry, missing coverage; minor = wording, spelling, clarity, length. Give an exact replacement text in "fix" whenever possible. Report only real problems you can justify; do not pad the list. If everything is correct, return an empty issues array.`

function fixPrompt(spec, issues, round) {
  return `${PRE}

You are the FIXER (round ${round}) for ${spec.what}. File: ${spec.file}.
Independent reviewers reported the issues below (JSON). For each issue: verify it yourself against the inputs (${spec.inputs}) and your knowledge of Arabic grammar and Urdu. If the reviewer is right, apply the fix (improve the wording if the suggested text is itself flawed). If the reviewer is wrong, do not change the file and record a precise reason. Never introduce new errors; keep keys, order and the JSON structure. Then run the validator and fix every error it reports:
${spec.validate}

Issues:
${JSON.stringify(issues, null, 1)}

Return validatorOk (validator exit 0), the number of applied fixes, the rejected issues with reasons, and short notes.`
}

function confirmPrompt(spec, issues, fixed) {
  return `${PRE}

You are the CONFIRMING REVIEWER for ${spec.what}. File: ${spec.file}. Inputs: ${spec.inputs}.
Earlier reviewers reported issues and a fixer applied or rejected them. Your job: (1) check that every accepted fix was applied correctly and did not introduce new errors; (2) judge each rejection — if the rejection is wrong, report the issue again; (3) independently re-check every entry in the file with fresh eyes for any remaining error. Run the validator too:
${spec.validate}

Earlier issues: ${JSON.stringify(issues, null, 1)}
Fixer result: ${JSON.stringify(fixed, null, 1)}

${SEVERITY}`
}

async function runItem(spec) {
  const authored = await agent(spec.author, { label: `${spec.label}:author`, phase: spec.phase, schema: AUTHOR })
  const reviews = await parallel(
    spec.verifiers.map((prompt, i) => () =>
      agent(prompt, { label: `${spec.label}:verify-${i + 1}`, phase: spec.phase, schema: ISSUES }),
    ),
  )
  const issues = reviews.filter(Boolean).flatMap((r, i) => r.issues.map((x) => ({ ...x, reviewer: i + 1 })))
  let fixed = { validatorOk: authored ? authored.validatorOk : false, applied: 0, rejected: [], notes: 'no issues reported' }
  if (issues.length) {
    fixed = await agent(fixPrompt(spec, issues, 1), { label: `${spec.label}:fix`, phase: spec.phase, schema: FIXED, effort: 'high' })
  }
  const confirm = await agent(confirmPrompt(spec, issues, fixed), { label: `${spec.label}:confirm`, phase: spec.phase, schema: ISSUES })
  let fixed2 = null
  if (confirm && confirm.issues.length) {
    fixed2 = await agent(fixPrompt(spec, confirm.issues, 2), { label: `${spec.label}:fix-2`, phase: spec.phase, schema: FIXED, effort: 'high' })
  }
  const summary = {
    item: spec.label,
    authored,
    reviewIssues: issues.length,
    reviewSeverity: issues.reduce((m, x) => ({ ...m, [x.severity]: (m[x.severity] || 0) + 1 }), {}),
    fixApplied: fixed ? fixed.applied : null,
    fixRejected: fixed ? fixed.rejected : null,
    confirmIssues: confirm ? confirm.issues : null,
    fix2: fixed2,
  }
  log(`${spec.label}: ${issues.length} review issues, ${confirm ? confirm.issues.length : '?'} at confirm`)
  return summary
}

const VALIDATE = (kind, batch) => `python3 -I ${W}/scripts/validate_lib.py ${W} ${kind}${batch ? ' ' + batch : ''}`

function rulesSpec() {
  const inputs = `${W}/meta/tag-inventory.json (QAC 0.4 tag statistics with examples for every word of the edition), ${W}/meta/existing-rules.json (the 46 rule ids already used by the app, with every Urdu wording variant), ${W}/meta/style-exemplars.json`
  const file = `${W}/libs/rules.json`
  const validate = VALIDATE('rules')
  return {
    label: 'rules',
    phase: 'Rules',
    what: 'the shared grammar-rule library',
    file,
    inputs,
    validate,
    author: `${PRE}

TASK: create the shared grammar-rule library used by all new lessons (${SL}). Lesson authors will tag every word with 1–6 rule ids from this library, and the app shows each rule's Urdu title and explanation as a study card.

Inputs: ${inputs}.
Write ${file} as {"rules": [{"id": "...", "titleUrdu": "...", "explanationUrdu": "...", "appliesWhenEnglish": "..."}]}.

Requirements:
1. Coverage: every grammatical phenomenon learners meet in these words, including at least: the three cases and their signs; jussive and subjunctive moods and what causes them; perfect, imperfect, imperative, prohibition (لا ناہیہ), passive voice, future (سَ/سَوْفَ), قَدْ, emphatic nun; derived verb forms (مزید فیہ); weak, hamzated and doubled verbs; quadriliteral verbs; كان and its sisters; إنّ and its sisters; ظنّ and its sisters; كاد/عسى; نِعْمَ/بِئْسَ; exclamation (أَفْعِلْ بِهِ); subject and object pronouns, hidden subject, two objects; nominal and verbal sentences; idafa, adjective (نعت), badal, tawkid, coordination, resumption; relative pronouns and their clause, demonstratives, separating pronoun, independent pronouns; vocative; conditional sentences (إنْ، لَوْ، مَنْ، مَا، إذَا، لَمَّا) and their answers; oath and its answer; emphatic lam; purpose lam/كَيْ; imperative lam; لم/لن and negation (لا، ما، إنْ النافية، ليس), لا النافية للجنس; restriction (إنّما، ما…إلّا); exception (إلّا، غير); interrogatives (أ، هل، مَن، ما، أيّ، كيف، أنّى); hal (حال) word and clause, tamyiz, cognate accusative (مفعول مطلق), object of purpose (مفعول لأجله), adverbs of time and place (ظرف / مفعول فیہ); participles, verbal nouns, comparatives (اسم تفضيل), intensive forms (مبالغہ), resembling adjectives (صفت مشبہ); dual, sound plurals, broken plurals, diptotes (غیر منصرف), the five nouns, the five verbs; definite/indefinite; proper nouns; masdar particles (أنْ، أنَّ، ما); explanatory أَنِ; answer/surprise particles (إذًا، إذا الفجائية، بلى); retraction بل, deterrence كلّا, detailing إمّا/أمّا, exhortation لولا; Quranic initials (حروفِ مقطعات); elision (حذف) and fronting (تقدیم).
2. Reuse each existing id whose concept matches and keep that concept exactly; base its Urdu on the clearest existing variant (light polishing allowed). Never reuse an id for a different concept. New ids: lowercase kebab-case English, e.g. oath, exception, tamyiz, cognate-object, purpose-object, adverb, subjunctive, prohibition, emphatic-lam, emphatic-nun, restriction, comparative, broken-plural, diptote, muqattaat.
3. titleUrdu ≤ 40 characters. explanationUrdu: 2–3 sentences (80–300 characters) of correct, learner-friendly Urdu, general rather than tied to one ayah; you may include a short Arabic illustration (a few words) with full vowels. No Latin letters, no URLs.
4. appliesWhenEnglish: a precise criterion for when an author tags a word occurrence with the rule, stating boundaries against neighbouring rules (e.g. object-pronoun vs object; subject-pronoun vs subject; conjunction vs resumption; relative vs masdar particle; haal vs adjective).
5. About 60–110 rules; no two rules may describe the same concept.
6. Run: ${validate}  and fix every error.

Return validatorOk, the number of rules, and notes listing new ids.`,
    verifiers: [
      `${PRE}

You are REVIEWER 1 (Arabic grammar accuracy and coverage) of ${file}, the shared grammar-rule library for ${SL}. Inputs: ${inputs}.
Check every rule: (a) is the Urdu explanation grammatically correct per classical Arabic grammar (case/mood signs, governing particles, verb types)? (b) is appliesWhenEnglish precise and non-overlapping with other rules? (c) is any existing id reused for a different concept than in existing-rules.json? (d) using the tag inventory, is any phenomenon that occurs in these words missing from the library (report as a missing rule with a full proposed entry in "fix")? Run ${validate} as well.
${SEVERITY}`,
      `${PRE}

You are REVIEWER 2 (Urdu language, pedagogy and house style) of ${file}, the shared grammar-rule library for ${SL}. Inputs: ${inputs}.
Check every rule: (a) Urdu spelling and grammar (Urdu letters ی ک ہ ے in Urdu words, correct izafat, natural phrasing); (b) clarity for an Urdu-speaking learner and correct, consistent grammatical terminology as in the authoring guide and existing lessons (e.g. مرفوع، منصوب، مجرور، مجزوم، فعلِ مضارع، مضاف الیہ، حال، تمییز); (c) any Arabic illustration has correct full vowels; (d) titles are concise and distinct; (e) explanations are general, 80–300 characters, and free of Latin letters. Run ${validate} as well.
${SEVERITY}`,
    ],
  }
}

function lexemeSpec(batch) {
  const input = `${W}/inputs/lexemes/${batch}.json`
  const file = `${W}/libs/lexemes/${batch}.json`
  const validate = VALIDATE('lexemes', batch)
  const conventions = `Conventions (exact):
- formUrdu: Form I 'ثلاثی مجرد — اوّل (I)'; derived forms 'ثلاثی مزید فیہ — دوم (II)', 'ثلاثی مزید فیہ — سوم (III)', 'ثلاثی مزید فیہ — چہارم (IV)', 'ثلاثی مزید فیہ — پنجم (V)', 'ثلاثی مزید فیہ — ششم (VI)', 'ثلاثی مزید فیہ — ہفتم (VII)', 'ثلاثی مزید فیہ — ہشتم (VIII)', 'ثلاثی مزید فیہ — نہم (IX)', 'ثلاثی مزید فیہ — دہم (X)'; quadriliteral 'رباعی مجرد — اوّل (QI)'. Passive voice: append '، مجہول'.
- baabUrdu: Form I by vowel class — 'بابِ نَصَرَ يَنْصُرُ' (a–u), 'بابِ ضَرَبَ يَضْرِبُ' (a–i), 'بابِ فَتَحَ يَفْتَحُ' (a–a), 'بابِ سَمِعَ يَسْمَعُ' (i–a), 'بابِ كَرُمَ يَكْرُمُ' (u–u), 'بابِ حَسِبَ يَحْسِبُ' (i–i). Forms II–X: 'بابِ تَفْعِيل', 'بابِ مُفَاعَلَة', 'بابِ اِفْعَال', 'بابِ تَفَعُّل', 'بابِ تَفَاعُل', 'بابِ اِنْفِعَال', 'بابِ اِفْتِعَال', 'بابِ اِفْعِلَال', 'بابِ اِسْتِفْعَال'; quadriliteral 'بابِ فَعْلَلَة'. Passive voice: append ' — مجہول'.
- past: 3rd-person masculine singular perfect with full vowels in the entry's voice (active قَالَ، أَنْزَلَ; passive قِيلَ، أُنْزِلَ). present: 3rd-person masculine singular imperfect indicative in that voice (يَقُولُ، يُنْزِلُ; passive يُقَالُ، يُنْزَلُ). A verb with no imperfect in use (لَيْسَ، نِعْمَ، بِئْسَ، عَسَى، تَبَارَكَ…) has present '—'.
- pattern: the wazn pair with ' — ' between, e.g. 'فَعَلَ — يَفْعُلُ', 'أَفْعَلَ — يُفْعِلُ', passive 'فُعِلَ — يُفْعَلُ'; a no-imperfect verb gives only its past wazn.
- noteUrdu: 1–2 sentences of general paradigm information (صحیح، مثال، اجوف، ناقص، لفیف، مہموز، مضاعف; which weak letter changes and how; لازم/متعدی; a key caution). Not tied to one occurrence.
- evidenceEnglish: the basis for the form and vowel class (attested imperfects in the occurrences, QAC tags, standard lexica such as Lane, Lisan al-Arab, al-Mu'jam al-Wasit).
- The input's lemmaArabic is QAC's lexeme identifier and is sometimes an inflected or passive form (e.g. بُشِّرَ for active Form II بَشَّرَ). Always derive the true citation form yourself from root, form, voice and the occurrences.
- Lexemes in this batch that are the same verb (same root, form, voice and meaning) must receive identical paradigm fields.`
  return {
    label: batch,
    phase: 'Lexemes',
    what: `verb-paradigm batch ${batch}`,
    file,
    inputs: input,
    validate,
    author: `${PRE}

TASK: write one verb-paradigm entry per lexeme in ${input}. Each lexeme is one QAC verb lexeme + verb form + voice, with up to 8 sample occurrences (Quranic word, QAC segments/tags, English morphology, Arabic i'rab). Every verb occurrence in the lessons will show this paradigm card, so it must be exactly right.
Write ${file} as {"entries": [{"key", "baabUrdu", "formUrdu", "past", "present", "pattern", "noteUrdu", "evidenceEnglish"}]} with the same keys in the same order as the input.
${conventions}
Run: ${validate}  and fix every error.
Return validatorOk, the number of entries, and notes on any uncertain vowel classes.`,
    verifiers: [
      `${PRE}

You are REVIEWER 1 (sarf / morphology) of verb-paradigm batch ${file}; input ${input}.
For every entry verify: the verb form number; for Form I the vowel class / bab against attested imperfects in the occurrences and standard lexica; past and present citation forms with correct vowels, hamza seats and weak-letter behaviour; the passive forms where voice is passive; the wazn pattern; and that the noteUrdu's root-type statement (صحیح، مثال، اجوف، ناقص، لفیف، مہموز، مضاعف) is right. Flag any occurrence that contradicts the entry.
${conventions}
Run ${validate} as well.
${SEVERITY}`,
      `${PRE}

You are REVIEWER 2 (conventions, Urdu and consistency) of verb-paradigm batch ${file}; input ${input}.
Verify every entry follows the conventions below exactly (spelling of formUrdu/baabUrdu labels, ' — ' separators, '، مجہول' suffixes, '—' only for verbs without an imperfect), that duplicate lexemes of the same verb have identical paradigm fields, that noteUrdu is correct natural Urdu (Urdu letters ی ک ہ ے), general rather than occurrence-specific, and that evidenceEnglish actually supports the decision.
${conventions}
Run ${validate} as well.
${SEVERITY}`,
    ],
  }
}

function rootSpec(batch) {
  const input = `${W}/inputs/roots/${batch}.json`
  const file = `${W}/libs/roots/${batch}.json`
  const validate = VALIDATE('roots', batch)
  const conventions = `Conventions:
- meaningUrdu: the core meaning(s) of the root family in Urdu, short phrases separated by «،» and ending with «۔», at most 120 characters (e.g. «کثرت، زیادہ ہونا، فراوانی۔»).
- noteUrdu: 1–2 sentences: the main derived words that occur in these surahs and how they relate to the core meaning, plus a caution where useful (a weak or hamzated radical hidden in some forms, a homograph from a different root, a proper noun grouped under the root only as a lexical index). No ayah references, no URLs, no Latin letters.
- Roots that QAC uses only as an index for interrogatives, particles or proper names: say the grouping is a lexical index; do not invent verbal meanings or etymologies. For أ ل ه keep the existing lessons' caution that the grouping of the divine name is a lexical index, not a settled etymology.`
  return {
    label: batch,
    phase: 'Roots',
    what: `root-meaning batch ${batch}`,
    file,
    inputs: input,
    validate,
    author: `${PRE}

TASK: write one root-family entry per root in ${input}. Each root lists the surahs, the QAC lemmas with counts and sample occurrences with English glosses from ${SL}. The app shows meaningUrdu and noteUrdu on every word card of that root.
Write ${file} as {"entries": [{"root", "meaningUrdu", "noteUrdu"}]} with the same roots in the same order as the input.
${conventions}
Run: ${validate}  and fix every error.
Return validatorOk, the number of entries and short notes.`,
    verifiers: [
      `${PRE}

You are REVIEWER 1 (Arabic lexicography) of root batch ${file}; input ${input}.
For every root verify the core meanings against classical lexica (Lane, Lisan al-Arab, Maqayis al-Lugha), that the derived words named in noteUrdu really belong to this root and occur in the input, that statements about weak/hamzated radicals are correct, and that nothing is invented (no speculative etymologies, no verbal meanings for index-only roots).
${conventions}
Run ${validate} as well.
${SEVERITY}`,
      `${PRE}

You are REVIEWER 2 (Urdu language and house style) of root batch ${file}; input ${input}.
For every entry verify natural, correctly spelled Urdu (Urdu letters ی ک ہ ے in Urdu words), clear learner-friendly wording, the conventions below, consistent style with the existing root entries in ${W}/meta/style-exemplars.json, and that meanings fit the sample occurrences' glosses.
${conventions}
Run ${validate} as well.
${SEVERITY}`,
    ],
  }
}

const kinds = (args && args.kinds) || ['rules', 'lexemes', 'roots']
const lexBatches = (args && args.lexBatches) || []
const rootBatches = (args && args.rootBatches) || []
const jobs = []
if (kinds.includes('rules')) jobs.push(() => runItem(rulesSpec()))
if (kinds.includes('lexemes')) for (const b of lexBatches) jobs.push(() => runItem(lexemeSpec(b)))
if (kinds.includes('roots')) for (const b of rootBatches) jobs.push(() => runItem(rootSpec(b)))
log(`Running ${jobs.length} library items`)
const results = await parallel(jobs)
return { results }
