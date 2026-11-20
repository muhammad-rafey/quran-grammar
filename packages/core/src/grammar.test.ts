import assert from 'node:assert/strict';
import test from 'node:test';
import {
  MAX_APPLY_QUESTIONS,
  MAX_QURANIC_EXAMPLES,
  MAX_SPOT_QUESTIONS,
  buildGrammarContent,
  checkGrammarSources,
  fatihahPractice,
  getBundledRepository,
  getGrammarContent,
  grammarTopicSources,
  studies,
} from './content';
import { gradePracticeAnswer, normalizeText } from './index';

const words = new Map(studies.flatMap((study) => study.words.map((word) => [word.id, word])));
const ruleIds = new Set(studies.flatMap((study) => study.rules.map((rule) => rule.id)));
const grammar = getGrammarContent();
const topicById = new Map(grammar.topics.map((topic) => [topic.id, topic]));

test('grammar build is deterministic and covers every Rule.id exactly once', () => {
  const again = buildGrammarContent(studies, grammarTopicSources, fatihahPractice);
  assert.equal(JSON.stringify(again), JSON.stringify(grammar));
  assert.equal(grammar.topics.length, ruleIds.size);
  assert.deepEqual(new Set(grammar.topics.map((topic) => topic.id)), ruleIds);
  assert.deepEqual(
    grammar.topics.map((topic) => topic.position),
    grammar.topics.map((_, index) => index + 1),
  );
  for (let index = 1; index < grammar.topics.length; index += 1)
    assert.ok(grammar.topics[index - 1].occurrenceCount >= grammar.topics[index].occurrenceCount);
  for (const topic of grammar.topics) {
    const tagged = studies.reduce(
      (total, study) => total + study.words.filter((word) => word.ruleIds.includes(topic.id)).length,
      0,
    );
    assert.equal(topic.occurrenceCount, tagged, topic.id);
    assert.ok(topic.titleUrdu && topic.summaryUrdu && topic.explanationUrdu, topic.id);
  }
});

test('the authored topic library has no structural errors', () => {
  const report = checkGrammarSources(studies, grammarTopicSources);
  assert.deepEqual(report.errors, []);
});

// Expected to fail until the five authored parts cover all Rule.ids (fallback topics are used).
test('every Rule.id in the registry has an authored grammar topic', () => {
  const report = checkGrammarSources(studies, grammarTopicSources);
  assert.deepEqual(report.missingTopics, []);
});

test('topic examples reference tagged words, spread across Surahs, without duplicates', () => {
  for (const topic of grammar.topics) {
    const examples = grammar.topicExamples.filter((example) => example.topicId === topic.id);
    const quranic = examples.filter((example) => example.kind === 'quranic');
    const annotated = examples.filter((example) => example.kind === 'annotated');
    assert.ok(quranic.length <= MAX_QURANIC_EXAMPLES, topic.id);
    assert.ok(quranic.length > 0 || annotated.length >= topic.occurrenceCount, topic.id);
    assert.equal(new Set(examples.map((example) => example.wordId)).size, examples.length, topic.id);
    for (const example of quranic) {
      assert.ok(words.get(example.wordId)?.ruleIds.includes(topic.id), example.wordId);
      assert.equal(example.noteUrdu, null);
    }
    for (const example of annotated) assert.ok(words.has(example.wordId) && example.noteUrdu);
    const surahs = new Set(quranic.map((example) => example.wordId.split(':')[0]));
    const available = new Set(
      studies
        .filter((study) =>
          study.words.some(
            (word) =>
              word.ruleIds.includes(topic.id) &&
              !annotated.some((example) => example.wordId === word.id),
          ),
        )
        .map((study) => String(study.surah.number)),
    );
    assert.ok(surahs.size >= Math.min(available.size, quranic.length, 6), topic.id);
  }
});

test('practice questions are well-formed, unique and gradeable', () => {
  const ids = grammar.questions.map((question) => question.id);
  assert.equal(new Set(ids).size, ids.length);
  assert.deepEqual(
    grammar.questions.filter((question) => question.kind === 'fatihah').map((question) => question.id),
    fatihahPractice.map((question) => `fatihah/${question.id}`),
  );
  for (const question of grammar.questions) {
    assert.ok(question.options.length >= 2 && question.options.length <= 6, question.id);
    assert.equal(new Set(question.options.map((option) => option.id)).size, question.options.length);
    assert.equal(
      new Set(question.options.map((option) => option.text)).size,
      question.options.length,
      question.id,
    );
    assert.equal(
      question.options.filter((option) => gradePracticeAnswer(question, option.id)).length,
      1,
      question.id,
    );
    if (question.wordId !== null) assert.ok(words.has(question.wordId), question.id);
    if (question.kind === 'fatihah') assert.equal(question.topicId, null);
    else {
      assert.ok(topicById.has(question.topicId!), question.id);
      assert.match(question.id, new RegExp(`^${question.topicId}/${question.kind}/`));
    }
  }
  for (const topic of grammar.topics) {
    const own = grammar.questions.filter((question) => question.topicId === topic.id);
    assert.ok(own.filter((question) => question.kind === 'apply').length <= MAX_APPLY_QUESTIONS);
    assert.ok(own.filter((question) => question.kind === 'spot').length <= MAX_SPOT_QUESTIONS);
    assert.ok(own.length >= 2, `${topic.id} has ${own.length} questions`);
  }
});

test('generated questions use the occurrence grammar: right answers tagged, distractors not', () => {
  for (const question of grammar.questions) {
    if (question.kind === 'apply') {
      const word = words.get(question.wordId!)!;
      assert.equal(question.correctOptionId, question.topicId);
      assert.ok(question.promptUrdu.includes(word.arabic));
      for (const option of question.options) {
        assert.equal(option.language, 'ur');
        assert.equal(option.text, topicById.get(option.id)!.titleUrdu);
        assert.equal(word.ruleIds.includes(option.id), option.id === question.correctOptionId);
      }
    }
    if (question.kind === 'spot') {
      assert.equal(question.correctOptionId, question.wordId);
      const forms = new Set<string>();
      for (const option of question.options) {
        const word = words.get(option.id)!;
        assert.equal(option.language, 'ar');
        assert.equal(option.text, word.arabic, 'options are exact Quranic words');
        assert.equal(word.ruleIds.includes(question.topicId!), option.id === question.correctOptionId);
        forms.add(normalizeText(word.arabic));
        assert.equal(option.id.split(':')[0], question.wordId!.split(':')[0], 'same Surah');
      }
      assert.equal(forms.size, question.options.length, 'distinct word forms');
    }
  }
});

test('bundled repository resolves topic details, summaries and practice sets', async () => {
  const repository = getBundledRepository();
  const topics = await repository.listTopics();
  assert.equal(topics.length, grammar.topics.length);
  assert.equal(
    topics.reduce((total, topic) => total + topic.questionCount, 0),
    grammar.questions.length - fatihahPractice.length,
  );
  const first = topics[0];
  const detail = (await repository.getTopic(first.id))!;
  assert.deepEqual(Object.keys(detail).slice(0, 7), Object.keys(first));
  for (const example of [...detail.examples, ...detail.quranicExamples]) {
    const word = words.get(example.wordId)!;
    assert.equal(example.wordArabic, word.arabic);
    assert.ok(example.ayahArabic.split(' ').includes(word.arabic));
    assert.equal(`${example.surah}:${example.ayah}`, example.wordId.split(':').slice(0, 2).join(':'));
  }
  assert.ok(detail.examples.every((example) => example.kind === 'annotated' && example.noteUrdu));
  assert.ok(detail.quranicExamples.every((example) => example.kind === 'quranic'));
  assert.equal(await repository.getTopic('does-not-exist'), null);
  const fatihah = await repository.getPracticeQuestions({ set: 'fatihah' });
  assert.equal(fatihah.length, 3);
  const practice = await repository.getPracticeQuestions({ topicId: first.id });
  assert.equal(practice.length, first.questionCount);
  assert.deepEqual(await repository.getPracticeQuestions({ topicId: 'nope' }), []);
  assert.equal(await repository.getStudy(2), null);
  assert.equal((await repository.getStudy(1))!.words.length, 29);
});
