/* GOKAKU NAVI — 英語 過去問演習（共通テスト/基礎レベル）
   語彙 3・熟語 2・文法 4・整序 2・会話文 1・長文 3 = 15 枚（level: 'basic'）。
   共通テスト〜教科書章末レベルの形式（空所補充・語句整序・会話文・長文読解）に合わせた、すべて書き下ろしのオリジナル問題です。
   長文（ep-basic-01〜03）は同じファイルで JK.registerPassages に登録しています。 */
(function () {
  'use strict';
  const R = String.raw;
  const SRC = function () { return { univ: 'オリジナル' }; };

  /* ================================================================
   *  長文（passage）
   * ================================================================ */
  JK.registerPassages([
    /* ---------- ep-basic-01: ホームステイの思い出（体験談）---------- */
    {
      id: 'ep-basic-01',
      title: 'A Summer with a Host Family',
      level: 'basic',
      topic: '留学・異文化体験',
      source: SRC(),
      paras: [
        [
          { en: R`Last summer, I stayed with a host family in Canada for two weeks.`, ja: R`去年の夏、私はカナダのホストファミリーのもとに 2 週間滞在した。` },
          { en: R`I was very nervous when I arrived at their house.`, ja: R`彼らの家に着いたとき、私はとても緊張していた。` },
          { en: R`My English was not good, and I was afraid {b1:of} making mistakes.`, ja: R`私の英語はあまりうまくなく、間違いをするのが怖かった。` }
        ],
        [
          { en: R`However, my host mother, Sarah, gave me a warm smile and said, "You are one of the family now."`, ja: R`しかし、ホストマザーのサラは私に温かい笑顔を向け、「あなたはもう家族の一員よ」と言ってくれた。` },
          { en: R`Her words made me feel {b2:much} better.`, ja: R`その言葉で、私の気持ちはずっと楽になった。` },
          { en: R`Every evening, we cooked dinner together.`, ja: R`毎晩、私たちは一緒に夕食を作った。` },
          { en: R`Sarah taught me how to make pancakes, and I showed her how to use chopsticks.`, ja: R`サラは私にパンケーキの作り方を教えてくれ、私は彼女にはしの使い方を教えた。` },
          { en: R`One day, I made miso soup for the family.`, ja: R`ある日、私は家族のためにみそ汁を作った。` },
          { en: R`They had never tasted it before, {b3:but} they all liked it.`, ja: R`彼らはそれを一度も味わったことがなかったが、みんな気に入ってくれた。` }
        ],
        [
          { en: R`After that, I was not nervous any more.`, ja: R`それ以来、私はもう緊張しなくなった。` },
          { en: R`I talked with the family a lot, and my English got better day by day.`, ja: R`私は家族とたくさん話し、英語は日ごとに上達した。` },
          { en: R`On the last day, Sarah hugged me and said, "Please come back soon."`, ja: R`最後の日、サラは私を抱きしめて、「また近いうちに来てね」と言った。` }
        ],
        [
          { en: R`I learned two important things from this trip.`, ja: R`私はこの旅から 2 つの大切なことを学んだ。` },
          { en: R`First, {u4:you do not have to speak perfect English to make friends}.`, ja: R`第一に、友達を作るのに完璧な英語を話す必要はない。` },
          { en: R`Second, a few kind words can make a big difference.`, ja: R`第二に、いくつかの優しい言葉が大きな違いを生むことがある。` },
          { en: R`I hope to see my host family again someday.`, ja: R`いつかまたホストファミリーに会いたいと思っている。` }
        ]
      ],
      vocab: ['host', 'nervous', 'mistake', 'warm', 'hug', 'difference', 'chopsticks']
    },

    /* ---------- ep-basic-02: 紙の本と電子書籍（意見文）---------- */
    {
      id: 'ep-basic-02',
      title: 'Paper Books or E-books?',
      level: 'basic',
      topic: 'メディア・読書',
      source: SRC(),
      paras: [
        [
          { en: R`Many students today read books on tablets or smartphones.`, ja: R`今日、多くの生徒がタブレットやスマートフォンで本を読んでいる。` },
          { en: R`These electronic books, or e-books, have some good points.`, ja: R`こうした電子書籍、つまり e ブックには、いくつかの長所がある。` },
          { en: R`First, you can carry hundreds of books in one small device.`, ja: R`第一に、1 台の小さな機器に何百冊もの本を入れて持ち運ぶことができる。` },
          { en: R`Second, you can make the letters bigger when the print is hard to read.`, ja: R`第二に、印刷が読みにくいときには、文字を大きくすることができる。` },
          { en: R`Third, you can buy a new book in a few seconds, even at midnight.`, ja: R`第三に、真夜中でも、数秒で新しい本を買うことができる。` }
        ],
        [
          { en: R`{b1:However}, many people still prefer paper books.`, ja: R`しかし、今でも紙の本のほうを好む人は多い。` },
          { en: R`Reading on a screen for a long time can make your eyes tired.`, ja: R`長時間画面で読書をすると、目が疲れることがある。` },
          { en: R`{b2:In addition}, a paper book never runs out of battery.`, ja: R`さらに、紙の本は電池切れを起こすことがない。` },
          { en: R`Some readers also say that they remember a story better when they read it on paper.`, ja: R`紙で読んだほうが物語をよく覚えていられると言う読者もいる。` },
          { en: R`{u3:This} may be because they can see how much of the book is left.`, ja: R`これは、本があとどれくらい残っているかが目で見てわかるからかもしれない。` }
        ],
        [
          { en: R`Which is better, then?`, ja: R`では、どちらがよいのだろうか。` },
          { en: R`I think it depends {b4:on} the situation.`, ja: R`それは状況によると私は思う。` },
          { en: R`When I travel, I read e-books because they are light.`, ja: R`旅行のときは、軽いので電子書籍を読む。` },
          { en: R`At home, however, I enjoy paper books before I go to bed.`, ja: R`しかし家では、寝る前に紙の本を楽しむ。` },
          { en: R`The most important thing is to enjoy reading in your own way.`, ja: R`いちばん大切なのは、自分なりの方法で読書を楽しむことだ。` }
        ]
      ],
      vocab: ['electronic', 'device', 'print', 'prefer', 'battery', 'situation']
    },

    /* ---------- ep-basic-03: 海岸清掃のボランティア（社会・環境）---------- */
    {
      id: 'ep-basic-03',
      title: 'Cleaning Our Beach',
      level: 'basic',
      topic: '環境・地域活動',
      source: SRC(),
      paras: [
        [
          { en: R`Every first Sunday of the month, about fifty volunteers gather at Hikari Beach to pick up trash.`, ja: R`毎月第 1 日曜日、約 50 人のボランティアがヒカリ海岸に集まり、ごみを拾っている。` },
          { en: R`The group began five years ago, when a high school student named Rina found many plastic bottles and bags on the sand.`, ja: R`そのグループは 5 年前、リナという高校生が砂浜でたくさんのペットボトルやビニール袋を見つけたときに始まった。` },
          { en: R`She was very {b1:shocked}, so she asked her friends to help her clean the beach.`, ja: R`彼女はとてもショックを受け、友達に海岸の掃除を手伝ってくれるよう頼んだ。` }
        ],
        [
          { en: R`At first, only five people came.`, ja: R`最初は、5 人しか来なかった。` },
          { en: R`However, the number of volunteers {b2:increased} little by little because many people saw her photos on the Internet.`, ja: R`しかし、多くの人がインターネットで彼女の写真を見たため、ボランティアの数は少しずつ増えていった。` },
          { en: R`Now, people of all ages join the activity, from small children to elderly people.`, ja: R`今では、小さな子どもから高齢の人まで、あらゆる年齢の人がその活動に参加している。` },
          { en: R`{u3:They} collect about one hundred bags of trash in two hours.`, ja: R`彼らは 2 時間で、約 100 袋のごみを集める。` }
        ],
        [
          { en: R`After the work, they sort the trash into three groups: burnable, plastic, and metal.`, ja: R`作業のあと、彼らはごみを燃えるごみ、プラスチック、金属の 3 つに分別する。` },
          { en: R`The members say that cleaning the beach is not only good for nature {b4:but} also fun.`, ja: R`メンバーたちは、海岸の掃除は自然のためになるだけでなく、楽しくもあると言う。` },
          { en: R`They talk, laugh, and make new friends while working.`, ja: R`彼らは作業をしながら、話し、笑い、新しい友達をつくる。` }
        ],
        [
          { en: R`Rina is now a university student, but she still comes to the beach every month.`, ja: R`リナは今では大学生だが、今も毎月海岸に来ている。` },
          { en: R`She says that anyone can take part {b5:in} the activity.`, ja: R`彼女は、だれでもその活動に参加できると言う。` },
          { en: R`"You do not need special skills," she says. "You only need a bag and a little time."`, ja: R`「特別な技術は必要ありません」と彼女は言う。「必要なのは袋と、少しの時間だけです」` }
        ]
      ],
      vocab: ['volunteer', 'gather', 'trash', 'plastic', 'sort', 'skill', 'shocked'],
      vocabExtra: [
        ['shocked', '形', '衝撃を受けた; ショックを受けた', 2]
      ]
    }
  ]);

  /* ================================================================
   *  問題カード
   * ================================================================ */
  JK.registerProblems([
    /* ================= e-vocab（語彙）================= */
    {
      id: 'e-basic-vocab-01',
      subject: 'english',
      level: 'basic',
      unit: 'e-vocab',
      title: '語彙：動詞を文脈で選ぶ',
      source: SRC(),
      time: 5,
      body: R`次の各文の空所に入れるのに最も適切なものを、それぞれ 1 つずつ選びなさい。`,
      fig: null,
      parts: [
        {
          label: '問1',
          q: R`After the heavy rain, many trains were (    ), and we had to wait at the station for two hours.`,
          type: 'choice',
          choices: ['invented', 'delayed', 'reduced', 'protected'],
          answer: 1,
          explain: R`**delay** は「〜を遅らせる」という動詞で、be delayed の形で「（電車などが）遅れる」を表します。「大雨のあと多くの電車が遅れて、駅で 2 時間待たなければならなかった」という意味になります。invent（発明する）、reduce（減らす）、protect（守る）では文意が通りません。`
        },
        {
          label: '問2',
          q: R`Ms. Sato asked us to (    ) our opinions in the class discussion, so I raised my hand.`,
          type: 'choice',
          choices: ['escape', 'excuse', 'expect', 'express'],
          answer: 3,
          explain: R`**express** は「〜を表現する; 〜を述べる」です。express one's opinion で「意見を述べる」となり、「話し合いで意見を言うよう先生に言われたので手を挙げた」という流れに合います。escape（逃げる）、excuse（許す）、expect（期待する）は our opinions を目的語にしても意味が通りません。`
        },
        {
          label: '問3',
          q: R`Please (    ) the form with your name and address, and give it to the clerk.`,
          type: 'choice',
          choices: ['complete', 'compare', 'contain', 'consider'],
          answer: 0,
          explain: R`**complete** は「〜を完成させる; 〜に記入する」です。complete the form で「用紙に必要事項を記入する」となります。compare（比較する）、contain（含む）、consider（よく考える）は、「記入して係員に渡す」という流れに合いません。`
        },
        {
          label: '問4',
          q: R`My uncle (    ) a small machine that can wash vegetables quickly. He is going to sell it next year.`,
          type: 'choice',
          choices: ['borrowed', 'discovered', 'invented', 'destroyed'],
          answer: 2,
          explain: R`**invent** は「〜を発明する」です。「野菜をすばやく洗える小さな機械を考え出し、来年売る予定だ」という文脈に合います。discover は「（もともとあるものを）発見する」で、機械のように人が作り出すものには使いません。borrowed（借りた）、destroyed（壊した）は sell it とつながりません。`
        },
        {
          label: '問5',
          q: R`We (    ) a lot of money for the trip by working part-time.`,
          type: 'choice',
          choices: ['lost', 'wasted', 'borrowed', 'earned'],
          answer: 3,
          explain: R`**earn** は「（働いて）〜を稼ぐ」です。by working part-time（アルバイトをして）とあるので、「旅行のためにたくさんのお金を稼いだ」となります。lose（失う）、waste（無駄にする）、borrow（借りる）は、働くことで結果が出る内容と合いません。`
        }
      ],
      solution: [
        {
          t: '空所の前後から動作のイメージをつかむ',
          n: R`語彙の空所補充は、文脈に合う意味の語を選ぶ問題です。まず空所に入る動作を日本語で考えます。問1 は「電車が（　）、2 時間待った」→「遅れた」、問2 は「意見を（　）ために手を挙げた」→「述べる」、問5 は「アルバイトをして（　）」→「稼いだ」と見当をつけてから、選択肢の英単語と照らし合わせます。`,
          easy: R`空所に入る動作を、まず**日本語で予想**しましょう。「電車が（　）、2 時間待った」なら、「遅れた」が入りそうです。予想と同じ意味の英単語を選択肢から探せば、迷わずに選べます。`,
          pro: R`共通テストでは、選択肢の動詞が ex- や re- など同じ語頭でそろえられ、見た目で選べないことがよくあります。語頭ではなく意味で、選択肢を 1 つずつ空所に入れて確かめる習慣をつけましょう。`
        },
        {
          t: '今回の重要動詞',
          n: R`delay（〜を遅らせる; be delayed で「遅れる」）、express（〜を表現する）、complete（〜を完成させる; 〜に記入する）、invent（〜を発明する）、earn（〜を稼ぐ）です。目的語とセットの例文（delay a flight / express an opinion / complete a form / invent a machine / earn money）で覚えます。`,
          easy: R`・**delay**: 予定より遅らせる → be delayed で「（電車などが）遅れる」
・**express**: 気持ちを外に出す → 「表現する; 述べる」
・**complete**: 最後まで仕上げる → 「完成させる; 記入する」
・**invent**: 新しいものを作り出す → 「発明する」
・**earn**: 働いてお金を得る → 「稼ぐ」`,
          lv: 2
        },
        {
          t: '紛らわしい語を区別する',
          n: R`invent は人が新しく作り出すもの（機械・道具）に、discover はもともとあるもの（新しい星・事実・場所）を見つけるときに使います。また earn は「働いて得る」、win は「勝って得る」、gain は「だんだんと手に入れる」と使い分けます。`,
          easy: R`「発明」と「発見」は日本語でも似ていますが、**作り出すなら invent、見つけるなら discover** と分けて覚えましょう。`,
          lv: 2
        }
      ],
      tags: ['語彙', '動詞', '文脈']
    },

    {
      id: 'e-basic-vocab-02',
      subject: 'english',
      level: 'basic',
      unit: 'e-vocab',
      title: '語彙：名詞・形容詞',
      source: SRC(),
      time: 5,
      body: R`次の各文の空所に入れるのに最も適切なものを、それぞれ 1 つずつ選びなさい。`,
      fig: null,
      parts: [
        {
          label: '問1',
          q: R`Please send me (    ) about the school festival, such as the date and place.`,
          type: 'choice',
          choices: ['invitation', 'imagination', 'information', 'instruction'],
          answer: 2,
          explain: R`**information**（情報）は数えられない名詞で、冠詞なしで使えます。such as the date and place（日付や場所など）と続くので、「文化祭についての情報を送ってください」となります。invitation（招待状）は数えられる名詞で a や an が必要、imagination（想像）や instruction（指示）では「日付や場所」の説明になりません。`
        },
        {
          label: '問2',
          q: R`It is (    ) for people to drink enough water in hot weather.`,
          type: 'choice',
          choices: ['important', 'impossible', 'impressive', 'independent'],
          answer: 0,
          explain: R`**important** は「大切な」で、It is important for 人 to do で「人が〜することは大切だ」を表します。「暑い日には十分に水を飲むことが大切だ」という意味になります。impossible（不可能な）、impressive（印象的な）、independent（自立した）では文意が通りません。`
        },
        {
          label: '問3',
          q: R`The restaurant was so (    ) that we had to wait for an hour to get a table.`,
          type: 'choice',
          choices: ['empty', 'crowded', 'private', 'nervous'],
          answer: 1,
          explain: R`**crowded** は「混雑した」です。「1 時間待たないと席に座れなかった」ほどなので、店は混んでいたことがわかります。empty（空いている）は反対の意味、private（私的な）や nervous（緊張した）は店の様子を表す語として不適切です。`
        },
        {
          label: '問4',
          q: R`Jim is a very (    ) boy. He always tells the truth, even when it is difficult.`,
          type: 'choice',
          choices: ['lazy', 'shy', 'nervous', 'honest'],
          answer: 3,
          explain: R`**honest** は「正直な」です。「たとえ難しいときでもいつも本当のことを言う」という説明にぴったり合います。lazy（怠け者の）、shy（内気な）、nervous（緊張した）は、本当のことを言うという説明と関係がありません。`
        },
        {
          label: '問5',
          q: R`In Japan, the number of (    ) people is increasing, so more nursing care services are needed.`,
          type: 'choice',
          choices: ['central', 'female', 'elderly', 'digital'],
          answer: 2,
          explain: R`**elderly** は「年配の; 高齢の」です。「介護サービスがもっと必要とされている」とあるので、増えているのは高齢者だと考えられます。central（中心の）、female（女性の）、digital（デジタルの）は、介護サービスが必要になる理由として自然ではありません。`
        }
      ],
      solution: [
        {
          t: '名詞・形容詞は「説明の言葉」を手がかりにする',
          n: R`空所の後ろに理由や言いかえが続いていることがよくあります。問4 の「いつも本当のことを言う」は honest の説明、問3 の「1 時間待たなければ席につけなかった」は crowded の理由になっています。説明部分を日本語にして、空所の語の意味を推理します。`,
          easy: R`空所の語のヒントは、**同じ文や次の文の「くわしい説明」**にあります。Jim が「いつも本当のことを言う」なら、どんな男の子か考えてみましょう。「正直な (honest)」が自然に浮かびます。`,
          pro: R`選択肢にはしばしば、語頭や形が似た語（invitation / imagination / information / instruction など）が並びます。語尾 -tion の名詞は数が多いので、意味を 1 つずつ区別して覚えましょう。`
        },
        {
          t: '今回の重要語',
          n: R`information（情報; 数えられない名詞）、important（大切な）、crowded（混雑した）、honest（正直な）、elderly（年配の; 高齢の）です。It is important for 人 to do のような決まった型や、the number of ~ is increasing のようなよく出る言い回しも一緒に押さえます。`,
          easy: R`・**information** は「情報」。数えられないので、an information とは言いません。
・**crowded** は「人がたくさんいて混んでいる」様子、反対は empty（空いている）。
・**elderly** は「年配の」を表すていねいな言い方です。`,
          lv: 2
        },
        {
          t: '数えられない名詞に注意する',
          n: R`information / advice / homework / furniture などは数えられない名詞で、a や an をつけず、複数形にもしません。数えるときは a piece of information のように言います。`,
          easy: R`「情報」「宿題」のようなものは、1 個 2 個と**数えられません**。そのため、**a** をつけたり、**s** をつけたりしないのが決まりです。`,
          lv: 3
        }
      ],
      tags: ['語彙', '名詞', '形容詞']
    },

    {
      id: 'e-basic-vocab-03',
      subject: 'english',
      level: 'basic',
      unit: 'e-vocab',
      title: '語彙：同意語・反意語・派生語',
      source: SRC(),
      time: 5,
      body: R`次の問いに答えなさい。`,
      fig: null,
      parts: [
        {
          label: '問1',
          q: R`次の英文の太字の語に最も近い意味を表す語を選びなさい。

She **purchased** a new bicycle yesterday.`,
          type: 'choice',
          choices: ['sold', 'bought', 'repaired', 'borrowed'],
          answer: 1,
          explain: R`**purchase** は「〜を購入する」という意味で、**buy** とほぼ同じです（buy のほうが日常的で、purchase はやや硬い語）。sold は「売った」、repaired は「修理した」、borrowed は「借りた」です。`
        },
        {
          label: '問2',
          q: R`次の英文の太字の語を言いかえたものとして最も適切なものを選びなさい。

We have to **reduce** the amount of garbage.`,
          type: 'choice',
          choices: ['make it bigger', 'make it cleaner', 'make it smaller', 'make it faster'],
          answer: 2,
          explain: R`**reduce** は「〜を減らす」で、make ~ smaller（〜を小さく[少なく]する）と言いかえられます。「ごみの量を減らさなければならない」という意味です。bigger は反対の意味、cleaner（きれいに）と faster（速く）は reduce の意味ではありません。`
        },
        {
          label: '問3',
          q: R`空所に入る最も適切な語を選びなさい。

The noun form of "decide" is (    ).`,
          type: 'choice',
          choices: ['decided', 'deciding', 'decisive', 'decision'],
          answer: 3,
          explain: R`decide（決める）の名詞形は **decision**（決定; 決心）です。make a decision で「決心する」。decisive は「決定的な」という形容詞、decided は過去形・過去分詞、deciding は -ing 形で、名詞形ではありません。`
        },
        {
          label: '問4',
          q: R`次の語と反対の意味を表す語を選びなさい。

**increase**（動詞: 増える）`,
          type: 'choice',
          choices: ['decrease', 'improve', 'include', 'invite'],
          answer: 0,
          explain: R`increase（増える）の反意語は **decrease**（減る）です。名詞でも an increase（増加）⇔ a decrease（減少）と対になります。improve（良くなる）、include（含む）、invite（招く）は、増減を表す語ではありません。`
        },
        {
          label: '問5',
          q: R`空所に入る最も適切な語を選びなさい。

She has a good (    ) of humor, so everyone enjoys talking with her.`,
          type: 'choice',
          choices: ['feeling', 'sense', 'thought', 'sight'],
          answer: 1,
          explain: R`a sense of humor で「ユーモアのセンス」です。sense は「感覚; 分別」で、a sense of ~ の形でよく使います。feeling（感情）、thought（考え）、sight（視力; 光景）は、of humor と結びつきません。`
        }
      ],
      solution: [
        {
          t: '同意語・反意語は「意味の核」で考える',
          n: R`purchase = buy、reduce = make smaller、increase ⇔ decrease のように、語の意味を 1 つのイメージにまとめておくと、言いかえ問題が解きやすくなります。`,
          easy: R`単語は**ペア（同じ意味・反対の意味）**で覚えると効率的です。「買う」は buy と purchase、「増える ⇔ 減る」は increase と decrease、とセットで頭に入れましょう。`,
          pro: R`言いかえ問題の選択肢は、文全体を言いかえた形（make it smaller など）で出ることがあります。太字の語を日本語に直し、その日本語に最も近い選択肢を選びましょう。`
        },
        {
          t: '品詞転換は語尾で見分ける',
          n: R`decide（動詞）→ decision（名詞）→ decisive（形容詞）のように、語尾が変わると品詞が変わります。-ion / -ment / -ness は名詞、-ive / -ful / -ous は形容詞を作る代表的な語尾です。`,
          easy: R`単語の最後の形を見れば、**名詞か形容詞か**がだいたいわかります。-ion で終われば名詞（decision）、-ive で終われば形容詞（decisive）です。`,
          lv: 2
        },
        {
          t: '決まった組み合わせ（コロケーション）',
          n: R`a sense of humor（ユーモアのセンス）、make a decision（決心する）、a large amount of ~（大量の〜）のように、語どうしには相性のよい組み合わせがあります。空所の前後の語から、組み合わせを思い出して選びます。`,
          easy: R`言葉には「**いつもいっしょに使う仲間**」がいます。「sense」には「of humor」、「decision」には「make」、というふうに、仲間ごと覚えると、空所補充が速く解けます。`,
          lv: 3
        }
      ],
      tags: ['語彙', '同意語', '反意語', '派生語']
    },

    /* ================= e-idiom（熟語）================= */
    {
      id: 'e-basic-idiom-01',
      subject: 'english',
      level: 'basic',
      unit: 'e-idiom',
      title: '熟語：動詞を含む熟語',
      source: SRC(),
      time: 5,
      body: R`次の各問いに答えなさい。`,
      fig: null,
      parts: [
        {
          label: '問1',
          q: R`空所に入る最も適切なものを選びなさい。

Our team will (    ) in the city marathon next month.`,
          type: 'choice',
          choices: ['take care', 'take place', 'take part', 'take time'],
          answer: 2,
          explain: R`**take part in ~** で「〜に参加する」です。「私たちのチームは来月、市のマラソンに参加する」という意味になります。take care は of とセット（〜の世話をする）、take place は「（行事が）行われる」で、主語がイベントのときに使います。take time は「時間がかかる」です。`
        },
        {
          label: '問2',
          q: R`空所に入る最も適切なものを選びなさい。

We have (    ) of milk. I will go to the supermarket.`,
          type: 'choice',
          choices: ['run away', 'run out', 'run into', 'run over'],
          answer: 1,
          explain: R`**run out of ~** で「〜を使い果たす; 〜がなくなる」です。have run out of milk で「牛乳を切らしてしまった」となり、「スーパーに行く」という続きにも合います。run away は「逃げる」、run into は「〜に偶然出会う」、run over は「〜をひく」で、of milk とつながりません。`
        },
        {
          label: '問3',
          q: R`空所に入る最も適切なものを選びなさい。

I cannot (    ) with my neighbor. He is always noisy.`,
          type: 'choice',
          choices: ['get over', 'get off', 'get up', 'get along'],
          answer: 3,
          explain: R`**get along with ~** で「〜と仲良くやっていく」です。「隣人はいつもうるさくて、うまくやっていけない」という意味になります。get over は「〜を乗り越える」、get off は「（乗り物から）降りる」、get up は「起きる」で、with my neighbor とつながりません。`
        },
        {
          label: '問4',
          q: R`空所に入る最も適切なものを選びなさい。

Do not (    ) until tomorrow what you can do today.`,
          type: 'choice',
          choices: ['put off', 'put on', 'put up', 'put out'],
          answer: 0,
          explain: R`**put off ~** は「〜を延期する; 先延ばしにする」です。「今日できることを明日まで延ばしてはいけない」という有名なことわざです。put on は「身につける」、put up は「（建てる; 掲げる）」、put out は「（火などを）消す」です。`
        },
        {
          label: '問5',
          q: R`次の英文の太字部分の意味として最も適切なものを選びなさい。

My father **gave up** smoking last year.`,
          type: 'choice',
          choices: ['〜を始めた', '〜をやめた', '〜を続けた', '〜を楽しんだ'],
          answer: 1,
          explain: R`**give up ~** は「〜をあきらめる; 〜をやめる」です。give up doing の形で「〜するのをやめる」を表し、「父は去年、タバコをやめた」という意味になります。`
        }
      ],
      solution: [
        {
          t: '熟語は動詞 + 副詞・前置詞のセットで覚える',
          n: R`take part in ~（参加する）、run out of ~（使い果たす）、get along with ~（仲良くやっていく）、put off ~（延期する）、give up ~（やめる）は、どれも「動詞 + 小さな語」で 1 つの意味になる句動詞です。空所の前後の語（in / of / with）も、熟語を見抜く手がかりになります。`,
          easy: R`熟語は、**英語のかたまり**をまるごと日本語の意味と結びつけて覚えます。「run out of」は「ラン・アウト・オブ」と声に出して、「〜を使い果たす」とセットにしましょう。空所の後ろにある of や with も、大きなヒントです。`,
          pro: R`空所の後ろに of / with / in などの前置詞が残っている場合、その前置詞と結びつく熟語は 1 つしかないことがほとんどです。選択肢をすべて読む前に、前置詞から候補を絞り込みましょう。`
        },
        {
          t: '今回の熟語のまとめ',
          n: R`・take part in ~: 〜に参加する
・run out of ~: 〜を使い果たす
・get along with ~: 〜と仲良くやっていく
・put off ~: 〜を延期する
・give up (doing): （〜するのを）やめる`,
          easy: R`・take **part** in: 部分（part）として加わる → 参加する
・run **out** of: 外（out）へ走り出てなくなる → 使い果たす
・get **along** with: 一緒に前へ進む → 仲良くやっていく`,
          lv: 2
        },
        {
          t: '似た形の熟語の区別',
          n: R`take part in（参加する）と take place（行われる）、take care of（世話をする）は、どれも take で始まりますが、意味も主語も違います。take place は「イベントが」主語、take part in は「人が」主語になる点も区別のポイントです。`,
          easy: R`take から始まる熟語はたくさんあります。**後ろの語（part / place / care）で意味が決まる**ので、セットで覚えましょう。`,
          lv: 3
        }
      ],
      tags: ['熟語', '句動詞']
    },

    {
      id: 'e-basic-idiom-02',
      subject: 'english',
      level: 'basic',
      unit: 'e-idiom',
      title: '熟語：前置詞を含む熟語',
      source: SRC(),
      time: 5,
      body: R`次の各文の空所に入れるのに最も適切なものを、それぞれ 1 つずつ選びなさい。`,
      fig: null,
      parts: [
        {
          label: '問1',
          q: R`(    ) of the heavy rain, the baseball game was held as planned.`,
          type: 'choice',
          choices: ['Because', 'Instead', 'In spite', 'In front'],
          answer: 2,
          explain: R`**in spite of ~** で「〜にもかかわらず」です。「大雨にもかかわらず、野球の試合は予定どおり行われた」という意味になります。because of は「〜のために」で、大雨が原因で予定どおり行われた、では意味が通りません。instead of は「〜の代わりに」、in front of は「〜の前に」です。`
        },
        {
          label: '問2',
          q: R`She is (    ) at playing the piano.`,
          type: 'choice',
          choices: ['good', 'well', 'nice', 'best'],
          answer: 0,
          explain: R`**be good at ~** で「〜が得意だ」です。「彼女はピアノをひくのが得意だ」となります。well は副詞なので be 動詞の後ろの補語にはなりません（She plays the piano well. なら可）。nice や best は at と結びつきません。`
        },
        {
          label: '問3',
          q: R`Tom is famous (    ) his delicious cooking.`,
          type: 'choice',
          choices: ['as', 'of', 'with', 'for'],
          answer: 3,
          explain: R`**be famous for ~** で「〜で有名だ」です。後ろに有名な理由（おいしい料理）が続きます。be famous as ~ は「〜として有名だ」で、後ろには立場や職業（a chef など）が来ます。`
        },
        {
          label: '問4',
          q: R`(    ) to the weather report, it will be sunny tomorrow.`,
          type: 'choice',
          choices: ['Because', 'According', 'Thanks', 'Except'],
          answer: 1,
          explain: R`**according to ~** で「〜によると」です。「天気予報によると、明日は晴れだ」という意味になります。because of や thanks to は理由を表しますが、天気予報が明日の晴れの原因ではありません。Except は to を伴う熟語になりません（except for ~ なら可）。`
        },
        {
          label: '問5',
          q: R`I will have tea (    ) of coffee.`,
          type: 'choice',
          choices: ['front', 'spite', 'instead', 'addition'],
          answer: 2,
          explain: R`**instead of ~** で「〜の代わりに」です。「コーヒーの代わりに紅茶をいただきます」という意味になります。in front of は「〜の前に」、in spite of は「〜にもかかわらず」、in addition to は「〜に加えて」で、どれも前に in が必要なうえ、意味も合いません。`
        }
      ],
      solution: [
        {
          t: '前置詞とセットの熟語は、後ろの語から決める',
          n: R`空所の後ろに of / at / for / to が残っているときは、それと結びつく熟語を探します。in spite of ~、be good at ~、be famous for ~、according to ~、instead of ~ のように、「前の語 + 前置詞」がセットになっています。`,
          easy: R`熟語の問題は、**空所の後ろにある小さな言葉（of / at / for / to）**がヒントです。「（　）of the heavy rain」なら、of とセットになる言葉を探します。`,
          pro: R`because of / in spite of / instead of / in addition to のような群前置詞は、「of / to で終わる」点も含めてセットで暗記します。空所補充では、of か to かだけで候補を絞れることがあります。`
        },
        {
          t: '意味が反対の熟語に注意する',
          n: R`because of ~（〜のために）と in spite of ~（〜にもかかわらず）は、原因と逆接という正反対の関係を表します。文の前半と後半が「順接」か「逆接」かを考えて選びます。「大雨 → 試合は予定どおり行われた」は逆接なので in spite of です。`,
          easy: R`「雨のせいで中止」なら because of、「雨なのに開催」なら in spite of です。**原因と結果が自然につながるか、意外な結果か**を考えましょう。`,
          lv: 2
        },
        {
          t: '今回の熟語のまとめ',
          n: R`・in spite of ~: 〜にもかかわらず
・be good at ~: 〜が得意だ
・be famous for ~: 〜で有名だ（be famous as ~ は「〜として有名だ」）
・according to ~: 〜によると
・instead of ~: 〜の代わりに`,
          easy: R`・**in spite of**: despite（〜にもかかわらず）と同じ意味。「雨なのに」「疲れているのに」のように、予想と反対のことが起きたときに使います。
・**instead of**: 「〜の代わりに」。tea instead of coffee は「コーヒーではなくて紅茶」ということです。`,
          lv: 2
        }
      ],
      tags: ['熟語', '前置詞', '群前置詞']
    },

    /* ================= e-grammar（文法）================= */
    {
      id: 'e-basic-grammar-01',
      subject: 'english',
      level: 'basic',
      unit: 'e-grammar',
      title: '文法：時制の基本',
      source: SRC(),
      time: 5,
      body: R`次の各文の空所に入れるのに最も適切なものを、それぞれ 1 つずつ選びなさい。`,
      fig: null,
      parts: [
        {
          label: '問1',
          q: R`Tom and I (    ) friends since we were in elementary school.`,
          type: 'choice',
          choices: ['are', 'were', 'have been', 'will be'],
          answer: 2,
          explain: R`**have been**（現在完了）が入ります。since we were in elementary school（小学生のときから）は、「過去のある時点から現在まで」ずっと続いていることを表すので、現在完了形の have been を使います。「トムと私は小学生のときからずっと友達だ」という意味です。are（現在形）や were（過去形）は since ~ と一緒には使えず、will be（未来）は意味が合いません。`
        },
        {
          label: '問2',
          q: R`My grandfather (    ) to Hawaii ten years ago.`,
          type: 'choice',
          choices: ['has gone', 'went', 'has been', 'goes'],
          answer: 1,
          explain: R`**went**（過去形）が入ります。ten years ago（10 年前に）のように、過去のはっきりした時点を表す語句があるときは、現在完了ではなく過去形を使います。has gone と has been は現在完了なので、ago とは一緒に使えません。goes（現在形）は過去の話に合いません。`
        },
        {
          label: '問3',
          q: R`If it (    ) tomorrow, we will have to cancel the school trip.`,
          type: 'choice',
          choices: ['rains', 'will rain', 'rained', 'would rain'],
          answer: 0,
          explain: R`**rains** が入ります。if が導く条件の節の中では、未来のことでも現在形で表します。主節が we will have to cancel（中止しなければならなくなる）と未来でも、if の中は will rain ではなく rains です。rained（過去形）や would rain は、明日の話に合いません。`
        },
        {
          label: '問4',
          q: R`When I called Emi last night, she (    ) dinner, so she could not answer the phone right away.`,
          type: 'choice',
          choices: ['cooks', 'has cooked', 'will cook', 'was cooking'],
          answer: 3,
          explain: R`**was cooking**（過去進行形）が入ります。「昨夜、電話をかけたとき、エミはちょうど夕食を作っている最中だった」という意味で、過去のある時点に進行中だった動作は was / were + -ing で表します。cooks（現在形）、has cooked（現在完了）、will cook（未来）は、last night の話に合いません。`
        },
        {
          label: '問5',
          q: R`I have not finished my report (    ), so I cannot go to the movie tonight.`,
          type: 'choice',
          choices: ['already', 'ever', 'yet', 'since'],
          answer: 2,
          explain: R`**yet** が入ります。現在完了の否定文で「まだ〜していない」を表すときは、not ~ yet を使います。already は肯定文で「すでに〜した」、ever は疑問文で「これまでに」の意味で使うので、否定文の「まだ」には合いません。since は後ろに時を表す語句（since last year など）が必要です。`
        }
      ],
      solution: [
        {
          t: '時を表す語句から時制を決める',
          n: R`空所の前後にある、時を表す語句が時制を決める手がかりです。問1 の since we were in elementary school（〜のときから）は現在完了、問2 の ten years ago（10 年前）は過去形、問3 の if（もし〜ならば）は未来の内容でも現在形、問4 の last night と called は過去進行形、問5 の not ~ yet（まだ〜していない）は現在完了の否定、と判断します。`,
          easy: R`時制の問題は、まず**「いつの話か」**を考えます。「〜からずっと」なら今まで続いている話、「10 年前」なら過去の話、というように、時を表す言葉に印をつけてから選択肢を見ましょう。`,
          pro: R`時制問題は次の 4 点でほぼ整理できます。(a) since / for / yet / already → 現在完了、(b) ago / yesterday / last ~ → 過去形（現在完了は不可）、(c) 時・条件の副詞節 → 現在形で未来を表す、(d) その時点で〜している最中 → 進行形。`
        },
        {
          t: '現在完了と過去形の違い',
          n: R`現在完了は「過去から現在までのつながり」を表し、過去形は「過去のある時点のこと」だけを表します。ago / yesterday / last night / in 2020 のように、過去のはっきりした時を表す語句は、過去形とだけ組み合わせます。`,
          easy: R`現在完了（have + 過去分詞）は、**今にも関係している**ときに使います。「10 年前に行った」のように過去の一点を示す言葉があると、今とは切れた話になるので、過去形（went）を使います。`,
          lv: 2
        },
        {
          t: '時・条件を表す節では、will を使わない',
          n: R`if / when / before / after / as soon as などが導く節の中では、未来のことでも現在形を使います。問3 は If it rains tomorrow（もし明日雨が降れば）で、主節だけが will を使います。`,
          easy: R`「**if の中には will を入れない**」と覚えます。「もし明日雨が降るなら」は If it **rains** tomorrow. です。`,
          lv: 2
        },
        {
          t: '進行形は「〜している最中」を表す',
          n: R`過去進行形（was / were + -ing）は、過去のある時点に動作が進行中だったことを表します。問4 では、電話をかけた時点で「夕食を作っている最中」だったので was cooking です。`,
          easy: R`「ちょうどそのとき〜している最中だった」という場面を思い浮かべます。電話が鳴ったときに料理をしていたなら、**was cooking** です。`,
          lv: 3
        }
      ],
      tags: ['文法', '時制', '現在完了', '過去進行形', '時・条件の副詞節']
    },

    {
      id: 'e-basic-grammar-02',
      subject: 'english',
      level: 'basic',
      unit: 'e-grammar',
      title: '文法：助動詞',
      source: SRC(),
      time: 5,
      body: R`次の各文の空所に入れるのに最も適切なものを、それぞれ 1 つずつ選びなさい。`,
      fig: null,
      parts: [
        {
          label: '問1',
          q: R`You (    ) hurry. We have plenty of time.`,
          type: 'choice',
          choices: ["don't have to", 'must', 'have to', 'should'],
          answer: 0,
          explain: R`**don't have to** が入ります。don't have to ~ は「〜する必要はない」という意味で、「急ぐ必要はない。時間はたっぷりある」と文意が合います。must（〜しなければならない）、have to（同じ意味）、should（〜したほうがよい）は、「時間がたっぷりある」という内容と合いません。`
        },
        {
          label: '問2',
          q: R`The sign says "No Photos." You (    ) take pictures in this room.`,
          type: 'choice',
          choices: ['may', "don't have to", 'will', 'must not'],
          answer: 3,
          explain: R`**must not** が入ります。must not ~ は「〜してはいけない」という強い禁止を表します。掲示に「撮影禁止」とあるので、「この部屋で写真を撮ってはいけない」となります。may（〜してもよい）は許可なので反対の意味、don't have to は「〜する必要はない」で禁止ではありません。will は意味が合いません。`
        },
        {
          label: '問3',
          q: R`You look pale. You (    ) see a doctor.`,
          type: 'choice',
          choices: ['used to', 'should', 'would', 'cannot'],
          answer: 1,
          explain: R`**should** が入ります。should ~ は「〜したほうがよい」と助言を表します。「顔色が悪いね。医者にみてもらったほうがいい」という自然な流れになります。used to ~ は「昔は〜したものだ」、would は過去の習慣や仮定、cannot は「〜できない」で、いずれも文脈に合いません。`
        },
        {
          label: '問4',
          q: R`Ken has just come back from a long trip to Europe. He (    ) be very tired.`,
          type: 'choice',
          choices: ["can't", 'shall', 'must', 'need'],
          answer: 2,
          explain: R`**must** が入ります。must には「〜に違いない」という確信のある推量の意味もあります。「長旅から帰ったばかりだから、とても疲れているに違いない」となります。can't be は「〜のはずがない」という否定の推量で、文意が逆になります。shall は「〜しましょうか」などの申し出に使い、need は主に否定文・疑問文で使う助動詞なので、この文には合いません。`
        },
        {
          label: '問5',
          q: R`If you practice hard every day, you will (    ) to play the piano well.`,
          type: 'choice',
          choices: ['can', 'be able', 'able', 'being able'],
          answer: 1,
          explain: R`**be able** が入ります。will be able to ~ で「〜できるようになる」です。can には未来形や to 不定詞の形がないので、will can とは言えません。未来や不定詞の中で「できる」を表すときは、be able to を使います。can は後ろに to が続かず、able や being able は will のあとの形として正しくありません。`
        }
      ],
      solution: [
        {
          t: '助動詞は「意味」で選ぶ',
          n: R`助動詞は、文の意味に合わせて選びます。問1 don't have to（〜する必要はない）、問2 must not（〜してはいけない）、問3 should（〜したほうがよい）、問4 must（〜に違いない）、問5 will be able to（〜できるようになる）です。空所の前後の文脈（時間がたっぷりある、撮影禁止の掲示がある、顔色が悪い、長旅のあと、毎日練習すれば）を手がかりにします。`,
          easy: R`助動詞は、話し手の**気持ち**を表す言葉です。「急がなくていい」「してはだめ」「したほうがいい」「〜に違いない」のように、日本語で意味を考えてから、英語の助動詞を選びましょう。`,
          pro: R`助動詞の問題は、(a) 義務・禁止・不必要の区別、(b) 推量の強さ（must は確信が強い、may / might は弱い）、(c) can の代用表現（be able to）の 3 点が頻出です。must not と don't have to の違いは特によく問われます。`
        },
        {
          t: 'must not と don\'t have to は正反対の意味',
          n: R`must not は強い禁止（〜してはいけない）、don't have to は不必要（〜する必要はない）で、「してもよい」という意味を含みます。問1 は時間がたっぷりあるので「急ぐ必要はない」＝ don't have to、問2 は掲示で禁止されているので must not です。`,
          easy: R`**must not** は「ダメ！」、**don't have to** は「しなくてもいいよ」です。まったく違う意味なので、間違えやすい組み合わせです。`,
          lv: 2
        },
        {
          t: 'can には未来形も to 不定詞もない',
          n: R`助動詞を 2 つ並べること（will can）はできません。「できるようになる」と未来を表すときは、can の代わりに be able to を使い、will be able to とします。問5 は will のあとなので、be able を選びます。`,
          easy: R`**will + can** はまちがいです。can のかわりに **be able to**（〜できる）を使って、will **be able to** と言います。`,
          lv: 3
        }
      ],
      tags: ['文法', '助動詞', 'must not', 'don\'t have to', 'be able to']
    },

    {
      id: 'e-basic-grammar-03',
      subject: 'english',
      level: 'basic',
      unit: 'e-grammar',
      title: '文法：不定詞・動名詞',
      source: SRC(),
      time: 5,
      body: R`次の各文の空所に入れるのに最も適切なものを、それぞれ 1 つずつ選びなさい。`,
      fig: null,
      parts: [
        {
          label: '問1',
          q: R`I enjoyed (    ) with my grandmother during the holidays.`,
          type: 'choice',
          choices: ['talk', 'to talk', 'talking', 'talked'],
          answer: 2,
          explain: R`**talking** が入ります。enjoy は動名詞（-ing 形）だけを目的語にとる動詞で、enjoy ~ing で「〜して楽しむ」です。「休みの間、祖母と話して楽しんだ」という意味になります。enjoy to talk のように不定詞にすることはできません。`
        },
        {
          label: '問2',
          q: R`I decided (    ) a new phone because my old one was broken.`,
          type: 'choice',
          choices: ['buying', 'buy', 'bought', 'to buy'],
          answer: 3,
          explain: R`**to buy** が入ります。decide は to 不定詞だけを目的語にとる動詞で、decide to ~ で「〜しようと決める」です。「古い電話が壊れたので、新しいのを買うことにした」という意味になります。decide ~ing とは言いません。`
        },
        {
          label: '問3',
          q: R`I am looking forward to (    ) you again next month.`,
          type: 'choice',
          choices: ['seeing', 'see', 'to see', 'seen'],
          answer: 0,
          explain: R`**seeing** が入ります。look forward to ~ は「〜を楽しみに待つ」で、この to は不定詞の to ではなく前置詞です。前置詞の後ろには名詞か動名詞（-ing 形）が続くので、seeing になります。「来月またお会いできるのを楽しみにしています」という意味です。to see にすると to が重なってしまい、正しくありません。`
        },
        {
          label: '問4',
          q: R`She was (    ) tired to walk any farther, so she sat down on a bench.`,
          type: 'choice',
          choices: ['so', 'too', 'very', 'enough'],
          answer: 1,
          explain: R`**too** が入ります。too + 形容詞 + to do で「…すぎて〜できない」という意味です。「疲れすぎてこれ以上歩けなかったので、ベンチに座った」となります。so や very のあとに to 不定詞を続ける形はありません（so を使うなら so tired that she could not walk のように that 節が必要です）。enough は「形容詞 + enough to do」の語順（tired enough to ~）で使うので、tired の前には置けません。`
        },
        {
          label: '問5',
          q: R`It is difficult for me (    ) English movies without subtitles.`,
          type: 'choice',
          choices: ['understand', 'understanding', 'to understand', 'understood'],
          answer: 2,
          explain: R`**to understand** が入ります。It is + 形容詞 + for 人 + to do は「人が〜するのは…だ」という形で、It は形式上の主語、to 以下が内容を表します。「字幕なしで英語の映画を理解するのは私には難しい」という意味になります。for me のあとに原形や -ing 形を直接続けることはできません。`
        }
      ],
      solution: [
        {
          t: '動詞のあとの形（to 不定詞か -ing か）はセットで決まる',
          n: R`動詞によって、あとに続く形が決まっています。enjoy は -ing だけ（問1）、decide は to 不定詞だけ（問2）です。-ing だけ・to do だけをとる動詞は、例文ごと覚えます。`,
          easy: R`enjoy は **enjoy ~ing**、decide は **decide to ~** と、動詞ごとに決まったペアがあります。「enjoy は -ing」「decide は to」と、声に出して覚えましょう。`,
          pro: R`-ing だけをとる動詞（enjoy, finish, stop, give up, mind, avoid など）と、to だけをとる動詞（want, hope, decide, plan, promise, refuse など）は頻出です。グループごとにまとめて覚えると、4 択を速く絞れます。`
        },
        {
          t: 'to のあとが動詞の原形とは限らない（look forward to ~ing）',
          n: R`look forward to ~ の to は不定詞の to ではなく前置詞です。前置詞のあとは名詞か -ing 形が来るので、問3 は seeing になります。be used to ~ing（〜することに慣れている）や object to ~ing も同じ型です。`,
          easy: R`look forward **to** の to は、「〜に向かって」という意味の前置詞で、不定詞の to ではありません。前置詞の後ろは名詞か **-ing** と決まっています。`,
          lv: 2
        },
        {
          t: 'too ~ to ... と It is ~ for 人 to ...',
          n: R`too + 形容詞 + to do は「…すぎて〜できない」、It is + 形容詞 + for 人 + to do は「人が〜するのは…だ」です。問4 は too tired to walk（疲れすぎて歩けない）、問5 は It is difficult for me to understand ~ です。`,
          easy: R`**too ~ to ...** は「〜すぎて…できない」（too ＝ 〜すぎる）。**It is ~ for 人 to ...** は「人が…するのは〜だ」で、**It** は形だけの主語、本当の主語は to 以下です。`,
          lv: 2
        }
      ],
      tags: ['文法', '不定詞', '動名詞', 'look forward to', 'too ~ to']
    },

    {
      id: 'e-basic-grammar-04',
      subject: 'english',
      level: 'basic',
      unit: 'e-grammar',
      title: '文法：比較・受動態',
      source: SRC(),
      time: 5,
      body: R`次の各文の空所に入れるのに最も適切なものを、それぞれ 1 つずつ選びなさい。`,
      fig: null,
      parts: [
        {
          label: '問1',
          q: R`Ken is now (    ) tall as his father.`,
          type: 'choice',
          choices: ['more', 'as', 'than', 'most'],
          answer: 1,
          explain: R`**as** が入ります。as + 形容詞 + as ~ は「〜と同じくらい…」という原級の比較で、最初の as が空所です。「ケンは今では父親と同じくらい背が高い」という意味になります。more は more ~ than の形で使う語で、tall は短い語なので taller になるはずです。than や most も、as ~ as の形には入りません。`
        },
        {
          label: '問2',
          q: R`Mt. Fuji is higher than any other (    ) in Japan.`,
          type: 'choice',
          choices: ['the mountain', 'mountains', 'of mountains', 'mountain'],
          answer: 3,
          explain: R`**mountain** が入ります。than any other + 単数名詞 は「ほかのどの〜よりも…」という比較の表現で、名詞は単数形にします。「富士山は日本のほかのどの山よりも高い」、つまり「日本でいちばん高い山だ」ということです。any は「どの〜でも」の意味で、あとに単数名詞が続きます。複数形の mountains や、the mountain、of mountains は、この形に合いません。`
        },
        {
          label: '問3',
          q: R`Of all the sports at our school, soccer is the (    ) popular.`,
          type: 'choice',
          choices: ['more', 'many', 'most', 'best'],
          answer: 2,
          explain: R`**most** が入ります。popular のように音節の長い形容詞は、最上級を the most + 形容詞 で表します。「学校のすべてのスポーツのなかで、サッカーがいちばん人気がある」という意味になります。more popular は比較級（2 つを比べるとき）、many は数が多いことを表す語、best は good / well の最上級で、popular の前には置けません。`
        },
        {
          label: '問4',
          q: R`English (    ) in many countries around the world.`,
          type: 'choice',
          choices: ['is spoken', 'speaks', 'is speaking', 'spoke'],
          answer: 0,
          explain: R`**is spoken** が入ります。主語の English は「話される」側なので、受動態（be + 過去分詞）にします。「英語は世界の多くの国で話されている」という意味です。speaks（現在形）、spoke（過去形）、is speaking（現在進行形）は、いずれも能動の形で、English が「話す」側になってしまうため、文意が通りません。`
        },
        {
          label: '問5',
          q: R`A new library (    ) in front of the station next year.`,
          type: 'choice',
          choices: ['will build', 'will be built', 'is built', 'built'],
          answer: 1,
          explain: R`**will be built** が入ります。「新しい図書館が建てられる」という受け身の意味なので、受動態にします。助動詞 will があるときは、will + be + 過去分詞 の形です。will build は「建てるだろう」という能動の意味になります。is built（現在）や built（過去形・過去分詞）は、未来を表す next year と合いません。`
        }
      ],
      solution: [
        {
          t: '比較の形を見分ける',
          n: R`原級（as ~ as）、比較級（-er / more ~ than）、最上級（the -est / the most ~）の形を見分けます。問1 は as ~ as の最初の as、問2 は than any other + 単数名詞、問3 は the most + 長い形容詞です。`,
          easy: R`**as 〜 as** は「〜と同じくらい…」という形で、あいだに形容詞を入れます。**as tall as**（〜と同じくらい背が高い）のように使います。`,
          pro: R`**than any other + 単数名詞** は最上級の書き換えとして頻出です。Mt. Fuji is higher than any other mountain in Japan. = Mt. Fuji is the highest mountain in Japan. の書き換えも、セットで覚えておきましょう。`
        },
        {
          t: '長い形容詞は more / most を使う',
          n: R`popular, useful, interesting など長い形容詞は、比較級に more、最上級に most をつけます。-er / -est をつけるのは、tall, fast, high のような短い語です。問3 の the most popular が最上級です。`,
          easy: R`短い語は語尾を変えて **taller / tallest**、長い語は前に置いて **more popular / most popular** と覚えます。目安は、音節が 3 つ以上の語や、-ful / -ous / -ing で終わる語です。`,
          lv: 2
        },
        {
          t: '受動態は be + 過去分詞',
          n: R`受動態は「be 動詞 + 過去分詞」で表します。問4 の English is spoken ~（英語は〜で話されている）がその例です。will のように助動詞があるときは will be + 過去分詞 になり、問5 は will be built です。`,
          easy: R`受動態は「**〜される**」という意味で、**be + 過去分詞**の形です。「英語は話される」→ English **is spoken**。「図書館が建てられるだろう」→ A library **will be built**。`,
          lv: 2
        }
      ],
      tags: ['文法', '比較', '最上級', '受動態', 'than any other']
    },

    /* ================= e-struct（整序）================= */
    {
      id: 'e-basic-struct-01',
      subject: 'english',
      level: 'basic',
      unit: 'e-struct',
      title: '整序：how to・比較・受動態',
      source: SRC(),
      time: 7,
      body: R`次の (1)〜(4) の日本語の意味になるように、与えられた語を並べかえて英文を完成させなさい。文頭に来る語は大文字で始めてあります。`,
      fig: null,
      parts: [
        {
          label: '(1)',
          q: R`駅への行き方を教えていただけませんか。`,
          type: 'order',
          words: ['the', 'how', 'you', 'to', 'tell', 'Could', 'station', 'get', 'me', 'to'],
          answer: 'Could you tell me how to get to the station',
          explain: R`**疑問詞 + to 不定詞**（how to ~ ＝「〜のしかた」）を使った依頼の文です。Could you tell me ~?（〜を教えていただけませんか）に、how to get to the station（駅への行き方）を続けます。to が 2 つ出てきますが、「how to + 動詞 get」と「get to + 場所」のかたまりに分けて考えます。tell は tell + 人 + 物 の語順なので、tell me のあとに how to get to the station が来ます。`
        },
        {
          label: '(2)',
          q: R`ケンは父親ほど背が高くありません。`,
          type: 'order',
          words: ['his', 'as', 'not', 'Ken', 'tall', 'is', 'father', 'as'],
          answer: 'Ken is not as tall as his father',
          explain: R`**not as ~ as ...**（…ほど〜でない）の形です。原級の比較 as tall as（同じくらい背が高い）を否定して、Ken is not as tall as his father と並べます。as ~ as の間に形容詞 tall が入ること、2 つ目の as のあとに比べる相手 his father が来ることを確認します。`
        },
        {
          label: '(3)',
          q: R`この寺は約 200 年前に建てられました。`,
          type: 'order',
          words: ['years', 'This', 'built', 'ago', 'about', 'temple', 'hundred', 'was', 'two'],
          answer: 'This temple was built about two hundred years ago',
          explain: R`**受動態**（was + 過去分詞）と、**〜年前に**（数 + years ago）の組み合わせです。「この寺は建てられた」は This temple was built、「約 200 年前に」は about two hundred years ago です。about（約）は数字の前に置き、two hundred years ago を 1 つのかたまりとして文末に置きます。`
        },
        {
          label: '(4)',
          q: R`私はこんなに美しい夕日を一度も見たことがありません。`,
          type: 'order',
          words: ['sunset', 'never', 'such', 'I', 'seen', 'a', 'have', 'beautiful'],
          answer: 'I have never seen such a beautiful sunset',
          explain: R`**現在完了の経験**（have never + 過去分詞 ＝「一度も〜したことがない」）と、**such a + 形容詞 + 名詞**（こんなに〜な…）の組み合わせです。I have never seen まで並べ、そのあとに such a beautiful sunset を続けます。such は a の前に置くので、a such beautiful sunset とはなりません。`
        }
      ],
      solution: [
        {
          t: '構文の型を見つけて、かたまりを作る',
          n: R`まず、日本語の意味から使われる構文を決めます。(1) how to + 動詞（〜のしかた）、(2) not as ~ as ...（…ほど〜でない）、(3) 受動態 + 〜年前（was built ~ years ago）、(4) 現在完了 + such a + 形容詞 + 名詞 です。次にそれぞれのかたまりを作り、最後に全体を並べます。`,
          easy: R`整序問題は、単語を 1 つずつ並べるのではなく、**かたまり**を先に作るのがコツです。たとえば (4) なら、「such a beautiful sunset（こんなに美しい夕日）」を先に作り、I have never seen のあとにつなぎます。`,
          pro: R`文頭の大文字の語（Could / Ken / This / I）から、文の形（疑問文・平叙文）と主語を確定させます。そのうえで、動詞の形（過去分詞など）と、前置詞のセットを順に決めていくと、迷わずに並べられます。`
        },
        {
          t: '日本語の語順に引きずられない',
          n: R`(1) の日本語は「駅への行き方を教えて」の順ですが、英語は Could you tell me ~ の順です。(3) も「約 200 年前に」を about two hundred years ago とひとまとめにして文末に置きます。日本語をそのまま置き換えず、英語の構文の型に合わせて並べます。`,
          easy: R`日本語の順番どおりに並べても、英語にはなりません。**英語の文の型（主語 + 動詞 + …）**に合わせて、動詞を主語のすぐあとに置くのが基本です。`,
          lv: 2
        },
        {
          t: '並べたあとに見直す',
          n: R`与えられた語をすべて使ったか、動詞の形（過去分詞など）や語順が正しいかを確認します。語が余ったり足りなかったりするときは、かたまりの作り方を見直します。`,
          lv: 2
        }
      ],
      tags: ['整序', 'how to', 'not as ~ as', '受動態', '現在完了', 'such a']
    },

    {
      id: 'e-basic-struct-02',
      subject: 'english',
      level: 'basic',
      unit: 'e-struct',
      title: '整序：関係代名詞・分詞・make O C',
      source: SRC(),
      time: 7,
      body: R`次の (1)〜(4) の日本語の意味になるように、与えられた語を並べかえて英文を完成させなさい。文頭に来る語は大文字で始めてあります。`,
      fig: null,
      parts: [
        {
          label: '(1)',
          q: R`私は 3 つの言語を話せる女の子を知っています。`,
          type: 'order',
          words: ['who', 'know', 'languages', 'a', 'I', 'speak', 'three', 'can', 'girl'],
          answer: 'I know a girl who can speak three languages',
          explain: R`**関係代名詞 who**（主格）の文です。「女の子」を who 以下が後ろから説明するので、a girl who can speak three languages とひとまとまりにし、I know の目的語にします。who は主語の働きをするので、あとに助動詞 can が続き、can speak three languages（3 つの言語を話せる）となります。`
        },
        {
          label: '(2)',
          q: R`公園まで歩くのにどのくらい時間がかかりますか。`,
          type: 'order',
          words: ['the', 'long', 'it', 'to', 'How', 'park', 'take', 'walk', 'does', 'to'],
          answer: 'How long does it take to walk to the park',
          explain: R`**How long does it take to ~?**（〜するのにどのくらい時間がかかりますか）の形です。How long を文頭に置き、疑問文の語順（does + 主語 it + 動詞 take）を続けます。そのあとに、「〜するのに」を表す to walk、「公園まで」を表す to the park をつなげます。to が 2 つ出てきますが、前の to は不定詞、後ろの to は前置詞です。`
        },
        {
          label: '(3)',
          q: R`英語は多くの国で話されている言語です。`,
          type: 'order',
          words: ['language', 'many', 'spoken', 'English', 'in', 'is', 'countries', 'a'],
          answer: 'English is a language spoken in many countries',
          explain: R`**過去分詞の後置修飾**の文です。「話されている言語」は、a language spoken in many countries のように、過去分詞 spoken 以下が名詞 language を後ろから説明します。これを English is のあとに補語として続けます。spoken は「話される」という受け身の意味なので、過去分詞を使います。`
        },
        {
          label: '(4)',
          q: R`その知らせで、みんなはとても幸せな気持ちになりました。`,
          type: 'order',
          words: ['very', 'made', 'The', 'happy', 'everyone', 'news'],
          answer: 'The news made everyone very happy',
          explain: R`**make + O + C**（O を C の状態にする）の文型です。The news made everyone very happy で、「その知らせが みんなを とても幸せに した」、つまり「その知らせで、みんなはとても幸せな気持ちになった」という意味になります。日本語は「みんなは〜になった」ですが、英語では The news（知らせ）を主語にして、無生物主語の文で表します。`
        }
      ],
      solution: [
        {
          t: '核になる構文を決める',
          n: R`(1) 名詞 + who + 動詞（関係代名詞）、(2) How long does it take to ~?（所要時間をたずねる文）、(3) 名詞 + 過去分詞 + 修飾語句（分詞の後置修飾）、(4) make + O + C（O を C にする）です。構文の型を決めてから、語を型に当てはめます。`,
          easy: R`英文には「型」があります。「〜するのにどのくらいかかりますか」は **How long does it take to ~?** という型です。これは丸ごと覚えておくと、整序問題がすぐに解けます。`,
          pro: R`語数が 10 語前後でも、構文の型が決まれば 3〜4 個のかたまりに分けられます。how long / does it take / to walk / to the park のように、意味のかたまりを先に作ってから並べます。`
        },
        {
          t: '後ろから説明する形（関係代名詞・分詞）',
          n: R`(1) の who can speak three languages と、(3) の spoken in many countries は、どちらも直前の名詞（girl / language）を後ろから説明しています。説明する語句が長いときは、名詞の後ろに置くのが英語の語順です。`,
          easy: R`日本語は「3 つの言語を話せる女の子」のように、説明を名詞の**前**に置きます。英語では、**後ろ**に置いて説明します。この違いを意識すると、並べかえの手順が見えてきます。`,
          lv: 2
        },
        {
          t: '日本語と英語の主語の違い',
          n: R`(4) の日本語は「みんなは〜になった」ですが、英語は The news made everyone very happy.（その知らせがみんなを幸せにした）と、原因を主語にします。「原因 + make + 人 + 状態」は英語に多い言い方で、日本語にするときは「〜で / 〜のおかげで」と考えます。`,
          easy: R`英語は「物事」を主語にして、「それが人をどんな状態にしたか」を表すことが多いです。**The news made everyone happy.**（その知らせがみんなを幸せにした）は、「知らせでみんなは幸せになった」と訳すと自然な日本語になります。`,
          lv: 3
        }
      ],
      tags: ['整序', '関係代名詞', 'How long ~', '分詞の後置修飾', 'make O C']
    },

    /* ================= e-conv（会話文）================= */
    {
      id: 'e-basic-conv-01',
      subject: 'english',
      level: 'basic',
      unit: 'e-conv',
      title: '会話文：土曜日の水族館',
      source: SRC(),
      time: 6,
      body: R`次の会話文を読み、空所 ( 1 )〜( 5 ) に入れるのに最も適切なものを、それぞれ選びなさい。

Mika: Hi, Tom. Do you have any plans for this Saturday?
Tom: No, not yet. ( 1 )
Mika: I'm going to the new aquarium near the station. Would you like to come with me?
Tom: That sounds great! ( 2 )
Mika: It opens at nine. How about meeting at the station at eight thirty?
Tom: ( 3 ) Is the aquarium far from the station?
Mika: Not at all. It's only a ten-minute walk. ( 4 )
Tom: Oh, that's nice. I'll bring my camera, then.
Mika: Good idea! ( 5 )
Tom: Me too. See you on Saturday!`,
      fig: null,
      parts: [
        {
          label: '( 1 )',
          q: R`空所 ( 1 ) に入る最も適切なものを選びなさい。`,
          type: 'choice',
          choices: ['How about you?', 'What did you do last Saturday?', 'Where do you live?', 'Why are you so busy?'],
          answer: 0,
          explain: R`直後の Mika の発言 I'm going to the new aquarium near the station.（私は駅の近くの新しい水族館に行く予定）が手がかりです。Tom が「まだ予定はない」と答えたあと、Mika は自分の予定を話しているので、Tom は「あなたは？」とたずねたはずです。したがって **How about you?** が正解です。What did you do last Saturday?（先週の土曜日は何をしたの）は過去の話で、返事が未来の予定になっているのと合いません。Where do you live?（どこに住んでいるの）や Why are you so busy?（なぜそんなに忙しいの）も、Mika の返事とつながりません。`
        },
        {
          label: '( 2 )',
          q: R`空所 ( 2 ) に入る最も適切なものを選びなさい。`,
          type: 'choice',
          choices: ['Where did you buy the ticket?', 'How much was the ticket?', 'Who is going with us?', 'What time does it open?'],
          answer: 3,
          explain: R`直後の Mika の発言 It opens at nine.（9 時に開きます）が手がかりです。It は the aquarium を指し、「開く時刻」を答えているので、Tom は **What time does it open?** とたずねたとわかります。Where did you buy the ticket?（切符はどこで買ったの）や How much was the ticket?（切符はいくらだったの）は、開館時刻の返事になりません。Who is going with us?（だれが一緒に行くの）も、It opens at nine. とはつながりません。`
        },
        {
          label: '( 3 )',
          q: R`空所 ( 3 ) に入る最も適切なものを選びなさい。`,
          type: 'choice',
          choices: ['Sure, that sounds fine.', "No, I don't think so.", "I'm afraid I'm busy then.", 'Yes, it was a good idea.'],
          answer: 0,
          explain: R`Mika の How about meeting at the station at eight thirty?（8 時半に駅で会うのはどう？）という提案に対する返事です。直後で Tom は Is the aquarium far from the station?（水族館は駅から遠い？）とたずねており、行く前提で話を進めているので、提案に賛成しているとわかります。したがって **Sure, that sounds fine.**（いいよ、それでいいね）が正解です。No, I don't think so. や I'm afraid I'm busy then.（あいにくその時間は忙しい）は断る返事で、そのあとの質問とつながりません。Yes, it was a good idea. は過去の話になり、提案への返事として合いません。`
        },
        {
          label: '( 4 )',
          q: R`空所 ( 4 ) に入る最も適切なものを選びなさい。`,
          type: 'choice',
          choices: ["You can't take any photos there.", 'You can take pictures of dolphins and sea turtles there.', 'The aquarium is closed on Saturdays.', 'It takes two hours by bus.'],
          answer: 1,
          explain: R`直後の Tom の発言 Oh, that's nice. I'll bring my camera, then.（それはいいね。じゃあカメラを持っていくよ）が手がかりです。カメラを持っていこうと思ったのは、「写真が撮れる」とわかったからです。したがって **You can take pictures of dolphins and sea turtles there.**（そこではイルカやウミガメの写真が撮れるよ）が正解です。You can't take any photos there.（写真は撮れない）では、カメラを持っていく理由がなくなります。The aquarium is closed on Saturdays.（土曜日は休み）や It takes two hours by bus.（バスで 2 時間）は、出かける計画や、直前の Not at all. It's only a ten-minute walk. と矛盾します。`
        },
        {
          label: '( 5 )',
          q: R`空所 ( 5 ) に入る最も適切なものを選びなさい。`,
          type: 'choice',
          choices: ["I'm sorry you can't come.", "I'm really good at swimming.", "I'm really surprised you came.", "I'm really looking forward to it!"],
          answer: 3,
          explain: R`直後の Tom の発言 Me too. See you on Saturday!（私も。土曜日にね）の Me too. は、直前の Mika の気持ちに「私も同じ」と共感する表現です。したがって、Mika が自分の気持ちを述べた **I'm really looking forward to it!**（とても楽しみ！）が正解です。I'm sorry you can't come. や I'm really surprised you came. は、Me too. につながりません。I'm really good at swimming. は、出かける計画の話題と関係がありません。`
        }
      ],
      solution: [
        {
          t: '場面と会話の流れをつかむ',
          n: R`友人どうし（Mika と Tom）が、土曜日に水族館へ出かける約束をしている場面です。「質問 → 答え」「提案 → 賛成」「情報 → 反応」という組になっているので、空所の直前と直後の発言の両方を読んで、つながりを確認します。`,
          easy: R`会話文は、「相手が何を言ったか」と「そのあとに続く返事」をセットで読むパズルです。たとえば ( 2 ) は、返事が「9 時に開きます」なので、「何時に開くの？」とたずねたのだと推理できます。`,
          pro: R`会話文の空所補充は、直前より直後の発言が決め手になることが多くあります。直後の返事（It opens at nine. / Me too. など）から、空所の発言の種類（質問か、気持ちの表明か）を逆算します。`
        },
        {
          t: '直後の発言が答えを決める',
          n: R`( 1 ) は直後の「自分の予定を述べる」発言、( 2 ) は It opens at nine. という答え、( 4 ) は I'll bring my camera, then. という反応、( 5 ) は Me too. という共感が、それぞれ決め手になります。「返事から質問を逆算する」と、選択肢を絞りやすくなります。`,
          lv: 2
        },
        {
          t: '決まり文句を覚える',
          n: R`How about you?（あなたは？）、That sounds great!（すてきだね）、Sure, that sounds fine.（いいよ）、Me too.（私も）、I'm looking forward to it.（楽しみだ）などの決まり文句は、意味と使う場面をセットで覚えておくと、すぐに答えられます。`,
          easy: R`**How about you?** は、相手に同じ質問を返すときの定番表現です。**Me too.** は、「私も同じ」と共感するときに使います。声に出して、場面ごと覚えましょう。`,
          lv: 2
        }
      ],
      tags: ['会話文', '空所補充', '決まり文句', '誘い・約束']
    },

    /* ================= e-reading（長文読解）================= */
    {
      id: 'e-basic-reading-01',
      subject: 'english',
      level: 'basic',
      unit: 'e-reading',
      title: '長文：ホームステイの夏',
      source: SRC(),
      time: 9,
      body: R`次の英文（ホームステイの体験談）を読み、設問に答えなさい。段落は上から順に第1段落〜第4段落と数えます。空所は ( 1 )〜( 3 )、下線部は (4) です。

注　host family = ホストファミリー（外国から来た人を受け入れる家族）　nervous = 緊張した　chopsticks = はし　hug = 〜を抱きしめる`,
      fig: null,
      passage: 'ep-basic-01',
      parts: [
        {
          label: '(1)',
          q: R`空所 ( 1 ) に入る最も適切な語を選びなさい。`,
          type: 'choice',
          choices: ['for', 'at', 'of', 'with'],
          answer: 2,
          explain: R`**be afraid of ~ing** で「〜することを恐れる」です。of のあとに動名詞 making が続き、「間違いをするのが怖かった」となります。for / at / with は、afraid のあとに making mistakes を続けて「間違いをするのが怖い」という意味を表すことはできません。`
        },
        {
          label: '(2)',
          q: R`空所 ( 2 ) に入る最も適切な語を選びなさい。`,
          type: 'choice',
          choices: ['much', 'very', 'more', 'too'],
          answer: 0,
          explain: R`**much** が入ります。better は good の比較級で、比較級の前には much / far / even / a lot などを置いて「ずっと〜」と強調します。「その言葉で、気持ちがずっと楽になった」という意味です。very は比較級を強調できず、more better は比較級を二重にした誤りです。too は「〜すぎる」の意味で、文意に合いません。`
        },
        {
          label: '(3)',
          q: R`空所 ( 3 ) に入る最も適切な語を選びなさい。`,
          type: 'choice',
          choices: ['so', 'because', 'or', 'but'],
          answer: 3,
          explain: R`**but** が入ります。「彼らはみそ汁を一度も味わったことがなかった」と「みんな気に入った」は、予想とは反対の内容なので、逆接の but でつなぎます。so（だから）や because（なぜなら）では、「一度も食べたことがない」ことと「気に入った」ことの間に、原因と結果の関係がなくなります。or は「または」の意味で、文意に合いません。`
        },
        {
          label: '(4)',
          q: R`下線部 (4) の内容として最も適切なものを選びなさい。`,
          type: 'choice',
          choices: [
            R`友達をつくるために、完璧な英語を話してはいけない。`,
            R`友達をつくるために、完璧な英語を話す必要はない。`,
            R`完璧な英語を話せないと、友達をつくることはできない。`,
            R`友達ができれば、完璧な英語を話せるようになる。`
          ],
          answer: 1,
          explain: R`you do not have to ~ は「〜する必要はない」という意味で（do not have to ＝ 不必要）、to make friends は「友達をつくるために」です。したがって「友達をつくるために、完璧な英語を話す必要はない」となります。「〜してはいけない」は must not の意味で、do not have to とは異なります。また、「完璧な英語を話せないと友達ができない」は、この文の主張と反対の内容です。「友達ができれば英語が話せるようになる」は、本文に書かれていない内容です。`
        },
        {
          label: '問5',
          q: R`本文の内容に合うものを 1 つ選びなさい。`,
          type: 'choice',
          choices: [
            'Sarah taught the writer how to make pancakes.',
            'Sarah was cold to the writer when they first met.',
            'The writer taught Sarah how to make miso soup.',
            'The writer did not want to see the host family again.'
          ],
          answer: 0,
          explain: R`第2段落の Sarah taught me how to make pancakes（サラは私にパンケーキの作り方を教えてくれた）と一致するのは、「サラは筆者にパンケーキの作り方を教えた」という内容です。「サラは初対面のとき冷たかった」は、第2段落に a warm smile（温かい笑顔）とあるので誤りです。筆者がサラに教えたのは、はしの使い方（how to use chopsticks）で、みそ汁の作り方ではありません。「ホストファミリーに二度と会いたくない」は、最後の文の I hope to see my host family again someday.（いつかまたホストファミリーに会いたい）に反します。`
        },
        {
          label: '問6',
          q: R`本文の内容と一致するものを 2 つ選びなさい。`,
          type: 'multi',
          choices: [
            'The writer stayed with the host family for two weeks.',
            'The writer felt relaxed from the moment of arriving at the house.',
            'The writer made pancakes for the family on the first day.',
            'Nobody in the family liked the miso soup.',
            "The writer's English got better as the days went by.",
            "The writer's English was already perfect before the trip."
          ],
          answer: [0, 4],
          explain: R`正しいのは 2 つです。「ホストファミリーのもとに 2 週間滞在した」は第1段落の stayed with a host family in Canada for two weeks と、「英語が日ごとに上達した」は第3段落の my English got better day by day と一致します。
誤りの選択肢は次のとおりです。「着いた瞬間からリラックスしていた」→ 第1段落は I was very nervous（とても緊張していた）。「初日にパンケーキを作った」→ 本文に記述なし（パンケーキの作り方はサラから教わった）。「だれもみそ汁を気に入らなかった」→ 第2段落は they all liked it。「旅行の前から完璧な英語だった」→ 第1段落は My English was not good。`
        }
      ],
      solution: [
        {
          t: '全体の流れをつかむ',
          n: R`段落ごとの要旨は次のとおりです。
第1段落: 去年の夏、カナダでホームステイをした。最初は英語に自信がなく、緊張していた。
第2段落: ホストマザーの言葉で気持ちが楽になり、毎晩一緒に夕食を作った。筆者のみそ汁をみんなが気に入った。
第3段落: もう緊張しなくなり、英語も上達した。最終日には別れを惜しまれた。
第4段落: この旅で学んだ 2 つのこと（完璧な英語は必要ない・優しい言葉の力）。`,
          easy: R`体験談は、「いつ・どこで・何があったか」を順番に追っていくと理解しやすくなります。この文章は「最初は不安 → 家族の優しさで安心 → 楽しい毎日 → 学んだこと」という流れです。第4段落の First / Second のような順序を表す語は、まとめの目印です。`,
          pro: R`体験談では、最後の段落に筆者の学び（First, ... Second, ...）が書かれることが多く、内容一致や要旨の問題でよく問われます。先に最終段落に目を通すと、全体の主題がつかみやすくなります。`
        },
        {
          t: '空所補充は、語と語の結びつきと論理関係で決める',
          n: R`(1) afraid of ~ing は決まった組み合わせ（語法）、(2) 比較級 better を強調する much（文法）、(3) 「一度も食べたことがない」と「気に入った」の関係（逆接）で but を選びます。熟語・語法は知識で即答し、接続詞は前後の内容の関係（順接か逆接か）で判断します。`,
          easy: R`接続詞を選ぶときは、前後の内容が「同じ方向」か「反対」かを考えます。「食べたことがない」のに「気に入った」は、予想と反対なので **but** です。`,
          lv: 2
        },
        {
          t: '下線部は、否定の形と文の主張に注意する',
          n: R`(4) の do not have to ~（〜する必要はない）は、must not（〜してはいけない）と意味が違います。選択肢を読むときは、「必要はない」と「禁止」を取り違えないようにします。`,
          lv: 2
        },
        {
          t: '内容一致は、本文の記述と 1 つずつ照合する',
          n: R`各選択肢のキーワード（pancakes, two weeks, miso soup, perfect English など）を本文で探し、その部分の記述と照らし合わせます。主語や動作の向き（だれがだれに教えたか）を入れ替えた選択肢が、誤りの定番です。`,
          lv: 2
        }
      ],
      tags: ['長文', '空所補充', '下線部', '内容一致', '体験談']
    },

    {
      id: 'e-basic-reading-02',
      subject: 'english',
      level: 'basic',
      unit: 'e-reading',
      title: '長文：紙の本か電子書籍か',
      source: SRC(),
      time: 9,
      body: R`次の英文（電子書籍と紙の本についての文章）を読み、設問に答えなさい。段落は上から順に第1段落〜第3段落と数えます。空所は ( 1 )・( 2 )・( 4 )、下線部は (3) です。

注　e-book = 電子書籍　device = 機器　print = 印刷された文字　run out of ~ = 〜を使い果たす　situation = 状況`,
      fig: null,
      passage: 'ep-basic-02',
      parts: [
        {
          label: '(1)',
          q: R`空所 ( 1 ) に入る最も適切な語を選びなさい。`,
          type: 'choice',
          choices: ['For example', 'Therefore', 'Besides', 'However'],
          answer: 3,
          explain: R`**However**（しかし）が入ります。第1段落は電子書籍の長所を述べていますが、空所のあとは「それでも紙の本を好む人は多い」と、反対の内容になっています。したがって逆接の However が入ります。For example（たとえば）は具体例、Therefore（それゆえ）は結果、Besides（そのうえ）は同じ方向の内容を付け加えるときに使うので、この流れには合いません。`
        },
        {
          label: '(2)',
          q: R`空所 ( 2 ) に入る最も適切な語句を選びなさい。`,
          type: 'choice',
          choices: ['In addition', 'Instead', 'For example', 'As a result'],
          answer: 0,
          explain: R`**In addition**（さらに）が入ります。第2段落は紙の本が好まれる理由を並べていて、「画面で読むと目が疲れる」に続けて、空所のあとで「紙の本は電池が切れない」という別の理由を付け加えています。付け加えを表す In addition が合います。Instead（その代わりに）、For example（たとえば）、As a result（その結果）は、前の文との関係に合いません。`
        },
        {
          label: '(3)',
          q: R`下線部 (3) の This が指す内容として最も適切なものを選びなさい。`,
          type: 'choice',
          choices: [
            R`電子書籍では文字を大きくできること`,
            R`紙の本は電池が切れないこと`,
            R`紙で読んだほうが物語をよく覚えていられると言う読者がいること`,
            R`長い時間、画面で読むと目が疲れること`
          ],
          answer: 2,
          explain: R`This は、直前の文の内容を受けています。「紙で読んだほうが物語をよく覚えていられると言う読者もいる」ことが、「本があとどれくらい残っているかが目で見てわかるからかもしれない」という理由で説明されています。したがって、正解は「紙で読んだほうが物語をよく覚えていられると言う読者がいること」です。ほかの選択肢は、本文の別の箇所に書かれている内容（文字を大きくできる、電池が切れない、目が疲れる）で、「本があとどれくらい残っているかがわかる」こととは、理由の関係になりません。`
        },
        {
          label: '(4)',
          q: R`空所 ( 4 ) に入る最も適切な語を選びなさい。`,
          type: 'choice',
          choices: ['in', 'on', 'at', 'for'],
          answer: 1,
          explain: R`**on** が入ります。depend on ~ は「〜しだいである; 〜によって決まる」という熟語で、it depends on the situation は「それは状況によって決まる」という意味です。in / at / for は、depend と結びつかず、熟語になりません。`
        },
        {
          label: '問5',
          q: R`本文の内容に合うものを 1 つ選びなさい。`,
          type: 'choice',
          choices: [
            'The writer reads e-books when traveling because they are light.',
            'The writer thinks paper books are always better than e-books.',
            'E-books cannot be bought late at night.',
            'Most students today never read on a screen.'
          ],
          answer: 0,
          explain: R`第3段落の When I travel, I read e-books because they are light.（旅行のときは、軽いので電子書籍を読む）と一致するのは、「筆者は旅行のとき、軽いので電子書籍を読む」という内容です。「紙の本が常にすぐれている」は、第3段落の I think it depends on the situation.（状況による）と合いません。「夜遅くには買えない」は、第1段落の even at midnight（真夜中でも）に反します。「ほとんどの生徒が画面で読まない」は、第1段落の Many students today read books on tablets or smartphones. に反します。`
        },
        {
          label: '問6',
          q: R`この文章で筆者が最も伝えたいことは何ですか。最も適切なものを選びなさい。`,
          type: 'choice',
          choices: [
            R`電子書籍は、紙の本よりもすべての点ですぐれている。`,
            R`紙の本は、電子書籍よりもすべての点ですぐれている。`,
            R`紙の本と電子書籍のどちらがよいかは状況によるので、自分に合った方法で読書を楽しめばよい。`,
            R`目の健康のために、生徒は電子書籍を読むべきではない。`
          ],
          answer: 2,
          explain: R`第3段落で、筆者は I think it depends on the situation.（状況による）と述べ、旅行では電子書籍、家では紙の本と使い分けています。最後の文 The most important thing is to enjoy reading in your own way.（いちばん大切なのは、自分なりの方法で読書を楽しむことだ）が主張のまとめです。「すべての点ですぐれている」と言い切る選択肢は、この主張と合いません。「電子書籍を読むべきではない」とも述べていません。`
        }
      ],
      solution: [
        {
          t: '全体の流れをつかむ',
          n: R`段落ごとの要旨は次のとおりです。
第1段落: 電子書籍の長所（持ち運び・文字の拡大・すぐに買える）。
第2段落: それでも紙の本を好む人が多い理由（目の疲れ・電池・記憶）。
第3段落: 筆者の結論（状況による。自分なりの方法で楽しむ）。`,
          easy: R`意見文は、「話題の提示 → 一方の理由 → 反対（逆接）の理由 → 筆者の結論」という流れで書かれることが多いです。この文章は、第2段落の冒頭の However で話の向きが変わり、第3段落で筆者の意見が述べられています。`,
          pro: R`However / But / Yet などの逆接の語が出たら、そのあとに主張が来ることが多いので注意して読みます。ただしこの文章では、However のあとは「紙の本を好む人々の意見」で、筆者本人の主張は第3段落の I think ~ です。「I think」「In my opinion」などの表現も、主張の目印です。`
        },
        {
          t: '空所補充は、接続の語句と前後の関係で決める',
          n: R`(1) は「電子書籍の長所」→「紙の本を好む人も多い」という反対の内容なので However、(2) は「紙の本の理由」を付け加える In addition、(4) は depend on ~ という熟語です。空所の前後の文が「同じ方向」か「反対」か「原因と結果」かを考えて、接続の語句を選びます。`,
          easy: R`**However**（しかし）は前と反対のとき、**In addition**（さらに）は同じ方向の内容を付け加えるとき、**For example**（たとえば）は具体例を出すとき、**As a result**（その結果）は結果を言うときに使います。この 4 つの使い分けは、長文でとても大切です。`,
          lv: 2
        },
        {
          t: '指示語は、直前の内容に戻って確認する',
          n: R`(3) の This は、直前の文の内容を指しています。指示語を含む文の 1 つ前の文から、同じ働きの内容を探し、This に当てはめて意味が通るか確かめます。`,
          easy: R`「これ（This）」が出てきたら、**直前の文**に戻って、「これ」に当てはまる内容を探します。「紙で読んだほうが物語をよく覚えている、と言う読者がいる。これは、本があとどれくらい残っているかが見てわかるからかもしれない」と、つながります。`,
          lv: 2
        },
        {
          t: '内容一致と主旨は、筆者の主張と照らす',
          n: R`問5 は選択肢のキーワード（travel, light, midnight, screen）を本文で探して照合します。問6 の主旨は、最終段落の I think ~ と、最後の文（The most important thing is ...）が決め手です。「すべての点で」「常に」「決して〜ない」のような極端な表現の選択肢は、たいてい誤りです。`,
          lv: 2
        }
      ],
      tags: ['長文', '空所補充', '接続語', '指示語', '内容一致', '主旨', 'メディア']
    },

    {
      id: 'e-basic-reading-03',
      subject: 'english',
      level: 'basic',
      unit: 'e-reading',
      title: '長文：海岸をきれいにする活動',
      source: SRC(),
      time: 10,
      body: R`次の英文（海岸清掃のボランティア活動についての文章）を読み、設問に答えなさい。段落は上から順に第1段落〜第4段落と数えます。空所は ( 1 )・( 2 )・( 4 )・( 5 )、下線部は (3) です。

注　volunteer = ボランティア　gather = 集まる　trash = ごみ　sort ~ into ... = 〜を…に分別する　burnable = 燃える　elderly = 年配の　skill = 技術`,
      fig: null,
      passage: 'ep-basic-03',
      parts: [
        {
          label: '(1)',
          q: R`空所 ( 1 ) に入る最も適切な語を選びなさい。`,
          type: 'choice',
          choices: ['shocked', 'shocking', 'shock', 'shocks'],
          answer: 0,
          explain: R`**shocked** が入ります。「ショックを受けた」のように、人が心の中で感じる気持ちは過去分詞（-ed）で表し、「ショックを与えるような」という物・事の性質は現在分詞（-ing）で表します。ここでは、リナがたくさんのごみを見て衝撃を受けたので shocked です。shocking は「（人に）衝撃を与えるような」という意味で、人の気持ちには使いません。shock は名詞・動詞の原形、shocks は名詞の複数形か動詞の三人称単数現在形で、be 動詞 was のあとの形容詞としては使えません。`
        },
        {
          label: '(2)',
          q: R`空所 ( 2 ) に入る最も適切な語を選びなさい。`,
          type: 'choice',
          choices: ['fell', 'stopped', 'missed', 'increased'],
          answer: 3,
          explain: R`**increased**（増えた）が入ります。「最初は 5 人しか来なかった」→「多くの人が写真を見た」→「ボランティアの数は少しずつ増えた」という流れです。the number of ~ increased で「〜の数が増えた」となります。fell（減った）は反対の意味、stopped（止まった）や missed（逃した）は、文意に合いません。`
        },
        {
          label: '(3)',
          q: R`下線部 (3) の They が指す内容として最も適切なものを選びなさい。`,
          type: 'choice',
          choices: [
            R`ヒカリ海岸で見つかったごみ`,
            R`あらゆる年齢のボランティアたち`,
            R`インターネットでリナの写真を見た人々`,
            R`リナと、最初に集まった 5 人`
          ],
          answer: 1,
          explain: R`They は複数の人々を指し、直前の文 Now, people of all ages join the activity, from small children to elderly people.（今では、小さな子どもから高齢の人まで、あらゆる年齢の人がその活動に参加している）の主語 people of all ages を受けています。「2 時間で約 100 袋のごみを集める」のは、活動に参加しているボランティアたちです。「ごみ」は集められる側で、They の内容になりません。「インターネットで写真を見た人々」は第2段落の途中の話で、今の参加者全員を表すわけではありません。「最初に集まった 5 人」は、活動が始まった頃の人数の話で、「今」の話に合いません。`
        },
        {
          label: '(4)',
          q: R`空所 ( 4 ) に入る最も適切な語を選びなさい。`,
          type: 'choice',
          choices: ['or', 'so', 'but', 'if'],
          answer: 2,
          explain: R`**but** が入ります。not only A but also B で「A だけでなく B も」という意味の決まった形です。「海岸の掃除は自然のためになるだけでなく、楽しくもある」となります。or / so / if では、この形になりません。`
        },
        {
          label: '(5)',
          q: R`空所 ( 5 ) に入る最も適切な語を選びなさい。`,
          type: 'choice',
          choices: ['in', 'for', 'with', 'at'],
          answer: 0,
          explain: R`**in** が入ります。take part in ~ は「〜に参加する」という熟語で、take part in the activity で「その活動に参加する」となります。for / with / at は part と結びつかず、熟語になりません。`
        },
        {
          label: '問6',
          q: R`本文の内容に合うものを 1 つ選びなさい。`,
          type: 'choice',
          choices: [
            'The group has about five hundred members.',
            'Only adults are allowed to join the activity.',
            'Rina stopped coming to the beach when she became a university student.',
            'After cleaning, the volunteers sort the trash into three groups.'
          ],
          answer: 3,
          explain: R`第3段落の they sort the trash into three groups（ごみを 3 つに分別する）と一致するのは、「清掃のあと、ボランティアはごみを 3 つのグループに分別する」という内容です。「会員が約 500 人」は、第1段落の about fifty volunteers（約 50 人のボランティア）に反します。「大人しか参加できない」は、第2段落の people of all ages（あらゆる年齢の人）に反します。「大学生になったリナは来なくなった」は、第4段落の she still comes to the beach every month（今も毎月来ている）に反します。`
        },
        {
          label: '問7',
          q: R`本文の内容と一致するものを 2 つ選びなさい。`,
          type: 'multi',
          choices: [
            'The volunteers meet at Hikari Beach on the first Sunday of every month.',
            'Rina started the group when she was a university student.',
            'Only five people joined the activity at first.',
            'The volunteers need special skills to join the activity.',
            'The volunteers collect about one thousand bags of trash in two hours.',
            'The members do not enjoy working together.'
          ],
          answer: [0, 2],
          explain: R`正しいのは 2 つです。「毎月第 1 日曜日にヒカリ海岸に集まる」は第1段落の Every first Sunday of the month, ~ gather at Hikari Beach と、「最初は 5 人しか参加しなかった」は第2段落の At first, only five people came. と一致します。
誤りの選択肢は次のとおりです。「リナが大学生のときに始めた」→ 第1段落は a high school student（高校生）。「特別な技術が必要」→ 第4段落は You do not need special skills（特別な技術は必要ない）。「約 1000 袋」→ 第2段落は about one hundred bags（約 100 袋）。「一緒に作業しても楽しくない」→ 第3段落は not only good for nature but also fun（楽しくもある）。`
        }
      ],
      solution: [
        {
          t: '全体の流れをつかむ',
          n: R`段落ごとの要旨は次のとおりです。
第1段落: 毎月、ボランティアがヒカリ海岸でごみ拾いをしている。始まりは高校生のリナの気づき。
第2段落: 最初は 5 人だったが、写真がきっかけで参加者が増え、今はあらゆる年齢の人が参加している。
第3段落: 活動のあとはごみを分別する。掃除は楽しくもある。
第4段落: リナは今も参加し、「だれでも参加できる」と言っている。`,
          easy: R`この文章は「活動の紹介 → 始まりと成長 → 活動の様子 → リナの言葉」という流れです。At first（最初は）や Now（今では）のような時を表す語句は、話の流れを追う目印になります。`,
          pro: R`時間の流れを示す語句（At first / Now / still）が多い文章では、「過去と現在の変化」が問われやすく、内容一致では数字（five / fifty / one hundred）や時の取り違えが誤りの選択肢になりがちです。数字は必ず本文で確認しましょう。`
        },
        {
          t: '空所補充は、品詞・語法・文脈で決める',
          n: R`(1) は感情を表す分詞（人が感じるので -ed 形）、(2) は文脈（最初は 5 人 → 写真を見た人が増えた）に合う動詞、(4) は not only A but also B、(5) は take part in ~ という決まった形です。決まった形（構文・熟語）の問題は知識で即答し、残りは文脈から意味を推理します。`,
          easy: R`**-ed と -ing** の使い分けは、「人が（心の中で）感じる」なら **-ed**（shocked ＝ ショックを受けた）、「物・事が（人に）与える」なら **-ing**（shocking ＝ ショックを与えるような）と覚えます。`,
          lv: 2
        },
        {
          t: '指示語は、直前の文の主語に戻って確かめる',
          n: R`(3) の They は、直前の文の主語（people of all ages）を受けています。複数形の They は、直前の文にある複数の名詞（people, volunteers など）を探し、意味が通るかを確かめます。`,
          easy: R`「彼ら（They）」と出てきたら、**直前の文の「人々」**に戻ります。「あらゆる年齢の人が参加している。（その人たちは）2 時間で約 100 袋のごみを集める」と、意味が通る相手を選びます。`,
          lv: 2
        },
        {
          t: '内容一致は、数字・時・人物の取り違えに注意する',
          n: R`問6・問7 では、数字（fifty / five / one hundred）、時（first Sunday / at first / now）、人物（high school student / university student）を入れ替えた選択肢が、誤りの定番です。選択肢のキーワードを本文で探し、その部分と照らし合わせます。`,
          lv: 2
        }
      ],
      tags: ['長文', '空所補充', '分詞', '指示語', '内容一致', '環境']
    }
  ]);
})();
