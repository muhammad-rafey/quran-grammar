// Source-first lesson (content-pipeline/full-quran): Arabic, IDs and Urdu word-by-word
// meanings from Quran.com; word types, roots, lemmas, segments, morphology and Arabic
// i‘rab from the Quranic Arabic Corpus. Root, paradigm, segment and dictionary notes
// are AI-assisted. No ayah translation or tafsir. Scholarly review pending.
import type { StudyData } from '../types';

export const study2: StudyData = {
  schemaVersion: 1,
  surah: {
    number: 2,
    nameUrdu: 'سورۃ البقرہ',
    nameArabic: 'سُورَةُ الْبَقَرَةِ',
    ayahCount: 20,
    wordCount: 230,
  },
  words: [
    {
      id: '2:1:1',
      ayah: 1,
      position: 1,
      arabic: 'الٓمٓ',
      meaningUrdu: 'الف ۔ لام ۔ میم',
      pos: 'particle',
      posUrdu: 'حروفِ مقطعات',
      root: null,
      lemma: null,
      morphologyUrdu: 'حروفِ مقطعات، مبنی۔',
      syntaxUrdu: 'حروف مقطعة',
      dictionaryUrdu:
        'یہ حروفِ مقطعات ہیں جو الگ الگ حرف کے نام سے پڑھے جاتے ہیں؛ ان کی حقیقی مراد اللہ ہی جانتا ہے۔ انہیں عام لفظ سمجھ کر ان کا ترجمہ یا مادہ مقرر نہ کریں۔',
      segments: [
        {
          arabic: 'الٓمٓ',
          roleUrdu: 'حروفِ مقطعات',
          meaningUrdu: 'الف لام میم (حروفِ مقطعات)',
        },
      ],
      ruleIds: ['muqattaat'],
    },
    {
      id: '2:2:1',
      ayah: 2,
      position: 1,
      arabic: 'ذَٰلِكَ',
      meaningUrdu: 'وہ / یہ',
      pos: 'pronoun',
      posUrdu: 'اسمِ اشارہ',
      root: null,
      lemma: 'ذَٰلِك',
      morphologyUrdu: 'اسمِ اشارہ، واحد مذکر، مبنی۔',
      syntaxUrdu: 'اسم اشارة',
      dictionaryUrdu:
        'ذَٰلِكَ دور کی طرف اشارے کا اسم ہے جس کا عام معنی «وہ» ہے؛ ترجمے میں «یہ» بھی آتا ہے۔ یہ مبنی ہے اور یہاں مبتدا کے محلِ رفع میں ہے۔',
      segments: [
        {
          arabic: 'ذَٰلِكَ',
          roleUrdu: 'اسمِ اشارہ',
          meaningUrdu: 'وہ / یہ',
        },
      ],
      ruleIds: ['demonstrative', 'nominal'],
    },
    {
      id: '2:2:2',
      ayah: 2,
      position: 2,
      arabic: 'ٱلْكِتَـٰبُ',
      meaningUrdu: 'کتاب ہے',
      pos: 'noun',
      posUrdu: 'اسم مرفوع',
      root: 'ك ت ب',
      lemma: 'كِتَٰب',
      morphologyUrdu: 'اسم، مذکر، ال کے ساتھ معرفہ، مرفوع۔ سابقہ: ٱلْ (حرفِ تعریف)۔',
      syntaxUrdu: 'اسم مرفوع',
      dictionaryUrdu:
        'كِتَاب اصل میں لکھنے کا مصدر ہے جو لکھی ہوئی چیز کے لیے اسم بن گیا۔ یہاں ال کے ساتھ معرفہ ہو کر ایک خاص کتاب مراد ہے؛ یہ اسم ہے، فعل نہیں۔',
      segments: [
        {
          arabic: 'ٱلْ',
          roleUrdu: 'حرفِ تعریف',
          meaningUrdu: 'تعریف (معرفہ بنانے والا)',
        },
        {
          arabic: 'كِتَـٰبُ',
          roleUrdu: 'اسم مرفوع',
          meaningUrdu: 'کتاب',
        },
      ],
      ruleIds: ['definite', 'nominative', 'badal'],
    },
    {
      id: '2:2:3',
      ayah: 2,
      position: 3,
      arabic: 'لَا',
      meaningUrdu: 'نہیں',
      pos: 'particle',
      posUrdu: 'حرفِ نفی',
      root: null,
      lemma: 'لَا',
      morphologyUrdu: 'حرفِ نفی، مبنی۔',
      syntaxUrdu: 'نافية تعمل عمل «أن»',
      dictionaryUrdu:
        'یہ لَا نفیِ جنس کا ہے جو «إِنَّ» کی طرح عمل کرتا ہے؛ اپنے بعد والے نکرہ اسم کی پوری جنس کی نفی کرتا ہے، اس لیے مفہوم «کوئی بھی شک نہیں» بنتا ہے۔',
      segments: [
        {
          arabic: 'لَا',
          roleUrdu: 'حرفِ نفی',
          meaningUrdu: 'بالکل نہیں (نفیِ جنس)',
        },
      ],
      ruleIds: ['la-generic'],
    },
    {
      id: '2:2:4',
      ayah: 2,
      position: 4,
      arabic: 'رَيْبَ',
      meaningUrdu: 'کوئی شک',
      pos: 'noun',
      posUrdu: 'اسم منصوب',
      root: 'ر ي ب',
      lemma: 'رَيْب',
      morphologyUrdu: 'اسم، مذکر، منصوب۔',
      syntaxUrdu: 'اسم منصوب',
      dictionaryUrdu:
        'رَيْب ایسے شک کو کہتے ہیں جس کے ساتھ دل میں کھٹک اور بےچینی بھی ہو۔ نفیِ جنس کے اسم کے طور پر یہ تنوین کے بغیر فتحہ پر مبنی ہے، محلِ نصب میں۔',
      segments: [
        {
          arabic: 'رَيْبَ',
          roleUrdu: 'اسم منصوب',
          meaningUrdu: 'کوئی شک',
        },
      ],
      ruleIds: ['accusative', 'la-generic'],
    },
    {
      id: '2:2:5',
      ayah: 2,
      position: 5,
      arabic: 'فِيهِ',
      meaningUrdu: 'جس میں',
      pos: 'particle',
      posUrdu: 'حرفِ جر + ضمیرِ متصل',
      root: null,
      lemma: 'فِى',
      morphologyUrdu: 'حرفِ جر، مبنی۔ لاحقہ: هِ ضمیرِ متصل، واحد مذکر غائب۔',
      syntaxUrdu: 'جار ومجرور',
      dictionaryUrdu:
        'فِي ظرفیت کے لیے ہے: «میں، کے اندر»۔ ضمیر واحد مذکر غائب ہے اور کتاب کی طرف لوٹتی ہے؛ اس کا کسرہ پچھلی یاء کی وجہ سے ہے۔',
      segments: [
        {
          arabic: 'فِي',
          roleUrdu: 'حرفِ جر',
          meaningUrdu: 'میں',
        },
        {
          arabic: 'هِ',
          roleUrdu: 'ضمیرِ متصل (واحد مذکر غائب)',
          meaningUrdu: 'اس (کتاب)',
        },
      ],
      ruleIds: ['pronoun', 'preposition', 'nominal'],
    },
    {
      id: '2:2:6',
      ayah: 2,
      position: 6,
      arabic: 'هُدًۭى',
      meaningUrdu: 'ہدایت ہے',
      pos: 'noun',
      posUrdu: 'اسم مرفوع',
      root: 'ه د ي',
      lemma: 'هُدًى',
      morphologyUrdu: 'اسم، مذکر، نکرہ (تنوین)، مرفوع۔',
      syntaxUrdu: 'اسم مرفوع',
      dictionaryUrdu:
        'هُدًى کا مطلب راستہ دکھانا اور منزل کی طرف رہنمائی ہے۔ یہ اسمِ مقصور ہے، اس لیے آخر کے الف پر اعراب ظاہر نہیں ہوتا بلکہ مقدر رہتا ہے۔',
      segments: [
        {
          arabic: 'هُدًۭى',
          roleUrdu: 'اسم مرفوع',
          meaningUrdu: 'ہدایت',
        },
      ],
      ruleIds: ['nominative', 'indefinite', 'implied-case', 'nominal'],
    },
    {
      id: '2:2:7',
      ayah: 2,
      position: 7,
      arabic: 'لِّلْمُتَّقِينَ',
      meaningUrdu: 'واسطے ان کے جو متقی ہیں',
      pos: 'noun',
      posUrdu: 'اسمِ فاعل مجرور',
      root: 'و ق ي',
      lemma: 'مُتَّقِين',
      morphologyUrdu:
        'اسمِ فاعل، ثلاثی مزید فیہ — ہشتم (VIII)، بابِ اِفْتِعَال، جمع مذکر، ال کے ساتھ معرفہ، مجرور۔ سابقہ: لِّ (حرفِ جر)؛ لْ (حرفِ تعریف)۔',
      syntaxUrdu: 'جار ومجرور',
      dictionaryUrdu:
        'مُتَّقِين اسمِ فاعل جمع ہے: خود کو بچانے والے، یعنی پرہیزگار؛ یہ اسم ہے، فعل نہیں۔ مادہ و ق ي ہے؛ بابِ افتعال میں واو تاء بن کر مدغم ہو گئی، اور لِ کے بعد ال کا ہمزہ لکھنے میں گر گیا۔',
      segments: [
        {
          arabic: 'لِّ',
          roleUrdu: 'حرفِ جر',
          meaningUrdu: 'کے لیے',
        },
        {
          arabic: 'لْ',
          roleUrdu: 'حرفِ تعریف',
          meaningUrdu: 'تعریف (معرفہ بنانے والا)',
        },
        {
          arabic: 'مُتَّقِينَ',
          roleUrdu: 'اسمِ فاعل مجرور',
          meaningUrdu: 'پرہیزگار لوگ',
        },
      ],
      ruleIds: [
        'preposition',
        'definite',
        'genitive',
        'participle',
        'sound-plural',
        'assimilation',
      ],
    },
    {
      id: '2:3:1',
      ayah: 3,
      position: 1,
      arabic: 'ٱلَّذِينَ',
      meaningUrdu: 'یہ وہ لوگ ہیں',
      pos: 'pronoun',
      posUrdu: 'اسمِ موصول',
      root: null,
      lemma: 'ٱلَّذِى',
      morphologyUrdu: 'اسمِ موصول، جمع مذکر، مبنی۔',
      syntaxUrdu: 'اسم موصول',
      dictionaryUrdu:
        'ٱلَّذِينَ جمع مذکر کا اسمِ موصول ہے: «وہ لوگ جو»۔ اس کا مفہوم بعد والے صلہ کے جملے سے مکمل ہوتا ہے؛ یہ مبنی ہے، اس لیے اعراب لفظ پر ظاہر نہیں ہوتا۔',
      segments: [
        {
          arabic: 'ٱلَّذِينَ',
          roleUrdu: 'اسمِ موصول',
          meaningUrdu: 'وہ لوگ جو',
        },
      ],
      ruleIds: ['relative', 'adjective'],
    },
    {
      id: '2:3:2',
      ayah: 3,
      position: 2,
      arabic: 'يُؤْمِنُونَ',
      meaningUrdu: 'جو ایمان لاتے ہیں',
      pos: 'verb',
      posUrdu: 'فعلِ مضارع + ضمیرِ متصل',
      root: 'أ م ن',
      lemma: 'آمَنَ',
      morphologyUrdu:
        'فعلِ مضارع، مرفوع، معروف، جمع مذکر غائب، ثلاثی مزید فیہ — چہارم (IV)، بابِ إِفْعَال۔ لاحقہ: ونَ ضمیرِ فاعل، جمع مذکر غائب۔',
      syntaxUrdu: 'فعل مضارع والواو ضمير متصل في محل رفع فاعل',
      dictionaryUrdu:
        'ءَامَنَ بابِ افعال سے ہے: کسی بات کو سچ مان کر دل سے قبول کرنا؛ مادہ أ م ن میں امن اور اطمینان کا مفہوم ہے۔ مضارع میں ساکن ہمزہ واو کی کرسی پر لکھا جاتا ہے۔',
      segments: [
        {
          arabic: 'يُؤْمِنُ',
          roleUrdu: 'فعلِ مضارع',
          meaningUrdu: 'ایمان لاتے ہیں',
        },
        {
          arabic: 'ونَ',
          roleUrdu: 'ضمیرِ فاعل (جمع مذکر غائب)',
          meaningUrdu: 'وہ سب (فاعل)',
        },
      ],
      ruleIds: ['subject-pronoun', 'imperfect', 'derived-form', 'hamzated', 'five-verbs'],
    },
    {
      id: '2:3:3',
      ayah: 3,
      position: 3,
      arabic: 'بِٱلْغَيْبِ',
      meaningUrdu: 'غیب پر',
      pos: 'noun',
      posUrdu: 'اسم مجرور',
      root: 'غ ي ب',
      lemma: 'غَيْب',
      morphologyUrdu: 'اسم، مذکر، ال کے ساتھ معرفہ، مجرور۔ سابقہ: بِ (حرفِ جر)؛ ٱلْ (حرفِ تعریف)۔',
      syntaxUrdu: 'جار ومجرور',
      dictionaryUrdu:
        'غَيْب وہ ہے جو حواس سے اوجھل ہو؛ یہ اصل میں مصدر ہے جو اسم کے طور پر آیا ہے۔ بِ ایمان کے متعلق کو بتاتا ہے: «غیب پر»۔',
      segments: [
        {
          arabic: 'بِ',
          roleUrdu: 'حرفِ جر',
          meaningUrdu: 'پر',
        },
        {
          arabic: 'ٱلْ',
          roleUrdu: 'حرفِ تعریف',
          meaningUrdu: 'تعریف (معرفہ بنانے والا)',
        },
        {
          arabic: 'غَيْبِ',
          roleUrdu: 'اسم مجرور',
          meaningUrdu: 'غیب (ان دیکھی حقیقت)',
        },
      ],
      ruleIds: ['preposition', 'definite', 'genitive'],
    },
    {
      id: '2:3:4',
      ayah: 3,
      position: 4,
      arabic: 'وَيُقِيمُونَ',
      meaningUrdu: 'اور وہ قائم کرتے ہیں',
      pos: 'verb',
      posUrdu: 'فعلِ مضارع + ضمیرِ متصل',
      root: 'ق و م',
      lemma: 'أَقَامَ',
      morphologyUrdu:
        'فعلِ مضارع، مرفوع، معروف، جمع مذکر غائب، ثلاثی مزید فیہ — چہارم (IV)، بابِ إِفْعَال۔ سابقہ: وَ (حرفِ عطف)۔ لاحقہ: ونَ ضمیرِ فاعل، جمع مذکر غائب۔',
      syntaxUrdu: 'الواو عاطفة؛ فعل مضارع والواو ضمير متصل في محل رفع فاعل',
      dictionaryUrdu:
        'أَقَامَ بابِ افعال سے ہے: کسی چیز کو سیدھا کھڑا کرنا اور قائم رکھنا۔ مادہ ق و م اجوف ہے؛ مضارع میں درمیانی واو یاء میں بدل گئی، اس لیے اصل حرف لفظ میں چھپا ہوا ہے۔',
      segments: [
        {
          arabic: 'وَ',
          roleUrdu: 'حرفِ عطف',
          meaningUrdu: 'اور',
        },
        {
          arabic: 'يُقِيمُ',
          roleUrdu: 'فعلِ مضارع',
          meaningUrdu: 'قائم کرتے ہیں',
        },
        {
          arabic: 'ونَ',
          roleUrdu: 'ضمیرِ فاعل (جمع مذکر غائب)',
          meaningUrdu: 'وہ سب (فاعل)',
        },
      ],
      ruleIds: [
        'subject-pronoun',
        'conjunction',
        'imperfect',
        'derived-form',
        'weak-verb',
        'five-verbs',
      ],
    },
    {
      id: '2:3:5',
      ayah: 3,
      position: 5,
      arabic: 'ٱلصَّلَوٰةَ',
      meaningUrdu: 'نماز',
      pos: 'noun',
      posUrdu: 'اسم منصوب',
      root: 'ص ل و',
      lemma: 'صَلَوٰة',
      morphologyUrdu: 'اسم، مؤنث، ال کے ساتھ معرفہ، منصوب۔ سابقہ: ٱل (حرفِ تعریف)۔',
      syntaxUrdu: 'اسم منصوب',
      dictionaryUrdu:
        'صَلَوٰة لغت میں دعا کو کہتے ہیں اور شریعت میں مخصوص عبادت یعنی نماز کو۔ رسمِ عثمانی میں الف کی جگہ واو کی شکل لکھی جاتی ہے مگر پڑھا الف ہی جاتا ہے؛ ال کا لام شمسی ص میں مدغم ہے۔',
      segments: [
        {
          arabic: 'ٱل',
          roleUrdu: 'حرفِ تعریف',
          meaningUrdu: 'تعریف (معرفہ بنانے والا)',
        },
        {
          arabic: 'صَّلَوٰةَ',
          roleUrdu: 'اسم منصوب',
          meaningUrdu: 'نماز',
        },
      ],
      ruleIds: ['definite', 'accusative', 'object'],
    },
    {
      id: '2:3:6',
      ayah: 3,
      position: 6,
      arabic: 'وَمِمَّا',
      meaningUrdu: 'اس میں سے جو',
      pos: 'particle',
      posUrdu: 'حرفِ جر + اسمِ موصول',
      root: null,
      lemma: 'مِن',
      morphologyUrdu: 'حرفِ جر + اسمِ موصول، مبنی۔ سابقہ: وَ (حرفِ استئناف)۔',
      syntaxUrdu: 'الواو استئنافية؛ حرف جر؛ اسم موصول',
      dictionaryUrdu:
        'یہ اصل میں مِنْ اور مَا ہے؛ نون میم میں مدغم ہو گیا۔ مِنْ یہاں بعض کے معنی دیتا ہے: «اس میں سے کچھ»، اور مَا «جو چیز» کے لیے ہے۔',
      segments: [
        {
          arabic: 'وَ',
          roleUrdu: 'حرفِ استئناف',
          meaningUrdu: 'اور',
        },
        {
          arabic: 'مِ',
          roleUrdu: 'حرفِ جر',
          meaningUrdu: 'میں سے',
        },
        {
          arabic: 'مَّا',
          roleUrdu: 'اسمِ موصول',
          meaningUrdu: 'اس (چیز) جو',
        },
      ],
      ruleIds: ['resumption', 'preposition', 'relative', 'fronting'],
    },
    {
      id: '2:3:7',
      ayah: 3,
      position: 7,
      arabic: 'رَزَقْنَـٰهُمْ',
      meaningUrdu: 'رزق دیا ہم نے ان کو',
      pos: 'verb',
      posUrdu: 'فعلِ ماضی + ضمیرِ متصل',
      root: 'ر ز ق',
      lemma: 'رَزَقَ',
      morphologyUrdu:
        'فعلِ ماضی، معروف، جمع متکلم، ثلاثی مجرد — اوّل (I)۔ لاحقہ: نَـٰ ضمیرِ فاعل، جمع متکلم؛ هُمْ ضمیرِ مفعول، جمع مذکر غائب۔',
      syntaxUrdu: 'فعل ماض و«نا» ضمير متصل في محل رفع فاعل و«هم» ضمير متصل في محل نصب مفعول به',
      dictionaryUrdu:
        'رَزَقَ کا مطلب ہے روزی اور ضرورت کی چیزیں عطا کرنا۔ یہ متعدی ہے؛ مَا کی طرف لوٹنے والی ضمیر یہاں محذوف ہے اور سیاق سے سمجھی جاتی ہے۔',
      segments: [
        {
          arabic: 'رَزَقْ',
          roleUrdu: 'فعلِ ماضی',
          meaningUrdu: 'روزی دی',
        },
        {
          arabic: 'نَـٰ',
          roleUrdu: 'ضمیرِ فاعل (جمع متکلم)',
          meaningUrdu: 'ہم نے (فاعل)',
        },
        {
          arabic: 'هُمْ',
          roleUrdu: 'ضمیرِ مفعول (جمع مذکر غائب)',
          meaningUrdu: 'ان کو (مفعول)',
        },
      ],
      ruleIds: ['subject-pronoun', 'object-pronoun', 'perfect', 'elision'],
    },
    {
      id: '2:3:8',
      ayah: 3,
      position: 8,
      arabic: 'يُنفِقُونَ',
      meaningUrdu: 'وہ خرچ کرتے ہیں',
      pos: 'verb',
      posUrdu: 'فعلِ مضارع + ضمیرِ متصل',
      root: 'ن ف ق',
      lemma: 'أَنْفَقَ',
      morphologyUrdu:
        'فعلِ مضارع، مرفوع، معروف، جمع مذکر غائب، ثلاثی مزید فیہ — چہارم (IV)، بابِ إِفْعَال۔ لاحقہ: ونَ ضمیرِ فاعل، جمع مذکر غائب۔',
      syntaxUrdu: 'فعل مضارع والواو ضمير متصل في محل رفع فاعل',
      dictionaryUrdu:
        'أَنفَقَ بابِ افعال سے ہے: مال خرچ کرنا اور اپنے ہاتھ سے نکالنا۔ مادہ ن ف ق میں نکل جانے اور ختم ہونے کا مفہوم ہے۔',
      segments: [
        {
          arabic: 'يُنفِقُ',
          roleUrdu: 'فعلِ مضارع',
          meaningUrdu: 'خرچ کرتے ہیں',
        },
        {
          arabic: 'ونَ',
          roleUrdu: 'ضمیرِ فاعل (جمع مذکر غائب)',
          meaningUrdu: 'وہ سب (فاعل)',
        },
      ],
      ruleIds: ['subject-pronoun', 'imperfect', 'derived-form', 'five-verbs'],
    },
    {
      id: '2:4:1',
      ayah: 4,
      position: 1,
      arabic: 'وَٱلَّذِينَ',
      meaningUrdu: 'اور وہ لوگ',
      pos: 'pronoun',
      posUrdu: 'اسمِ موصول',
      root: null,
      lemma: 'ٱلَّذِى',
      morphologyUrdu: 'اسمِ موصول، جمع مذکر، مبنی۔ سابقہ: وَ (حرفِ عطف)۔',
      syntaxUrdu: 'الواو عاطفة؛ اسم موصول',
      dictionaryUrdu:
        'وَ عطف کے لیے ہے اور ٱلَّذِينَ جمع مذکر کا اسمِ موصول: «اور وہ لوگ جو»۔ اس کی پہچان بعد کے صلہ سے ہوتی ہے۔',
      segments: [
        {
          arabic: 'وَ',
          roleUrdu: 'حرفِ عطف',
          meaningUrdu: 'اور',
        },
        {
          arabic: 'ٱلَّذِينَ',
          roleUrdu: 'اسمِ موصول',
          meaningUrdu: 'وہ لوگ جو',
        },
      ],
      ruleIds: ['conjunction', 'relative'],
    },
    {
      id: '2:4:2',
      ayah: 4,
      position: 2,
      arabic: 'يُؤْمِنُونَ',
      meaningUrdu: 'جو ایمان لاتے ہیں',
      pos: 'verb',
      posUrdu: 'فعلِ مضارع + ضمیرِ متصل',
      root: 'أ م ن',
      lemma: 'آمَنَ',
      morphologyUrdu:
        'فعلِ مضارع، مرفوع، معروف، جمع مذکر غائب، ثلاثی مزید فیہ — چہارم (IV)، بابِ إِفْعَال۔ لاحقہ: ونَ ضمیرِ فاعل، جمع مذکر غائب۔',
      syntaxUrdu: 'فعل مضارع والواو ضمير متصل في محل رفع فاعل',
      dictionaryUrdu:
        'ءَامَنَ کا مطلب سچ مان کر دل سے قبول کرنا ہے؛ بِ کے ساتھ ایمان کا متعلق آتا ہے۔ ہمزہ واو کی کرسی پر لکھا ہے، اس واو کو مادے کا حرف نہ سمجھیں۔',
      segments: [
        {
          arabic: 'يُؤْمِنُ',
          roleUrdu: 'فعلِ مضارع',
          meaningUrdu: 'ایمان لاتے ہیں',
        },
        {
          arabic: 'ونَ',
          roleUrdu: 'ضمیرِ فاعل (جمع مذکر غائب)',
          meaningUrdu: 'وہ سب (فاعل)',
        },
      ],
      ruleIds: ['subject-pronoun', 'imperfect', 'derived-form', 'hamzated', 'five-verbs'],
    },
    {
      id: '2:4:3',
      ayah: 4,
      position: 3,
      arabic: 'بِمَآ',
      meaningUrdu: 'ساتھ اس کے جو',
      pos: 'pronoun',
      posUrdu: 'اسمِ موصول',
      root: null,
      lemma: 'مَا',
      morphologyUrdu: 'اسمِ موصول، مبنی۔ سابقہ: بِ (حرفِ جر)۔',
      syntaxUrdu: 'جار ومجرور',
      dictionaryUrdu:
        'بِ یہاں ایمان کے متعلق کو ملاتا ہے اور مَا اسمِ موصول ہے: «اس پر جو»۔ یہ مَا نفی کا نہیں، موصول ہے۔',
      segments: [
        {
          arabic: 'بِ',
          roleUrdu: 'حرفِ جر',
          meaningUrdu: 'پر',
        },
        {
          arabic: 'مَآ',
          roleUrdu: 'اسمِ موصول',
          meaningUrdu: 'اس (چیز) جو',
        },
      ],
      ruleIds: ['preposition', 'relative'],
    },
    {
      id: '2:4:4',
      ayah: 4,
      position: 4,
      arabic: 'أُنزِلَ',
      meaningUrdu: 'نازل کیا گیا',
      pos: 'verb',
      posUrdu: 'فعلِ ماضی مجہول',
      root: 'ن ز ل',
      lemma: 'أُنْزِلَ',
      morphologyUrdu:
        'فعلِ ماضی مجہول، مجہول، واحد مذکر غائب، ثلاثی مزید فیہ — چہارم (IV)، بابِ إِفْعَال۔',
      syntaxUrdu: 'فعل ماض مبني للمجهول',
      dictionaryUrdu:
        'أَنزَلَ بابِ افعال سے ہے: اوپر سے نیچے اتارنا۔ یہ مجہول ہے؛ فاعل ذکر نہیں ہوا اور نائبِ فاعل پوشیدہ ضمیر ہے جو مَا کی طرف لوٹتی ہے۔',
      segments: [
        {
          arabic: 'أُنزِلَ',
          roleUrdu: 'فعلِ ماضی مجہول',
          meaningUrdu: 'نازل کیا گیا',
        },
      ],
      ruleIds: ['perfect', 'passive', 'derived-form', 'subject-pronoun'],
    },
    {
      id: '2:4:5',
      ayah: 4,
      position: 5,
      arabic: 'إِلَيْكَ',
      meaningUrdu: 'طرف آپ کے',
      pos: 'particle',
      posUrdu: 'حرفِ جر + ضمیرِ متصل',
      root: null,
      lemma: 'إِلَىٰ',
      morphologyUrdu: 'حرفِ جر، مبنی۔ لاحقہ: كَ ضمیرِ متصل، واحد مذکر حاضر۔',
      syntaxUrdu: 'جار ومجرور',
      dictionaryUrdu:
        'إِلَىٰ سمت اور انتہا کے لیے ہے: «کی طرف»۔ ضمیر کے ساتھ اس کا آخری الف یاء کی شکل میں لکھا جاتا ہے؛ ضمیر واحد مذکر حاضر کی ہے۔',
      segments: [
        {
          arabic: 'إِلَيْ',
          roleUrdu: 'حرفِ جر',
          meaningUrdu: 'کی طرف',
        },
        {
          arabic: 'كَ',
          roleUrdu: 'ضمیرِ متصل (واحد مذکر حاضر)',
          meaningUrdu: 'آپ',
        },
      ],
      ruleIds: ['pronoun', 'preposition'],
    },
    {
      id: '2:4:6',
      ayah: 4,
      position: 6,
      arabic: 'وَمَآ',
      meaningUrdu: 'اور جو',
      pos: 'pronoun',
      posUrdu: 'اسمِ موصول',
      root: null,
      lemma: 'مَا',
      morphologyUrdu: 'اسمِ موصول، مبنی۔ سابقہ: وَ (حرفِ عطف)۔',
      syntaxUrdu: 'الواو عاطفة؛ اسم موصول',
      dictionaryUrdu:
        'وَ عطف کا ہے اور مَا اسمِ موصول: «اور اس پر جو»۔ یہ پچھلے موصول پر معطوف ہے، اس لیے اس پر بھی ایمان لانے کا تعلق ہے۔',
      segments: [
        {
          arabic: 'وَ',
          roleUrdu: 'حرفِ عطف',
          meaningUrdu: 'اور',
        },
        {
          arabic: 'مَآ',
          roleUrdu: 'اسمِ موصول',
          meaningUrdu: 'جو (چیز)',
        },
      ],
      ruleIds: ['conjunction', 'relative'],
    },
    {
      id: '2:4:7',
      ayah: 4,
      position: 7,
      arabic: 'أُنزِلَ',
      meaningUrdu: 'نازل کیا گیا',
      pos: 'verb',
      posUrdu: 'فعلِ ماضی مجہول',
      root: 'ن ز ل',
      lemma: 'أُنْزِلَ',
      morphologyUrdu:
        'فعلِ ماضی مجہول، مجہول، واحد مذکر غائب، ثلاثی مزید فیہ — چہارم (IV)، بابِ إِفْعَال۔',
      syntaxUrdu: 'فعل ماض مبني للمجهول',
      dictionaryUrdu:
        'یہ أَنزَلَ کا مجہول ماضی ہے: «اتارا گیا»۔ مجہول کی پہچان پہلے حرف پر ضمہ اور آخری سے پہلے حرف پر کسرہ ہے؛ نائبِ فاعل پوشیدہ ضمیر ہے۔',
      segments: [
        {
          arabic: 'أُنزِلَ',
          roleUrdu: 'فعلِ ماضی مجہول',
          meaningUrdu: 'نازل کیا گیا',
        },
      ],
      ruleIds: ['perfect', 'passive', 'derived-form', 'subject-pronoun'],
    },
    {
      id: '2:4:8',
      ayah: 4,
      position: 8,
      arabic: 'مِن',
      meaningUrdu: 'سے',
      pos: 'particle',
      posUrdu: 'حرفِ جر',
      root: null,
      lemma: 'مِن',
      morphologyUrdu: 'حرفِ جر، مبنی۔',
      syntaxUrdu: 'حرف جر',
      dictionaryUrdu:
        'مِنْ ابتدا کے لیے آتا ہے: «سے»۔ اگلے لفظ کے ساتھ مل کر «پہلے سے» کا مفہوم بنتا ہے۔',
      segments: [
        {
          arabic: 'مِن',
          roleUrdu: 'حرفِ جر',
          meaningUrdu: 'سے',
        },
      ],
      ruleIds: ['preposition'],
    },
    {
      id: '2:4:9',
      ayah: 4,
      position: 9,
      arabic: 'قَبْلِكَ',
      meaningUrdu: 'آپ سے پہلے',
      pos: 'noun',
      posUrdu: 'اسم مجرور + ضمیرِ متصل',
      root: 'ق ب ل',
      lemma: 'قَبْل',
      morphologyUrdu: 'اسم، مجرور۔ لاحقہ: كَ ضمیرِ متصل، واحد مذکر حاضر۔',
      syntaxUrdu: 'اسم مجرور والكاف ضمير متصل في محل جر بالاضافة',
      dictionaryUrdu:
        'قَبْل وقت کے لحاظ سے پہلے ہونے کو بتاتا ہے۔ یہ اسم ہے، حرف نہیں؛ مِنْ کی وجہ سے مجرور ہے اور ضمیر کی طرف مضاف ہے۔',
      segments: [
        {
          arabic: 'قَبْلِ',
          roleUrdu: 'اسم مجرور',
          meaningUrdu: 'پہلے',
        },
        {
          arabic: 'كَ',
          roleUrdu: 'ضمیرِ متصل (واحد مذکر حاضر)',
          meaningUrdu: 'آپ (سے)',
        },
      ],
      ruleIds: ['pronoun', 'genitive', 'idafa'],
    },
    {
      id: '2:4:10',
      ayah: 4,
      position: 10,
      arabic: 'وَبِٱلْـَٔاخِرَةِ',
      meaningUrdu: 'اور آخرت کے ساتھ',
      pos: 'noun',
      posUrdu: 'اسم مجرور',
      root: 'أ خ ر',
      lemma: 'آخِر',
      morphologyUrdu:
        'اسم، واحد مؤنث، ال کے ساتھ معرفہ، مجرور۔ سابقہ: وَ (حرفِ استئناف)؛ بِ (حرفِ جر)؛ ٱلْ (حرفِ تعریف)۔',
      syntaxUrdu: 'الواو استئنافية؛ جار ومجرور',
      dictionaryUrdu:
        'آخِر کا مؤنث ہے: بعد میں آنے والی؛ یہاں اس سے آنے والی زندگی یعنی آخرت مراد ہے۔ شروع کا مد والا الف اصل میں ہمزہ اور الف ہے۔',
      segments: [
        {
          arabic: 'وَ',
          roleUrdu: 'حرفِ استئناف',
          meaningUrdu: 'اور',
        },
        {
          arabic: 'بِ',
          roleUrdu: 'حرفِ جر',
          meaningUrdu: 'پر',
        },
        {
          arabic: 'ٱلْ',
          roleUrdu: 'حرفِ تعریف',
          meaningUrdu: 'تعریف (معرفہ بنانے والا)',
        },
        {
          arabic: 'ـَٔاخِرَةِ',
          roleUrdu: 'اسم مجرور',
          meaningUrdu: 'آخرت',
        },
      ],
      ruleIds: ['resumption', 'preposition', 'definite', 'genitive', 'fronting'],
    },
    {
      id: '2:4:11',
      ayah: 4,
      position: 11,
      arabic: 'هُمْ',
      meaningUrdu: 'وہ',
      pos: 'pronoun',
      posUrdu: 'ضمیرِ منفصل',
      root: null,
      lemma: null,
      morphologyUrdu: 'ضمیرِ منفصل، جمع مذکر غائب، مبنی۔',
      syntaxUrdu: 'ضمير منفصل',
      dictionaryUrdu:
        'یہ جمع مذکر غائب کی ضمیرِ منفصل ہے: «وہ لوگ»۔ یہاں مبتدا ہے اور اس کی خبر بعد کا فعلیہ جملہ ہے۔',
      segments: [
        {
          arabic: 'هُمْ',
          roleUrdu: 'ضمیرِ منفصل',
          meaningUrdu: 'وہ (لوگ)',
        },
      ],
      ruleIds: ['independent-pronoun', 'nominal'],
    },
    {
      id: '2:4:12',
      ayah: 4,
      position: 12,
      arabic: 'يُوقِنُونَ',
      meaningUrdu: 'وہ یقین رکھتے ہیں',
      pos: 'verb',
      posUrdu: 'فعلِ مضارع + ضمیرِ متصل',
      root: 'ي ق ن',
      lemma: 'أَيْقَنَ',
      morphologyUrdu:
        'فعلِ مضارع، مرفوع، معروف، جمع مذکر غائب، ثلاثی مزید فیہ — چہارم (IV)، بابِ إِفْعَال۔ لاحقہ: ونَ ضمیرِ فاعل، جمع مذکر غائب۔',
      syntaxUrdu: 'فعل مضارع والواو ضمير متصل في محل رفع فاعل',
      dictionaryUrdu:
        'أَيْقَنَ بابِ افعال سے ہے: ایسا پختہ یقین جس میں شک باقی نہ رہے۔ مادہ ي ق ن ہے؛ مضارع میں ساکن یاء ضمہ کے بعد واو بن گئی، اس واو کو مادہ نہ سمجھیں۔',
      segments: [
        {
          arabic: 'يُوقِنُ',
          roleUrdu: 'فعلِ مضارع',
          meaningUrdu: 'یقین رکھتے ہیں',
        },
        {
          arabic: 'ونَ',
          roleUrdu: 'ضمیرِ فاعل (جمع مذکر غائب)',
          meaningUrdu: 'وہ سب (فاعل)',
        },
      ],
      ruleIds: [
        'subject-pronoun',
        'imperfect',
        'derived-form',
        'weak-verb',
        'five-verbs',
        'nominal',
      ],
    },
    {
      id: '2:5:1',
      ayah: 5,
      position: 1,
      arabic: 'أُو۟لَـٰٓئِكَ',
      meaningUrdu: 'یہی لوگ',
      pos: 'pronoun',
      posUrdu: 'اسمِ اشارہ',
      root: null,
      lemma: 'أُولَٰٓئِك',
      morphologyUrdu: 'اسمِ اشارہ، جمع، مبنی۔',
      syntaxUrdu: 'اسم اشارة',
      dictionaryUrdu:
        'یہ جمع کے لیے دور کا اسمِ اشارہ ہے: «وہ لوگ»۔ رسم میں لکھی ہوئی واو پڑھی نہیں جاتی؛ یہ مبنی ہے اور یہاں مبتدا ہے۔',
      segments: [
        {
          arabic: 'أُو۟لَـٰٓئِكَ',
          roleUrdu: 'اسمِ اشارہ',
          meaningUrdu: 'وہ لوگ',
        },
      ],
      ruleIds: ['demonstrative', 'nominal'],
    },
    {
      id: '2:5:2',
      ayah: 5,
      position: 2,
      arabic: 'عَلَىٰ',
      meaningUrdu: 'اوپر',
      pos: 'particle',
      posUrdu: 'حرفِ جر',
      root: null,
      lemma: 'عَلَىٰ',
      morphologyUrdu: 'حرفِ جر، مبنی۔',
      syntaxUrdu: 'حرف جر',
      dictionaryUrdu:
        'عَلَىٰ کا بنیادی معنی «اوپر، پر» ہے؛ یہاں کسی حالت پر قائم ہونے کو بتاتا ہے، جیسے ہدایت پر ہونا۔',
      segments: [
        {
          arabic: 'عَلَىٰ',
          roleUrdu: 'حرفِ جر',
          meaningUrdu: 'پر',
        },
      ],
      ruleIds: ['preposition', 'nominal'],
    },
    {
      id: '2:5:3',
      ayah: 5,
      position: 3,
      arabic: 'هُدًۭى',
      meaningUrdu: 'ہدایت کے ہیں',
      pos: 'noun',
      posUrdu: 'اسم مجرور',
      root: 'ه د ي',
      lemma: 'هُدًى',
      morphologyUrdu: 'اسم، مذکر، نکرہ (تنوین)، مجرور۔',
      syntaxUrdu: 'اسم مجرور',
      dictionaryUrdu:
        'هُدًى رہنمائی کو کہتے ہیں۔ یہ اسمِ مقصور ہے؛ حرفِ جر کی وجہ سے مجرور ہے مگر کسرہ آخر کے الف پر مقدر ہے، اور تنوین اسے نکرہ بتاتی ہے۔',
      segments: [
        {
          arabic: 'هُدًۭى',
          roleUrdu: 'اسم مجرور',
          meaningUrdu: 'ہدایت',
        },
      ],
      ruleIds: ['genitive', 'indefinite', 'implied-case'],
    },
    {
      id: '2:5:4',
      ayah: 5,
      position: 4,
      arabic: 'مِّن',
      meaningUrdu: 'سے',
      pos: 'particle',
      posUrdu: 'حرفِ جر',
      root: null,
      lemma: 'مِن',
      morphologyUrdu: 'حرفِ جر، مبنی۔',
      syntaxUrdu: 'حرف جر',
      dictionaryUrdu:
        'مِنْ یہاں ابتدا اور ماخذ بتاتا ہے: «کی طرف سے»۔ پچھلے لفظ کی تنوین کا نون اس میم میں مدغم ہوتا ہے، اسی لیے میم پر شد ہے۔',
      segments: [
        {
          arabic: 'مِّن',
          roleUrdu: 'حرفِ جر',
          meaningUrdu: 'کی طرف سے',
        },
      ],
      ruleIds: ['preposition', 'adjective'],
    },
    {
      id: '2:5:5',
      ayah: 5,
      position: 5,
      arabic: 'رَّبِّهِمْ',
      meaningUrdu: 'اپنے رب کی طرف سے',
      pos: 'noun',
      posUrdu: 'اسم مجرور + ضمیرِ متصل',
      root: 'ر ب ب',
      lemma: 'رَبّ',
      morphologyUrdu: 'اسم، مذکر، مجرور۔ لاحقہ: هِمْ ضمیرِ متصل، جمع مذکر غائب۔',
      syntaxUrdu: 'اسم مجرور و«هم» ضمير متصل في محل جر بالاضافة',
      dictionaryUrdu:
        'رَبّ وہ ہے جو پالے، پرورش کرے اور مالک و نگہبان ہو۔ مادہ ر ب ب مضاعف ہے؛ شروع کی راء پر شد پچھلے نون کے ادغام سے ہے۔',
      segments: [
        {
          arabic: 'رَّبِّ',
          roleUrdu: 'اسم مجرور',
          meaningUrdu: 'رب',
        },
        {
          arabic: 'هِمْ',
          roleUrdu: 'ضمیرِ متصل (جمع مذکر غائب)',
          meaningUrdu: 'ان کا',
        },
      ],
      ruleIds: ['pronoun', 'genitive', 'idafa'],
    },
    {
      id: '2:5:6',
      ayah: 5,
      position: 6,
      arabic: 'وَأُو۟لَـٰٓئِكَ',
      meaningUrdu: 'اور یہی لوگ ہیں',
      pos: 'pronoun',
      posUrdu: 'اسمِ اشارہ',
      root: null,
      lemma: 'أُولَٰٓئِك',
      morphologyUrdu: 'اسمِ اشارہ، جمع، مبنی۔ سابقہ: وَ (حرفِ عطف)۔',
      syntaxUrdu: 'الواو عاطفة؛ اسم اشارة',
      dictionaryUrdu:
        'وَ عطف کا ہے اور اس کے بعد جمع کے لیے دور کا اسمِ اشارہ: «اور وہی لوگ»۔ اسمِ اشارہ مبنی ہے اور یہاں مبتدا ہے۔',
      segments: [
        {
          arabic: 'وَ',
          roleUrdu: 'حرفِ عطف',
          meaningUrdu: 'اور',
        },
        {
          arabic: 'أُو۟لَـٰٓئِكَ',
          roleUrdu: 'اسمِ اشارہ',
          meaningUrdu: 'وہ لوگ',
        },
      ],
      ruleIds: ['conjunction', 'demonstrative', 'nominal'],
    },
    {
      id: '2:5:7',
      ayah: 5,
      position: 7,
      arabic: 'هُمُ',
      meaningUrdu: 'وہ',
      pos: 'pronoun',
      posUrdu: 'ضمیرِ منفصل',
      root: null,
      lemma: null,
      morphologyUrdu: 'ضمیرِ منفصل، جمع مذکر غائب، مبنی۔',
      syntaxUrdu: 'ضمير منفصل',
      dictionaryUrdu:
        'یہ جمع مذکر غائب کی ضمیرِ منفصل ہے۔ مبتدا اور معرفہ خبر کے بیچ آ کر ضمیرِ فصل بنتی ہے جو تاکید اور حصر دیتی ہے: «وہی»؛ اگلے ساکن سے ملنے کے لیے میم پر ضمہ ہے۔',
      segments: [
        {
          arabic: 'هُمُ',
          roleUrdu: 'ضمیرِ منفصل',
          meaningUrdu: 'وہی (ضمیرِ فصل)',
        },
      ],
      ruleIds: ['independent-pronoun', 'separating-pronoun'],
    },
    {
      id: '2:5:8',
      ayah: 5,
      position: 8,
      arabic: 'ٱلْمُفْلِحُونَ',
      meaningUrdu: 'جو فلاح پانے والے ہیں',
      pos: 'noun',
      posUrdu: 'اسمِ فاعل مرفوع',
      root: 'ف ل ح',
      lemma: 'مُفْلِحُون',
      morphologyUrdu:
        'اسمِ فاعل، ثلاثی مزید فیہ — چہارم (IV)، بابِ إِفْعَال، جمع مذکر، ال کے ساتھ معرفہ، مرفوع۔ سابقہ: ٱلْ (حرفِ تعریف)۔',
      syntaxUrdu: 'اسم مرفوع',
      dictionaryUrdu:
        'مُفْلِح أَفْلَحَ کا اسمِ فاعل ہے: کامیاب ہونے اور مراد پانے والا۔ یہ اسم ہے، فعل نہیں؛ آخر کی واو جمع مذکر سالم کی حالتِ رفع کی علامت ہے۔',
      segments: [
        {
          arabic: 'ٱلْ',
          roleUrdu: 'حرفِ تعریف',
          meaningUrdu: 'تعریف (معرفہ بنانے والا)',
        },
        {
          arabic: 'مُفْلِحُونَ',
          roleUrdu: 'اسمِ فاعل مرفوع',
          meaningUrdu: 'فلاح پانے والے',
        },
      ],
      ruleIds: ['definite', 'nominative', 'participle', 'sound-plural', 'nominal'],
    },
    {
      id: '2:6:1',
      ayah: 6,
      position: 1,
      arabic: 'إِنَّ',
      meaningUrdu: 'بیشک',
      pos: 'particle',
      posUrdu: 'حرفِ نصب',
      root: null,
      lemma: 'إِنّ',
      morphologyUrdu: 'حرفِ نصب، مبنی۔',
      syntaxUrdu: 'حرف نصب',
      dictionaryUrdu:
        'إِنَّ تاکید کا حرف ہے: «بے شک»۔ یہ اپنے اسم کو نصب اور خبر کو رفع دیتا ہے؛ یہ فعل نہیں۔',
      segments: [
        {
          arabic: 'إِنَّ',
          roleUrdu: 'حرفِ نصب',
          meaningUrdu: 'بے شک',
        },
      ],
      ruleIds: ['inna'],
    },
    {
      id: '2:6:2',
      ayah: 6,
      position: 2,
      arabic: 'ٱلَّذِينَ',
      meaningUrdu: 'وہ لوگ',
      pos: 'pronoun',
      posUrdu: 'اسمِ موصول',
      root: null,
      lemma: 'ٱلَّذِى',
      morphologyUrdu: 'اسمِ موصول، جمع مذکر، مبنی۔',
      syntaxUrdu: 'اسم موصول',
      dictionaryUrdu:
        'ٱلَّذِينَ جمع مذکر کا اسمِ موصول ہے: «وہ لوگ جو»۔ یہاں إِنَّ کا اسم ہے، مگر مبنی ہونے کی وجہ سے نصب محل میں ہے، لفظ پر ظاہر نہیں۔',
      segments: [
        {
          arabic: 'ٱلَّذِينَ',
          roleUrdu: 'اسمِ موصول',
          meaningUrdu: 'وہ لوگ جو',
        },
      ],
      ruleIds: ['relative', 'inna'],
    },
    {
      id: '2:6:3',
      ayah: 6,
      position: 3,
      arabic: 'كَفَرُوا۟',
      meaningUrdu: 'جنہوں نے کفر کیا',
      pos: 'verb',
      posUrdu: 'فعلِ ماضی + ضمیرِ متصل',
      root: 'ك ف ر',
      lemma: 'كَفَرَ',
      morphologyUrdu:
        'فعلِ ماضی، معروف، جمع مذکر غائب، ثلاثی مجرد — اوّل (I)۔ لاحقہ: وا۟ ضمیرِ فاعل، جمع مذکر غائب۔',
      syntaxUrdu: 'فعل ماض والواو ضمير متصل في محل رفع فاعل',
      dictionaryUrdu:
        'كَفَرَ کا لغوی معنی چھپانا اور ڈھانپنا ہے؛ اسی سے حق کو نہ ماننا اور ناشکری کا معنی آیا۔ آخر کا الف لکھا جاتا ہے مگر پڑھا نہیں جاتا۔',
      segments: [
        {
          arabic: 'كَفَرُ',
          roleUrdu: 'فعلِ ماضی',
          meaningUrdu: 'کفر کیا',
        },
        {
          arabic: 'وا۟',
          roleUrdu: 'ضمیرِ فاعل (جمع مذکر غائب)',
          meaningUrdu: 'انہوں نے (فاعل)',
        },
      ],
      ruleIds: ['subject-pronoun', 'perfect'],
    },
    {
      id: '2:6:4',
      ayah: 6,
      position: 4,
      arabic: 'سَوَآءٌ',
      meaningUrdu: 'برابر ہے',
      pos: 'noun',
      posUrdu: 'اسم مرفوع',
      root: 'س و ي',
      lemma: 'سَوَآء',
      morphologyUrdu: 'اسم، مذکر، نکرہ (تنوین)، مرفوع۔',
      syntaxUrdu: 'اسم مرفوع',
      dictionaryUrdu:
        'سَوَاء کا مطلب برابر اور یکساں ہے؛ یہ اسم ہے، فعل نہیں۔ اس کے بعد ہمزۂ تسویہ اور أَمْ کے ساتھ دو صورتیں ذکر ہوتی ہیں جن کا نتیجہ ایک بتایا جاتا ہے۔',
      segments: [
        {
          arabic: 'سَوَآءٌ',
          roleUrdu: 'اسم مرفوع',
          meaningUrdu: 'برابر',
        },
      ],
      ruleIds: ['nominative', 'indefinite', 'nominal', 'fronting'],
    },
    {
      id: '2:6:5',
      ayah: 6,
      position: 5,
      arabic: 'عَلَيْهِمْ',
      meaningUrdu: 'اوپر ان کے',
      pos: 'particle',
      posUrdu: 'حرفِ جر + ضمیرِ متصل',
      root: null,
      lemma: 'عَلَىٰ',
      morphologyUrdu: 'حرفِ جر، مبنی۔ لاحقہ: هِمْ ضمیرِ متصل، جمع مذکر غائب۔',
      syntaxUrdu: 'جار ومجرور',
      dictionaryUrdu:
        'عَلَىٰ ضمیر کے ساتھ یاء سے لکھا جاتا ہے؛ یہاں «ان کے حق میں، ان کے لیے» کا مفہوم ہے۔ ضمیر جمع مذکر غائب ہے، اس کا کسرہ پچھلی یاء کی وجہ سے ہے۔',
      segments: [
        {
          arabic: 'عَلَيْ',
          roleUrdu: 'حرفِ جر',
          meaningUrdu: 'پر / کے حق میں',
        },
        {
          arabic: 'هِمْ',
          roleUrdu: 'ضمیرِ متصل (جمع مذکر غائب)',
          meaningUrdu: 'ان',
        },
      ],
      ruleIds: ['pronoun', 'preposition'],
    },
    {
      id: '2:6:6',
      ayah: 6,
      position: 6,
      arabic: 'ءَأَنذَرْتَهُمْ',
      meaningUrdu: 'تم ڈراؤ ان کو',
      pos: 'verb',
      posUrdu: 'فعلِ ماضی + ضمیرِ متصل',
      root: 'ن ذ ر',
      lemma: 'أَنْذَرَ',
      morphologyUrdu:
        'فعلِ ماضی، معروف، واحد مذکر حاضر، ثلاثی مزید فیہ — چہارم (IV)، بابِ إِفْعَال۔ سابقہ: ءَ (ہمزۂ تسویہ)۔ لاحقہ: تَ ضمیرِ فاعل، واحد مذکر حاضر؛ هُمْ ضمیرِ مفعول، جمع مذکر غائب۔',
      syntaxUrdu:
        'الهمزة همزة التسوية؛ فعل ماض والتاء ضمير متصل في محل رفع فاعل و«هم» ضمير متصل في محل نصب مفعول به',
      dictionaryUrdu:
        'أَنذَرَ بابِ افعال سے ہے: کسی خطرے سے پہلے آگاہ کر کے ڈرانا۔ شروع کا ہمزہ سوال کا نہیں بلکہ تسویہ کا ہے، اس لیے مفہوم «چاہے تو انہیں ڈرائے» بنتا ہے۔',
      segments: [
        {
          arabic: 'ءَ',
          roleUrdu: 'ہمزۂ تسویہ',
          meaningUrdu: 'چاہے (ہمزۂ تسویہ)',
        },
        {
          arabic: 'أَنذَرْ',
          roleUrdu: 'فعلِ ماضی',
          meaningUrdu: 'ڈرایا',
        },
        {
          arabic: 'تَ',
          roleUrdu: 'ضمیرِ فاعل (واحد مذکر حاضر)',
          meaningUrdu: 'تو نے (فاعل)',
        },
        {
          arabic: 'هُمْ',
          roleUrdu: 'ضمیرِ مفعول (جمع مذکر غائب)',
          meaningUrdu: 'ان کو (مفعول)',
        },
      ],
      ruleIds: [
        'subject-pronoun',
        'object-pronoun',
        'equalization',
        'perfect',
        'derived-form',
        'nominal',
      ],
    },
    {
      id: '2:6:7',
      ayah: 6,
      position: 7,
      arabic: 'أَمْ',
      meaningUrdu: 'یا',
      pos: 'particle',
      posUrdu: 'حرفِ عطف',
      root: null,
      lemma: 'أَم',
      morphologyUrdu: 'حرفِ عطف، مبنی۔',
      syntaxUrdu: 'حرف عطف',
      dictionaryUrdu:
        'أَمْ یہاں ہمزۂ تسویہ کے مقابل آ کر دو صورتیں ملاتا ہے: «یا»۔ دونوں مل کر «چاہے یہ ہو یا وہ» کا اسلوب بناتے ہیں۔',
      segments: [
        {
          arabic: 'أَمْ',
          roleUrdu: 'حرفِ عطف',
          meaningUrdu: 'یا',
        },
      ],
      ruleIds: ['conjunction', 'equalization'],
    },
    {
      id: '2:6:8',
      ayah: 6,
      position: 8,
      arabic: 'لَمْ',
      meaningUrdu: 'نہ',
      pos: 'particle',
      posUrdu: 'حرفِ نفی',
      root: null,
      lemma: 'لَم',
      morphologyUrdu: 'حرفِ نفی، مبنی۔',
      syntaxUrdu: 'حرف نفي',
      dictionaryUrdu:
        'لَمْ مضارع کو جزم دیتا ہے اور اس کے معنی کو ماضی کی نفی میں بدل دیتا ہے: «نہیں کیا»۔ یہاں ڈرانے کے نہ ہونے کو بتاتا ہے۔',
      segments: [
        {
          arabic: 'لَمْ',
          roleUrdu: 'حرفِ نفی',
          meaningUrdu: 'نہیں (ماضی کی نفی)',
        },
      ],
      ruleIds: ['lam-jussive'],
    },
    {
      id: '2:6:9',
      ayah: 6,
      position: 9,
      arabic: 'تُنذِرْهُمْ',
      meaningUrdu: 'تم ڈراؤ انکو',
      pos: 'verb',
      posUrdu: 'فعلِ مضارع + ضمیرِ متصل',
      root: 'ن ذ ر',
      lemma: 'أَنْذَرَ',
      morphologyUrdu:
        'فعلِ مضارع، مجزوم، معروف، واحد مذکر حاضر، ثلاثی مزید فیہ — چہارم (IV)، بابِ إِفْعَال۔ لاحقہ: هُمْ ضمیرِ مفعول، جمع مذکر غائب۔',
      syntaxUrdu: 'فعل مضارع مجزوم و«هم» ضمير متصل في محل نصب مفعول به',
      dictionaryUrdu:
        'یہ أَنذَرَ ہی کا مضارع ہے؛ لَمْ کی وجہ سے مجزوم ہے اور آخر پر سکون ہے۔ فاعل «أَنْتَ» پوشیدہ ہے اور ضمیر مفعول بہ ہے۔',
      segments: [
        {
          arabic: 'تُنذِرْ',
          roleUrdu: 'فعلِ مضارع',
          meaningUrdu: 'ڈرایا (تو نے)',
        },
        {
          arabic: 'هُمْ',
          roleUrdu: 'ضمیرِ مفعول (جمع مذکر غائب)',
          meaningUrdu: 'ان کو (مفعول)',
        },
      ],
      ruleIds: ['object-pronoun', 'imperfect', 'jussive', 'derived-form', 'subject-pronoun'],
    },
    {
      id: '2:6:10',
      ayah: 6,
      position: 10,
      arabic: 'لَا',
      meaningUrdu: 'نہیں',
      pos: 'particle',
      posUrdu: 'حرفِ نفی',
      root: null,
      lemma: 'لَا',
      morphologyUrdu: 'حرفِ نفی، مبنی۔',
      syntaxUrdu: 'حرف نفي',
      dictionaryUrdu:
        'یہ لَا مضارع کی نفی کرتا ہے اور فعل پر عمل نہیں کرتا؛ یہ نفیِ جنس یا نہی کا لَا نہیں۔',
      segments: [
        {
          arabic: 'لَا',
          roleUrdu: 'حرفِ نفی',
          meaningUrdu: 'نہیں',
        },
      ],
      ruleIds: ['negation'],
    },
    {
      id: '2:6:11',
      ayah: 6,
      position: 11,
      arabic: 'يُؤْمِنُونَ',
      meaningUrdu: 'وہ ایمان لائیں گے',
      pos: 'verb',
      posUrdu: 'فعلِ مضارع + ضمیرِ متصل',
      root: 'أ م ن',
      lemma: 'آمَنَ',
      morphologyUrdu:
        'فعلِ مضارع، مرفوع، معروف، جمع مذکر غائب، ثلاثی مزید فیہ — چہارم (IV)، بابِ إِفْعَال۔ لاحقہ: ونَ ضمیرِ فاعل، جمع مذکر غائب۔',
      syntaxUrdu: 'فعل مضارع والواو ضمير متصل في محل رفع فاعل',
      dictionaryUrdu:
        'ءَامَنَ کا مضارع ہے: سچ مان کر قبول کرنا۔ لَا کے بعد بھی یہ مرفوع ہے اور آخر کا نون باقی ہے، کیونکہ یہ لَا جزم یا نصب نہیں دیتا۔',
      segments: [
        {
          arabic: 'يُؤْمِنُ',
          roleUrdu: 'فعلِ مضارع',
          meaningUrdu: 'ایمان لاتے',
        },
        {
          arabic: 'ونَ',
          roleUrdu: 'ضمیرِ فاعل (جمع مذکر غائب)',
          meaningUrdu: 'وہ سب (فاعل)',
        },
      ],
      ruleIds: ['subject-pronoun', 'imperfect', 'derived-form', 'hamzated', 'five-verbs'],
    },
    {
      id: '2:7:1',
      ayah: 7,
      position: 1,
      arabic: 'خَتَمَ',
      meaningUrdu: 'مہر لگادیں',
      pos: 'verb',
      posUrdu: 'فعلِ ماضی',
      root: 'خ ت م',
      lemma: 'خَتَمَ',
      morphologyUrdu: 'فعلِ ماضی، معروف، واحد مذکر غائب، ثلاثی مجرد — اوّل (I)۔',
      syntaxUrdu: 'فعل ماض',
      dictionaryUrdu:
        'خَتَمَ کا مطلب ہے کسی چیز پر مہر لگا کر بند کر دینا تاکہ نہ کچھ اندر جائے نہ باہر نکلے۔ یہ ثلاثی مجرد متعدی فعل ہے اور یہاں عَلَىٰ کے ساتھ آیا ہے۔',
      segments: [
        {
          arabic: 'خَتَمَ',
          roleUrdu: 'فعلِ ماضی',
          meaningUrdu: 'مہر لگا دی',
        },
      ],
      ruleIds: ['perfect', 'verbal-sentence'],
    },
    {
      id: '2:7:2',
      ayah: 7,
      position: 2,
      arabic: 'ٱللَّهُ',
      meaningUrdu: 'اللہ نے',
      pos: 'noun',
      posUrdu: 'اسمِ علم مرفوع',
      root: 'أ ل ه',
      lemma: 'ٱللَّه',
      morphologyUrdu: 'اسمِ علم، مرفوع۔',
      syntaxUrdu: 'لفظ الجلالة مرفوع',
      dictionaryUrdu:
        'اللہ تعالیٰ کا خاص نام ہے، یہاں فاعل ہو کر مرفوع ہے۔ اسے مادہ أ ل ه کے تحت رکھنا لغوی فہرست کی نسبت ہے؛ اس کے اشتقاق میں اختلاف ہے اور کوئی قطعی فیصلہ مراد نہیں۔',
      segments: [
        {
          arabic: 'ٱللَّهُ',
          roleUrdu: 'اسمِ علم مرفوع',
          meaningUrdu: 'اللہ نے',
        },
      ],
      ruleIds: ['proper-noun', 'nominative', 'subject'],
    },
    {
      id: '2:7:3',
      ayah: 7,
      position: 3,
      arabic: 'عَلَىٰ',
      meaningUrdu: 'اوپر',
      pos: 'particle',
      posUrdu: 'حرفِ جر',
      root: null,
      lemma: 'عَلَىٰ',
      morphologyUrdu: 'حرفِ جر، مبنی۔',
      syntaxUrdu: 'حرف جر',
      dictionaryUrdu:
        'عَلَىٰ کا بنیادی معنی «اوپر، پر» ہے۔ یہاں مہر لگنے کی جگہ بتاتا ہے اور خَتَمَ سے متعلق ہے۔',
      segments: [
        {
          arabic: 'عَلَىٰ',
          roleUrdu: 'حرفِ جر',
          meaningUrdu: 'پر',
        },
      ],
      ruleIds: ['preposition'],
    },
    {
      id: '2:7:4',
      ayah: 7,
      position: 4,
      arabic: 'قُلُوبِهِمْ',
      meaningUrdu: 'ان کے دلوں کے',
      pos: 'noun',
      posUrdu: 'اسم مجرور + ضمیرِ متصل',
      root: 'ق ل ب',
      lemma: 'قَلْب',
      morphologyUrdu: 'اسم، جمع مؤنث، مجرور۔ لاحقہ: هِمْ ضمیرِ متصل، جمع مذکر غائب۔',
      syntaxUrdu: 'اسم مجرور و«هم» ضمير متصل في محل جر بالاضافة',
      dictionaryUrdu:
        'قُلُوب قَلْب کی جمعِ تکسیر ہے: دل؛ اس سے سمجھنے اور قبول کرنے کی باطنی قوت بھی مراد لی جاتی ہے۔ مادہ ق ل ب میں پلٹنے کا مفہوم ہے۔',
      segments: [
        {
          arabic: 'قُلُوبِ',
          roleUrdu: 'اسم مجرور',
          meaningUrdu: 'دلوں',
        },
        {
          arabic: 'هِمْ',
          roleUrdu: 'ضمیرِ متصل (جمع مذکر غائب)',
          meaningUrdu: 'ان کے',
        },
      ],
      ruleIds: ['pronoun', 'genitive', 'broken-plural', 'idafa'],
    },
    {
      id: '2:7:5',
      ayah: 7,
      position: 5,
      arabic: 'وَعَلَىٰ',
      meaningUrdu: 'اور اوپر',
      pos: 'particle',
      posUrdu: 'حرفِ جر',
      root: null,
      lemma: 'عَلَىٰ',
      morphologyUrdu: 'حرفِ جر، مبنی۔ سابقہ: وَ (حرفِ عطف)۔',
      syntaxUrdu: 'الواو عاطفة؛ حرف جر',
      dictionaryUrdu:
        'وَ عطف کا ہے اور عَلَىٰ «پر»۔ یہ پچھلے جار مجرور پر معطوف ہو کر خَتَمَ ہی سے متعلق ہے۔',
      segments: [
        {
          arabic: 'وَ',
          roleUrdu: 'حرفِ عطف',
          meaningUrdu: 'اور',
        },
        {
          arabic: 'عَلَىٰ',
          roleUrdu: 'حرفِ جر',
          meaningUrdu: 'پر',
        },
      ],
      ruleIds: ['conjunction', 'preposition'],
    },
    {
      id: '2:7:6',
      ayah: 7,
      position: 6,
      arabic: 'سَمْعِهِمْ',
      meaningUrdu: 'ان کے کانوں کے',
      pos: 'noun',
      posUrdu: 'اسم مجرور + ضمیرِ متصل',
      root: 'س م ع',
      lemma: 'سَمْع',
      morphologyUrdu: 'اسم، مذکر، مجرور۔ لاحقہ: هِمْ ضمیرِ متصل، جمع مذکر غائب۔',
      syntaxUrdu: 'اسم مجرور و«هم» ضمير متصل في محل جر بالاضافة',
      dictionaryUrdu:
        'سَمْع مصدر ہے: سننا اور سننے کی قوت۔ یہ واحد ہے مگر سب کے لیے آیا ہے، کیونکہ مصدر عموماً جمع نہیں ہوتا؛ ترجمے کے «کانوں» سے اسے جمع نہ سمجھیں۔',
      segments: [
        {
          arabic: 'سَمْعِ',
          roleUrdu: 'اسم مجرور',
          meaningUrdu: 'سننے کی قوت (کان)',
        },
        {
          arabic: 'هِمْ',
          roleUrdu: 'ضمیرِ متصل (جمع مذکر غائب)',
          meaningUrdu: 'ان کی',
        },
      ],
      ruleIds: ['pronoun', 'genitive', 'idafa', 'verbal-noun'],
    },
    {
      id: '2:7:7',
      ayah: 7,
      position: 7,
      arabic: 'وَعَلَىٰٓ',
      meaningUrdu: 'اور اوپر',
      pos: 'particle',
      posUrdu: 'حرفِ جر',
      root: null,
      lemma: 'عَلَىٰ',
      morphologyUrdu: 'حرفِ جر، مبنی۔ سابقہ: وَ (حرفِ استئناف)۔',
      syntaxUrdu: 'الواو استئنافية؛ حرف جر',
      dictionaryUrdu:
        'وَ یہاں نئے جملے کا آغاز کرتا ہے اور عَلَىٰ «پر» کے معنی میں ہے۔ یہ جار مجرور خبرِ مقدم ہے؛ مہر کا ذکر پچھلے جملے میں ختم ہو گیا۔',
      segments: [
        {
          arabic: 'وَ',
          roleUrdu: 'حرفِ استئناف',
          meaningUrdu: 'اور',
        },
        {
          arabic: 'عَلَىٰٓ',
          roleUrdu: 'حرفِ جر',
          meaningUrdu: 'پر',
        },
      ],
      ruleIds: ['resumption', 'preposition', 'nominal', 'fronting'],
    },
    {
      id: '2:7:8',
      ayah: 7,
      position: 8,
      arabic: 'أَبْصَـٰرِهِمْ',
      meaningUrdu: 'ان کی آنکھوں کے',
      pos: 'noun',
      posUrdu: 'اسم مجرور + ضمیرِ متصل',
      root: 'ب ص ر',
      lemma: 'بَصَر',
      morphologyUrdu: 'اسم، جمع مذکر، مجرور۔ لاحقہ: هِمْ ضمیرِ متصل، جمع مذکر غائب۔',
      syntaxUrdu: 'اسم مجرور و«هم» ضمير متصل في محل جر بالاضافة',
      dictionaryUrdu:
        'أَبْصَار بَصَر کی جمعِ تکسیر ہے: دیکھنے کی قوت اور آنکھ۔ مادہ ب ص ر میں دیکھنے اور بصیرت کا مفہوم ہے۔',
      segments: [
        {
          arabic: 'أَبْصَـٰرِ',
          roleUrdu: 'اسم مجرور',
          meaningUrdu: 'آنکھوں (نگاہوں)',
        },
        {
          arabic: 'هِمْ',
          roleUrdu: 'ضمیرِ متصل (جمع مذکر غائب)',
          meaningUrdu: 'ان کی',
        },
      ],
      ruleIds: ['pronoun', 'genitive', 'broken-plural', 'idafa'],
    },
    {
      id: '2:7:9',
      ayah: 7,
      position: 9,
      arabic: 'غِشَـٰوَةٌۭ',
      meaningUrdu: 'پردہ ہے',
      pos: 'noun',
      posUrdu: 'اسم مرفوع',
      root: 'غ ش و',
      lemma: 'غِشَٰوَة',
      morphologyUrdu: 'اسم، مؤنث، نکرہ (تنوین)، مرفوع۔',
      syntaxUrdu: 'اسم مرفوع',
      dictionaryUrdu:
        'غِشَٰوَة ڈھانپنے والی چیز اور پردے کو کہتے ہیں۔ یہ مبتدائے مؤخر ہے؛ آخر کی گول تاء مؤنث کی علامت ہے۔',
      segments: [
        {
          arabic: 'غِشَـٰوَةٌۭ',
          roleUrdu: 'اسم مرفوع',
          meaningUrdu: 'پردہ',
        },
      ],
      ruleIds: ['nominative', 'indefinite', 'nominal', 'fronting'],
    },
    {
      id: '2:7:10',
      ayah: 7,
      position: 10,
      arabic: 'وَلَهُمْ',
      meaningUrdu: 'ان کے لئے',
      pos: 'particle',
      posUrdu: 'حرفِ جر + ضمیرِ متصل',
      root: null,
      lemma: null,
      morphologyUrdu:
        'حرفِ جر + ضمیرِ متصل، جمع مذکر غائب، مبنی۔ سابقہ: وَ (حرفِ استئناف)؛ لَ (حرفِ جر)۔',
      syntaxUrdu: 'الواو استئنافية؛ جار ومجرور',
      dictionaryUrdu:
        'لِ ملکیت اور حق کے لیے ہے: «کے لیے»؛ ضمیر سے پہلے یہ لام فتحہ سے پڑھا جاتا ہے۔ یہاں ضمیر متصل ہے جو حرفِ جر کی وجہ سے محلِ جر میں ہے، منفصل نہیں۔',
      segments: [
        {
          arabic: 'وَ',
          roleUrdu: 'حرفِ استئناف',
          meaningUrdu: 'اور',
        },
        {
          arabic: 'لَ',
          roleUrdu: 'حرفِ جر',
          meaningUrdu: 'کے لیے',
        },
        {
          arabic: 'هُمْ',
          roleUrdu: 'ضمیرِ متصل (مجرور)',
          meaningUrdu: 'ان',
        },
      ],
      ruleIds: ['resumption', 'preposition', 'pronoun', 'nominal', 'fronting'],
    },
    {
      id: '2:7:11',
      ayah: 7,
      position: 11,
      arabic: 'عَذَابٌ',
      meaningUrdu: 'عذاب ہے',
      pos: 'noun',
      posUrdu: 'اسم مرفوع',
      root: 'ع ذ ب',
      lemma: 'عَذَاب',
      morphologyUrdu: 'اسم، مذکر، نکرہ (تنوین)، مرفوع۔',
      syntaxUrdu: 'اسم مرفوع',
      dictionaryUrdu:
        'عَذَاب سخت تکلیف دینے والی سزا کو کہتے ہیں۔ یہاں یہ مبتدائے مؤخر ہے اور اس کی خبر پہلے آنے والا جار مجرور ہے۔',
      segments: [
        {
          arabic: 'عَذَابٌ',
          roleUrdu: 'اسم مرفوع',
          meaningUrdu: 'عذاب',
        },
      ],
      ruleIds: ['nominative', 'indefinite', 'nominal', 'fronting'],
    },
    {
      id: '2:7:12',
      ayah: 7,
      position: 12,
      arabic: 'عَظِيمٌۭ',
      meaningUrdu: 'بڑا',
      pos: 'adjective',
      posUrdu: 'صفت مرفوع',
      root: 'ع ظ م',
      lemma: 'عَظِيم',
      morphologyUrdu: 'صفت، واحد مذکر، نکرہ (تنوین)، مرفوع۔',
      syntaxUrdu: 'صفة مرفوعة',
      dictionaryUrdu:
        'عَظِيم فَعِيل کے وزن پر صفتِ مشبہ ہے: بہت بڑا، بھاری۔ یہ پچھلے اسم کی صفت ہے، اس لیے رفع، تنوین اور تذکیر میں اسی کے مطابق ہے۔',
      segments: [
        {
          arabic: 'عَظِيمٌۭ',
          roleUrdu: 'صفت مرفوع',
          meaningUrdu: 'بڑا',
        },
      ],
      ruleIds: ['nominative', 'indefinite', 'adjective'],
    },
    {
      id: '2:8:1',
      ayah: 8,
      position: 1,
      arabic: 'وَمِنَ',
      meaningUrdu: 'اور بعض',
      pos: 'particle',
      posUrdu: 'حرفِ جر',
      root: null,
      lemma: 'مِن',
      morphologyUrdu: 'حرفِ جر، مبنی۔ سابقہ: وَ (حرفِ استئناف)۔',
      syntaxUrdu: 'الواو استئنافية؛ حرف جر',
      dictionaryUrdu:
        'مِنْ یہاں بعض کے معنی دیتا ہے: «لوگوں میں سے کچھ»۔ اگلے لفظ کے ساکن لام سے ملنے کے لیے نون پر فتحہ آیا ہے؛ یہ جار مجرور خبرِ مقدم ہے۔',
      segments: [
        {
          arabic: 'وَ',
          roleUrdu: 'حرفِ استئناف',
          meaningUrdu: 'اور',
        },
        {
          arabic: 'مِنَ',
          roleUrdu: 'حرفِ جر',
          meaningUrdu: 'میں سے (بعض)',
        },
      ],
      ruleIds: ['resumption', 'preposition', 'nominal', 'fronting'],
    },
    {
      id: '2:8:2',
      ayah: 8,
      position: 2,
      arabic: 'ٱلنَّاسِ',
      meaningUrdu: 'لوگ ہیں',
      pos: 'noun',
      posUrdu: 'اسم مجرور',
      root: 'ن و س',
      lemma: 'نَاس',
      morphologyUrdu: 'اسم، جمع مذکر، ال کے ساتھ معرفہ، مجرور۔ سابقہ: ٱل (حرفِ تعریف)۔',
      syntaxUrdu: 'اسم مجرور',
      dictionaryUrdu:
        'نَاس انسانوں اور لوگوں کے لیے آتا ہے۔ اسے ن و س کے تحت رکھنا لغوی درجہ بندی ہے، اس کے اشتقاق میں مختلف اقوال ہیں؛ ال کا لام شمسی نون میں مدغم ہے۔',
      segments: [
        {
          arabic: 'ٱل',
          roleUrdu: 'حرفِ تعریف',
          meaningUrdu: 'تعریف (معرفہ بنانے والا)',
        },
        {
          arabic: 'نَّاسِ',
          roleUrdu: 'اسم مجرور',
          meaningUrdu: 'لوگ',
        },
      ],
      ruleIds: ['definite', 'genitive'],
    },
    {
      id: '2:8:3',
      ayah: 8,
      position: 3,
      arabic: 'مَن',
      meaningUrdu: 'جو',
      pos: 'pronoun',
      posUrdu: 'اسمِ موصول',
      root: null,
      lemma: 'مَن',
      morphologyUrdu: 'اسمِ موصول، مبنی۔',
      syntaxUrdu: 'اسم موصول',
      dictionaryUrdu:
        'مَنْ عاقل کے لیے اسمِ موصول ہے: «وہ جو»۔ لفظ واحد ہے مگر معنی میں کئی لوگ آ سکتے ہیں؛ اسی لیے فعل واحد ہے اور بعد کی ضمیریں جمع ہیں۔',
      segments: [
        {
          arabic: 'مَن',
          roleUrdu: 'اسمِ موصول',
          meaningUrdu: 'جو (شخص)',
        },
      ],
      ruleIds: ['relative', 'nominal', 'fronting'],
    },
    {
      id: '2:8:4',
      ayah: 8,
      position: 4,
      arabic: 'يَقُولُ',
      meaningUrdu: 'کہتے ہیں',
      pos: 'verb',
      posUrdu: 'فعلِ مضارع',
      root: 'ق و ل',
      lemma: 'قَالَ',
      morphologyUrdu: 'فعلِ مضارع، مرفوع، معروف، واحد مذکر غائب، ثلاثی مجرد — اوّل (I)۔',
      syntaxUrdu: 'فعل مضارع',
      dictionaryUrdu:
        'قَالَ کا مضارع ہے: بات کہنا۔ مادہ ق و ل اجوف ہے؛ فاعل پوشیدہ ضمیر ہے جو مَنْ کے لفظ کی رعایت سے واحد ہے، اگرچہ ترجمہ جمع میں ہے۔',
      segments: [
        {
          arabic: 'يَقُولُ',
          roleUrdu: 'فعلِ مضارع',
          meaningUrdu: 'کہتے ہیں',
        },
      ],
      ruleIds: ['imperfect', 'weak-verb', 'subject-pronoun', 'quoted-speech'],
    },
    {
      id: '2:8:5',
      ayah: 8,
      position: 5,
      arabic: 'ءَامَنَّا',
      meaningUrdu: 'ایمان لائے ہم',
      pos: 'verb',
      posUrdu: 'فعلِ ماضی + ضمیرِ متصل',
      root: 'أ م ن',
      lemma: 'آمَنَ',
      morphologyUrdu:
        'فعلِ ماضی، معروف، جمع متکلم، ثلاثی مزید فیہ — چہارم (IV)، بابِ إِفْعَال۔ لاحقہ: نَّا ضمیرِ فاعل، جمع متکلم۔',
      syntaxUrdu: 'فعل ماض و«نا» ضمير متصل في محل رفع فاعل',
      dictionaryUrdu:
        'ءَامَنَ کا ماضی ہے: سچ مان کر قبول کیا۔ مادے کا آخری نون اور ضمیر کا نون مل کر مشدد ہو گئے، اس لیے فعل کا نون الگ دکھائی نہیں دیتا۔',
      segments: [
        {
          arabic: 'ءَامَ',
          roleUrdu: 'فعلِ ماضی',
          meaningUrdu: 'ایمان لائے',
        },
        {
          arabic: 'نَّا',
          roleUrdu: 'ضمیرِ فاعل (جمع متکلم)',
          meaningUrdu: 'ہم (فاعل)',
        },
      ],
      ruleIds: ['subject-pronoun', 'perfect', 'derived-form', 'hamzated', 'quoted-speech'],
    },
    {
      id: '2:8:6',
      ayah: 8,
      position: 6,
      arabic: 'بِٱللَّهِ',
      meaningUrdu: 'اللہ پر',
      pos: 'noun',
      posUrdu: 'اسمِ علم مجرور',
      root: 'أ ل ه',
      lemma: 'ٱللَّه',
      morphologyUrdu: 'اسمِ علم، مجرور۔ سابقہ: بِ (حرفِ جر)۔',
      syntaxUrdu: 'جار ومجرور',
      dictionaryUrdu:
        'بِ یہاں ایمان کے متعلق کو بتاتا ہے: «اللہ پر»۔ یہ اللہ تعالیٰ کا خاص نام ہے؛ اسے مادہ أ ل ه کے تحت رکھنا لغوی فہرست کی نسبت ہے؛ اس کے اشتقاق میں اختلاف ہے اور کوئی قطعی فیصلہ مراد نہیں۔',
      segments: [
        {
          arabic: 'بِ',
          roleUrdu: 'حرفِ جر',
          meaningUrdu: 'پر',
        },
        {
          arabic: 'ٱللَّهِ',
          roleUrdu: 'اسمِ علم مجرور',
          meaningUrdu: 'اللہ',
        },
      ],
      ruleIds: ['preposition', 'proper-noun', 'genitive'],
    },
    {
      id: '2:8:7',
      ayah: 8,
      position: 7,
      arabic: 'وَبِٱلْيَوْمِ',
      meaningUrdu: 'اور یوم',
      pos: 'noun',
      posUrdu: 'اسم مجرور',
      root: 'ي و م',
      lemma: 'يَوْم',
      morphologyUrdu:
        'اسم، مذکر، ال کے ساتھ معرفہ، مجرور۔ سابقہ: وَ (حرفِ عطف)؛ بِ (حرفِ جر)؛ ٱلْ (حرفِ تعریف)۔',
      syntaxUrdu: 'الواو عاطفة؛ جار ومجرور',
      dictionaryUrdu:
        'يَوْم کا مطلب دن ہے، اور کبھی کسی خاص وقت یا دور کے لیے بھی آتا ہے۔ یہاں بعد کی صفت کے ساتھ ایک خاص دن مراد ہے۔',
      segments: [
        {
          arabic: 'وَ',
          roleUrdu: 'حرفِ عطف',
          meaningUrdu: 'اور',
        },
        {
          arabic: 'بِ',
          roleUrdu: 'حرفِ جر',
          meaningUrdu: 'پر',
        },
        {
          arabic: 'ٱلْ',
          roleUrdu: 'حرفِ تعریف',
          meaningUrdu: 'تعریف (معرفہ بنانے والا)',
        },
        {
          arabic: 'يَوْمِ',
          roleUrdu: 'اسم مجرور',
          meaningUrdu: 'دن',
        },
      ],
      ruleIds: ['conjunction', 'preposition', 'definite', 'genitive'],
    },
    {
      id: '2:8:8',
      ayah: 8,
      position: 8,
      arabic: 'ٱلْـَٔاخِرِ',
      meaningUrdu: 'آخرت پر',
      pos: 'adjective',
      posUrdu: 'صفت مجرور',
      root: 'أ خ ر',
      lemma: 'آخِر',
      morphologyUrdu: 'صفت، واحد مذکر، ال کے ساتھ معرفہ، مجرور۔ سابقہ: ٱلْ (حرفِ تعریف)۔',
      syntaxUrdu: 'صفة مجرورة',
      dictionaryUrdu:
        'آخِر کا مطلب ہے سب سے پیچھے آنے والا۔ یہ صفت ہے، اسی لیے اپنے موصوف کی طرح معرفہ اور مجرور ہے۔',
      segments: [
        {
          arabic: 'ٱلْ',
          roleUrdu: 'حرفِ تعریف',
          meaningUrdu: 'تعریف (معرفہ بنانے والا)',
        },
        {
          arabic: 'ـَٔاخِرِ',
          roleUrdu: 'صفت مجرور',
          meaningUrdu: 'آخری',
        },
      ],
      ruleIds: ['definite', 'genitive', 'adjective'],
    },
    {
      id: '2:8:9',
      ayah: 8,
      position: 9,
      arabic: 'وَمَا',
      meaningUrdu: 'اور نہیں',
      pos: 'particle',
      posUrdu: 'حرفِ نفی',
      root: null,
      lemma: 'مَا',
      morphologyUrdu: 'حرفِ نفی، مبنی۔ سابقہ: وَ (واوِ حالیہ)۔',
      syntaxUrdu: 'الواو حالية؛ نافية بمنزلة «ليس»',
      dictionaryUrdu:
        'وَ یہاں حال کا ہے: «حالانکہ»۔ مَا نفی کا ہے جو لَيْسَ کی طرح عمل کرتا ہے؛ یہ مَا موصول یا سوالیہ نہیں۔',
      segments: [
        {
          arabic: 'وَ',
          roleUrdu: 'واوِ حالیہ',
          meaningUrdu: 'حالانکہ (واوِ حالیہ)',
        },
        {
          arabic: 'مَا',
          roleUrdu: 'حرفِ نفی',
          meaningUrdu: 'نہیں',
        },
      ],
      ruleIds: ['negation', 'kana', 'haal'],
    },
    {
      id: '2:8:10',
      ayah: 8,
      position: 10,
      arabic: 'هُم',
      meaningUrdu: 'وہ',
      pos: 'pronoun',
      posUrdu: 'ضمیرِ منفصل',
      root: null,
      lemma: null,
      morphologyUrdu: 'ضمیرِ منفصل، جمع مذکر غائب، مبنی۔',
      syntaxUrdu: 'ضمير منفصل',
      dictionaryUrdu:
        'یہ جمع مذکر غائب کی ضمیرِ منفصل ہے: «وہ لوگ»۔ یہاں نفی والے مَا کا اسم ہے، اور جمع ضمیر مَنْ کے معنی کی رعایت سے آئی ہے۔',
      segments: [
        {
          arabic: 'هُم',
          roleUrdu: 'ضمیرِ منفصل',
          meaningUrdu: 'وہ',
        },
      ],
      ruleIds: ['independent-pronoun', 'kana'],
    },
    {
      id: '2:8:11',
      ayah: 8,
      position: 11,
      arabic: 'بِمُؤْمِنِينَ',
      meaningUrdu: 'ایمان لانے والے',
      pos: 'noun',
      posUrdu: 'اسمِ فاعل مجرور',
      root: 'أ م ن',
      lemma: 'مُؤْمِن',
      morphologyUrdu:
        'اسمِ فاعل، ثلاثی مزید فیہ — چہارم (IV)، بابِ إِفْعَال، جمع مذکر، مجرور۔ سابقہ: بِ (حرفِ جر)۔',
      syntaxUrdu: 'جار ومجرور',
      dictionaryUrdu:
        'مُؤْمِن ءَامَنَ کا اسمِ فاعل ہے: ایمان رکھنے والا؛ یہ اسم ہے، فعل نہیں۔ بِ یہاں زائد ہے جو نفی کو پختہ کرتا ہے؛ لفظ مجرور ہے مگر محل میں منصوب خبر ہے۔',
      segments: [
        {
          arabic: 'بِ',
          roleUrdu: 'حرفِ جر',
          meaningUrdu: 'ہرگز (تاکید کے لیے زائد)',
        },
        {
          arabic: 'مُؤْمِنِينَ',
          roleUrdu: 'اسمِ فاعل مجرور',
          meaningUrdu: 'ایمان والے',
        },
      ],
      ruleIds: ['preposition', 'genitive', 'participle', 'sound-plural', 'extra-particle', 'kana'],
    },
    {
      id: '2:9:1',
      ayah: 9,
      position: 1,
      arabic: 'يُخَـٰدِعُونَ',
      meaningUrdu: 'وہ دھوکہ دیتے ہیں',
      pos: 'verb',
      posUrdu: 'فعلِ مضارع + ضمیرِ متصل',
      root: 'خ د ع',
      lemma: 'خَادَعَ',
      morphologyUrdu:
        'فعلِ مضارع، مرفوع، معروف، جمع مذکر غائب، ثلاثی مزید فیہ — سوم (III)، بابِ مُفَاعَلَة۔ لاحقہ: ونَ ضمیرِ فاعل، جمع مذکر غائب۔',
      syntaxUrdu: 'فعل مضارع والواو ضمير متصل في محل رفع فاعل',
      dictionaryUrdu:
        'خَادَعَ بابِ مفاعلہ سے ہے؛ خَدَعَ کا مطلب چھپ کر نقصان پہنچانے کی تدبیر کرنا ہے۔ یہ باب دو طرفہ عمل یا کوشش کا مفہوم دیتا ہے: «دھوکہ دینے کی کوشش کرتے ہیں»۔',
      segments: [
        {
          arabic: 'يُخَـٰدِعُ',
          roleUrdu: 'فعلِ مضارع',
          meaningUrdu: 'دھوکہ دیتے ہیں',
        },
        {
          arabic: 'ونَ',
          roleUrdu: 'ضمیرِ فاعل (جمع مذکر غائب)',
          meaningUrdu: 'وہ سب (فاعل)',
        },
      ],
      ruleIds: ['subject-pronoun', 'imperfect', 'derived-form', 'five-verbs'],
    },
    {
      id: '2:9:2',
      ayah: 9,
      position: 2,
      arabic: 'ٱللَّهَ',
      meaningUrdu: 'اللہ کو',
      pos: 'noun',
      posUrdu: 'اسمِ علم منصوب',
      root: 'أ ل ه',
      lemma: 'ٱللَّه',
      morphologyUrdu: 'اسمِ علم، منصوب۔',
      syntaxUrdu: 'لفظ الجلالة منصوب',
      dictionaryUrdu:
        'اللہ تعالیٰ کا خاص نام ہے، یہاں مفعول بہ ہو کر منصوب ہے۔ اسے مادہ أ ل ه کے تحت رکھنا لغوی فہرست کی نسبت ہے؛ اس کے اشتقاق میں اختلاف ہے اور کوئی قطعی فیصلہ مراد نہیں۔',
      segments: [
        {
          arabic: 'ٱللَّهَ',
          roleUrdu: 'اسمِ علم منصوب',
          meaningUrdu: 'اللہ کو',
        },
      ],
      ruleIds: ['proper-noun', 'accusative', 'object'],
    },
    {
      id: '2:9:3',
      ayah: 9,
      position: 3,
      arabic: 'وَٱلَّذِينَ',
      meaningUrdu: 'اور ان لوگوں کو',
      pos: 'pronoun',
      posUrdu: 'اسمِ موصول',
      root: null,
      lemma: 'ٱلَّذِى',
      morphologyUrdu: 'اسمِ موصول، جمع مذکر، مبنی۔ سابقہ: وَ (حرفِ عطف)۔',
      syntaxUrdu: 'الواو عاطفة؛ اسم موصول',
      dictionaryUrdu:
        'وَ عطف کا ہے اور ٱلَّذِينَ اسمِ موصول؛ یہ لفظِ جلالہ پر معطوف ہو کر محلِ نصب میں ہے: «اور ان لوگوں کو جو»۔',
      segments: [
        {
          arabic: 'وَ',
          roleUrdu: 'حرفِ عطف',
          meaningUrdu: 'اور',
        },
        {
          arabic: 'ٱلَّذِينَ',
          roleUrdu: 'اسمِ موصول',
          meaningUrdu: 'ان لوگوں کو جو',
        },
      ],
      ruleIds: ['conjunction', 'relative'],
    },
    {
      id: '2:9:4',
      ayah: 9,
      position: 4,
      arabic: 'ءَامَنُوا۟',
      meaningUrdu: 'جو ایمان لائے',
      pos: 'verb',
      posUrdu: 'فعلِ ماضی + ضمیرِ متصل',
      root: 'أ م ن',
      lemma: 'آمَنَ',
      morphologyUrdu:
        'فعلِ ماضی، معروف، جمع مذکر غائب، ثلاثی مزید فیہ — چہارم (IV)، بابِ إِفْعَال۔ لاحقہ: وا۟ ضمیرِ فاعل، جمع مذکر غائب۔',
      syntaxUrdu: 'فعل ماض والواو ضمير متصل في محل رفع فاعل',
      dictionaryUrdu:
        'ءَامَنَ کا ماضی جمع مذکر غائب ہے: «ایمان لائے»۔ شروع کا مد والا الف ہمزہ اور الف سے مل کر بنا ہے، اور آخر کا الف لکھا جاتا ہے مگر پڑھا نہیں جاتا۔',
      segments: [
        {
          arabic: 'ءَامَنُ',
          roleUrdu: 'فعلِ ماضی',
          meaningUrdu: 'ایمان لائے',
        },
        {
          arabic: 'وا۟',
          roleUrdu: 'ضمیرِ فاعل (جمع مذکر غائب)',
          meaningUrdu: 'وہ سب (فاعل)',
        },
      ],
      ruleIds: ['subject-pronoun', 'perfect', 'derived-form', 'hamzated'],
    },
    {
      id: '2:9:5',
      ayah: 9,
      position: 5,
      arabic: 'وَمَا',
      meaningUrdu: 'اور نہیں',
      pos: 'particle',
      posUrdu: 'حرفِ نفی',
      root: null,
      lemma: 'مَا',
      morphologyUrdu: 'حرفِ نفی، مبنی۔ سابقہ: وَ (حرفِ استئناف)۔',
      syntaxUrdu: 'الواو استئنافية؛ حرف نفي',
      dictionaryUrdu:
        'مَا یہاں نفی کا ہے اور فعلِ مضارع پر عمل نہیں کرتا۔ آگے إِلَّا کے ساتھ مل کر حصر بنتا ہے: «صرف ... ہی»۔',
      segments: [
        {
          arabic: 'وَ',
          roleUrdu: 'حرفِ استئناف',
          meaningUrdu: 'اور',
        },
        {
          arabic: 'مَا',
          roleUrdu: 'حرفِ نفی',
          meaningUrdu: 'نہیں',
        },
      ],
      ruleIds: ['resumption', 'negation'],
    },
    {
      id: '2:9:6',
      ayah: 9,
      position: 6,
      arabic: 'يَخْدَعُونَ',
      meaningUrdu: 'وہ دھوکہ دیتے',
      pos: 'verb',
      posUrdu: 'فعلِ مضارع + ضمیرِ متصل',
      root: 'خ د ع',
      lemma: 'خَدَعَ',
      morphologyUrdu:
        'فعلِ مضارع، مرفوع، معروف، جمع مذکر غائب، ثلاثی مجرد — اوّل (I)۔ لاحقہ: ونَ ضمیرِ فاعل، جمع مذکر غائب۔',
      syntaxUrdu: 'فعل مضارع والواو ضمير متصل في محل رفع فاعل',
      dictionaryUrdu:
        'خَدَعَ ثلاثی مجرد ہے: چھپ کر نقصان پہنچانے کی تدبیر کرنا۔ یہ پچھلے لفظ والا بابِ مفاعلہ نہیں؛ دونوں کے وزن کا فرق پہچانیں۔',
      segments: [
        {
          arabic: 'يَخْدَعُ',
          roleUrdu: 'فعلِ مضارع',
          meaningUrdu: 'دھوکہ دیتے',
        },
        {
          arabic: 'ونَ',
          roleUrdu: 'ضمیرِ فاعل (جمع مذکر غائب)',
          meaningUrdu: 'وہ سب (فاعل)',
        },
      ],
      ruleIds: ['subject-pronoun', 'imperfect', 'five-verbs'],
    },
    {
      id: '2:9:7',
      ayah: 9,
      position: 7,
      arabic: 'إِلَّآ',
      meaningUrdu: 'مگر',
      pos: 'particle',
      posUrdu: 'حرفِ حصر',
      root: null,
      lemma: 'إِلَّا',
      morphologyUrdu: 'حرفِ حصر، مبنی۔',
      syntaxUrdu: 'أداة حصر',
      dictionaryUrdu:
        'إِلَّا عام طور پر استثنا کا حرف ہے، مگر یہاں نفی کے بعد کلام نامکمل ہے، اس لیے یہ حصر کا فائدہ دیتا ہے: «صرف»؛ بعد کا لفظ اپنے کردار کے مطابق منصوب ہے۔',
      segments: [
        {
          arabic: 'إِلَّآ',
          roleUrdu: 'حرفِ حصر',
          meaningUrdu: 'مگر / صرف',
        },
      ],
      ruleIds: ['restriction'],
    },
    {
      id: '2:9:8',
      ayah: 9,
      position: 8,
      arabic: 'أَنفُسَهُمْ',
      meaningUrdu: 'اپنے نفسوں کو',
      pos: 'noun',
      posUrdu: 'اسم منصوب + ضمیرِ متصل',
      root: 'ن ف س',
      lemma: 'نَفْس',
      morphologyUrdu: 'اسم، جمع مؤنث، منصوب۔ لاحقہ: هُمْ ضمیرِ متصل، جمع مذکر غائب۔',
      syntaxUrdu: 'اسم منصوب و«هم» ضمير متصل في محل جر بالاضافة',
      dictionaryUrdu:
        'أَنفُس نَفْس کی جمعِ تکسیر ہے: جان اور ذات؛ ضمیر کے ساتھ «اپنے آپ» کا مفہوم دیتا ہے۔ یہاں مفعول بہ ہو کر منصوب ہے۔',
      segments: [
        {
          arabic: 'أَنفُسَ',
          roleUrdu: 'اسم منصوب',
          meaningUrdu: 'اپنی جانوں کو',
        },
        {
          arabic: 'هُمْ',
          roleUrdu: 'ضمیرِ متصل (جمع مذکر غائب)',
          meaningUrdu: 'ان (کی)',
        },
      ],
      ruleIds: ['pronoun', 'accusative', 'broken-plural', 'object', 'idafa'],
    },
    {
      id: '2:9:9',
      ayah: 9,
      position: 9,
      arabic: 'وَمَا',
      meaningUrdu: 'اور نہیں',
      pos: 'particle',
      posUrdu: 'حرفِ نفی',
      root: null,
      lemma: 'مَا',
      morphologyUrdu: 'حرفِ نفی، مبنی۔ سابقہ: وَ (واوِ حالیہ)۔',
      syntaxUrdu: 'الواو حالية؛ حرف نفي',
      dictionaryUrdu:
        'وَ یہاں حالیہ ہے: «حالانکہ»؛ اور مَا نفی کا ہے جو مضارع پر عمل نہیں کرتا۔ یہ جملہ ان کی حالت بتاتا ہے۔',
      segments: [
        {
          arabic: 'وَ',
          roleUrdu: 'واوِ حالیہ',
          meaningUrdu: 'حالانکہ (واوِ حالیہ)',
        },
        {
          arabic: 'مَا',
          roleUrdu: 'حرفِ نفی',
          meaningUrdu: 'نہیں',
        },
      ],
      ruleIds: ['negation', 'haal'],
    },
    {
      id: '2:9:10',
      ayah: 9,
      position: 10,
      arabic: 'يَشْعُرُونَ',
      meaningUrdu: 'وہ شعور رکھتے',
      pos: 'verb',
      posUrdu: 'فعلِ مضارع + ضمیرِ متصل',
      root: 'ش ع ر',
      lemma: 'شَعَرَ',
      morphologyUrdu:
        'فعلِ مضارع، مرفوع، معروف، جمع مذکر غائب، ثلاثی مجرد — اوّل (I)۔ لاحقہ: ونَ ضمیرِ فاعل، جمع مذکر غائب۔',
      syntaxUrdu: 'فعل مضارع والواو ضمير متصل في محل رفع فاعل',
      dictionaryUrdu:
        'شَعَرَ کا مطلب کسی باریک بات کو حس سے جان لینا ہے؛ اسی سے شعور ہے۔ یہاں مفعول محذوف ہے، یعنی جس بات کا انہیں احساس نہیں وہ سیاق سے سمجھی جاتی ہے۔',
      segments: [
        {
          arabic: 'يَشْعُرُ',
          roleUrdu: 'فعلِ مضارع',
          meaningUrdu: 'شعور رکھتے / سمجھتے',
        },
        {
          arabic: 'ونَ',
          roleUrdu: 'ضمیرِ فاعل (جمع مذکر غائب)',
          meaningUrdu: 'وہ سب (فاعل)',
        },
      ],
      ruleIds: ['subject-pronoun', 'imperfect', 'five-verbs', 'elision'],
    },
    {
      id: '2:10:1',
      ayah: 10,
      position: 1,
      arabic: 'فِى',
      meaningUrdu: 'میں',
      pos: 'particle',
      posUrdu: 'حرفِ جر',
      root: null,
      lemma: 'فِى',
      morphologyUrdu: 'حرفِ جر، مبنی۔',
      syntaxUrdu: 'حرف جر',
      dictionaryUrdu:
        'فِي ظرفیت کے لیے ہے: «میں، کے اندر»۔ یہ جار مجرور خبرِ مقدم ہے اور دلوں کے اندر کی کیفیت بتاتا ہے۔',
      segments: [
        {
          arabic: 'فِى',
          roleUrdu: 'حرفِ جر',
          meaningUrdu: 'میں',
        },
      ],
      ruleIds: ['preposition', 'nominal', 'fronting'],
    },
    {
      id: '2:10:2',
      ayah: 10,
      position: 2,
      arabic: 'قُلُوبِهِم',
      meaningUrdu: 'ان کے دلوں',
      pos: 'noun',
      posUrdu: 'اسم مجرور + ضمیرِ متصل',
      root: 'ق ل ب',
      lemma: 'قَلْب',
      morphologyUrdu: 'اسم، جمع مؤنث، مجرور۔ لاحقہ: هِم ضمیرِ متصل، جمع مذکر غائب۔',
      syntaxUrdu: 'اسم مجرور و«هم» ضمير متصل في محل جر بالاضافة',
      dictionaryUrdu:
        'قُلُوب قَلْب کی جمعِ تکسیر ہے: دل اور باطن۔ ضمیر کی میم اگلے لفظ کی میم میں مدغم ہوتی ہے، اسی لیے اس پر سکون نہیں لکھا گیا۔',
      segments: [
        {
          arabic: 'قُلُوبِ',
          roleUrdu: 'اسم مجرور',
          meaningUrdu: 'دلوں',
        },
        {
          arabic: 'هِم',
          roleUrdu: 'ضمیرِ متصل (جمع مذکر غائب)',
          meaningUrdu: 'ان کے',
        },
      ],
      ruleIds: ['pronoun', 'genitive', 'broken-plural', 'idafa'],
    },
    {
      id: '2:10:3',
      ayah: 10,
      position: 3,
      arabic: 'مَّرَضٌۭ',
      meaningUrdu: 'بیماری ہے',
      pos: 'noun',
      posUrdu: 'اسم مرفوع',
      root: 'م ر ض',
      lemma: 'مَرَض',
      morphologyUrdu: 'اسم، مذکر، نکرہ (تنوین)، مرفوع۔',
      syntaxUrdu: 'اسم مرفوع',
      dictionaryUrdu:
        'مَرَض بیماری اور صحت سے ہٹ جانے کو کہتے ہیں؛ یہاں دلوں کی بیماری کا ذکر ہے۔ یہ نکرہ مبتدائے مؤخر ہے اور اس کی خبر پہلے آ چکی ہے۔',
      segments: [
        {
          arabic: 'مَّرَضٌۭ',
          roleUrdu: 'اسم مرفوع',
          meaningUrdu: 'بیماری',
        },
      ],
      ruleIds: ['nominative', 'indefinite', 'nominal', 'fronting'],
    },
    {
      id: '2:10:4',
      ayah: 10,
      position: 4,
      arabic: 'فَزَادَهُمُ',
      meaningUrdu: 'پس زیادہ کیا ان کو / بڑھایا ان کو',
      pos: 'verb',
      posUrdu: 'فعلِ ماضی + ضمیرِ متصل',
      root: 'ز ي د',
      lemma: 'زَادَ',
      morphologyUrdu:
        'فعلِ ماضی، معروف، واحد مذکر غائب، ثلاثی مجرد — اوّل (I)۔ سابقہ: فَ (حرفِ استئناف)۔ لاحقہ: هُمُ ضمیرِ مفعول، جمع مذکر غائب۔',
      syntaxUrdu: 'الفاء استئنافية؛ فعل ماض و«هم» ضمير متصل في محل نصب مفعول به',
      dictionaryUrdu:
        'زَادَ کا مطلب بڑھانا اور زیادہ کرنا ہے؛ یہ دو مفعول لیتا ہے۔ مادہ ز ي د اجوف ہے؛ درمیانی یاء ماضی میں الف بن گئی، اس لیے اصل حرف نظر نہیں آتا۔',
      segments: [
        {
          arabic: 'فَ',
          roleUrdu: 'حرفِ استئناف',
          meaningUrdu: 'تو / پس',
        },
        {
          arabic: 'زَادَ',
          roleUrdu: 'فعلِ ماضی',
          meaningUrdu: 'بڑھا دیا',
        },
        {
          arabic: 'هُمُ',
          roleUrdu: 'ضمیرِ مفعول (جمع مذکر غائب)',
          meaningUrdu: 'ان کو (پہلا مفعول)',
        },
      ],
      ruleIds: [
        'object-pronoun',
        'resumption',
        'perfect',
        'weak-verb',
        'two-objects',
        'verbal-sentence',
      ],
    },
    {
      id: '2:10:5',
      ayah: 10,
      position: 5,
      arabic: 'ٱللَّهُ',
      meaningUrdu: 'اللہ نے',
      pos: 'noun',
      posUrdu: 'اسمِ علم مرفوع',
      root: 'أ ل ه',
      lemma: 'ٱللَّه',
      morphologyUrdu: 'اسمِ علم، مرفوع۔',
      syntaxUrdu: 'لفظ الجلالة مرفوع',
      dictionaryUrdu:
        'اللہ تعالیٰ کا خاص نام ہے، یہاں فاعل ہو کر مرفوع ہے۔ اسے مادہ أ ل ه کے تحت رکھنا لغوی فہرست کی نسبت ہے؛ اس کے اشتقاق میں اختلاف ہے اور کوئی قطعی فیصلہ مراد نہیں۔',
      segments: [
        {
          arabic: 'ٱللَّهُ',
          roleUrdu: 'اسمِ علم مرفوع',
          meaningUrdu: 'اللہ نے',
        },
      ],
      ruleIds: ['proper-noun', 'nominative', 'subject'],
    },
    {
      id: '2:10:6',
      ayah: 10,
      position: 6,
      arabic: 'مَرَضًۭا',
      meaningUrdu: 'بیماری میں',
      pos: 'noun',
      posUrdu: 'اسم منصوب',
      root: 'م ر ض',
      lemma: 'مَرَض',
      morphologyUrdu: 'اسم، مذکر، نکرہ (تنوین)، منصوب۔',
      syntaxUrdu: 'اسم منصوب',
      dictionaryUrdu:
        'مَرَض کا مطلب بیماری ہے۔ یہاں زَادَ کا دوسرا مفعول ہو کر منصوب ہے؛ تنوینِ فتح کا الف لکھا جاتا ہے مگر ملا کر پڑھتے وقت پڑھا نہیں جاتا۔',
      segments: [
        {
          arabic: 'مَرَضًۭا',
          roleUrdu: 'اسم منصوب',
          meaningUrdu: 'بیماری میں (دوسرا مفعول)',
        },
      ],
      ruleIds: ['accusative', 'indefinite', 'object', 'two-objects'],
    },
    {
      id: '2:10:7',
      ayah: 10,
      position: 7,
      arabic: 'وَلَهُمْ',
      meaningUrdu: 'اور ان کے لئے',
      pos: 'particle',
      posUrdu: 'حرفِ جر + ضمیرِ متصل',
      root: null,
      lemma: null,
      morphologyUrdu:
        'حرفِ جر + ضمیرِ متصل، جمع مذکر غائب، مبنی۔ سابقہ: وَ (حرفِ استئناف)؛ لَ (حرفِ جر)۔',
      syntaxUrdu: 'الواو استئنافية؛ جار ومجرور',
      dictionaryUrdu:
        'لِ حق اور ملکیت کے لیے ہے: «کے لیے»؛ ضمیر سے پہلے یہ لام فتحہ سے پڑھا جاتا ہے۔ یہ ضمیر متصل ہے جو حرفِ جر کی وجہ سے محلِ جر میں ہے؛ جار مجرور خبرِ مقدم ہے۔',
      segments: [
        {
          arabic: 'وَ',
          roleUrdu: 'حرفِ استئناف',
          meaningUrdu: 'اور',
        },
        {
          arabic: 'لَ',
          roleUrdu: 'حرفِ جر',
          meaningUrdu: 'کے لیے',
        },
        {
          arabic: 'هُمْ',
          roleUrdu: 'ضمیرِ متصل (مجرور)',
          meaningUrdu: 'ان',
        },
      ],
      ruleIds: ['resumption', 'preposition', 'pronoun', 'nominal', 'fronting'],
    },
    {
      id: '2:10:8',
      ayah: 10,
      position: 8,
      arabic: 'عَذَابٌ',
      meaningUrdu: 'عذاب ہے',
      pos: 'noun',
      posUrdu: 'اسم مرفوع',
      root: 'ع ذ ب',
      lemma: 'عَذَاب',
      morphologyUrdu: 'اسم، مذکر، نکرہ (تنوین)، مرفوع۔',
      syntaxUrdu: 'اسم مرفوع',
      dictionaryUrdu:
        'عَذَاب سخت تکلیف دینے والی سزا ہے۔ یہاں یہ مبتدائے مؤخر ہے اور اس کی خبر پہلے آنے والا جار مجرور ہے۔',
      segments: [
        {
          arabic: 'عَذَابٌ',
          roleUrdu: 'اسم مرفوع',
          meaningUrdu: 'عذاب',
        },
      ],
      ruleIds: ['nominative', 'indefinite', 'nominal', 'fronting'],
    },
    {
      id: '2:10:9',
      ayah: 10,
      position: 9,
      arabic: 'أَلِيمٌۢ',
      meaningUrdu: 'درد ناک / المناک',
      pos: 'adjective',
      posUrdu: 'صفت مرفوع',
      root: 'أ ل م',
      lemma: 'أَلِيم',
      morphologyUrdu: 'صفت، واحد مذکر، نکرہ (تنوین)، مرفوع۔',
      syntaxUrdu: 'صفة مرفوعة',
      dictionaryUrdu:
        'أَلِيم فَعِيل کے وزن پر ہے: درد دینے والا، دردناک۔ یہ پچھلے اسم کی صفت ہے اور رفع، تنوین اور تذکیر میں اس کے مطابق ہے۔',
      segments: [
        {
          arabic: 'أَلِيمٌۢ',
          roleUrdu: 'صفت مرفوع',
          meaningUrdu: 'دردناک',
        },
      ],
      ruleIds: ['nominative', 'indefinite', 'adjective'],
    },
    {
      id: '2:10:10',
      ayah: 10,
      position: 10,
      arabic: 'بِمَا',
      meaningUrdu: 'بوجہ اس کے جو',
      pos: 'pronoun',
      posUrdu: 'اسمِ موصول',
      root: null,
      lemma: 'مَا',
      morphologyUrdu: 'اسمِ موصول، مبنی۔ سابقہ: بِ (حرفِ جر)۔',
      syntaxUrdu: 'جار ومجرور',
      dictionaryUrdu:
        'بِ یہاں سبب بتاتا ہے: «کی وجہ سے»۔ مَا کو عموماً مصدریہ مانا جاتا ہے جو بعد کے جملے کو مصدر کے معنی میں کر دیتا ہے: «ان کے جھوٹ بولنے کی وجہ سے»۔',
      segments: [
        {
          arabic: 'بِ',
          roleUrdu: 'حرفِ جر',
          meaningUrdu: 'کی وجہ سے',
        },
        {
          arabic: 'مَا',
          roleUrdu: 'اسمِ موصول',
          meaningUrdu: 'اس (بات) کے کہ',
        },
      ],
      ruleIds: ['preposition', 'relative', 'masdar-particle'],
    },
    {
      id: '2:10:11',
      ayah: 10,
      position: 11,
      arabic: 'كَانُوا۟',
      meaningUrdu: 'تھے وہ',
      pos: 'verb',
      posUrdu: 'فعلِ ماضی + ضمیرِ متصل',
      root: 'ك و ن',
      lemma: 'كَانَ',
      morphologyUrdu:
        'فعلِ ماضی، معروف، جمع مذکر غائب، ثلاثی مجرد — اوّل (I)۔ لاحقہ: وا۟ ضمیرِ فاعل، جمع مذکر غائب۔',
      syntaxUrdu: 'فعل ماض والواو ضمير متصل في محل رفع اسم «كان»',
      dictionaryUrdu:
        'كَانَ ناقص فعل ہے جو جملے کو ماضی سے جوڑتا ہے؛ مضارع کے ساتھ «کیا کرتے تھے» کی عادت کا مفہوم دیتا ہے۔ مادہ ك و ن اجوف ہے؛ ضمیر یہاں فاعل نہیں بلکہ اس کا اسم ہے۔',
      segments: [
        {
          arabic: 'كَانُ',
          roleUrdu: 'فعلِ ماضی',
          meaningUrdu: 'تھے',
        },
        {
          arabic: 'وا۟',
          roleUrdu: 'ضمیرِ فاعل (جمع مذکر غائب)',
          meaningUrdu: 'وہ سب (کان کا اسم)',
        },
      ],
      ruleIds: ['subject-pronoun', 'kana', 'perfect', 'weak-verb'],
    },
    {
      id: '2:10:12',
      ayah: 10,
      position: 12,
      arabic: 'يَكْذِبُونَ',
      meaningUrdu: 'جھوٹ بولتے',
      pos: 'verb',
      posUrdu: 'فعلِ مضارع + ضمیرِ متصل',
      root: 'ك ذ ب',
      lemma: 'كَذَبَ',
      morphologyUrdu:
        'فعلِ مضارع، مرفوع، معروف، جمع مذکر غائب، ثلاثی مجرد — اوّل (I)۔ لاحقہ: ونَ ضمیرِ فاعل، جمع مذکر غائب۔',
      syntaxUrdu: 'فعل مضارع والواو ضمير متصل في محل رفع فاعل',
      dictionaryUrdu:
        'كَذَبَ کا مطلب حقیقت کے خلاف بات کہنا، یعنی جھوٹ بولنا ہے۔ یہ جملہ كَانُوا۟ کی خبر ہے، اس لیے مفہوم «جھوٹ بولا کرتے تھے» بنتا ہے۔',
      segments: [
        {
          arabic: 'يَكْذِبُ',
          roleUrdu: 'فعلِ مضارع',
          meaningUrdu: 'جھوٹ بولتے',
        },
        {
          arabic: 'ونَ',
          roleUrdu: 'ضمیرِ فاعل (جمع مذکر غائب)',
          meaningUrdu: 'وہ سب (فاعل)',
        },
      ],
      ruleIds: ['subject-pronoun', 'imperfect', 'five-verbs', 'kana'],
    },
    {
      id: '2:11:1',
      ayah: 11,
      position: 1,
      arabic: 'وَإِذَا',
      meaningUrdu: 'اور جب',
      pos: 'noun',
      posUrdu: 'ظرفِ زمان',
      root: null,
      lemma: 'إِذَا',
      morphologyUrdu: 'ظرفِ زمان۔ سابقہ: وَ (حرفِ استئناف)۔',
      syntaxUrdu: 'الواو استئنافية؛ ظرف زمان',
      dictionaryUrdu:
        'وَ یہاں نیا بیان شروع کرتا ہے اور إِذَا آئندہ وقت کا ظرف ہے جس میں شرط کا مفہوم ہے۔ اس کے بعد شرط کا فعل آتا ہے اور پھر اس کا جواب؛ یاد رہے کہ إِذَا اسم (ظرف) ہے، حرف نہیں۔',
      segments: [
        {
          arabic: 'وَ',
          roleUrdu: 'حرفِ استئناف',
          meaningUrdu: 'اور (نیا جملہ)',
        },
        {
          arabic: 'إِذَا',
          roleUrdu: 'ظرفِ زمان',
          meaningUrdu: 'جب',
        },
      ],
      ruleIds: ['resumption', 'condition'],
    },
    {
      id: '2:11:2',
      ayah: 11,
      position: 2,
      arabic: 'قِيلَ',
      meaningUrdu: 'کہا جاتا ہے',
      pos: 'verb',
      posUrdu: 'فعلِ ماضی مجہول',
      root: 'ق و ل',
      lemma: 'قِيلَ',
      morphologyUrdu: 'فعلِ ماضی مجہول، مجہول، واحد مذکر غائب، ثلاثی مجرد — اوّل (I)۔',
      syntaxUrdu: 'فعل ماض مبني للمجهول',
      dictionaryUrdu:
        'قَالَ کا معنی کہنا ہے؛ یہ اس کا مجہول ماضی ہے، اس لیے کہنے والے کا ذکر نہیں۔ اصل قُوِلَ تھا اور واو یاء میں بدل گیا؛ إِذَا کے بعد ماضی آئندہ یا عادت کا مفہوم دیتا ہے۔',
      segments: [
        {
          arabic: 'قِيلَ',
          roleUrdu: 'فعلِ ماضی مجہول',
          meaningUrdu: 'کہا جاتا ہے',
        },
      ],
      ruleIds: ['perfect', 'passive', 'weak-verb', 'condition', 'quoted-speech'],
    },
    {
      id: '2:11:3',
      ayah: 11,
      position: 3,
      arabic: 'لَهُمْ',
      meaningUrdu: 'ان کو',
      pos: 'particle',
      posUrdu: 'حرفِ جر + ضمیرِ متصل',
      root: null,
      lemma: null,
      morphologyUrdu: 'حرفِ جر + ضمیرِ متصل، جمع مذکر غائب، مبنی۔ سابقہ: لَ (حرفِ جر)۔',
      syntaxUrdu: 'جار ومجرور',
      dictionaryUrdu:
        'لام یہاں اس شخص کو بتاتا ہے جس سے بات کہی جائے، اس لیے اردو میں «ان سے» یا «ان کو» بنتا ہے۔ هُمْ حرفِ جر سے جڑی ہوئی متصل ضمیر ہے اور محلِ جر میں ہے، الگ ضمیر نہیں۔',
      segments: [
        {
          arabic: 'لَ',
          roleUrdu: 'حرفِ جر',
          meaningUrdu: 'کو / سے',
        },
        {
          arabic: 'هُمْ',
          roleUrdu: 'ضمیرِ متصل (مجرور)',
          meaningUrdu: 'ان (جمع مذکر غائب)',
        },
      ],
      ruleIds: ['preposition', 'pronoun'],
    },
    {
      id: '2:11:4',
      ayah: 11,
      position: 4,
      arabic: 'لَا',
      meaningUrdu: 'نہ',
      pos: 'particle',
      posUrdu: 'حرفِ نہی',
      root: null,
      lemma: 'لَا',
      morphologyUrdu: 'حرفِ نہی، مبنی۔',
      syntaxUrdu: 'حرف نهي',
      dictionaryUrdu:
        'یہ لائے نہی ہے جو مضارع کو مجزوم کر کے کسی کام سے روکتی ہے۔ اسے لائے نفی سے الگ پہچانیں جو صرف خبر دیتی ہے اور فعل کی حالت نہیں بدلتی۔',
      segments: [
        {
          arabic: 'لَا',
          roleUrdu: 'حرفِ نہی',
          meaningUrdu: 'نہ (منع کرنے والا)',
        },
      ],
      ruleIds: ['prohibition'],
    },
    {
      id: '2:11:5',
      ayah: 11,
      position: 5,
      arabic: 'تُفْسِدُوا۟',
      meaningUrdu: 'تم فساد کرو',
      pos: 'verb',
      posUrdu: 'فعلِ مضارع + ضمیرِ متصل',
      root: 'ف س د',
      lemma: 'أَفْسَدَ',
      morphologyUrdu:
        'فعلِ مضارع، مجزوم، معروف، جمع مذکر حاضر، ثلاثی مزید فیہ — چہارم (IV)، بابِ إِفْعَال۔ لاحقہ: وا۟ ضمیرِ فاعل، جمع مذکر حاضر۔',
      syntaxUrdu: 'فعل مضارع مجزوم والواو ضمير متصل في محل رفع فاعل',
      dictionaryUrdu:
        'أَفْسَدَ کا معنی بگاڑنا اور فساد پھیلانا ہے، جو فَسَدَ «بگڑنا» سے بابِ افعال ہے۔ لائے نہی کی وجہ سے آخر کا نون گر گیا، اور واو کے بعد الف صرف لکھنے میں ہے۔',
      segments: [
        {
          arabic: 'تُفْسِدُ',
          roleUrdu: 'فعلِ مضارع',
          meaningUrdu: 'فساد کرو (مجزوم مضارع)',
        },
        {
          arabic: 'وا۟',
          roleUrdu: 'ضمیرِ فاعل (جمع مذکر حاضر)',
          meaningUrdu: 'تم سب (فاعل)',
        },
      ],
      ruleIds: ['subject-pronoun', 'imperfect', 'jussive', 'derived-form', 'five-verbs'],
    },
    {
      id: '2:11:6',
      ayah: 11,
      position: 6,
      arabic: 'فِى',
      meaningUrdu: 'میں',
      pos: 'particle',
      posUrdu: 'حرفِ جر',
      root: null,
      lemma: 'فِى',
      morphologyUrdu: 'حرفِ جر، مبنی۔',
      syntaxUrdu: 'حرف جر',
      dictionaryUrdu:
        'فِى کسی چیز کے اندر یا کسی جگہ میں ہونے کا تعلق بتاتا ہے۔ یہاں یہ اپنے مجرور کے ساتھ مل کر بتاتا ہے کہ فساد سے روکنا کس دائرے سے متعلق ہے۔',
      segments: [
        {
          arabic: 'فِى',
          roleUrdu: 'حرفِ جر',
          meaningUrdu: 'میں',
        },
      ],
      ruleIds: ['preposition'],
    },
    {
      id: '2:11:7',
      ayah: 11,
      position: 7,
      arabic: 'ٱلْأَرْضِ',
      meaningUrdu: 'زمین',
      pos: 'noun',
      posUrdu: 'اسم مجرور',
      root: 'أ ر ض',
      lemma: 'أَرْض',
      morphologyUrdu: 'اسم، مؤنث، ال کے ساتھ معرفہ، مجرور۔ سابقہ: ٱلْ (حرفِ تعریف)۔',
      syntaxUrdu: 'اسم مجرور',
      dictionaryUrdu:
        'أَرْض زمین اور سرزمین کو کہتے ہیں؛ یہ مؤنث سماعی ہے اگرچہ اس میں تائے تانیث نہیں۔ یہاں حرفِ جر کی وجہ سے آخر پر کسرہ ہے۔',
      segments: [
        {
          arabic: 'ٱلْ',
          roleUrdu: 'حرفِ تعریف',
          meaningUrdu: 'تعریف (معرفہ بنانے والا)',
        },
        {
          arabic: 'أَرْضِ',
          roleUrdu: 'اسم مجرور',
          meaningUrdu: 'زمین',
        },
      ],
      ruleIds: ['definite', 'genitive'],
    },
    {
      id: '2:11:8',
      ayah: 11,
      position: 8,
      arabic: 'قَالُوٓا۟',
      meaningUrdu: 'وہ کہتے ہیں',
      pos: 'verb',
      posUrdu: 'فعلِ ماضی + ضمیرِ متصل',
      root: 'ق و ل',
      lemma: 'قَالَ',
      morphologyUrdu:
        'فعلِ ماضی، معروف، جمع مذکر غائب، ثلاثی مجرد — اوّل (I)۔ لاحقہ: وٓا۟ ضمیرِ فاعل، جمع مذکر غائب۔',
      syntaxUrdu: 'فعل ماض والواو ضمير متصل في محل رفع فاعل',
      dictionaryUrdu:
        'قَالَ کا معنی کہنا ہے اور مادہ ق و ل ہے؛ ماضی کے الف کے پیچھے اصلی واو چھپا ہے۔ یہاں یہ إِذَا کا جواب ہے، اس لیے اردو میں «کہتے ہیں» بنتا ہے اور آگے ان کی بات نقل ہوتی ہے۔',
      segments: [
        {
          arabic: 'قَالُ',
          roleUrdu: 'فعلِ ماضی',
          meaningUrdu: 'کہا / کہتے ہیں',
        },
        {
          arabic: 'وٓا۟',
          roleUrdu: 'ضمیرِ فاعل (جمع مذکر غائب)',
          meaningUrdu: 'وہ سب (فاعل)',
        },
      ],
      ruleIds: ['subject-pronoun', 'perfect', 'weak-verb', 'condition-answer', 'quoted-speech'],
    },
    {
      id: '2:11:9',
      ayah: 11,
      position: 9,
      arabic: 'إِنَّمَا',
      meaningUrdu: 'بیشک',
      pos: 'particle',
      posUrdu: 'حرفِ نصب + حرفِ کاف',
      root: null,
      lemma: 'إِنّ',
      morphologyUrdu: 'حرفِ نصب + حرفِ کاف، مبنی۔',
      syntaxUrdu: 'كافة ومكفوفة',
      dictionaryUrdu:
        'إِنَّ کے ساتھ مَا کافہ مل کر إِنَّمَا بنتا ہے جو حصر کا معنی دیتا ہے: «بس، صرف یہی»۔ مَا اسے عمل سے روک دیتا ہے، اس لیے بعد والا اسم منصوب نہیں بلکہ مبتدا بن کر مرفوع رہتا ہے۔',
      segments: [
        {
          arabic: 'إِنَّ',
          roleUrdu: 'حرفِ نصب',
          meaningUrdu: 'بے شک',
        },
        {
          arabic: 'مَا',
          roleUrdu: 'حرفِ کاف',
          meaningUrdu: 'روکنے والا (مَا کافہ)',
        },
      ],
      ruleIds: ['restriction'],
    },
    {
      id: '2:11:10',
      ayah: 11,
      position: 10,
      arabic: 'نَحْنُ',
      meaningUrdu: 'ہم تو',
      pos: 'pronoun',
      posUrdu: 'ضمیرِ منفصل',
      root: null,
      lemma: null,
      morphologyUrdu: 'ضمیرِ منفصل، جمع متکلم، مبنی۔',
      syntaxUrdu: 'ضمير منفصل',
      dictionaryUrdu:
        'نَحْنُ جمع متکلم کی منفصل ضمیر ہے، یعنی «ہم»۔ یہاں یہ مبتدا ہے اور بعد کا اسم اس کی خبر؛ بولنے والے اپنے بارے میں دعویٰ کر رہے ہیں۔',
      segments: [
        {
          arabic: 'نَحْنُ',
          roleUrdu: 'ضمیرِ منفصل',
          meaningUrdu: 'ہم',
        },
      ],
      ruleIds: ['independent-pronoun', 'nominal'],
    },
    {
      id: '2:11:11',
      ayah: 11,
      position: 11,
      arabic: 'مُصْلِحُونَ',
      meaningUrdu: 'اصلاح کرنے والے ہیں',
      pos: 'noun',
      posUrdu: 'اسمِ فاعل مرفوع',
      root: 'ص ل ح',
      lemma: 'مُصْلِح',
      morphologyUrdu: 'اسمِ فاعل، ثلاثی مزید فیہ — چہارم (IV)، بابِ إِفْعَال، جمع مذکر، مرفوع۔',
      syntaxUrdu: 'اسم مرفوع',
      dictionaryUrdu:
        'مُصْلِح أَصْلَحَ «درست کرنا، سنوارنا» کا اسمِ فاعل ہے اور اس کی ضد مُفْسِد ہے۔ یہ اسم ہے فعل نہیں؛ آخر کا واو اور نون جمع مذکر سالم کے رفع کی علامت ہیں۔',
      segments: [
        {
          arabic: 'مُصْلِحُونَ',
          roleUrdu: 'اسمِ فاعل مرفوع',
          meaningUrdu: 'اصلاح کرنے والے',
        },
      ],
      ruleIds: ['nominative', 'participle', 'sound-plural', 'nominal', 'derived-form'],
    },
    {
      id: '2:12:1',
      ayah: 12,
      position: 1,
      arabic: 'أَلَآ',
      meaningUrdu: 'خبردار',
      pos: 'particle',
      posUrdu: 'حرفِ ابتدا',
      root: null,
      lemma: 'أَلَآ',
      morphologyUrdu: 'حرفِ ابتدا، مبنی۔',
      syntaxUrdu: 'حرف ابتداء',
      dictionaryUrdu:
        'أَلَا حرفِ استفتاح و تنبیہ ہے جو کلام کے آغاز میں سننے والے کو آگے کی اہم بات پر متوجہ کرتا ہے: «سن لو، خبردار»۔ یہاں نہ سوال ہے نہ نفی۔',
      segments: [
        {
          arabic: 'أَلَآ',
          roleUrdu: 'حرفِ ابتدا',
          meaningUrdu: 'سن لو / خبردار',
        },
      ],
      ruleIds: [],
    },
    {
      id: '2:12:2',
      ayah: 12,
      position: 2,
      arabic: 'إِنَّهُمْ',
      meaningUrdu: 'بیشک وہ',
      pos: 'particle',
      posUrdu: 'حرفِ نصب + ضمیرِ متصل',
      root: null,
      lemma: 'إِنّ',
      morphologyUrdu: 'حرفِ نصب، مبنی۔ لاحقہ: هُمْ ضمیرِ متصل، جمع مذکر غائب۔',
      syntaxUrdu: 'حرف نصب و«هم» ضمير متصل في محل نصب اسم «ان»',
      dictionaryUrdu:
        'إِنَّ تاکید کا حرف ہے جو اسم کو نصب اور خبر کو رفع دیتا ہے۔ یہاں اس کا اسم جڑی ہوئی ضمیر هُمْ ہے جو محلِ نصب میں ہے، اور خبر آگے آتی ہے۔',
      segments: [
        {
          arabic: 'إِنَّ',
          roleUrdu: 'حرفِ نصب',
          meaningUrdu: 'بے شک',
        },
        {
          arabic: 'هُمْ',
          roleUrdu: 'ضمیرِ متصل (جمع مذکر غائب)',
          meaningUrdu: 'وہ (اسمِ إِنَّ)',
        },
      ],
      ruleIds: ['pronoun', 'inna'],
    },
    {
      id: '2:12:3',
      ayah: 12,
      position: 3,
      arabic: 'هُمُ',
      meaningUrdu: 'وہی ہیں',
      pos: 'pronoun',
      posUrdu: 'ضمیرِ منفصل',
      root: null,
      lemma: null,
      morphologyUrdu: 'ضمیرِ منفصل، جمع مذکر غائب، مبنی۔',
      syntaxUrdu: 'ضمير منفصل',
      dictionaryUrdu:
        'هُمْ «وہ لوگ» کی منفصل ضمیر ہے۔ یہاں یہ ضمیرِ فصل ہے جو خبر کو انہی کے ساتھ خاص کرتا ہے، اسی لیے اردو میں «وہی» آیا؛ آگے ساکن سے ملنے پر میم کو ضمہ ملا۔',
      segments: [
        {
          arabic: 'هُمُ',
          roleUrdu: 'ضمیرِ منفصل',
          meaningUrdu: 'وہی',
        },
      ],
      ruleIds: ['independent-pronoun', 'separating-pronoun'],
    },
    {
      id: '2:12:4',
      ayah: 12,
      position: 4,
      arabic: 'ٱلْمُفْسِدُونَ',
      meaningUrdu: 'جو فساد کرنے والے ہیں',
      pos: 'noun',
      posUrdu: 'اسمِ فاعل مرفوع',
      root: 'ف س د',
      lemma: 'مُفْسِد',
      morphologyUrdu:
        'اسمِ فاعل، ثلاثی مزید فیہ — چہارم (IV)، بابِ إِفْعَال، جمع مذکر، ال کے ساتھ معرفہ، مرفوع۔ سابقہ: ٱلْ (حرفِ تعریف)۔',
      syntaxUrdu: 'اسم مرفوع',
      dictionaryUrdu:
        'مُفْسِد أَفْسَدَ «بگاڑنا» کا اسمِ فاعل ہے، یعنی فساد پھیلانے والا۔ معرفہ خبر ہونے سے یہ مفہوم بنتا ہے کہ اصل فسادی یہی ہیں؛ یہ اسم ہے، فعل نہیں۔',
      segments: [
        {
          arabic: 'ٱلْ',
          roleUrdu: 'حرفِ تعریف',
          meaningUrdu: 'تعریف (معرفہ بنانے والا)',
        },
        {
          arabic: 'مُفْسِدُونَ',
          roleUrdu: 'اسمِ فاعل مرفوع',
          meaningUrdu: 'فساد کرنے والے',
        },
      ],
      ruleIds: ['definite', 'nominative', 'participle', 'sound-plural', 'inna', 'derived-form'],
    },
    {
      id: '2:12:5',
      ayah: 12,
      position: 5,
      arabic: 'وَلَـٰكِن',
      meaningUrdu: 'لیکن',
      pos: 'particle',
      posUrdu: 'حرفِ استدراک',
      root: null,
      lemma: 'لَٰكِن',
      morphologyUrdu: 'حرفِ استدراک، مبنی۔ سابقہ: وَ (حرفِ زائد)۔',
      syntaxUrdu: 'الواو زائدة؛ حرف استدراك',
      dictionaryUrdu:
        'لَٰكِنْ استدراک کا حرف ہے، یعنی پہلی بات کے بعد ایک وضاحت یا مخالف پہلو لانا۔ تشدید کے بغیر ہونے سے یہ عمل نہیں کرتا، اس لیے بعد کا جملہ اپنے حال پر رہتا ہے۔',
      segments: [
        {
          arabic: 'وَ',
          roleUrdu: 'حرفِ زائد',
          meaningUrdu: 'اور (زائد)',
        },
        {
          arabic: 'لَـٰكِن',
          roleUrdu: 'حرفِ استدراک',
          meaningUrdu: 'لیکن',
        },
      ],
      ruleIds: ['extra-particle', 'lightened-particle'],
    },
    {
      id: '2:12:6',
      ayah: 12,
      position: 6,
      arabic: 'لَّا',
      meaningUrdu: 'نہیں',
      pos: 'particle',
      posUrdu: 'حرفِ نفی',
      root: null,
      lemma: 'لَا',
      morphologyUrdu: 'حرفِ نفی، مبنی۔',
      syntaxUrdu: 'حرف نفي',
      dictionaryUrdu:
        'یہ لائے نفی ہے جو مضارع کے کام کے نہ ہونے کی خبر دیتی ہے اور فعل کی حالت نہیں بدلتی۔ لام پر تشدید پچھلے نون کے ادغام سے ہے؛ اسے لائے نہی سے الگ رکھیں۔',
      segments: [
        {
          arabic: 'لَّا',
          roleUrdu: 'حرفِ نفی',
          meaningUrdu: 'نہیں',
        },
      ],
      ruleIds: ['negation'],
    },
    {
      id: '2:12:7',
      ayah: 12,
      position: 7,
      arabic: 'يَشْعُرُونَ',
      meaningUrdu: 'وہ شعور رکھتے ہیں',
      pos: 'verb',
      posUrdu: 'فعلِ مضارع + ضمیرِ متصل',
      root: 'ش ع ر',
      lemma: 'شَعَرَ',
      morphologyUrdu:
        'فعلِ مضارع، مرفوع، معروف، جمع مذکر غائب، ثلاثی مجرد — اوّل (I)۔ لاحقہ: ونَ ضمیرِ فاعل، جمع مذکر غائب۔',
      syntaxUrdu: 'فعل مضارع والواو ضمير متصل في محل رفع فاعل',
      dictionaryUrdu:
        'شَعَرَ کسی بات کا باریک احساس اور ادراک ہونا ہے، اسی سے شعور ہے۔ یہاں نفی کے ساتھ اس احساس کا نہ ہونا مراد ہے؛ آخر کا نون رفع کی علامت ہے۔',
      segments: [
        {
          arabic: 'يَشْعُرُ',
          roleUrdu: 'فعلِ مضارع',
          meaningUrdu: 'احساس رکھتے ہیں',
        },
        {
          arabic: 'ونَ',
          roleUrdu: 'ضمیرِ فاعل (جمع مذکر غائب)',
          meaningUrdu: 'وہ سب (فاعل)',
        },
      ],
      ruleIds: ['subject-pronoun', 'imperfect', 'five-verbs'],
    },
    {
      id: '2:13:1',
      ayah: 13,
      position: 1,
      arabic: 'وَإِذَا',
      meaningUrdu: 'اور جب',
      pos: 'noun',
      posUrdu: 'ظرفِ زمان',
      root: null,
      lemma: 'إِذَا',
      morphologyUrdu: 'ظرفِ زمان۔ سابقہ: وَ (حرفِ عطف)۔',
      syntaxUrdu: 'الواو عاطفة؛ ظرف زمان',
      dictionaryUrdu:
        'یہاں وَ عطف کا ہے جو اس شرطیہ جملے کو پچھلے جملے سے جوڑتا ہے، اور إِذَا آئندہ وقت کا شرطیہ ظرف ہے۔ إِذَا اسم (ظرف) ہے، حرف نہیں؛ اس کے بعد شرط کا فعل اور پھر جواب آتا ہے۔',
      segments: [
        {
          arabic: 'وَ',
          roleUrdu: 'حرفِ عطف',
          meaningUrdu: 'اور',
        },
        {
          arabic: 'إِذَا',
          roleUrdu: 'ظرفِ زمان',
          meaningUrdu: 'جب',
        },
      ],
      ruleIds: ['conjunction', 'condition'],
    },
    {
      id: '2:13:2',
      ayah: 13,
      position: 2,
      arabic: 'قِيلَ',
      meaningUrdu: 'کہا جاتا ہے',
      pos: 'verb',
      posUrdu: 'فعلِ ماضی مجہول',
      root: 'ق و ل',
      lemma: 'قِيلَ',
      morphologyUrdu: 'فعلِ ماضی مجہول، مجہول، واحد مذکر غائب، ثلاثی مجرد — اوّل (I)۔',
      syntaxUrdu: 'فعل ماض مبني للمجهول',
      dictionaryUrdu:
        'مجہول ماضی ہے: کہنے والا مذکور نہیں، کہی گئی بات اہم ہے۔ اجوف واوی فعل ہے جس کی اصل واو یہاں یاء کی صورت میں ہے، اور إِذَا کے بعد ماضی «کہا جاتا ہے» کا معنی دیتا ہے۔',
      segments: [
        {
          arabic: 'قِيلَ',
          roleUrdu: 'فعلِ ماضی مجہول',
          meaningUrdu: 'کہا جاتا ہے',
        },
      ],
      ruleIds: ['perfect', 'passive', 'weak-verb', 'condition', 'quoted-speech'],
    },
    {
      id: '2:13:3',
      ayah: 13,
      position: 3,
      arabic: 'لَهُمْ',
      meaningUrdu: 'واسطے ان کے',
      pos: 'particle',
      posUrdu: 'حرفِ جر + ضمیرِ متصل',
      root: null,
      lemma: null,
      morphologyUrdu: 'حرفِ جر + ضمیرِ متصل، جمع مذکر غائب، مبنی۔ سابقہ: لَ (حرفِ جر)۔',
      syntaxUrdu: 'جار ومجرور',
      dictionaryUrdu:
        'لام یہاں مخاطب کو بتاتا ہے، یعنی بات کس سے کہی گئی؛ لفظی ترجمہ «واسطے ان کے» ہے۔ ضمیر حرفِ جر سے جڑی ہوئی ہے اور محلِ جر میں ہے؛ اسے منفصل ضمیر نہ سمجھیں۔',
      segments: [
        {
          arabic: 'لَ',
          roleUrdu: 'حرفِ جر',
          meaningUrdu: 'واسطے / کو',
        },
        {
          arabic: 'هُمْ',
          roleUrdu: 'ضمیرِ متصل (مجرور)',
          meaningUrdu: 'ان کے',
        },
      ],
      ruleIds: ['preposition', 'pronoun'],
    },
    {
      id: '2:13:4',
      ayah: 13,
      position: 4,
      arabic: 'ءَامِنُوا۟',
      meaningUrdu: 'ایمان لے آؤ',
      pos: 'verb',
      posUrdu: 'فعلِ امر + ضمیرِ متصل',
      root: 'أ م ن',
      lemma: 'آمَنَ',
      morphologyUrdu:
        'فعلِ امر، معروف، جمع مذکر حاضر، ثلاثی مزید فیہ — چہارم (IV)، بابِ إِفْعَال۔ لاحقہ: وا۟ ضمیرِ فاعل، جمع مذکر حاضر۔',
      syntaxUrdu: 'فعل أمر والواو ضمير متصل في محل رفع فاعل',
      dictionaryUrdu:
        'ءَامَنَ بابِ افعال سے ہے: مادہ أ م ن میں امن و اطمینان کا مفہوم ہے اور اس باب میں «ایمان لانا، مان لینا»۔ شروع کا مد دو ہمزوں کے ملنے سے ہے: پہلا باب کا، دوسرا مادے کا۔',
      segments: [
        {
          arabic: 'ءَامِنُ',
          roleUrdu: 'فعلِ امر',
          meaningUrdu: 'ایمان لاؤ',
        },
        {
          arabic: 'وا۟',
          roleUrdu: 'ضمیرِ فاعل (جمع مذکر حاضر)',
          meaningUrdu: 'تم سب (فاعل)',
        },
      ],
      ruleIds: ['subject-pronoun', 'imperative', 'derived-form', 'hamzated'],
    },
    {
      id: '2:13:5',
      ayah: 13,
      position: 5,
      arabic: 'كَمَآ',
      meaningUrdu: 'جیسا کہ',
      pos: 'particle',
      posUrdu: 'حرفِ مصدری',
      root: null,
      lemma: 'مَا',
      morphologyUrdu: 'حرفِ مصدری، مبنی۔ سابقہ: كَ (حرفِ جر)۔',
      syntaxUrdu: 'جار ومجرور',
      dictionaryUrdu:
        'کاف تشبیہ کا حرفِ جر ہے اور مَا مصدریہ اگلے فعل کو مصدر کے معنی میں کر دیتا ہے: «جیسے وہ ایمان لائے» یعنی «ان کے ایمان کی طرح»۔ یہاں مَا «جو چیز» والا موصول نہیں۔',
      segments: [
        {
          arabic: 'كَ',
          roleUrdu: 'حرفِ جر',
          meaningUrdu: 'جیسے / کی طرح',
        },
        {
          arabic: 'مَآ',
          roleUrdu: 'حرفِ مصدری',
          meaningUrdu: 'کہ (مصدر بنانے والا)',
        },
      ],
      ruleIds: ['preposition', 'masdar-particle'],
    },
    {
      id: '2:13:6',
      ayah: 13,
      position: 6,
      arabic: 'ءَامَنَ',
      meaningUrdu: 'ایمان لائے',
      pos: 'verb',
      posUrdu: 'فعلِ ماضی',
      root: 'أ م ن',
      lemma: 'آمَنَ',
      morphologyUrdu:
        'فعلِ ماضی، معروف، واحد مذکر غائب، ثلاثی مزید فیہ — چہارم (IV)، بابِ إِفْعَال۔',
      syntaxUrdu: 'فعل ماض',
      dictionaryUrdu:
        'ءَامَنَ کا معنی ایمان لانا اور تصدیق کرنا ہے۔ فاعل جمع ہونے کے باوجود فعل واحد ہے، کیونکہ فعل اپنے ظاہری فاعل سے پہلے آئے تو عموماً واحد رہتا ہے۔',
      segments: [
        {
          arabic: 'ءَامَنَ',
          roleUrdu: 'فعلِ ماضی',
          meaningUrdu: 'ایمان لائے',
        },
      ],
      ruleIds: ['perfect', 'derived-form', 'hamzated', 'verbal-sentence'],
    },
    {
      id: '2:13:7',
      ayah: 13,
      position: 7,
      arabic: 'ٱلنَّاسُ',
      meaningUrdu: 'لوگ',
      pos: 'noun',
      posUrdu: 'اسم مرفوع',
      root: 'ن و س',
      lemma: 'نَاس',
      morphologyUrdu: 'اسم، جمع مذکر، ال کے ساتھ معرفہ، مرفوع۔ سابقہ: ٱل (حرفِ تعریف)۔',
      syntaxUrdu: 'اسم مرفوع',
      dictionaryUrdu:
        'نَاس انسانوں کے لیے آتا ہے اور جمع کا معنی رکھنے والا اسمِ جمع ہے، جس کا اپنے لفظ سے واحد نہیں۔ اسے ن و س کے تحت رکھنا لغوی درجہ بندی ہے؛ اس کے اشتقاق میں اقوال مختلف ہیں۔',
      segments: [
        {
          arabic: 'ٱل',
          roleUrdu: 'حرفِ تعریف',
          meaningUrdu: 'تعریف (معرفہ بنانے والا)',
        },
        {
          arabic: 'نَّاسُ',
          roleUrdu: 'اسم مرفوع',
          meaningUrdu: 'لوگ',
        },
      ],
      ruleIds: ['definite', 'nominative', 'subject'],
    },
    {
      id: '2:13:8',
      ayah: 13,
      position: 8,
      arabic: 'قَالُوٓا۟',
      meaningUrdu: 'وہ کہتے ہیں',
      pos: 'verb',
      posUrdu: 'فعلِ ماضی + ضمیرِ متصل',
      root: 'ق و ل',
      lemma: 'قَالَ',
      morphologyUrdu:
        'فعلِ ماضی، معروف، جمع مذکر غائب، ثلاثی مجرد — اوّل (I)۔ لاحقہ: وٓا۟ ضمیرِ فاعل، جمع مذکر غائب۔',
      syntaxUrdu: 'فعل ماض والواو ضمير متصل في محل رفع فاعل',
      dictionaryUrdu:
        'یہ قَالَ کا ماضی جمع مذکر غائب ہے؛ اجوف واوی ہے اور الف کے پیچھے اصلی واو ہے۔ إِذَا کے جواب میں آنے سے حال کا ترجمہ بنتا ہے، اور واو کے بعد کا الف صرف لکھنے میں ہے۔',
      segments: [
        {
          arabic: 'قَالُ',
          roleUrdu: 'فعلِ ماضی',
          meaningUrdu: 'کہا / کہتے ہیں',
        },
        {
          arabic: 'وٓا۟',
          roleUrdu: 'ضمیرِ فاعل (جمع مذکر غائب)',
          meaningUrdu: 'وہ سب (فاعل)',
        },
      ],
      ruleIds: ['subject-pronoun', 'perfect', 'weak-verb', 'condition-answer', 'quoted-speech'],
    },
    {
      id: '2:13:9',
      ayah: 13,
      position: 9,
      arabic: 'أَنُؤْمِنُ',
      meaningUrdu: 'کیاہم ایمان لائیں',
      pos: 'verb',
      posUrdu: 'فعلِ مضارع',
      root: 'أ م ن',
      lemma: 'آمَنَ',
      morphologyUrdu:
        'فعلِ مضارع، مرفوع، معروف، جمع متکلم، ثلاثی مزید فیہ — چہارم (IV)، بابِ إِفْعَال۔ سابقہ: أَ (ہمزۂ استفہام)۔',
      syntaxUrdu: 'الهمزة همزة استفهام؛ فعل مضارع',
      dictionaryUrdu:
        'شروع کا ہمزہ سوال کا ہے اور یہاں انکار کے انداز میں ہے۔ نُؤْمِنُ ءَامَنَ کا مضارع جمع متکلم ہے؛ مضارع میں باب کا ہمزہ گر جاتا ہے اور مادے کا ہمزہ واو کی کرسی پر لکھا جاتا ہے۔',
      segments: [
        {
          arabic: 'أَ',
          roleUrdu: 'ہمزۂ استفہام',
          meaningUrdu: 'کیا',
        },
        {
          arabic: 'نُؤْمِنُ',
          roleUrdu: 'فعلِ مضارع',
          meaningUrdu: 'ہم ایمان لائیں',
        },
      ],
      ruleIds: ['interrogative', 'imperfect', 'derived-form', 'hamzated'],
    },
    {
      id: '2:13:10',
      ayah: 13,
      position: 10,
      arabic: 'كَمَآ',
      meaningUrdu: 'جیسا کہ',
      pos: 'particle',
      posUrdu: 'حرفِ مصدری',
      root: null,
      lemma: 'مَا',
      morphologyUrdu: 'حرفِ مصدری، مبنی۔ سابقہ: كَ (حرفِ جر)۔',
      syntaxUrdu: 'جار ومجرور',
      dictionaryUrdu:
        'كَ «کی طرح» اور مَا مصدریہ مل کر «جیسے» کا معنی دیتے ہیں۔ مَا کے بعد کا فعل اپنے فاعل سمیت ایک مصدر کے حکم میں ہے اور اسی پر کاف داخل ہے۔',
      segments: [
        {
          arabic: 'كَ',
          roleUrdu: 'حرفِ جر',
          meaningUrdu: 'جیسے',
        },
        {
          arabic: 'مَآ',
          roleUrdu: 'حرفِ مصدری',
          meaningUrdu: 'کہ (مصدر بنانے والا)',
        },
      ],
      ruleIds: ['preposition', 'masdar-particle'],
    },
    {
      id: '2:13:11',
      ayah: 13,
      position: 11,
      arabic: 'ءَامَنَ',
      meaningUrdu: 'ایمان لائے',
      pos: 'verb',
      posUrdu: 'فعلِ ماضی',
      root: 'أ م ن',
      lemma: 'آمَنَ',
      morphologyUrdu:
        'فعلِ ماضی، معروف، واحد مذکر غائب، ثلاثی مزید فیہ — چہارم (IV)، بابِ إِفْعَال۔',
      syntaxUrdu: 'فعل ماض',
      dictionaryUrdu:
        'یہ ءَامَنَ کا ماضی واحد ہے، حالانکہ اس کا فاعل جمع ہے: ظاہری فاعل بعد میں ہو تو فعل واحد آتا ہے۔ شروع کا مد باب کے ہمزہ اور مادے کے ہمزہ کے ملنے سے بنا ہے۔',
      segments: [
        {
          arabic: 'ءَامَنَ',
          roleUrdu: 'فعلِ ماضی',
          meaningUrdu: 'ایمان لائے',
        },
      ],
      ruleIds: ['perfect', 'derived-form', 'hamzated', 'verbal-sentence'],
    },
    {
      id: '2:13:12',
      ayah: 13,
      position: 12,
      arabic: 'ٱلسُّفَهَآءُ',
      meaningUrdu: 'جو بیوقوف ہیں',
      pos: 'noun',
      posUrdu: 'اسم مرفوع',
      root: 'س ف ه',
      lemma: 'سَفِيه',
      morphologyUrdu: 'اسم، جمع مذکر، ال کے ساتھ معرفہ، مرفوع۔ سابقہ: ٱل (حرفِ تعریف)۔',
      syntaxUrdu: 'اسم مرفوع',
      dictionaryUrdu:
        'سُفَهَاء سَفِيه کی جمع ہے، یعنی کم عقل اور ناسمجھ؛ مادہ س ف ه میں ہلکے پن اور عقل کی کمی کا مفہوم ہے۔ یہ وزن غیر منصرف ہے، مگر یہاں فاعل ہونے سے ضمہ کے ساتھ مرفوع ہے۔',
      segments: [
        {
          arabic: 'ٱل',
          roleUrdu: 'حرفِ تعریف',
          meaningUrdu: 'تعریف (معرفہ بنانے والا)',
        },
        {
          arabic: 'سُّفَهَآءُ',
          roleUrdu: 'اسم مرفوع',
          meaningUrdu: 'بے وقوف لوگ',
        },
      ],
      ruleIds: ['definite', 'nominative', 'broken-plural', 'subject'],
    },
    {
      id: '2:13:13',
      ayah: 13,
      position: 13,
      arabic: 'أَلَآ',
      meaningUrdu: 'خبردار',
      pos: 'particle',
      posUrdu: 'حرفِ ابتدا',
      root: null,
      lemma: 'أَلَآ',
      morphologyUrdu: 'حرفِ ابتدا، مبنی۔',
      syntaxUrdu: 'حرف ابتداء',
      dictionaryUrdu:
        'أَلَا کلام کے شروع میں «سنو» یا «خبردار» کا مفہوم دیتا ہے اور بعد کی خبر کو نمایاں کرتا ہے۔ یہ مبنی حرف ہے؛ اس پر کوئی اعراب نہیں اور اس کا اگلے لفظ پر عمل نہیں۔',
      segments: [
        {
          arabic: 'أَلَآ',
          roleUrdu: 'حرفِ ابتدا',
          meaningUrdu: 'سن لو / خبردار',
        },
      ],
      ruleIds: [],
    },
    {
      id: '2:13:14',
      ayah: 13,
      position: 14,
      arabic: 'إِنَّهُمْ',
      meaningUrdu: 'بیشک وہ',
      pos: 'particle',
      posUrdu: 'حرفِ نصب + ضمیرِ متصل',
      root: null,
      lemma: 'إِنّ',
      morphologyUrdu: 'حرفِ نصب، مبنی۔ لاحقہ: هُمْ ضمیرِ متصل، جمع مذکر غائب۔',
      syntaxUrdu: 'حرف نصب و«هم» ضمير متصل في محل نصب اسم «ان»',
      dictionaryUrdu:
        'إِنَّ «بے شک» تاکید کے لیے ہے؛ جڑی ہوئی هُمْ اس کا اسم ہے اور محلِ نصب میں ہے۔ أَلَا کے بعد إِنَّ کا آنا بات کو دہری تاکید دیتا ہے۔',
      segments: [
        {
          arabic: 'إِنَّ',
          roleUrdu: 'حرفِ نصب',
          meaningUrdu: 'بے شک',
        },
        {
          arabic: 'هُمْ',
          roleUrdu: 'ضمیرِ متصل (جمع مذکر غائب)',
          meaningUrdu: 'وہ (اسمِ إِنَّ)',
        },
      ],
      ruleIds: ['pronoun', 'inna'],
    },
    {
      id: '2:13:15',
      ayah: 13,
      position: 15,
      arabic: 'هُمُ',
      meaningUrdu: 'وہی ہیں',
      pos: 'pronoun',
      posUrdu: 'ضمیرِ منفصل',
      root: null,
      lemma: null,
      morphologyUrdu: 'ضمیرِ منفصل، جمع مذکر غائب، مبنی۔',
      syntaxUrdu: 'ضمير منفصل',
      dictionaryUrdu:
        'هُمْ کا عام مفہوم «وہ» ہے؛ یہاں اسم اور معرفہ خبر کے درمیان آ کر فصل اور تاکید کا کام کرتا ہے، جسے اردو میں «ہی» سے ادا کیا جاتا ہے۔ میم کا ضمہ اگلے ساکن کی وجہ سے ہے۔',
      segments: [
        {
          arabic: 'هُمُ',
          roleUrdu: 'ضمیرِ منفصل',
          meaningUrdu: 'وہی',
        },
      ],
      ruleIds: ['independent-pronoun', 'separating-pronoun'],
    },
    {
      id: '2:13:16',
      ayah: 13,
      position: 16,
      arabic: 'ٱلسُّفَهَآءُ',
      meaningUrdu: 'جو بیوقوف ہیں',
      pos: 'noun',
      posUrdu: 'اسم مرفوع',
      root: 'س ف ه',
      lemma: 'سَفِيه',
      morphologyUrdu: 'اسم، جمع مذکر، ال کے ساتھ معرفہ، مرفوع۔ سابقہ: ٱل (حرفِ تعریف)۔',
      syntaxUrdu: 'اسم مرفوع',
      dictionaryUrdu:
        'یہاں یہی لفظ إِنَّ کی خبر ہے: سَفِيه کی جمع، یعنی کم عقل لوگ۔ الف لام والی خبر اور ضمیرِ فصل مل کر یہ مفہوم دیتے ہیں کہ اصل بے وقوف یہی ہیں۔',
      segments: [
        {
          arabic: 'ٱل',
          roleUrdu: 'حرفِ تعریف',
          meaningUrdu: 'تعریف (معرفہ بنانے والا)',
        },
        {
          arabic: 'سُّفَهَآءُ',
          roleUrdu: 'اسم مرفوع',
          meaningUrdu: 'بے وقوف',
        },
      ],
      ruleIds: ['definite', 'nominative', 'broken-plural', 'inna'],
    },
    {
      id: '2:13:17',
      ayah: 13,
      position: 17,
      arabic: 'وَلَـٰكِن',
      meaningUrdu: 'لیکن',
      pos: 'particle',
      posUrdu: 'حرفِ استدراک',
      root: null,
      lemma: 'لَٰكِن',
      morphologyUrdu: 'حرفِ استدراک، مبنی۔ سابقہ: وَ (حرفِ زائد)۔',
      syntaxUrdu: 'الواو زائدة؛ حرف استدراك',
      dictionaryUrdu:
        'لَٰكِنْ «لیکن» پچھلی بات سے پیدا ہونے والے خیال کی اصلاح کرتا ہے۔ یہ مخففہ ہے اور عمل نہیں کرتا؛ پہلے کی وَ کو یہاں زائد مانا گیا ہے۔',
      segments: [
        {
          arabic: 'وَ',
          roleUrdu: 'حرفِ زائد',
          meaningUrdu: 'اور (زائد)',
        },
        {
          arabic: 'لَـٰكِن',
          roleUrdu: 'حرفِ استدراک',
          meaningUrdu: 'لیکن',
        },
      ],
      ruleIds: ['extra-particle', 'lightened-particle'],
    },
    {
      id: '2:13:18',
      ayah: 13,
      position: 18,
      arabic: 'لَّا',
      meaningUrdu: 'نہیں',
      pos: 'particle',
      posUrdu: 'حرفِ نفی',
      root: null,
      lemma: 'لَا',
      morphologyUrdu: 'حرفِ نفی، مبنی۔',
      syntaxUrdu: 'حرف نفي',
      dictionaryUrdu:
        'لَا یہاں خبر کی نفی کرتا ہے، کسی کو منع نہیں کرتا؛ اسی لیے بعد کے مضارع کا نون باقی ہے۔ لام کی تشدید پچھلے ساکن نون کے اس میں مدغم ہونے سے آئی ہے۔',
      segments: [
        {
          arabic: 'لَّا',
          roleUrdu: 'حرفِ نفی',
          meaningUrdu: 'نہیں',
        },
      ],
      ruleIds: ['negation'],
    },
    {
      id: '2:13:19',
      ayah: 13,
      position: 19,
      arabic: 'يَعْلَمُونَ',
      meaningUrdu: 'وہ علم رکھتے',
      pos: 'verb',
      posUrdu: 'فعلِ مضارع + ضمیرِ متصل',
      root: 'ع ل م',
      lemma: 'عَلِمَ',
      morphologyUrdu:
        'فعلِ مضارع، مرفوع، معروف، جمع مذکر غائب، ثلاثی مجرد — اوّل (I)۔ لاحقہ: ونَ ضمیرِ فاعل، جمع مذکر غائب۔',
      syntaxUrdu: 'فعل مضارع والواو ضمير متصل في محل رفع فاعل',
      dictionaryUrdu:
        'عَلِمَ کا معنی جاننا ہے، اسی سے عِلْم ہے۔ یہ مضارع جمع ہے اور آخر کا نون رفع کی علامت ہے؛ پہلے لَا نفی کا ہے، نہی کا نہیں، اس لیے نون باقی ہے۔',
      segments: [
        {
          arabic: 'يَعْلَمُ',
          roleUrdu: 'فعلِ مضارع',
          meaningUrdu: 'جانتے ہیں',
        },
        {
          arabic: 'ونَ',
          roleUrdu: 'ضمیرِ فاعل (جمع مذکر غائب)',
          meaningUrdu: 'وہ سب (فاعل)',
        },
      ],
      ruleIds: ['subject-pronoun', 'imperfect', 'five-verbs'],
    },
    {
      id: '2:14:1',
      ayah: 14,
      position: 1,
      arabic: 'وَإِذَا',
      meaningUrdu: 'اور جب',
      pos: 'noun',
      posUrdu: 'ظرفِ زمان',
      root: null,
      lemma: 'إِذَا',
      morphologyUrdu: 'ظرفِ زمان۔ سابقہ: وَ (حرفِ عطف)۔',
      syntaxUrdu: 'الواو عاطفة؛ ظرف زمان',
      dictionaryUrdu:
        'وَ اس نئی شرط کو پچھلے بیان پر عطف کرتا ہے اور إِذَا شرطیہ ظرف ہے، یعنی «جب»۔ اس آیت میں دو شرطیں آمنے سامنے آئی ہیں اور ہر ایک کا اپنا جواب ہے۔',
      segments: [
        {
          arabic: 'وَ',
          roleUrdu: 'حرفِ عطف',
          meaningUrdu: 'اور',
        },
        {
          arabic: 'إِذَا',
          roleUrdu: 'ظرفِ زمان',
          meaningUrdu: 'جب',
        },
      ],
      ruleIds: ['conjunction', 'condition'],
    },
    {
      id: '2:14:2',
      ayah: 14,
      position: 2,
      arabic: 'لَقُوا۟',
      meaningUrdu: 'ملاقات کرتے ہیں',
      pos: 'verb',
      posUrdu: 'فعلِ ماضی + ضمیرِ متصل',
      root: 'ل ق ي',
      lemma: 'لَقِيَ',
      morphologyUrdu:
        'فعلِ ماضی، معروف، جمع مذکر غائب، ثلاثی مجرد — اوّل (I)۔ لاحقہ: وا۟ ضمیرِ فاعل، جمع مذکر غائب۔',
      syntaxUrdu: 'فعل ماض والواو ضمير متصل في محل رفع فاعل',
      dictionaryUrdu:
        'لَقِيَ کا معنی کسی سے ملنا اور سامنا ہونا ہے۔ اصل لَقِيُوا تھا؛ آخری یاء گر گئی اور قاف کو ضمہ ملا، اس لیے لفظ میں مادے کا تیسرا حرف دکھائی نہیں دیتا۔',
      segments: [
        {
          arabic: 'لَقُ',
          roleUrdu: 'فعلِ ماضی',
          meaningUrdu: 'ملے / ملتے ہیں',
        },
        {
          arabic: 'وا۟',
          roleUrdu: 'ضمیرِ فاعل (جمع مذکر غائب)',
          meaningUrdu: 'وہ سب (فاعل)',
        },
      ],
      ruleIds: ['subject-pronoun', 'perfect', 'weak-verb', 'condition'],
    },
    {
      id: '2:14:3',
      ayah: 14,
      position: 3,
      arabic: 'ٱلَّذِينَ',
      meaningUrdu: 'ان لوگوں سے',
      pos: 'pronoun',
      posUrdu: 'اسمِ موصول',
      root: null,
      lemma: 'ٱلَّذِى',
      morphologyUrdu: 'اسمِ موصول، جمع مذکر، مبنی۔',
      syntaxUrdu: 'اسم موصول',
      dictionaryUrdu:
        'ٱلَّذِينَ جمع مذکر کا اسمِ موصول ہے: «وہ لوگ جو»۔ یہ مبنی ہے اور اس کا مطلب بعد کے صلہ سے مکمل ہوتا ہے؛ یہاں یہ پچھلے فعل کا مفعول ہے، اس لیے اردو میں «سے» آیا۔',
      segments: [
        {
          arabic: 'ٱلَّذِينَ',
          roleUrdu: 'اسمِ موصول',
          meaningUrdu: 'ان لوگوں سے جو',
        },
      ],
      ruleIds: ['relative', 'object'],
    },
    {
      id: '2:14:4',
      ayah: 14,
      position: 4,
      arabic: 'ءَامَنُوا۟',
      meaningUrdu: 'جو ایمان لائے',
      pos: 'verb',
      posUrdu: 'فعلِ ماضی + ضمیرِ متصل',
      root: 'أ م ن',
      lemma: 'آمَنَ',
      morphologyUrdu:
        'فعلِ ماضی، معروف، جمع مذکر غائب، ثلاثی مزید فیہ — چہارم (IV)، بابِ إِفْعَال۔ لاحقہ: وا۟ ضمیرِ فاعل، جمع مذکر غائب۔',
      syntaxUrdu: 'فعل ماض والواو ضمير متصل في محل رفع فاعل',
      dictionaryUrdu:
        'ءَامَنَ کا معنی ایمان لانا ہے۔ یہاں یہ اسمِ موصول کا صلہ ہے، اس لیے ترجمہ «جو ایمان لائے» بنتا ہے؛ واو کے بعد کا الف صرف لکھنے میں ہے، پڑھا نہیں جاتا۔',
      segments: [
        {
          arabic: 'ءَامَنُ',
          roleUrdu: 'فعلِ ماضی',
          meaningUrdu: 'ایمان لائے',
        },
        {
          arabic: 'وا۟',
          roleUrdu: 'ضمیرِ فاعل (جمع مذکر غائب)',
          meaningUrdu: 'وہ سب (فاعل)',
        },
      ],
      ruleIds: ['subject-pronoun', 'perfect', 'derived-form', 'hamzated'],
    },
    {
      id: '2:14:5',
      ayah: 14,
      position: 5,
      arabic: 'قَالُوٓا۟',
      meaningUrdu: 'وہ کہتے ہیں',
      pos: 'verb',
      posUrdu: 'فعلِ ماضی + ضمیرِ متصل',
      root: 'ق و ل',
      lemma: 'قَالَ',
      morphologyUrdu:
        'فعلِ ماضی، معروف، جمع مذکر غائب، ثلاثی مجرد — اوّل (I)۔ لاحقہ: وٓا۟ ضمیرِ فاعل، جمع مذکر غائب۔',
      syntaxUrdu: 'فعل ماض والواو ضمير متصل في محل رفع فاعل',
      dictionaryUrdu:
        'قَالَ کہنا ہے؛ یہاں شرط کے جواب میں ان کی کہی ہوئی بات آگے نقل ہو رہی ہے۔ جمع کی واو فاعل کی ضمیر ہے اور اس کے بعد لکھا گیا الف پڑھا نہیں جاتا۔',
      segments: [
        {
          arabic: 'قَالُ',
          roleUrdu: 'فعلِ ماضی',
          meaningUrdu: 'کہا / کہتے ہیں',
        },
        {
          arabic: 'وٓا۟',
          roleUrdu: 'ضمیرِ فاعل (جمع مذکر غائب)',
          meaningUrdu: 'وہ سب (فاعل)',
        },
      ],
      ruleIds: ['subject-pronoun', 'perfect', 'weak-verb', 'condition-answer', 'quoted-speech'],
    },
    {
      id: '2:14:6',
      ayah: 14,
      position: 6,
      arabic: 'ءَامَنَّا',
      meaningUrdu: 'ایمان لائے ہم',
      pos: 'verb',
      posUrdu: 'فعلِ ماضی + ضمیرِ متصل',
      root: 'أ م ن',
      lemma: 'آمَنَ',
      morphologyUrdu:
        'فعلِ ماضی، معروف، جمع متکلم، ثلاثی مزید فیہ — چہارم (IV)، بابِ إِفْعَال۔ لاحقہ: نَّا ضمیرِ فاعل، جمع متکلم۔',
      syntaxUrdu: 'فعل ماض و«نا» ضمير متصل في محل رفع فاعل',
      dictionaryUrdu:
        'یہ ءَامَنَ کا ماضی جمع متکلم ہے۔ اصل ءَامَنْنَا تھا: فعل کا آخری نون اور ضمیر نَا کا نون مل کر مشدد ہو گئے، اس لیے فعل والے حصے میں نون نظر نہیں آتا۔',
      segments: [
        {
          arabic: 'ءَامَ',
          roleUrdu: 'فعلِ ماضی',
          meaningUrdu: 'ایمان لائے',
        },
        {
          arabic: 'نَّا',
          roleUrdu: 'ضمیرِ فاعل (جمع متکلم)',
          meaningUrdu: 'ہم (فاعل)',
        },
      ],
      ruleIds: ['subject-pronoun', 'perfect', 'derived-form', 'hamzated'],
    },
    {
      id: '2:14:7',
      ayah: 14,
      position: 7,
      arabic: 'وَإِذَا',
      meaningUrdu: 'اورجب',
      pos: 'noun',
      posUrdu: 'ظرفِ زمان',
      root: null,
      lemma: 'إِذَا',
      morphologyUrdu: 'ظرفِ زمان۔ سابقہ: وَ (حرفِ عطف)۔',
      syntaxUrdu: 'الواو عاطفة؛ ظرف زمان',
      dictionaryUrdu:
        'وَ اس دوسری صورت کو پہلی شرط پر عطف کرتا ہے اور إِذَا پھر شرطیہ ظرف ہے، یعنی «جب»۔ یہاں ایک ہی جملے میں دو شرطیں آمنے سامنے آئی ہیں اور ہر ایک کا اپنا جواب ہے۔',
      segments: [
        {
          arabic: 'وَ',
          roleUrdu: 'حرفِ عطف',
          meaningUrdu: 'اور',
        },
        {
          arabic: 'إِذَا',
          roleUrdu: 'ظرفِ زمان',
          meaningUrdu: 'جب',
        },
      ],
      ruleIds: ['conjunction', 'condition'],
    },
    {
      id: '2:14:8',
      ayah: 14,
      position: 8,
      arabic: 'خَلَوْا۟',
      meaningUrdu: 'وہ اکیلے ہوتے ہیں',
      pos: 'verb',
      posUrdu: 'فعلِ ماضی + ضمیرِ متصل',
      root: 'خ ل و',
      lemma: 'خَلَا',
      morphologyUrdu:
        'فعلِ ماضی، معروف، جمع مذکر غائب، ثلاثی مجرد — اوّل (I)۔ لاحقہ: وْا۟ ضمیرِ فاعل، جمع مذکر غائب۔',
      syntaxUrdu: 'فعل ماض والواو ضمير متصل في محل رفع فاعل',
      dictionaryUrdu:
        'خَلَا کا معنی خالی ہونا اور تنہائی میں جانا ہے۔ ناقص واوی فعل ہے؛ جمع کی واو سے ملنے پر آخری اصلی حرف گر گیا، اور إِلَىٰ کے ساتھ یہ کسی کے پاس الگ جا ملنے کا مفہوم دیتا ہے۔',
      segments: [
        {
          arabic: 'خَلَ',
          roleUrdu: 'فعلِ ماضی',
          meaningUrdu: 'اکیلے ہوئے / تنہا جاتے ہیں',
        },
        {
          arabic: 'وْا۟',
          roleUrdu: 'ضمیرِ فاعل (جمع مذکر غائب)',
          meaningUrdu: 'وہ سب (فاعل)',
        },
      ],
      ruleIds: ['subject-pronoun', 'perfect', 'weak-verb', 'condition'],
    },
    {
      id: '2:14:9',
      ayah: 14,
      position: 9,
      arabic: 'إِلَىٰ',
      meaningUrdu: 'طرف',
      pos: 'particle',
      posUrdu: 'حرفِ جر',
      root: null,
      lemma: 'إِلَىٰ',
      morphologyUrdu: 'حرفِ جر، مبنی۔',
      syntaxUrdu: 'حرف جر',
      dictionaryUrdu:
        'إِلَىٰ عموماً کسی سمت یا انتہا کی طرف بڑھنے کو بتاتا ہے۔ یہاں تنہائی کے فعل کے ساتھ آ کر «کسی کے پاس جا کر» کا مفہوم دیتا ہے، اس لیے اردو میں «کے پاس» یا «کے ساتھ» بھی بنتا ہے۔',
      segments: [
        {
          arabic: 'إِلَىٰ',
          roleUrdu: 'حرفِ جر',
          meaningUrdu: 'کی طرف / کے پاس',
        },
      ],
      ruleIds: ['preposition'],
    },
    {
      id: '2:14:10',
      ayah: 14,
      position: 10,
      arabic: 'شَيَـٰطِينِهِمْ',
      meaningUrdu: 'اپنے شیطانوں کے',
      pos: 'noun',
      posUrdu: 'اسم مجرور + ضمیرِ متصل',
      root: 'ش ط ن',
      lemma: 'شَيْطَٰن',
      morphologyUrdu: 'اسم، جمع مذکر، مجرور۔ لاحقہ: هِمْ ضمیرِ متصل، جمع مذکر غائب۔',
      syntaxUrdu: 'اسم مجرور و«هم» ضمير متصل في محل جر بالاضافة',
      dictionaryUrdu:
        'شَيَاطِين شَيْطَان کی جمع ہے، یعنی سرکش اور بہکانے والا؛ یہ لفظ ہر حد سے بڑھے ہوئے سرکش کے لیے آتا ہے۔ یہ وزن غیر منصرف ہے، مگر مضاف ہونے کی وجہ سے یہاں کسرہ آیا۔',
      segments: [
        {
          arabic: 'شَيَـٰطِينِ',
          roleUrdu: 'اسم مجرور',
          meaningUrdu: 'شیطانوں',
        },
        {
          arabic: 'هِمْ',
          roleUrdu: 'ضمیرِ متصل (جمع مذکر غائب)',
          meaningUrdu: 'اپنے / ان کے',
        },
      ],
      ruleIds: ['pronoun', 'genitive', 'broken-plural', 'idafa'],
    },
    {
      id: '2:14:11',
      ayah: 14,
      position: 11,
      arabic: 'قَالُوٓا۟',
      meaningUrdu: 'وہ کہتے ہیں',
      pos: 'verb',
      posUrdu: 'فعلِ ماضی + ضمیرِ متصل',
      root: 'ق و ل',
      lemma: 'قَالَ',
      morphologyUrdu:
        'فعلِ ماضی، معروف، جمع مذکر غائب، ثلاثی مجرد — اوّل (I)۔ لاحقہ: وٓا۟ ضمیرِ فاعل، جمع مذکر غائب۔',
      syntaxUrdu: 'فعل ماض والواو ضمير متصل في محل رفع فاعل',
      dictionaryUrdu:
        'یہ دوسری شرط کا جواب ہے اور اس کا مقولہ آگے آتا ہے۔ قَالَ اجوف واوی ہے؛ ماضی میں درمیانی واو الف بن جاتا ہے، جبکہ آخر کی واو جمع کے فاعل کی ضمیر ہے۔',
      segments: [
        {
          arabic: 'قَالُ',
          roleUrdu: 'فعلِ ماضی',
          meaningUrdu: 'کہا / کہتے ہیں',
        },
        {
          arabic: 'وٓا۟',
          roleUrdu: 'ضمیرِ فاعل (جمع مذکر غائب)',
          meaningUrdu: 'وہ سب (فاعل)',
        },
      ],
      ruleIds: ['subject-pronoun', 'perfect', 'weak-verb', 'condition-answer', 'quoted-speech'],
    },
    {
      id: '2:14:12',
      ayah: 14,
      position: 12,
      arabic: 'إِنَّا',
      meaningUrdu: 'بیشک ہم',
      pos: 'particle',
      posUrdu: 'حرفِ نصب + ضمیرِ متصل',
      root: null,
      lemma: 'إِنّ',
      morphologyUrdu: 'حرفِ نصب، مبنی۔ لاحقہ: ا ضمیرِ متصل، جمع متکلم۔',
      syntaxUrdu: 'حرف نصب و«نا» ضمير متصل في محل نصب اسم «ان»',
      dictionaryUrdu:
        'إِنَّ تاکید کا حرف ہے اور اس کا اسم ضمیر نَا ہے جو محلِ نصب میں ہے۔ اصل إِنَّنَا تھا؛ ایک نون گر گیا، اس لیے ضمیر کے حصے میں لکھنے میں صرف الف باقی ہے۔',
      segments: [
        {
          arabic: 'إِنَّ',
          roleUrdu: 'حرفِ نصب',
          meaningUrdu: 'بے شک',
        },
        {
          arabic: 'ا',
          roleUrdu: 'ضمیرِ متصل (جمع متکلم)',
          meaningUrdu: 'ہم (اسمِ إِنَّ)',
        },
      ],
      ruleIds: ['pronoun', 'inna'],
    },
    {
      id: '2:14:13',
      ayah: 14,
      position: 13,
      arabic: 'مَعَكُمْ',
      meaningUrdu: 'تمہارے ساتھ ہیں',
      pos: 'noun',
      posUrdu: 'ظرفِ مکان منصوب + ضمیرِ متصل',
      root: null,
      lemma: 'مَع',
      morphologyUrdu: 'ظرفِ مکان، منصوب۔ لاحقہ: كُمْ ضمیرِ متصل، جمع مذکر حاضر۔',
      syntaxUrdu: 'ظرف مكان منصوب والكاف ضمير متصل في محل جر بالاضافة',
      dictionaryUrdu:
        'مَعَ ساتھ ہونے کا ظرف ہے جو اپنے بعد والے کی طرف مضاف ہوتا ہے۔ یہ اسم (ظرف) ہے، حرف نہیں؛ یہاں إِنَّ کی خبر اسی ظرف سے متعلق ہے۔',
      segments: [
        {
          arabic: 'مَعَ',
          roleUrdu: 'ظرفِ مکان منصوب',
          meaningUrdu: 'ساتھ',
        },
        {
          arabic: 'كُمْ',
          roleUrdu: 'ضمیرِ متصل (جمع مذکر حاضر)',
          meaningUrdu: 'تمہارے',
        },
      ],
      ruleIds: ['pronoun', 'adverb', 'idafa'],
    },
    {
      id: '2:14:14',
      ayah: 14,
      position: 14,
      arabic: 'إِنَّمَا',
      meaningUrdu: 'بیشک',
      pos: 'particle',
      posUrdu: 'حرفِ نصب + حرفِ کاف',
      root: null,
      lemma: 'إِنّ',
      morphologyUrdu: 'حرفِ نصب + حرفِ کاف، مبنی۔',
      syntaxUrdu: 'كافة ومكفوفة',
      dictionaryUrdu:
        'إِنَّمَا حصر کا حرف ہے، یعنی بات کو ایک ہی پہلو میں محدود کرنا: «ہم تو بس…»۔ یہاں مَا کافہ ہے، موصول نہیں؛ اسی لیے بعد کی ضمیر إِنَّ کا اسم نہیں بلکہ مبتدا ہے۔',
      segments: [
        {
          arabic: 'إِنَّ',
          roleUrdu: 'حرفِ نصب',
          meaningUrdu: 'بے شک',
        },
        {
          arabic: 'مَا',
          roleUrdu: 'حرفِ کاف',
          meaningUrdu: 'روکنے والا (مَا کافہ)',
        },
      ],
      ruleIds: ['restriction'],
    },
    {
      id: '2:14:15',
      ayah: 14,
      position: 15,
      arabic: 'نَحْنُ',
      meaningUrdu: 'ہم تو',
      pos: 'pronoun',
      posUrdu: 'ضمیرِ منفصل',
      root: null,
      lemma: null,
      morphologyUrdu: 'ضمیرِ منفصل، جمع متکلم، مبنی۔',
      syntaxUrdu: 'ضمير منفصل',
      dictionaryUrdu:
        'نَحْنُ کا معنی «ہم» ہے اور یہ مبنی ضمیر ہے۔ یہاں یہ إِنَّمَا کے بعد مبتدا ہے؛ بولنے والے اپنے ساتھیوں کے سامنے اپنی اصل حیثیت بیان کر رہے ہیں۔',
      segments: [
        {
          arabic: 'نَحْنُ',
          roleUrdu: 'ضمیرِ منفصل',
          meaningUrdu: 'ہم',
        },
      ],
      ruleIds: ['independent-pronoun', 'nominal'],
    },
    {
      id: '2:14:16',
      ayah: 14,
      position: 16,
      arabic: 'مُسْتَهْزِءُونَ',
      meaningUrdu: 'مذاق کرنے والے ہیں',
      pos: 'noun',
      posUrdu: 'اسمِ فاعل مرفوع',
      root: 'ه ز أ',
      lemma: 'مُسْتَهْزِءُون',
      morphologyUrdu: 'اسمِ فاعل، ثلاثی مزید فیہ — دہم (X)، بابِ اِسْتِفْعَال، جمع مذکر، مرفوع۔',
      syntaxUrdu: 'اسم مرفوع',
      dictionaryUrdu:
        'مُسْتَهْزِئ اسْتَهْزَأَ «مذاق اڑانا» کا اسمِ فاعل ہے، جو هَزِئَ سے بابِ استفعال ہے۔ ہمزہ یہاں واو کی کرسی پر لکھا گیا ہے؛ یہ اسم ہے، فعل نہیں۔',
      segments: [
        {
          arabic: 'مُسْتَهْزِءُونَ',
          roleUrdu: 'اسمِ فاعل مرفوع',
          meaningUrdu: 'مذاق اڑانے والے',
        },
      ],
      ruleIds: ['nominative', 'participle', 'sound-plural', 'nominal', 'derived-form'],
    },
    {
      id: '2:15:1',
      ayah: 15,
      position: 1,
      arabic: 'ٱللَّهُ',
      meaningUrdu: 'اللہ',
      pos: 'noun',
      posUrdu: 'اسمِ علم مرفوع',
      root: 'أ ل ه',
      lemma: 'ٱللَّه',
      morphologyUrdu: 'اسمِ علم، مرفوع۔',
      syntaxUrdu: 'لفظ الجلالة مرفوع',
      dictionaryUrdu:
        'اللہ تعالیٰ کا خاص نام ہے۔ لغوی اشاریے میں اسے أ ل ه کے تحت رکھا جاتا ہے، مگر اس کے اشتقاق میں اختلاف ہے؛ یہاں یہ مبتدا ہونے کی وجہ سے مرفوع ہے۔',
      segments: [
        {
          arabic: 'ٱللَّهُ',
          roleUrdu: 'اسمِ علم مرفوع',
          meaningUrdu: 'اللہ',
        },
      ],
      ruleIds: ['proper-noun', 'nominative', 'nominal'],
    },
    {
      id: '2:15:2',
      ayah: 15,
      position: 2,
      arabic: 'يَسْتَهْزِئُ',
      meaningUrdu: 'مذاق کرے گا / مذاق کرتا ہے',
      pos: 'verb',
      posUrdu: 'فعلِ مضارع',
      root: 'ه ز أ',
      lemma: 'اِسْتَهْزَأَ',
      morphologyUrdu:
        'فعلِ مضارع، مرفوع، معروف، واحد مذکر غائب، ثلاثی مزید فیہ — دہم (X)، بابِ اِسْتِفْعَال۔',
      syntaxUrdu: 'فعل مضارع',
      dictionaryUrdu:
        'اسْتَهْزَأَ مذاق اڑانے کے معنی میں بابِ استفعال ہے۔ یہاں فعل مضارع ہے جو جاری یا آئندہ ہونے کا مفہوم دیتا ہے، اور یہ جملہ مبتدا کی خبر ہے؛ آخری ہمزہ یاء کی کرسی پر ہے۔',
      segments: [
        {
          arabic: 'يَسْتَهْزِئُ',
          roleUrdu: 'فعلِ مضارع',
          meaningUrdu: 'مذاق کرتا ہے',
        },
      ],
      ruleIds: ['imperfect', 'derived-form', 'hamzated', 'nominal'],
    },
    {
      id: '2:15:3',
      ayah: 15,
      position: 3,
      arabic: 'بِهِمْ',
      meaningUrdu: 'ساتھ ان کے',
      pos: 'particle',
      posUrdu: 'حرفِ جر + ضمیرِ متصل',
      root: null,
      lemma: null,
      morphologyUrdu: 'حرفِ جر + ضمیرِ متصل، جمع مذکر غائب، مبنی۔ سابقہ: بِ (حرفِ جر)۔',
      syntaxUrdu: 'جار ومجرور',
      dictionaryUrdu:
        'بِ یہاں اس شخص کو بتاتا ہے جس کا مذاق اڑایا جائے؛ اسْتَهْزَأَ اپنا مفعول اسی حرف کے ذریعے لیتا ہے۔ هِمْ متصل ضمیر ہے اور اس کی ہاء پر کسرہ پچھلی کسرہ کی وجہ سے ہے۔',
      segments: [
        {
          arabic: 'بِ',
          roleUrdu: 'حرفِ جر',
          meaningUrdu: 'کے ساتھ / سے',
        },
        {
          arabic: 'هِمْ',
          roleUrdu: 'ضمیرِ متصل (مجرور)',
          meaningUrdu: 'ان',
        },
      ],
      ruleIds: ['preposition', 'pronoun'],
    },
    {
      id: '2:15:4',
      ayah: 15,
      position: 4,
      arabic: 'وَيَمُدُّهُمْ',
      meaningUrdu: 'اور وہ ڈھیل دے رہا ہے ان کو',
      pos: 'verb',
      posUrdu: 'فعلِ مضارع + ضمیرِ متصل',
      root: 'م د د',
      lemma: 'مَدَّ',
      morphologyUrdu:
        'فعلِ مضارع، مرفوع، معروف، واحد مذکر غائب، ثلاثی مجرد — اوّل (I)۔ سابقہ: وَ (حرفِ عطف)۔ لاحقہ: هُمْ ضمیرِ مفعول، جمع مذکر غائب۔',
      syntaxUrdu: 'الواو عاطفة؛ فعل مضارع و«هم» ضمير متصل في محل نصب مفعول به',
      dictionaryUrdu:
        'مَدَّ کا اصل معنی کھینچنا، پھیلانا اور بڑھانا ہے، اسی سے «مہلت بڑھانا، ڈھیل دینا» بنتا ہے۔ مضاعف فعل ہے: اصل يَمْدُدُ میں دونوں دال مل کر مشدد ہو گئے۔',
      segments: [
        {
          arabic: 'وَ',
          roleUrdu: 'حرفِ عطف',
          meaningUrdu: 'اور',
        },
        {
          arabic: 'يَمُدُّ',
          roleUrdu: 'فعلِ مضارع',
          meaningUrdu: 'ڈھیل دیتا ہے',
        },
        {
          arabic: 'هُمْ',
          roleUrdu: 'ضمیرِ مفعول (جمع مذکر غائب)',
          meaningUrdu: 'ان کو',
        },
      ],
      ruleIds: ['object-pronoun', 'conjunction', 'imperfect', 'doubled'],
    },
    {
      id: '2:15:5',
      ayah: 15,
      position: 5,
      arabic: 'فِى',
      meaningUrdu: 'ان کی',
      pos: 'particle',
      posUrdu: 'حرفِ جر',
      root: null,
      lemma: 'فِى',
      morphologyUrdu: 'حرفِ جر، مبنی۔',
      syntaxUrdu: 'حرف جر',
      dictionaryUrdu:
        'فِى کسی کیفیت کے اندر ہونے کو بتاتا ہے؛ یہاں اگلا مصدر وہ حالت ہے جس میں وہ پڑے رہتے ہیں۔ لفظ بہ لفظ ترجمے میں «ان کی» اس کے نیچے آیا ہے، مگر خود اس حرف کا معنی «میں» ہے۔',
      segments: [
        {
          arabic: 'فِى',
          roleUrdu: 'حرفِ جر',
          meaningUrdu: 'میں',
        },
      ],
      ruleIds: ['preposition'],
    },
    {
      id: '2:15:6',
      ayah: 15,
      position: 6,
      arabic: 'طُغْيَـٰنِهِمْ',
      meaningUrdu: 'سرکشی میں',
      pos: 'noun',
      posUrdu: 'مصدر مجرور + ضمیرِ متصل',
      root: 'ط غ ي',
      lemma: 'طُغْيَٰن',
      morphologyUrdu: 'مصدر، مذکر، مجرور۔ لاحقہ: هِمْ ضمیرِ متصل، جمع مذکر غائب۔',
      syntaxUrdu: 'اسم مجرور و«هم» ضمير متصل في محل جر بالاضافة',
      dictionaryUrdu:
        'طُغْيَان طَغَىٰ «حد سے بڑھنا» کا مصدر ہے، یعنی سرکشی اور حد سے تجاوز۔ مادہ ط غ ي ناقص ہے؛ فُعْلَان کے وزن میں یاء یہاں ظاہر رہتی ہے۔',
      segments: [
        {
          arabic: 'طُغْيَـٰنِ',
          roleUrdu: 'مصدر مجرور',
          meaningUrdu: 'سرکشی',
        },
        {
          arabic: 'هِمْ',
          roleUrdu: 'ضمیرِ متصل (جمع مذکر غائب)',
          meaningUrdu: 'ان کی',
        },
      ],
      ruleIds: ['pronoun', 'genitive', 'verbal-noun', 'idafa'],
    },
    {
      id: '2:15:7',
      ayah: 15,
      position: 7,
      arabic: 'يَعْمَهُونَ',
      meaningUrdu: 'وہ بھٹک رہے ہیں/ اندھے بنے پھرتے ہیں',
      pos: 'verb',
      posUrdu: 'فعلِ مضارع + ضمیرِ متصل',
      root: 'ع م ه',
      lemma: 'عَمِهَ',
      morphologyUrdu:
        'فعلِ مضارع، مرفوع، معروف، جمع مذکر غائب، ثلاثی مجرد — اوّل (I)۔ لاحقہ: ونَ ضمیرِ فاعل، جمع مذکر غائب۔',
      syntaxUrdu: 'فعل مضارع والواو ضمير متصل في محل رفع فاعل',
      dictionaryUrdu:
        'عَمِهَ گمراہی میں حیران و سرگرداں پھرنے کو کہتے ہیں اور اس کا تعلق دل کی بصیرت سے ہے۔ اسے آنکھ کے اندھے پن والے مادے ع م ي سے نہ ملائیں؛ یہاں آخری اصلی حرف ہاء ہے۔',
      segments: [
        {
          arabic: 'يَعْمَهُ',
          roleUrdu: 'فعلِ مضارع',
          meaningUrdu: 'بھٹکتے پھرتے ہیں',
        },
        {
          arabic: 'ونَ',
          roleUrdu: 'ضمیرِ فاعل (جمع مذکر غائب)',
          meaningUrdu: 'وہ سب (فاعل)',
        },
      ],
      ruleIds: ['subject-pronoun', 'imperfect', 'five-verbs', 'haal'],
    },
    {
      id: '2:16:1',
      ayah: 16,
      position: 1,
      arabic: 'أُو۟لَـٰٓئِكَ',
      meaningUrdu: 'یہی ہیں',
      pos: 'pronoun',
      posUrdu: 'اسمِ اشارہ',
      root: null,
      lemma: 'أُولَٰٓئِك',
      morphologyUrdu: 'اسمِ اشارہ، جمع، مبنی۔',
      syntaxUrdu: 'اسم اشارة',
      dictionaryUrdu:
        'یہ دور کے متعدد افراد کی طرف اشارہ ہے: «وہ لوگ»۔ لکھنے میں ہمزہ کے بعد والا واو پڑھا نہیں جاتا، اور آخر کا كَ خطاب کا حرف ہے، ضمیر نہیں۔',
      segments: [
        {
          arabic: 'أُو۟لَـٰٓئِكَ',
          roleUrdu: 'اسمِ اشارہ',
          meaningUrdu: 'وہ لوگ / یہی',
        },
      ],
      ruleIds: ['demonstrative', 'nominal'],
    },
    {
      id: '2:16:2',
      ayah: 16,
      position: 2,
      arabic: 'ٱلَّذِينَ',
      meaningUrdu: 'وہ لوگ',
      pos: 'pronoun',
      posUrdu: 'اسمِ موصول',
      root: null,
      lemma: 'ٱلَّذِى',
      morphologyUrdu: 'اسمِ موصول، جمع مذکر، مبنی۔',
      syntaxUrdu: 'اسم موصول',
      dictionaryUrdu:
        'ٱلَّذِينَ جمع مذکر کا اسمِ موصول ہے: «وہ لوگ جو / جنہوں نے»۔ یہاں یہ اسمِ اشارہ کی خبر ہے اور اس کا مفہوم بعد کے صلہ سے پورا ہوتا ہے۔',
      segments: [
        {
          arabic: 'ٱلَّذِينَ',
          roleUrdu: 'اسمِ موصول',
          meaningUrdu: 'وہ جنہوں نے',
        },
      ],
      ruleIds: ['relative', 'nominal'],
    },
    {
      id: '2:16:3',
      ayah: 16,
      position: 3,
      arabic: 'ٱشْتَرَوُا۟',
      meaningUrdu: 'جنہوں نے خرید لی',
      pos: 'verb',
      posUrdu: 'فعلِ ماضی + ضمیرِ متصل',
      root: 'ش ر ي',
      lemma: 'اِشْتَرَى',
      morphologyUrdu:
        'فعلِ ماضی، معروف، جمع مذکر غائب، ثلاثی مزید فیہ — ہشتم (VIII)، بابِ اِفْتِعَال۔ لاحقہ: وُا۟ ضمیرِ فاعل، جمع مذکر غائب۔',
      syntaxUrdu: 'فعل ماض والواو ضمير متصل في محل رفع فاعل',
      dictionaryUrdu:
        'ٱشْتَرَىٰ شَرَىٰ سے بابِ افتعال ہے اور خریدنے، یعنی ایک چیز دے کر دوسری لینے کے معنی دیتا ہے۔ آخری یاء ضمیر سے ملنے پر گر گئی، اور واو کا ضمہ اگلے ساکن سے ملنے کی وجہ سے ہے۔',
      segments: [
        {
          arabic: 'ٱشْتَرَ',
          roleUrdu: 'فعلِ ماضی',
          meaningUrdu: 'خرید لی',
        },
        {
          arabic: 'وُا۟',
          roleUrdu: 'ضمیرِ فاعل (جمع مذکر غائب)',
          meaningUrdu: 'وہ سب (فاعل)',
        },
      ],
      ruleIds: ['subject-pronoun', 'perfect', 'derived-form', 'weak-verb'],
    },
    {
      id: '2:16:4',
      ayah: 16,
      position: 4,
      arabic: 'ٱلضَّلَـٰلَةَ',
      meaningUrdu: 'گمراہی',
      pos: 'noun',
      posUrdu: 'اسم منصوب',
      root: 'ض ل ل',
      lemma: 'ضَلَٰلَة',
      morphologyUrdu: 'اسم، مؤنث، ال کے ساتھ معرفہ، منصوب۔ سابقہ: ٱل (حرفِ تعریف)۔',
      syntaxUrdu: 'اسم منصوب',
      dictionaryUrdu:
        'ضَلَالَة ضَلَّ «راستے سے بھٹکنا» کا مصدر ہے، یعنی گمراہی، اور اس کی ضد ہدایت ہے۔ الف لام کا لام ضاد میں مدغم ہے، اس لیے ضاد مشدد ہے؛ یہاں یہ خریدنے کا مفعول ہے۔',
      segments: [
        {
          arabic: 'ٱل',
          roleUrdu: 'حرفِ تعریف',
          meaningUrdu: 'تعریف (معرفہ بنانے والا)',
        },
        {
          arabic: 'ضَّلَـٰلَةَ',
          roleUrdu: 'اسم منصوب',
          meaningUrdu: 'گمراہی',
        },
      ],
      ruleIds: ['definite', 'accusative', 'object'],
    },
    {
      id: '2:16:5',
      ayah: 16,
      position: 5,
      arabic: 'بِٱلْهُدَىٰ',
      meaningUrdu: 'بدلے ہدایت کے',
      pos: 'noun',
      posUrdu: 'اسم مجرور',
      root: 'ه د ي',
      lemma: 'هُدًى',
      morphologyUrdu: 'اسم، مذکر، ال کے ساتھ معرفہ، مجرور۔ سابقہ: بِ (حرفِ جر)؛ ٱلْ (حرفِ تعریف)۔',
      syntaxUrdu: 'جار ومجرور',
      dictionaryUrdu:
        'هُدًى کا معنی رہنمائی اور سیدھا راستہ ہے۔ بِ یہاں عوض کا ہے، یعنی وہ چیز جو بدلے میں دے دی گئی؛ آخر میں الف ہونے سے جر کی علامت مقدر ہے۔',
      segments: [
        {
          arabic: 'بِ',
          roleUrdu: 'حرفِ جر',
          meaningUrdu: 'کے بدلے',
        },
        {
          arabic: 'ٱلْ',
          roleUrdu: 'حرفِ تعریف',
          meaningUrdu: 'تعریف (معرفہ بنانے والا)',
        },
        {
          arabic: 'هُدَىٰ',
          roleUrdu: 'اسم مجرور',
          meaningUrdu: 'ہدایت',
        },
      ],
      ruleIds: ['preposition', 'definite', 'genitive', 'implied-case'],
    },
    {
      id: '2:16:6',
      ayah: 16,
      position: 6,
      arabic: 'فَمَا',
      meaningUrdu: 'تو نہ',
      pos: 'particle',
      posUrdu: 'حرفِ نفی',
      root: null,
      lemma: 'مَا',
      morphologyUrdu: 'حرفِ نفی، مبنی۔ سابقہ: فَ (حرفِ استئناف)۔',
      syntaxUrdu: 'الفاء استئنافية؛ حرف نفي',
      dictionaryUrdu:
        'فَ پچھلی بات کے بعد نتیجہ لاتا ہے اور مَا ماضی کی نفی کرتا ہے۔ یہاں مَا نافیہ ہے، موصول یا سوالیہ نہیں؛ اس کا فعل پر کوئی عمل نہیں۔',
      segments: [
        {
          arabic: 'فَ',
          roleUrdu: 'حرفِ استئناف',
          meaningUrdu: 'تو',
        },
        {
          arabic: 'مَا',
          roleUrdu: 'حرفِ نفی',
          meaningUrdu: 'نہ',
        },
      ],
      ruleIds: ['resumption', 'negation'],
    },
    {
      id: '2:16:7',
      ayah: 16,
      position: 7,
      arabic: 'رَبِحَت',
      meaningUrdu: 'فائدہ مند ہوئی / فائدہ دیا',
      pos: 'verb',
      posUrdu: 'فعلِ ماضی',
      root: 'ر ب ح',
      lemma: 'رَبِحَ',
      morphologyUrdu: 'فعلِ ماضی، معروف، واحد مؤنث غائب، ثلاثی مجرد — اوّل (I)۔',
      syntaxUrdu: 'فعل ماض',
      dictionaryUrdu:
        'رَبِحَ کا معنی تجارت میں نفع کمانا ہے۔ آخر کی ساکن تاء فاعل کے مؤنث ہونے کی علامت ہے، ضمیر نہیں؛ یہاں نفع کی نسبت تجارت کی طرف کی گئی ہے۔',
      segments: [
        {
          arabic: 'رَبِحَت',
          roleUrdu: 'فعلِ ماضی',
          meaningUrdu: 'نفع دیا / فائدہ مند ہوئی',
        },
      ],
      ruleIds: ['perfect', 'feminine-marker'],
    },
    {
      id: '2:16:8',
      ayah: 16,
      position: 8,
      arabic: 'تِّجَـٰرَتُهُمْ',
      meaningUrdu: 'تجارت ان کی نے',
      pos: 'noun',
      posUrdu: 'اسم مرفوع + ضمیرِ متصل',
      root: 'ت ج ر',
      lemma: 'تِجَٰرَة',
      morphologyUrdu: 'اسم، مؤنث، مرفوع۔ لاحقہ: هُمْ ضمیرِ متصل، جمع مذکر غائب۔',
      syntaxUrdu: 'اسم مرفوع و«هم» ضمير متصل في محل جر بالاضافة',
      dictionaryUrdu:
        'تِجَارَة خرید و فروخت اور نفع کے لیے کاروبار ہے۔ گول تاء کی وجہ سے مؤنث ہے، اسی لیے فعل پر تائے تانیث آئی؛ شروع کی تاء پر تشدید پچھلی تاء کے ادغام سے ہے۔',
      segments: [
        {
          arabic: 'تِّجَـٰرَتُ',
          roleUrdu: 'اسم مرفوع',
          meaningUrdu: 'تجارت',
        },
        {
          arabic: 'هُمْ',
          roleUrdu: 'ضمیرِ متصل (جمع مذکر غائب)',
          meaningUrdu: 'ان کی',
        },
      ],
      ruleIds: ['pronoun', 'nominative', 'subject', 'idafa'],
    },
    {
      id: '2:16:9',
      ayah: 16,
      position: 9,
      arabic: 'وَمَا',
      meaningUrdu: 'اور نہ',
      pos: 'particle',
      posUrdu: 'حرفِ نفی',
      root: null,
      lemma: 'مَا',
      morphologyUrdu: 'حرفِ نفی، مبنی۔ سابقہ: وَ (حرفِ عطف)۔',
      syntaxUrdu: 'الواو عاطفة؛ حرف نفي',
      dictionaryUrdu:
        'وَ اس نفی کو پچھلی نفی سے جوڑتا ہے اور مَا نافیہ ہے۔ یہاں مَا کے بعد كَانَ آیا ہے، اس لیے نفی ماضی کی ایک حالت پر ہے۔',
      segments: [
        {
          arabic: 'وَ',
          roleUrdu: 'حرفِ عطف',
          meaningUrdu: 'اور',
        },
        {
          arabic: 'مَا',
          roleUrdu: 'حرفِ نفی',
          meaningUrdu: 'نہ',
        },
      ],
      ruleIds: ['conjunction', 'negation'],
    },
    {
      id: '2:16:10',
      ayah: 16,
      position: 10,
      arabic: 'كَانُوا۟',
      meaningUrdu: 'تھے وہ',
      pos: 'verb',
      posUrdu: 'فعلِ ماضی + ضمیرِ متصل',
      root: 'ك و ن',
      lemma: 'كَانَ',
      morphologyUrdu:
        'فعلِ ماضی، معروف، جمع مذکر غائب، ثلاثی مجرد — اوّل (I)۔ لاحقہ: وا۟ ضمیرِ فاعل، جمع مذکر غائب۔',
      syntaxUrdu: 'فعل ماض والواو ضمير متصل في محل رفع اسم «كان»',
      dictionaryUrdu:
        'كَانَ «ہونا، تھا» کے معنی میں فعلِ ناقص ہے جو اسم کو رفع اور خبر کو نصب دیتا ہے۔ اجوف واوی ہے: الف کے پیچھے اصلی واو ہے، اور جمع کی واو یہاں اس کا اسم ہے۔',
      segments: [
        {
          arabic: 'كَانُ',
          roleUrdu: 'فعلِ ماضی',
          meaningUrdu: 'تھے',
        },
        {
          arabic: 'وا۟',
          roleUrdu: 'ضمیرِ فاعل (جمع مذکر غائب)',
          meaningUrdu: 'وہ سب (اسمِ كَانَ)',
        },
      ],
      ruleIds: ['subject-pronoun', 'kana', 'perfect', 'weak-verb'],
    },
    {
      id: '2:16:11',
      ayah: 16,
      position: 11,
      arabic: 'مُهْتَدِينَ',
      meaningUrdu: 'ہدایت پانے والے',
      pos: 'noun',
      posUrdu: 'اسمِ فاعل منصوب',
      root: 'ه د ي',
      lemma: 'مُهْتَدُون',
      morphologyUrdu: 'اسمِ فاعل، ثلاثی مزید فیہ — ہشتم (VIII)، بابِ اِفْتِعَال، جمع مذکر، منصوب۔',
      syntaxUrdu: 'اسم منصوب',
      dictionaryUrdu:
        'مُهْتَدٍ ٱهْتَدَىٰ «راہ پانا» کا اسمِ فاعل ہے، جو هَدَىٰ سے بابِ افتعال ہے۔ كَانَ کی خبر ہونے سے یاء اور نون کے ساتھ منصوب ہے؛ مادے کی آخری یاء جمع میں گر گئی۔',
      segments: [
        {
          arabic: 'مُهْتَدِينَ',
          roleUrdu: 'اسمِ فاعل منصوب',
          meaningUrdu: 'ہدایت پانے والے',
        },
      ],
      ruleIds: ['accusative', 'participle', 'sound-plural', 'kana', 'derived-form'],
    },
    {
      id: '2:17:1',
      ayah: 17,
      position: 1,
      arabic: 'مَثَلُهُمْ',
      meaningUrdu: 'مثال ان کی',
      pos: 'noun',
      posUrdu: 'اسم مرفوع + ضمیرِ متصل',
      root: 'م ث ل',
      lemma: 'مَثَل',
      morphologyUrdu: 'اسم، مذکر، مرفوع۔ لاحقہ: هُمْ ضمیرِ متصل، جمع مذکر غائب۔',
      syntaxUrdu: 'اسم مرفوع و«هم» ضمير متصل في محل جر بالاضافة',
      dictionaryUrdu:
        'مَثَل کسی چیز کی مثال یا اس کی کیفیت بیان کرنے کے لیے آتا ہے۔ یہاں اس سے ان کی حالت کا نقشہ مراد ہے، اور «ان کی» کا مفہوم آخر کی ضمیر سے آتا ہے۔',
      segments: [
        {
          arabic: 'مَثَلُ',
          roleUrdu: 'اسم مرفوع',
          meaningUrdu: 'مثال، حالت',
        },
        {
          arabic: 'هُمْ',
          roleUrdu: 'ضمیرِ متصل (جمع مذکر غائب)',
          meaningUrdu: 'ان کی',
        },
      ],
      ruleIds: ['pronoun', 'nominative', 'nominal', 'idafa'],
    },
    {
      id: '2:17:2',
      ayah: 17,
      position: 2,
      arabic: 'كَمَثَلِ',
      meaningUrdu: 'جیسے مثال کی',
      pos: 'noun',
      posUrdu: 'اسم مجرور',
      root: 'م ث ل',
      lemma: 'مَثَل',
      morphologyUrdu: 'اسم، مذکر، مجرور۔ سابقہ: كَ (حرفِ جر)۔',
      syntaxUrdu: 'جار ومجرور',
      dictionaryUrdu:
        'كَ تشبیہ کا حرفِ جر ہے جس کا مفہوم «جیسا، مانند» ہے۔ اس کے بعد مَثَل مضاف ہو کر آیا ہے، اس لیے ایک مثال کو دوسری مثال سے تشبیہ دی گئی ہے۔',
      segments: [
        {
          arabic: 'كَ',
          roleUrdu: 'حرفِ جر',
          meaningUrdu: 'جیسی، مانند',
        },
        {
          arabic: 'مَثَلِ',
          roleUrdu: 'اسم مجرور',
          meaningUrdu: 'مثال',
        },
      ],
      ruleIds: ['preposition', 'genitive', 'nominal', 'idafa'],
    },
    {
      id: '2:17:3',
      ayah: 17,
      position: 3,
      arabic: 'ٱلَّذِى',
      meaningUrdu: 'اس شخص کی',
      pos: 'pronoun',
      posUrdu: 'اسمِ موصول',
      root: null,
      lemma: 'ٱلَّذِى',
      morphologyUrdu: 'اسمِ موصول، واحد مذکر، مبنی۔',
      syntaxUrdu: 'اسم موصول',
      dictionaryUrdu:
        'ٱلَّذِى واحد مذکر کے لیے اسمِ موصول ہے، یعنی «وہ جو»۔ یہ اپنے بعد کے جملے (صلہ) کے بغیر پورا معنی نہیں دیتا؛ اردو کا «اس شخص» اسی سے آیا ہے۔',
      segments: [
        {
          arabic: 'ٱلَّذِى',
          roleUrdu: 'اسمِ موصول',
          meaningUrdu: 'وہ شخص جس نے',
        },
      ],
      ruleIds: ['relative', 'idafa'],
    },
    {
      id: '2:17:4',
      ayah: 17,
      position: 4,
      arabic: 'ٱسْتَوْقَدَ',
      meaningUrdu: 'جس نے جلائی',
      pos: 'verb',
      posUrdu: 'فعلِ ماضی',
      root: 'و ق د',
      lemma: 'اِسْتَوْقَدَ',
      morphologyUrdu:
        'فعلِ ماضی، معروف، واحد مذکر غائب، ثلاثی مزید فیہ — دہم (X)، بابِ اِسْتِفْعَال۔',
      syntaxUrdu: 'فعل ماض',
      dictionaryUrdu:
        'اِسْتَوْقَدَ بابِ استفعال سے ہے؛ وَقَدَ کا مطلب آگ کا بھڑکنا ہے، اور اس باب میں آگ جلانے اور بھڑکانے کا مفہوم ہے۔ مادے کا پہلا حرف واو ہے (مثال)، جو یہاں ساکن ہو کر باقی ہے۔',
      segments: [
        {
          arabic: 'ٱسْتَوْقَدَ',
          roleUrdu: 'فعلِ ماضی',
          meaningUrdu: 'اس نے (آگ) جلائی',
        },
      ],
      ruleIds: ['perfect', 'derived-form', 'weak-verb'],
    },
    {
      id: '2:17:5',
      ayah: 17,
      position: 5,
      arabic: 'نَارًۭا',
      meaningUrdu: 'آگ',
      pos: 'noun',
      posUrdu: 'اسم منصوب',
      root: 'ن و ر',
      lemma: 'نَار',
      morphologyUrdu: 'اسم، مؤنث، نکرہ (تنوین)، منصوب۔',
      syntaxUrdu: 'اسم منصوب',
      dictionaryUrdu:
        'نَار آگ کو کہتے ہیں اور عربی میں مؤنث ہے، اسی لیے اس کے بعد فعل مؤنث آیا ہے۔ اس کا الف مادے کی درمیانی واو سے بدلا ہے (ن و ر)، اور نُور بھی اسی مادے سے ہے۔',
      segments: [
        {
          arabic: 'نَارًۭا',
          roleUrdu: 'اسم منصوب',
          meaningUrdu: 'آگ',
        },
      ],
      ruleIds: ['accusative', 'indefinite', 'object'],
    },
    {
      id: '2:17:6',
      ayah: 17,
      position: 6,
      arabic: 'فَلَمَّآ',
      meaningUrdu: 'پھر جب',
      pos: 'noun',
      posUrdu: 'ظرفِ زمان',
      root: null,
      lemma: 'لَمَّا',
      morphologyUrdu: 'ظرفِ زمان۔ سابقہ: فَ (حرفِ استئناف)۔',
      syntaxUrdu: 'الفاء استئنافية؛ ظرف زمان',
      dictionaryUrdu:
        'فَ یہاں نئی بات شروع کرتا ہے۔ لَمَّا ماضی سے پہلے آئے تو «جب» کے معنی دیتا ہے اور اسے ایک جواب درکار ہوتا ہے؛ اسے نفی والے لَمْ سے نہ ملائیے۔',
      segments: [
        {
          arabic: 'فَ',
          roleUrdu: 'حرفِ استئناف',
          meaningUrdu: 'پھر',
        },
        {
          arabic: 'لَمَّآ',
          roleUrdu: 'ظرفِ زمان',
          meaningUrdu: 'جب',
        },
      ],
      ruleIds: ['resumption', 'lamma'],
    },
    {
      id: '2:17:7',
      ayah: 17,
      position: 7,
      arabic: 'أَضَآءَتْ',
      meaningUrdu: 'اس نے روشن کردیا',
      pos: 'verb',
      posUrdu: 'فعلِ ماضی',
      root: 'ض و أ',
      lemma: 'أَضَاءَ',
      morphologyUrdu:
        'فعلِ ماضی، معروف، واحد مؤنث غائب، ثلاثی مزید فیہ — چہارم (IV)، بابِ إِفْعَال۔',
      syntaxUrdu: 'فعل ماض',
      dictionaryUrdu:
        'أَضَاءَ بابِ افعال سے روشن ہونا یا روشن کرنا ہے؛ یہاں متعدی ہے۔ آخر کی تاءِ ساکن تانیث کی علامت ہے کیونکہ نَار مؤنث ہے، یہ ضمیر نہیں۔ الف مادے کی واو سے بدلا ہے۔',
      segments: [
        {
          arabic: 'أَضَآءَتْ',
          roleUrdu: 'فعلِ ماضی',
          meaningUrdu: 'اس (آگ) نے روشن کر دیا',
        },
      ],
      ruleIds: ['perfect', 'derived-form', 'weak-verb', 'hamzated', 'feminine-marker'],
    },
    {
      id: '2:17:8',
      ayah: 17,
      position: 8,
      arabic: 'مَا',
      meaningUrdu: 'اس کا',
      pos: 'pronoun',
      posUrdu: 'اسمِ موصول',
      root: null,
      lemma: 'مَا',
      morphologyUrdu: 'اسمِ موصول، مبنی۔',
      syntaxUrdu: 'اسم موصول',
      dictionaryUrdu:
        'مَا یہاں اسمِ موصول ہے، یعنی «جو کچھ»؛ یہ عموماً چیزوں کے لیے آتا ہے۔ اسے نفی والا مَا نہ سمجھیے؛ یہاں یہ روشن کیے جانے والی چیز ہے۔',
      segments: [
        {
          arabic: 'مَا',
          roleUrdu: 'اسمِ موصول',
          meaningUrdu: 'جو کچھ',
        },
      ],
      ruleIds: ['relative', 'object'],
    },
    {
      id: '2:17:9',
      ayah: 17,
      position: 9,
      arabic: 'حَوْلَهُۥ',
      meaningUrdu: 'ماحول',
      pos: 'noun',
      posUrdu: 'ظرفِ مکان منصوب + ضمیرِ متصل',
      root: 'ح و ل',
      lemma: 'حَوْل',
      morphologyUrdu: 'ظرفِ مکان، مذکر، منصوب۔ لاحقہ: هُۥ ضمیرِ متصل، واحد مذکر غائب۔',
      syntaxUrdu: 'ظرف مكان منصوب والهاء ضمير متصل في محل جر بالاضافة',
      dictionaryUrdu:
        'حَوْل کسی چیز کے گرد و پیش کو کہتے ہیں اور یہاں ظرفِ مکان ہے، یعنی «ارد گرد»۔ آخر کی ضمیر اس شخص کی طرف لوٹتی ہے جس نے آگ جلائی۔',
      segments: [
        {
          arabic: 'حَوْلَ',
          roleUrdu: 'ظرفِ مکان منصوب',
          meaningUrdu: 'ارد گرد',
        },
        {
          arabic: 'هُۥ',
          roleUrdu: 'ضمیرِ متصل (واحد مذکر غائب)',
          meaningUrdu: 'اس کے',
        },
      ],
      ruleIds: ['pronoun', 'adverb', 'idafa'],
    },
    {
      id: '2:17:10',
      ayah: 17,
      position: 10,
      arabic: 'ذَهَبَ',
      meaningUrdu: 'لے گیا',
      pos: 'verb',
      posUrdu: 'فعلِ ماضی',
      root: 'ذ ه ب',
      lemma: 'ذَهَبَ',
      morphologyUrdu: 'فعلِ ماضی، معروف، واحد مذکر غائب، ثلاثی مجرد — اوّل (I)۔',
      syntaxUrdu: 'فعل ماض',
      dictionaryUrdu:
        'ذَهَبَ کا بنیادی معنی جانا ہے۔ اس کے ساتھ بِ آئے تو کسی چیز کو لے جانے کا مفہوم بنتا ہے، اسی لیے یہاں ترجمہ «لے گیا» ہے۔',
      segments: [
        {
          arabic: 'ذَهَبَ',
          roleUrdu: 'فعلِ ماضی',
          meaningUrdu: 'لے گیا (بِ کے ساتھ)',
        },
      ],
      ruleIds: ['perfect', 'condition-answer', 'verbal-sentence'],
    },
    {
      id: '2:17:11',
      ayah: 17,
      position: 11,
      arabic: 'ٱللَّهُ',
      meaningUrdu: 'اللّٰهُ',
      pos: 'noun',
      posUrdu: 'اسمِ علم مرفوع',
      root: 'أ ل ه',
      lemma: 'ٱللَّه',
      morphologyUrdu: 'اسمِ علم، مرفوع۔',
      syntaxUrdu: 'لفظ الجلالة مرفوع',
      dictionaryUrdu:
        'اللَّه اللہ تعالیٰ کا خاص نام ہے۔ لغوی فہرست اسے أ ل ه کے تحت رکھتی ہے اور اس کے اشتقاق میں مختلف اقوال ہیں۔',
      segments: [
        {
          arabic: 'ٱللَّهُ',
          roleUrdu: 'اسمِ علم مرفوع',
          meaningUrdu: 'اللہ',
        },
      ],
      ruleIds: ['proper-noun', 'nominative', 'subject'],
    },
    {
      id: '2:17:12',
      ayah: 17,
      position: 12,
      arabic: 'بِنُورِهِمْ',
      meaningUrdu: 'نور ان کا',
      pos: 'noun',
      posUrdu: 'اسم مجرور + ضمیرِ متصل',
      root: 'ن و ر',
      lemma: 'نُور',
      morphologyUrdu:
        'اسم، مذکر، مجرور۔ سابقہ: بِ (حرفِ جر)۔ لاحقہ: هِمْ ضمیرِ متصل، جمع مذکر غائب۔',
      syntaxUrdu: 'جار ومجرور و«هم» ضمير متصل في محل جر بالاضافة',
      dictionaryUrdu:
        'نُور روشنی کو کہتے ہیں اور اس کی واو مادے کا درمیانی حرف ہے۔ بِ یہاں ذَهَبَ کو «لے جانا» کا معنی دیتا ہے، اور «ان کا» کا مفہوم آخر کی ضمیر سے ہے۔',
      segments: [
        {
          arabic: 'بِ',
          roleUrdu: 'حرفِ جر',
          meaningUrdu: 'کو (تعدیہ کی باء)',
        },
        {
          arabic: 'نُورِ',
          roleUrdu: 'اسم مجرور',
          meaningUrdu: 'نور، روشنی',
        },
        {
          arabic: 'هِمْ',
          roleUrdu: 'ضمیرِ متصل (جمع مذکر غائب)',
          meaningUrdu: 'ان کی',
        },
      ],
      ruleIds: ['pronoun', 'preposition', 'genitive', 'idafa'],
    },
    {
      id: '2:17:13',
      ayah: 17,
      position: 13,
      arabic: 'وَتَرَكَهُمْ',
      meaningUrdu: 'اورچھوڑ دیا ان کو',
      pos: 'verb',
      posUrdu: 'فعلِ ماضی + ضمیرِ متصل',
      root: 'ت ر ك',
      lemma: 'تَرَكَ',
      morphologyUrdu:
        'فعلِ ماضی، معروف، واحد مذکر غائب، ثلاثی مجرد — اوّل (I)۔ سابقہ: وَ (حرفِ عطف)۔ لاحقہ: هُمْ ضمیرِ مفعول، جمع مذکر غائب۔',
      syntaxUrdu: 'الواو عاطفة؛ فعل ماض و«هم» ضمير متصل في محل نصب مفعول به',
      dictionaryUrdu:
        'تَرَكَ کا معنی کسی کو یا کسی چیز کو چھوڑ دینا ہے؛ بعد کی ترکیب سے کسی حالت میں چھوڑ دینے کا مفہوم نکلتا ہے۔ آخر کی ضمیر مفعول بہ ہے۔',
      segments: [
        {
          arabic: 'وَ',
          roleUrdu: 'حرفِ عطف',
          meaningUrdu: 'اور',
        },
        {
          arabic: 'تَرَكَ',
          roleUrdu: 'فعلِ ماضی',
          meaningUrdu: 'چھوڑ دیا',
        },
        {
          arabic: 'هُمْ',
          roleUrdu: 'ضمیرِ مفعول (جمع مذکر غائب)',
          meaningUrdu: 'ان کو',
        },
      ],
      ruleIds: ['object-pronoun', 'conjunction', 'perfect'],
    },
    {
      id: '2:17:14',
      ayah: 17,
      position: 14,
      arabic: 'فِى',
      meaningUrdu: 'میں',
      pos: 'particle',
      posUrdu: 'حرفِ جر',
      root: null,
      lemma: 'فِى',
      morphologyUrdu: 'حرفِ جر، مبنی۔',
      syntaxUrdu: 'حرف جر',
      dictionaryUrdu:
        'فِى ظرفیت کا حرفِ جر ہے، یعنی «میں»؛ یہاں کسی حالت کے اندر گھرے ہونے کا مفہوم دیتا ہے۔',
      segments: [
        {
          arabic: 'فِى',
          roleUrdu: 'حرفِ جر',
          meaningUrdu: 'میں',
        },
      ],
      ruleIds: ['preposition'],
    },
    {
      id: '2:17:15',
      ayah: 17,
      position: 15,
      arabic: 'ظُلُمَـٰتٍۢ',
      meaningUrdu: 'اندھیروں',
      pos: 'noun',
      posUrdu: 'اسم مجرور',
      root: 'ظ ل م',
      lemma: 'ظُلُمَٰت',
      morphologyUrdu: 'اسم، جمع مؤنث، نکرہ (تنوین)، مجرور۔',
      syntaxUrdu: 'اسم مجرور',
      dictionaryUrdu:
        'ظُلُمَات، ظُلْمَة (اندھیرا) کی جمع ہے؛ یہ جمعِ مؤنث سالم ہے، جمعِ تکسیر نہیں۔ اسے ظُلْم (زیادتی) سے الگ سمجھیے، اگرچہ مادہ ایک ہے۔',
      segments: [
        {
          arabic: 'ظُلُمَـٰتٍۢ',
          roleUrdu: 'اسم مجرور',
          meaningUrdu: 'اندھیروں',
        },
      ],
      ruleIds: ['genitive', 'indefinite', 'feminine-plural'],
    },
    {
      id: '2:17:16',
      ayah: 17,
      position: 16,
      arabic: 'لَّا',
      meaningUrdu: 'نہیں',
      pos: 'particle',
      posUrdu: 'حرفِ نفی',
      root: null,
      lemma: 'لَا',
      morphologyUrdu: 'حرفِ نفی، مبنی۔',
      syntaxUrdu: 'حرف نفي',
      dictionaryUrdu:
        'لَا یہاں مضارع سے پہلے نفی کا حرف ہے اور فعل کا اعراب نہیں بدلتا؛ اسے نہی والے لَا سے الگ سمجھیے جو مضارع کو مجزوم کرتا ہے۔',
      segments: [
        {
          arabic: 'لَّا',
          roleUrdu: 'حرفِ نفی',
          meaningUrdu: 'نہیں',
        },
      ],
      ruleIds: ['negation'],
    },
    {
      id: '2:17:17',
      ayah: 17,
      position: 17,
      arabic: 'يُبْصِرُونَ',
      meaningUrdu: 'وہ دیکھ پاتے',
      pos: 'verb',
      posUrdu: 'فعلِ مضارع + ضمیرِ متصل',
      root: 'ب ص ر',
      lemma: 'أَبْصَرَ',
      morphologyUrdu:
        'فعلِ مضارع، مرفوع، معروف، جمع مذکر غائب، ثلاثی مزید فیہ — چہارم (IV)، بابِ إِفْعَال۔ لاحقہ: ونَ ضمیرِ فاعل، جمع مذکر غائب۔',
      syntaxUrdu: 'فعل مضارع والواو ضمير متصل في محل رفع فاعل',
      dictionaryUrdu:
        'أَبْصَرَ بابِ افعال سے آنکھ سے دیکھنا ہے، اور بَصَر بینائی کو کہتے ہیں۔ آخر کا حصہ فاعل کی ضمیر (واو) اور رفع کی علامت (نون) پر مشتمل ہے۔',
      segments: [
        {
          arabic: 'يُبْصِرُ',
          roleUrdu: 'فعلِ مضارع',
          meaningUrdu: 'دیکھ پاتے ہیں',
        },
        {
          arabic: 'ونَ',
          roleUrdu: 'ضمیرِ فاعل (جمع مذکر غائب)',
          meaningUrdu: 'وہ سب (فاعل)',
        },
      ],
      ruleIds: ['subject-pronoun', 'imperfect', 'derived-form', 'five-verbs', 'haal'],
    },
    {
      id: '2:18:1',
      ayah: 18,
      position: 1,
      arabic: 'صُمٌّۢ',
      meaningUrdu: 'بہرے ہیں',
      pos: 'noun',
      posUrdu: 'اسم مرفوع',
      root: 'ص م م',
      lemma: 'أَصَمّ',
      morphologyUrdu: 'اسم، جمع، نکرہ (تنوین)، مرفوع۔',
      syntaxUrdu: 'اسم مرفوع',
      dictionaryUrdu:
        'صُمّ، أَصَمّ (بہرا) کی جمع ہے؛ یہ عیب بتانے والی صفت ہے، فعل نہیں۔ مادے کے دوسرے اور تیسرے حرف (میم) ایک شد میں جمع ہیں۔ «ہیں» کا مفہوم ایک پوشیدہ مبتدا سے آتا ہے۔',
      segments: [
        {
          arabic: 'صُمٌّۢ',
          roleUrdu: 'اسم مرفوع',
          meaningUrdu: 'بہرے',
        },
      ],
      ruleIds: [
        'nominative',
        'indefinite',
        'broken-plural',
        'nominal',
        'elision',
        'resembling-adjective',
      ],
    },
    {
      id: '2:18:2',
      ayah: 18,
      position: 2,
      arabic: 'بُكْمٌ',
      meaningUrdu: 'گونگے ہیں',
      pos: 'noun',
      posUrdu: 'اسم مرفوع',
      root: 'ب ك م',
      lemma: 'أَبْكَم',
      morphologyUrdu: 'اسم، جمع، نکرہ (تنوین)، مرفوع۔',
      syntaxUrdu: 'اسم مرفوع',
      dictionaryUrdu:
        'بُكْم، أَبْكَم (گونگا) کی جمع ہے، جو عیب بتانے والی صفات کی طرح فُعْل کے وزن پر آئی ہے۔ یہ بھی اسی پوشیدہ مبتدا کی خبر ہے۔',
      segments: [
        {
          arabic: 'بُكْمٌ',
          roleUrdu: 'اسم مرفوع',
          meaningUrdu: 'گونگے',
        },
      ],
      ruleIds: ['nominative', 'indefinite', 'broken-plural', 'nominal', 'resembling-adjective'],
    },
    {
      id: '2:18:3',
      ayah: 18,
      position: 3,
      arabic: 'عُمْىٌۭ',
      meaningUrdu: 'اندھے ہیں',
      pos: 'noun',
      posUrdu: 'اسم مرفوع',
      root: 'ع م ي',
      lemma: 'أَعْمَىٰ',
      morphologyUrdu: 'اسم، جمع مذکر، نکرہ (تنوین)، مرفوع۔',
      syntaxUrdu: 'اسم مرفوع',
      dictionaryUrdu:
        'عُمْي، أَعْمَى (اندھا) کی جمع ہے۔ مادے کا آخری حرف یاء ہے، جو واحد أَعْمَى میں الف کی صورت میں لکھی جاتی ہے؛ یہ بھی اسم ہے، فعل نہیں۔',
      segments: [
        {
          arabic: 'عُمْىٌۭ',
          roleUrdu: 'اسم مرفوع',
          meaningUrdu: 'اندھے',
        },
      ],
      ruleIds: ['nominative', 'indefinite', 'broken-plural', 'nominal', 'resembling-adjective'],
    },
    {
      id: '2:18:4',
      ayah: 18,
      position: 4,
      arabic: 'فَهُمْ',
      meaningUrdu: 'تو وہ',
      pos: 'pronoun',
      posUrdu: 'ضمیرِ منفصل',
      root: null,
      lemma: null,
      morphologyUrdu: 'ضمیرِ منفصل، جمع مذکر غائب، مبنی۔ سابقہ: فَ (حرفِ عطف)۔',
      syntaxUrdu: 'الفاء عاطفة؛ ضمير منفصل',
      dictionaryUrdu:
        'فَ پچھلی بات پر نتیجہ جوڑتا ہے، یعنی «تو، اسی لیے»۔ هُمْ جمع مذکر غائب کی ضمیرِ منفصل ہے جو یہاں مبتدا ہے۔',
      segments: [
        {
          arabic: 'فَ',
          roleUrdu: 'حرفِ عطف',
          meaningUrdu: 'تو، اسی لیے',
        },
        {
          arabic: 'هُمْ',
          roleUrdu: 'ضمیرِ منفصل',
          meaningUrdu: 'وہ سب',
        },
      ],
      ruleIds: ['conjunction', 'independent-pronoun', 'nominal'],
    },
    {
      id: '2:18:5',
      ayah: 18,
      position: 5,
      arabic: 'لَا',
      meaningUrdu: 'نہیں',
      pos: 'particle',
      posUrdu: 'حرفِ نفی',
      root: null,
      lemma: 'لَا',
      morphologyUrdu: 'حرفِ نفی، مبنی۔',
      syntaxUrdu: 'حرف نفي',
      dictionaryUrdu:
        'لَا مضارع کی نفی کرتا ہے اور اس کا اعراب نہیں بدلتا۔ مضارع کے ساتھ اس نفی میں حال اور آئندہ دونوں کا احتمال رہتا ہے۔',
      segments: [
        {
          arabic: 'لَا',
          roleUrdu: 'حرفِ نفی',
          meaningUrdu: 'نہیں',
        },
      ],
      ruleIds: ['negation'],
    },
    {
      id: '2:18:6',
      ayah: 18,
      position: 6,
      arabic: 'يَرْجِعُونَ',
      meaningUrdu: 'وہ پلیٹیں گے / وہ لوٹیں گے',
      pos: 'verb',
      posUrdu: 'فعلِ مضارع + ضمیرِ متصل',
      root: 'ر ج ع',
      lemma: 'رَجَعَ',
      morphologyUrdu:
        'فعلِ مضارع، مرفوع، معروف، جمع مذکر غائب، ثلاثی مجرد — اوّل (I)۔ لاحقہ: ونَ ضمیرِ فاعل، جمع مذکر غائب۔',
      syntaxUrdu: 'فعل مضارع والواو ضمير متصل في محل رفع فاعل',
      dictionaryUrdu:
        'رَجَعَ کا معنی لوٹنا اور واپس آنا ہے؛ یہاں لازم ہے، اس لیے کوئی مفعول نہیں۔ مضارع ہونے کی وجہ سے حال اور آئندہ دونوں کا ترجمہ ممکن ہے۔',
      segments: [
        {
          arabic: 'يَرْجِعُ',
          roleUrdu: 'فعلِ مضارع',
          meaningUrdu: 'لوٹیں گے، پلٹتے ہیں',
        },
        {
          arabic: 'ونَ',
          roleUrdu: 'ضمیرِ فاعل (جمع مذکر غائب)',
          meaningUrdu: 'وہ سب (فاعل)',
        },
      ],
      ruleIds: ['subject-pronoun', 'imperfect', 'five-verbs', 'nominal'],
    },
    {
      id: '2:19:1',
      ayah: 19,
      position: 1,
      arabic: 'أَوْ',
      meaningUrdu: 'یا',
      pos: 'particle',
      posUrdu: 'حرفِ عطف',
      root: null,
      lemma: 'أَو',
      morphologyUrdu: 'حرفِ عطف، مبنی۔',
      syntaxUrdu: 'حرف عطف',
      dictionaryUrdu:
        'أَوْ عطف کا حرف ہے جو دو امکانات میں سے ایک کو پیش کرتا ہے، یعنی «یا»۔ یہاں ایک تمثیل کے بعد دوسری تمثیل جوڑی گئی ہے۔',
      segments: [
        {
          arabic: 'أَوْ',
          roleUrdu: 'حرفِ عطف',
          meaningUrdu: 'یا',
        },
      ],
      ruleIds: ['conjunction'],
    },
    {
      id: '2:19:2',
      ayah: 19,
      position: 2,
      arabic: 'كَصَيِّبٍۢ',
      meaningUrdu: 'جیسے مثال ہے زور دار پیش کی',
      pos: 'noun',
      posUrdu: 'اسم مجرور',
      root: 'ص و ب',
      lemma: 'صَيِّب',
      morphologyUrdu: 'اسم، مذکر، نکرہ (تنوین)، مجرور۔ سابقہ: كَ (حرفِ جر)۔',
      syntaxUrdu: 'جار ومجرور',
      dictionaryUrdu:
        'صَيِّب زور سے برسنے والی بارش یا بادل کو کہتے ہیں اور صَابَ (برسنا، اترنا) سے ہے۔ مادے کی درمیانی واو یاء بن کر مدغم ہوئی ہے، اس لیے یاء دیکھ کر مادہ ص ي ب نہ سمجھیے۔',
      segments: [
        {
          arabic: 'كَ',
          roleUrdu: 'حرفِ جر',
          meaningUrdu: 'جیسے',
        },
        {
          arabic: 'صَيِّبٍۢ',
          roleUrdu: 'اسم مجرور',
          meaningUrdu: 'زور سے برسنے والی بارش',
        },
      ],
      ruleIds: ['preposition', 'genitive', 'indefinite', 'conjunction', 'elision'],
    },
    {
      id: '2:19:3',
      ayah: 19,
      position: 3,
      arabic: 'مِّنَ',
      meaningUrdu: 'سے',
      pos: 'particle',
      posUrdu: 'حرفِ جر',
      root: null,
      lemma: 'مِن',
      morphologyUrdu: 'حرفِ جر، مبنی۔',
      syntaxUrdu: 'حرف جر',
      dictionaryUrdu: 'مِنْ یہاں ابتدا کے لیے ہے، یعنی «سے»؛ یہ بتاتا ہے کہ وہ بارش کہاں سے آئی۔',
      segments: [
        {
          arabic: 'مِّنَ',
          roleUrdu: 'حرفِ جر',
          meaningUrdu: 'سے',
        },
      ],
      ruleIds: ['preposition', 'adjective'],
    },
    {
      id: '2:19:4',
      ayah: 19,
      position: 4,
      arabic: 'ٱلسَّمَآءِ',
      meaningUrdu: 'آسمان',
      pos: 'noun',
      posUrdu: 'اسم مجرور',
      root: 'س م و',
      lemma: 'سَمَآء',
      morphologyUrdu: 'اسم، مؤنث، ال کے ساتھ معرفہ، مجرور۔ سابقہ: ٱل (حرفِ تعریف)۔',
      syntaxUrdu: 'اسم مجرور',
      dictionaryUrdu:
        'سَمَاء آسمان اور ہر بلند چیز کو کہتے ہیں۔ آخر کا ہمزہ مادے کی واو سے بدلا ہے (س م و)، یہ اصلی ہمزہ نہیں۔',
      segments: [
        {
          arabic: 'ٱل',
          roleUrdu: 'حرفِ تعریف',
          meaningUrdu: 'تعریف (معرفہ بنانے والا)',
        },
        {
          arabic: 'سَّمَآءِ',
          roleUrdu: 'اسم مجرور',
          meaningUrdu: 'آسمان',
        },
      ],
      ruleIds: ['definite', 'genitive'],
    },
    {
      id: '2:19:5',
      ayah: 19,
      position: 5,
      arabic: 'فِيهِ',
      meaningUrdu: 'اس میں',
      pos: 'particle',
      posUrdu: 'حرفِ جر + ضمیرِ متصل',
      root: null,
      lemma: 'فِى',
      morphologyUrdu: 'حرفِ جر، مبنی۔ لاحقہ: هِ ضمیرِ متصل، واحد مذکر غائب۔',
      syntaxUrdu: 'جار ومجرور',
      dictionaryUrdu:
        'فِى ظرفیت کا حرفِ جر ہے، یعنی «میں»؛ ضمیر برسنے والی بارش کی طرف لوٹتی ہے۔ یاء کے بعد ضمیر کی پیش زیر میں بدل گئی ہے۔',
      segments: [
        {
          arabic: 'فِي',
          roleUrdu: 'حرفِ جر',
          meaningUrdu: 'میں',
        },
        {
          arabic: 'هِ',
          roleUrdu: 'ضمیرِ متصل (واحد مذکر غائب)',
          meaningUrdu: 'اس',
        },
      ],
      ruleIds: ['pronoun', 'preposition', 'nominal', 'fronting', 'adjective'],
    },
    {
      id: '2:19:6',
      ayah: 19,
      position: 6,
      arabic: 'ظُلُمَـٰتٌۭ',
      meaningUrdu: 'اندھیرے ہیں',
      pos: 'noun',
      posUrdu: 'اسم مرفوع',
      root: 'ظ ل م',
      lemma: 'ظُلُمَٰت',
      morphologyUrdu: 'اسم، جمع مؤنث، نکرہ (تنوین)، مرفوع۔',
      syntaxUrdu: 'اسم مرفوع',
      dictionaryUrdu:
        'ظُلُمَات، ظُلْمَة کی جمعِ مؤنث سالم ہے، یعنی «اندھیرے»؛ جمعِ تکسیر نہیں۔ یہاں یہ مرفوع ہے اور جملے میں مؤخر مبتدا ہے۔',
      segments: [
        {
          arabic: 'ظُلُمَـٰتٌۭ',
          roleUrdu: 'اسم مرفوع',
          meaningUrdu: 'اندھیرے',
        },
      ],
      ruleIds: ['nominative', 'indefinite', 'feminine-plural', 'nominal', 'fronting'],
    },
    {
      id: '2:19:7',
      ayah: 19,
      position: 7,
      arabic: 'وَرَعْدٌۭ',
      meaningUrdu: 'کڑک',
      pos: 'noun',
      posUrdu: 'اسم مرفوع',
      root: 'ر ع د',
      lemma: 'رَعْد',
      morphologyUrdu: 'اسم، مذکر، نکرہ (تنوین)، مرفوع۔ سابقہ: وَ (حرفِ عطف)۔',
      syntaxUrdu: 'الواو عاطفة؛ اسم مرفوع',
      dictionaryUrdu:
        'رَعْد بادل کی گرج کو کہتے ہیں۔ وَ اسے پچھلے لفظ پر عطف کرتا ہے، اس لیے یہ بھی مرفوع ہے۔',
      segments: [
        {
          arabic: 'وَ',
          roleUrdu: 'حرفِ عطف',
          meaningUrdu: 'اور',
        },
        {
          arabic: 'رَعْدٌۭ',
          roleUrdu: 'اسم مرفوع',
          meaningUrdu: 'گرج، کڑک',
        },
      ],
      ruleIds: ['conjunction', 'nominative', 'indefinite'],
    },
    {
      id: '2:19:8',
      ayah: 19,
      position: 8,
      arabic: 'وَبَرْقٌۭ',
      meaningUrdu: 'بجلی ہے',
      pos: 'noun',
      posUrdu: 'اسم مرفوع',
      root: 'ب ر ق',
      lemma: 'بَرْق',
      morphologyUrdu: 'اسم، مذکر، نکرہ (تنوین)، مرفوع۔ سابقہ: وَ (حرفِ عطف)۔',
      syntaxUrdu: 'الواو عاطفة؛ اسم مرفوع',
      dictionaryUrdu:
        'بَرْق بادل میں چمکنے والی بجلی کو کہتے ہیں اور اس کا بنیادی مفہوم چمکنا ہے۔ وَ کے ذریعے یہ بھی پچھلے مرفوع پر معطوف ہے۔',
      segments: [
        {
          arabic: 'وَ',
          roleUrdu: 'حرفِ عطف',
          meaningUrdu: 'اور',
        },
        {
          arabic: 'بَرْقٌۭ',
          roleUrdu: 'اسم مرفوع',
          meaningUrdu: 'بجلی کی چمک',
        },
      ],
      ruleIds: ['conjunction', 'nominative', 'indefinite'],
    },
    {
      id: '2:19:9',
      ayah: 19,
      position: 9,
      arabic: 'يَجْعَلُونَ',
      meaningUrdu: 'وہ ڈال لیتے ہیں',
      pos: 'verb',
      posUrdu: 'فعلِ مضارع + ضمیرِ متصل',
      root: 'ج ع ل',
      lemma: 'جَعَلَ',
      morphologyUrdu:
        'فعلِ مضارع، مرفوع، معروف، جمع مذکر غائب، ثلاثی مجرد — اوّل (I)۔ لاحقہ: ونَ ضمیرِ فاعل، جمع مذکر غائب۔',
      syntaxUrdu: 'فعل مضارع والواو ضمير متصل في محل رفع فاعل',
      dictionaryUrdu:
        'جَعَلَ کے کئی معانی ہیں: بنانا، ٹھہرانا اور رکھنا۔ یہاں فِى کے ساتھ کسی چیز کو کسی جگہ ڈال دینا یا رکھ دینا مراد ہے۔',
      segments: [
        {
          arabic: 'يَجْعَلُ',
          roleUrdu: 'فعلِ مضارع',
          meaningUrdu: 'ڈال لیتے ہیں',
        },
        {
          arabic: 'ونَ',
          roleUrdu: 'ضمیرِ فاعل (جمع مذکر غائب)',
          meaningUrdu: 'وہ سب (فاعل)',
        },
      ],
      ruleIds: ['subject-pronoun', 'imperfect', 'five-verbs'],
    },
    {
      id: '2:19:10',
      ayah: 19,
      position: 10,
      arabic: 'أَصَـٰبِعَهُمْ',
      meaningUrdu: 'انگلیاں اپنی',
      pos: 'noun',
      posUrdu: 'اسم منصوب + ضمیرِ متصل',
      root: 'ص ب ع',
      lemma: 'أَصَٰبِع',
      morphologyUrdu: 'اسم، جمع مذکر، منصوب۔ لاحقہ: هُمْ ضمیرِ متصل، جمع مذکر غائب۔',
      syntaxUrdu: 'اسم منصوب و«هم» ضمير متصل في محل جر بالاضافة',
      dictionaryUrdu:
        'أَصَابِع، إِصْبَع (انگلی) کی جمعِ تکسیر ہے اور منتہی الجموع کے وزن پر ہونے سے غیر منصرف ہے؛ یہاں مضاف ہے۔ «اپنی» کا مفہوم آخر کی ضمیر سے آتا ہے۔',
      segments: [
        {
          arabic: 'أَصَـٰبِعَ',
          roleUrdu: 'اسم منصوب',
          meaningUrdu: 'انگلیاں',
        },
        {
          arabic: 'هُمْ',
          roleUrdu: 'ضمیرِ متصل (جمع مذکر غائب)',
          meaningUrdu: 'اپنی',
        },
      ],
      ruleIds: ['pronoun', 'accusative', 'broken-plural', 'object', 'idafa'],
    },
    {
      id: '2:19:11',
      ayah: 19,
      position: 11,
      arabic: 'فِىٓ',
      meaningUrdu: 'اپنے',
      pos: 'particle',
      posUrdu: 'حرفِ جر',
      root: null,
      lemma: 'فِى',
      morphologyUrdu: 'حرفِ جر، مبنی۔',
      syntaxUrdu: 'حرف جر',
      dictionaryUrdu:
        'فِى یہاں ظرفیت کے لیے ہے، یعنی «میں»؛ انگلیاں کانوں کے اندر رکھنے کا مفہوم اسی سے ہے۔',
      segments: [
        {
          arabic: 'فِىٓ',
          roleUrdu: 'حرفِ جر',
          meaningUrdu: 'میں',
        },
      ],
      ruleIds: ['preposition'],
    },
    {
      id: '2:19:12',
      ayah: 19,
      position: 12,
      arabic: 'ءَاذَانِهِم',
      meaningUrdu: 'کانوں میں',
      pos: 'noun',
      posUrdu: 'اسم مجرور + ضمیرِ متصل',
      root: 'أ ذ ن',
      lemma: 'أُذُن',
      morphologyUrdu: 'اسم، جمع مؤنث، مجرور۔ لاحقہ: هِم ضمیرِ متصل، جمع مذکر غائب۔',
      syntaxUrdu: 'اسم مجرور و«هم» ضمير متصل في محل جر بالاضافة',
      dictionaryUrdu:
        'آذَان، أُذُن (کان) کی جمعِ تکسیر ہے، وزن أَفْعَال پر۔ شروع میں دو ہمزے جمع ہونے سے دوسرا ہمزہ الف بن گیا ہے، اس لیے ہمزہ کے بعد لمبا الف آتا ہے۔',
      segments: [
        {
          arabic: 'ءَاذَانِ',
          roleUrdu: 'اسم مجرور',
          meaningUrdu: 'کانوں',
        },
        {
          arabic: 'هِم',
          roleUrdu: 'ضمیرِ متصل (جمع مذکر غائب)',
          meaningUrdu: 'اپنے',
        },
      ],
      ruleIds: ['pronoun', 'genitive', 'broken-plural', 'idafa'],
    },
    {
      id: '2:19:13',
      ayah: 19,
      position: 13,
      arabic: 'مِّنَ',
      meaningUrdu: 'سے',
      pos: 'particle',
      posUrdu: 'حرفِ جر',
      root: null,
      lemma: 'مِن',
      morphologyUrdu: 'حرفِ جر، مبنی۔',
      syntaxUrdu: 'حرف جر',
      dictionaryUrdu:
        'مِنْ یہاں سبب بتانے کے لیے ہے، یعنی «کی وجہ سے»؛ انگلیاں کانوں میں ڈالنے کا سبب اگلا لفظ بتاتا ہے۔',
      segments: [
        {
          arabic: 'مِّنَ',
          roleUrdu: 'حرفِ جر',
          meaningUrdu: 'کی وجہ سے',
        },
      ],
      ruleIds: ['preposition'],
    },
    {
      id: '2:19:14',
      ayah: 19,
      position: 14,
      arabic: 'ٱلصَّوَٰعِقِ',
      meaningUrdu: 'بجلی کی کڑک',
      pos: 'noun',
      posUrdu: 'اسم مجرور',
      root: 'ص ع ق',
      lemma: 'صَاعِقَة',
      morphologyUrdu: 'اسم، جمع مؤنث، ال کے ساتھ معرفہ، مجرور۔ سابقہ: ٱل (حرفِ تعریف)۔',
      syntaxUrdu: 'اسم مجرور',
      dictionaryUrdu:
        'صَوَاعِق، صَاعِقَة کی جمعِ تکسیر ہے؛ صَاعِقَة بجلی کی ایسی سخت کڑک ہے جو ہلاک کر سکے۔ یہ وزن غیر منصرف ہے، مگر ال کی وجہ سے یہاں کسرہ آیا ہے۔',
      segments: [
        {
          arabic: 'ٱل',
          roleUrdu: 'حرفِ تعریف',
          meaningUrdu: 'تعریف (معرفہ بنانے والا)',
        },
        {
          arabic: 'صَّوَٰعِقِ',
          roleUrdu: 'اسم مجرور',
          meaningUrdu: 'سخت کڑکیں',
        },
      ],
      ruleIds: ['definite', 'genitive', 'broken-plural'],
    },
    {
      id: '2:19:15',
      ayah: 19,
      position: 15,
      arabic: 'حَذَرَ',
      meaningUrdu: 'ڈرتے ہوئے / ڈر کر / بچنے کے لئے',
      pos: 'noun',
      posUrdu: 'مصدر منصوب',
      root: 'ح ذ ر',
      lemma: 'حَذَر',
      morphologyUrdu: 'مصدر، مذکر، منصوب۔',
      syntaxUrdu: 'اسم منصوب',
      dictionaryUrdu:
        'حَذَر مصدر ہے، یعنی خطرے سے ڈرنا اور بچنا؛ صورت ماضی جیسی ہونے کے باوجود یہ فعل نہیں۔ یہاں منصوب ہو کر سبب بتاتا ہے، اس لیے «ڈر کے مارے» ترجمہ ہوتا ہے۔',
      segments: [
        {
          arabic: 'حَذَرَ',
          roleUrdu: 'مصدر منصوب',
          meaningUrdu: 'ڈر کے مارے، بچنے کے لیے',
        },
      ],
      ruleIds: ['accusative', 'verbal-noun', 'purpose-object', 'idafa'],
    },
    {
      id: '2:19:16',
      ayah: 19,
      position: 16,
      arabic: 'ٱلْمَوْتِ',
      meaningUrdu: 'موت سے',
      pos: 'noun',
      posUrdu: 'اسم مجرور',
      root: 'م و ت',
      lemma: 'مَوْت',
      morphologyUrdu: 'اسم، مذکر، ال کے ساتھ معرفہ، مجرور۔ سابقہ: ٱلْ (حرفِ تعریف)۔',
      syntaxUrdu: 'اسم مجرور',
      dictionaryUrdu:
        'مَوْت مرنے کو کہتے ہیں اور مصدر ہے؛ یہاں حَذَر کا مضاف الیہ ہونے سے مجرور ہے۔ اردو کا «سے» حَذَر کے مفہوم کی وجہ سے آیا ہے۔',
      segments: [
        {
          arabic: 'ٱلْ',
          roleUrdu: 'حرفِ تعریف',
          meaningUrdu: 'تعریف (معرفہ بنانے والا)',
        },
        {
          arabic: 'مَوْتِ',
          roleUrdu: 'اسم مجرور',
          meaningUrdu: 'موت',
        },
      ],
      ruleIds: ['definite', 'genitive', 'idafa'],
    },
    {
      id: '2:19:17',
      ayah: 19,
      position: 17,
      arabic: 'وَٱللَّهُ',
      meaningUrdu: 'اور اللہ تعالیٰ',
      pos: 'noun',
      posUrdu: 'اسمِ علم مرفوع',
      root: 'أ ل ه',
      lemma: 'ٱللَّه',
      morphologyUrdu: 'اسمِ علم، مرفوع۔ سابقہ: وَ (حرفِ استئناف)۔',
      syntaxUrdu: 'الواو استئنافية؛ لفظ الجلالة مرفوع',
      dictionaryUrdu:
        'وَ یہاں نیا جملہ شروع کرتا ہے۔ اللَّه اللہ تعالیٰ کا خاص نام ہے۔ لغوی فہرست اسے أ ل ه کے تحت رکھتی ہے اور اس کے اشتقاق میں مختلف اقوال ہیں۔',
      segments: [
        {
          arabic: 'وَ',
          roleUrdu: 'حرفِ استئناف',
          meaningUrdu: 'اور',
        },
        {
          arabic: 'ٱللَّهُ',
          roleUrdu: 'اسمِ علم مرفوع',
          meaningUrdu: 'اللہ',
        },
      ],
      ruleIds: ['resumption', 'proper-noun', 'nominative', 'nominal'],
    },
    {
      id: '2:19:18',
      ayah: 19,
      position: 18,
      arabic: 'مُحِيطٌۢ',
      meaningUrdu: 'احاطہ کیے ہوئے ہے',
      pos: 'noun',
      posUrdu: 'اسمِ فاعل مرفوع',
      root: 'ح و ط',
      lemma: 'مُحِيط',
      morphologyUrdu:
        'اسمِ فاعل، ثلاثی مزید فیہ — چہارم (IV)، بابِ إِفْعَال، مذکر، نکرہ (تنوین)، مرفوع۔',
      syntaxUrdu: 'اسم مرفوع',
      dictionaryUrdu:
        'مُحِيط، أَحَاطَ (گھیر لینا) کا اسمِ فاعل ہے، فعل نہیں؛ بِ کے ساتھ کسی کو ہر طرف سے گھیرنے کا مفہوم دیتا ہے۔ مادے کی درمیانی واو یہاں یاء کی صورت میں ہے (ح و ط)۔',
      segments: [
        {
          arabic: 'مُحِيطٌۢ',
          roleUrdu: 'اسمِ فاعل مرفوع',
          meaningUrdu: 'گھیرے ہوئے',
        },
      ],
      ruleIds: ['nominative', 'indefinite', 'participle', 'nominal'],
    },
    {
      id: '2:19:19',
      ayah: 19,
      position: 19,
      arabic: 'بِٱلْكَـٰفِرِينَ',
      meaningUrdu: 'کافروں کا',
      pos: 'noun',
      posUrdu: 'اسمِ فاعل مجرور',
      root: 'ك ف ر',
      lemma: 'كَٰفِرُون',
      morphologyUrdu:
        'اسمِ فاعل، جمع مذکر، ال کے ساتھ معرفہ، مجرور۔ سابقہ: بِ (حرفِ جر)؛ ٱلْ (حرفِ تعریف)۔',
      syntaxUrdu: 'جار ومجرور',
      dictionaryUrdu:
        'كَافِر، كَفَرَ کا اسمِ فاعل ہے؛ بنیادی معنی ڈھانپنا ہے اور اصطلاح میں حق کا انکار کرنے والا۔ آخر کی یاء اور نون جمعِ مذکر سالم کی جر کی حالت بتاتے ہیں۔',
      segments: [
        {
          arabic: 'بِ',
          roleUrdu: 'حرفِ جر',
          meaningUrdu: 'کو',
        },
        {
          arabic: 'ٱلْ',
          roleUrdu: 'حرفِ تعریف',
          meaningUrdu: 'تعریف (معرفہ بنانے والا)',
        },
        {
          arabic: 'كَـٰفِرِينَ',
          roleUrdu: 'اسمِ فاعل مجرور',
          meaningUrdu: 'کافروں',
        },
      ],
      ruleIds: ['preposition', 'definite', 'genitive', 'participle', 'sound-plural'],
    },
    {
      id: '2:20:1',
      ayah: 20,
      position: 1,
      arabic: 'يَكَادُ',
      meaningUrdu: 'قریب ہے',
      pos: 'verb',
      posUrdu: 'فعلِ مضارع',
      root: 'ك و د',
      lemma: 'كَادَ',
      morphologyUrdu: 'فعلِ مضارع، مرفوع، معروف، واحد مذکر غائب، ثلاثی مجرد — اوّل (I)۔',
      syntaxUrdu: 'فعل مضارع',
      dictionaryUrdu:
        'كَادَ کا معنی «قریب ہونا» ہے؛ یہ افعالِ مقاربہ میں سے ہے اور بتاتا ہے کہ کام ہونے کے قریب ہے مگر ہوا نہیں۔ مادے کی درمیانی واو یہاں الف بن گئی ہے۔',
      segments: [
        {
          arabic: 'يَكَادُ',
          roleUrdu: 'فعلِ مضارع',
          meaningUrdu: 'قریب ہے',
        },
      ],
      ruleIds: ['kada-asa', 'imperfect', 'weak-verb'],
    },
    {
      id: '2:20:2',
      ayah: 20,
      position: 2,
      arabic: 'ٱلْبَرْقُ',
      meaningUrdu: 'بجلی',
      pos: 'noun',
      posUrdu: 'اسم مرفوع',
      root: 'ب ر ق',
      lemma: 'بَرْق',
      morphologyUrdu: 'اسم، مذکر، ال کے ساتھ معرفہ، مرفوع۔ سابقہ: ٱلْ (حرفِ تعریف)۔',
      syntaxUrdu: 'اسم مرفوع',
      dictionaryUrdu:
        'بَرْق بجلی کی چمک ہے؛ یہاں ال کے ساتھ وہی بجلی مراد ہے جس کا ذکر پہلے ہوا۔ یہ يَكَادُ کا اسم ہے، اس لیے مرفوع ہے۔',
      segments: [
        {
          arabic: 'ٱلْ',
          roleUrdu: 'حرفِ تعریف',
          meaningUrdu: 'تعریف (معرفہ بنانے والا)',
        },
        {
          arabic: 'بَرْقُ',
          roleUrdu: 'اسم مرفوع',
          meaningUrdu: 'بجلی',
        },
      ],
      ruleIds: ['definite', 'nominative', 'kada-asa'],
    },
    {
      id: '2:20:3',
      ayah: 20,
      position: 3,
      arabic: 'يَخْطَفُ',
      meaningUrdu: 'اچک لے / چھین لے',
      pos: 'verb',
      posUrdu: 'فعلِ مضارع',
      root: 'خ ط ف',
      lemma: 'خَطِفَ',
      morphologyUrdu: 'فعلِ مضارع، مرفوع، معروف، واحد مذکر غائب، ثلاثی مجرد — اوّل (I)۔',
      syntaxUrdu: 'فعل مضارع',
      dictionaryUrdu:
        'خَطِفَ کا معنی کسی چیز کو تیزی سے جھپٹ کر لے جانا ہے؛ مضارع میں عین پر فتحہ ہے۔ يَكَادُ کے بعد آنے سے مفہوم «اچک لینے کے قریب» ہے۔',
      segments: [
        {
          arabic: 'يَخْطَفُ',
          roleUrdu: 'فعلِ مضارع',
          meaningUrdu: 'اچک لے',
        },
      ],
      ruleIds: ['imperfect', 'kada-asa'],
    },
    {
      id: '2:20:4',
      ayah: 20,
      position: 4,
      arabic: 'أَبْصَـٰرَهُمْ',
      meaningUrdu: 'نگاہیں ان کی',
      pos: 'noun',
      posUrdu: 'اسم منصوب + ضمیرِ متصل',
      root: 'ب ص ر',
      lemma: 'بَصَر',
      morphologyUrdu: 'اسم، جمع مذکر، منصوب۔ لاحقہ: هُمْ ضمیرِ متصل، جمع مذکر غائب۔',
      syntaxUrdu: 'اسم منصوب و«هم» ضمير متصل في محل جر بالاضافة',
      dictionaryUrdu:
        'أَبْصَار، بَصَر (بینائی، نگاہ) کی جمعِ تکسیر ہے، وزن أَفْعَال پر۔ یہ اسم ہے، اسے فعل أَبْصَرَ سے نہ ملائیے۔',
      segments: [
        {
          arabic: 'أَبْصَـٰرَ',
          roleUrdu: 'اسم منصوب',
          meaningUrdu: 'نگاہیں',
        },
        {
          arabic: 'هُمْ',
          roleUrdu: 'ضمیرِ متصل (جمع مذکر غائب)',
          meaningUrdu: 'ان کی',
        },
      ],
      ruleIds: ['pronoun', 'accusative', 'broken-plural', 'object', 'idafa'],
    },
    {
      id: '2:20:5',
      ayah: 20,
      position: 5,
      arabic: 'كُلَّمَآ',
      meaningUrdu: 'جب کبھی',
      pos: 'noun',
      posUrdu: 'ظرفِ زمان',
      root: 'ك ل ل',
      lemma: 'كُلَّمَا',
      morphologyUrdu: 'ظرفِ زمان۔',
      syntaxUrdu: 'ظرف زمان',
      dictionaryUrdu:
        'كُلَّمَا، كُلّ اور مصدری مَا سے مل کر بنا ہے اور تکرار کے ساتھ «جب بھی» کا مفہوم دیتا ہے۔ اس کے بعد شرط جیسا ایک فعل اور پھر اس کا جواب آتا ہے۔',
      segments: [
        {
          arabic: 'كُلَّمَآ',
          roleUrdu: 'ظرفِ زمان',
          meaningUrdu: 'جب کبھی',
        },
      ],
      ruleIds: ['adverb', 'masdar-particle'],
    },
    {
      id: '2:20:6',
      ayah: 20,
      position: 6,
      arabic: 'أَضَآءَ',
      meaningUrdu: 'اس نے روشنی کی',
      pos: 'verb',
      posUrdu: 'فعلِ ماضی',
      root: 'ض و أ',
      lemma: 'أَضَاءَ',
      morphologyUrdu:
        'فعلِ ماضی، معروف، واحد مذکر غائب، ثلاثی مزید فیہ — چہارم (IV)، بابِ إِفْعَال۔',
      syntaxUrdu: 'فعل ماض',
      dictionaryUrdu:
        'أَضَاءَ یہاں لازم ہے، یعنی «روشن ہوا، چمکا»؛ اس کا فاعل پوشیدہ ہے اور بجلی کی طرف لوٹتا ہے۔ الف مادے کی درمیانی واو سے بدلا ہے اور آخر کا ہمزہ اصلی ہے۔',
      segments: [
        {
          arabic: 'أَضَآءَ',
          roleUrdu: 'فعلِ ماضی',
          meaningUrdu: 'چمکی، روشنی کی',
        },
      ],
      ruleIds: ['perfect', 'derived-form', 'weak-verb', 'hamzated'],
    },
    {
      id: '2:20:7',
      ayah: 20,
      position: 7,
      arabic: 'لَهُم',
      meaningUrdu: 'ان کے لئے',
      pos: 'particle',
      posUrdu: 'حرفِ جر + ضمیرِ متصل',
      root: null,
      lemma: null,
      morphologyUrdu: 'حرفِ جر + ضمیرِ متصل، جمع مذکر غائب، مبنی۔ سابقہ: لَ (حرفِ جر)۔',
      syntaxUrdu: 'جار ومجرور',
      dictionaryUrdu:
        'لِ «کے لیے» کے معنی کا حرفِ جر ہے؛ ضمیر سے پہلے اس کی زیر زبر میں بدل جاتی ہے۔ هُم یہاں جر کی جگہ آنے والی متصل ضمیر ہے۔',
      segments: [
        {
          arabic: 'لَ',
          roleUrdu: 'حرفِ جر',
          meaningUrdu: 'کے لیے',
        },
        {
          arabic: 'هُم',
          roleUrdu: 'ضمیرِ متصل (مجرور)',
          meaningUrdu: 'ان',
        },
      ],
      ruleIds: ['preposition', 'pronoun'],
    },
    {
      id: '2:20:8',
      ayah: 20,
      position: 8,
      arabic: 'مَّشَوْا۟',
      meaningUrdu: 'وہ چل پڑے',
      pos: 'verb',
      posUrdu: 'فعلِ ماضی + ضمیرِ متصل',
      root: 'م ش ي',
      lemma: 'مَشَى',
      morphologyUrdu:
        'فعلِ ماضی، معروف، جمع مذکر غائب، ثلاثی مجرد — اوّل (I)۔ لاحقہ: وْا۟ ضمیرِ فاعل، جمع مذکر غائب۔',
      syntaxUrdu: 'فعل ماض والواو ضمير متصل في محل رفع فاعل',
      dictionaryUrdu:
        'مَشَى کا معنی پیدل چلنا ہے؛ مادے کا آخری حرف یاء ہے (ناقص)، جو جمع کی واو سے پہلے گر گیا ہے۔ شروع کی شد پچھلے لفظ کی میم کے ادغام سے ہے، فعل کا حصہ نہیں۔',
      segments: [
        {
          arabic: 'مَّشَ',
          roleUrdu: 'فعلِ ماضی',
          meaningUrdu: 'چل پڑے',
        },
        {
          arabic: 'وْا۟',
          roleUrdu: 'ضمیرِ فاعل (جمع مذکر غائب)',
          meaningUrdu: 'وہ سب (فاعل)',
        },
      ],
      ruleIds: ['subject-pronoun', 'perfect', 'weak-verb', 'condition-answer'],
    },
    {
      id: '2:20:9',
      ayah: 20,
      position: 9,
      arabic: 'فِيهِ',
      meaningUrdu: 'اس میں',
      pos: 'particle',
      posUrdu: 'حرفِ جر + ضمیرِ متصل',
      root: null,
      lemma: 'فِى',
      morphologyUrdu: 'حرفِ جر، مبنی۔ لاحقہ: هِ ضمیرِ متصل، واحد مذکر غائب۔',
      syntaxUrdu: 'جار ومجرور',
      dictionaryUrdu:
        'فِى ظرفیت کے لیے ہے، یعنی «میں»؛ ضمیر بجلی کی چمک کی طرف لوٹتی ہے۔ یاء کے بعد ضمیر کی پیش زیر میں بدل گئی ہے۔',
      segments: [
        {
          arabic: 'فِي',
          roleUrdu: 'حرفِ جر',
          meaningUrdu: 'میں',
        },
        {
          arabic: 'هِ',
          roleUrdu: 'ضمیرِ متصل (واحد مذکر غائب)',
          meaningUrdu: 'اس',
        },
      ],
      ruleIds: ['pronoun', 'preposition'],
    },
    {
      id: '2:20:10',
      ayah: 20,
      position: 10,
      arabic: 'وَإِذَآ',
      meaningUrdu: 'اور جب',
      pos: 'noun',
      posUrdu: 'ظرفِ زمان',
      root: null,
      lemma: 'إِذَا',
      morphologyUrdu: 'ظرفِ زمان۔ سابقہ: وَ (حرفِ استئناف)۔',
      syntaxUrdu: 'الواو استئنافية؛ ظرف زمان',
      dictionaryUrdu:
        'إِذَا آنے والے وقت کا ظرف ہے جس میں شرط کا مفہوم ہوتا ہے، یعنی «جب»؛ اس کے بعد شرط اور جواب دونوں آتے ہیں۔ وَ یہاں نیا جملہ شروع کرتا ہے۔',
      segments: [
        {
          arabic: 'وَ',
          roleUrdu: 'حرفِ استئناف',
          meaningUrdu: 'اور',
        },
        {
          arabic: 'إِذَآ',
          roleUrdu: 'ظرفِ زمان',
          meaningUrdu: 'جب',
        },
      ],
      ruleIds: ['resumption', 'condition'],
    },
    {
      id: '2:20:11',
      ayah: 20,
      position: 11,
      arabic: 'أَظْلَمَ',
      meaningUrdu: 'اس نے اندھیرا کیا',
      pos: 'verb',
      posUrdu: 'فعلِ ماضی',
      root: 'ظ ل م',
      lemma: 'أَظْلَمَ',
      morphologyUrdu:
        'فعلِ ماضی، معروف، واحد مذکر غائب، ثلاثی مزید فیہ — چہارم (IV)، بابِ إِفْعَال۔',
      syntaxUrdu: 'فعل ماض',
      dictionaryUrdu:
        'أَظْلَمَ بابِ افعال سے اندھیرا ہو جانا ہے؛ یہاں لازم ہے اور عَلَى کے ساتھ کسی پر اندھیرا چھا جانے کا مفہوم دیتا ہے۔ یہ ظُلْمَة والے معنی میں ہے، ظُلْم (زیادتی) کے معنی میں نہیں۔',
      segments: [
        {
          arabic: 'أَظْلَمَ',
          roleUrdu: 'فعلِ ماضی',
          meaningUrdu: 'اندھیرا چھا گیا',
        },
      ],
      ruleIds: ['perfect', 'derived-form', 'condition'],
    },
    {
      id: '2:20:12',
      ayah: 20,
      position: 12,
      arabic: 'عَلَيْهِمْ',
      meaningUrdu: 'اوپر ان کے',
      pos: 'particle',
      posUrdu: 'حرفِ جر + ضمیرِ متصل',
      root: null,
      lemma: 'عَلَىٰ',
      morphologyUrdu: 'حرفِ جر، مبنی۔ لاحقہ: هِمْ ضمیرِ متصل، جمع مذکر غائب۔',
      syntaxUrdu: 'جار ومجرور',
      dictionaryUrdu:
        'عَلَى کا بنیادی معنی «اوپر، پر» ہے۔ ضمیر کے ساتھ اس کا الف یاء کی صورت میں لکھا جاتا ہے، اور یاء کے بعد ضمیر کی پیش زیر میں بدل جاتی ہے۔',
      segments: [
        {
          arabic: 'عَلَيْ',
          roleUrdu: 'حرفِ جر',
          meaningUrdu: 'پر',
        },
        {
          arabic: 'هِمْ',
          roleUrdu: 'ضمیرِ متصل (جمع مذکر غائب)',
          meaningUrdu: 'ان',
        },
      ],
      ruleIds: ['pronoun', 'preposition'],
    },
    {
      id: '2:20:13',
      ayah: 20,
      position: 13,
      arabic: 'قَامُوا۟',
      meaningUrdu: 'وہ کھڑے ہوگئے',
      pos: 'verb',
      posUrdu: 'فعلِ ماضی + ضمیرِ متصل',
      root: 'ق و م',
      lemma: 'قَامَ',
      morphologyUrdu:
        'فعلِ ماضی، معروف، جمع مذکر غائب، ثلاثی مجرد — اوّل (I)۔ لاحقہ: وا۟ ضمیرِ فاعل، جمع مذکر غائب۔',
      syntaxUrdu: 'فعل ماض والواو ضمير متصل في محل رفع فاعل',
      dictionaryUrdu:
        'قَامَ کا بنیادی معنی کھڑا ہونا ہے؛ یہاں چلنے کے مقابلے میں اپنی جگہ ٹھہر جانا مراد ہے۔ الف مادے کی درمیانی واو سے بدلا ہے (اجوف)، اور آخر کا الف لکھا جاتا ہے پڑھا نہیں جاتا۔',
      segments: [
        {
          arabic: 'قَامُ',
          roleUrdu: 'فعلِ ماضی',
          meaningUrdu: 'کھڑے رہ گئے',
        },
        {
          arabic: 'وا۟',
          roleUrdu: 'ضمیرِ فاعل (جمع مذکر غائب)',
          meaningUrdu: 'وہ سب (فاعل)',
        },
      ],
      ruleIds: ['subject-pronoun', 'perfect', 'weak-verb', 'condition-answer'],
    },
    {
      id: '2:20:14',
      ayah: 20,
      position: 14,
      arabic: 'وَلَوْ',
      meaningUrdu: 'اوراگر',
      pos: 'particle',
      posUrdu: 'حرفِ شرط',
      root: null,
      lemma: 'لَو',
      morphologyUrdu: 'حرفِ شرط، مبنی۔ سابقہ: وَ (حرفِ استئناف)۔',
      syntaxUrdu: 'الواو استئنافية؛ حرف شرط',
      dictionaryUrdu:
        'لَوْ ایسی شرط کے لیے آتا ہے جو واقع نہیں ہوئی، یعنی «اگر ایسا ہوتا»؛ اس کا جواب عموماً لَ کے ساتھ آتا ہے۔ اسے إِنْ سے الگ سمجھیے جو مضارع کو جزم دیتا ہے۔',
      segments: [
        {
          arabic: 'وَ',
          roleUrdu: 'حرفِ استئناف',
          meaningUrdu: 'اور',
        },
        {
          arabic: 'لَوْ',
          roleUrdu: 'حرفِ شرط',
          meaningUrdu: 'اگر',
        },
      ],
      ruleIds: ['resumption', 'law-condition'],
    },
    {
      id: '2:20:15',
      ayah: 20,
      position: 15,
      arabic: 'شَآءَ',
      meaningUrdu: 'چاہے',
      pos: 'verb',
      posUrdu: 'فعلِ ماضی',
      root: 'ش ي أ',
      lemma: 'شَاءَ',
      morphologyUrdu: 'فعلِ ماضی، معروف، واحد مذکر غائب، ثلاثی مجرد — اوّل (I)۔',
      syntaxUrdu: 'فعل ماض',
      dictionaryUrdu:
        'شَاءَ کا معنی چاہنا اور ارادہ کرنا ہے؛ الف مادے کی یاء سے بدلا ہے اور آخر کا ہمزہ اصلی ہے۔ لَوْ کے بعد ماضی کا ترجمہ «اگر چاہتا» ہوتا ہے، اور مفعول سیاق سے سمجھا جاتا ہے۔',
      segments: [
        {
          arabic: 'شَآءَ',
          roleUrdu: 'فعلِ ماضی',
          meaningUrdu: 'چاہتا',
        },
      ],
      ruleIds: ['perfect', 'weak-verb', 'hamzated', 'law-condition', 'elision'],
    },
    {
      id: '2:20:16',
      ayah: 20,
      position: 16,
      arabic: 'ٱللَّهُ',
      meaningUrdu: 'اللہ',
      pos: 'noun',
      posUrdu: 'اسمِ علم مرفوع',
      root: 'أ ل ه',
      lemma: 'ٱللَّه',
      morphologyUrdu: 'اسمِ علم، مرفوع۔',
      syntaxUrdu: 'لفظ الجلالة مرفوع',
      dictionaryUrdu:
        'اللَّه اللہ تعالیٰ کا خاص نام ہے۔ لغوی فہرست اسے أ ل ه کے تحت رکھتی ہے اور اس کے اشتقاق میں مختلف اقوال ہیں۔',
      segments: [
        {
          arabic: 'ٱللَّهُ',
          roleUrdu: 'اسمِ علم مرفوع',
          meaningUrdu: 'اللہ',
        },
      ],
      ruleIds: ['proper-noun', 'nominative', 'subject'],
    },
    {
      id: '2:20:17',
      ayah: 20,
      position: 17,
      arabic: 'لَذَهَبَ',
      meaningUrdu: 'ضرور لے جائے',
      pos: 'verb',
      posUrdu: 'فعلِ ماضی',
      root: 'ذ ه ب',
      lemma: 'ذَهَبَ',
      morphologyUrdu:
        'فعلِ ماضی، معروف، واحد مذکر غائب، ثلاثی مجرد — اوّل (I)۔ سابقہ: لَ (لامِ تاکید)۔',
      syntaxUrdu: 'اللام لام التوكيد؛ فعل ماض',
      dictionaryUrdu:
        'لَ یہاں لَوْ کے جواب پر تاکید کا لام ہے، یعنی «تو ضرور»۔ ذَهَبَ کے ساتھ بِ آئے تو «لے جانا» کا معنی دیتا ہے۔',
      segments: [
        {
          arabic: 'لَ',
          roleUrdu: 'لامِ تاکید',
          meaningUrdu: 'تو ضرور',
        },
        {
          arabic: 'ذَهَبَ',
          roleUrdu: 'فعلِ ماضی',
          meaningUrdu: 'لے جاتا (بِ کے ساتھ)',
        },
      ],
      ruleIds: ['emphatic-lam', 'perfect', 'law-condition', 'condition-answer'],
    },
    {
      id: '2:20:18',
      ayah: 20,
      position: 18,
      arabic: 'بِسَمْعِهِمْ',
      meaningUrdu: 'سماعت ان کی',
      pos: 'noun',
      posUrdu: 'اسم مجرور + ضمیرِ متصل',
      root: 'س م ع',
      lemma: 'سَمْع',
      morphologyUrdu:
        'اسم، مذکر، مجرور۔ سابقہ: بِ (حرفِ جر)۔ لاحقہ: هِمْ ضمیرِ متصل، جمع مذکر غائب۔',
      syntaxUrdu: 'جار ومجرور و«هم» ضمير متصل في محل جر بالاضافة',
      dictionaryUrdu:
        'سَمْع سننے کی قوت یا سماعت ہے؛ یہ اصل میں مصدر ہے، اسی لیے جمع کی ضمیر کے ساتھ بھی واحد آیا ہے۔ بِ یہاں ذَهَبَ کو «لے جانا» کا معنی دیتا ہے۔',
      segments: [
        {
          arabic: 'بِ',
          roleUrdu: 'حرفِ جر',
          meaningUrdu: 'کو (تعدیہ کی باء)',
        },
        {
          arabic: 'سَمْعِ',
          roleUrdu: 'اسم مجرور',
          meaningUrdu: 'سننے کی قوت',
        },
        {
          arabic: 'هِمْ',
          roleUrdu: 'ضمیرِ متصل (جمع مذکر غائب)',
          meaningUrdu: 'ان کی',
        },
      ],
      ruleIds: ['pronoun', 'preposition', 'genitive', 'idafa'],
    },
    {
      id: '2:20:19',
      ayah: 20,
      position: 19,
      arabic: 'وَأَبْصَـٰرِهِمْ',
      meaningUrdu: 'اورنگاہیں ان کی',
      pos: 'noun',
      posUrdu: 'اسم مجرور + ضمیرِ متصل',
      root: 'ب ص ر',
      lemma: 'بَصَر',
      morphologyUrdu:
        'اسم، جمع مذکر، مجرور۔ سابقہ: وَ (حرفِ عطف)۔ لاحقہ: هِمْ ضمیرِ متصل، جمع مذکر غائب۔',
      syntaxUrdu: 'الواو عاطفة؛ اسم مجرور و«هم» ضمير متصل في محل جر بالاضافة',
      dictionaryUrdu:
        'أَبْصَار، بَصَر کی جمعِ تکسیر ہے؛ یہاں وَ کے ذریعے پچھلے مجرور پر معطوف ہے، اس لیے کسرہ آیا ہے۔ یہ اسم ہے، فعل نہیں۔',
      segments: [
        {
          arabic: 'وَ',
          roleUrdu: 'حرفِ عطف',
          meaningUrdu: 'اور',
        },
        {
          arabic: 'أَبْصَـٰرِ',
          roleUrdu: 'اسم مجرور',
          meaningUrdu: 'نگاہیں',
        },
        {
          arabic: 'هِمْ',
          roleUrdu: 'ضمیرِ متصل (جمع مذکر غائب)',
          meaningUrdu: 'ان کی',
        },
      ],
      ruleIds: ['pronoun', 'conjunction', 'genitive', 'broken-plural', 'idafa'],
    },
    {
      id: '2:20:20',
      ayah: 20,
      position: 20,
      arabic: 'إِنَّ',
      meaningUrdu: 'بیشک',
      pos: 'particle',
      posUrdu: 'حرفِ نصب',
      root: null,
      lemma: 'إِنّ',
      morphologyUrdu: 'حرفِ نصب، مبنی۔',
      syntaxUrdu: 'حرف نصب',
      dictionaryUrdu:
        'إِنَّ تاکید کا حرف ہے، یعنی «یقیناً، بے شک»؛ یہ اپنے اسم کو نصب اور خبر کو رفع دیتا ہے۔',
      segments: [
        {
          arabic: 'إِنَّ',
          roleUrdu: 'حرفِ نصب',
          meaningUrdu: 'بے شک',
        },
      ],
      ruleIds: ['inna'],
    },
    {
      id: '2:20:21',
      ayah: 20,
      position: 21,
      arabic: 'ٱللَّهَ',
      meaningUrdu: 'اللہ',
      pos: 'noun',
      posUrdu: 'اسمِ علم منصوب',
      root: 'أ ل ه',
      lemma: 'ٱللَّه',
      morphologyUrdu: 'اسمِ علم، منصوب۔',
      syntaxUrdu: 'لفظ الجلالة منصوب',
      dictionaryUrdu:
        'اللَّه اللہ تعالیٰ کا خاص نام ہے۔ لغوی فہرست اسے أ ل ه کے تحت رکھتی ہے اور اس کے اشتقاق میں مختلف اقوال ہیں۔ یہاں إِنَّ کا اسم ہونے سے منصوب ہے۔',
      segments: [
        {
          arabic: 'ٱللَّهَ',
          roleUrdu: 'اسمِ علم منصوب',
          meaningUrdu: 'اللہ',
        },
      ],
      ruleIds: ['proper-noun', 'accusative', 'inna'],
    },
    {
      id: '2:20:22',
      ayah: 20,
      position: 22,
      arabic: 'عَلَىٰ',
      meaningUrdu: 'اوپر',
      pos: 'particle',
      posUrdu: 'حرفِ جر',
      root: null,
      lemma: 'عَلَىٰ',
      morphologyUrdu: 'حرفِ جر، مبنی۔',
      syntaxUrdu: 'حرف جر',
      dictionaryUrdu:
        'عَلَى کا بنیادی معنی «اوپر» ہے؛ قدرت کے ذکر میں یہ اس چیز کو بتاتا ہے جس پر قدرت ہو، اس لیے اردو میں «پر» آتا ہے۔',
      segments: [
        {
          arabic: 'عَلَىٰ',
          roleUrdu: 'حرفِ جر',
          meaningUrdu: 'پر',
        },
      ],
      ruleIds: ['preposition', 'fronting'],
    },
    {
      id: '2:20:23',
      ayah: 20,
      position: 23,
      arabic: 'كُلِّ',
      meaningUrdu: 'ہر',
      pos: 'noun',
      posUrdu: 'اسم مجرور',
      root: 'ك ل ل',
      lemma: 'كُلّ',
      morphologyUrdu: 'اسم، مذکر، مجرور۔',
      syntaxUrdu: 'اسم مجرور',
      dictionaryUrdu:
        'كُلّ مضاف ہو کر سب افراد کو شامل کرتا ہے؛ واحد نکرہ مضاف الیہ کے ساتھ اس کا مفہوم «ہر ایک» ہے۔',
      segments: [
        {
          arabic: 'كُلِّ',
          roleUrdu: 'اسم مجرور',
          meaningUrdu: 'ہر',
        },
      ],
      ruleIds: ['genitive', 'idafa'],
    },
    {
      id: '2:20:24',
      ayah: 20,
      position: 24,
      arabic: 'شَىْءٍۢ',
      meaningUrdu: 'چیز کے',
      pos: 'noun',
      posUrdu: 'اسم مجرور',
      root: 'ش ي أ',
      lemma: 'شَىْء',
      morphologyUrdu: 'اسم، مذکر، نکرہ (تنوین)، مجرور۔',
      syntaxUrdu: 'اسم مجرور',
      dictionaryUrdu:
        'شَيْء کا عام معنی «چیز» ہے اور عربی کے سب سے عام اسموں میں سے ہے۔ مادے کا درمیانی حرف یاء اور آخری حرف اصلی ہمزہ ہے۔',
      segments: [
        {
          arabic: 'شَىْءٍۢ',
          roleUrdu: 'اسم مجرور',
          meaningUrdu: 'چیز',
        },
      ],
      ruleIds: ['genitive', 'indefinite', 'idafa'],
    },
    {
      id: '2:20:25',
      ayah: 20,
      position: 25,
      arabic: 'قَدِيرٌۭ',
      meaningUrdu: 'قدرت والاہے',
      pos: 'noun',
      posUrdu: 'اسم مرفوع',
      root: 'ق د ر',
      lemma: 'قَدِير',
      morphologyUrdu: 'اسم، مذکر، نکرہ (تنوین)، مرفوع۔',
      syntaxUrdu: 'اسم مرفوع',
      dictionaryUrdu:
        'قَدِير، فَعِيل کے وزن پر صفت ہے، یعنی «پوری قدرت رکھنے والا»؛ یہ اسم ہے، فعل نہیں۔ عَلَى کے ساتھ اس چیز کو بتاتا ہے جس پر قدرت ہے۔',
      segments: [
        {
          arabic: 'قَدِيرٌۭ',
          roleUrdu: 'اسم مرفوع',
          meaningUrdu: 'پوری قدرت والا',
        },
      ],
      ruleIds: ['nominative', 'indefinite', 'inna', 'nominal'],
    },
  ],
  ayahs: [
    {
      number: 1,
      translationUrdu: '',
      themeUrdu: '',
      tafsirUrdu: '',
      phrases: [],
    },
    {
      number: 2,
      translationUrdu: '',
      themeUrdu: '',
      tafsirUrdu: '',
      phrases: [],
    },
    {
      number: 3,
      translationUrdu: '',
      themeUrdu: '',
      tafsirUrdu: '',
      phrases: [],
    },
    {
      number: 4,
      translationUrdu: '',
      themeUrdu: '',
      tafsirUrdu: '',
      phrases: [],
    },
    {
      number: 5,
      translationUrdu: '',
      themeUrdu: '',
      tafsirUrdu: '',
      phrases: [],
    },
    {
      number: 6,
      translationUrdu: '',
      themeUrdu: '',
      tafsirUrdu: '',
      phrases: [],
    },
    {
      number: 7,
      translationUrdu: '',
      themeUrdu: '',
      tafsirUrdu: '',
      phrases: [],
    },
    {
      number: 8,
      translationUrdu: '',
      themeUrdu: '',
      tafsirUrdu: '',
      phrases: [],
    },
    {
      number: 9,
      translationUrdu: '',
      themeUrdu: '',
      tafsirUrdu: '',
      phrases: [],
    },
    {
      number: 10,
      translationUrdu: '',
      themeUrdu: '',
      tafsirUrdu: '',
      phrases: [],
    },
    {
      number: 11,
      translationUrdu: '',
      themeUrdu: '',
      tafsirUrdu: '',
      phrases: [],
    },
    {
      number: 12,
      translationUrdu: '',
      themeUrdu: '',
      tafsirUrdu: '',
      phrases: [],
    },
    {
      number: 13,
      translationUrdu: '',
      themeUrdu: '',
      tafsirUrdu: '',
      phrases: [],
    },
    {
      number: 14,
      translationUrdu: '',
      themeUrdu: '',
      tafsirUrdu: '',
      phrases: [],
    },
    {
      number: 15,
      translationUrdu: '',
      themeUrdu: '',
      tafsirUrdu: '',
      phrases: [],
    },
    {
      number: 16,
      translationUrdu: '',
      themeUrdu: '',
      tafsirUrdu: '',
      phrases: [],
    },
    {
      number: 17,
      translationUrdu: '',
      themeUrdu: '',
      tafsirUrdu: '',
      phrases: [],
    },
    {
      number: 18,
      translationUrdu: '',
      themeUrdu: '',
      tafsirUrdu: '',
      phrases: [],
    },
    {
      number: 19,
      translationUrdu: '',
      themeUrdu: '',
      tafsirUrdu: '',
      phrases: [],
    },
    {
      number: 20,
      translationUrdu: '',
      themeUrdu: '',
      tafsirUrdu: '',
      phrases: [],
    },
  ],
  rules: [
    {
      id: 'muqattaat',
      titleUrdu: 'حروفِ مقطعات',
      explanationUrdu:
        'بعض سورتوں کے شروع میں الگ الگ پڑھے جانے والے حروف، جیسے الٓمٓ اور يسٓ، حروفِ مقطعات کہلاتے ہیں۔ ان کا حقیقی مفہوم اللہ ہی جانتا ہے، اس لیے ان کا ترجمہ یا مادہ مقرر نہیں کیا جاتا، اور ہر حرف اپنے نام سے پڑھا جاتا ہے۔',
      exampleUrdu: 'الٓمٓ — الف ۔ لام ۔ میم۔ اس مقام کی تفصیل متعلقہ لفظ کے صرف و نحو میں دیکھیے۔',
    },
    {
      id: 'demonstrative',
      titleUrdu: 'اسمِ اشارہ',
      explanationUrdu:
        'اسمِ اشارہ کسی متعین شخص، چیز یا جگہ کی طرف اشارہ کرتا ہے: قریب کے لیے هَٰذَا، هَٰذِهِ اور هَٰؤُلَاءِ، اور دور کے لیے ذَٰلِكَ، تِلْكَ اور أُولَٰئِكَ۔ یہ عموماً مبنی ہے؛ آخر کا كَ خطاب کا حرف ہے، ضمیر نہیں، اور بعد میں آنے والا ال والا اسم اکثر اس کا بدل یا صفت ہوتا ہے۔',
      exampleUrdu: 'ذَٰلِكَ — وہ / یہ۔ اس مقام کی تفصیل متعلقہ لفظ کے صرف و نحو میں دیکھیے۔',
    },
    {
      id: 'nominal',
      titleUrdu: 'جملۂ اسمیہ: مبتدا اور خبر',
      explanationUrdu:
        'جملۂ اسمیہ مبتدا اور خبر سے بنتا ہے؛ خبر مبتدا کے بارے میں اطلاع دیتی ہے اور دونوں اصلاً مرفوع ہوتے ہیں۔ خبر ایک لفظ، پورا جملہ، جار و مجرور یا ظرف ہو سکتی ہے، کبھی مبتدا سے پہلے آتی ہے، اور ایک مبتدا کی ایک سے زیادہ خبریں بھی ہو سکتی ہیں۔',
      exampleUrdu: 'ذَٰلِكَ — وہ / یہ۔ اس مقام کی تفصیل متعلقہ لفظ کے صرف و نحو میں دیکھیے۔',
    },
    {
      id: 'definite',
      titleUrdu: 'معرفہ اور ال',
      explanationUrdu:
        'ال اسم کو معرفہ، یعنی متعین، بناتا ہے اور مادے کا حصہ نہیں ہوتا؛ اس کا ہمزہ وصلی ہے جو ملا کر پڑھنے میں ساقط ہو جاتا ہے۔ شمسی حرف سے پہلے لام مدغم ہو جاتا ہے مگر تعریف باقی رہتی ہے، اور ال والے اسم پر تنوین نہیں آتی۔',
      exampleUrdu: 'ٱلْكِتَـٰبُ — کتاب ہے۔ اس مقام کی تفصیل متعلقہ لفظ کے صرف و نحو میں دیکھیے۔',
    },
    {
      id: 'nominative',
      titleUrdu: 'رفع اور اس کی علامات',
      explanationUrdu:
        'فاعل، نائبِ فاعل، مبتدا، خبر، اسمِ كَانَ اور خبرِ إِنَّ جیسے کرداروں میں اسم مرفوع ہوتا ہے۔ اس کی اصل علامت ضمہ ہے؛ جمع مذکر سالم اور اسماءِ خمسہ میں واو، اور تثنیہ میں الف رفع کی علامت ہے۔ جہاں حرکت ظاہر نہ ہو سکے وہاں رفع مقدر مانا جاتا ہے۔',
      exampleUrdu: 'ٱلْكِتَـٰبُ — کتاب ہے۔ اس مقام کی تفصیل متعلقہ لفظ کے صرف و نحو میں دیکھیے۔',
    },
    {
      id: 'badal',
      titleUrdu: 'بدل',
      explanationUrdu:
        'اسمی بدل پہلے اسم کو زیادہ واضح یا متعین کرتا اور اعراب میں اس کی پیروی کرتا ہے، جیسے جَاءَ أَخُوكَ زَيْدٌ۔ یہ پورے کا، اس کے کسی جز کا یا اس سے متعلق کسی چیز کا بدل ہو سکتا ہے؛ عطفِ بیان بھی وضاحت کرتا ہے۔ پورا جملہ بھی پہلے جملے کا بدل ہو سکتا ہے؛ پہلے جملے کا محلِ اعراب ہو تو یہ بھی اسی محل میں ہوتا ہے، الگ الفاظ کا اعراب یکساں ہونا لازم نہیں۔',
      exampleUrdu: 'ٱلْكِتَـٰبُ — کتاب ہے۔ اس مقام کی تفصیل متعلقہ لفظ کے صرف و نحو میں دیکھیے۔',
    },
    {
      id: 'la-generic',
      titleUrdu: 'لائے نفیِ جنس',
      explanationUrdu:
        'لائے نفیِ جنس پوری جنس کی مکمل نفی کرتا ہے، جیسے لَا شَكَّ فِيهِ «اس میں کوئی بھی شک نہیں»۔ اس کا اسم نکرہ ہوتا ہے؛ مضاف یا شبیہ بالمضاف نہ ہو تو مفرد کہلاتا ہے اور اپنی علامتِ نصب پر مبنی ہوتا ہے۔ واحد اور جمعِ تکسیر میں فتحہ، تثنیہ اور جمع مذکر سالم میں یاء ہوتی ہے؛ جمع مؤنث سالم میں کسرہ یا فتحہ جائز ہے۔ مضاف اور شبیہ بالمضاف اسم منصوب ہوتا ہے، اور خبر مرفوع یا جار و مجرور ہوتی ہے۔',
      exampleUrdu: 'لَا — نہیں۔ اس مقام کی تفصیل متعلقہ لفظ کے صرف و نحو میں دیکھیے۔',
    },
    {
      id: 'accusative',
      titleUrdu: 'نصب اور اس کی علامات',
      explanationUrdu:
        'مفعول، حال، تمییز، ظرف، اسمِ إِنَّ اور خبرِ كَانَ جیسے کرداروں میں اسم منصوب ہوتا ہے۔ اس کی اصل علامت فتحہ ہے؛ تثنیہ اور جمع مذکر سالم میں یاء، اسماءِ خمسہ میں الف، اور جمع مؤنث سالم میں کسرہ نصب کی علامت ہے۔ جہاں حرکت ظاہر نہ ہو وہاں نصب مقدر ہوتا ہے۔',
      exampleUrdu: 'رَيْبَ — کوئی شک۔ اس مقام کی تفصیل متعلقہ لفظ کے صرف و نحو میں دیکھیے۔',
    },
    {
      id: 'pronoun',
      titleUrdu: 'ضمیرِ متصل',
      explanationUrdu:
        'متصل ضمیر کسی دوسرے لفظ کے آخر میں لگتی ہے، جیسے هُ، هَا، هُمْ، كَ، كُمْ اور نَا، اور اس کا کردار اسی لفظ سے طے ہوتا ہے جس سے وہ ملی ہو۔ اسم کے ساتھ یہ مضاف الیہ (رَبُّكَ)، حرفِ جر کے ساتھ مجرور (لَهُ)، اور إِنَّ کے ساتھ اس کا اسم (إِنَّهُ) ہوتی ہے؛ ضمیر مبنی ہے، اس لیے اس کا اعراب محلی ہوتا ہے۔',
      exampleUrdu: 'فِيهِ — جس میں۔ اس مقام کی تفصیل متعلقہ لفظ کے صرف و نحو میں دیکھیے۔',
    },
    {
      id: 'preposition',
      titleUrdu: 'حرفِ جر اور جار و مجرور',
      explanationUrdu:
        'حرفِ جر، جیسے مِنْ، إِلَى، عَنْ، عَلَى، فِي، بِ، لِ اور كَ، اپنے بعد کے اسم یا ضمیر کو مجرور کرتا ہے اور دونوں مل کر جار و مجرور بنتے ہیں۔ یہ ترکیب کسی فعل، مشتق اسم یا محذوف لفظ سے متعلق ہوتی ہے؛ ہر حرف کے کئی معانی ہیں، اس لیے ترجمہ سیاق سے کریں۔',
      exampleUrdu: 'فِيهِ — جس میں۔ اس مقام کی تفصیل متعلقہ لفظ کے صرف و نحو میں دیکھیے۔',
    },
    {
      id: 'indefinite',
      titleUrdu: 'نکرہ اور تنوین',
      explanationUrdu:
        'جو اسم کسی متعین فرد کو ظاہر نہ کرے وہ نکرہ ہے، اور معرب نکرہ کی عام علامت تنوین ہے، جیسے كِتَابٌ «ایک کتاب»۔ سیاق کے مطابق نکرہ عموم، تعظیم یا کمی کا مفہوم بھی دیتا ہے، اور اس کے بعد آنے والا جملہ اکثر اس کی صفت ہوتا ہے۔',
      exampleUrdu: 'هُدًۭى — ہدایت ہے۔ اس مقام کی تفصیل متعلقہ لفظ کے صرف و نحو میں دیکھیے۔',
    },
    {
      id: 'implied-case',
      titleUrdu: 'اعرابِ تقدیری',
      explanationUrdu:
        'جس معرب لفظ کے آخر میں الف ہو، جیسے هُدًى، مُوسَى اور يَخْشَى، اس پر اعراب کی حرکت ظاہر نہیں ہوتی؛ آخر میں یاء یا واو ہو، جیسے الْقَاضِي اور يَدْعُو، تو ضمہ اور اسم میں کسرہ بھی ظاہر نہیں ہوتا۔ یائے متکلم سے پہلے بھی حرکت چھپ جاتی ہے؛ ایسی جگہ اعراب مقدر مانا جاتا ہے اور حالت کردار سے طے ہوتی ہے۔',
      exampleUrdu: 'هُدًۭى — ہدایت ہے۔ اس مقام کی تفصیل متعلقہ لفظ کے صرف و نحو میں دیکھیے۔',
    },
    {
      id: 'genitive',
      titleUrdu: 'جر اور اس کی علامات',
      explanationUrdu:
        'حرفِ جر کے بعد اور مضاف الیہ ہونے کی صورت میں اسم مجرور ہوتا ہے، اور اس کا تابع بھی جر لیتا ہے۔ اس کی اصل علامت کسرہ ہے؛ تثنیہ، جمع مذکر سالم اور اسماءِ خمسہ میں یاء، اور غیر منصرف اسم میں فتحہ جر کی علامت ہے۔ مبنی ضمیر یا اسم میں یہ حالت محلِ جر کہلاتی ہے۔',
      exampleUrdu:
        'لِّلْمُتَّقِينَ — واسطے ان کے جو متقی ہیں۔ اس مقام کی تفصیل متعلقہ لفظ کے صرف و نحو میں دیکھیے۔',
    },
    {
      id: 'participle',
      titleUrdu: 'اسمِ فاعل اور اسمِ مفعول',
      explanationUrdu:
        'اسمِ فاعل کام کرنے والے کو اور اسمِ مفعول اس کو بتاتا ہے جس پر کام ہوا؛ ثلاثی مجرد میں ان کے وزن فَاعِلٌ اور مَفْعُولٌ ہیں، اور مزید فیہ میں یہ میمِ مضموم سے شروع ہوتے ہیں، جیسے مُؤْمِنٌ اور مُنْزَلٌ۔ یہ اسم ہیں، فعل نہیں، اگرچہ کبھی فعل کی طرح مفعول لیتے ہیں۔',
      exampleUrdu:
        'لِّلْمُتَّقِينَ — واسطے ان کے جو متقی ہیں۔ اس مقام کی تفصیل متعلقہ لفظ کے صرف و نحو میں دیکھیے۔',
    },
    {
      id: 'sound-plural',
      titleUrdu: 'جمع مذکر سالم',
      explanationUrdu:
        'جمع مذکر سالم رفع میں واو اور نون، اور نصب و جر میں یاء اور نون پر ختم ہوتی ہے، جیسے الْمُؤْمِنُونَ اور الْمُؤْمِنِينَ؛ مضاف ہونے پر یہ نون گر جاتا ہے۔ أُولُو اور سِنِينَ جیسے الفاظ بھی اسی کے حکم میں ہیں؛ اسم کے اس نون کو افعالِ خمسہ کے نون سے الگ سمجھیں۔',
      exampleUrdu:
        'لِّلْمُتَّقِينَ — واسطے ان کے جو متقی ہیں۔ اس مقام کی تفصیل متعلقہ لفظ کے صرف و نحو میں دیکھیے۔',
    },
    {
      id: 'assimilation',
      titleUrdu: 'زائد تاء کا ابدال اور ادغام',
      explanationUrdu:
        'بابِ افتعال کی زائد تاء کبھی پڑوسی حرف کے سبب بدل یا مدغم ہوتی ہے: فاء کلمہ واو ہو تو وہ تاء بن کر مدغم ہوتی ہے (اتَّقَى، مُتَّكِئ) اور أَخَذَ سے اتَّخَذَ بھی اسی طرح ہے؛ ط کے ساتھ تاء طاء (اطَّلَعَ) اور د یا ز کے ساتھ دال بنتی ہے (ادَّعَى، ازْدَادَ)۔ تَفَعَّلَ اور تَفَاعَلَ کے مضارع میں ایک تاء کبھی حذف (تَذَكَّرُونَ) یا اگلے حرف میں مدغم ہوتی ہے (يَدَّبَّرُوا۟)؛ اس تشدید کو مضاعف یا بابِ تفعیل نہ سمجھیں۔',
      exampleUrdu:
        'لِّلْمُتَّقِينَ — واسطے ان کے جو متقی ہیں۔ اس مقام کی تفصیل متعلقہ لفظ کے صرف و نحو میں دیکھیے۔',
    },
    {
      id: 'relative',
      titleUrdu: 'اسمِ موصول اور صلہ',
      explanationUrdu:
        'اسمِ موصول، جیسے الَّذِي، الَّتِي، الَّذِينَ، مَنْ اور مَا، اپنا معنی بعد کے جملے سے مکمل کرتا ہے جسے صلہ کہتے ہیں؛ صلے میں موصول کی طرف لوٹنے والی ضمیر ظاہر یا محذوف ہوتی ہے۔ موصول عموماً مبنی ہے اور اس کا محلِ اعراب جملے میں کردار سے طے ہوتا ہے، جبکہ صلے کا اپنا کوئی محلِ اعراب نہیں۔',
      exampleUrdu:
        'ٱلَّذِينَ — یہ وہ لوگ ہیں۔ اس مقام کی تفصیل متعلقہ لفظ کے صرف و نحو میں دیکھیے۔',
    },
    {
      id: 'adjective',
      titleUrdu: 'موصوف اور صفت',
      explanationUrdu:
        'صفت اپنے موصوف کی خوبی یا حالت بتاتی ہے اور اس کے بعد آ کر اعراب، معرفہ و نکرہ، جنس اور عدد میں اس کی پیروی کرتی ہے، جیسے الرَّجُلُ الصَّالِحُ۔ نکرہ موصوف کے بعد پورا جملہ یا جار و مجرور بھی صفت بن سکتا ہے، اور غیر عاقل جمع کی صفت اکثر واحد مؤنث آتی ہے۔',
      exampleUrdu:
        'ٱلَّذِينَ — یہ وہ لوگ ہیں۔ اس مقام کی تفصیل متعلقہ لفظ کے صرف و نحو میں دیکھیے۔',
    },
    {
      id: 'subject-pronoun',
      titleUrdu: 'ضمیر بطور فاعل',
      explanationUrdu:
        'فعل کا فاعل کبھی متصل ضمیر ہوتا ہے، جیسے كَتَبْتُ کی تاء، كَتَبُوا کی واو اور كَتَبْنَا کا نَا، اور کبھی صیغے میں پوشیدہ ہوتا ہے، جیسے اُكْتُبْ میں أَنْتَ اور نَكْتُبُ میں نَحْنُ۔ مجہول فعل کے ساتھ یہی ضمیر نائبِ فاعل ہوتی ہے، اور كَانَ یا كَادَ کے ساتھ ان کا اسم، جیسے كَانُوا کی واو؛ شخص اور عدد صیغے سے پہچانیں۔',
      exampleUrdu:
        'يُؤْمِنُونَ — جو ایمان لاتے ہیں۔ اس مقام کی تفصیل متعلقہ لفظ کے صرف و نحو میں دیکھیے۔',
    },
    {
      id: 'imperfect',
      titleUrdu: 'فعلِ مضارع',
      explanationUrdu:
        'فعلِ مضارع حال یا مستقبل کے عمل کو، اور کبھی عادت یا جاری کیفیت کو، بیان کرتا ہے؛ درست مفہوم سیاق سے طے ہوتا ہے۔ اس کے شروع میں ہمزہ، نون، یاء یا تاء میں سے ایک علامت آتی ہے، اور ناصب یا جازم نہ ہو تو یہ مرفوع ہوتا ہے، جیسے يَكْتُبُ۔',
      exampleUrdu:
        'يُؤْمِنُونَ — جو ایمان لاتے ہیں۔ اس مقام کی تفصیل متعلقہ لفظ کے صرف و نحو میں دیکھیے۔',
    },
    {
      id: 'derived-form',
      titleUrdu: 'ثلاثی مزید فیہ کے ابواب',
      explanationUrdu:
        'تین اصلی حروف پر ایک سے تین زائد حروف بڑھانے سے مزید فیہ کے ابواب بنتے ہیں، جیسے أَفْعَلَ، فَعَّلَ، فَاعَلَ، تَفَعَّلَ، تَفَاعَلَ، اِنْفَعَلَ، اِفْتَعَلَ اور اِسْتَفْعَلَ۔ ہر باب معنی میں خاص رنگ لاتا ہے، جیسے متعدی بنانا، کثرت، باہمی عمل یا طلب، مگر مادہ وہی تین حروف رہتا ہے۔',
      exampleUrdu:
        'يُؤْمِنُونَ — جو ایمان لاتے ہیں۔ اس مقام کی تفصیل متعلقہ لفظ کے صرف و نحو میں دیکھیے۔',
    },
    {
      id: 'hamzated',
      titleUrdu: 'مہموز فعل',
      explanationUrdu:
        'جس فعل کے اصلی حروف میں ہمزہ ہو وہ مہموز ہے، جیسے أَخَذَ، سَأَلَ اور قَرَأَ۔ ہمزہ لکھنے میں الف، واو یا یاء کی کرسی پر آتا ہے اور بعض صیغوں میں نرم یا حذف ہو جاتا ہے، جیسے خُذْ، كُلْ اور رَأَى کا مضارع يَرَى؛ پھر بھی مادے میں اسے شمار کیا جاتا ہے۔',
      exampleUrdu:
        'يُؤْمِنُونَ — جو ایمان لاتے ہیں۔ اس مقام کی تفصیل متعلقہ لفظ کے صرف و نحو میں دیکھیے۔',
    },
    {
      id: 'five-verbs',
      titleUrdu: 'افعالِ خمسہ',
      explanationUrdu:
        'جس مضارع کے ساتھ الفِ تثنیہ، واوِ جماعت یا یائے مخاطبہ لگے، جیسے يَفْعَلَانِ، تَفْعَلُونَ اور تَفْعَلِينَ، اس کا رفع نون کے باقی رہنے سے ہوتا ہے۔ نصب اور جزم دونوں میں یہ نون گر جاتا ہے، جبکہ الف، واو یا یاء فاعل کی ضمیر رہتی ہے۔',
      exampleUrdu:
        'يُؤْمِنُونَ — جو ایمان لاتے ہیں۔ اس مقام کی تفصیل متعلقہ لفظ کے صرف و نحو میں دیکھیے۔',
    },
    {
      id: 'conjunction',
      titleUrdu: 'عطف',
      explanationUrdu:
        'حروفِ عطف، جیسے وَ «اور»، فَ «پھر، تو»، ثُمَّ «پھر بعد میں»، أَوْ «یا» اور أَمْ «یا»، دو الفاظ یا جملوں کو ایک حکم میں جوڑتے ہیں۔ بعد والا لفظ معطوف کہلاتا ہے اور اعراب میں پہلے کی پیروی کرتا ہے؛ فَ ترتیب کے ساتھ فوراً بعد، اور ثُمَّ وقفے کے ساتھ بعد کا مفہوم دیتا ہے۔',
      exampleUrdu:
        'وَيُقِيمُونَ — اور وہ قائم کرتے ہیں۔ اس مقام کی تفصیل متعلقہ لفظ کے صرف و نحو میں دیکھیے۔',
    },
    {
      id: 'weak-verb',
      titleUrdu: 'معتل فعل',
      explanationUrdu:
        'جس فعل کے اصلی حروف میں واو یا یاء ہو وہ معتل ہے: پہلا حرف ہو تو مثال (وَعَدَ)، درمیانی ہو تو اجوف (قَالَ)، آخری ہو تو ناقص (دَعَا)، اور دو ہوں تو لفیف (وَقَى)۔ یہ حروف بعض صیغوں میں بدل یا گر جاتے ہیں، جیسے يَعِدُ، قُلْ اور لَمْ يَدْعُ؛ اس لیے مادہ صرف نظر آنے والے حروف سے مقرر نہ کریں۔',
      exampleUrdu:
        'وَيُقِيمُونَ — اور وہ قائم کرتے ہیں۔ اس مقام کی تفصیل متعلقہ لفظ کے صرف و نحو میں دیکھیے۔',
    },
    {
      id: 'object',
      titleUrdu: 'مفعول بہ',
      explanationUrdu:
        'متعدی فعل کا اثر جس پر پڑے وہ مفعول بہ ہے اور منصوب ہوتا ہے، جیسے نَصَرَ زَيْدٌ عَمْرًا میں عَمْرًا۔ اسمِ فاعل یا مصدر بھی فعل کی طرح مفعول لے سکتے ہیں، اور أَنْ يَفْعَلَ جیسا مصدری جملہ بھی مفعول بن سکتا ہے۔ سوالیہ یا دوسرا پورا جملہ بھی محلِ نصب میں مفعول ہو سکتا ہے؛ اس کے الگ الفاظ کا اعراب ان کے اپنے کردار سے طے ہوتا ہے۔',
      exampleUrdu: 'ٱلصَّلَوٰةَ — نماز۔ اس مقام کی تفصیل متعلقہ لفظ کے صرف و نحو میں دیکھیے۔',
    },
    {
      id: 'resumption',
      titleUrdu: 'استئناف: نئے جملے کا آغاز',
      explanationUrdu:
        'استئنافیہ وَ یا فَ پچھلے کلام سے ترکیب میں نہیں جڑتا بلکہ ایک نئے مستقل جملے کا آغاز کرتا ہے، جس کا کوئی محلِ اعراب نہیں ہوتا۔ معنی کا ربط باقی رہتا ہے، مگر بعد والا جملہ پچھلے کا معطوف نہیں سمجھا جاتا؛ عطف اور استئناف کا فیصلہ ترکیب اور سیاق سے ہوتا ہے۔',
      exampleUrdu: 'وَمِمَّا — اس میں سے جو۔ اس مقام کی تفصیل متعلقہ لفظ کے صرف و نحو میں دیکھیے۔',
    },
    {
      id: 'fronting',
      titleUrdu: 'تقدیم و تاخیر',
      explanationUrdu:
        'عام ترتیب بدل کر کسی جز کو پہلے لانا تقدیم کہلاتا ہے، جیسے خبر کو مبتدا سے پہلے لانا (لَهُمْ أَجْرٌ) یا جار و مجرور کو اپنے فعل سے پہلے لانا۔ نکرہ مبتدا کے ساتھ خبر کی تقدیم اکثر ضروری ہوتی ہے، اور کبھی یہ اختصاص یا زور کے لیے آتی ہے؛ اعراب کردار سے طے ہوتا ہے، ترتیب سے نہیں۔',
      exampleUrdu: 'وَمِمَّا — اس میں سے جو۔ اس مقام کی تفصیل متعلقہ لفظ کے صرف و نحو میں دیکھیے۔',
    },
    {
      id: 'object-pronoun',
      titleUrdu: 'ضمیر بطور مفعول',
      explanationUrdu:
        'فعل کے آخر میں لگی مفعولی ضمیر، جیسے نَصَرَهُ میں هُ اور نَصَرَنِي میں یاء، اس کو بتاتی ہے جس پر عمل ہوا؛ یہ مفعول بہ اور محلِ نصب میں ہوتی ہے، جبکہ تُ اور وا جیسی ضمیریں فاعل ہوتی ہیں۔ الگ لکھی جانے والی إِيَّا والی ضمیر بھی مفعول بنتی ہے، جیسے إِيَّاكَ؛ حرفِ جر، اسم، اسمِ فاعل یا مصدر سے ملی اسی شکل کی ضمیر محلِ جر میں ہوتی ہے۔',
      exampleUrdu:
        'رَزَقْنَـٰهُمْ — رزق دیا ہم نے ان کو۔ اس مقام کی تفصیل متعلقہ لفظ کے صرف و نحو میں دیکھیے۔',
    },
    {
      id: 'perfect',
      titleUrdu: 'فعلِ ماضی',
      explanationUrdu:
        'فعلِ ماضی عموماً گزرے یا مکمل ہو چکے عمل کو بیان کرتا ہے، جیسے كَتَبَ «اس نے لکھا»۔ یہ مبنی ہے؛ فاعل کی ضمیریں آخر میں لگ کر شخص اور عدد بتاتی ہیں، جیسے كَتَبْتُ، كَتَبْنَا اور كَتَبُوا۔ شرط کے بعد یا آنے والے یقینی واقعے کے بیان میں سیاق اس کا مفہوم مستقبل کی طرف بھی لے جاتا ہے۔',
      exampleUrdu:
        'رَزَقْنَـٰهُمْ — رزق دیا ہم نے ان کو۔ اس مقام کی تفصیل متعلقہ لفظ کے صرف و نحو میں دیکھیے۔',
    },
    {
      id: 'elision',
      titleUrdu: 'حذف اور تقدیر',
      explanationUrdu:
        'کلام میں کبھی کوئی حرف، ضمیر، لفظ یا پورا جملہ حذف ہوتا ہے مگر سیاق سے سمجھا جاتا ہے، جیسے رَبِّ میں یائے متکلم کی جگہ صرف کسرہ، صلے میں لوٹنے والی ضمیر، یا جوابِ شرط۔ ترجمہ اور ترکیب میں محذوف کو مقدر مانا جاتا ہے، اس لیے حالت صرف لکھی ہوئی آخری حرکت سے طے نہ کریں۔',
      exampleUrdu:
        'رَزَقْنَـٰهُمْ — رزق دیا ہم نے ان کو۔ اس مقام کی تفصیل متعلقہ لفظ کے صرف و نحو میں دیکھیے۔',
    },
    {
      id: 'passive',
      titleUrdu: 'فعلِ مجہول اور نائبِ فاعل',
      explanationUrdu:
        'فعلِ مجہول میں کام کرنے والے کا ذکر نہیں ہوتا اور اس کی جگہ نائبِ فاعل آتا ہے: عموماً مفعول مرفوع ہو کر، اور کبھی جار و مجرور یا مصدرِ مؤول محلِ رفع میں، جیسے نُفِخَ فِى ٱلصُّورِ۔ ماضی میں پہلا حرف مضموم اور آخری سے پہلا مکسور ہوتا ہے، جیسے كُتِبَ، جبکہ مضارع میں علامتِ مضارع مضموم اور آخری سے پہلا حرف مفتوح ہوتا ہے، جیسے يُكْتَبُ۔',
      exampleUrdu: 'أُنزِلَ — نازل کیا گیا۔ اس مقام کی تفصیل متعلقہ لفظ کے صرف و نحو میں دیکھیے۔',
    },
    {
      id: 'idafa',
      titleUrdu: 'مرکبِ اضافی',
      explanationUrdu:
        'دو اسموں کی نسبت میں پہلا مضاف اور دوسرا مضاف الیہ ہوتا ہے، جیسے كِتَابُ اللَّهِ «اللہ کی کتاب»۔ مضاف الیہ مجرور ہوتا ہے اور مضاف کا اپنا اعراب اس کے کردار سے طے ہوتا ہے۔ عام معنوی اضافت میں مضاف پر نہ ال آتا ہے نہ تنوین؛ لفظی اضافت میں بعض شرطوں کے ساتھ ال آ سکتا ہے۔ ضمیر یا پورا جملہ بھی مضاف الیہ بن سکتا ہے۔',
      exampleUrdu: 'قَبْلِكَ — آپ سے پہلے۔ اس مقام کی تفصیل متعلقہ لفظ کے صرف و نحو میں دیکھیے۔',
    },
    {
      id: 'independent-pronoun',
      titleUrdu: 'ضمیرِ منفصل',
      explanationUrdu:
        'ضمیرِ منفصل الگ لفظ کے طور پر لکھی جاتی ہے، جیسے هُوَ، هِيَ، هُمْ، أَنْتَ، أَنْتُمْ، أَنَا اور نَحْنُ۔ یہ مبنی ہے اور جملے میں اکثر مبتدا یا خبر بنتی ہے، یا کسی متصل ضمیر کی تاکید کرتی ہے؛ واوِ حالیہ کے بعد یہ جملۂ حال بھی شروع کر سکتی ہے۔',
      exampleUrdu: 'هُمْ — وہ۔ اس مقام کی تفصیل متعلقہ لفظ کے صرف و نحو میں دیکھیے۔',
    },
    {
      id: 'separating-pronoun',
      titleUrdu: 'ضمیرِ فصل',
      explanationUrdu:
        'ضمیرِ فصل وہ منفصل ضمیر ہے جو مبتدا اور خبر کے درمیان، یا إِنَّ اور كَانَ کے اسم اور خبر کے درمیان آتی ہے، جیسے زَيْدٌ هُوَ الْعَالِمُ میں هُوَ۔ یہ بتاتی ہے کہ بعد والا لفظ خبر ہے، صفت نہیں، اور حصر و تاکید کا مفہوم دیتی ہے؛ منتخب تجزیے میں اس کا اپنا کوئی محلِ اعراب نہیں۔',
      exampleUrdu: 'هُمُ — وہ۔ اس مقام کی تفصیل متعلقہ لفظ کے صرف و نحو میں دیکھیے۔',
    },
    {
      id: 'inna',
      titleUrdu: 'إِنَّ اور اس کا عمل',
      explanationUrdu:
        'إِنَّ جملۂ اسمیہ پر آ کر تاکید کرتا ہے: اس کا اسم منصوب اور خبر مرفوع ہوتی ہے، اور جملہ خبر ہو تو محلِ رفع میں ہوتا ہے۔ اس سے ملی ضمیر بھی اس کا اسم بنتی ہے، جیسے إِنَّهُ اور إِنَّا؛ خبر یا مؤخر اسم پر آنے والا لام تاکید کو اور پختہ کرتا ہے۔',
      exampleUrdu: 'إِنَّ — بیشک۔ اس مقام کی تفصیل متعلقہ لفظ کے صرف و نحو میں دیکھیے۔',
    },
    {
      id: 'equalization',
      titleUrdu: 'ہمزۂ تسویہ',
      explanationUrdu:
        'سَوَاءٌ جیسے لفظ کے بعد آنے والا وہ ہمزہ جو أَمْ کے ساتھ دو باتوں کو برابر ٹھہراتا ہے، ہمزۂ تسویہ کہلاتا ہے: «خواہ یہ ہو یا وہ، نتیجہ ایک ہے»۔ یہ حقیقی سوال نہیں؛ ہمزہ اپنے جملے سمیت مصدر کے حکم میں ہو کر عموماً مبتدا بنتا ہے۔',
      exampleUrdu:
        'ءَأَنذَرْتَهُمْ — تم ڈراؤ ان کو۔ اس مقام کی تفصیل متعلقہ لفظ کے صرف و نحو میں دیکھیے۔',
    },
    {
      id: 'lam-jussive',
      titleUrdu: 'لَمْ: ماضی کی نفی اور جزم',
      explanationUrdu:
        'لَمْ مضارع پر آ کر اسے مجزوم کرتا ہے اور معنی کو ماضی کی نفی میں بدل دیتا ہے، جیسے لَمْ يَكْتُبْ «اس نے نہیں لکھا»۔ صحیح آخر پر سکون، ناقص میں آخری حرفِ علت کا حذف اور افعالِ خمسہ میں نون کا حذف اس کی علامت ہے؛ أَلَمْ میں سوال کے ساتھ یہ اکثر اقرار کرانے کے لیے آتا ہے۔',
      exampleUrdu: 'لَمْ — نہ۔ اس مقام کی تفصیل متعلقہ لفظ کے صرف و نحو میں دیکھیے۔',
    },
    {
      id: 'jussive',
      titleUrdu: 'جزم اور اس کے اسباب',
      explanationUrdu:
        'مضارع لَمْ، لَمَّا، لامِ امر، لائے نہی اور جازم ادواتِ شرط کے بعد، یا امر کے جواب میں، مجزوم ہوتا ہے۔ صحیح آخر پر سکون (لَمْ يَكْتُبْ)، افعالِ خمسہ میں نون کا حذف، اور معتل آخر میں حرفِ علت کا حذف (لَمْ يَدْعُ) جزم کی علامت ہے؛ اجوف میں درمیانی حرف بھی گر سکتا ہے (لَمْ يَقُلْ)۔',
      exampleUrdu:
        'تُنذِرْهُمْ — تم ڈراؤ انکو۔ اس مقام کی تفصیل متعلقہ لفظ کے صرف و نحو میں دیکھیے۔',
    },
    {
      id: 'negation',
      titleUrdu: 'نفی: لَا، مَا اور لَيْسَ',
      explanationUrdu:
        'لَا اور مَا کسی خبر یا عمل کی نفی کرتے ہیں: لَا عموماً مضارع کے ساتھ، جیسے لَا يَعْلَمُ، اور مَا ماضی، مضارع یا جملۂ اسمیہ کے ساتھ، جیسے مَا عَلِمَ؛ یہ عام طور پر اعراب نہیں بدلتے۔ لَيْسَ نفی کا فعلِ ناقص ہے جو كَانَ کی طرح عمل کرتا ہے، اور مَا بھی کبھی اسی طرح خبر کو منصوب کرتا ہے۔',
      exampleUrdu: 'لَا — نہیں۔ اس مقام کی تفصیل متعلقہ لفظ کے صرف و نحو میں دیکھیے۔',
    },
    {
      id: 'verbal-sentence',
      titleUrdu: 'جملۂ فعلیہ',
      explanationUrdu:
        'جملۂ فعلیہ فعل سے شروع ہوتا ہے اور فعل اور فاعل، یا مجہول میں فعل اور نائبِ فاعل، سے بنتا ہے؛ متعدی فعل کے ساتھ مفعول بھی آتا ہے۔ فعل پہلے ہو تو ظاہر فاعل کے تثنیہ یا جمع ہونے پر بھی عموماً واحد رہتا ہے، البتہ مؤنث فاعل کے لیے اکثر مؤنث آتا ہے۔',
      exampleUrdu: 'خَتَمَ — مہر لگادیں۔ اس مقام کی تفصیل متعلقہ لفظ کے صرف و نحو میں دیکھیے۔',
    },
    {
      id: 'proper-noun',
      titleUrdu: 'اسمِ علم',
      explanationUrdu:
        'اسمِ علم کسی خاص شخص، جگہ یا چیز کا نام ہے، جیسے مُوسَى اور هَارُونُ؛ یہ خود معرفہ ہوتا ہے، اس لیے اسے ال یا اضافت کی ضرورت نہیں۔ بہت سے عجمی اور مؤنث نام غیر منصرف ہیں؛ اللَّهُ کا لفظ بھی علم ہے، اور اس کی مادہ وار درجہ بندی ایک لغوی اشاریہ ہے، طے شدہ اشتقاق نہیں۔',
      exampleUrdu: 'ٱللَّهُ — اللہ نے۔ اس مقام کی تفصیل متعلقہ لفظ کے صرف و نحو میں دیکھیے۔',
    },
    {
      id: 'subject',
      titleUrdu: 'فاعل',
      explanationUrdu:
        'فاعل وہ اسم ہے جس کی طرف فعل کا کام منسوب ہو؛ یہ فعل کے بعد آتا ہے اور مرفوع ہوتا ہے، جیسے ذَهَبَ زَيْدٌ میں زَيْدٌ۔ کرنے والا اسم ظاہر نہ ہو تو فاعل ضمیر ہوتا ہے، اور کرنے والا فعل سے پہلے مذکور ہو تو وہ مبتدا کہلاتا ہے۔',
      exampleUrdu: 'ٱللَّهُ — اللہ نے۔ اس مقام کی تفصیل متعلقہ لفظ کے صرف و نحو میں دیکھیے۔',
    },
    {
      id: 'broken-plural',
      titleUrdu: 'جمعِ تکسیر',
      explanationUrdu:
        'جمعِ تکسیر میں واحد کی بناوٹ اندر سے بدل جاتی ہے، جیسے عَبْدٌ سے عِبَادٌ اور قَلْبٌ سے قُلُوبٌ؛ اس کا اعراب عموماً واحد کی طرح حرکات سے ہوتا ہے۔ غیر عاقل چیزوں کی جمع کے لیے فعل، ضمیر اور صفت اکثر واحد مؤنث آتے ہیں، اور بعض اوزان غیر منصرف ہیں۔',
      exampleUrdu:
        'قُلُوبِهِمْ — ان کے دلوں کے۔ اس مقام کی تفصیل متعلقہ لفظ کے صرف و نحو میں دیکھیے۔',
    },
    {
      id: 'verbal-noun',
      titleUrdu: 'مصدر',
      explanationUrdu:
        'مصدر کسی کام یا کیفیت کا نام ہے، جیسے ذِكْرٌ «یاد کرنا»؛ یہ زمانہ یا فاعل کا شخص نہیں بتاتا۔ ثلاثی مجرد کے مصادر سماعی ہیں جبکہ مزید فیہ کے مصادر مقرر اوزان پر آتے ہیں، جیسے إِنْذَارٌ اور تَكْذِيبٌ؛ میم سے شروع ہونے والا مصدرِ میمی بھی ہوتا ہے، اور مصدر کبھی اپنے فعل کی طرح مفعول لیتا ہے۔',
      exampleUrdu:
        'سَمْعِهِمْ — ان کے کانوں کے۔ اس مقام کی تفصیل متعلقہ لفظ کے صرف و نحو میں دیکھیے۔',
    },
    {
      id: 'quoted-speech',
      titleUrdu: 'مقولۂ قول',
      explanationUrdu:
        'قَالَ اور اس کے صیغوں کے بعد جو بات نقل ہو وہ مقولۂ قول ہے؛ پورا جملہ مل کر قَالَ کا مفعول بہ اور محلِ نصب میں ہوتا ہے۔ اس جملے کی اپنی الگ ترکیب ہوتی ہے، اور اس کے شروع میں إِنَّ آئے تو اس کا ہمزہ مکسور رہتا ہے، أَنَّ نہیں بنتا۔',
      exampleUrdu: 'يَقُولُ — کہتے ہیں۔ اس مقام کی تفصیل متعلقہ لفظ کے صرف و نحو میں دیکھیے۔',
    },
    {
      id: 'kana',
      titleUrdu: 'كَانَ اور اس کے اخوات',
      explanationUrdu:
        'كَانَ اور اس کے اخوات، جیسے أَصْبَحَ، ظَلَّ، صَارَ، لَيْسَ اور مَا زَالَ، جملۂ اسمیہ پر آ کر اپنے اسم کو مرفوع اور خبر کو منصوب کرتے ہیں۔ یہ زمانہ، تبدیلی، نفی یا تسلسل کا مفہوم دیتے ہیں؛ كَانَ کے بعد مضارع ہو تو ماضی میں عادت یا جاری عمل کا معنی نکلتا ہے۔',
      exampleUrdu: 'وَمَا — اور نہیں۔ اس مقام کی تفصیل متعلقہ لفظ کے صرف و نحو میں دیکھیے۔',
    },
    {
      id: 'haal',
      titleUrdu: 'حال',
      explanationUrdu:
        'حال بتاتا ہے کہ عمل کے وقت فاعل، مفعول یا کسی اور معرفہ کی کیفیت کیا تھی؛ مفرد حال عموماً نکرہ اور منصوب ہوتا ہے، جیسے جَاءَ رَاكِبًا «سوار ہو کر آیا»۔ پورا جملہ بھی حال بنتا ہے، اکثر واوِ حالیہ یا لوٹنے والی ضمیر کے ساتھ، اور تب وہ محلِ نصب میں ہوتا ہے۔',
      exampleUrdu: 'وَمَا — اور نہیں۔ اس مقام کی تفصیل متعلقہ لفظ کے صرف و نحو میں دیکھیے۔',
    },
    {
      id: 'extra-particle',
      titleUrdu: 'حرفِ زائد',
      explanationUrdu:
        'کبھی کوئی حرف ترکیب میں نیا کردار ادا کیے بغیر صرف تاکید یا تقویت کے لیے آتا ہے، جیسے نفی کے بعد مِنْ (مَا جَاءَنَا مِنْ أَحَدٍ) یا لَيْسَ کی خبر پر بِ۔ ایسے حرف کے بعد کا اسم لفظاً مجرور مگر اپنے اصل کردار کے لحاظ سے محلاً مرفوع یا منصوب ہوتا ہے؛ مَا، لام اور فاء بھی کبھی زائد ہوتے ہیں۔',
      exampleUrdu:
        'بِمُؤْمِنِينَ — ایمان لانے والے۔ اس مقام کی تفصیل متعلقہ لفظ کے صرف و نحو میں دیکھیے۔',
    },
    {
      id: 'restriction',
      titleUrdu: 'حصر: إِنَّمَا اور إِلَّا',
      explanationUrdu:
        'حصر کسی بات کو ایک ہی چیز تک محدود کرتا ہے، جس کا اردو مفہوم «صرف، فقط، ہی» ہے۔ اس کے عام طریقے نفی کے بعد إِلَّا (مَا… إِلَّا، إِنْ… إِلَّا) اور إِنَّمَا ہیں؛ إِنَّمَا میں مَا کافہ إِنَّ کے عمل کو روک دیتا ہے، اس لیے بعد کا جملہ اپنے عام اعراب پر رہتا ہے۔',
      exampleUrdu: 'إِلَّآ — مگر۔ اس مقام کی تفصیل متعلقہ لفظ کے صرف و نحو میں دیکھیے۔',
    },
    {
      id: 'two-objects',
      titleUrdu: 'دو مفعول',
      explanationUrdu:
        'کچھ افعال اپنا معنی دو مفعولوں سے مکمل کرتے ہیں۔ أَعْطَى اور آتَى جیسے افعال میں ایک مفعول لینے والا اور دوسرا دی جانے والی چیز ہوتا ہے، جبکہ جَعَلَ اور ظَنَّ جیسے افعال میں دونوں مفعول اصل میں مبتدا اور خبر ہوتے ہیں۔',
      exampleUrdu:
        'فَزَادَهُمُ — پس زیادہ کیا ان کو / بڑھایا ان کو۔ اس مقام کی تفصیل متعلقہ لفظ کے صرف و نحو میں دیکھیے۔',
    },
    {
      id: 'masdar-particle',
      titleUrdu: 'حروفِ مصدریہ: أَنْ، أَنَّ، مَا',
      explanationUrdu:
        'أَنْ، أَنَّ اور مَا مصدریہ اپنے بعد کے جملے کو ایک مصدر کے حکم میں بدل دیتے ہیں، جسے مصدرِ مؤول کہتے ہیں، جیسے أُرِيدُ أَنْ أَتَعَلَّمَ یعنی «میں سیکھنا چاہتا ہوں»۔ یہ مصدر جملے میں فاعل، مفعول، مبتدا یا مجرور کا کردار ادا کرتا ہے؛ أَنْ مضارع کو نصب بھی دیتا ہے۔',
      exampleUrdu: 'بِمَا — بوجہ اس کے جو۔ اس مقام کی تفصیل متعلقہ لفظ کے صرف و نحو میں دیکھیے۔',
    },
    {
      id: 'condition',
      titleUrdu: 'إِذَا: ظرف اور شرط',
      explanationUrdu:
        'إِذَا مستقبل کے وقت کا ظرف ہے جو اکثر شرط کا مفہوم بھی رکھتا ہے: «جب ایسا ہو تو…»؛ اس کے بعد کا جملہ اس کا مضاف الیہ اور شرط ہوتا ہے، اور یہ فعل کو جزم نہیں دیتا۔ اس کے بعد ماضی بھی مستقبل کا معنی دیتا ہے، اور جوابِ شرط پر ضرورت ہو تو فاء آتی ہے۔',
      exampleUrdu: 'وَإِذَا — اور جب۔ اس مقام کی تفصیل متعلقہ لفظ کے صرف و نحو میں دیکھیے۔',
    },
    {
      id: 'prohibition',
      titleUrdu: 'نہی: لَا ناہیہ',
      explanationUrdu:
        'لَا ناہیہ ایسا حرف ہے جو مضارع کو مجزوم کر کے کسی کام سے روکتا ہے، جیسے لَا تَقُلْ «نہ کہو»؛ آخر میں سکون، نون کا حذف یا حرفِ علت کا حذف جزم کی علامت ہوتا ہے۔ اسے لَا نافیہ سے الگ رکھیں، جس کے بعد مضارع مرفوع رہتا ہے اور صرف خبر کی نفی ہوتی ہے۔',
      exampleUrdu: 'لَا — نہ۔ اس مقام کی تفصیل متعلقہ لفظ کے صرف و نحو میں دیکھیے۔',
    },
    {
      id: 'condition-answer',
      titleUrdu: 'جوابِ شرط اور فاءِ رابطہ',
      explanationUrdu:
        'شرطیہ جملے کا دوسرا حصہ جوابِ شرط ہے، جو بتاتا ہے کہ شرط پوری ہونے پر کیا ہوگا۔ جواب جملۂ اسمیہ، امر، نہی، قَدْ، سَ، سَوْفَ یا لَنْ وغیرہ سے شروع ہو تو اس پر فاء ضروری ہے، جسے فاءِ رابطہ کہتے ہیں؛ بعض اسمی جوابوں میں إِذَا فجائیہ اس فاء کی جگہ آتا ہے؛ کبھی جواب حذف ہوتا ہے اور سیاق اس پر دلالت کرتا ہے۔',
      exampleUrdu: 'قَالُوٓا۟ — وہ کہتے ہیں۔ اس مقام کی تفصیل متعلقہ لفظ کے صرف و نحو میں دیکھیے۔',
    },
    {
      id: 'lightened-particle',
      titleUrdu: 'مخففہ إِنْ، أَنْ اور لَٰكِنْ',
      explanationUrdu:
        'إِنَّ، أَنَّ اور لَٰكِنَّ کبھی تشدید کے بغیر إِنْ، أَنْ اور لَٰكِنْ پڑھے جاتے ہیں۔ مخففہ إِنْ کی خبر پر اکثر لامِ فارقہ آتا ہے جو اسے نافیہ إِنْ سے الگ کرتا ہے، مخففہ أَنْ کا اسم ضمیرِ شان مقدر ہوتا ہے، اور لَٰكِنْ عموماً عمل نہیں کرتا مگر استدراک کا معنی باقی رہتا ہے۔',
      exampleUrdu: 'وَلَـٰكِن — لیکن۔ اس مقام کی تفصیل متعلقہ لفظ کے صرف و نحو میں دیکھیے۔',
    },
    {
      id: 'imperative',
      titleUrdu: 'فعلِ امر',
      explanationUrdu:
        'فعلِ امر مخاطب سے کسی کام کا مطالبہ کرتا ہے؛ سیاق کے مطابق یہ حکم، دعا یا درخواست ہو سکتا ہے۔ یہ مبنی ہے: صحیح آخر پر سکون (اُكْتُبْ)، ناقص میں آخری حرفِ علت کا حذف (اُدْعُ) اور جمع میں نون کا حذف (اُكْتُبُوا)؛ واحد مذکر میں فاعل پوشیدہ أَنْتَ ہوتا ہے۔',
      exampleUrdu: 'ءَامِنُوا۟ — ایمان لے آؤ۔ اس مقام کی تفصیل متعلقہ لفظ کے صرف و نحو میں دیکھیے۔',
    },
    {
      id: 'interrogative',
      titleUrdu: 'استفہام',
      explanationUrdu:
        'سوال کے لیے حرف أَ اور هَلْ، اور اسم مَنْ، مَا، مَاذَا، أَيُّ، كَيْفَ، أَنَّى، مَتَى اور أَيْنَ آتے ہیں؛ استفہام کے اسم أَيُّ کے سوا مبنی ہیں اور جملے میں اپنا محلِ اعراب رکھتے ہیں۔ قرآن میں سوال اکثر معلومات مانگنے کے بجائے انکار، تعجب، ملامت یا اقرار کرانے کے لیے ہوتا ہے۔',
      exampleUrdu:
        'أَنُؤْمِنُ — کیاہم ایمان لائیں۔ اس مقام کی تفصیل متعلقہ لفظ کے صرف و نحو میں دیکھیے۔',
    },
    {
      id: 'adverb',
      titleUrdu: 'ظرف (مفعول فیہ)',
      explanationUrdu:
        'ظرف وہ اسم ہے جو عمل کا وقت یا جگہ بتاتا ہے، جیسے يَوْمًا، غَدًا، عِنْدَ، بَيْنَ اور تَحْتَ؛ معرب ظرف منصوب ہوتا ہے اور اکثر بعد کے اسم یا جملے کی طرف مضاف ہوتا ہے۔ حَيْثُ اور لَدُنْ جیسے بعض ظرف مبنی ہیں؛ ظرف اور جار و مجرور کسی فعل یا محذوف لفظ سے متعلق ہوتے ہیں۔',
      exampleUrdu:
        'مَعَكُمْ — تمہارے ساتھ ہیں۔ اس مقام کی تفصیل متعلقہ لفظ کے صرف و نحو میں دیکھیے۔',
    },
    {
      id: 'doubled',
      titleUrdu: 'مضاعف فعل',
      explanationUrdu:
        'جس فعل کے دوسرے اور تیسرے اصلی حروف ایک جیسے ہوں وہ مضاعف ہے، جیسے مَدَّ اور ظَنَّ؛ اکثر صیغوں میں دونوں حرف مدغم ہو کر تشدید بن جاتے ہیں، اور اس تشدید کو بابِ تفعیل کی علامت نہ سمجھیں۔ تُ اور نَا جیسی فاعلی ضمیروں سے پہلے ادغام کھل جاتا ہے، جیسے مَدَدْتُ۔',
      exampleUrdu:
        'وَيَمُدُّهُمْ — اور وہ ڈھیل دے رہا ہے ان کو۔ اس مقام کی تفصیل متعلقہ لفظ کے صرف و نحو میں دیکھیے۔',
    },
    {
      id: 'feminine-marker',
      titleUrdu: 'مؤنث کی علامات',
      explanationUrdu:
        'اسم میں مؤنث کی عام علامتیں گول تاء، الفِ مقصورہ اور الفِ ممدودہ ہیں، جیسے رَحْمَةٌ، الدُّنْيَا اور صَحْرَاءُ؛ أَرْضٌ اور نَارٌ جیسے بعض الفاظ بغیر علامت کے مؤنث ہیں۔ ماضی کے آخر کی ساکن تاء، جیسے قَالَتْ، صرف مؤنث فاعل کی علامت ہے، ضمیر نہیں؛ اسے تُ اور تَ والی فاعلی ضمیر سے الگ رکھیں۔',
      exampleUrdu:
        'رَبِحَت — فائدہ مند ہوئی / فائدہ دیا۔ اس مقام کی تفصیل متعلقہ لفظ کے صرف و نحو میں دیکھیے۔',
    },
    {
      id: 'lamma',
      titleUrdu: 'لَمَّا: جب',
      explanationUrdu:
        'لَمَّا اکثر «جب» کے معنی میں دو ماضی جملوں کو شرط اور جواب کی طرح جوڑتا ہے: پہلا واقعہ ہوا تو دوسرا ہوا۔ مضارع سے پہلے یہ جازم ہو کر «ابھی تک نہیں» کا معنی دیتا ہے، اور إِنْ نافیہ کے بعد بعض جگہ إِلَّا کے معنی میں حصر کرتا ہے۔',
      exampleUrdu: 'فَلَمَّآ — پھر جب۔ اس مقام کی تفصیل متعلقہ لفظ کے صرف و نحو میں دیکھیے۔',
    },
    {
      id: 'feminine-plural',
      titleUrdu: 'جمع مؤنث سالم',
      explanationUrdu:
        'جمع مؤنث سالم واحد کے آخر میں الف اور تاء کے اضافے سے بنتی ہے، جیسے جَنَّاتٌ اور الصَّالِحَاتُ۔ اس کا رفع ضمہ سے ہوتا ہے جبکہ نصب اور جر دونوں کسرہ سے؛ اس لیے حالتِ نصب میں بھی اس کے آخر میں کسرہ نظر آتا ہے۔',
      exampleUrdu: 'ظُلُمَـٰتٍۢ — اندھیروں۔ اس مقام کی تفصیل متعلقہ لفظ کے صرف و نحو میں دیکھیے۔',
    },
    {
      id: 'resembling-adjective',
      titleUrdu: 'صفتِ مشبہ',
      explanationUrdu:
        'صفتِ مشبہ کسی پائیدار خوبی یا حالت کو بتاتی ہے اور عموماً لازم فعل سے بنتی ہے، جیسے حَسَنٌ، كَرِيمٌ اور عَظِيمٌ، اور رنگ و عیب کے لیے أَفْعَلُ، جیسے أَخْضَرُ جس کا مؤنث خَضْرَاءُ ہے۔ اس کے اوزان سماعی ہیں؛ یہ اسمِ فاعل کی طرح وقتی عمل نہیں بلکہ ثابت صفت ظاہر کرتی ہے۔',
      exampleUrdu: 'صُمٌّۢ — بہرے ہیں۔ اس مقام کی تفصیل متعلقہ لفظ کے صرف و نحو میں دیکھیے۔',
    },
    {
      id: 'purpose-object',
      titleUrdu: 'مفعول لہ',
      explanationUrdu:
        'مفعول لہ ایک منصوب مصدر ہے جو عمل کا سبب یا مقصد بتاتا ہے اور «کیوں؟» کا جواب ہوتا ہے، جیسے قُمْتُ إِجْلَالًا لَهُ «میں اس کی تعظیم کے لیے کھڑا ہوا»۔ عموماً اس کا فاعل اور وقت اصل فعل والا ہی ہوتا ہے؛ ورنہ یہی معنی لام کے ذریعے ادا ہوتا ہے۔',
      exampleUrdu:
        'حَذَرَ — ڈرتے ہوئے / ڈر کر / بچنے کے لئے۔ اس مقام کی تفصیل متعلقہ لفظ کے صرف و نحو میں دیکھیے۔',
    },
    {
      id: 'kada-asa',
      titleUrdu: 'كَادَ اور عَسَى',
      explanationUrdu:
        'كَادَ «قریب تھا» اور عَسَى «امید ہے، ممکن ہے» افعالِ مقاربہ و رجا ہیں؛ ناقص استعمال میں یہ اسم کو رفع دیتے ہیں اور خبر عموماً مضارع کا جملہ ہوتی ہے۔ كَادَ کی خبر اکثر أَنْ کے بغیر اور عَسَى کی أَنْ کے ساتھ آتی ہے؛ عَسَى کبھی تامہ بھی ہوتا ہے، تب أَنْ والا مصدرِ مؤول اس کا فاعل ہوتا ہے۔ كَادَ پر نفی ہو تو کام بمشکل ہوا یا ہوا ہی نہیں۔',
      exampleUrdu: 'يَكَادُ — قریب ہے۔ اس مقام کی تفصیل متعلقہ لفظ کے صرف و نحو میں دیکھیے۔',
    },
    {
      id: 'law-condition',
      titleUrdu: 'لَوْ: فرضی شرط',
      explanationUrdu:
        'لَوْ «اگر ایسا ہوتا» عموماً ایسی شرط کے لیے آتا ہے جو واقع نہیں ہوئی، اس لیے جواب بھی واقع نہیں ہوتا؛ یہ فعل کو جزم نہیں دیتا۔ اس کے مثبت جواب پر اکثر لام آتا ہے، جیسے لَوْ جَاءَ لَأَكْرَمْتُهُ، اور لَوْ کے بعد أَنَّ بھی آتا ہے۔ وَلَوْ کبھی «اگرچہ» کے معنی میں آتا ہے؛ تب محذوف جواب ہر حال میں ثابت رہتا ہے۔',
      exampleUrdu: 'وَلَوْ — اوراگر۔ اس مقام کی تفصیل متعلقہ لفظ کے صرف و نحو میں دیکھیے۔',
    },
    {
      id: 'emphatic-lam',
      titleUrdu: 'لامِ تاکید',
      explanationUrdu:
        'مفتوح لام کئی جگہ تاکید کے لیے آتا ہے: مبتدا پر، إِنَّ کی خبر یا مؤخر اسم پر، جیسے إِنَّهُ لَحَقٌّ، جوابِ قسم اور جوابِ لَوْ پر، اور لَئِنْ میں شرط سے پہلے قسم کی تمہید کے لیے۔ یہ ترکیب اور اعراب نہیں بدلتا، صرف تاکید یا ربط بڑھاتا ہے؛ اسے لامِ جر، لامِ تعلیل اور لامِ امر سے الگ پہچانیں۔',
      exampleUrdu: 'لَذَهَبَ — ضرور لے جائے۔ اس مقام کی تفصیل متعلقہ لفظ کے صرف و نحو میں دیکھیے۔',
    },
  ],
  roots: {
    'ك ت ب': {
      meaningUrdu: 'لکھنا، تحریر، کتاب، لکھ کر محفوظ کرنا۔',
      noteUrdu:
        'كِتَاب لکھی ہوئی چیز ہے اور ان سورتوں میں اللہ کی نازل کردہ کتاب کے ساتھ اعمال کے نامے یا لکھے ہوئے نوشتے کے لیے بھی آیا ہے، اس لیے ترجمہ سیاق سے طے ہوتا ہے؛ فعل كَتَبَ کا مضارع اعمال کو لکھ کر محفوظ کرنے کے معنی میں ہے۔',
    },
    'ر ي ب': {
      meaningUrdu: 'شک، شبہ، تردد، دل کی بے اطمینانی۔',
      noteUrdu:
        'رَيْب ایسا شک ہے جس میں کھٹک یا بے اطمینانی بھی شامل ہو سکتی ہے۔ نفی کے ساتھ اس سے شک کی نفی ہوتی ہے اور فِي کے ساتھ کسی بات کے بارے میں شک میں ہونے کا مفہوم آتا ہے۔',
    },
    'ه د ي': {
      meaningUrdu: 'راہ دکھانا، رہنمائی کرنا، ہدایت پانا، سیدھی راہ پر چلنا۔',
      noteUrdu:
        'هَدَى راہ دکھانا اور هُدًى ہدایت ہے۔ مُهْتَدٍ بابِ افتعال سے ہدایت پانے والا ہے۔ سورۂ کہف میں معرفہ مُهْتَد کی آخری یاء رسم و قراءتِ حفص میں محذوف ہے۔ سورۂ اعراف میں اسی معرفہ صیغے کی یاء لکھی اور پڑھی جاتی ہے۔',
    },
    'و ق ي': {
      meaningUrdu: 'بچانا، حفاظت کرنا، اپنا بچاؤ کرنا، اللہ سے ڈر کر پرہیز کرنا۔',
      noteUrdu:
        'اِتَّقَى بابِ افتعال میں اپنے آپ کو کسی نقصان دہ چیز سے بچانا ہے؛ جب تعلق اللہ سے ہو تو مراد اس کے احکام مان کر اور نافرمانی چھوڑ کر اس کی پکڑ سے بچنا ہے، اور تَقْوَى اسی خاندان سے ہے۔ مادے کی پہلی واو تاء بن کر باب کی تاء میں مدغم ہو گئی ہے اور آخری یاء تَتَّقُونَ جیسے صیغوں میں گر جاتی ہے۔',
    },
    'أ م ن': {
      meaningUrdu: 'امن، اطمینان، بھروسا، تصدیق اور ایمان، امانت۔',
      noteUrdu:
        'آمَنَ (بابِ افعال) ایمان لانا اور تصدیق کرنا ہے، مُؤْمِن ایمان والا، إِيمَان اس کا مصدر، اور أَمَانَات امانتیں ہیں؛ یہی فعل کہیں امن دینے کے معنی میں بھی آتا ہے۔ آمَنَ کا «آ» دو ہمزوں سے بنا ہے، جبکہ يُؤْمِنُ اور مُؤْمِن میں مادے کا ہمزہ واو کی کرسی پر اور إِيمَان میں یاء کی صورت میں ہے؛ یہ واو اور یاء اصلی حرف نہیں۔',
    },
    'غ ي ب': {
      meaningUrdu: 'غائب ہونا، نظروں سے اوجھل ہونا، غیب۔',
      noteUrdu:
        'غَيْب وہ ہے جو آنکھوں اور حواس سے چھپا ہو؛ اللہ کو غیب کا جاننے والا کہا گیا ہے اور آسمانوں اور زمین کا غیب اسی کے لیے خاص ہے۔ بِٱلْغَيْبِ سیاق کے مطابق «بن دیکھے» کا مفہوم دیتا ہے، جیسے بن دیکھے اٹکل لگانا؛ اللہ سے ڈرنے کے بیان میں اس سے اللہ کو دیکھے بغیر ڈرنا بھی مراد لیا گیا ہے اور لوگوں سے چھپ کر تنہائی میں ڈرنا بھی۔',
    },
    'ق و م': {
      meaningUrdu: 'کھڑا ہونا، قائم ہونا اور قائم کرنا، سیدھا ہونا، لوگوں کی جماعت۔',
      noteUrdu:
        'قَوْم (لوگوں کی جماعت)، قِيَامَة (قیامت)، قَامَ (کھڑا ہوا)، أَقَامَ (سیدھا یا قائم کیا)، مَقَام (کھڑے ہونے کی جگہ یا موقع)، قَائِمَة (قائم ہونے والی) اور قَيِّم و مُسْتَقِيم (سیدھا) اسی مادے سے ہیں۔ یہ اجوف واوی ہے؛ اصل واو اعلال سے قَامَ میں الف اور نُقِيمُ و مُسْتَقِيم میں یاء بن گئی ہے۔',
    },
    'ص ل و': {
      meaningUrdu: 'صَلَاة اور عبادت کی نماز سے متعلق لغوی خاندان۔',
      noteUrdu:
        'صَلَاة نماز ہے اور صَلَوَات اس کی جمع۔ اس درجہ بندی میں آخری اصلی حرف واو ہے جو جمع صَلَوَات میں ظاہر ہوتا ہے۔ صَلَّى يُصَلِّي نماز ادا کرنا ہے۔ اسے ص ل ي کے آگ میں داخل ہونے والے مادے سے نہ ملائیں۔',
    },
    'ر ز ق': {
      meaningUrdu: 'روزی دینا، رزق عطا کرنا، عطا کی ہوئی روزی۔',
      noteUrdu:
        'رَزَقَ (يَرْزُقُ) روزی یا کوئی نعمت عطا کرنا ہے، اور رِزْق وہ عطا کی ہوئی چیز ہے جو سیاق کے مطابق کھانا بھی ہو سکتی ہے اور ہر طرح کی نعمت بھی۔ رَازِقِين، رَازِق یعنی روزی دینے والے کی جمع ہے، جو اسمِ فاعل ہے۔',
    },
    'ن ف ق': {
      meaningUrdu: 'خرچ کرنا، کسی چیز کا ختم ہو کر نکل جانا، سرنگ اور چھپا راستہ۔',
      noteUrdu:
        'ان سورتوں میں اس مادے سے صرف أَنْفَقَ / يُنْفِقُ آیا ہے، جو بابِ افعال میں مال خرچ کرنا ہے، اور اس کے ماضی، مضارع اور امر تینوں صیغے موجود ہیں۔ نِفَاق اور مُنَافِق بھی اسی مادے سے ہیں، مگر خرچ کرنے کے معنی میں دو رخی کا کوئی مفہوم شامل نہیں۔',
    },
    'ن ز ل': {
      meaningUrdu: 'اترنا، اتارنا، پڑاؤ اور ٹھکانا، مہمانی۔',
      noteUrdu:
        'أَنْزَلَ (بابِ افعال) اور تَنْزِيل (بابِ تفعیل کا مصدر) اتارنے کے لیے آئے ہیں، خصوصاً کتاب اور بارش کے؛ مُنْزِل اتارنے یا ٹھہرانے والا، مُنْزَل اترنے کی جگہ اور مَنَازِل منزلیں ہیں۔ نُزُل مہمان کے لیے تیار کی گئی مہمانی ہے، اور بعض مفسرین نے اس سے ٹھکانا مراد لیا ہے؛ مُنْزَل اور مُنْزِل میں فرق صرف زای کی حرکت کا ہے۔',
    },
    'ق ب ل': {
      meaningUrdu: 'سامنے ہونا، رخ کرنا، قبول کرنا، کسی چیز سے پہلے ہونا۔',
      noteUrdu:
        'قَبْل زمانے یا ترتیب میں پہلے ہے۔ أَقْبَلَ رخ کرنا، قَبِلَ قبول کرنا اور قِبْلَة رخ یا سمت ہے۔ قَبِيل ساتھ کی جماعت یا قبیلہ ہو سکتا ہے۔ ان استعمالات کا معنی لفظ کی حرکت اور سیاق سے طے کریں۔',
    },
    'أ خ ر': {
      meaningUrdu: 'پیچھے ہونا، مؤخر ہونا، دوسرا، آخری۔',
      noteUrdu:
        'آخَر (خاء پر زبر) «دوسرا» اور آخِر (خاء پر زیر) «آخری» ہے، اور الْآخِرَة اسی آخِر کی مؤنث بن کر آخرت کے لیے آتی ہے؛ يَسْتَأْخِرُ (بابِ استفعال) پیچھے رہنا یا مؤخر ہونا ہے۔ ان سب میں «بعد میں ہونا» کا بنیادی مفہوم مشترک ہے، اسی لیے آخَر اور آخِر آسانی سے گڈمڈ ہو جاتے ہیں؛ انہیں خاء کی زبر اور زیر سے الگ پہچانیں۔',
    },
    'ي ق ن': {
      meaningUrdu: 'یقین کرنا، ایسا پختہ علم جس میں شک نہ رہے۔',
      noteUrdu:
        'أَيْقَنَ بابِ افعال میں کسی بات کا ایسا یقین کرنا ہے جس میں شک باقی نہ رہے؛ يُوقِنُ اس کا مضارع اور مُوقِن اس کا اسمِ فاعل ہے۔ ان دونوں میں نظر آنے والی واو دراصل مادے کی یاء ہے جو ضمہ کے بعد واو بن گئی، اس لیے مادہ ي ق ن ہی ہے۔',
    },
    'ر ب ب': {
      meaningUrdu: 'مالک و آقا ہونا، پرورش و نگہداشت کرنا، امور سنبھالنا۔',
      noteUrdu:
        'رَبّ اسم ہے اور زیادہ تر ضمیر کے ساتھ آیا ہے؛ «میرا، ہمارا، تم دونوں کا» جیسی نسبت ضمیر سے بنتی ہے، مادے سے نہیں، جیسے رَبِّكُمَا میں تثنیہ کی ضمیر سے جن و انس دونوں کو خطاب ہے۔ ندا میں رَبِّ (اے میرے رب) کی آخری کسرہ حذف شدہ یائے متکلم کی علامت ہے۔',
    },
    'ف ل ح': {
      meaningUrdu: 'کامیاب ہونا، مراد کو پہنچنا، فلاح اور نجات۔',
      noteUrdu:
        'أَفْلَحَ بابِ افعال میں کامیاب ہونا اور مراد کو پہنچنا ہے، اور مُفْلِح اسی کا اسمِ فاعل، یعنی کامیاب ہونے والا ہے۔ بابِ افعال ہونے کے باوجود یہ فعل لازم ہے: اس کا معنی «کامیاب ہوا» ہے، «کامیاب کیا» نہیں۔',
    },
    'ك ف ر': {
      meaningUrdu: 'ڈھانپنا، چھپانا، انکار کرنا، ناشکری کرنا۔',
      noteUrdu:
        'كَفَرَ ایمان سے انکار یا نعمت کی ناشکری کے لیے آتا ہے؛ اس کا مصدر كُفْر اور اسمِ فاعل كَافِر ہے، جس کی جمعِ مذکر سالم رفع میں كَافِرُون اور نصب و جر میں كَافِرِين آئی ہے، جبکہ لغوی اصل ڈھانپنا ہے۔ أَكَفَرْتَ میں ابتدائی ہمزہ استفہام کا ہے، بابِ افعال کا نہیں۔',
    },
    'س و ي': {
      meaningUrdu:
        'برابر ہونا، ہموار اور درست کرنا، ٹھیک ٹھیک بنانا، بلند ہو کر جم جانا، یکساں ہونا۔',
      noteUrdu:
        'سَوَّى (بابِ تفعیل) ٹھیک ٹھیک بنانا، سَاوَى (بابِ مفاعلہ) برابر کرنا اور سَوَاء یکساں ہے؛ اِسْتَوَى بابِ افتعال ہے، استفعال نہیں، اور برابر ہونے، سوار ہو کر جم جانے یا عرش پر ایسے استواء کے لیے آتا ہے جو اللہ کی شان کے لائق اور مخلوق کی مشابہت سے پاک ہے۔ یہ لفیف مقرون مادہ ہے؛ آخری یاء ماضی میں الف مقصورہ لکھی جاتی ہے اور سَوَاء میں ہمزہ بن گئی ہے۔',
    },
    'ن ذ ر': {
      meaningUrdu: 'خبردار کرنا، برے انجام سے ڈرانا، نذر و منت۔',
      noteUrdu:
        'أَنْذَرَ بابِ افعال میں خبردار کرنا ہے، اور مُنْذِر اور نَذِير خبردار کرنے والے کے لیے آتے ہیں۔ نَذْر کسی عمل کی منت یا نذر ہے۔ نُذُور اسی کی جمع ہے۔',
    },
    'خ ت م': {
      meaningUrdu: 'مہر لگانا، بند کرنا، کسی چیز کو آخر تک پہنچا کر ختم کرنا۔',
      noteUrdu:
        'خَتَمَ کسی چیز پر مہر لگا کر اسے بند کر دینا ہے، اور اسی خاندان میں کسی کام کو پورا کر کے ختم کرنے کا معنی بھی ہے۔ نَخْتِمُ میں ابتدائی نون مضارع کی علامت ہے، یعنی «ہم»؛ یہ مادے کا حرف نہیں۔',
    },
    'أ ل ه': {
      meaningUrdu: 'معبود، عبادت، الوہیت۔',
      noteUrdu:
        'إِلَٰه معبود ہے اور آلِهَة اس کی جمع؛ ٱللَّه اللہ تعالیٰ کا خاص نام (اسمِ علم) ہے۔ لفظِ جلالہ کو أ ل ه کے تحت رکھنا لغوی فہرست کی نسبت ہے، اشتقاق کا قطعی فیصلہ نہیں، کیونکہ اس کے اشتقاق میں مختلف اقوال ہیں۔',
    },
    'ق ل ب': {
      meaningUrdu: 'پلٹنا، الٹنا پلٹنا، رخ پھیرنا، دل۔',
      noteUrdu:
        'قَلْب (جمع قُلُوب) دل اور باطن کے لیے آتا ہے، اور بابِ تفعیل کا قَلَّبَ بار بار الٹنا پلٹنا ہے، جیسے کروٹیں بدلوانا یا حسرت سے ہتھیلیاں پلٹنا۔ مُنْقَلَب بابِ انفعال سے اسمِ مفعول کے وزن پر ہے اور لوٹنے کی جگہ یا انجام کا معنی دیتا ہے۔',
    },
    'س م ع': {
      meaningUrdu: 'سننا، کان لگانا، بات قبول کرنا، سننے کی قوت۔',
      noteUrdu:
        'سَمِعَ سننا یا کان لگانا، سَمْع اس کا مصدر یعنی سننا اور سننے کی قوت، اور أَسْمَعَ (بابِ افعال) سنانا ہے۔ أَسْمِعْ تعجب کے وزن أَفْعِلْ بِهِ پر ہے، یعنی وہ کیا ہی خوب سننے والا ہے؛ امر کی شکل دیکھ کر اسے سنانے کا حکم نہ سمجھیں۔',
    },
    'ب ص ر': {
      meaningUrdu: 'دیکھنا، بینائی، نگاہ، آنکھ، دل کی بصیرت۔',
      noteUrdu:
        'أَبْصَرَ بابِ افعال میں دیکھنا ہے، اور أَبْصَار، بَصَر (بینائی، آنکھ) کی جمع ہے؛ دونوں کا ابتدائی ہمزہ زائد ہے، مادے کا حرف نہیں۔ أَبْصِرْ امر کی صورت میں تعجب کا صیغہ (أَفْعِلْ بِهِ) ہے، یعنی «وہ کیا خوب دیکھنے والا ہے!»، حکم نہیں۔',
    },
    'غ ش و': {
      meaningUrdu: 'ڈھانپ لینا، چھا جانا، پردہ ڈال دینا۔',
      noteUrdu:
        'غَشِيَ چھا جانے یا ڈھانپ لینے کو کہتے ہیں اور غِشَاوَة پردہ ہے۔ غَاشِيَة قیامت کا وصفی نام ہے، جس کی ہولناکی سب کو اپنی لپیٹ میں لے گی۔ آخری اصلی واو غِشَاوَة میں ظاہر ہے اور غَشِيَ میں یاء کی صورت میں آتی ہے۔',
    },
    'ع ذ ب': {
      meaningUrdu: 'خوش گوار اور میٹھا پانی، عذاب دینا اور سزا۔',
      noteUrdu:
        'عَذْب میٹھے یا خوش گوار پانی کی صفت ہے۔ عَذَّبَ سزا دینا اور عَذَاب سزا یا تکلیف کے لیے آتا ہے۔ دونوں استعمالات کو لفظ کے وزن اور سیاق سے الگ پہچانیے۔',
    },
    'ع ظ م': {
      meaningUrdu: 'ہڈی، بڑا ہونا، عظمت اور بزرگی۔',
      noteUrdu:
        'عَظِيم صفت ہے، یعنی بڑا یا عظمت والا۔ عِظَام، عَظْم یعنی ہڈی کی جمع ہے۔ عَظِيم کی جمع بھی اسی وزن پر آ سکتی ہے، اس لیے سیاق سے دیکھیں کہ بڑائی مراد ہے یا ہڈیاں۔',
    },
    'ن و س': {
      meaningUrdu: 'لوگ، انسان، انسانوں کا گروہ۔',
      noteUrdu:
        'ان سورتوں میں اس مادے سے صرف اَلنَّاس آیا ہے، یعنی لوگ اور انسان، اور یہ جمع کا معنی رکھنے والا اسم ہے۔ اسے ن و س کے تحت رکھنا لغوی اشاریہ ہے، قطعی اشتقاق نہیں: اہلِ لغت کے اس میں مختلف اقوال ہیں اور بعض اسے أُنَاس (مادہ أ ن س) سے مانتے ہیں، اس لیے مادے سے الگ معنی نہ نکالیں۔',
    },
    'ق و ل': {
      meaningUrdu: 'کہنا، بات کرنا، قول۔',
      noteUrdu:
        'قَالَ (کہا)، يَقُولُ (کہتا ہے)، امر قُلْ (کہو)، مجہول قِيلَ (کہا گیا)، مصدر قَوْل (بات) اور اسمِ فاعل قَائِل (کہنے والا) سب اسی مادے سے ہیں۔ یہ اجوف واوی ہے: اصل واو قَالَ میں الف، قِيلَ میں یاء اور قَائِل میں ہمزہ بنتی ہے اور قُلْ میں حذف ہو جاتی ہے؛ اسے ق ل کا دو حرفی مادہ نہ سمجھیں۔',
    },
    'ي و م': {
      meaningUrdu: 'دن؛ سیاق کے لحاظ سے کوئی وقت یا مدت۔',
      noteUrdu:
        'يَوْم دن یا کوئی وقت اور مدت ہے اور کثرت سے قیامت کے دن کے لیے آتا ہے؛ الْيَوْمَ کا معنی «آج» یا «اس دن» ہوتا ہے۔ منصوب يَوْمَ کے بعد مضاف الیہ کوئی اسم ہو تو ترجمہ «قیامت کے دن» کی طرح ہوتا ہے، اور اس کے بعد پورا جملہ ہو تو «جس دن»۔ جمع أَيَّام کی مشدد یاء میں مادے کی واو یاء بن کر مدغم ہو گئی ہے۔',
    },
    'خ د ع': {
      meaningUrdu:
        'دھوکا دینا؛ دل کی بات چھپا کر اور اس کے خلاف ظاہر کر کے کسی کو نقصان پہنچانا یا اس کے ارادے سے پھیرنا۔',
      noteUrdu:
        'يُخَادِعُونَ بابِ مفاعلہ کا مضارع ہے، یعنی منافق دھوکا دینے کی کوشش کرتے ہیں؛ جبکہ خَادِع ثلاثی مجرد خَدَعَ کا اسمِ فاعل ہے (بابِ مفاعلہ کا اسمِ فاعل مُخَادِع ہوتا ہے)۔ جب خَادِع اللہ کے لیے آئے تو مفسرین کے نزدیک مراد یہ ہے کہ وہ ان کے دھوکے کا بدلہ دیتا اور اسے انہی پر لوٹا دیتا ہے؛ اسے مذموم فریب کے معنی میں نہ لیں۔',
    },
    'ن ف س': {
      meaningUrdu: 'جان، ذات، شخص، خود، سانس۔',
      noteUrdu:
        'نَفْس اور اس کی جمع أَنْفُس جان اور شخص کے لیے بھی آتی ہیں اور ضمیر کے ساتھ «خود، اپنے آپ» کے معنی میں بھی، جیسے نَفْسَكَ یعنی اپنے آپ کو؛ اس لیے ہر جگہ «روح» ترجمہ نہ کریں۔ یہ لفظ عموماً مؤنث استعمال ہوتا ہے، اور أَنْفُس کا ہمزہ جمع کے وزن أَفْعُل کا ہے۔',
    },
    'ش ع ر': {
      meaningUrdu: 'باریک ادراک، محسوس کرنا اور جاننا، خبردار کرنا، شاعری، بال، نشانی۔',
      noteUrdu:
        'شَعَرَ (مضارع يَشْعُرُ) کسی بات کا احساس یا ادراک ہونا، أَشْعَرَ (بابِ افعال) کسی کو خبردار کرنا اور شِعْر شاعری ہے؛ يُشْعِرَنَّ کی آخری نون تاکید کی ہے۔ شِعْر (شین پر زیر) شاعری اور شَعْر (شین پر زبر) بال ہے؛ شین کی حرکت سے دونوں میں فرق کریں۔',
    },
    'م ر ض': {
      meaningUrdu: 'بیمار ہونا، بیماری، صحت کا بگڑ جانا۔',
      noteUrdu:
        'مَرْضَى، مَرِيض (بیمار) کی جمعِ تکسیر ہے جس کے آخر میں الفِ مقصورہ ہے، اس لیے اس پر اعراب ظاہر نہیں ہوتا بلکہ مقدر رہتا ہے۔ یہ اسم ہے، فعل نہیں۔',
    },
    'ز ي د': {
      meaningUrdu: 'بڑھنا، بڑھانا، اضافہ کرنا، زیادتی۔',
      noteUrdu:
        'زَادَ (يَزِيدُ) اجوف یائی فعل ہے، جو لازم ہو تو بڑھنا اور متعدی ہو تو بڑھانا ہے، اور زِدْنَا جیسے صیغوں میں اس کی درمیانی یاء گر جاتی ہے۔ اِزْدَادَ بابِ افتعال میں مزید بڑھ جانا ہے؛ اس میں زاء کے بعد والی دال افتعال کی تاء سے بدلی ہوئی ہے، جبکہ آخری دال مادے کی ہے۔',
    },
    'أ ل م': {
      meaningUrdu: 'درد، تکلیف، دکھ پہنچانا۔',
      noteUrdu:
        'أَلِيم فَعِيل کے وزن پر صفت ہے: دردناک، یعنی تکلیف پہنچانے والا، اور اکثر عَذَاب کی صفت بن کر آتا ہے۔ بعض سورتوں کے شروع میں آنے والے حروفِ مقطعات الٓمٓ کا اس مادے سے کوئی تعلق نہیں؛ ان کی مراد اللہ ہی بہتر جانتا ہے۔',
    },
    'ك و ن': {
      meaningUrdu: 'ہونا، وجود میں آنا، واقع ہونا۔',
      noteUrdu:
        'كَانَ عموماً فعلِ ناقص ہے جو اسم کو رفع اور خبر کو نصب دیتا ہے، مگر كُن فَيَكُونُ میں تامہ ہو کر «وجود میں آنا» کا معنی دیتا ہے، اور اللہ کی صفات کے ساتھ صرف ماضی نہیں بلکہ دوام بتاتا ہے۔ اجوف واوی ہونے سے واو كَانَ میں الف بنتی اور كُنْ و تَكُنْ میں حذف ہوتی ہے؛ درج تجزیے میں مَكَانَة (جگہ، حالت) کی میم زائد ہے، مگر بعض اہلِ لغت اسے م ك ن سے مانتے ہیں۔',
    },
    'ك ذ ب': {
      meaningUrdu: 'جھوٹ، خلافِ واقعہ کہنا، جھٹلانا۔',
      noteUrdu:
        'ثلاثی مجرد كَذَبَ خود جھوٹ بولنا ہے اور اسی سے كَذِب (جھوٹ) اور كَاذِب (جھوٹا) ہیں؛ بابِ تفعیل کا كَذَّبَ کسی کو یا کسی بات کو جھوٹا قرار دینا، یعنی جھٹلانا ہے، اور ان سورتوں میں زیادہ تر یہی آیا ہے۔ تُكَذِّبَانِ میں الف تثنیہ کی ضمیرِ فاعل ہے، یعنی خطاب دو کے لیے ہے۔',
    },
    'ف س د': {
      meaningUrdu: 'بگڑنا، خراب ہونا، فساد اور بگاڑ پیدا کرنا۔',
      noteUrdu:
        'فَسَدَ ثلاثی مجرد میں خود بگڑ جانا ہے، جبکہ أَفْسَدَ بابِ افعال میں بگاڑ پیدا کرنا؛ مُفْسِد اسی کا اسمِ فاعل، یعنی فساد پھیلانے والا ہے۔ لازم اور متعدی معنی کا یہ فرق باب سے پہچانیں۔',
    },
    'أ ر ض': {
      meaningUrdu: 'زمین، سرزمین، خطۂ زمین۔',
      noteUrdu:
        'أَرْض پوری زمین یا کسی خاص سرزمین اور علاقے کے لیے آتا ہے اور اکثر آسمانوں کے مقابل ذکر ہوتا ہے، اس لیے سیاق سے معنی طے کریں۔ یہ مؤنثِ سماعی ہے، اگرچہ اس میں تاءِ تانیث نہیں۔',
    },
    'ص ل ح': {
      meaningUrdu: 'درست ہونا، ٹھیک ہونا، نیک ہونا، اصلاح کرنا۔',
      noteUrdu:
        'صَالِح اسمِ فاعل ہے: نیک یا درست؛ کہیں شخص کی صفت ہے اور اکثر عَمِلَ یا عَمَل کے ساتھ نیک عمل کے معنی میں۔ الصَّالِحَات اس کی جمع مؤنث ہے اور ان سورتوں میں نیک اعمال کے لیے آیا ہے۔',
    },
    'س ف ه': {
      meaningUrdu: 'کم عقلی، نادانی، بے وقوفی؛ عقل کا ہلکا پن۔',
      noteUrdu:
        'سَفِيه اس کم عقل اور ناسمجھ کو کہتے ہیں جو اپنا مال یا معاملہ درست طریقے سے نہ سنبھال سکے، سُفَهَاء اس کی جمعِ تکسیر ہے، اور سَفَاهَة فعل سَفُهَ کا مصدر یعنی نادانی اور بے وقوفی ہے۔ سُفَهَاء کے آخر کا ہمزہ فُعَلَاء کے وزن کا حصہ ہے، مادے کا حرف نہیں۔',
    },
    'ع ل م': {
      meaningUrdu: 'جاننا، علم، سکھانا، علامت اور نشان۔',
      noteUrdu:
        'عَلِمَ جاننا اور بابِ تفعیل کا عَلَّمَ سکھانا ہے؛ عِلْم، عَالِم، عَلِيم اور اسمِ تفضیل أَعْلَم یعنی سب سے زیادہ جاننے والا اسی خاندان سے ہیں، اور ان سورتوں میں أَعْلَم ہر جگہ یہی اسم ہے، فعلِ مضارع «میں جانتا ہوں» نہیں۔ عَالَمِين کا معنی «جہان» ہے، «جاننے والے» نہیں، اور عَلَم کی جمع أَعْلَام سے بلند پہاڑ مراد ہیں، جو دور سے نشان کا کام دیتے ہیں۔',
    },
    'ل ق ي': {
      meaningUrdu: 'ملنا، ملاقات کرنا، ڈالنا یا پھینکنا۔',
      noteUrdu:
        'لَقِيَ کسی سے ملنا اور لِقَاء ملاقات ہے۔ ٱلْتَقَى باہم ملنے کے لیے آتا ہے۔ بابِ افعال میں أَلْقَى کسی چیز کو ڈالنا یا پھینکنا ہے اور يُلْقَى اس کا مضارع مجہول ہے۔',
    },
    'خ ل و': {
      meaningUrdu: 'خالی ہونا، تنہا ہونا؛ گزر جانا، پہلے ہو چکنا۔',
      noteUrdu:
        'خَلَتْ، خَلَا کا ماضی واحد مؤنث غائب ہے: «(امتیں) جو گزر چکیں»؛ خالی ہونے کے معنی سے زمانے اور قوموں کے گزر جانے کا معنی نکلا ہے۔ یہ ناقص واوی مادہ ہے؛ خَلَا کا آخری الف ساکن تاءِ تانیث سے ملنے پر حذف ہو گیا، اس لیے خَلَتْ میں تیسرا حرف نظر نہیں آتا۔',
    },
    'ش ط ن': {
      meaningUrdu: 'شیطان، ہر سرکش اور گمراہ کرنے والی ہستی، شیاطین۔',
      noteUrdu:
        'شَيْطَان اور اس کی جمع شَيَاطِين اس مادے کے تحت لغوی اشاریے کے طور پر درج ہیں؛ واحد معرفہ عموماً ابلیس کے لیے آتا ہے۔ اس کے اشتقاق میں مختلف لغوی اقوال ہیں، اس لیے یہ اندراج کسی ایک اشتقاق کا قطعی فیصلہ نہیں۔',
    },
    'ه ز أ': {
      meaningUrdu: 'مذاق اڑانا، ٹھٹھا کرنا، تمسخر۔',
      noteUrdu:
        'هُزُو مذاق اور تمسخر ہے اور بابِ استفعال کا اِسْتَهْزَأَ کسی کا مذاق اڑانا؛ ان سورتوں میں دونوں اللہ کی آیات اور رسولوں کا مذاق اڑانے کے بیان میں آئے ہیں۔ روایتِ حفص میں هُزُوًا کی واو اصل ہمزہ کی جگہ آئی ہے، اس لیے مادہ ه ز أ ہی ہے، اور اِسْتَهْزَأَ کی س اور ت زائد ہیں۔',
    },
    'م د د': {
      meaningUrdu: 'کھینچنا، پھیلانا، بڑھانا، رسد اور کمک پہنچانا۔',
      noteUrdu:
        'مِدَاد روشنائی، مَدَد مزید رسد یا اضافہ، اور أَمَدَّ (بابِ افعال) کسی کو مال و اولاد جیسی چیزیں پے در پے دیتے جانا ہے۔ یہ مضاعف مادہ ہے، اس لیے مضارع يُمِدُّ میں دونوں دال ایک مشدد دال بن گئے ہیں؛ عربی مَدَد کو صرف اردو «مدد» کے معنی میں نہ لیں۔',
    },
    'ط غ ي': {
      meaningUrdu: 'حد سے بڑھنا، سرکشی اور باطل معبود۔',
      noteUrdu:
        'طَغَى يَطْغَى حد سے گزرنا ہے اور طُغْيَان سرکشی۔ طَاغُوت سرکش باطل پیشوا یا معبود کے لیے آتا ہے۔ تَطْغَوْا جیسے صیغوں میں مادے کی آخری یاء واوِ جماعت سے پہلے حذف ہوتی ہے۔',
    },
    'ع م ه': {
      meaningUrdu: 'حیرانی میں بھٹکنا، سرگرداں رہنا، دل کی بے بصیرتی۔',
      noteUrdu:
        'يَعْمَهُونَ مضارع ہے، یعنی وہ گمراہی میں حیران و سرگرداں بھٹکتے رہتے ہیں؛ لغت میں عَمَه دل کی بے بصیرتی کو کہتے ہیں۔ اسے آنکھ کے اندھے پن کے معنی والے مادے ع م ي سے نہ ملائیں؛ تیسرا اصلی حرف ہاء ہے۔',
    },
    'ش ر ي': {
      meaningUrdu: 'خریدنا، بیچنا، سودا کرنا؛ کسی چیز کے بدلے دوسری لے لینا یا دے دینا۔',
      noteUrdu:
        'شَرَى بعض قرآنی استعمالات میں بیچنے کے لیے آتا ہے۔ اِشْتَرَى عموماً خریدنے یا ایک چیز کے عوض دوسری لینے کو کہتے ہیں۔ دونوں میں لین دین کا مفہوم ہے اور یہ فیصلہ سیاق سے ہوتا ہے کہ کس چیز کو چھوڑا اور کس کو لیا گیا۔',
    },
    'ض ل ل': {
      meaningUrdu: 'راہ سے بھٹکنا، گم ہو جانا، ضائع یا بے نتیجہ ہونا، گمراہ کرنا۔',
      noteUrdu:
        'ضَلَّ بھٹکنا یا گم اور ضائع ہونا ہے؛ أَضَلَّ (بابِ افعال) گمراہ کرنا، مُضِلّ گمراہ کرنے والا، ضَالّ بھٹکا ہوا اور ضَلَال گمراہی ہے۔ مادہ مضاعف ہے: ضَلَلْنَا اور يُضْلِلْ میں دونوں لام الگ ظاہر ہیں، جبکہ ضَلَّ میں ایک مشدد لام بن جاتے ہیں۔',
    },
    'ر ب ح': {
      meaningUrdu: 'تجارت میں نفع ہونا، فائدہ، منافع۔',
      noteUrdu:
        'رَبِحَ کا بنیادی مفہوم سودے میں اصل سرمائے سے زیادہ پانا ہے؛ رِبْح نفع کو کہتے ہیں۔ قرآن میں یہ تجارت کی تشبیہ کے ساتھ آتا ہے، جہاں سودا نفع نہ دے تو گھاٹے کا مفہوم نکلتا ہے۔',
    },
    'ت ج ر': {
      meaningUrdu: 'تجارت، خرید و فروخت، کاروبار۔',
      noteUrdu:
        'تِجَارَة اسم ہے، یعنی نفع کے لیے خرید و فروخت اور کاروبار؛ یہاں یہ باہمی رضامندی سے ہونے والے جائز لین دین کے لیے آیا ہے۔ قرآن میں یہ لفظ بعض جگہ ایمان اور نیک عمل کے نفع بخش سودے کے لیے مجازاً بھی آتا ہے۔',
    },
    'م ث ل': {
      meaningUrdu: 'مشابہ ہونا، مانند و ہم مثل، مثال اور تمثیل۔',
      noteUrdu:
        'مِثْل مانند اور ہم مثل کے لیے آتا ہے۔ عام مشابہت مراد ہو تو یہ ضمیر کی طرف اضافت کے باوجود نکرہ رہ سکتا ہے۔ مَثَل مثال، تمثیل یا بیان کی جانے والی نظیر ہے۔',
    },
    'و ق د': {
      meaningUrdu: 'آگ کا بھڑکنا، آگ جلانا، ایندھن۔',
      noteUrdu:
        'أَوْقَدَ بابِ افعال میں آگ جلانا یا بھڑکانا ہے، اور تُوقِدُونَ اسی کا مضارع ہے، جس میں واو مادے کا پہلا حرف ہے۔ اسی خاندان سے وَقُود، یعنی ایندھن، بھی آتا ہے۔',
    },
    'ن و ر': {
      meaningUrdu: 'روشنی، چمک اور آگ۔',
      noteUrdu:
        'نُور روشنی ہے اور نَار آگ۔ معرفہ النَّار جہنم کی آگ یا کوئی اور متعین آگ ہو سکتی ہے۔ نَار مؤنث ہے اور اس کا درمیانی الف مادے کی واو سے بدلا ہے۔',
    },
    'ض و أ': {
      meaningUrdu: 'روشنی، چمک، روشن ہونا یا روشن کرنا۔',
      noteUrdu:
        'ضَوْء اور ضِيَاء روشنی کے لیے آتے ہیں؛ أَضَاءَ بابِ افعال میں لازم «روشن ہونا» بھی ہے اور متعدی «روشن کرنا» بھی۔ اس مادے کی درمیانی واو کئی صیغوں میں الف یا یاء بن جاتی ہے اور آخری حرف ہمزہ ہے، اس لیے یہ اجوف اور مہموز اللام دونوں ہے۔',
    },
    'ح و ل': {
      meaningUrdu: 'پھرنا، بدلنا، ایک جگہ یا حالت سے دوسری جگہ یا حالت میں منتقل ہونا۔',
      noteUrdu:
        'حِوَل اسم ہے جو مصدر کا معنی دیتا ہے: جگہ بدلنا اور کہیں اور منتقل ہونا؛ اس وزن میں درمیانی واو ظاہر رہتی ہے۔ اسی خاندان میں حَوْل (اردگرد، سال) اور حَال (کیفیت) بھی آتے ہیں۔',
    },
    'ذ ه ب': {
      meaningUrdu: 'جانا، چلے جانا، لے جانا، سونا (دھات)۔',
      noteUrdu:
        'ذَهَبَ / يَذْهَبُ جانا اور بِ کے ساتھ کسی چیز کو لے جانا ہے، اور ذَهَاب اس کا مصدر؛ ذَهَب (سونا) بھی اسی مادے کا اسم ہے۔ اسم ذَهَب اور فعل ذَهَبَ کے حروف ایک جیسے ہیں، اس لیے آخری حرکت، تنوین اور سیاق سے پہچانیں۔',
    },
    'ت ر ك': {
      meaningUrdu: 'چھوڑنا، ترک کرنا، پیچھے چھوڑ جانا۔',
      noteUrdu:
        'تَرَكَ ثلاثی مجرد فعل ہے: کسی کو کسی حال پر چھوڑ دینا، یا کوئی چیز اپنے پیچھے چھوڑ جانا۔ اردو کا «ترک کرنا» اسی سے ماخوذ ہے۔',
    },
    'ظ ل م': {
      meaningUrdu: 'ظلم کرنا، کسی کا حق کم کرنا، بے جا زیادتی، اندھیرا اور تاریکی۔',
      noteUrdu:
        'ظَلَمَ ظلم کرنا یا کسی کا حق گھٹانا ہے، اسی لیے باغ کے اپنے پھل میں کچھ کمی نہ کرنے کو بھی اسی فعل سے بیان کیا گیا ہے؛ ظَالِم اسمِ فاعل اور أَظْلَم اسمِ تفضیل یعنی زیادہ ظالم ہے۔ مُظْلِم بابِ افعال سے ہے اور اندھیرے میں ہونے کے معنی میں آیا ہے، ظلم کرنے کے نہیں۔',
    },
    'ص م م': {
      meaningUrdu: 'بہرا ہونا، کانوں کا بند ہونا، بہرا پن۔',
      noteUrdu:
        'صُمّ، أَصَمّ کی جمع ہے، یعنی بہرے؛ أَصَمّ عیب بتانے والی صفت أَفْعَل کے وزن پر ہے جس کی جمع فُعْل آتی ہے۔ مادے کی دوسری اور تیسری میم مدغم ہو کر ایک مشدد میم لکھی جاتی ہے، اس لیے اسے دو حرفی مادہ نہ سمجھیں۔',
    },
    'ب ك م': {
      meaningUrdu: 'گونگا ہونا، بولنے سے عاجز ہونا۔',
      noteUrdu:
        'أَبْكَم وہ ہے جو بول نہ سکے، اس کی جمع بُكْم ہے؛ یہ أَفْعَل (مذکر) اور فَعْلَاء (مؤنث) کے وزن پر عیب بیان کرنے والا صفتی اسم ہے۔ قرآن میں یہ حق بات نہ کہہ سکنے کے مجازی مفہوم میں بھی آتا ہے۔',
    },
    'ع م ي': {
      meaningUrdu: 'اندھا ہونا، نابینائی، دل کی بصیرت سے محرومی۔',
      noteUrdu:
        'أَعْمَى (اندھا) أَفْعَل کے وزن پر صفتِ مشبہ ہے، اسمِ تفضیل نہیں، اور عُمْيَان اس کی جمع ہے؛ عَمٍ بھی فَعِل کے وزن پر صفتِ مشبہ ہے، یعنی دل کا اندھا، اور عَمِينَ اس کی جمع ہے۔ یہ مادہ آنکھ کے اندھے پن اور حق سے دل کی بے بصیرتی دونوں کے لیے آتا ہے؛ آخری یاء أَعْمَى میں الفِ مقصورہ لکھی جاتی ہے اور عَمِينَ میں جمع کی یاء سے پہلے گر جاتی ہے۔',
    },
    'ر ج ع': {
      meaningUrdu: 'لوٹنا، واپس آنا، لوٹانا، واپس بھیجنا۔',
      noteUrdu:
        'رَجَعَ (يَرْجِعُ) لازم ہو تو «لوٹنا» ہے، جیسے يَرْجِعُونَ، اور متعدی ہو تو «لوٹانا»، جیسے فَٱرْجِعْنَا اور ٱرْجِعُونِ؛ تُرْجَعُونَ اسی کا مجہول یعنی «تم لوٹائے جاؤ گے» ہے۔ رَاجِعُون اسمِ فاعل کی جمع ہے یعنی لوٹنے والے؛ یہ اسم ہے، فعل نہیں۔',
    },
    'ص و ب': {
      meaningUrdu: 'نشانے پر لگنا، پہنچنا، آ پڑنا؛ درست ہونا۔',
      noteUrdu:
        'أَصَابَ بابِ افعال میں کسی چیز کا آ پہنچنا ہے، اچھی ہو یا بری؛ مُصِيبَة اسی کا اسمِ فاعل مؤنث ہے جو آ پڑنے والی آفت کے لیے آتا ہے۔ یہ اجوف واوی مادہ ہے: درمیانی واو أَصَابَ میں الف، أُصِيبُ میں یاء بن جاتی ہے اور أَصَبْنَا یا مجزوم تُصِبْ میں حذف ہو جاتی ہے۔',
    },
    'س م و': {
      meaningUrdu: 'بلند ہونا، اوپر اٹھنا، آسمان اور بلندی، نام اور نام رکھنا۔',
      noteUrdu:
        'سَمَاء آسمان ہے اور اس کی جمع سَمَاوَات؛ آخری ہمزہ اصل واو سے بدلا ہوا ہے جو جمع میں ظاہر ہوتی ہے۔ اِسْم (نام) لغوی درجہ بندی میں اسی مادے کے تحت ہے اور لغت میں اسے سُمُوّ سے بتایا گیا ہے، جبکہ و س م سے نسبت کا دوسرا قول بھی ملتا ہے۔',
    },
    'ر ع د': {
      meaningUrdu: 'بادل کی گرج، کڑک۔',
      noteUrdu:
        'رَعْد بادل کی گرج کی آواز ہے؛ اسی سے اِرْتَعَدَ (کانپنا) بھی آتا ہے۔ قرآن میں رَعْد اسم کے طور پر آیا ہے اور ایک سورت کا نام بھی ہے۔',
    },
    'ب ر ق': {
      meaningUrdu: 'بجلی کی چمک، چمکنا۔',
      noteUrdu:
        'بَرْق آسمانی بجلی کی چمک ہے؛ بَرَقَ چمکنا، اور بَرِقَ (آنکھ کا) خیرہ ہونا ہے۔ اسی خاندان میں إِسْتَبْرَق (موٹا ریشم) کو بھی لغت کی کتابیں درج کرتی ہیں، مگر وہ معرب لفظ ہے۔',
    },
    'ج ع ل': {
      meaningUrdu: 'کرنا، بنانا، رکھنا، مقرر کرنا، کسی چیز کو کسی حالت میں کر دینا۔',
      noteUrdu:
        'جَعَلَ دو مفعولوں کے ساتھ کسی چیز کو کچھ بنا دینے یا کسی حالت میں کر دینے، اور ایک مفعول کے ساتھ رکھنے، مقرر کرنے یا پیدا کرنے کا معنی دیتا ہے؛ ہر جگہ اس کا ترجمہ «پیدا کرنا» نہیں۔ لَجَـٰعِلُونَ میں جَاعِل اسمِ فاعل ہے، فعل نہیں۔',
    },
    'ص ب ع': {
      meaningUrdu: 'انگلی، انگلیاں۔',
      noteUrdu:
        'إِصْبَع انگلی ہے اور اس کی جمعِ تکسیر أَصَابِع ہے، جو أَفَاعِل کے وزن پر صیغۂ منتہی الجموع اور غیر منصرف ہے، اس لیے اس پر تنوین نہیں آتی۔ إِصْبَع کو مذکر اور مؤنث دونوں طرح استعمال کیا جاتا ہے۔',
    },
    'أ ذ ن': {
      meaningUrdu: 'کان، سننا، اجازت، اعلان۔',
      noteUrdu:
        'أُذُن کان ہے اور آذَان اس کی جمع؛ اسی مادے سے إِذْن (اجازت) اور أَذَان (اعلان) بھی بنتے ہیں۔ آذَان (کان) کو أَذَان (اعلان) سے نہ ملائیں: جمع کا ابتدائی «آ» جمع کے ہمزہ اور مادے کے ہمزہ کے ملنے سے بنا ہے۔',
    },
    'ص ع ق': {
      meaningUrdu: 'کڑک، بجلی کا گرنا؛ سخت آواز یا صدمے سے بے ہوش ہو کر گرنا۔',
      noteUrdu:
        'صَاعِقَة کڑکتی بجلی یا آسمانی کڑک کا عذاب ہے، اور صَعِق صفت ہے یعنی ہیبت سے بے ہوش ہو کر گرا ہوا۔ دونوں میں شدید کڑک یا صدمے سے گر پڑنے کا مفہوم مشترک ہے۔',
    },
    'ح ذ ر': {
      meaningUrdu: 'بچنا، ڈرنا، ہوشیار رہنا؛ احتیاط، بچاؤ کا سامان۔',
      noteUrdu:
        'حِذْر احتیاط، چوکسی اور بچاؤ کی تدبیر ہے؛ ان سورتوں میں «اپنا بچاؤ لے لو» کی ترکیب میں دشمن سے ہوشیار رہنے اور اس کے مقابلے کی تیاری کے مفہوم میں آیا ہے۔ یہ خود ہتھیار کا نام نہیں، اسی لیے خوف کی نماز والی آیت میں ہتھیاروں کا ذکر الگ ہوا ہے۔ اسی مادے سے فعل حَذِرَ (ڈرنا، بچنا) آتا ہے؛ حِذْر خود اسم ہے، فعل نہیں۔',
    },
    'م و ت': {
      meaningUrdu: 'مرنا، موت، بے جان ہونا، موت دینا۔',
      noteUrdu:
        'مَاتَ (مرنا) اور بابِ افعال کا أَمَاتَ (موت دینا) فعل ہیں، جبکہ مَوْت (موت)، مَيِّت (مردہ، یا وہ جسے آخرکار مرنا ہے؛ جمع مَيِّتُون اور مَوْتَى) اور مَيْتَة (بے جان، مؤنث صفت) اسم ہیں۔ یہ اجوف واوی مادہ ہے: مِتْنَا جیسے صیغوں میں درمیانی واو حذف ہے، اور مَيِّت کی مشدد یاء میں بھی یہی واو یاء بن کر مدغم ہے۔',
    },
    'ح و ط': {
      meaningUrdu: 'گھیرنا، ہر طرف سے احاطہ کرنا، پوری طرح جان لینا۔',
      noteUrdu:
        'أَحَاطَ بابِ افعال میں کسی چیز کو ہر طرف سے گھیر لینا ہے، اور علم کے ساتھ کسی بات کو پوری طرح جان لینا بھی۔ درمیانی واو اس کے صیغوں میں الف یا یاء بنتی ہے اور تُحِطْ اور أَحَطْنَا میں حذف ہو جاتی ہے۔',
    },
    'ك و د': {
      meaningUrdu: 'قریب ہونا، ہونے کو ہونا، تقریباً۔',
      noteUrdu:
        'كَادَ يَكَادُ افعالِ مقاربہ میں سے ہے جو بتاتا ہے کہ کام ہونے کے قریب تھا، اور اس کی خبر فعلِ مضارع ہوتی ہے؛ نفی کے ساتھ «مشکل ہی سے» کا مفہوم دیتا ہے۔ اسے ك ي د کے كَادَ يَكِيدُ (چال چلنا) سے الگ رکھیں: دونوں کا ماضی ایک جیسا ہے مگر مضارع مختلف ہے۔',
    },
    'خ ط ف': {
      meaningUrdu: 'اچک لینا، جھپٹ کر لے جانا، تیزی سے چھین لینا۔',
      noteUrdu:
        'يُتَخَطَّفُ بابِ تفعّل کا مضارع مجہول ہے: «(لوگ) اچک لیے جاتے ہیں»؛ اس باب میں بار بار اور ہر طرف سے اچکے جانے کا مفہوم آتا ہے۔ ابتدائی یاء مضارع کی علامت ہے اور تاء بابِ تفعّل کی، یہ مادے کے حروف نہیں۔',
    },
    'ك ل ل': {
      meaningUrdu: 'ہر ایک، سب، تمام، پورے مجموعے کا احاطہ۔',
      noteUrdu:
        'كُلّ اسم ہے جو مضاف ہو کر «ہر» یا «سب» کا معنی دیتا ہے اور اس کا اعراب جملے میں کردار سے بدلتا ہے؛ كُلٌّ یا كُلٍّ کی تنوین حذف شدہ مضاف الیہ کے بدلے میں ہے (تنوینِ عوض)، اور سیاق کے مطابق «ان میں سے ہر ایک» یا «ہر قسم» کا معنی دیتی ہے۔ كُلَّمَا اسی کے ساتھ مَا ملا کر «جب کبھی» کا ظرفی معنی دیتا ہے۔',
    },
    'م ش ي': {
      meaningUrdu: 'چلنا، پیدل چلنا، چلنا پھرنا۔',
      noteUrdu:
        'مَشَى ناقص یائی ثلاثی مجرد فعل ہے، یعنی چلنا؛ يَمْشُونَ اس کا جمع مذکر غائب مضارع ہے: وہ چلتے پھرتے ہیں۔ جمع کی واو سے پہلے مادے کی آخری یاء حذف ہو گئی ہے؛ نظر آنے والی واو فاعل کی ضمیر ہے۔',
    },
    'ش ي أ': {
      meaningUrdu: 'چاہنا، ارادہ کرنا، چیز، کوئی شے۔',
      noteUrdu:
        'شَاءَ / يَشَاءُ چاہنا اور ارادہ کرنا ہے اور شَيْء چیز؛ لغوی درجہ بندی میں دونوں اسی مادے کے تحت ہیں۔ فعل اجوف ہے: درمیانی یاء شَاءَ میں الف بن جاتی ہے اور شِئْتَ، شِئْنَا اور مجزوم نَشَأْ میں گر جاتی ہے، آخری ہمزہ اصلی ہے؛ نَشَأْ کو ن ش أ (أَنْشَأَ: پیدا کرنا) سے نہ ملائیں؛ لِشَا۟ىْءٍ میں لکھا ہوا الف پڑھا نہیں جاتا۔',
    },
    'ق د ر': {
      meaningUrdu: 'قدرت اور طاقت رکھنا، اندازہ اور پیمانہ مقرر کرنا، تقدیر۔',
      noteUrdu:
        'اس خاندان میں دو بڑے مفہوم ہیں: قدرت (قَادِر، مُقْتَدِر) اور اندازہ و پیمانہ مقرر کرنا (قَدَر، مِقْدَار، قَدَّرَ، تَقْدِير)؛ ہر لفظ کا مفہوم وزن اور سیاق سے طے ہوتا ہے۔ مُقْتَدِر بابِ افتعال کا اسمِ فاعل ہے اور اس کی تاء باب کی ہے، مادے کی نہیں۔',
    },
  },
  verbForms: {
    '2:3:2': {
      baabUrdu: 'بابِ اِفْعَال',
      formUrdu: 'ثلاثی مزید فیہ — چہارم (IV)',
      past: 'آمَنَ',
      present: 'يُؤْمِنُ',
      pattern: 'أَفْعَلَ — يُفْعِلُ',
      noteUrdu:
        'مہموز الفاء ہے: باب کا ہمزہ اور مادے کا ہمزہ مل کر آمَنَ میں آ (مد) بنتے ہیں، اور مضارع يُؤْمِنُ میں ہمزہ واو کی کرسی پر ہے۔ «ایمان لانا» کے معنی میں بِ یا لِ کے ساتھ آتا ہے، اور «امن دینا» کے معنی میں براہِ راست مفعول لیتا ہے۔',
    },
    '2:3:4': {
      baabUrdu: 'بابِ اِفْعَال',
      formUrdu: 'ثلاثی مزید فیہ — چہارم (IV)',
      past: 'أَقَامَ',
      present: 'يُقِيمُ',
      pattern: 'أَفْعَلَ — يُفْعِلُ',
      noteUrdu:
        'اجوف واوی اور متعدی فعل ہے: قائم کرنا، سیدھا کر دینا، کسی کام کو پوری طرح ادا کرنا۔ اصل أَقْوَمَ اور يُقْوِمُ سے أَقَامَ اور يُقِيمُ بنے؛ ساکن آخر سے پہلے یاء گر جاتی ہے (أَقِمْ)، جبکہ أَقِيمُوا میں باقی رہتی ہے۔',
    },
    '2:3:7': {
      baabUrdu: 'بابِ نَصَرَ يَنْصُرُ',
      formUrdu: 'ثلاثی مجرد — اوّل (I)',
      past: 'رَزَقَ',
      present: 'يَرْزُقُ',
      pattern: 'فَعَلَ — يَفْعُلُ',
      noteUrdu:
        'صحیح اور متعدی فعل ہے: روزی دینا، عطا کرنا؛ أَعْطَى کی طرح دو مفعول لے سکتا ہے، یعنی جسے دیا جائے اور جو دیا جائے۔ مضارع میں عینِ کلمہ مضموم ہے (يَرْزُقُ)، اس لیے امر اُرْزُقْ کا ہمزۂ وصل مضموم ہے۔',
    },
    '2:3:8': {
      baabUrdu: 'بابِ اِفْعَال',
      formUrdu: 'ثلاثی مزید فیہ — چہارم (IV)',
      past: 'أَنْفَقَ',
      present: 'يُنْفِقُ',
      pattern: 'أَفْعَلَ — يُفْعِلُ',
      noteUrdu:
        'صحیح سالم اور متعدی فعل ہے: مال وغیرہ خرچ کرنا؛ خرچ کی جانے والی چیز مفعول بنتی ہے یا مِنْ کے ساتھ آتی ہے۔ ماضی اور امر (أَنْفَقَ، أَنْفِقْ) کا ہمزۂ قطع بابِ افعال کا زائد ہمزہ ہے جو مضارع يُنْفِقُ میں گر جاتا ہے؛ اسی مادے کا بابِ مفاعلہ نَافَقَ (نفاق کرنا) الگ فعل ہے۔',
    },
    '2:4:2': {
      baabUrdu: 'بابِ اِفْعَال',
      formUrdu: 'ثلاثی مزید فیہ — چہارم (IV)',
      past: 'آمَنَ',
      present: 'يُؤْمِنُ',
      pattern: 'أَفْعَلَ — يُفْعِلُ',
      noteUrdu:
        'مہموز الفاء ہے: باب کا ہمزہ اور مادے کا ہمزہ مل کر آمَنَ میں آ (مد) بنتے ہیں، اور مضارع يُؤْمِنُ میں ہمزہ واو کی کرسی پر ہے۔ «ایمان لانا» کے معنی میں بِ یا لِ کے ساتھ آتا ہے، اور «امن دینا» کے معنی میں براہِ راست مفعول لیتا ہے۔',
    },
    '2:4:4': {
      baabUrdu: 'بابِ اِفْعَال — مجہول',
      formUrdu: 'ثلاثی مزید فیہ — چہارم (IV)، مجہول',
      past: 'أُنْزِلَ',
      present: 'يُنْزَلُ',
      pattern: 'أُفْعِلَ — يُفْعَلُ',
      noteUrdu:
        'صحیح اور متعدی فعل أَنْزَلَ (اتارنا، نازل کرنا) کا مجہول ہے: اتارا جانا؛ جو چیز اتاری جائے وہ نائبِ فاعل بنتی ہے۔ ماضی مجہول میں ہمزہ مضموم اور زاء مکسور ہے (أُنْزِلَ)، اور مضارع مجہول يُنْزَلُ میں زاء کا فتحہ اسے معروف يُنْزِلُ سے جدا کرتا ہے۔',
    },
    '2:4:7': {
      baabUrdu: 'بابِ اِفْعَال — مجہول',
      formUrdu: 'ثلاثی مزید فیہ — چہارم (IV)، مجہول',
      past: 'أُنْزِلَ',
      present: 'يُنْزَلُ',
      pattern: 'أُفْعِلَ — يُفْعَلُ',
      noteUrdu:
        'صحیح اور متعدی فعل أَنْزَلَ (اتارنا، نازل کرنا) کا مجہول ہے: اتارا جانا؛ جو چیز اتاری جائے وہ نائبِ فاعل بنتی ہے۔ ماضی مجہول میں ہمزہ مضموم اور زاء مکسور ہے (أُنْزِلَ)، اور مضارع مجہول يُنْزَلُ میں زاء کا فتحہ اسے معروف يُنْزِلُ سے جدا کرتا ہے۔',
    },
    '2:4:12': {
      baabUrdu: 'بابِ اِفْعَال',
      formUrdu: 'ثلاثی مزید فیہ — چہارم (IV)',
      past: 'أَيْقَنَ',
      present: 'يُوقِنُ',
      pattern: 'أَفْعَلَ — يُفْعِلُ',
      noteUrdu:
        'مثال یائی فعل ہے: یقین کرنا، کسی بات کو پختہ طور پر جاننا؛ جس بات پر یقین ہو وہ عموماً بِ کے ساتھ آتی ہے۔ ماضی أَيْقَنَ میں یاء ظاہر ہے، مگر مضارع اور اسمِ فاعل میں شروع کے پیش کے بعد ساکن یاء واو بن جاتی ہے (يُوقِنُ، مُوقِن)؛ اس واو سے مادہ و ق ن نہ سمجھیں، مادہ ي ق ن ہے۔',
    },
    '2:6:3': {
      baabUrdu: 'بابِ نَصَرَ يَنْصُرُ',
      formUrdu: 'ثلاثی مجرد — اوّل (I)',
      past: 'كَفَرَ',
      present: 'يَكْفُرُ',
      pattern: 'فَعَلَ — يَفْعُلُ',
      noteUrdu:
        'صحیح فعل ہے؛ اکثر بغیر مفعول آتا ہے اور جس چیز کا انکار ہو وہ بِ کے ساتھ آتی ہے (كَفَرَ بِـ)، جبکہ نعمت کے ساتھ ناشکری کا معنی دیتا ہے۔ بابِ تفعیل کا كَفَّرَ (گناہ مٹانا) الگ فعل ہے، اور كَافِر اسمِ فاعل ہے، فعل نہیں۔',
    },
    '2:6:6': {
      baabUrdu: 'بابِ اِفْعَال',
      formUrdu: 'ثلاثی مزید فیہ — چہارم (IV)',
      past: 'أَنْذَرَ',
      present: 'يُنْذِرُ',
      pattern: 'أَفْعَلَ — يُفْعِلُ',
      noteUrdu:
        'صحیح (سالم) اور متعدی فعل ہے: کسی انجام سے ڈرانا، خبردار کرنا؛ ایک یا دو مفعول لیتا ہے (جسے خبردار کیا جائے اور جس چیز سے)۔ مضارع میں بابِ افعال کا ہمزہ گر کر علامتِ مضارع پر ضمہ آتا ہے (يُنْذِرُ)، جبکہ ماضی اور امر میں ہمزۂ قطع رہتا ہے۔',
    },
    '2:6:9': {
      baabUrdu: 'بابِ اِفْعَال',
      formUrdu: 'ثلاثی مزید فیہ — چہارم (IV)',
      past: 'أَنْذَرَ',
      present: 'يُنْذِرُ',
      pattern: 'أَفْعَلَ — يُفْعِلُ',
      noteUrdu:
        'صحیح (سالم) اور متعدی فعل ہے: کسی انجام سے ڈرانا، خبردار کرنا؛ ایک یا دو مفعول لیتا ہے (جسے خبردار کیا جائے اور جس چیز سے)۔ مضارع میں بابِ افعال کا ہمزہ گر کر علامتِ مضارع پر ضمہ آتا ہے (يُنْذِرُ)، جبکہ ماضی اور امر میں ہمزۂ قطع رہتا ہے۔',
    },
    '2:6:11': {
      baabUrdu: 'بابِ اِفْعَال',
      formUrdu: 'ثلاثی مزید فیہ — چہارم (IV)',
      past: 'آمَنَ',
      present: 'يُؤْمِنُ',
      pattern: 'أَفْعَلَ — يُفْعِلُ',
      noteUrdu:
        'مہموز الفاء ہے: باب کا ہمزہ اور مادے کا ہمزہ مل کر آمَنَ میں آ (مد) بنتے ہیں، اور مضارع يُؤْمِنُ میں ہمزہ واو کی کرسی پر ہے۔ «ایمان لانا» کے معنی میں بِ یا لِ کے ساتھ آتا ہے، اور «امن دینا» کے معنی میں براہِ راست مفعول لیتا ہے۔',
    },
    '2:7:1': {
      baabUrdu: 'بابِ ضَرَبَ يَضْرِبُ',
      formUrdu: 'ثلاثی مجرد — اوّل (I)',
      past: 'خَتَمَ',
      present: 'يَخْتِمُ',
      pattern: 'فَعَلَ — يَفْعِلُ',
      noteUrdu:
        'صحیح سالم اور متعدی فعل ہے یعنی مہر لگانا، نیز کسی چیز کو ختم کرنا۔ ماضی میں عینِ کلمہ پر زبر اور مضارع يَخْتِمُ میں زیر ہے، اس لیے بابِ ضرب ہے؛ مہر لگانے کے معنی میں عموماً عَلَى کے ساتھ آتا ہے۔',
    },
    '2:8:4': {
      baabUrdu: 'بابِ نَصَرَ يَنْصُرُ',
      formUrdu: 'ثلاثی مجرد — اوّل (I)',
      past: 'قَالَ',
      present: 'يَقُولُ',
      pattern: 'فَعَلَ — يَفْعُلُ',
      noteUrdu:
        'اجوف واوی اور متعدی فعل ہے؛ کہی گئی بات (مقولہ) اس کا مفعول بنتی ہے۔ اصل قَوَلَ اور يَقْوُلُ ہے: ماضی میں واو الف بنی، مضارع میں اس کا ضمہ قاف کو ملا، اور ساکن لام سے پہلے واو گر جاتی ہے (قُلْتُ، قُلْ، لَمْ يَقُلْ)۔',
    },
    '2:8:5': {
      baabUrdu: 'بابِ اِفْعَال',
      formUrdu: 'ثلاثی مزید فیہ — چہارم (IV)',
      past: 'آمَنَ',
      present: 'يُؤْمِنُ',
      pattern: 'أَفْعَلَ — يُفْعِلُ',
      noteUrdu:
        'مہموز الفاء ہے: باب کا ہمزہ اور مادے کا ہمزہ مل کر آمَنَ میں آ (مد) بنتے ہیں، اور مضارع يُؤْمِنُ میں ہمزہ واو کی کرسی پر ہے۔ «ایمان لانا» کے معنی میں بِ یا لِ کے ساتھ آتا ہے، اور «امن دینا» کے معنی میں براہِ راست مفعول لیتا ہے۔',
    },
    '2:9:1': {
      baabUrdu: 'بابِ مُفَاعَلَة',
      formUrdu: 'ثلاثی مزید فیہ — سوم (III)',
      past: 'خَادَعَ',
      present: 'يُخَادِعُ',
      pattern: 'فَاعَلَ — يُفَاعِلُ',
      noteUrdu:
        'صحیح اور متعدی فعل ہے: دھوکا دینا یا دھوکا دینے کی کوشش کرنا؛ خ کے بعد کا الف بابِ مفاعلہ کا زائد الف ہے، مادہ خ د ع ہے۔ مضارع يُخَادِعُ میں علامتِ مضارع پر ضمہ اور دال پر کسرہ ہے؛ مجرد خَدَعَ يَخْدَعُ کے مقابلے میں اس میں کوشش اور دو طرفہ معاملے کا مفہوم ہوتا ہے۔',
    },
    '2:9:4': {
      baabUrdu: 'بابِ اِفْعَال',
      formUrdu: 'ثلاثی مزید فیہ — چہارم (IV)',
      past: 'آمَنَ',
      present: 'يُؤْمِنُ',
      pattern: 'أَفْعَلَ — يُفْعِلُ',
      noteUrdu:
        'مہموز الفاء ہے: باب کا ہمزہ اور مادے کا ہمزہ مل کر آمَنَ میں آ (مد) بنتے ہیں، اور مضارع يُؤْمِنُ میں ہمزہ واو کی کرسی پر ہے۔ «ایمان لانا» کے معنی میں بِ یا لِ کے ساتھ آتا ہے، اور «امن دینا» کے معنی میں براہِ راست مفعول لیتا ہے۔',
    },
    '2:9:6': {
      baabUrdu: 'بابِ فَتَحَ يَفْتَحُ',
      formUrdu: 'ثلاثی مجرد — اوّل (I)',
      past: 'خَدَعَ',
      present: 'يَخْدَعُ',
      pattern: 'فَعَلَ — يَفْعَلُ',
      noteUrdu:
        'صحیح اور متعدی فعل ہے: دھوکا دینا۔ آخری حرف ع حلقی ہے، اس لیے ماضی اور مضارع دونوں میں درمیانی حرف مفتوح ہے۔ اسی مادے کا بابِ مفاعلہ يُخَادِعُ دھوکا دینے کی کوشش کا مفہوم دیتا ہے، جبکہ مجرد يَخْدَعُ فعل کے واقع ہونے کو بیان کرتا ہے۔',
    },
    '2:9:10': {
      baabUrdu: 'بابِ نَصَرَ يَنْصُرُ',
      formUrdu: 'ثلاثی مجرد — اوّل (I)',
      past: 'شَعَرَ',
      present: 'يَشْعُرُ',
      pattern: 'فَعَلَ — يَفْعُلُ',
      noteUrdu:
        'صحیح فعل ہے؛ مضارع میں عینِ کلمہ پر پیش ہے (يَشْعُرُ)، اور قرآن میں اس کا صرف مضارع آیا ہے۔ لازم ہے اور بِ کے ساتھ آتا ہے: شَعَرَ بِهِ — کسی بات کا احساس یا خبر ہونا؛ بابِ افعال أَشْعَرَ (خبر کرا دینا) اس سے الگ فعل ہے۔',
    },
    '2:10:4': {
      baabUrdu: 'بابِ ضَرَبَ يَضْرِبُ',
      formUrdu: 'ثلاثی مجرد — اوّل (I)',
      past: 'زَادَ',
      present: 'يَزِيدُ',
      pattern: 'فَعَلَ — يَفْعِلُ',
      noteUrdu:
        'اجوف یائی فعل ہے؛ اصل زَيَدَ اور يَزْيِدُ سے زَادَ اور يَزِيدُ بنے، اور متحرک ضمیرِ فاعل یا جزم و امر میں درمیانی حرف گر جاتا ہے (زِدْنَا، لَمْ يَزِدْ، زِدْ)۔ لازم بھی ہے (بڑھنا) اور متعدی بھی، کبھی دو مفعولوں کے ساتھ (زَادَهُ مَالًا: اسے مال میں بڑھا دیا)۔',
    },
    '2:10:11': {
      baabUrdu: 'بابِ نَصَرَ يَنْصُرُ',
      formUrdu: 'ثلاثی مجرد — اوّل (I)',
      past: 'كَانَ',
      present: 'يَكُونُ',
      pattern: 'فَعَلَ — يَفْعُلُ',
      noteUrdu:
        'اجوف واوی فعل ہے (اصل كَوَنَ)؛ واو ماضی میں الف بنتی ہے، مضارع يَكُونُ میں ظاہر رہتی ہے اور آخری حرف ساکن ہونے پر گر جاتی ہے (كُنْتُ، يَكُنْ، كُنْ)؛ جزم میں کبھی نون بھی حذف ہوتی ہے (يَكُ)۔ عموماً فعلِ ناقص ہے جو اسم کو رفع اور خبر کو نصب دیتا ہے، اور کبھی تام ہو کر «ہونا، واقع ہونا» کا معنی دیتا ہے۔',
    },
    '2:10:12': {
      baabUrdu: 'بابِ ضَرَبَ يَضْرِبُ',
      formUrdu: 'ثلاثی مجرد — اوّل (I)',
      past: 'كَذَبَ',
      present: 'يَكْذِبُ',
      pattern: 'فَعَلَ — يَفْعِلُ',
      noteUrdu:
        'صحیح فعل ہے: جھوٹ بولنا، خلافِ واقعہ بات کہنا؛ عموماً لازم آتا ہے اور عَلَى کے ساتھ کسی پر جھوٹ باندھنے کے معنی دیتا ہے۔ بابِ تفعیل کا كَذَّبَ يُكَذِّبُ (جھٹلانا) الگ فعل ہے؛ ذال پر تشدید نہ ہونا، اور مضارع میں کاف کا سکون اور علامتِ مضارع کا فتحہ (يَكْذِبُ بمقابلہ يُكَذِّبُ) اسے ممتاز کرتے ہیں۔',
    },
    '2:11:2': {
      baabUrdu: 'بابِ نَصَرَ يَنْصُرُ — مجہول',
      formUrdu: 'ثلاثی مجرد — اوّل (I)، مجہول',
      past: 'قِيلَ',
      present: 'يُقَالُ',
      pattern: 'فُعِلَ — يُفْعَلُ',
      noteUrdu:
        'اجوف واوی کا مجہول ہے: اصل قُوِلَ میں واو کا کسرہ قاف کو ملا اور واو یاء بنی (قِيلَ)، اور يُقْوَلُ میں واو کا فتحہ قاف کو ملا اور واو الف بنی (يُقَالُ)۔ کہنے والے کا ذکر نہیں ہوتا اور کہی گئی بات عموماً بعد میں آتی ہے؛ اسے اسم قِيل (بات، قول) سے الگ پہچانیں۔',
    },
    '2:11:5': {
      baabUrdu: 'بابِ اِفْعَال',
      formUrdu: 'ثلاثی مزید فیہ — چہارم (IV)',
      past: 'أَفْسَدَ',
      present: 'يُفْسِدُ',
      pattern: 'أَفْعَلَ — يُفْعِلُ',
      noteUrdu:
        'صحیح فعل ہے: بگاڑنا، فساد برپا کرنا۔ یہ متعدی ہے (أَفْسَدُوهَا) اور اکثر بغیر مفعول کے فِي ٱلْأَرْضِ کے ساتھ فساد پھیلانے کے معنی میں آتا ہے؛ ثلاثی فَسَدَ يَفْسُدُ (خود بگڑنا) لازم ہے، دونوں کو نہ ملائیں۔',
    },
    '2:11:8': {
      baabUrdu: 'بابِ نَصَرَ يَنْصُرُ',
      formUrdu: 'ثلاثی مجرد — اوّل (I)',
      past: 'قَالَ',
      present: 'يَقُولُ',
      pattern: 'فَعَلَ — يَفْعُلُ',
      noteUrdu:
        'اجوف واوی اور متعدی فعل ہے؛ کہی گئی بات (مقولہ) اس کا مفعول بنتی ہے۔ اصل قَوَلَ اور يَقْوُلُ ہے: ماضی میں واو الف بنی، مضارع میں اس کا ضمہ قاف کو ملا، اور ساکن لام سے پہلے واو گر جاتی ہے (قُلْتُ، قُلْ، لَمْ يَقُلْ)۔',
    },
    '2:12:7': {
      baabUrdu: 'بابِ نَصَرَ يَنْصُرُ',
      formUrdu: 'ثلاثی مجرد — اوّل (I)',
      past: 'شَعَرَ',
      present: 'يَشْعُرُ',
      pattern: 'فَعَلَ — يَفْعُلُ',
      noteUrdu:
        'صحیح فعل ہے؛ مضارع میں عینِ کلمہ پر پیش ہے (يَشْعُرُ)، اور قرآن میں اس کا صرف مضارع آیا ہے۔ لازم ہے اور بِ کے ساتھ آتا ہے: شَعَرَ بِهِ — کسی بات کا احساس یا خبر ہونا؛ بابِ افعال أَشْعَرَ (خبر کرا دینا) اس سے الگ فعل ہے۔',
    },
    '2:13:2': {
      baabUrdu: 'بابِ نَصَرَ يَنْصُرُ — مجہول',
      formUrdu: 'ثلاثی مجرد — اوّل (I)، مجہول',
      past: 'قِيلَ',
      present: 'يُقَالُ',
      pattern: 'فُعِلَ — يُفْعَلُ',
      noteUrdu:
        'اجوف واوی کا مجہول ہے: اصل قُوِلَ میں واو کا کسرہ قاف کو ملا اور واو یاء بنی (قِيلَ)، اور يُقْوَلُ میں واو کا فتحہ قاف کو ملا اور واو الف بنی (يُقَالُ)۔ کہنے والے کا ذکر نہیں ہوتا اور کہی گئی بات عموماً بعد میں آتی ہے؛ اسے اسم قِيل (بات، قول) سے الگ پہچانیں۔',
    },
    '2:13:4': {
      baabUrdu: 'بابِ اِفْعَال',
      formUrdu: 'ثلاثی مزید فیہ — چہارم (IV)',
      past: 'آمَنَ',
      present: 'يُؤْمِنُ',
      pattern: 'أَفْعَلَ — يُفْعِلُ',
      noteUrdu:
        'مہموز الفاء ہے: باب کا ہمزہ اور مادے کا ہمزہ مل کر آمَنَ میں آ (مد) بنتے ہیں، اور مضارع يُؤْمِنُ میں ہمزہ واو کی کرسی پر ہے۔ «ایمان لانا» کے معنی میں بِ یا لِ کے ساتھ آتا ہے، اور «امن دینا» کے معنی میں براہِ راست مفعول لیتا ہے۔',
    },
    '2:13:6': {
      baabUrdu: 'بابِ اِفْعَال',
      formUrdu: 'ثلاثی مزید فیہ — چہارم (IV)',
      past: 'آمَنَ',
      present: 'يُؤْمِنُ',
      pattern: 'أَفْعَلَ — يُفْعِلُ',
      noteUrdu:
        'مہموز الفاء ہے: باب کا ہمزہ اور مادے کا ہمزہ مل کر آمَنَ میں آ (مد) بنتے ہیں، اور مضارع يُؤْمِنُ میں ہمزہ واو کی کرسی پر ہے۔ «ایمان لانا» کے معنی میں بِ یا لِ کے ساتھ آتا ہے، اور «امن دینا» کے معنی میں براہِ راست مفعول لیتا ہے۔',
    },
    '2:13:8': {
      baabUrdu: 'بابِ نَصَرَ يَنْصُرُ',
      formUrdu: 'ثلاثی مجرد — اوّل (I)',
      past: 'قَالَ',
      present: 'يَقُولُ',
      pattern: 'فَعَلَ — يَفْعُلُ',
      noteUrdu:
        'اجوف واوی اور متعدی فعل ہے؛ کہی گئی بات (مقولہ) اس کا مفعول بنتی ہے۔ اصل قَوَلَ اور يَقْوُلُ ہے: ماضی میں واو الف بنی، مضارع میں اس کا ضمہ قاف کو ملا، اور ساکن لام سے پہلے واو گر جاتی ہے (قُلْتُ، قُلْ، لَمْ يَقُلْ)۔',
    },
    '2:13:9': {
      baabUrdu: 'بابِ اِفْعَال',
      formUrdu: 'ثلاثی مزید فیہ — چہارم (IV)',
      past: 'آمَنَ',
      present: 'يُؤْمِنُ',
      pattern: 'أَفْعَلَ — يُفْعِلُ',
      noteUrdu:
        'مہموز الفاء ہے: باب کا ہمزہ اور مادے کا ہمزہ مل کر آمَنَ میں آ (مد) بنتے ہیں، اور مضارع يُؤْمِنُ میں ہمزہ واو کی کرسی پر ہے۔ «ایمان لانا» کے معنی میں بِ یا لِ کے ساتھ آتا ہے، اور «امن دینا» کے معنی میں براہِ راست مفعول لیتا ہے۔',
    },
    '2:13:11': {
      baabUrdu: 'بابِ اِفْعَال',
      formUrdu: 'ثلاثی مزید فیہ — چہارم (IV)',
      past: 'آمَنَ',
      present: 'يُؤْمِنُ',
      pattern: 'أَفْعَلَ — يُفْعِلُ',
      noteUrdu:
        'مہموز الفاء ہے: باب کا ہمزہ اور مادے کا ہمزہ مل کر آمَنَ میں آ (مد) بنتے ہیں، اور مضارع يُؤْمِنُ میں ہمزہ واو کی کرسی پر ہے۔ «ایمان لانا» کے معنی میں بِ یا لِ کے ساتھ آتا ہے، اور «امن دینا» کے معنی میں براہِ راست مفعول لیتا ہے۔',
    },
    '2:13:19': {
      baabUrdu: 'بابِ سَمِعَ يَسْمَعُ',
      formUrdu: 'ثلاثی مجرد — اوّل (I)',
      past: 'عَلِمَ',
      present: 'يَعْلَمُ',
      pattern: 'فَعِلَ — يَفْعَلُ',
      noteUrdu:
        'صحیح سالم اور متعدی فعل ہے: عینِ کلمہ ماضی عَلِمَ میں مکسور اور مضارع يَعْلَمُ میں مفتوح ہے۔ ایک مفعول کے ساتھ جاننا یا پہچاننا معنی دیتا ہے، اور افعالِ قلوب میں سے ہونے کے سبب دو مفعول بھی لیتا ہے؛ اسے بابِ تفعیل کے عَلَّمَ (سکھانا) سے الگ رکھیں۔',
    },
    '2:14:2': {
      baabUrdu: 'بابِ سَمِعَ يَسْمَعُ',
      formUrdu: 'ثلاثی مجرد — اوّل (I)',
      past: 'لَقِيَ',
      present: 'يَلْقَى',
      pattern: 'فَعِلَ — يَفْعَلُ',
      noteUrdu:
        'ناقص یائی اور متعدی فعل ہے: کسی سے ملنا یا کسی چیز سے دوچار ہونا۔ آخری یاء ماضی میں ظاہر رہتی ہے (لَقِيَ، لَقِينَا) مگر واوِ جمع سے پہلے گرتی ہے (لَقُوا)، مضارع میں الف مقصورہ بنتی ہے (يَلْقَى) اور جزم میں حذف ہوتی ہے (يَلْقَ)۔',
    },
    '2:14:4': {
      baabUrdu: 'بابِ اِفْعَال',
      formUrdu: 'ثلاثی مزید فیہ — چہارم (IV)',
      past: 'آمَنَ',
      present: 'يُؤْمِنُ',
      pattern: 'أَفْعَلَ — يُفْعِلُ',
      noteUrdu:
        'مہموز الفاء ہے: باب کا ہمزہ اور مادے کا ہمزہ مل کر آمَنَ میں آ (مد) بنتے ہیں، اور مضارع يُؤْمِنُ میں ہمزہ واو کی کرسی پر ہے۔ «ایمان لانا» کے معنی میں بِ یا لِ کے ساتھ آتا ہے، اور «امن دینا» کے معنی میں براہِ راست مفعول لیتا ہے۔',
    },
    '2:14:5': {
      baabUrdu: 'بابِ نَصَرَ يَنْصُرُ',
      formUrdu: 'ثلاثی مجرد — اوّل (I)',
      past: 'قَالَ',
      present: 'يَقُولُ',
      pattern: 'فَعَلَ — يَفْعُلُ',
      noteUrdu:
        'اجوف واوی اور متعدی فعل ہے؛ کہی گئی بات (مقولہ) اس کا مفعول بنتی ہے۔ اصل قَوَلَ اور يَقْوُلُ ہے: ماضی میں واو الف بنی، مضارع میں اس کا ضمہ قاف کو ملا، اور ساکن لام سے پہلے واو گر جاتی ہے (قُلْتُ، قُلْ، لَمْ يَقُلْ)۔',
    },
    '2:14:6': {
      baabUrdu: 'بابِ اِفْعَال',
      formUrdu: 'ثلاثی مزید فیہ — چہارم (IV)',
      past: 'آمَنَ',
      present: 'يُؤْمِنُ',
      pattern: 'أَفْعَلَ — يُفْعِلُ',
      noteUrdu:
        'مہموز الفاء ہے: باب کا ہمزہ اور مادے کا ہمزہ مل کر آمَنَ میں آ (مد) بنتے ہیں، اور مضارع يُؤْمِنُ میں ہمزہ واو کی کرسی پر ہے۔ «ایمان لانا» کے معنی میں بِ یا لِ کے ساتھ آتا ہے، اور «امن دینا» کے معنی میں براہِ راست مفعول لیتا ہے۔',
    },
    '2:14:8': {
      baabUrdu: 'بابِ نَصَرَ يَنْصُرُ',
      formUrdu: 'ثلاثی مجرد — اوّل (I)',
      past: 'خَلَا',
      present: 'يَخْلُو',
      pattern: 'فَعَلَ — يَفْعُلُ',
      noteUrdu:
        'ناقص واوی اور لازم فعل ہے: (زمانہ یا قومیں) گزر جانا، اور إِلَى کے ساتھ کسی سے تنہائی میں ملنا؛ آخری واو ماضی خَلَا میں الف بنتی ہے اور تاءِ تانیث ساکنہ سے پہلے گر جاتی ہے (خَلَتْ)، مضارع يَخْلُو میں واوِ مدہ رہتی ہے (رفع مقدر، نصب میں فتحہ ظاہر: يَخْلُوَ) اور جزم میں حذف ہوتی ہے (يَخْلُ)۔',
    },
    '2:14:11': {
      baabUrdu: 'بابِ نَصَرَ يَنْصُرُ',
      formUrdu: 'ثلاثی مجرد — اوّل (I)',
      past: 'قَالَ',
      present: 'يَقُولُ',
      pattern: 'فَعَلَ — يَفْعُلُ',
      noteUrdu:
        'اجوف واوی اور متعدی فعل ہے؛ کہی گئی بات (مقولہ) اس کا مفعول بنتی ہے۔ اصل قَوَلَ اور يَقْوُلُ ہے: ماضی میں واو الف بنی، مضارع میں اس کا ضمہ قاف کو ملا، اور ساکن لام سے پہلے واو گر جاتی ہے (قُلْتُ، قُلْ، لَمْ يَقُلْ)۔',
    },
    '2:15:2': {
      baabUrdu: 'بابِ اِسْتِفْعَال',
      formUrdu: 'ثلاثی مزید فیہ — دہم (X)',
      past: 'اِسْتَهْزَأَ',
      present: 'يَسْتَهْزِئُ',
      pattern: 'اِسْتَفْعَلَ — يَسْتَفْعِلُ',
      noteUrdu:
        'مہموز اللام فعل ہے: مذاق اڑانا؛ جس کا مذاق اڑایا جائے وہ بِ کے ساتھ آتا ہے، اور شروع کے سین اور تاء بابِ استفعال کے زائد حروف ہیں، مادہ ه ز أ ہے۔ آخری ہمزہ اصلی ہے اور حرکت کے مطابق اس کی کرسی بدلتی ہے (اِسْتَهْزَأَ، يَسْتَهْزِئُ)؛ قرآنی رسم میں جمع کی واو سے پہلے یہ کرسی کے بغیر لکھا گیا ہے (يَسْتَهْزِءُونَ)۔',
    },
    '2:15:4': {
      baabUrdu: 'بابِ نَصَرَ يَنْصُرُ',
      formUrdu: 'ثلاثی مجرد — اوّل (I)',
      past: 'مَدَّ',
      present: 'يَمُدُّ',
      pattern: 'فَعَلَ — يَفْعُلُ',
      noteUrdu:
        'مضاعف ہے: دوسرا اور تیسرا حرف ایک ہی (دال) ہونے سے مدغم ہیں (اصل مَدَدَ، يَمْدُدُ)، مگر متحرک ضمیرِ فاعل سے پہلے ادغام کھل جاتا ہے (مَدَدْنَا)؛ جزم و امر میں دونوں صورتیں درست ہیں (يَمُدَّ / يَمْدُدْ، مُدَّ / اُمْدُدْ)۔ متعدی ہے: پھیلانا، دراز کرنا، بڑھانا؛ اسے بابِ افعال کے أَمَدَّ يُمِدُّ (مدد پہنچانا) سے الگ رکھیں۔',
    },
    '2:15:7': {
      baabUrdu: 'بابِ سَمِعَ يَسْمَعُ',
      formUrdu: 'ثلاثی مجرد — اوّل (I)',
      past: 'عَمِهَ',
      present: 'يَعْمَهُ',
      pattern: 'فَعِلَ — يَفْعَلُ',
      noteUrdu:
        'صحیح سالم اور لازم فعل ہے: گمراہی میں حیران و سرگرداں پھرنا۔ ماضی عام طور پر عَمِهَ (میم کے زیر سے) ہے اور بعض لغات میں عَمَهَ بھی منقول ہے، مگر مضارع دونوں کا يَعْمَهُ ہے؛ اسے نابینا ہونے کے فعل عَمِيَ (مادہ ع م ي) سے نہ ملائیں۔',
    },
    '2:16:3': {
      baabUrdu: 'بابِ اِفْتِعَال',
      formUrdu: 'ثلاثی مزید فیہ — ہشتم (VIII)',
      past: 'اِشْتَرَى',
      present: 'يَشْتَرِي',
      pattern: 'اِفْتَعَلَ — يَفْتَعِلُ',
      noteUrdu:
        'ناقص یائی فعل ہے: آخری یاء ماضی اِشْتَرَى میں الفِ مقصورہ، مضارع يَشْتَرِي میں یاء ہے، اور واوِ جمع سے پہلے گر جاتی ہے (اِشْتَرَوْا، يَشْتَرُونَ)۔ متعدی ہے: خریدنا، کسی چیز کے بدلے لے لینا؛ حاصل کی گئی چیز مفعول بہ بنتی ہے اور دی گئی قیمت بِ کے ساتھ آتی ہے۔',
    },
    '2:16:7': {
      baabUrdu: 'بابِ سَمِعَ يَسْمَعُ',
      formUrdu: 'ثلاثی مجرد — اوّل (I)',
      past: 'رَبِحَ',
      present: 'يَرْبَحُ',
      pattern: 'فَعِلَ — يَفْعَلُ',
      noteUrdu:
        'صحیح فعل ہے: تجارت میں نفع پانا۔ ماضی میں باء مکسور اور مضارع میں مفتوح ہے۔ رَبِحَتْ میں آخری تاء تانیث کی ساکن علامت ہے، جو مؤنث فاعل تِّجَارَة کی مطابقت میں آئی ہے۔',
    },
    '2:16:10': {
      baabUrdu: 'بابِ نَصَرَ يَنْصُرُ',
      formUrdu: 'ثلاثی مجرد — اوّل (I)',
      past: 'كَانَ',
      present: 'يَكُونُ',
      pattern: 'فَعَلَ — يَفْعُلُ',
      noteUrdu:
        'اجوف واوی فعل ہے (اصل كَوَنَ)؛ واو ماضی میں الف بنتی ہے، مضارع يَكُونُ میں ظاہر رہتی ہے اور آخری حرف ساکن ہونے پر گر جاتی ہے (كُنْتُ، يَكُنْ، كُنْ)؛ جزم میں کبھی نون بھی حذف ہوتی ہے (يَكُ)۔ عموماً فعلِ ناقص ہے جو اسم کو رفع اور خبر کو نصب دیتا ہے، اور کبھی تام ہو کر «ہونا، واقع ہونا» کا معنی دیتا ہے۔',
    },
    '2:17:4': {
      baabUrdu: 'بابِ اِسْتِفْعَال',
      formUrdu: 'ثلاثی مزید فیہ — دہم (X)',
      past: 'اِسْتَوْقَدَ',
      present: 'يَسْتَوْقِدُ',
      pattern: 'اِسْتَفْعَلَ — يَسْتَفْعِلُ',
      noteUrdu:
        'مثال واوی فعل ہے (مادہ و ق د)، مگر بابِ استفعال میں پہلی واو ساکن ہو کر اپنی جگہ باقی رہتی ہے: اِسْتَوْقَدَ، يَسْتَوْقِدُ۔ متعدی ہے: آگ جلانا یا جلانے کی کوشش کرنا؛ ہمزہ وصلی ہے، اس لیے جملے کے درمیان پڑھنے میں نہیں آتا۔',
    },
    '2:17:7': {
      baabUrdu: 'بابِ اِفْعَال',
      formUrdu: 'ثلاثی مزید فیہ — چہارم (IV)',
      past: 'أَضَاءَ',
      present: 'يُضِيءُ',
      pattern: 'أَفْعَلَ — يُفْعِلُ',
      noteUrdu:
        'اجوف واوی اور مہموز اللام فعل ہے (مادہ ض و أ): اصل أَضْوَأَ سے أَضَاءَ اور يُضْوِئُ سے يُضِيءُ بنے، یعنی درمیانی واو ماضی میں الف اور مضارع میں یاء بن جاتی ہے۔ لازم «روشن ہونا» بھی ہے اور متعدی «روشن کرنا» بھی؛ سیاق سے فیصلہ کریں۔',
    },
    '2:17:10': {
      baabUrdu: 'بابِ فَتَحَ يَفْتَحُ',
      formUrdu: 'ثلاثی مجرد — اوّل (I)',
      past: 'ذَهَبَ',
      present: 'يَذْهَبُ',
      pattern: 'فَعَلَ — يَفْعَلُ',
      noteUrdu:
        'صحیح فعل ہے: جانا، چلے جانا؛ خود لازم ہے مگر بِ کے ساتھ متعدی ہو کر «لے جانا» کا معنی دیتا ہے (ذَهَبَ بِهِ)۔ عینِ کلمہ حرفِ حلقی ہاء ہے اور ماضی و مضارع دونوں میں مفتوح ہے (يَذْهَبُ)؛ امر اِذْهَبْ ہے۔',
    },
    '2:17:13': {
      baabUrdu: 'بابِ نَصَرَ يَنْصُرُ',
      formUrdu: 'ثلاثی مجرد — اوّل (I)',
      past: 'تَرَكَ',
      present: 'يَتْرُكُ',
      pattern: 'فَعَلَ — يَفْعُلُ',
      noteUrdu:
        'صحیح اور متعدی فعل ہے: چھوڑنا، پیچھے چھوڑ جانا؛ مضارع يَتْرُكُ میں عینِ کلمہ مضموم ہے۔ کبھی صَيَّرَ کے معنی میں دو مفعول لیتا ہے، یعنی کسی کو کسی حالت میں چھوڑ دینا، اور دوسرا مفعول جملہ بھی ہو سکتا ہے۔',
    },
    '2:17:17': {
      baabUrdu: 'بابِ اِفْعَال',
      formUrdu: 'ثلاثی مزید فیہ — چہارم (IV)',
      past: 'أَبْصَرَ',
      present: 'يُبْصِرُ',
      pattern: 'أَفْعَلَ — يُفْعِلُ',
      noteUrdu:
        'صحیح فعل ہے؛ متعدی ہو کر «کسی چیز کو دیکھنا» اور بغیر مفعول کے «دیکھ سکنا، بصیرت رکھنا» کا معنی دیتا ہے۔ امر کی شکل أَبْصِرْ کبھی فعلِ تعجب (أَفْعِلْ بِهِ کا وزن) ہوتی ہے، یعنی «کیا خوب دیکھنے والا ہے»؛ اسے ہر جگہ حکم نہ سمجھیں۔',
    },
    '2:18:6': {
      baabUrdu: 'بابِ ضَرَبَ يَضْرِبُ',
      formUrdu: 'ثلاثی مجرد — اوّل (I)',
      past: 'رَجَعَ',
      present: 'يَرْجِعُ',
      pattern: 'فَعَلَ — يَفْعِلُ',
      noteUrdu:
        'صحیح فعل ہے جو لازم (لوٹنا) اور متعدی (کسی کو لوٹانا) دونوں طرح آتا ہے۔ لامِ کلمہ حرفِ حلقی ع ہونے کے باوجود مضارع میں عینِ کلمہ مکسور ہے (يَرْجِعُ)، اس لیے یہ بابِ فتح نہیں بلکہ بابِ ضرب ہے؛ امر اِرْجِعْ ہے۔',
    },
    '2:19:9': {
      baabUrdu: 'بابِ فَتَحَ يَفْتَحُ',
      formUrdu: 'ثلاثی مجرد — اوّل (I)',
      past: 'جَعَلَ',
      present: 'يَجْعَلُ',
      pattern: 'فَعَلَ — يَفْعَلُ',
      noteUrdu:
        'صحیح اور متعدی فعل ہے؛ عینِ کلمہ حرفِ حلقی ع ہے اور ماضی و مضارع دونوں میں مفتوح ہے۔ ایک مفعول کے ساتھ بنانا یا رکھنا، اور دو مفعولوں کے ساتھ کسی کو کچھ بنا دینا یا قرار دینا (صَيَّرَ) کے معنی دیتا ہے؛ کون سا معنی ہے، یہ مفعولوں کی تعداد اور سیاق سے پہچانیں۔',
    },
    '2:20:1': {
      baabUrdu: 'بابِ سَمِعَ يَسْمَعُ',
      formUrdu: 'ثلاثی مجرد — اوّل (I)',
      past: 'كَادَ',
      present: 'يَكَادُ',
      pattern: 'فَعِلَ — يَفْعَلُ',
      noteUrdu:
        'اجوف واوی فعل ہے (اصل كَوِدَ يَكْوَدُ)؛ واو ماضی اور مضارع دونوں میں الف بنتی ہے، اور آخری حرف ساکن ہونے پر گر جاتی ہے: ماضی میں متحرک ضمیر سے پہلے (كِدْتُ) اور جزم میں (لَمْ يَكَدْ)۔ افعالِ مقاربہ میں سے ہے: اسم کو رفع دیتا ہے اور خبر عموماً فعلِ مضارع ہوتی ہے؛ مثبت صورت میں کام قریب تھا مگر ہوا نہیں۔',
    },
    '2:20:3': {
      baabUrdu: 'بابِ سَمِعَ يَسْمَعُ',
      formUrdu: 'ثلاثی مجرد — اوّل (I)',
      past: 'خَطِفَ',
      present: 'يَخْطَفُ',
      pattern: 'فَعِلَ — يَفْعَلُ',
      noteUrdu:
        'صحیح سالم اور متعدی فعل ہے، یعنی اچک لینا۔ ماضی میں طاء پر زیر اور مضارع میں زبر ہے۔ آیت میں پرندے فاعل ہیں اور آخری ہاء اس شخص کی طرف لوٹتی ہے جسے وہ اچک لیتے ہیں۔',
    },
    '2:20:6': {
      baabUrdu: 'بابِ اِفْعَال',
      formUrdu: 'ثلاثی مزید فیہ — چہارم (IV)',
      past: 'أَضَاءَ',
      present: 'يُضِيءُ',
      pattern: 'أَفْعَلَ — يُفْعِلُ',
      noteUrdu:
        'اجوف واوی اور مہموز اللام فعل ہے (مادہ ض و أ): اصل أَضْوَأَ سے أَضَاءَ اور يُضْوِئُ سے يُضِيءُ بنے، یعنی درمیانی واو ماضی میں الف اور مضارع میں یاء بن جاتی ہے۔ لازم «روشن ہونا» بھی ہے اور متعدی «روشن کرنا» بھی؛ سیاق سے فیصلہ کریں۔',
    },
    '2:20:8': {
      baabUrdu: 'بابِ ضَرَبَ يَضْرِبُ',
      formUrdu: 'ثلاثی مجرد — اوّل (I)',
      past: 'مَشَى',
      present: 'يَمْشِي',
      pattern: 'فَعَلَ — يَفْعِلُ',
      noteUrdu:
        'ناقص یائی اور لازم فعل ہے: چلنا۔ آخری یاء ماضی میں الف مقصورہ (مَشَى) اور مضارع میں یاء (يَمْشِي) بنتی ہے، واوِ جمع سے پہلے گر جاتی ہے (مَشَوْا، يَمْشُونَ) اور جزم و امر میں بھی حذف ہوتی ہے (لَا تَمْشِ)۔',
    },
    '2:20:11': {
      baabUrdu: 'بابِ اِفْعَال',
      formUrdu: 'ثلاثی مزید فیہ — چہارم (IV)',
      past: 'أَظْلَمَ',
      present: 'يُظْلِمُ',
      pattern: 'أَفْعَلَ — يُفْعِلُ',
      noteUrdu:
        'صحیح اور لازم فعل ہے: اندھیرا ہونا یا اندھیرے میں ہونا۔ یہ مادہ ظ ل م سے ہے، مگر مجرد ظَلَمَ (ظلم کرنا) سے الگ معنی رکھتا ہے؛ اسی بابِ افعال کا اسمِ فاعل مُظْلِم (اندھیرے میں پڑا ہوا) ہے۔',
    },
    '2:20:13': {
      baabUrdu: 'بابِ نَصَرَ يَنْصُرُ',
      formUrdu: 'ثلاثی مجرد — اوّل (I)',
      past: 'قَامَ',
      present: 'يَقُومُ',
      pattern: 'فَعَلَ — يَفْعُلُ',
      noteUrdu:
        'اجوف واوی اور لازم فعل ہے: کھڑا ہونا، اٹھنا؛ اصل قَوَمَ اور يَقْوُمُ سے قَامَ اور يَقُومُ بنے، اور ساکن آخر سے پہلے واو گر جاتی ہے (قُمْتُ، قُمْ)۔ قائم کرنے یا سیدھا کرنے کا متعدی معنی بابِ افعال کے أَقَامَ سے آتا ہے۔',
    },
    '2:20:15': {
      baabUrdu: 'بابِ سَمِعَ يَسْمَعُ',
      formUrdu: 'ثلاثی مجرد — اوّل (I)',
      past: 'شَاءَ',
      present: 'يَشَاءُ',
      pattern: 'فَعِلَ — يَفْعَلُ',
      noteUrdu:
        'اجوف یائی اور مہموز اللام ہے (اصل: شَيِئَ يَشْيَأُ)؛ درمیانی یاء الف میں بدل جاتی ہے (شَاءَ، يَشَاءُ)، اور ساکن ہمزہ سے پہلے یہ الف گر جاتا ہے جبکہ ہمزہ باقی رہتا ہے (شِئْتُ، لَمْ يَشَأْ)؛ شِئْتُ میں شین کو کسرہ بھی ملتا ہے۔ متعدی ہے: چاہنا، ارادہ کرنا؛ اس کا مفعول اکثر محذوف ہوتا ہے اور سیاق سے سمجھا جاتا ہے۔',
    },
    '2:20:17': {
      baabUrdu: 'بابِ فَتَحَ يَفْتَحُ',
      formUrdu: 'ثلاثی مجرد — اوّل (I)',
      past: 'ذَهَبَ',
      present: 'يَذْهَبُ',
      pattern: 'فَعَلَ — يَفْعَلُ',
      noteUrdu:
        'صحیح فعل ہے: جانا، چلے جانا؛ خود لازم ہے مگر بِ کے ساتھ متعدی ہو کر «لے جانا» کا معنی دیتا ہے (ذَهَبَ بِهِ)۔ عینِ کلمہ حرفِ حلقی ہاء ہے اور ماضی و مضارع دونوں میں مفتوح ہے (يَذْهَبُ)؛ امر اِذْهَبْ ہے۔',
    },
  },
};
