/* ==========================================================================
   JLPT N5 Core Grammar Curriculum (文法)
   ========================================================================== */
window.NihongoData = window.NihongoData || {};

window.NihongoData.grammar = [
  {
    id: 'g01',
    pattern: 'A は B です / じゃありません',
    kana: 'は 〜 です / じゃありません',
    meaning: 'A is B / A is not B',
    category: 'Basics',
    structure: '[Topic Noun] は [Noun / な-adj] です (affirmative) / じゃありません (negative)',
    explanation: 'The foundational polite sentence pattern in Japanese. は (pronounced "wa") marks the topic of the sentence, and です ends the sentence politely. Past affirmative is でした; past negative is じゃありませんでした (or ではありませんでした in formal writing).',
    jlptTip: 'In written JLPT passages, you will often see ではありません instead of じゃありません — both mean the same thing.',
    examples: [
      {
        jp: '<ruby>私<rt>わたし</rt></ruby>は<ruby>留学生<rt>りゅうがくせい</rt></ruby>です。',
        kana: 'わたしはりゅうがくせいです。',
        romaji: 'Watashi wa ryuugakusei desu.',
        en: 'I am an international student.'
      },
      {
        jp: '<ruby>昨日<rt>きのう</rt></ruby>は<ruby>雨<rt>あめ</rt></ruby>じゃありませんでした。',
        kana: 'きのうはあめじゃありませんでした。',
        romaji: 'Kinou wa ame ja arimasen deshita.',
        en: 'Yesterday was not rainy.'
      }
    ],
    quickCheck: {
      prompt: 'Choose the polite past negative: <ruby>昨日<rt>きのう</rt></ruby>は<ruby>休<rt>やす</rt></ruby>み＿＿＿。',
      options: ['じゃありません', 'でした', 'じゃありませんでした', 'ではありません'],
      answerIndex: 2,
      explanation: '昨日 (yesterday) requires the past tense: じゃありませんでした (was not).'
    }
  },
  {
    id: 'g02',
    pattern: 'A の B',
    kana: 'の',
    meaning: 'Possession, belonging, or noun modification (of / ’s)',
    category: 'Basics',
    structure: '[Noun 1] の [Noun 2]',
    explanation: 'Connects two nouns where Noun 1 modifies or specifies Noun 2. It expresses possession (私の本 = my book), affiliation (東京の大学 = university in Tokyo), or category (日本語の先生 = Japanese teacher).',
    jlptTip: 'の always goes between TWO nouns. Never insert の between an い-adjective and a noun (*高いの本 is wrong!).',
    examples: [
      {
        jp: 'これは<ruby>姉<rt>あね</rt></ruby>のかばんです。',
        kana: 'これはあねのかばんです。',
        romaji: 'Kore wa ane no kaban desu.',
        en: 'This is my older sister’s bag.'
      },
      {
        jp: 'つくえの<ruby>上<rt>うえ</rt></ruby>に<ruby>辞書<rt>じしょ</rt></ruby>があります。',
        kana: 'つくえのうえにじしょがあります。',
        romaji: 'Tsukue no ue ni jisho ga arimasu.',
        en: 'There is a dictionary on top of the desk.'
      }
    ],
    quickCheck: {
      prompt: 'それは<ruby>誰<rt>だれ</rt></ruby>＿＿＿<ruby>傘<rt>かさ</rt></ruby>ですか。',
      options: ['は', 'の', 'を', 'に'],
      answerIndex: 1,
      explanation: '誰の傘 (whose umbrella) connects the pronoun 誰 and the noun 傘 with の.'
    }
  },
  {
    id: 'g03',
    pattern: 'これ・それ・あれ / この・その・あの',
    kana: 'こ・そ・あ (demonstratives)',
    meaning: 'This / that / that over there',
    category: 'Basics',
    structure: 'これ / それ / あれ (standalone pronoun)  |  この / その / あの + [Noun]',
    explanation: 'Japanese demonstratives follow the こ-そ-あ-ど system: こ (near speaker), そ (near listener), あ (far from both), ど (question: どれ / どの). これ/それ/あれ stand alone, whereas この/その/あの MUST be followed immediately by a noun.',
    jlptTip: 'If a noun immediately follows the blank, you MUST pick この/その/あの/どの — never これ/それ/あれ!',
    examples: [
      {
        jp: 'これは<ruby>日本<rt>にほん</rt></ruby>のお<ruby>菓子<rt>かし</rt></ruby>です。',
        kana: 'これはにほんのおかしです。',
        romaji: 'Kore wa Nihon no okashi desu.',
        en: 'This is a Japanese sweet.'
      },
      {
        jp: 'あの<ruby>白<rt>しろ</rt></ruby>い<ruby>建物<rt>たてもの</rt></ruby>は<ruby>病院<rt>びょういん</rt></ruby>です。',
        kana: 'あのしろいたてものはびょういんです。',
        romaji: 'Ano shiroi tatemono wa byouin desu.',
        en: 'That white building over there is a hospital.'
      }
    ],
    quickCheck: {
      prompt: '＿＿＿<ruby>本<rt>ほん</rt></ruby>は<ruby>図書館<rt>としょかん</rt></ruby>のです。',
      options: ['これ', 'この', 'ここ', 'どれ'],
      answerIndex: 1,
      explanation: 'Because the noun 本 follows directly, you must use この (this + noun).'
    }
  },
  {
    id: 'g04',
    pattern: '助詞：を (Direct Object)',
    kana: 'を',
    meaning: 'Marks the direct object of an action verb',
    category: 'Particles',
    structure: '[Object Noun] を [Action Verb]',
    explanation: 'を (pronounced "o") marks the noun that directly receives the action of a transitive verb (食べる, 飲む, 見る, 読む, 買う). It is also used with verbs of leaving or passing through a space (家を出る, 公園を歩く).',
    jlptTip: 'Watch out! 分かる (understand), 好き (like), and ある/いる (exist) take が, NOT を!',
    examples: [
      {
        jp: '<ruby>毎朝<rt>まいあさ</rt></ruby><ruby>新聞<rt>しんぶん</rt></ruby>を<ruby>読<rt>よ</rt></ruby>みます。',
        kana: 'まいあさしんぶんをよみます。',
        romaji: 'Maiasa shinbun wo yomimasu.',
        en: 'I read the newspaper every morning.'
      },
      {
        jp: '<ruby>八時<rt>はちじ</rt></ruby>に<ruby>家<rt>いえ</rt></ruby>を<ruby>出<rt>で</rt></ruby>ます。',
        kana: 'はちじにいえをでます。',
        romaji: 'Hachiji ni ie wo demasu.',
        en: 'I leave home at 8 o’clock.'
      }
    ],
    quickCheck: {
      prompt: '<ruby>駅<rt>えき</rt></ruby>で<ruby>切符<rt>きっぷ</rt></ruby>＿＿＿<ruby>買<rt>か</rt></ruby>いました。',
      options: ['が', 'に', 'を', 'で'],
      answerIndex: 2,
      explanation: '切符 (ticket) is the direct object of 買う (to buy), so it takes を.'
    }
  },
  {
    id: 'g05',
    pattern: '助詞：に (Time, Destination, Target)',
    kana: 'に',
    meaning: 'At (specific time), to (destination), in (existence)',
    category: 'Particles',
    structure: '[Specific Time] に  |  [Place] に 行く/来る  |  [Place] に ある/いる',
    explanation: 'に pinpoints a specific point in time (七時に, 日曜日に, 三月に), a destination of movement (東京に行く), an indirect target (友達に会う), or the static location where something exists (部屋に机がある).',
    jlptTip: 'Do NOT use に after relative time words like 今日, 明日, 昨日, 毎日, 今週, 来年!',
    examples: [
      {
        jp: '<ruby>土曜日<rt>どようび</rt></ruby>に<ruby>友達<rt>ともだち</rt></ruby>に<ruby>会<rt>あ</rt></ruby>います。',
        kana: 'どようびにともだちにあいます。',
        romaji: 'Doyoubi ni tomodachi ni aimasu.',
        en: 'I will meet my friend on Saturday.'
      },
      {
        jp: '<ruby>教室<rt>きょうしつ</rt></ruby>に<ruby>学生<rt>がくせい</rt></ruby>がいます。',
        kana: 'きょうしつにがくせいがいます。',
        romaji: 'Kyoushitsu ni gakusei ga imasu.',
        en: 'There are students in the classroom.'
      }
    ],
    quickCheck: {
      prompt: '<ruby>明日<rt>あした</rt></ruby>、<ruby>九時<rt>くじ</rt></ruby>＿＿＿<ruby>学校<rt>がっこう</rt></ruby>へ<ruby>行<rt>い</rt></ruby>きます。',
      options: ['で', 'を', 'に', 'が'],
      answerIndex: 2,
      explanation: 'Specific clock times like 九時 (9 o’clock) take に.'
    }
  },
  {
    id: 'g06',
    pattern: '助詞：で (Place of Action & Means)',
    kana: 'で',
    meaning: 'At/in (where an action happens); by/with (tool or transport)',
    category: 'Particles',
    structure: '[Place] で [Action Verb]  |  [Tool / Vehicle / Language] で [Verb]',
    explanation: 'で marks WHERE an active event takes place (図書館で勉強する) as well as the MEANS, tool, vehicle, or language used to do something (バスで行く, はしで食べる, 日本語で話す).',
    jlptTip: 'に vs で is the #1 tested particle contrast in N5! Static existence (ある/いる/住む) → に. Dynamic action (食べる/勉強する/遊ぶ) → で.',
    examples: [
      {
        jp: '<ruby>図書館<rt>としょかん</rt></ruby>で<ruby>宿題<rt>しゅくだい</rt></ruby>をしました。',
        kana: 'としょかんでしゅくだいをしました。',
        romaji: 'Toshokan de shukudai wo shimashita.',
        en: 'I did my homework at the library.'
      },
      {
        jp: 'はしで<ruby>寿司<rt>すし</rt></ruby>を<ruby>食<rt>た</rt></ruby>べます。',
        kana: 'はしですしをたべます。',
        romaji: 'Hashi de sushi wo tabemasu.',
        en: 'I eat sushi with chopsticks.'
      }
    ],
    quickCheck: {
      prompt: 'いつも<ruby>自転車<rt>じてんしゃ</rt></ruby>＿＿＿<ruby>駅<rt>えき</rt></ruby>まで<ruby>行<rt>い</rt></ruby>きます。',
      options: ['に', 'で', 'を', 'へ'],
      answerIndex: 1,
      explanation: 'Means of transportation (by bicycle) always takes で.'
    }
  },
  {
    id: 'g07',
    pattern: '〜から 〜まで',
    kana: 'から 〜 まで',
    meaning: 'From ~ to / until ~ (time & space)',
    category: 'Particles',
    structure: '[Start Time/Place] から [End Time/Place] まで',
    explanation: 'から marks the starting point in time or space ("from"), and まで marks the ending point ("until / up to"). Either one can also be used alone.',
    jlptTip: 'Pair から〜まで with かかります (it takes time/money): 家から駅まで十分かかります.',
    examples: [
      {
        jp: '<ruby>授業<rt>じゅぎょう</rt></ruby>は<ruby>九時<rt>くじ</rt></ruby>から<ruby>十二時<rt>じゅうにじ</rt></ruby>までです。',
        kana: 'じゅぎょうはくじからじゅうにじまでです。',
        romaji: 'Jugyou wa kuji kara juuniji made desu.',
        en: 'Class is from 9:00 to 12:00.'
      },
      {
        jp: '<ruby>家<rt>いえ</rt></ruby>から<ruby>会社<rt>かいしゃ</rt></ruby>まで<ruby>電車<rt>でんしゃ</rt></ruby>で30<ruby>分<rt>ぷん</rt></ruby>かかります。',
        kana: 'いえからかいしゃまででんしゃでさんじゅっぷんかかります。',
        romaji: 'Ie kara kaisha made densha de sanjuppun kakarimasu.',
        en: 'It takes 30 minutes by train from home to the company.'
      }
    ],
    quickCheck: {
      prompt: 'この<ruby>店<rt>みせ</rt></ruby>は<ruby>朝<rt>あさ</rt></ruby>10<ruby>時<rt>じ</rt></ruby>＿＿＿<ruby>夜<rt>よる</rt></ruby>9<ruby>時<rt>じ</rt></ruby>までです。',
      options: ['に', 'から', 'へ', 'で'],
      answerIndex: 1,
      explanation: 'から pairs with まで to express "from 10 AM until 9 PM".'
    }
  },
  {
    id: 'g08',
    pattern: 'と / や / も',
    kana: 'と / や / も',
    meaning: 'And (exhaustive) / and (non-exhaustive) / also',
    category: 'Particles',
    structure: 'A と B (complete list) | A や B など (examples) | Noun も (also)',
    explanation: 'と lists every item completely (パンと卵) OR means "together with" a person (友達と行く). や lists representative examples, often paired with など (りんごやバナナなど). も replaces は/が/を to mean "also / too".',
    jlptTip: 'When も is added to は, が, or を, it REPLACES them (私も行きます, NOT *私はも行きます). With に/で/へ, it stacks (日本にも).',
    examples: [
      {
        jp: 'かばんの<ruby>中<rt>なか</rt></ruby>に<ruby>本<rt>ほん</rt></ruby>やノートなどがあります。',
        kana: 'かばんのなかにほんやのーとなどがあります。',
        romaji: 'Kaban no naka ni hon ya nooto nado ga arimasu.',
        en: 'Inside the bag there are things like books and notebooks.'
      },
      {
        jp: '<ruby>山田<rt>やまだ</rt></ruby>さんも<ruby>パーティー<rt>ぱーてぃー</rt></ruby>に<ruby>来<rt>き</rt></ruby>ます。',
        kana: 'やまださんもぱーてぃーにきます。',
        romaji: 'Yamada-san mo paatii ni kimasu.',
        en: 'Yamada-san is also coming to the party.'
      }
    ],
    quickCheck: {
      prompt: '<ruby>机<rt>つくえ</rt></ruby>の<ruby>上<rt>うえ</rt></ruby>にペン＿＿＿<ruby>辞書<rt>じしょ</rt></ruby>などがあります。',
      options: ['も', 'や', 'の', 'を'],
      answerIndex: 1,
      explanation: 'Notice など ("etc.") at the end — や is the natural partner for など.'
    }
  },
  {
    id: 'g09',
    pattern: '〜があります / 〜がいます',
    kana: 'があります / がいます',
    meaning: 'There is / there are (inanimate vs animate)',
    category: 'Existence',
    structure: '[Place] に [Thing] があります  |  [Place] に [Person/Animal] がいます',
    explanation: 'Both express existence ("there is / I have"). Use あります for non-living things, plants, and events (本, 公園, テスト). Use います for living creatures that move on their own (人, 犬, 猫).',
    jlptTip: 'Events like 試験 (exam) or パーティー (party) use あります: 明日テストがあります.',
    examples: [
      {
        jp: '<ruby>庭<rt>にわ</rt></ruby>に<ruby>白<rt>しろ</rt></ruby>い<ruby>猫<rt>ねこ</rt></ruby>がいます。',
        kana: 'にわにしろいねこがいます。',
        romaji: 'Niwa ni shiroi neko ga imasu.',
        en: 'There is a white cat in the garden.'
      },
      {
        jp: '<ruby>駅<rt>えき</rt></ruby>の<ruby>前<rt>まえ</rt></ruby>に<ruby>大きい<rt>おおきい</rt></ruby><ruby>銀行<rt>ぎんこう</rt></ruby>があります。',
        kana: 'えきのまえにおおきいぎんこうがあります。',
        romaji: 'Eki no mae ni ookii ginkou ga arimasu.',
        en: 'There is a big bank in front of the station.'
      }
    ],
    quickCheck: {
      prompt: '<ruby>公園<rt>こうえん</rt></ruby>に<ruby>子供<rt>こども</rt></ruby>が<ruby>三人<rt>さんにん</rt></ruby>＿＿＿。',
      options: ['あります', 'います', 'です', 'します'],
      answerIndex: 1,
      explanation: '子供 (children) are living people, so you must use います.'
    }
  },
  {
    id: 'g10',
    pattern: 'い形容詞・な形容詞の活用',
    kana: 'い-adj & な-adj conjugation',
    meaning: 'Conjugating i-adjectives and na-adjectives',
    category: 'Adjectives',
    structure: 'い-adj: drop い → くない (neg) / かった (past) / くなかった (past neg)\nな-adj: stem + な+Noun / じゃない (neg) / でした (past)',
    explanation: 'い-adjectives conjugate directly at their ending (高い → 高くない → 高かった). な-adjectives behave like nouns and conjugate via です (静かです → 静かじゃありません → 静かでした), adding な before nouns (静かな町).',
    jlptTip: 'Watch the 3 famous traps: いい conjugates from よ- (よくない/よかった); きれい and 有名 are な-adjectives!',
    examples: [
      {
        jp: 'この<ruby>映画<rt>えいが</rt></ruby>はあまり<ruby>面白<rt>おもしろ</rt></ruby>くなかったです。',
        kana: 'このえいがはあまりおもしろくなかったです。',
        romaji: 'Kono eiga wa amari omoshirokunakatta desu.',
        en: 'This movie was not very interesting.'
      },
      {
        jp: '<ruby>昨日<rt>きのう</rt></ruby>のテストはあまり<ruby>簡単<rt>かんたん</rt></ruby>じゃありませんでした。',
        kana: 'きのうのてすとはあまりかんたんじゃありませんでした。',
        romaji: 'Kinou no tesuto wa amari kantan ja arimasen deshita.',
        en: 'Yesterday’s test was not very easy.'
      }
    ],
    quickCheck: {
      prompt: '<ruby>京都<rt>きょうと</rt></ruby>はとても＿＿＿<ruby>町<rt>まち</rt></ruby>です。',
      options: ['きれい', 'きれいな', 'きれいの', 'きれいく'],
      answerIndex: 1,
      explanation: 'きれい is a な-adjective despite ending in い, so it needs な before the noun 町.'
    }
  },
  {
    id: 'g11',
    pattern: 'A より B のほうが 〜',
    kana: 'より 〜 のほうが',
    meaning: 'B is more ~ than A',
    category: 'Adjectives',
    structure: '[Item A] より [Item B] のほうが [Adjective] です',
    explanation: 'Compares two items. The item followed by より is the benchmark ("than A"), and the item followed by のほうが has more of the quality ("B is more...").',
    jlptTip: 'You can flip the order without changing meaning: B のほうが A より 高いです still means B is higher than A!',
    examples: [
      {
        jp: '<ruby>夏<rt>なつ</rt></ruby>より<ruby>冬<rt>ふゆ</rt></ruby>のほうが<ruby>好<rt>す</rt></ruby>きです。',
        kana: 'なつよりふゆのほうがすきです。',
        romaji: 'Natsu yori fuyu no hou ga suki desu.',
        en: 'I like winter more than summer.'
      },
      {
        jp: '<ruby>電車<rt>でんしゃ</rt></ruby>のほうがバスより<ruby>速<rt>はや</rt></ruby>いです。',
        kana: 'でんしゃのほうがばすよりはやいです。',
        romaji: 'Densha no hou ga basu yori hayai desu.',
        en: 'Trains are faster than buses.'
      }
    ],
    quickCheck: {
      prompt: '<ruby>肉<rt>にく</rt></ruby>＿＿＿<ruby>魚<rt>さかな</rt></ruby>のほうが<ruby>安<rt>やす</rt></ruby>いです。',
      options: ['から', 'より', 'まで', 'ほど'],
      answerIndex: 1,
      explanation: 'より means "than", pairing with のほうが to compare meat and fish.'
    }
  },
  {
    id: 'g12',
    pattern: 'A の中で B が一番 〜',
    kana: 'のなかで 〜 がいちばん',
    meaning: 'Among A, B is the most ~ (superlative)',
    category: 'Adjectives',
    structure: '[Category A] の中で [Item B] が 一番 [Adjective] です',
    explanation: 'Expresses the superlative ("the most / #1") out of three or more things. When asking a question, replace B with the appropriate question word (何, どれ, どこ, いつ, だれ).',
    jlptTip: 'Always use が (not は) right before 一番: スポーツの中でサッカーが一番好きです.',
    examples: [
      {
        jp: '<ruby>果物<rt>くだもの</rt></ruby>の<ruby>中<rt>なか</rt></ruby>でりんごが<ruby>一番<rt>いちばん</rt></ruby><ruby>好<rt>す</rt></ruby>きです。',
        kana: 'くだもののなかでりんごがいちばんすきです。',
        romaji: 'Kudamono no naka de ringo ga ichiban suki desu.',
        en: 'Among fruits, I like apples the best.'
      },
      {
        jp: '<ruby>一年<rt>いちねん</rt></ruby>でいつが<ruby>一番<rt>いちばん</rt></ruby><ruby>寒<rt>さむ</rt></ruby>いですか。',
        kana: 'いちねんでいつがいちばんさむいですか。',
        romaji: 'Ichinen de itsu ga ichiban samui desu ka.',
        en: 'When is the coldest time of the year?'
      }
    ],
    quickCheck: {
      prompt: 'クラスの<ruby>中<rt>なか</rt></ruby>で<ruby>田中<rt>たなか</rt></ruby>さん＿＿＿<ruby>一番<rt>いちばん</rt></ruby><ruby>背<rt>せ</rt></ruby>が<ruby>高<rt>たか</rt></ruby>いです。',
      options: ['を', 'に', 'が', 'で'],
      answerIndex: 2,
      explanation: 'In superlative sentences (〜の中で), the #1 item is marked by が.'
    }
  },
  {
    id: 'g13',
    pattern: '〜ませんか / 〜ましょう',
    kana: 'ませんか / ましょう',
    meaning: 'Won’t you ~? (Invitation) / Let’s ~ (Suggestion)',
    category: 'Verbs',
    structure: '[Verb ます-stem] + ませんか (polite invitation)  |  + ましょう (let’s~)  |  + ましょうか (shall I/we~?)',
    explanation: '〜ませんか politely invites someone ("Would you like to...?"). 〜ましょう suggests doing something together ("Let’s...") or accepts an invitation. 〜ましょうか offers help ("Shall I carry that?").',
    jlptTip: 'Watch the reply pattern! Invitation: 一緒に行きませんか → Positive reply: ええ、行きましょう!',
    examples: [
      {
        jp: '<ruby>一緒<rt>いっしょ</rt></ruby>に<ruby>昼<rt>ひる</rt></ruby>ごはんを<ruby>食<rt>た</rt></ruby>べませんか。',
        kana: 'いっしょにひるごはんをたべませんか。',
        romaji: 'Issho ni hirugohan wo tabemasen ka.',
        en: 'Won’t you eat lunch with me?'
      },
      {
        jp: 'その<ruby>荷物<rt>にもつ</rt></ruby>を<ruby>持<rt>も</rt></ruby>ちましょうか。',
        kana: 'そのにもつをもちましょうか。',
        romaji: 'Sono nimotsu wo mochimashou ka.',
        en: 'Shall I carry that luggage for you?'
      }
    ],
    quickCheck: {
      prompt: 'A:「ちょっと<ruby>休<rt>やす</rt></ruby>みませんか。」 B:「ええ、＿＿＿。」',
      options: ['休みますか', '休みましょう', '休みませんでした', '休まないで'],
      answerIndex: 1,
      explanation: 'Accepting a 〜ませんか invitation naturally uses 〜ましょう ("Yes, let’s rest").'
    }
  },
  {
    id: 'g14',
    pattern: '〜てください',
    kana: 'てください',
    meaning: 'Please do ~',
    category: 'Te-Form',
    structure: '[Verb て-form] + ください',
    explanation: 'Makes a polite request or gives instructions. For a negative request ("Please don’t ~"), use [Verb ない-form] + でください.',
    jlptTip: 'Know your Group 1 て-form rules cold! う/つ/る→って, む/ぶ/ぬ→んで, く→いて (except 行く→行って), ぐ→いで, す→して.',
    examples: [
      {
        jp: 'もう少しゆっくり<ruby>話<rt>はな</rt></ruby>してください。',
        kana: 'もうすこしゆっくりはなしてください。',
        romaji: 'Mou sukoshi yukkuri hanashite kudasai.',
        en: 'Please speak a little more slowly.'
      },
      {
        jp: 'ここに<ruby>名前<rt>なまえ</rt></ruby>を<ruby>書<rt>か</rt></ruby>いてください。',
        kana: 'ここになまえをかいてください。',
        romaji: 'Koko ni namae wo kaite kudasai.',
        en: 'Please write your name here.'
      }
    ],
    quickCheck: {
      prompt: '<ruby>辞書<rt>じしょ</rt></ruby>を<ruby>見<rt>み</rt></ruby>＿＿＿ください。(Please do not look at the dictionary.)',
      options: ['て', 'ないで', 'なくて', 'ません'],
      answerIndex: 1,
      explanation: 'Negative request "please do not ~" is [Verb ない-form] + でください → 見ないでください.'
    }
  },
  {
    id: 'g15',
    pattern: '〜ています',
    kana: 'ています',
    meaning: 'Action in progress (-ing) / Resulting state / Habit',
    category: 'Te-Form',
    structure: '[Verb て-form] + います',
    explanation: 'Has three vital N5 uses: (1) ongoing action right now (今食べています = eating now), (2) resulting ongoing state (結婚しています = is married, 住んでいます = lives in), and (3) repeated habit/occupation (毎日走っています).',
    jlptTip: 'With まだ (not yet), always use 〜ていません: まだ昼ごはんを食べていません (I haven’t eaten lunch yet).',
    examples: [
      {
        jp: '<ruby>今<rt>いま</rt></ruby>、<ruby>雨<rt>あめ</rt></ruby>が<ruby>降<rt>ふ</rt></ruby>っています。',
        kana: 'いま、あめがふっています。',
        romaji: 'Ima, ame ga futte imasu.',
        en: 'It is raining right now.'
      },
      {
        jp: '<ruby>兄<rt>あに</rt></ruby>は<ruby>大阪<rt>おおさか</rt></ruby>に<ruby>住<rt>す</rt></ruby>んでいます。',
        kana: 'あにはおおさかにすんでいます。',
        romaji: 'Ani wa Oosaka ni sunde imasu.',
        en: 'My older brother lives in Osaka.'
      }
    ],
    quickCheck: {
      prompt: 'A:「もう<ruby>宿題<rt>しゅくだい</rt></ruby>をしましたか。」 B:「いいえ、まだ＿＿＿。」',
      options: ['しません', 'しませんでした', 'していません', 'しています'],
      answerIndex: 2,
      explanation: 'まだ ("not yet") pairs with 〜ていません to show an action has not yet been completed.'
    }
  },
  {
    id: 'g16',
    pattern: '〜てもいいですか',
    kana: 'てもいいですか',
    meaning: 'May I ~? / Is it okay if I ~?',
    category: 'Te-Form',
    structure: '[Verb て-form] + もいいですか',
    explanation: 'Politely asks for permission. To grant permission: ええ、いいですよ / どうぞ. To politely refuse: すみません、ちょっと…',
    jlptTip: 'Remember that the て-form of ぐ verbs is で, so 泳ぐ becomes 泳いでもいいですか!',
    examples: [
      {
        jp: 'ここで<ruby>写真<rt>しゃしん</rt></ruby>を<ruby>撮<rt>と</rt></ruby>ってもいいですか。',
        kana: 'ここでしゃしんをとってもいいですか。',
        romaji: 'Koko de shashin wo totte mo ii desu ka.',
        en: 'May I take a photo here?'
      },
      {
        jp: 'ボールペンで<ruby>書<rt>か</rt></ruby>いてもいいですか。',
        kana: 'ぼーるぺんでかいてもいいですか。',
        romaji: 'Boorupen de kaite mo ii desu ka.',
        en: 'May I write with a ballpoint pen?'
      }
    ],
    quickCheck: {
      prompt: '<ruby>窓<rt>まど</rt></ruby>を<ruby>開<rt>あ</rt></ruby>けて＿＿＿いいですか。',
      options: ['は', 'も', 'が', 'を'],
      answerIndex: 1,
      explanation: 'Permission uses て + も + いいですか (even if I open it, is it okay?).'
    }
  },
  {
    id: 'g17',
    pattern: '〜てはいけません',
    kana: 'てはいけません',
    meaning: 'Must not ~ / You are not allowed to ~',
    category: 'Te-Form',
    structure: '[Verb て-form] + はいけません',
    explanation: 'Expresses prohibition or rules (common on signs, museum notices, and school rules in JLPT N5 reading passages).',
    jlptTip: 'Contrast permission (〜てもいい) vs prohibition (〜てはいけない / 〜てはいけません).',
    examples: [
      {
        jp: '<ruby>美術館<rt>びじゅつかん</rt></ruby>の<ruby>中<rt>なか</rt></ruby>で<ruby>食<rt>た</rt></ruby>べてはいけません。',
        kana: 'びじゅつかんのなかでたべてはいけません。',
        romaji: 'Bijutsukan no naka de tabete wa ikemasen.',
        en: 'You must not eat inside the art museum.'
      },
      {
        jp: 'ここに<ruby>車<rt>くるま</rt></ruby>を<ruby>止<rt>と</rt></ruby>めてはいけません。',
        kana: 'ここにくるまをとめてはいけません。',
        romaji: 'Koko ni kuruma wo tomete wa ikemasen.',
        en: 'You must not park cars here.'
      }
    ],
    quickCheck: {
      prompt: '<ruby>図書館<rt>としょかん</rt></ruby>で<ruby>大<rt>おお</rt></ruby>きい<ruby>声<rt>こえ</rt></ruby>で<ruby>話<rt>はな</rt></ruby>して＿＿＿。',
      options: ['もいいです', 'ください', 'はいけません', 'から'],
      answerIndex: 2,
      explanation: 'Speaking loudly in a library is prohibited → 話してはいけません.'
    }
  },
  {
    id: 'g18',
    pattern: '〜てから',
    kana: 'てから',
    meaning: 'After doing ~',
    category: 'Te-Form',
    structure: '[Verb 1 て-form] + から、[Verb 2]',
    explanation: 'Indicates a strict sequence of actions: Verb 2 happens AFTER Verb 1 is completed. Unlike 〜て〜, 〜てから emphasizes "only after finishing Action 1".',
    jlptTip: 'Don’t confuse [Verb て-form] + から ("after doing") with [Sentence] + から ("because")!',
    examples: [
      {
        jp: '<ruby>手<rt>て</rt></ruby>を<ruby>洗<rt>あら</rt></ruby>ってからごはんを<ruby>食<rt>た</rt></ruby>べます。',
        kana: 'てをあらってからごはんをたべます。',
        romaji: 'Te wo aratte kara gohan wo tabemasu.',
        en: 'I eat after washing my hands.'
      },
      {
        jp: '<ruby>日本<rt>にほん</rt></ruby>へ<ruby>来<rt>き</rt></ruby>てから、<ruby>日本語<rt>にほんご</rt></ruby>が<ruby>上手<rt>じょうず</rt></ruby>になりました。',
        kana: 'にほんへきてから、にほんごがじょうずになりました。',
        romaji: 'Nihon e kite kara, nihongo ga jouzu ni narimashita.',
        en: 'Since coming to Japan, my Japanese has improved.'
      }
    ],
    quickCheck: {
      prompt: '<ruby>宿題<rt>しゅくだい</rt></ruby>を＿＿＿から、ゲームをします。',
      options: ['する', 'して', 'した', 'します'],
      answerIndex: 1,
      explanation: '〜てから requires the て-form of the verb: してから.'
    }
  },
  {
    id: 'g19',
    pattern: '〜たいです',
    kana: 'たいです',
    meaning: 'Want to do ~',
    category: 'Desire & Ability',
    structure: '[Verb ます-stem] + たいです',
    explanation: 'Expresses the speaker’s own desire to do an action. Conjugates just like an い-adjective! Negative: 〜たくないです. Past: 〜たかったです. Both を and が can mark the object (水が飲みたい / 水を飲みたい).',
    jlptTip: 'For wanting a THING (noun), use [Noun] が欲しいです (ほしいです), NOT たい!',
    examples: [
      {
        jp: '<ruby>来年<rt>らいねん</rt></ruby>、<ruby>北海道<rt>ほっかいどう</rt></ruby>へ<ruby>行<rt>い</rt></ruby>きたいです。',
        kana: 'らいねん、ほっかいどうへいきたいです。',
        romaji: 'Rainen, Hokkaidou e ikitai desu.',
        en: 'I want to go to Hokkaido next year.'
      },
      {
        jp: '<ruby>疲<rt>つか</rt></ruby>れましたから、<ruby>何<rt>なに</rt></ruby>も<ruby>食<rt>た</rt></ruby>べたくないです。',
        kana: 'つかれましたから、なにもたべたくないです。',
        romaji: 'Tsukaremashita kara, nanimo tabetakunai desu.',
        en: 'Because I am tired, I don’t want to eat anything.'
      }
    ],
    quickCheck: {
      prompt: '<ruby>冷<rt>つめ</rt></ruby>たい<ruby>水<rt>みず</rt></ruby>が＿＿＿です。',
      options: ['飲むたい', '飲みたい', '飲んでたい', '飲まないたい'],
      answerIndex: 1,
      explanation: 'Attach たい to the ます-stem: 飲みます → 飲み + たい → 飲みたい.'
    }
  },
  {
    id: 'g20',
    pattern: '〜ことができます',
    kana: 'ことができます',
    meaning: 'Can do ~ / Be able to ~',
    category: 'Desire & Ability',
    structure: '[Verb Dictionary Form] + ことができます',
    explanation: 'Expresses ability or possibility. Turning a verb into a noun phrase with こと ("the act of ~") + ができます ("is possible").',
    jlptTip: 'Always use the DICTIONARY (plain present) form before ことができます — never ます-form or て-form!',
    examples: [
      {
        jp: '<ruby>私<rt>わたし</rt></ruby>はピアノを<ruby>弾<rt>ひ</rt></ruby>くことができます。',
        kana: 'わたしはぴあのをひくことができます。',
        romaji: 'Watashi wa piano wo hiku koto ga dekimasu.',
        en: 'I can play the piano.'
      },
      {
        jp: 'ここでカードを<ruby>使<rt>つか</rt></ruby>うことができますか。',
        kana: 'ここでかーどをつかうことができますか。',
        romaji: 'Koko de kaado wo tsukau koto ga dekimasu ka.',
        en: 'Can I use a credit card here?'
      }
    ],
    quickCheck: {
      prompt: '<ruby>田中<rt>たなか</rt></ruby>さんは<ruby>漢字<rt>かんじ</rt></ruby>をたくさん＿＿＿ことができます。',
      options: ['書いて', '書きます', '書く', '書いた'],
      answerIndex: 2,
      explanation: 'ことができます requires the dictionary form of the verb: 書くことができます.'
    }
  },
  {
    id: 'g21',
    pattern: '〜から (Reason / Because)',
    kana: 'から',
    meaning: 'Because ~ / So ~',
    category: 'Clauses',
    structure: '[Reason Clause] から、[Result Clause]',
    explanation: 'Gives the reason or cause for an action or judgment. In polite conversation, both clauses often stay polite (雨が降っていますから、行きません), or the first clause can use plain form.',
    jlptTip: 'In Japanese, the REASON always comes FIRST before から, and the RESULT comes SECOND!',
    examples: [
      {
        jp: '<ruby>時間<rt>じかん</rt></ruby>がありませんから、タクシーで<ruby>行<rt>い</rt></ruby>きましょう。',
        kana: 'じかんがありませんから、たくしーでいきましょう。',
        romaji: 'Jikan ga arimasen kara, takushii de ikimashou.',
        en: 'Because we don’t have time, let’s go by taxi.'
      },
      {
        jp: 'この<ruby>店<rt>みせ</rt></ruby>は<ruby>安<rt>やす</rt></ruby>くておいしいから、よく<ruby>来<rt>き</rt></ruby>ます。',
        kana: 'このみせはやすくておいしいから、よくきます。',
        romaji: 'Kono mise wa yasukute oishii kara, yoku kimasu.',
        en: 'Because this shop is cheap and delicious, I come often.'
      }
    ],
    quickCheck: {
      prompt: '<ruby>寒<rt>さむ</rt></ruby>いです＿＿＿、<ruby>窓<rt>まど</rt></ruby>を<ruby>閉<rt>し</rt></ruby>めてください。',
      options: ['が', 'から', 'でも', 'より'],
      answerIndex: 1,
      explanation: '寒いです is the reason for closing the window, so から connects them.'
    }
  },
  {
    id: 'g22',
    pattern: '〜前に / 〜後で',
    kana: 'まえに / あとで',
    meaning: 'Before doing ~ / After doing ~',
    category: 'Clauses',
    structure: '[Verb Dictionary Form / Noun の] + 前に\n[Verb た-form / Noun の] + 後で',
    explanation: '前に expresses "before" and ALWAYS takes the dictionary form (even if the main sentence is past tense!). 後で expresses "after" and ALWAYS takes the past た-form.',
    jlptTip: 'HUGE JLPT N5 FAVORITE! Memorize the pair: Dictionary form + 前に  vs  た-form + 後で.',
    examples: [
      {
        jp: '<ruby>寝<rt>ね</rt></ruby>る<ruby>前<rt>まえ</rt></ruby>に、いつも<ruby>本<rt>ほん</rt></ruby>を<ruby>読<rt>よ</rt></ruby>みます。',
        kana: 'ねるまえに、いつもほんをよみます。',
        romaji: 'Neru mae ni, itsumo hon wo yomimasu.',
        en: 'I always read a book before going to sleep.'
      },
      {
        jp: '<ruby>仕事<rt>しごと</rt></ruby>が<ruby>終<rt>お</rt></ruby>わった<ruby>後<rt>あと</rt></ruby>で、<ruby>買<rt>か</rt></ruby>い<ruby>物<rt>もの</rt></ruby>をしました。',
        kana: 'しごとがおわったあとで、かいものをしました。',
        romaji: 'Shigoto ga owatta ato de, kaimono wo shimashita.',
        en: 'After work finished, I went shopping.'
      }
    ],
    quickCheck: {
      prompt: '<ruby>日本<rt>にほん</rt></ruby>へ＿＿＿<ruby>前<rt>まえ</rt></ruby>に、<ruby>日本語<rt>にほんご</rt></ruby>を<ruby>勉強<rt>べんきょう</rt></ruby>しました。',
      options: ['来た', '来る', '来て', '来ます'],
      answerIndex: 1,
      explanation: 'Even though the main verb is past tense, 前に ALWAYS takes the dictionary form: 来る前に.'
    }
  },
  {
    id: 'g23',
    pattern: '〜たり 〜たり する',
    kana: 'たり 〜 たり する',
    meaning: 'Doing things like ~ and ~',
    category: 'Clauses',
    structure: '[Verb 1 た-form]り、[Verb 2 た-form]り します',
    explanation: 'Lists representative actions in no strict chronological order (unlike 〜て〜). Notice that the final する carries the tense of the entire sentence (します / しました / したいです).',
    jlptTip: 'Do NOT forget the final する/します! Leaving out する is a classic N5 mistake.',
    examples: [
      {
        jp: '<ruby>日曜日<rt>にちようび</rt></ruby>は<ruby>掃除<rt>そうじ</rt></ruby>をしたり、<ruby>洗濯<rt>せんたく</rt></ruby>をしたりします。',
        kana: 'にちようびはそうじをしたり、せんたくをしたりします。',
        romaji: 'Nichiyoubi wa souji wo shitari, sentaku wo shitari shimasu.',
        en: 'On Sundays, I do things like cleaning and laundry.'
      },
      {
        jp: '<ruby>昨日<rt>きのう</rt></ruby>は<ruby>映画<rt>えいが</rt></ruby>を<ruby>見<rt>み</rt></ruby>たり、買い物をしたりしました。',
        kana: 'きのうはえいがをみたり、かいものをしたりしました。',
        romaji: 'Kinou wa eiga wo mitari, kaimono wo shitari shimashita.',
        en: 'Yesterday I did things like watching a movie and shopping.'
      }
    ],
    quickCheck: {
      prompt: '<ruby>休<rt>やす</rt></ruby>みの<ruby>日<rt>ひ</rt></ruby>は<ruby>本<rt>ほん</rt></ruby>を<ruby>読<rt>よ</rt></ruby>んだり、<ruby>音楽<rt>おんがく</rt></ruby>を<ruby>聞<rt>き</rt></ruby>いたり＿＿＿。',
      options: ['です', 'します', 'あります', 'なります'],
      answerIndex: 1,
      explanation: '〜たり〜たり always closes with する / します (or しました for past).'
    }
  },
  {
    id: 'g24',
    pattern: '〜のが 好き / 上手 / 下手 です',
    kana: 'のが すき / じょうず / へた',
    meaning: 'Like / good at / bad at [doing ~]',
    category: 'Desire & Ability',
    structure: '[Verb Dictionary Form] + のが [好き / 嫌い / 上手 / 下手 / 速い] です',
    explanation: 'Adding の turns a dictionary-form verb into a noun ("doing ~", like English "-ing"). Then が links it to adjectives like 好き, 上手, 下手, or 速い.',
    jlptTip: 'Check the particle! It is always [Verb-dict] + のが (never をが or ことが here for 好き in standard N5 style, though のが is tested most frequently).',
    examples: [
      {
        jp: '<ruby>私<rt>わたし</rt></ruby>は<ruby>料理<rt>りょうり</rt></ruby>を<ruby>作<rt>つく</rt></ruby>るのが<ruby>好<rt>す</rt></ruby>きです。',
        kana: 'わたしはりょうりをつくるのがすきです。',
        romaji: 'Watashi wa ryouri wo tsukuru no ga suki desu.',
        en: 'I like cooking food.'
      },
      {
        jp: '<ruby>弟<rt>おとうと</rt></ruby>は<ruby>走<rt>はし</rt></ruby>るのがとても<ruby>速<rt>はや</rt></ruby>いです。',
        kana: 'おとうとははしるのがとてもはやいです。',
        romaji: 'Otouto wa hashiru no ga totemo hayai desu.',
        en: 'My younger brother is very fast at running.'
      }
    ],
    quickCheck: {
      prompt: '<ruby>私<rt>わたし</rt></ruby>は<ruby>絵<rt>え</rt></ruby>を＿＿＿のが<ruby>好<rt>す</rt></ruby>きです。',
      options: ['描いて', '描く', '描きます', '描いた'],
      answerIndex: 1,
      explanation: 'Nominalizing with の takes the plain dictionary form: 描くのが好きです.'
    }
  }
];
