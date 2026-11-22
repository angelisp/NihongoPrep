/* ==========================================================================
   JLPT N5 Listening Comprehension Bank (聴解)
   Mondai 1 (Task-Based), Mondai 2 (Key-Point), Mondai 3 (Quick Response)
   ========================================================================== */
window.NihongoData = window.NihongoData || {};

window.NihongoData.listening = [
  // ==================== MONDAI 1: TASK-BASED (課題理解) ====================
  {
    id: 'l01',
    mondai: 'task',
    mondaiLabel: 'Mondai 1 · Task-Based (課題理解)',
    title: 'At the Classroom',
    situation: 'A teacher is giving instructions to students before a short quiz.',
    questionJp: '<ruby>学生<rt>がくせい</rt></ruby>は<ruby>机<rt>つくえ</rt></ruby>の<ruby>上<rt>うえ</rt></ruby>に<ruby>何<rt>なに</rt></ruby>を<ruby>置<rt>お</rt></ruby>きますか。',
    questionKana: 'がくせいはつくえのうえになにをおきますか。',
    questionEn: 'What will the students put on top of their desks?',
    dialogue: [
      {
        speaker: 'Teacher (Man)',
        jp: 'これからテストを<ruby>始<rt>はじ</rt></ruby>めます。<ruby>辞書<rt>じしょ</rt></ruby>と<ruby>教科書<rt>きょうかしょ</rt></ruby>はかばんの<ruby>中<rt>なか</rt></ruby>に<ruby>入<rt>い</rt></ruby>れてください。',
        kana: 'これからてすとをはじめます。じしょときょうかしょはかばんのなかにいれてください。',
        en: 'We will now begin the test. Please put your dictionaries and textbooks inside your bags.'
      },
      {
        speaker: 'Student (Woman)',
        jp: '<ruby>先生<rt>せんせい</rt></ruby>、ペンで<ruby>書<rt>か</rt></ruby>いてもいいですか。',
        kana: 'せんせい、ぺんでかいてもいいですか。',
        en: 'Teacher, may we write with a pen?'
      },
      {
        speaker: 'Teacher (Man)',
        jp: 'いいえ、えんぴつと<ruby>消<rt>け</rt></ruby>しゴムだけ<ruby>机<rt>つくえ</rt></ruby>の<ruby>上<rt>うえ</rt></ruby>に<ruby>置<rt>お</rt></ruby>いてください。',
        kana: 'いいえ、えんぴつとけしごむだけつくえのうえにおいてください。',
        en: 'No, please put only a pencil and an eraser on your desk.'
      }
    ],
    options: [
      { jp: '<ruby>辞書<rt>じしょ</rt></ruby>と<ruby>教科書<rt>きょうかしょ</rt></ruby>', en: 'Dictionary and textbook' },
      { jp: 'ペンとノート', en: 'Pen and notebook' },
      { jp: 'えんぴつと<ruby>消<rt>け</rt></ruby>しゴム', en: 'Pencil and eraser' },
      { jp: 'えんぴつと<ruby>辞書<rt>じしょ</rt></ruby>', en: 'Pencil and dictionary' }
    ],
    answerIndex: 2,
    explanation: 'The teacher rejects pens (いいえ) and says えんぴつと消しゴムだけ机の上に置いてください ("Put ONLY a pencil and eraser on the desk").'
  },
  {
    id: 'l02',
    mondai: 'task',
    mondaiLabel: 'Mondai 1 · Task-Based (課題理解)',
    title: 'Ordering at a Café',
    situation: 'A man and a woman are ordering drinks at a café.',
    questionJp: '<ruby>女<rt>おんな</rt></ruby>の<ruby>人<rt>ひと</rt></ruby>は<ruby>何<rt>なに</rt></ruby>を<ruby>頼<rt>たの</rt></ruby>みますか。',
    questionKana: 'おんなのひとはなにをたのみますか。',
    questionEn: 'What will the woman order?',
    dialogue: [
      {
        speaker: 'Man',
        jp: '<ruby>今日<rt>きょう</rt></ruby>は<ruby>暑<rt>あつ</rt></ruby>いですね。<ruby>私<rt>わたし</rt></ruby>は<ruby>冷<rt>つめ</rt></ruby>たいコーヒーにします。',
        kana: 'きょうはあついですね。わたしはつめたいこーひーにします。',
        en: 'It is hot today, isn’t it? I will have an iced coffee.'
      },
      {
        speaker: 'Woman',
        jp: '<ruby>私<rt>わたし</rt></ruby>も<ruby>冷<rt>つめ</rt></ruby>たい<ruby>飲<rt>の</rt></ruby>み<ruby>物<rt>もの</rt></ruby>がいいです。オレンジジュースにしようかな。',
        kana: 'わたしもつめたいのみものがいいです。おれんじじゅーすにしようかな。',
        en: 'I want a cold drink too. Maybe I will get orange juice.'
      },
      {
        speaker: 'Clerk (Man)',
        jp: 'すみません、オレンジジュースは<ruby>今日<rt>きょう</rt></ruby>ありません。りんごジュースならあります。',
        kana: 'すみません、おれんじじゅーすはきょうありません。りんごじゅーすならあります。',
        en: 'Excuse me, we don’t have orange juice today. We do have apple juice.'
      },
      {
        speaker: 'Woman',
        jp: 'じゃあ、りんごジュースをください。',
        kana: 'じゃあ、りんごじゅーすをください。',
        en: 'Then please give me apple juice.'
      }
    ],
    options: [
      { jp: '<ruby>冷<rt>つめ</rt></ruby>たいコーヒー', en: 'Iced coffee' },
      { jp: 'オレンジジュース', en: 'Orange juice' },
      { jp: 'りんごジュース', en: 'Apple juice' },
      { jp: '<ruby>温<rt>あたた</rt></ruby>かいお<ruby>茶<rt>ちゃ</rt></ruby>', en: 'Hot tea' }
    ],
    answerIndex: 2,
    explanation: 'Watch the classic JLPT twist! She first considers orange juice, but it is sold out, so she switches to りんごジュース (apple juice).'
  },
  {
    id: 'l03',
    mondai: 'task',
    mondaiLabel: 'Mondai 1 · Task-Based (課題理解)',
    title: 'Before Leaving the Office',
    situation: 'A manager talks to an employee before going home.',
    questionJp: '<ruby>男<rt>おとこ</rt></ruby>の<ruby>人<rt>ひと</rt></ruby>はこの<ruby>後<rt>あと</rt></ruby>、まず<ruby>何<rt>なに</rt></ruby>をしますか。',
    questionKana: 'おとこのひとはこのあと、まずなにをしますか。',
    questionEn: 'What will the man do FIRST after this?',
    dialogue: [
      {
        speaker: 'Woman',
        jp: '<ruby>佐藤<rt>さとう</rt></ruby>さん、もう<ruby>六時<rt>ろくじ</rt></ruby>ですよ。<ruby>帰<rt>かえ</rt></ruby>りましょうか。',
        kana: 'さとうさん、もうろくじですよ。かえりましょうか。',
        en: 'Sato-san, it’s already 6 o’clock. Shall we go home?'
      },
      {
        speaker: 'Man',
        jp: 'あ、<ruby>帰<rt>かえ</rt></ruby>る<ruby>前<rt>まえ</rt></ruby>にエアコンを<ruby>消<rt>け</rt></ruby>して、<ruby>窓<rt>まど</rt></ruby>を<ruby>閉<rt>し</rt></ruby>めましょう。',
        kana: 'あ、かえるまえにえあこんをけして、まどをしめましょう。',
        en: 'Oh, before going home let’s turn off the AC and close the windows.'
      },
      {
        speaker: 'Woman',
        jp: '<ruby>窓<rt>まど</rt></ruby>はさっき<ruby>私<rt>わたし</rt></ruby>が<ruby>閉<rt>し</rt></ruby>めましたよ。エアコンだけお<ruby>願<rt>ねが</rt></ruby>いします。',
        kana: 'まどはさっきわたしがしめましたよ。えあこんだけおねがいします。',
        en: 'I already closed the windows earlier. Please just take care of the AC.'
      },
      {
        speaker: 'Man',
        jp: 'わかりました。すぐ<ruby>消<rt>け</rt></ruby>します。',
        kana: 'わかりました。すぐけします。',
        en: 'Understood. I will turn it off right away.'
      }
    ],
    options: [
      { jp: '<ruby>窓<rt>まど</rt></ruby>を<ruby>閉<rt>し</rt></ruby>める', en: 'Close the window' },
      { jp: 'エアコンを<ruby>消<rt>け</rt></ruby>す', en: 'Turn off the air conditioner' },
      { jp: '<ruby>電気<rt>でんき</rt></ruby>をつける', en: 'Turn on the lights' },
      { jp: '<ruby>電話<rt>でんわ</rt></ruby>をかける', en: 'Make a phone call' }
    ],
    answerIndex: 1,
    explanation: 'The woman already closed the windows (さっき私が閉めました), so the man only needs to turn off the air conditioner (エアコンを消す).'
  },
  {
    id: 'l04',
    mondai: 'task',
    mondaiLabel: 'Mondai 1 · Task-Based (課題理解)',
    title: 'Borrowing Books at the Library',
    situation: 'A student speaks to a librarian.',
    questionJp: '<ruby>学生<rt>がくせい</rt></ruby>は<ruby>本<rt>ほん</rt></ruby>を<ruby>何冊<rt>なんさつ</rt></ruby><ruby>借<rt>か</rt></ruby>りますか。',
    questionKana: 'がくせいはほんをなんさつかりますか。',
    questionEn: 'How many books will the student borrow?',
    dialogue: [
      {
        speaker: 'Man',
        jp: 'すみません、この<ruby>本<rt>ほん</rt></ruby>を<ruby>借<rt>か</rt></ruby>りたいんですが。',
        kana: 'すみません、このほんをかりたいんですが。',
        en: 'Excuse me, I would like to borrow these books.'
      },
      {
        speaker: 'Staff (Woman)',
        jp: 'はい。<ruby>全部<rt>ぜんぶ</rt></ruby>で<ruby>六冊<rt>ろくさつ</rt></ruby>ですね。すみませんが、<ruby>一人<rt>ひとり</rt></ruby><ruby>五冊<rt>ごさつ</rt></ruby>までです。',
        kana: 'はい。ぜんぶでろくさつですね。すみませんが、ひとりごさつまでです。',
        en: 'Okay. There are 6 books in total. Sorry, but the limit is 5 books per person.'
      },
      {
        speaker: 'Man',
        jp: 'そうですか。じゃあ、この<ruby>二冊<rt>にさつ</rt></ruby>は<ruby>今度<rt>こんど</rt></ruby>にします。',
        kana: 'そうですか。じゃあ、このにさつはこんどにします。',
        en: 'I see. Well then, I’ll leave these two books for next time.'
      }
    ],
    options: [
      { jp: '<ruby>二冊<rt>にさつ</rt></ruby>', en: '2 books' },
      { jp: '<ruby>四冊<rt>よんさつ</rt></ruby>', en: '4 books' },
      { jp: '<ruby>五冊<rt>ごさつ</rt></ruby>', en: '5 books' },
      { jp: '<ruby>六冊<rt>ろくさつ</rt></ruby>', en: '6 books' }
    ],
    answerIndex: 1,
    explanation: 'He brought 6 books (六冊), the limit is 5, and he decides to leave 2 for next time (二冊は今度にします): 6 − 2 = 4 books (四冊)!'
  },
  {
    id: 'l05',
    mondai: 'task',
    mondaiLabel: 'Mondai 1 · Task-Based (課題理解)',
    title: 'Weekend Shopping List',
    situation: 'A mother asks her son to buy groceries at the supermarket.',
    questionJp: '<ruby>男<rt>おとこ</rt></ruby>の<ruby>子<rt>こ</rt></ruby>は<ruby>何<rt>なに</rt></ruby>を<ruby>買<rt>か</rt></ruby>いますか。',
    questionKana: 'おとこのこはなにをかいますか。',
    questionEn: 'What will the boy buy?',
    dialogue: [
      {
        speaker: 'Mother (Woman)',
        jp: 'スーパーへ<ruby>行<rt>い</rt></ruby>って、<ruby>牛乳<rt>ぎゅうにゅう</rt></ruby>と<ruby>卵<rt>たまご</rt></ruby>を<ruby>買<rt>か</rt></ruby>ってきてくれる？',
        kana: 'すーぱーへいって、ぎゅうにゅうとたまごをかってきてくれる？',
        en: 'Could you go to the supermarket and buy milk and eggs?'
      },
      {
        speaker: 'Man',
        jp: 'うん、いいよ。パンはいらない？',
        kana: 'うん、いいよ。ぱんはいらない？',
        en: 'Sure. Don’t we need bread?'
      },
      {
        speaker: 'Mother (Woman)',
        jp: 'パンはまだあるよ。あ、<ruby>卵<rt>たまご</rt></ruby>も<ruby>冷蔵庫<rt>れいぞうこ</rt></ruby>にあった！<ruby>牛乳<rt>ぎゅうにゅう</rt></ruby>とりんごを<ruby>買<rt>か</rt></ruby>ってきて。',
        kana: 'ぱんはまだあるよ。あ、たまごもれいぞうこにあった！ぎゅうにゅうとりんごをかってきて。',
        en: 'We still have bread. Oh, we actually have eggs in the fridge too! Buy milk and apples instead.'
      }
    ],
    options: [
      { jp: '<ruby>牛乳<rt>ぎゅうにゅう</rt></ruby>と<ruby>卵<rt>たまご</rt></ruby>', en: 'Milk and eggs' },
      { jp: '<ruby>牛乳<rt>ぎゅうにゅう</rt></ruby>とパン', en: 'Milk and bread' },
      { jp: '<ruby>牛乳<rt>ぎゅうにゅう</rt></ruby>とりんご', en: 'Milk and apples' },
      { jp: '<ruby>卵<rt>たまご</rt></ruby>とりんご', en: 'Eggs and apples' }
    ],
    answerIndex: 2,
    explanation: 'She notices they already have bread and eggs, so the final list is 牛乳とりんご (milk and apples).'
  },

  // ==================== MONDAI 2: KEY-POINT (ポイント理解) ====================
  {
    id: 'l06',
    mondai: 'keypoint',
    mondaiLabel: 'Mondai 2 · Key-Point (ポイント理解)',
    title: 'Meeting Time on Sunday',
    situation: 'Two friends are deciding what time to meet at the station.',
    questionJp: '<ruby>二人<rt>ふたり</rt></ruby>は<ruby>何時<rt>なんじ</rt></ruby>に<ruby>駅<rt>えき</rt></ruby>で<ruby>会<rt>あ</rt></ruby>いますか。',
    questionKana: 'ふたりはなんじにえきであいますか。',
    questionEn: 'What time will the two friends meet at the station?',
    dialogue: [
      {
        speaker: 'Woman',
        jp: '<ruby>日曜日<rt>にちようび</rt></ruby>の<ruby>映画<rt>えいが</rt></ruby>は<ruby>十時<rt>じゅうじ</rt></ruby><ruby>半<rt>はん</rt></ruby>からですね。',
        kana: 'にちようびのえいがはじゅうじはんからですね。',
        en: 'Sunday’s movie starts at 10:30, right?'
      },
      {
        speaker: 'Man',
        jp: 'はい。<ruby>十時<rt>じゅうじ</rt></ruby>に<ruby>駅<rt>えき</rt></ruby>で<ruby>会<rt>あ</rt></ruby>いましょうか。',
        kana: 'はい。じゅうじにえきであいましょうか。',
        en: 'Yes. Shall we meet at the station at 10:00?'
      },
      {
        speaker: 'Woman',
        jp: '<ruby>映画館<rt>えいがかん</rt></ruby>まで<ruby>歩<rt>ある</rt></ruby>いて<ruby>十五分<rt>じゅうごふん</rt></ruby>かかりますし、<ruby>切符<rt>きっぷ</rt></ruby>も<ruby>買<rt>か</rt></ruby>いますから、<ruby>九時<rt>くじ</rt></ruby><ruby>半<rt>はん</rt></ruby>はどうですか。',
        kana: 'えいがかんまであるいてじゅうごふんかかりますし、きっぷもかいますから、くじはんはどうですか。',
        en: 'It’s a 15-minute walk to the theater and we need to buy tickets too, so how about 9:30?'
      },
      {
        speaker: 'Man',
        jp: 'いいですね。<ruby>九時<rt>くじ</rt></ruby><ruby>半<rt>はん</rt></ruby>にしましょう。',
        kana: 'いいですね。くじはんにしましょう。',
        en: 'Sounds good. Let’s make it 9:30.'
      }
    ],
    options: [
      { jp: '<ruby>九時<rt>くじ</rt></ruby>', en: '9:00' },
      { jp: '<ruby>九時<rt>くじ</rt></ruby><ruby>半<rt>はん</rt></ruby>', en: '9:30' },
      { jp: '<ruby>十時<rt>じゅうじ</rt></ruby>', en: '10:00' },
      { jp: '<ruby>十時<rt>じゅうじ</rt></ruby><ruby>半<rt>はん</rt></ruby>', en: '10:30' }
    ],
    answerIndex: 1,
    explanation: 'The movie is at 10:30, the man suggests 10:00, and they agree on 九時半 (9:30).'
  },
  {
    id: 'l07',
    mondai: 'keypoint',
    mondaiLabel: 'Mondai 2 · Key-Point (ポイント理解)',
    title: 'How Much Is the Bag?',
    situation: 'A customer asks about the price of a bag at a department store.',
    questionJp: '<ruby>黒<rt>くろ</rt></ruby>いかばんはいくらですか。',
    questionKana: 'くろいかばんはいくらですか。',
    questionEn: 'How much is the black bag?',
    dialogue: [
      {
        speaker: 'Woman',
        jp: 'すみません、この<ruby>白<rt>しろ</rt></ruby>いかばんはいくらですか。',
        kana: 'すみません、このしろいかばんはいくらですか。',
        en: 'Excuse me, how much is this white bag?'
      },
      {
        speaker: 'Staff (Man)',
        jp: '<ruby>白<rt>しろ</rt></ruby>いのは<ruby>三千円<rt>さんぜんえん</rt></ruby>です。となりの<ruby>黒<rt>くろ</rt></ruby>いのは<ruby>五百円<rt>ごひゃくえん</rt></ruby><ruby>安<rt>やす</rt></ruby>いですよ。',
        kana: 'しろいのはさんぜんえんです。となりのくろいのはごひゃくえんやすいですよ。',
        en: 'The white one is 3,000 yen. The black one next to it is 500 yen cheaper.'
      },
      {
        speaker: 'Woman',
        jp: 'そうですか。じゃあ、<ruby>黒<rt>くろ</rt></ruby>いのをください。',
        kana: 'そうですか。じゃあ、くろいのをください。',
        en: 'I see. Then I’ll take the black one please.'
      }
    ],
    options: [
      { jp: '2,000<ruby>円<rt>えん</rt></ruby>', en: '2,000 yen' },
      { jp: '2,500<ruby>円<rt>えん</rt></ruby>', en: '2,500 yen' },
      { jp: '3,000<ruby>円<rt>えん</rt></ruby>', en: '3,000 yen' },
      { jp: '3,500<ruby>円<rt>えん</rt></ruby>', en: '3,500 yen' }
    ],
    answerIndex: 1,
    explanation: 'The white bag is 三千円 (3,000 yen), and the black one is 五百円安い (500 yen cheaper) → 2,500 yen!'
  },
  {
    id: 'l08',
    mondai: 'keypoint',
    mondaiLabel: 'Mondai 2 · Key-Point (ポイント理解)',
    title: 'Commuting to School',
    situation: 'Two classmates talk about how they get to school.',
    questionJp: '<ruby>男<rt>おとこ</rt></ruby>の<ruby>人<rt>ひと</rt></ruby>は<ruby>今日<rt>きょう</rt></ruby>どうやって<ruby>学校<rt>がっこう</rt></ruby>へ<ruby>来<rt>き</rt></ruby>ましたか。',
    questionKana: 'おとこのひとはきょうどうやってがっこうへきましたか。',
    questionEn: 'How did the man come to school TODAY?',
    dialogue: [
      {
        speaker: 'Woman',
        jp: '<ruby>田中<rt>たなか</rt></ruby>さんはいつも<ruby>自転車<rt>じてんしゃ</rt></ruby>で<ruby>学校<rt>がっこう</rt></ruby>へ<ruby>来<rt>き</rt></ruby>ますね。',
        kana: 'たなかさんはいつもじてんしゃでがっこうへきますね。',
        en: 'Tanaka-san, you always come to school by bicycle, don’t you?'
      },
      {
        speaker: 'Man',
        jp: 'ええ。でも、<ruby>今日<rt>きょう</rt></ruby>は<ruby>朝<rt>あさ</rt></ruby>から<ruby>雨<rt>あめ</rt></ruby>が<ruby>降<rt>ふ</rt></ruby>っていましたから、バスで<ruby>来<rt>き</rt></ruby>ました。',
        kana: 'ええ。でも、きょうはあさからあめがふっていましたから、ばすできました。',
        en: 'Yes. However, because it was raining since morning today, I came by bus.'
      },
      {
        speaker: 'Woman',
        jp: 'そうですか。<ruby>私<rt>わたし</rt></ruby>は<ruby>駅<rt>えき</rt></ruby>から<ruby>歩<rt>ある</rt></ruby>いて<ruby>来<rt>き</rt></ruby>ました。',
        kana: 'そうですか。わたしはえきからあるいてきました。',
        en: 'I see. I walked from the station.'
      }
    ],
    options: [
      { jp: '<ruby>自転車<rt>じてんしゃ</rt></ruby>で', en: 'By bicycle' },
      { jp: '<ruby>電車<rt>でんしゃ</rt></ruby>で', en: 'By train' },
      { jp: 'バスで', en: 'By bus' },
      { jp: '<ruby>歩<rt>ある</rt></ruby>いて', en: 'On foot' }
    ],
    answerIndex: 2,
    explanation: 'He usually bikes (いつも自転車), but TODAY (今日) it rained so he took the bus (バスで来ました).'
  },
  {
    id: 'l09',
    mondai: 'keypoint',
    mondaiLabel: 'Mondai 2 · Key-Point (ポイント理解)',
    title: 'Where Is the Umbrella?',
    situation: 'A man is looking for his umbrella at home.',
    questionJp: '<ruby>男<rt>おとこ</rt></ruby>の<ruby>人<rt>ひと</rt></ruby>の<ruby>傘<rt>かさ</rt></ruby>はどこにありますか。',
    questionKana: 'おとこのひとのかさはどこにありますか。',
    questionEn: 'Where is the man’s umbrella?',
    dialogue: [
      {
        speaker: 'Man',
        jp: 'あれ、<ruby>私<rt>わたし</rt></ruby>の<ruby>青<rt>あお</rt></ruby>い<ruby>傘<rt>かさ</rt></ruby>がないなあ。<ruby>玄関<rt>げんかん</rt></ruby>にないよ。',
        kana: 'あれ、わたしのあおいかさがないなあ。げんかんにないよ。',
        en: 'Huh, my blue umbrella isn’t here. It’s not in the entryway.'
      },
      {
        speaker: 'Woman',
        jp: '<ruby>昨日<rt>きのう</rt></ruby>、<ruby>会社<rt>かいしゃ</rt></ruby>に<ruby>忘<rt>わす</rt></ruby>れたんじゃない？',
        kana: 'きのう、かいしゃにわすれたんじゃない？',
        en: 'Didn’t you forget it at the office yesterday?'
      },
      {
        speaker: 'Man',
        jp: 'いや、<ruby>夜<rt>よる</rt></ruby><ruby>帰<rt>かえ</rt></ruby>るとき<ruby>使<rt>つか</rt></ruby>ったよ。あ！<ruby>部屋<rt>へや</rt></ruby>のテーブルの<ruby>下<rt>した</rt></ruby>にあった！',
        kana: 'いや、よるかえるときつかったよ。あ！へやのてーぶるのしたにあった！',
        en: 'No, I used it coming home at night. Oh! There it is, under the table in the room!'
      }
    ],
    options: [
      { jp: '<ruby>玄関<rt>げんかん</rt></ruby>', en: 'In the entryway' },
      { jp: '<ruby>会社<rt>かいしゃ</rt></ruby>', en: 'At the company' },
      { jp: 'テーブルの<ruby>上<rt>うえ</rt></ruby>', en: 'On top of the table' },
      { jp: 'テーブルの<ruby>下<rt>した</rt></ruby>', en: 'Under the table' }
    ],
    answerIndex: 3,
    explanation: 'He finds it at the end: 部屋のテーブルの下にあった ("It was under the table in the room").'
  },
  {
    id: 'l10',
    mondai: 'keypoint',
    mondaiLabel: 'Mondai 2 · Key-Point (ポイント理解)',
    title: 'Favorite Season',
    situation: 'Two friends talk about Japanese seasons.',
    questionJp: '<ruby>女<rt>おんな</rt></ruby>の<ruby>人<rt>ひと</rt></ruby>はどの<ruby>季節<rt>きせつ</rt></ruby>が<ruby>一番<rt>いちばん</rt></ruby><ruby>好<rt>す</rt></ruby>きですか。',
    questionKana: 'おんなのひとはどのきせつがいちばんすきですか。',
    questionEn: 'Which season does the woman like the best?',
    dialogue: [
      {
        speaker: 'Man',
        jp: 'リンさんは<ruby>日本<rt>にほん</rt></ruby>の<ruby>季節<rt>きせつ</rt></ruby>の<ruby>中<rt>なか</rt></ruby>で、いつが<ruby>一番<rt>いちばん</rt></ruby><ruby>好<rt>す</rt></ruby>きですか。',
        kana: 'りんさんはにほんのきせつのなかで、いつがいちばんすきですか。',
        en: 'Lin-san, among Japan’s seasons, which do you like the best?'
      },
      {
        speaker: 'Woman',
        jp: '<ruby>春<rt>はる</rt></ruby>は<ruby>桜<rt>さくら</rt></ruby>がきれいですね。でも、<ruby>私<rt>わたし</rt></ruby>は<ruby>秋<rt>あき</rt></ruby>が<ruby>一番<rt>いちばん</rt></ruby><ruby>好<rt>す</rt></ruby>きです。<ruby>涼<rt>すず</rt></ruby>しくて<ruby>食べ物<rt>たべもの</rt></ruby>がおいしいですから。',
        kana: 'はるはさくらがきれいですね。でも、わたしはあきがいちばんすきです。すずしくてたべものがおいしいですから。',
        en: 'In spring the cherry blossoms are pretty. However, I like autumn the best because it is cool and the food is delicious.'
      }
    ],
    options: [
      { jp: '<ruby>春<rt>はる</rt></ruby>', en: 'Spring' },
      { jp: '<ruby>夏<rt>なつ</rt></ruby>', en: 'Summer' },
      { jp: '<ruby>秋<rt>あき</rt></ruby>', en: 'Autumn' },
      { jp: '<ruby>冬<rt>ふゆ</rt></ruby>', en: 'Winter' }
    ],
    answerIndex: 2,
    explanation: 'Watch out for でも ("however"): she compliments spring first, then states 私は秋が一番好きです (I like autumn the best).'
  },

  // ==================== MONDAI 3: QUICK RESPONSE (即時応答) ====================
  {
    id: 'l11',
    mondai: 'response',
    mondaiLabel: 'Mondai 3 · Quick Response (即時応答)',
    title: 'Responding to an Invitation',
    situation: 'Listen to the friend’s prompt and pick the most natural reply.',
    questionJp: '<ruby>正<rt>ただ</rt></ruby>しい<ruby>返事<rt>へんじ</rt></ruby>を<ruby>選<rt>えら</rt></ruby>んでください。',
    questionKana: 'ただしいへんじをえらんでください。',
    questionEn: 'Choose the most natural response to the spoken line.',
    dialogue: [
      {
        speaker: 'Woman',
        jp: 'あした、<ruby>一緒<rt>いっしょ</rt></ruby>にテニスをしませんか。',
        kana: 'あした、いっしょにてにすをしませんか。',
        en: 'Won’t you play tennis together tomorrow?'
      }
    ],
    options: [
      { jp: 'ええ、いいですね。<ruby>何時<rt>なんじ</rt></ruby>にしますか。', en: 'Yes, sounds great! What time shall we make it?' },
      { jp: 'いいえ、テニスをしました。', en: 'No, I played tennis.' },
      { jp: 'はい、とても<ruby>高<rt>たか</rt></ruby>いです。', en: 'Yes, it is very expensive.' },
      { jp: 'どういたしまして。', en: 'You’re welcome.' }
    ],
    answerIndex: 0,
    explanation: '〜ませんか is a polite invitation. ええ、いいですね ("Yes, that sounds great") is the natural positive response.'
  },
  {
    id: 'l12',
    mondai: 'response',
    mondaiLabel: 'Mondai 3 · Quick Response (即時応答)',
    title: 'Offering Help',
    situation: 'Someone sees you carrying heavy bags and speaks to you.',
    questionJp: '<ruby>正<rt>ただ</rt></ruby>しい<ruby>返事<rt>へんじ</rt></ruby>を<ruby>選<rt>えら</rt></ruby>んでください。',
    questionKana: 'ただしいへんじをえらんでください。',
    questionEn: 'Choose the most natural response to the spoken line.',
    dialogue: [
      {
        speaker: 'Man',
        jp: 'その<ruby>荷物<rt>にもつ</rt></ruby>、<ruby>重<rt>おも</rt></ruby>そうですね。<ruby>持<rt>も</rt></ruby>ちましょうか。',
        kana: 'そのにもつ、おもそうですね。もちましょうか。',
        en: 'That luggage looks heavy. Shall I carry it for you?'
      }
    ],
    options: [
      { jp: 'はい、<ruby>持<rt>も</rt></ruby>ちましょう。', en: 'Yes, let’s hold it.' },
      { jp: 'すみません、お<ruby>願<rt>ねが</rt></ruby>いします。', en: 'Thank you (sorry to trouble you), yes please.' },
      { jp: 'いってらっしゃい。', en: 'Have a safe trip out.' },
      { jp: 'ごちそうさまでした。', en: 'Thank you for the meal.' }
    ],
    answerIndex: 1,
    explanation: 'When someone offers help with 〜ましょうか ("Shall I...?"), accept politely with すみません、お願いします (or ありがとうございます).'
  },
  {
    id: 'l13',
    mondai: 'response',
    mondaiLabel: 'Mondai 3 · Quick Response (即時応答)',
    title: 'Asking Permission',
    situation: 'A classmate asks to borrow your dictionary.',
    questionJp: '<ruby>正<rt>ただ</rt></ruby>しい<ruby>返事<rt>へんじ</rt></ruby>を<ruby>選<rt>えら</rt></ruby>んでください。',
    questionKana: 'ただしいへんじをえらんでください。',
    questionEn: 'Choose the most natural response to the spoken line.',
    dialogue: [
      {
        speaker: 'Woman',
        jp: 'すみません、ちょっとその<ruby>辞書<rt>じしょ</rt></ruby>を<ruby>借<rt>か</rt></ruby>りてもいいですか。',
        kana: 'すみません、ちょっとそのじしょをかりてもいいですか。',
        en: 'Excuse me, may I borrow that dictionary for a moment?'
      }
    ],
    options: [
      { jp: 'ええ、どうぞ。<ruby>使<rt>つか</rt></ruby>ってください。', en: 'Yes, go ahead. Please use it.' },
      { jp: 'はい、<ruby>借<rt>か</rt></ruby>りました。', en: 'Yes, I borrowed it.' },
      { jp: 'いいえ、<ruby>辞書<rt>じしょ</rt></ruby>です。', en: 'No, it is a dictionary.' },
      { jp: 'お<ruby>元気<rt>げんき</rt></ruby>ですか。', en: 'How are you?' }
    ],
    answerIndex: 0,
    explanation: 'Granting permission to 〜てもいいですか naturally uses ええ、どうぞ ("Yes, please go ahead").'
  },
  {
    id: 'l14',
    mondai: 'response',
    mondaiLabel: 'Mondai 3 · Quick Response (即時応答)',
    title: 'Checking Completion',
    situation: 'A friend asks if you have finished lunch.',
    questionJp: '<ruby>正<rt>ただ</rt></ruby>しい<ruby>返事<rt>へんじ</rt></ruby>を<ruby>選<rt>えら</rt></ruby>んでください。',
    questionKana: 'ただしいへんじをえらんでください。',
    questionEn: 'Choose the most natural response to the spoken line.',
    dialogue: [
      {
        speaker: 'Man',
        jp: 'もう<ruby>昼<rt>ひる</rt></ruby>ごはんを<ruby>食<rt>た</rt></ruby>べましたか。',
        kana: 'もうひるごはんをたべましたか。',
        en: 'Have you eaten lunch already?'
      }
    ],
    options: [
      { jp: 'はい、まだです。', en: 'Yes, not yet.' },
      { jp: 'いいえ、まだ<ruby>食<rt>た</rt></ruby>べていません。', en: 'No, I haven’t eaten yet.' },
      { jp: 'いいえ、もう<ruby>食<rt>た</rt></ruby>べました。', en: 'No, I already ate.' },
      { jp: 'ええ、<ruby>食<rt>た</rt></ruby>べませんでした。', en: 'Yes, I didn’t eat.' }
    ],
    answerIndex: 1,
    explanation: 'The classic N5 pair: もう〜ましたか (already done?) → negative reply いいえ、まだ〜ていません (No, not yet).'
  }
];
