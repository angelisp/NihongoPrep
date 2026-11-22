/* ==========================================================================
   JLPT N5 Practice Drills & Structured Mock Exam Bank
   ========================================================================== */
window.NihongoData = window.NihongoData || {};

window.NihongoData.drills = {
  particles: [
    {
      id: 'dp01',
      prompt: '<ruby>毎日<rt>まいにち</rt></ruby><ruby>図書館<rt>としょかん</rt></ruby>（　）<ruby>日本語<rt>にほんご</rt></ruby>を<ruby>勉強<rt>べんきょう</rt></ruby>します。',
      options: ['に', 'で', 'を', 'へ'],
      answerIndex: 1,
      explanation: '図書館 (library) is the location where an active action (勉強する) happens, so use で.'
    },
    {
      id: 'dp02',
      prompt: '<ruby>私<rt>わたし</rt></ruby>は<ruby>日本<rt>にほん</rt></ruby>の<ruby>料理<rt>りょうり</rt></ruby>（　）<ruby>好<rt>す</rt></ruby>きです。',
      options: ['を', 'に', 'が', 'で'],
      answerIndex: 2,
      explanation: 'Adjectives of preference like 好き (like) and 嫌い (dislike) mark their object with が, not を.'
    },
    {
      id: 'dp03',
      prompt: '<ruby>明日<rt>あした</rt></ruby>の<ruby>朝<rt>あさ</rt></ruby>、<ruby>七時<rt>しちじ</rt></ruby>（　）<ruby>起<rt>お</rt></ruby>きます。',
      options: ['で', 'に', 'を', 'へ'],
      answerIndex: 1,
      explanation: 'Specific points in time such as clock hours (七時) take the particle に.'
    },
    {
      id: 'dp04',
      prompt: '<ruby>駅<rt>えき</rt></ruby>の<ruby>前<rt>まえ</rt></ruby>（　）<ruby>郵便局<rt>ゆうびんきょく</rt></ruby>があります。',
      options: ['で', 'を', 'に', 'と'],
      answerIndex: 2,
      explanation: 'Static existence verbs ある and いる always mark the location with に.'
    },
    {
      id: 'dp05',
      prompt: '<ruby>日曜日<rt>にちようび</rt></ruby>に<ruby>友達<rt>ともだち</rt></ruby>（　）<ruby>映画<rt>えいが</rt></ruby>を<ruby>見<rt>み</rt></ruby>ました。',
      options: ['と', 'で', 'を', 'の'],
      answerIndex: 0,
      explanation: 'と indicates doing an activity together with another person ("with a friend").'
    },
    {
      id: 'dp06',
      prompt: '<ruby>八時<rt>はちじ</rt></ruby>に<ruby>家<rt>いえ</rt></ruby>（　）<ruby>出<rt>で</rt></ruby>ます。',
      options: ['に', 'で', 'を', 'が'],
      answerIndex: 2,
      explanation: 'The verb 出る (to leave/exit a place) takes を to mark the point of departure.'
    },
    {
      id: 'dp07',
      prompt: '<ruby>日本<rt>にほん</rt></ruby>ではし（　）ごはんを<ruby>食<rt>た</rt></ruby>べます。',
      options: ['に', 'で', 'を', 'と'],
      answerIndex: 1,
      explanation: 'で marks the tool or instrument used to perform an action ("with chopsticks").'
    },
    {
      id: 'dp08',
      prompt: '<ruby>田中<rt>たなか</rt></ruby>さんは<ruby>英語<rt>えいご</rt></ruby>（　）よく<ruby>分<rt>わ</rt></ruby>かります。',
      options: ['を', 'に', 'が', 'で'],
      answerIndex: 2,
      explanation: '分かる (to understand) is a potential/state verb and always takes が, never を.'
    },
    {
      id: 'dp09',
      prompt: '<ruby>家<rt>いえ</rt></ruby>から<ruby>学校<rt>がっこう</rt></ruby>（　）<ruby>歩<rt>ある</rt></ruby>いて15<ruby>分<rt>ふん</rt></ruby>かかります。',
      options: ['に', 'まで', 'より', 'で'],
      answerIndex: 1,
      explanation: 'から (from) pairs with まで (to / up to) to express a distance or span.'
    },
    {
      id: 'dp10',
      prompt: '<ruby>私<rt>わたし</rt></ruby>は<ruby>学生<rt>がくせい</rt></ruby>です。<ruby>兄<rt>あに</rt></ruby>（　）<ruby>学生<rt>がくせい</rt></ruby>です。',
      options: ['は', 'も', 'が', 'と'],
      answerIndex: 1,
      explanation: 'も means "also / too" and replaces は when the same statement applies to another topic.'
    },
    {
      id: 'dp11',
      prompt: '<ruby>電車<rt>でんしゃ</rt></ruby>（　）<ruby>乗<rt>の</rt></ruby>って<ruby>新宿<rt>しんじゅく</rt></ruby>へ<ruby>行<rt>い</rt></ruby>きます。',
      options: ['を', 'に', 'で', 'が'],
      answerIndex: 1,
      explanation: 'The verb 乗る (to board/ride) takes に for the vehicle: 電車に乗る. (Contrast: 電車で行く.)'
    },
    {
      id: 'dp12',
      prompt: 'かばんの<ruby>中<rt>なか</rt></ruby>に<ruby>本<rt>ほん</rt></ruby>（　）ペンなどがあります。',
      options: ['や', 'も', 'を', 'に'],
      answerIndex: 0,
      explanation: 'や lists non-exhaustive examples and pairs naturally with など ("and so on").'
    }
  ],

  conjugation: [
    {
      id: 'dc01',
      prompt: 'Choose the correct て-form of <ruby>行<rt>い</rt></ruby>く (to go):',
      options: ['行いて', '行って', '行んで', '行きて'],
      answerIndex: 1,
      explanation: '行く is the famous Group 1 exception! Instead of 行いて, its て-form is 行って (いって).'
    },
    {
      id: 'dc02',
      prompt: 'Choose the polite past tense of <ruby>良<rt>い</rt></ruby>い (good): <ruby>昨日<rt>きのう</rt></ruby>の<ruby>映画<rt>えいが</rt></ruby>は＿＿＿です。',
      options: ['いいかった', 'よかった', 'いくなかった', 'いいでした'],
      answerIndex: 1,
      explanation: 'いい always conjugates from its original stem よ-: よかった (was good), よくない (not good).'
    },
    {
      id: 'dc03',
      prompt: 'Choose the correct て-form of <ruby>泳<rt>およ</rt></ruby>ぐ (to swim):',
      options: ['泳いて', '泳いで', '泳って', '泳んで'],
      answerIndex: 1,
      explanation: 'Group 1 verbs ending in ぐ change to いで (voiced!): 泳ぐ → 泳いで.'
    },
    {
      id: 'dc04',
      prompt: 'Choose the correct noun-modifying form of きれい: ＿＿＿<ruby>花<rt>はな</rt></ruby>ですね。',
      options: ['きれい', 'きれいな', 'きれいの', 'きれいく'],
      answerIndex: 1,
      explanation: 'きれい is a な-adjective despite ending in い, so it requires な before a noun.'
    },
    {
      id: 'dc05',
      prompt: 'Choose the correct て-form of <ruby>帰<rt>かえ</rt></ruby>る (to return home):',
      options: ['帰て', '帰って', '帰いて', '帰んで'],
      answerIndex: 1,
      explanation: '帰る looks like a Group 2 verb (-eru), but it is actually Group 1! So its て-form is 帰って.'
    },
    {
      id: 'dc06',
      prompt: 'Choose the negative polite form of <ruby>高<rt>たか</rt></ruby>い (expensive): この<ruby>靴<rt>くつ</rt></ruby>は＿＿＿です。',
      options: ['高じゃない', '高くない', '高いない', '高かった'],
      answerIndex: 1,
      explanation: 'For い-adjectives, drop the final い and add くない: 高い → 高くないです.'
    },
    {
      id: 'dc07',
      prompt: 'Choose the "please do not ~" form of <ruby>忘<rt>わす</rt></ruby>れる (to forget):',
      options: ['忘れてください', '忘れないでください', '忘れなくてください', '忘れませんください'],
      answerIndex: 1,
      explanation: 'Negative request uses [Verb ない-form] + でください. 忘れる (G2) → 忘れないでください.'
    },
    {
      id: 'dc08',
      prompt: 'Choose the correct て-form of <ruby>読<rt>よ</rt></ruby>む (to read):',
      options: ['読って', '読いて', '読んで', '読して'],
      answerIndex: 2,
      explanation: 'Group 1 verbs ending in む, ぶ, ぬ change to んで: 読む → 読んで.'
    },
    {
      id: 'dc09',
      prompt: 'Choose the "want to ~" form of <ruby>買<rt>か</rt></ruby>う (to buy): <ruby>新<rt>あたら</rt></ruby>しいパソコンが＿＿＿です。',
      options: ['買うたい', '買いたい', '買ってたい', '買わないたい'],
      answerIndex: 1,
      explanation: 'Attach たい to the ます-stem: 買います → 買い + たい → 買いたい.'
    },
    {
      id: 'dc10',
      prompt: 'Choose the polite negative form of <ruby>有名<rt>ゆうめい</rt></ruby> (famous):',
      options: ['有名くないです', '有名じゃありません', '有名ないです', '有名ではありませんでした'],
      answerIndex: 1,
      explanation: '有名 is a な-adjective, so present polite negative is 有名じゃありません.'
    },
    {
      id: 'dc11',
      prompt: 'Choose the correct て-form of <ruby>来<rt>く</rt></ruby>る (to come):',
      options: ['来って (くって)', '来て (きて)', '来て (こて)', '来いて (くいて)'],
      answerIndex: 1,
      explanation: '来る is irregular (Group 3): ます-form 来ます (きます), て-form 来て (きて), ない-form 来ない (こない).'
    },
    {
      id: 'dc12',
      prompt: 'Choose the past negative form of <ruby>忙<rt>いそが</rt></ruby>しい (busy): <ruby>先週<rt>せんしゅう</rt></ruby>はあまり＿＿＿です。',
      options: ['忙しくない', '忙しくなかった', '忙しかった', '忙しいじゃなかった'],
      answerIndex: 1,
      explanation: 'Past negative of い-adjectives drops い and adds くなかった: 忙しくなかったです.'
    }
  ],

  starOrder: [
    {
      id: 'ds01',
      before: '<ruby>私<rt>わたし</rt></ruby>は',
      after: '。',
      starPos: 2,
      options: ['が', '<ruby>好<rt>す</rt></ruby>きです', '<ruby>日本語<rt>にほんご</rt></ruby>を', '<ruby>勉強<rt>べんきょう</rt></ruby>するの'],
      answerIndex: 0,
      orderedText: '私は 日本語を 勉強するの ★が 好きです。',
      explanation: 'Pattern: [Verb-dict] のが 好きです → 日本語を / 勉強するの / が (★) / 好きです.'
    },
    {
      id: 'ds02',
      before: '<ruby>駅<rt>えき</rt></ruby>の',
      after: 'あります。',
      starPos: 1,
      options: ['<ruby>近<rt>ちか</rt></ruby>くに', '<ruby>大<rt>おお</rt></ruby>きい', '<ruby>病院<rt>びょういん</rt></ruby>が', 'とても'],
      answerIndex: 3,
      orderedText: '駅の 近くに ★とても 大きい 病院が あります。',
      explanation: 'Location first (駅の近くに), then degree adverb modifying adjective (とても 大きい 病院が あります). Slot 2 (★) is とても.'
    },
    {
      id: 'ds03',
      before: '<ruby>昨日<rt>きのう</rt></ruby>、',
      after: '<ruby>買<rt>か</rt></ruby>いました。',
      starPos: 2,
      options: ['デパートで', '<ruby>新<rt>あたら</rt></ruby>しい', '<ruby>友達<rt>ともだち</rt></ruby>と', 'かばんを'],
      answerIndex: 1,
      orderedText: '昨日、友達と デパートで ★新しい かばんを 買いました。',
      explanation: 'Order: 友達と デパートで 新しい (★) かばんを 買いました ("Bought a new bag at the department store with a friend").'
    },
    {
      id: 'ds04',
      before: '<ruby>季節<rt>きせつ</rt></ruby>の',
      after: '<ruby>好<rt>す</rt></ruby>きです。',
      starPos: 2,
      options: ['<ruby>春<rt>はる</rt></ruby>', '<ruby>中<rt>なか</rt></ruby>で', 'が', '<ruby>一番<rt>いちばん</rt></ruby>'],
      answerIndex: 2,
      orderedText: '季節の 中で 春 ★が 一番 好きです。',
      explanation: 'Superlative pattern: 季節の [中で] [春] [が ★] [一番] 好きです ("Among the seasons, I like spring best").'
    },
    {
      id: 'ds05',
      before: '<ruby>寝<rt>ね</rt></ruby>る',
      after: '<ruby>飲<rt>の</rt></ruby>みます。',
      starPos: 1,
      options: ['いつも', '<ruby>前<rt>まえ</rt></ruby>に', '<ruby>温<rt>あたた</rt></ruby>かい', '<ruby>牛乳<rt>ぎゅうにゅう</rt></ruby>を'],
      answerIndex: 0,
      orderedText: '寝る 前に ★いつも 温かい 牛乳を 飲みます。',
      explanation: '寝る前に (before sleeping) + いつも (★) + 温かい 牛乳を (warm milk) 飲みます.'
    },
    {
      id: 'ds06',
      before: 'この',
      after: 'いけません。',
      starPos: 2,
      options: ['<ruby>部屋<rt>へや</rt></ruby>で', '<ruby>写真<rt>しゃしん</rt></ruby>を', '<ruby>撮<rt>と</rt></ruby>っては', '<ruby>大<rt>おお</rt></ruby>きい'],
      answerIndex: 1,
      orderedText: 'この 大きい 部屋で ★写真を 撮っては いけません。',
      explanation: 'Order: この [大きい] [部屋で] [写真を ★] [撮っては] いけません ("You must not take photos in this big room").'
    },
    {
      id: 'ds07',
      before: '<ruby>電車<rt>でんしゃ</rt></ruby>',
      after: '<ruby>速<rt>はや</rt></ruby>いです。',
      starPos: 2,
      options: ['バス', 'より', 'のほうが', 'ずっと'],
      answerIndex: 1,
      orderedText: '電車 のほうが バス ★より ずっと 速いです。',
      explanation: 'Comparison: 電車 [のほうが] [バス] [より ★] [ずっと] 速いです ("Trains are much faster than buses").'
    },
    {
      id: 'ds08',
      before: '<ruby>日曜日<rt>にちようび</rt></ruby>は',
      after: 'します。',
      starPos: 2,
      options: ['<ruby>本<rt>ほん</rt></ruby>を', '<ruby>読<rt>よ</rt></ruby>んだり、', '<ruby>映画<rt>えいが</rt></ruby>を', '<ruby>見<rt>み</rt></ruby>たり'],
      answerIndex: 2,
      orderedText: '日曜日は 本を 読んだり、★映画を 見たり します。',
      explanation: '〜たり〜たりします: [本を] [読んだり、] [映画を ★] [見たり] します.'
    }
  ]
};

/* ==========================================================================
   Structured JLPT N5 Mock Exam (24 Questions across 3 Authentic Sections)
   ========================================================================== */
window.NihongoData.mockExam = [
  // ---------- SECTION 1: VOCABULARY & KANJI (文字・語彙) — 10 Qs ----------
  {
    id: 'e01',
    section: 'vocab',
    sectionLabel: 'Vocabulary & Kanji · Mondai 1 (Kanji Reading)',
    instruction: 'Choose the correct hiragana reading for the underlined kanji.',
    cleanPrompt: '<u>毎日</u> 7時に 起きます。 (Reading for <u>毎日</u>)',
    options: ['まいあさ', 'まいにち', 'まいしゅう', 'まいとし'],
    answerIndex: 1,
    explanation: '毎日 is read まいにち (every day). まいあさ is 毎朝 (every morning).'
  },
  {
    id: 'e02',
    section: 'vocab',
    sectionLabel: 'Vocabulary & Kanji · Mondai 1 (Kanji Reading)',
    instruction: 'Choose the correct hiragana reading for the underlined kanji.',
    cleanPrompt: '<u>新しい</u> くつを 買いました。 (Reading for <u>新しい</u>)',
    options: ['ふるい', 'やすい', 'あたらしい', 'いそがしい'],
    answerIndex: 2,
    explanation: '新しい is read あたらしい (new). 古い is ふるい (old).'
  },
  {
    id: 'e03',
    section: 'vocab',
    sectionLabel: 'Vocabulary & Kanji · Mondai 1 (Kanji Reading)',
    instruction: 'Choose the correct hiragana reading for the underlined kanji.',
    cleanPrompt: 'あたまが いたいので、<u>病院</u>へ 行きます。 (Reading for <u>病院</u>)',
    options: ['びよういん', 'びょういん', 'ぎんこう', 'としょかん'],
    answerIndex: 1,
    explanation: '病院 (hospital) is びょういん with a small ょ. びよういん (美容院) means beauty salon!'
  },
  {
    id: 'e04',
    section: 'vocab',
    sectionLabel: 'Vocabulary & Kanji · Mondai 1 (Kanji Reading)',
    instruction: 'Choose the correct hiragana reading for the underlined kanji.',
    cleanPrompt: 'この <u>川</u>の みずは とても きれいです。 (Reading for <u>川</u>)',
    options: ['やま', 'うみ', 'かわ', 'そら'],
    answerIndex: 2,
    explanation: '川 is read かわ (river). 山 is やま (mountain).'
  },
  {
    id: 'e05',
    section: 'vocab',
    sectionLabel: 'Vocabulary & Kanji · Mondai 2 (Orthography)',
    instruction: 'Choose the correct kanji for the underlined hiragana word.',
    cleanPrompt: '<u>でんしゃ</u>で がっこうへ いきます。 (Kanji for <u>でんしゃ</u>)',
    options: ['自動車', '自転車', '電車', '電話'],
    answerIndex: 2,
    explanation: '電車 (でんしゃ) = train. 自転車 = bicycle, 電話 = telephone.'
  },
  {
    id: 'e06',
    section: 'vocab',
    sectionLabel: 'Vocabulary & Kanji · Mondai 2 (Orthography)',
    instruction: 'Choose the correct kanji for the underlined hiragana word.',
    cleanPrompt: 'きのう <u>ともだち</u>に あいました。 (Kanji for <u>ともだち</u>)',
    options: ['家族', '友達', '先生', '学生'],
    answerIndex: 1,
    explanation: '友達 (ともだち) means friend.'
  },
  {
    id: 'e07',
    section: 'vocab',
    sectionLabel: 'Vocabulary & Kanji · Mondai 3 (Context)',
    instruction: 'Choose the best word to fill in the blank.',
    cleanPrompt: '<ruby>雨<rt>あめ</rt></ruby>が <ruby>降<rt>ふ</rt></ruby>っていますから、（　）を <ruby>持<rt>も</rt></ruby>って <ruby>行<rt>い</rt></ruby>きましょう。',
    options: ['<ruby>辞書<rt>じしょ</rt></ruby>', '<ruby>傘<rt>かさ</rt></ruby>', '<ruby>切手<rt>きって</rt></ruby>', '<ruby>財布<rt>さいふ</rt></ruby>'],
    answerIndex: 1,
    explanation: 'Because it is raining (雨が降っています), you take an umbrella (傘 / かさ).'
  },
  {
    id: 'e08',
    section: 'vocab',
    sectionLabel: 'Vocabulary & Kanji · Mondai 3 (Context)',
    instruction: 'Choose the best word to fill in the blank.',
    cleanPrompt: 'お<ruby>金<rt>かね</rt></ruby>を <ruby>下<rt>お</rt></ruby>ろしに（　）へ <ruby>行<rt>い</rt></ruby>きます。',
    options: ['<ruby>銀行<rt>ぎんこう</rt></ruby>', '<ruby>公園<rt>こうえん</rt></ruby>', '<ruby>食堂<rt>しょくどう</rt></ruby>', '<ruby>教室<rt>きょうしつ</rt></ruby>'],
    answerIndex: 0,
    explanation: 'You go to a bank (銀行 / ぎんこう) to withdraw money.'
  },
  {
    id: 'e09',
    section: 'vocab',
    sectionLabel: 'Vocabulary & Kanji · Mondai 3 (Context)',
    instruction: 'Choose the best word to fill in the blank.',
    cleanPrompt: 'この<ruby>問題<rt>もんだい</rt></ruby>はとても（　）ですから、すぐ<ruby>分<rt>わ</rt></ruby>かりました。',
    options: ['<ruby>難<rt>むずか</rt></ruby>しい', '<ruby>忙<rt>いそが</rt></ruby>しい', '<ruby>易<rt>やさ</rt></ruby>しい', '<ruby>遠<rt>とお</rt></ruby>い'],
    answerIndex: 2,
    explanation: 'Because I understood it right away (すぐ分かりました), the problem was easy (易しい / やさしい).'
  },
  {
    id: 'e10',
    section: 'vocab',
    sectionLabel: 'Vocabulary & Kanji · Mondai 4 (Paraphrases)',
    instruction: 'Choose the sentence that is closest in meaning.',
    cleanPrompt: '<u><ruby>今週<rt>こんしゅう</rt></ruby>の<ruby>土曜日<rt>どようび</rt></ruby>は<ruby>暇<rt>ひま</rt></ruby>です。</u>',
    options: [
      '<ruby>今週<rt>こんしゅう</rt></ruby>の<ruby>土曜日<rt>どようび</rt></ruby>は<ruby>仕事<rt>しごと</rt></ruby>がたくさんあります。',
      '<ruby>今週<rt>こんしゅう</rt></ruby>の<ruby>土曜日<rt>どようび</rt></ruby>は<ruby>時間<rt>じかん</rt></ruby>があります。',
      '<ruby>今週<rt>こんしゅう</rt></ruby>の<ruby>土曜日<rt>どようび</rt></ruby>は<ruby>雨<rt>あめ</rt></ruby>が<ruby>降<rt>ふ</rt></ruby>ります。',
      '<ruby>今週<rt>こんしゅう</rt></ruby>の<ruby>土曜日<rt>どようび</rt></ruby>は<ruby>学校<rt>がっこう</rt></ruby>へ<ruby>行<rt>い</rt></ruby>きます。'
    ],
    answerIndex: 1,
    explanation: '暇です (to be free / have free time) is closest in meaning to 時間があります (to have time).'
  },

  // ---------- SECTION 2: GRAMMAR (文法) — 8 Qs ----------
  {
    id: 'e11',
    section: 'grammar',
    sectionLabel: 'Grammar · Mondai 1 (Grammar Forms)',
    instruction: 'Choose the best particle or grammar form to fill in the blank.',
    cleanPrompt: '<ruby>私<rt>わたし</rt></ruby>はテレビをあまり（　）。',
    options: ['<ruby>見<rt>み</rt></ruby>ます', '<ruby>見<rt>み</rt></ruby>ません', '<ruby>見<rt>み</rt></ruby>ました', '<ruby>見<rt>み</rt></ruby>てください'],
    answerIndex: 1,
    explanation: 'あまり ("not very much") MUST pair with a negative verb: 見ません.'
  },
  {
    id: 'e12',
    section: 'grammar',
    sectionLabel: 'Grammar · Mondai 1 (Grammar Forms)',
    instruction: 'Choose the best particle or grammar form to fill in the blank.',
    cleanPrompt: '<ruby>日本<rt>にほん</rt></ruby>へ（　）<ruby>前<rt>まえ</rt></ruby>に、<ruby>日本語<rt>にほんご</rt></ruby>を<ruby>一年<rt>いちねん</rt></ruby><ruby>勉強<rt>べんきょう</rt></ruby>しました。',
    options: ['<ruby>来<rt>き</rt></ruby>た', '<ruby>来<rt>く</rt></ruby>る', '<ruby>来<rt>き</rt></ruby>て', '<ruby>来<rt>き</rt></ruby>ます'],
    answerIndex: 1,
    explanation: '前に ("before doing") ALWAYS takes the dictionary form (来る前に), even when the main sentence is past tense.'
  },
  {
    id: 'e13',
    section: 'grammar',
    sectionLabel: 'Grammar · Mondai 1 (Grammar Forms)',
    instruction: 'Choose the best particle or grammar form to fill in the blank.',
    cleanPrompt: '<ruby>図書館<rt>としょかん</rt></ruby>の<ruby>中<rt>なか</rt></ruby>でパンを<ruby>食<rt>た</rt></ruby>べて（　）。',
    options: ['もいいです', 'はいけません', 'ください', 'います'],
    answerIndex: 1,
    explanation: 'Standard library rule: you must not eat inside → 食べてはいけません.'
  },
  {
    id: 'e14',
    section: 'grammar',
    sectionLabel: 'Grammar · Mondai 1 (Grammar Forms)',
    instruction: 'Choose the best particle or grammar form to fill in the blank.',
    cleanPrompt: 'A:「もう<ruby>昼<rt>ひる</rt></ruby>ごはんを<ruby>食<rt>た</rt></ruby>べましたか。」 B:「いいえ、まだ（　）。」',
    options: ['<ruby>食<rt>た</rt></ruby>べません', '<ruby>食<rt>た</rt></ruby>べています', '<ruby>食<rt>た</rt></ruby>べていません', '<ruby>食<rt>た</rt></ruby>べませんでした'],
    answerIndex: 2,
    explanation: 'まだ ("not yet") pairs with 〜ていません (まだ食べていません = have not eaten yet).'
  },
  {
    id: 'e15',
    section: 'grammar',
    sectionLabel: 'Grammar · Mondai 1 (Grammar Forms)',
    instruction: 'Choose the best particle or grammar form to fill in the blank.',
    cleanPrompt: '<ruby>京都<rt>きょうと</rt></ruby>は<ruby>静<rt>しず</rt></ruby>かで（　）<ruby>町<rt>まち</rt></ruby>です。',
    options: ['きれい', 'きれいな', 'きれいの', 'きれいく'],
    answerIndex: 1,
    explanation: 'きれい is a な-adjective, so modifying the noun 町 requires な: きれいな町.'
  },
  {
    id: 'e16',
    section: 'grammar',
    sectionLabel: 'Grammar · Mondai 1 (Grammar Forms)',
    instruction: 'Choose the best particle or grammar form to fill in the blank.',
    cleanPrompt: '<ruby>手<rt>て</rt></ruby>を<ruby>洗<rt>あら</rt></ruby>って（　）、ごはんを<ruby>食<rt>た</rt></ruby>べましょう。',
    options: ['まで', 'より', 'から', 'ので'],
    answerIndex: 2,
    explanation: '[Verb て-form] + から means "after doing ~": 洗ってから (after washing).'
  },
  {
    id: 'e17',
    section: 'grammar',
    sectionLabel: 'Grammar · Mondai 2 (★ Sentence Composition)',
    instruction: 'Order the four choices into the blanks and select which option goes in the ★ position.',
    isStar: true,
    starBefore: '<ruby>私<rt>わたし</rt></ruby>の<ruby>部屋<rt>へや</rt></ruby>は',
    starAfter: 'です。',
    starPos: 2,
    options: ['<ruby>広<rt>ひろ</rt></ruby>くて', 'とても', '<ruby>明<rt>あか</rt></ruby>るい', '<ruby>部屋<rt>へや</rt></ruby>'],
    answerIndex: 2,
    explanation: 'Ordered sentence: 私の部屋は [とても] [広くて] [明るい ★] [部屋] です ("My room is a very spacious and bright room").'
  },
  {
    id: 'e18',
    section: 'grammar',
    sectionLabel: 'Grammar · Mondai 2 (★ Sentence Composition)',
    instruction: 'Order the four choices into the blanks and select which option goes in the ★ position.',
    isStar: true,
    starBefore: '<ruby>昨日<rt>きのう</rt></ruby>は',
    starAfter: '<ruby>行<rt>い</rt></ruby>きました。',
    starPos: 1,
    options: ['<ruby>友達<rt>ともだち</rt></ruby>と', '<ruby>新<rt>あたら</rt></ruby>しい', 'レストランへ', '駅前の'],
    answerIndex: 3,
    explanation: 'Ordered sentence: 昨日は [友達と] [駅前の ★] [新しい] [レストランへ] 行きました ("Yesterday I went to a new restaurant in front of the station with a friend").'
  },

  // ---------- SECTION 3: READING COMPREHENSION (読解) — 6 Qs (3 Passages) ----------
  {
    id: 'e19',
    section: 'reading',
    sectionLabel: 'Reading · Passage 1 (Library Notice)',
    passageTitle: 'おしらせ — さくら<ruby>図書館<rt>としょかん</rt></ruby>',
    passage: '<ruby>開<rt>あ</rt></ruby>いている<ruby>時間<rt>じかん</rt></ruby>：<ruby>火曜日<rt>かようび</rt></ruby>から<ruby>日曜日<rt>にちようび</rt></ruby> 9:30〜19:00<br><ruby>休<rt>やす</rt></ruby>みの<ruby>日<rt>ひ</rt></ruby>：<ruby>月曜日<rt>げつようび</rt></ruby><br>※<ruby>本<rt>ほん</rt></ruby>は<ruby>一人<rt>ひとり</rt></ruby>5<ruby>冊<rt>さつ</rt></ruby>まで2<ruby>週間<rt>しゅうかん</rt></ruby><ruby>借<rt>か</rt></ruby>りることができます。<br>※<ruby>図書館<rt>としょかん</rt></ruby>の<ruby>中<rt>なか</rt></ruby>で<ruby>飲<rt>の</rt></ruby>み<ruby>物<rt>もの</rt></ruby>を<ruby>飲<rt>の</rt></ruby>まないでください。',
    instruction: 'Read the notice above and answer the question.',
    cleanPrompt: 'さくら<ruby>図書館<rt>としょかん</rt></ruby>はいつ<ruby>休<rt>やす</rt></ruby>みですか。',
    options: ['<ruby>日曜日<rt>にちようび</rt></ruby>', '<ruby>月曜日<rt>げつようび</rt></ruby>', '<ruby>火曜日<rt>かようび</rt></ruby>', '<ruby>毎日<rt>まいにち</rt></ruby>'],
    answerIndex: 1,
    explanation: 'The notice states 休みの日：月曜日 (Closed day: Monday).'
  },
  {
    id: 'e20',
    section: 'reading',
    sectionLabel: 'Reading · Passage 1 (Library Notice)',
    passageTitle: 'おしらせ — さくら<ruby>図書館<rt>としょかん</rt></ruby>',
    passage: '<ruby>開<rt>あ</rt></ruby>いている<ruby>時間<rt>じかん</rt></ruby>：<ruby>火曜日<rt>かようび</rt></ruby>から<ruby>日曜日<rt>にちようび</rt></ruby> 9:30〜19:00<br><ruby>休<rt>やす</rt></ruby>みの<ruby>日<rt>ひ</rt></ruby>：<ruby>月曜日<rt>げつようび</rt></ruby><br>※<ruby>本<rt>ほん</rt></ruby>は<ruby>一人<rt>ひとり</rt></ruby>5<ruby>冊<rt>さつ</rt></ruby>まで2<ruby>週間<rt>しゅうかん</rt></ruby><ruby>借<rt>か</rt></ruby>りることができます。<br>※<ruby>図書館<rt>としょかん</rt></ruby>の<ruby>中<rt>なか</rt></ruby>で<ruby>飲<rt>の</rt></ruby>み<ruby>物<rt>もの</rt></ruby>を<ruby>飲<rt>の</rt></ruby>まないでください。',
    instruction: 'Read the notice above and answer the question.',
    cleanPrompt: 'この<ruby>図書館<rt>としょかん</rt></ruby>について、<ruby>正<rt>ただ</rt></ruby>しいものはどれですか。',
    options: [
      '<ruby>夜<rt>よる</rt></ruby>8<ruby>時<rt>じ</rt></ruby>まで<ruby>開<rt>あ</rt></ruby>いています。',
      '<ruby>一人<rt>ひとり</rt></ruby>10<ruby>冊<rt>さつ</rt></ruby>まで<ruby>本<rt>ほん</rt></ruby>を<ruby>借<rt>か</rt></ruby>りることができます。',
      '<ruby>図書館<rt>としょかん</rt></ruby>の<ruby>中<rt>なか</rt></ruby>でコーヒーを<ruby>飲<rt>の</rt></ruby>んではいけません。',
      '<ruby>本<rt>ほん</rt></ruby>は1<ruby>週間<rt>しゅうかん</rt></ruby>だけ<ruby>借<rt>か</rt></ruby>りることができます。'
    ],
    answerIndex: 2,
    explanation: 'The notice says 飲み物を飲まないでください ("Please do not drink beverages"), which matches "You must not drink coffee inside".'
  },
  {
    id: 'e21',
    section: 'reading',
    sectionLabel: 'Reading · Passage 2 (Message from a Friend)',
    passageTitle: 'メール：<ruby>ケン<rt>けん</rt></ruby>さんより',
    passage: 'アリさんへ<br><ruby>今週<rt>こんしゅう</rt></ruby>の<ruby>日曜日<rt>にちようび</rt></ruby>、<ruby>一緒<rt>いっしょ</rt></ruby>に<ruby>京都<rt>きょうと</rt></ruby>へ<ruby>行<rt>い</rt></ruby>きませんか。<ruby>朝<rt>あさ</rt></ruby>9<ruby>時<rt>じ</rt></ruby>に<ruby>大阪駅<rt>おおさかえき</rt></ruby>で<ruby>会<rt>あ</rt></ruby>いましょう。<ruby>電車<rt>でんしゃ</rt></ruby>で30<ruby>分<rt>ぷん</rt></ruby>ぐらいかかります。<ruby>京都<rt>きょうと</rt></ruby>で<ruby>古<rt>ふる</rt></ruby>いお<ruby>寺<rt>てら</rt></ruby>を<ruby>見<rt>み</rt></ruby>たり、おいしい<ruby>抹茶<rt>まっちゃ</rt></ruby>を<ruby>飲<rt>の</rt></ruby>んだりしましょう。<ruby>雨<rt>あめ</rt></ruby>が<ruby>降<rt>ふ</rt></ruby>ったら、<ruby>美術館<rt>びじゅつかん</rt></ruby>へ<ruby>行<rt>い</rt></ruby>きましょう。<br>ケン',
    instruction: 'Read Ken’s email and answer the question.',
    cleanPrompt: '<ruby>二人<rt>ふたり</rt></ruby>は<ruby>日曜日<rt>にちようび</rt></ruby>の9<ruby>時<rt>じ</rt></ruby>にどこで<ruby>会<rt>あ</rt></ruby>いますか。',
    options: ['<ruby>京都駅<rt>きょうとえき</rt></ruby>', '<ruby>大阪駅<rt>おおさかえき</rt></ruby>', '<ruby>美術館<rt>びじゅつかん</rt></ruby>', 'お<ruby>寺<rt>てら</rt></ruby>'],
    answerIndex: 1,
    explanation: 'The email says 朝9時に大阪駅で会いましょう ("Let’s meet at Osaka Station at 9 AM").'
  },
  {
    id: 'e22',
    section: 'reading',
    sectionLabel: 'Reading · Passage 2 (Message from a Friend)',
    passageTitle: 'メール：<ruby>ケン<rt>けん</rt></ruby>さんより',
    passage: 'アリさんへ<br><ruby>今週<rt>こんしゅう</rt></ruby>の<ruby>日曜日<rt>にちようび</rt></ruby>、<ruby>一緒<rt>いっしょ</rt></ruby>に<ruby>京都<rt>きょうと</rt></ruby>へ<ruby>行<rt>い</rt></ruby>きませんか。<ruby>朝<rt>あさ</rt></ruby>9<ruby>時<rt>じ</rt></ruby>に<ruby>大阪駅<rt>おおさかえき</rt></ruby>で<ruby>会<rt>あ</rt></ruby>いましょう。<ruby>電車<rt>でんしゃ</rt></ruby>で30<ruby>分<rt>ぷん</rt></ruby>ぐらいかかります。<ruby>京都<rt>きょうと</rt></ruby>で<ruby>古<rt>ふる</rt></ruby>いお<ruby>寺<rt>てら</rt></ruby>を<ruby>見<rt>み</rt></ruby>たり、おいしい<ruby>抹茶<rt>まっちゃ</rt></ruby>を<ruby>飲<rt>の</rt></ruby>んだりしましょう。<ruby>雨<rt>あめ</rt></ruby>が<ruby>降<rt>ふ</rt></ruby>ったら、<ruby>美術館<rt>びじゅつかん</rt></ruby>へ<ruby>行<rt>い</rt></ruby>きましょう。<br>ケン',
    instruction: 'Read Ken’s email and answer the question.',
    cleanPrompt: '<ruby>日曜日<rt>にちようび</rt></ruby>に<ruby>雨<rt>あめ</rt></ruby>が<ruby>降<rt>ふ</rt></ruby>ったら、どうしますか。',
    options: [
      'うちで<ruby>休<rt>やす</rt></ruby>みます。',
      '<ruby>美術館<rt>びじゅつかん</rt></ruby>へ<ruby>行<rt>い</rt></ruby>きます。',
      '<ruby>大阪<rt>おおさか</rt></ruby>へ<ruby>帰<rt>かえ</rt></ruby>ります。',
      'バスで<ruby>行<rt>い</rt></ruby>きます。'
    ],
    answerIndex: 1,
    explanation: 'The last sentence states 雨が降ったら、美術館へ行きましょう ("If it rains, let’s go to the art museum").'
  },
  {
    id: 'e23',
    section: 'reading',
    sectionLabel: 'Reading · Passage 3 (Short Essay)',
    passageTitle: '<ruby>私<rt>わたし</rt></ruby>の<ruby>毎日<rt>まいにち</rt></ruby>',
    passage: '<ruby>私<rt>わたし</rt></ruby>は<ruby>毎日<rt>まいにち</rt></ruby><ruby>六時<rt>ろくじ</rt></ruby>に<ruby>起<rt>お</rt></ruby>きます。<ruby>朝<rt>あさ</rt></ruby>ごはんを<ruby>食<rt>た</rt></ruby>べてから、30<ruby>分<rt>ぷん</rt></ruby>ぐらい<ruby>漢字<rt>かんじ</rt></ruby>を<ruby>勉強<rt>べんきょう</rt></ruby>します。<ruby>学校<rt>がっこう</rt></ruby>まで<ruby>自転車<rt>じてんしゃ</rt></ruby>で20<ruby>分<rt>ぷん</rt></ruby>かかりますが、<ruby>雨<rt>あめ</rt></ruby>の<ruby>日<rt>ひ</rt></ruby>はバスで<ruby>行<rt>い</rt></ruby>きます。<ruby>来月<rt>らいげつ</rt></ruby>JLPTの<ruby>試験<rt>しけん</rt></ruby>がありますから、<ruby>今<rt>いま</rt></ruby>とても<ruby>頑張<rt>がんば</rt></ruby>っています。',
    instruction: 'Read the short passage and answer the question.',
    cleanPrompt: 'この<ruby>人<rt>ひと</rt></ruby>はいつ<ruby>漢字<rt>かんじ</rt></ruby>を<ruby>勉強<rt>べんきょう</rt></ruby>しますか。',
    options: [
      '<ruby>朝<rt>あさ</rt></ruby>ごはんの<ruby>前<rt>まえ</rt></ruby>',
      '<ruby>朝<rt>あさ</rt></ruby>ごはんの<ruby>後<rt>あと</rt></ruby>',
      '<ruby>学校<rt>がっこう</rt></ruby>から<ruby>帰<rt>かえ</rt></ruby>ってから',
      '<ruby>寝<rt>ね</rt></ruby>る<ruby>前<rt>まえ</rt></ruby>'
    ],
    answerIndex: 1,
    explanation: '朝ごはんを食べてから、30分ぐらい漢字を勉強します ("After eating breakfast, I study kanji for about 30 minutes").'
  },
  {
    id: 'e24',
    section: 'reading',
    sectionLabel: 'Reading · Passage 3 (Short Essay)',
    passageTitle: '<ruby>私<rt>わたし</rt></ruby>の<ruby>毎日<rt>まいにち</rt></ruby>',
    passage: '<ruby>私<rt>わたし</rt></ruby>は<ruby>毎日<rt>まいにち</rt></ruby><ruby>六時<rt>ろくじ</rt></ruby>に<ruby>起<rt>お</rt></ruby>きます。<ruby>朝<rt>あさ</rt></ruby>ごはんを<ruby>食<rt>た</rt></ruby>べてから、30<ruby>分<rt>ぷん</rt></ruby>ぐらい<ruby>漢字<rt>かんじ</rt></ruby>を<ruby>勉強<rt>べんきょう</rt></ruby>します。<ruby>学校<rt>がっこう</rt></ruby>まで<ruby>自転車<rt>じてんしゃ</rt></ruby>で20<ruby>分<rt>ぷん</rt></ruby>かかりますが、<ruby>雨<rt>あめ</rt></ruby>の<ruby>日<rt>ひ</rt></ruby>はバスで<ruby>行<rt>い</rt></ruby>きます。<ruby>来月<rt>らいげつ</rt></ruby>JLPTの<ruby>試験<rt>しけん</rt></ruby>がありますから、<ruby>今<rt>いま</rt></ruby>とても<ruby>頑張<rt>がんば</rt></ruby>っています。',
    instruction: 'Read the short passage and answer the question.',
    cleanPrompt: '<ruby>雨<rt>あめ</rt></ruby>の<ruby>日<rt>ひ</rt></ruby>、この<ruby>人<rt>ひと</rt></ruby>はどうやって<ruby>学校<rt>がっこう</rt></ruby>へ<ruby>行<rt>い</rt></ruby>きますか。',
    options: ['<ruby>自転車<rt>じてんしゃ</rt></ruby>で', '<ruby>電車<rt>でんしゃ</rt></ruby>で', 'バスで', '<ruby>歩<rt>ある</rt></ruby>いて'],
    answerIndex: 2,
    explanation: '雨の日はバスで行きます ("On rainy days, I go by bus").'
  }
];
