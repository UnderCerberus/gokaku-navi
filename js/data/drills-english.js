/* GOKAKU NAVI — 英語 復習ドリル（level: 'drill'）
   英語の全 7 単元（必須英単語・熟語・中学英文法・文法語法・整序・会話文・長文）× 3〜5 枚 = 29 枚。
   上位単元で誤答した生徒が「1 つ前の範囲」に戻って解く、基礎確認の一問一答です。
   英文・設問・選択肢・解説はすべて書き下ろしのオリジナル。solution の各ステップに易しい言い直し（easy）を付けています。 */
(function () {
  'use strict';
  const R = String.raw;
  const SRC = function () { return { univ: 'オリジナル' }; };

  /* ================================================================
   *  長文（passage）— 復習ドリルの e-reading 用（60〜100 語）
   * ================================================================ */
  JK.registerPassages([
    /* ---------- ep-drill-01: 週末のアルバイト ---------- */
    {
      id: 'ep-drill-01',
      title: "Yuki's Weekend Job",
      level: 'drill',
      topic: '日常生活',
      source: SRC(),
      paras: [
        [
          { en: R`Yuki is a high school student.`, ja: R`ユキは高校生だ。` },
          { en: R`Every Saturday, she {b1:works} at a small bakery near her house.`, ja: R`毎週土曜日、彼女は家の近くの小さなパン屋で働いている。` },
          { en: R`She goes to the shop {b2:by} bicycle.`, ja: R`彼女は自転車でその店へ行く。` },
          { en: R`First, she helps the owner make bread.`, ja: R`まず、彼女は店主がパンを作るのを手伝う。` },
          { en: R`{u3:It} is hard work, but she enjoys it.`, ja: R`それは重労働だが、彼女はそれを楽しんでいる。` }
        ],
        [
          { en: R`At noon, many customers come to the shop.`, ja: R`正午には、たくさんの客が店にやって来る。` },
          { en: R`Yuki says "Welcome!" to them with a big smile.`, ja: R`ユキは満面の笑みで、彼らに「いらっしゃいませ！」と言う。` },
          { en: R`After work, she can take some bread home.`, ja: R`仕事のあと、彼女はパンを少し家に持ち帰ることができる。` },
          { en: R`Her family always looks forward to it.`, ja: R`彼女の家族はいつもそれを楽しみにしている。` },
          { en: R`Yuki wants to be a baker in the future.`, ja: R`ユキは将来、パン職人になりたいと思っている。` }
        ]
      ],
      vocab: ['bakery', 'owner', 'customer', 'noon', 'baker']
    },

    /* ---------- ep-drill-02: 飼い猫のモモ ---------- */
    {
      id: 'ep-drill-02',
      title: 'My Cat, Momo',
      level: 'drill',
      topic: '動物・生活',
      source: SRC(),
      paras: [
        [
          { en: R`I have a cat named Momo.`, ja: R`私にはモモという名前の猫がいる。` },
          { en: R`She is two years old, and she has soft white fur.`, ja: R`彼女は 2 歳で、やわらかな白い毛をしている。` },
          { en: R`Momo sleeps on my bed every night.`, ja: R`モモは毎晩、私のベッドの上で眠る。` }
        ],
        [
          { en: R`In the morning, she wakes me up by touching my face {b1:with} her paw.`, ja: R`朝になると、彼女は前足で私の顔にさわって私を起こす。` },
          { en: R`I get up and give her some food.`, ja: R`私は起きて、彼女に餌を少しやる。` },
          { en: R`She is very {b2:happy} when she is eating.`, ja: R`食べているとき、彼女はとても幸せそうだ。` }
        ],
        [
          { en: R`After breakfast, I go to school.`, ja: R`朝食のあと、私は学校へ行く。` },
          { en: R`Momo stays home and {u3:looks out of the window} all day.`, ja: R`モモは家にいて、一日中窓の外を眺めている。` },
          { en: R`When I come home, she always runs to the door.`, ja: R`私が帰宅すると、彼女はいつもドアへ走ってくる。` },
          { en: R`I think she is waiting for me.`, ja: R`彼女は私を待っているのだと思う。` }
        ]
      ],
      vocab: ['fur', 'paw', 'wake', 'touch'],
      vocabExtra: [
        ['paw', '名', '(動物の)足; 前足', 2]
      ]
    },

    /* ---------- ep-drill-03: 運動会の日記 ---------- */
    {
      id: 'ep-drill-03',
      title: 'Sports Day',
      level: 'drill',
      topic: '学校生活',
      source: SRC(),
      paras: [
        [
          { en: R`Today was my school's sports day.`, ja: R`今日はうちの学校の運動会だった。` },
          { en: R`In the morning, the weather was cloudy, but it did not rain.`, ja: R`午前中は曇っていたが、雨は降らなかった。` },
          { en: R`I {b1:ran} in the 100-meter race, and I came in second.`, ja: R`私は 100 メートル走に出場し、2 位になった。` }
        ],
        [
          { en: R`In the afternoon, our class played a big game of tug of war.`, ja: R`午後、私たちのクラスは綱引きの大一番を行った。` },
          { en: R`Everyone pulled the rope as hard as {b2:possible}.`, ja: R`みんなができるだけ強くロープを引いた。` },
          { en: R`Our team {u3:won by a small difference}.`, ja: R`私たちのチームは僅差で勝った。` }
        ],
        [
          { en: R`We were so happy that we shouted and jumped.`, ja: R`私たちはとてもうれしくて、叫んだり跳びはねたりした。` },
          { en: R`I was very tired when I got home, but it was a wonderful day.`, ja: R`家に帰ったときはとても疲れていたが、すばらしい一日だった。` }
        ]
      ],
      vocab: ['race', 'rope', 'pull', 'shout', 'cloudy']
    }
  ]);

  /* ================================================================
   *  問題カード
   * ================================================================ */
  JK.registerProblems([
    /* ---------- e-vocab（必須英単語）---------- */
    {
      id: 'd-e-vocab-01',
      subject: 'english',
      level: 'drill',
      unit: 'e-vocab',
      title: '単語：動詞の基本語 ①',
      source: SRC(),
      time: 3,
      body: R`動詞の意味と使い方を確認します。それぞれの問いに答えなさい。`,
      fig: null,
      parts: [
        {
          label: '(1)',
          q: R`次の英単語の意味として最も適切なものを選びなさい。

**avoid**`,
          type: 'choice',
          choices: ['〜を受け入れる', '〜を避ける', '〜を借りる', '〜を信頼する'],
          answer: 1,
          explain: R`**avoid** は「〜を避ける」という意味です。avoid doing（〜するのを避ける）の形でよく使います。「〜を受け入れる」は accept、「〜を借りる」は borrow、「〜を信頼する」は trust です。`
        },
        {
          label: '(2)',
          q: R`次の英単語の意味として最も適切なものを選びなさい。

**improve**`,
          type: 'choice',
          choices: ['〜を禁止する', '〜を発明する', '〜を改善する', '〜を許す'],
          answer: 2,
          explain: R`**improve** は「〜を改善する; 良くなる」という意味です。improve my English（英語を上達させる）のように使います。「〜を禁止する」は forbid、「〜を発明する」は invent、「〜を許す」は allow や forgive です。`
        },
        {
          label: '(3)',
          q: R`次の英単語の意味として最も適切なものを選びなさい。

**protect**`,
          type: 'choice',
          choices: ['〜を守る', '〜を壊す', '〜を集める', '〜を運ぶ'],
          answer: 0,
          explain: R`**protect** は「〜を守る; 〜を保護する」という意味です。protect A from B で「A を B から守る」を表します。「〜を壊す」は destroy、「〜を集める」は collect、「〜を運ぶ」は carry です。`
        },
        {
          label: '(4)',
          q: R`空所に入る最も適切な語を選びなさい。

I (    ) a letter from my aunt in Osaka this morning. It said that she was coming to visit us.`,
          type: 'choice',
          choices: ['refused', 'reduced', 'repaired', 'received'],
          answer: 3,
          explain: R`**receive** は「〜を受け取る」です。「おばからの手紙を受け取った」とすると、後ろの It said that ... とも自然につながります。refuse（断る）、reduce（減らす）、repair（修理する）では手紙を受け取る話になりません。`
        },
        {
          label: '(5)',
          q: R`空所に入る最も適切な語を選びなさい。

Mr. Brown can (    ) any math problem easily because he is very good at math.`,
          type: 'choice',
          choices: ['spell', 'shake', 'solve', 'shout'],
          answer: 2,
          explain: R`**solve** は「〜を解く; 〜を解決する」です。solve a problem（問題を解く）はよく使う組み合わせです。spell（〜を綴る）、shake（〜を振る）、shout（叫ぶ）は math problem と結びつきません。`
        },
        {
          label: '(6)',
          q: R`日本語の意味に合うように、空所に入る英語 1 語を書きなさい。

Can I (    ) your dictionary for a day?（辞書を 1 日借りてもいいですか。）`,
          type: 'text',
          answer: 'borrow',
          hint: R`b で始まる動詞です。`,
          explain: R`**borrow** は「〜を（無料で）借りる」です。反対に「〜を貸す」は lend で、Could you lend me your pen? のように言います。borrow は借りる側、lend は貸す側の動詞です。`
        }
      ],
      solution: [
        {
          t: '意味問題は「〜を」の形で日本語を思い浮かべる',
          n: R`avoid（〜を避ける）、improve（〜を改善する）、protect（〜を守る）のように、動詞は「〜を」とセットで覚えます。意味が分からない選択肢は、知っている語の意味から消去していきます。`,
          easy: R`英単語の勉強では、日本語の意味だけでなく、**どんな形で使うか**も一緒に覚えましょう。avoid なら「avoid doing（〜するのを避ける）」、protect なら「protect A from B（A を B から守る）」のように、短い例文ごと覚えると忘れにくくなります。`,
          pro: R`共通テストの語彙問題は、単語の意味そのものより「文脈にふさわしいか」を問います。選択肢の動詞を 1 つずつ空所に入れて、日本語で意味が通るか確かめる習慣をつけましょう。`
        },
        {
          t: '空所補充は文全体の意味から決める',
          n: R`(4) は「おばからの手紙を受け取った」なので received、(5) は「数学が得意なので問題を簡単に解ける」なので solve、(6) は「借りる」なので borrow です。形が似た語（refuse / reduce / repair / receive）は意味の取り違えに注意します。`,
          easy: R`空所のある文を日本語に直して、「どの動詞なら自然か」を考えます。(4) なら「手紙を（　）」に入るのは「受け取る」、(5) なら「問題を（　）」に入るのは「解く」です。つづりが似た語がそろっているのは、わざと迷わせるためなので、あわてずに意味で決めましょう。`
        }
      ],
      tags: ['語彙', '動詞']
    },

    {
      id: 'd-e-vocab-02',
      subject: 'english',
      level: 'drill',
      unit: 'e-vocab',
      title: '単語：動詞の基本語 ②',
      source: SRC(),
      time: 3,
      body: R`動詞の意味と使い方を確認します。それぞれの問いに答えなさい。`,
      fig: null,
      parts: [
        {
          label: '(1)',
          q: R`次の英単語の意味として最も適切なものを選びなさい。

**prefer**`,
          type: 'choice',
          choices: ['〜を準備する', '〜のほうを好む', '〜を予測する', '〜を約束する'],
          answer: 1,
          explain: R`**prefer** は「〜のほうを好む」という意味です。I prefer tea to coffee.（コーヒーより紅茶が好きです）のように、prefer A to B で「B より A を好む」を表します。「準備する」は prepare、「予測する」は predict、「約束する」は promise です。`
        },
        {
          label: '(2)',
          q: R`次の英単語の意味として最も適切なものを選びなさい。

**include**`,
          type: 'choice',
          choices: ['〜を除く', '〜を招く', '〜を調べる', '〜を含む'],
          answer: 3,
          explain: R`**include** は「〜を含む」という意味です。反対の「〜を除く」は exclude、「〜を招く」は invite、「〜を調べる」は examine です。`
        },
        {
          label: '(3)',
          q: R`次の英単語の意味として最も適切なものを選びなさい。

**invent**`,
          type: 'choice',
          choices: ['〜を発明する', '〜を発見する', '〜に投資する', '〜を調査する'],
          answer: 0,
          explain: R`**invent** は「〜を発明する」、名詞は invention（発明）です。「〜を発見する」は discover で、すでにあるものを見つけるときに使います。invest は「投資する」、investigate は「調査する」です。`
        },
        {
          label: '(4)',
          q: R`空所に入る最も適切な語を選びなさい。

The price (    ) tax, so you do not need to pay any extra money.`,
          type: 'choice',
          choices: ['invents', 'avoids', 'includes', 'belongs'],
          answer: 2,
          explain: R`「値段には税金が**含まれている**ので、追加で払う必要はない」という意味なので include の 3 単現形 **includes** が入ります。invent は「発明する」、avoid は「避ける」、belong は「所属する」で、意味が通りません。`
        },
        {
          label: '(5)',
          q: R`空所に入る最も適切な語を選びなさい。

Please (    ) this English sentence into Japanese.`,
          type: 'choice',
          choices: ['support', 'translate', 'warn', 'attend'],
          answer: 1,
          explain: R`**translate A into B** で「A を B に翻訳する」です。support（支える）、warn（警告する）、attend（出席する）は into Japanese と結びつきません。`
        },
        {
          label: '(6)',
          q: R`**reduce** と反対の意味を表す語を選びなさい。`,
          type: 'choice',
          choices: ['include', 'invite', 'increase', 'improve'],
          answer: 2,
          explain: R`**reduce** は「〜を減らす」、反対の意味は **increase**（増える; 〜を増やす）です。名詞も reduction（減少）と increase（増加）で対になります。`
        }
      ],
      solution: [
        {
          t: '似たつづりの語は意味で区別する',
          n: R`prefer / prepare / predict / promise はどれも pre- や pr- で始まる動詞ですが、意味はそれぞれ「好む」「準備する」「予測する」「約束する」と異なります。語頭だけで決めず、意味を 1 語ずつ確かめます。`,
          easy: R`つづりが似た単語は、まとめて覚えると区別しやすくなります。prefer は「〜のほうを（先に）好む」と考えるとイメージできます。意味を取り違えたときは、その単語を声に出して 3 回読み、短い例文を 1 つ作っておくと忘れにくくなります。`
        },
        {
          t: '反意語・使い方（前置詞）もセットで覚える',
          n: R`include ⇔ exclude、reduce ⇔ increase のように対にして覚えます。translate A into B や prefer A to B のように、後ろに続く前置詞（into / to）も一緒に覚えると、空所補充で役立ちます。`,
          easy: R`単語は 1 つずつ覚えるより、**反対の意味の語**と一緒に覚えるほうが速く身につきます。「増える (increase) ⇔ 減らす (reduce)」のように、ペアで頭に入れましょう。`,
          pro: R`translate A into B のように「動詞 + 目的語 + 前置詞」の形が決まっている語は、整序問題や書き換え問題でも狙われます。語の意味だけでなく型ごと覚えておくと得点源になります。`
        }
      ],
      tags: ['語彙', '動詞', '反意語']
    },

    {
      id: 'd-e-vocab-03',
      subject: 'english',
      level: 'drill',
      unit: 'e-vocab',
      title: '単語：名詞（社会・文化）',
      source: SRC(),
      time: 3,
      body: R`社会や文化に関する名詞の意味を確認します。それぞれの問いに答えなさい。`,
      fig: null,
      parts: [
        {
          label: '(1)',
          q: R`次の英単語の意味として最も適切なものを選びなさい。

**custom**`,
          type: 'choice',
          choices: ['衣装', '顧客', '習慣; 風習', '費用'],
          answer: 2,
          explain: R`**custom** は「（社会の）習慣; 風習」です。形が似た costume は「衣装」、customer は「顧客」、cost は「費用」なので区別しましょう。なお customs と複数形にすると「税関」の意味になります。`
        },
        {
          label: '(2)',
          q: R`次の英単語の意味として最も適切なものを選びなさい。

**opinion**`,
          type: 'choice',
          choices: ['意見', '選択', '機会', '申し込み'],
          answer: 0,
          explain: R`**opinion** は「意見」です。In my opinion, ...（私の意見では…）という形でよく使います。「選択」は choice、「機会」は chance や opportunity、「申し込み」は application です。`
        },
        {
          label: '(3)',
          q: R`次の英単語の意味として最も適切なものを選びなさい。

**environment**`,
          type: 'choice',
          choices: ['政府', '経験', '娯楽', '環境'],
          answer: 3,
          explain: R`**environment** は「環境」です。形容詞は environmental（環境の）です。「政府」は government、「経験」は experience、「娯楽」は entertainment です。`
        },
        {
          label: '(4)',
          q: R`空所に入る最も適切な語を選びなさい。

Eating soba on New Year's Eve is an old Japanese (    ).`,
          type: 'choice',
          choices: ['language', 'tradition', 'pollution', 'subject'],
          answer: 1,
          explain: R`**tradition** は「伝統」です。「大みそかにそばを食べるのは日本の古い伝統だ」という意味になります。language（言語）、pollution（汚染）、subject（教科; 主題）では意味が通りません。`
        },
        {
          label: '(5)',
          q: R`空所に入る最も適切な語を選びなさい。

I have never had such an exciting (    ) before. It was my first trip abroad.`,
          type: 'choice',
          choices: ['experience', 'experiment', 'expression', 'exercise'],
          answer: 0,
          explain: R`**experience** は「経験」です。「初めての海外旅行」とあるので、「こんなわくわくする経験は初めてだ」となります。experiment は「実験」、expression は「表現」、exercise は「運動; 練習」で、どれも trip abroad の説明になりません。`
        },
        {
          label: '(6)',
          q: R`日本語の意味に合うように、空所に入る英語 1 語を書きなさい。

The (    ) of Tokyo is about fourteen million.（東京の人口は約 1400 万人です。）`,
          type: 'text',
          answer: 'population',
          hint: R`p で始まる名詞です。`,
          explain: R`**population** は「人口」です。「人口が多い」は a large population、「人口が少ない」は a small population と言い、many や few ではなく large / small を使うのが決まりです。`
        }
      ],
      solution: [
        {
          t: '形が似ている名詞に気をつける',
          n: R`custom（習慣）・costume（衣装）・customer（顧客）、experience（経験）・experiment（実験）のように、つづりが似て意味が違う名詞は入試の定番です。語尾や途中の文字の違いまで見て覚えます。`,
          easy: R`似た単語は「ここが違う」という**目印**を決めておきましょう。たとえば experiment は「実験」で、science の授業で行うもの、と場面と結びつけると、experience（経験）と混ざりにくくなります。`
        },
        {
          t: '名詞は決まった組み合わせで覚える',
          n: R`in my opinion（私の意見では）、an old tradition（古い伝統）、a large population（多い人口）のように、よく一緒に使われる語の組み合わせを覚えると、空所補充の根拠になります。`,
          easy: R`名詞は 1 語だけでなく、**よくいっしょに使う言葉**ごと覚えると便利です。population（人口）なら a large population（人口が多い）、opinion（意見）なら in my opinion（私の意見では）のように、短いフレーズで覚えましょう。`,
          pro: R`「人口が多い／少ない」は large / small を使う（many / few は不可）、のような使い分けは正誤問題でよく問われます。名詞ごとに「相性のよい形容詞」を 1 つ覚えておくと強いです。`
        }
      ],
      tags: ['語彙', '名詞']
    },

    {
      id: 'd-e-vocab-04',
      subject: 'english',
      level: 'drill',
      unit: 'e-vocab',
      title: '単語：形容詞・副詞',
      source: SRC(),
      time: 3,
      body: R`形容詞・副詞の意味と使い方を確認します。それぞれの問いに答えなさい。`,
      fig: null,
      parts: [
        {
          label: '(1)',
          q: R`次の英単語の意味として最も適切なものを選びなさい。

**necessary**`,
          type: 'choice',
          choices: ['安全な', '特別な', '自然な', '必要な'],
          answer: 3,
          explain: R`**necessary** は「必要な」です。It is necessary to do ...（〜することが必要だ）の形でよく使います。「安全な」は safe、「特別な」は special、「自然な」は natural です。`
        },
        {
          label: '(2)',
          q: R`次の英単語の意味として最も適切なものを選びなさい。

**polite**`,
          type: 'choice',
          choices: ['正直な', '礼儀正しい', '勇敢な', 'うるさい'],
          answer: 1,
          explain: R`**polite** は「礼儀正しい; 丁寧な」です。反対は impolite（無礼な）や rude です。「正直な」は honest、「勇敢な」は brave、「うるさい」は noisy です。`
        },
        {
          label: '(3)',
          q: R`次の英単語の意味として最も適切なものを選びなさい。

**hardly**`,
          type: 'choice',
          choices: ['ほとんど〜ない', '熱心に', 'たぶん', 'ますます'],
          answer: 0,
          explain: R`**hardly** は「ほとんど〜ない」という否定の意味の副詞です。hard（熱心に; 激しく）に -ly をつけた形ですが、意味はまったく別なので注意します。I can hardly hear you.（ほとんど聞こえません）のように使います。`
        },
        {
          label: '(4)',
          q: R`空所に入る最も適切な語を選びなさい。

This sofa is very (    ). I could sleep on it all night.`,
          type: 'choice',
          choices: ['dangerous', 'familiar', 'comfortable', 'necessary'],
          answer: 2,
          explain: R`**comfortable** は「快適な; 心地よい」です。「一晩中寝られそうなほど心地よい」と考えます。dangerous（危険な）、familiar（よく知っている）、necessary（必要な）では「寝られそう」とつながりません。`
        },
        {
          label: '(5)',
          q: R`空所に入る最も適切な語を選びなさい。

The supermarket is very (    ) for me because it is open until midnight.`,
          type: 'choice',
          choices: ['careless', 'convenient', 'curious', 'certain'],
          answer: 1,
          explain: R`**convenient** は「便利な; 都合のよい」です。「夜中まで開いているので便利だ」となります。careless（不注意な）、curious（好奇心の強い）、certain（確かな）では文意に合いません。`
        },
        {
          label: '(6)',
          q: R`空所に入る最も適切な語を選びなさい。

I have not seen Mike (    ). I wonder how he is.`,
          type: 'choice',
          choices: ['recently', 'especially', 'nearly', 'loudly'],
          answer: 0,
          explain: R`**recently** は「最近」で、現在完了と一緒によく使います。「最近マイクに会っていない」という意味になります。especially は「特に」、nearly は「ほとんど」、loudly は「大声で」で、have not seen につなげても意味が通りません。`
        }
      ],
      solution: [
        {
          t: '形容詞・副詞は「何を説明する語か」を考える',
          n: R`形容詞は名詞を、副詞は動詞や形容詞をくわしく説明します。(4)(5) は sofa や supermarket の状態を表す形容詞、(6) は have not seen を説明する副詞が入ります。`,
          easy: R`形容詞は「どんな○○か」を言う語（comfortable な sofa）、副詞は「どのように・いつ」を言う語（recently 会っていない）です。空所の前後を見て、**名詞を説明するのか、動作を説明するのか**を考えると選びやすくなります。`
        },
        {
          t: '形が似ていても意味が違う語を区別する',
          n: R`hard（熱心に）と hardly（ほとんど〜ない）、recent（最近の）と recently（最近）のように、-ly がつくと意味が変わる語があります。hardly は否定の意味を持つことを覚えておきます。`,
          easy: R`hard に -ly をつけた hardly は、「ほとんど〜ない」という、**まったく別の意味**になります。「hardly = ほとんど〜ない」と、一言で暗記してしまいましょう。`,
          pro: R`hardly / rarely / seldom などの準否定語は、倒置や付加疑問文でも出題されます。「それ自体が否定の意味を持つ」と押さえておくと、文法問題でも役立ちます。`
        }
      ],
      tags: ['語彙', '形容詞', '副詞']
    },

    {
      id: 'd-e-vocab-05',
      subject: 'english',
      level: 'drill',
      unit: 'e-vocab',
      title: '単語：反意語・紛らわしい語',
      source: SRC(),
      time: 3,
      body: R`反意語・同意語や、形の似た語の使い分けを確認します。それぞれの問いに答えなさい。`,
      fig: null,
      parts: [
        {
          label: '(1)',
          q: R`**ancient** と反対の意味を表す語を選びなさい。`,
          type: 'choice',
          choices: ['local', 'foreign', 'modern', 'native'],
          answer: 2,
          explain: R`**ancient** は「古代の」、反対の意味は **modern**（現代の）です。local は「地元の」、foreign は「外国の」、native は「生まれ故郷の; 母国の」で、時代を表す語ではありません。`
        },
        {
          label: '(2)',
          q: R`空所に入る最も適切な語を選びなさい。

The sun (    ) in the east.`,
          type: 'choice',
          choices: ['raises', 'rises', 'reaches', 'returns'],
          answer: 1,
          explain: R`**rise** は「上がる; 昇る」で、後ろに目的語を取りません（rise - rose - risen）。「太陽は東から昇る」なので rises が入ります。raise は「〜を上げる」で目的語が必要な別の動詞です。`
        },
        {
          label: '(3)',
          q: R`空所に入る最も適切な語を選びなさい。

Could you (    ) me your pen? I forgot mine.`,
          type: 'choice',
          choices: ['lend', 'borrow', 'rent', 'save'],
          answer: 0,
          explain: R`**lend A B** で「A に B を貸す」です。「私にペンを貸してくれませんか」と頼む文なので lend が入ります。borrow は「借りる」で、Can I borrow your pen? のように借りる側が主語になります。`
        },
        {
          label: '(4)',
          q: R`**accept** と反対の意味を表す語を選びなさい。`,
          type: 'choice',
          choices: ['expect', 'excuse', 'explain', 'refuse'],
          answer: 3,
          explain: R`**accept** は「〜を受け入れる」、反対の意味は **refuse**（〜を断る）です。expect は「期待する」、excuse は「許す」、explain は「説明する」です。`
        },
        {
          label: '(5)',
          q: R`**huge** とほぼ同じ意味を表す語を選びなさい。`,
          type: 'choice',
          choices: ['tiny', 'quiet', 'giant', 'empty'],
          answer: 2,
          explain: R`**huge** は「巨大な」で、**giant**（巨大な）とほぼ同じ意味です。tiny は「とても小さい」で反対の意味、quiet は「静かな」、empty は「空の」です。`
        },
        {
          label: '(6)',
          q: R`空所に入る最も適切な語を選びなさい。

Sleeping too little has a bad (    ) on your health.`,
          type: 'choice',
          choices: ['affect', 'effect', 'effort', 'effective'],
          answer: 1,
          explain: R`a bad **effect** on ~ で「〜への悪い影響」です。effect は名詞（影響; 効果）で、a の後ろに置けます。affect は「〜に影響する」という動詞なので、a bad の後ろには入りません。effort は「努力」、effective は「効果的な」という形容詞です。`
        }
      ],
      solution: [
        {
          t: '反意語・同意語は「ペア」で覚える',
          n: R`ancient ⇔ modern、accept ⇔ refuse のように、意味が反対の語はペアで暗記します。huge = giant のような同意語もセットにすると、選択肢の中から答えを選びやすくなります。`,
          easy: R`単語を覚えるときは「正反対の語」も一緒に頭に入れましょう。「古い (ancient) ⇔ 現代の (modern)」「受け入れる (accept) ⇔ 断る (refuse)」のように、ペアにすると 1 回で 2 語覚えられます。`
        },
        {
          t: '形の似た動詞・名詞は文の働きで使い分ける',
          n: R`rise（自動詞）と raise（他動詞）、lend（貸す）と borrow（借りる）、affect（動詞）と effect（名詞）など、形や意味が紛らわしい組は、空所の前後の語（a bad ___ / ___ me your pen）から品詞や形を判断します。`,
          easy: R`**「〜を」が続くかどうか**が使い分けのコツです。raise は「〜を上げる」と目的語が必要、rise は「上がる」と目的語はいりません。「太陽が昇る」は目的語がないので rise、と考えます。`,
          pro: R`rise / raise、lie / lay、affect / effect のような混同しやすい語は、4 択の語彙問題・文法問題の両方で頻出です。活用（rise - rose - risen / raise - raised - raised）も含めて確実に押さえましょう。`
        }
      ],
      tags: ['語彙', '反意語', '紛らわしい語']
    },

    /* ---------- e-idiom（熟語・イディオム）---------- */
    {
      id: 'd-e-idiom-01',
      subject: 'english',
      level: 'drill',
      unit: 'e-idiom',
      title: '熟語：動詞 + 前置詞',
      source: SRC(),
      time: 3,
      body: R`「動詞 + 前置詞」の熟語を確認します。空所に入る最も適切な語（句）を選びなさい。`,
      fig: null,
      parts: [
        {
          label: '(1)',
          q: R`I am looking (    ) to seeing you next week.`,
          type: 'choice',
          choices: ['ahead', 'up', 'forward', 'front'],
          answer: 2,
          explain: R`**look forward to ~** で「〜を楽しみにする」です。この to は前置詞なので、後ろには名詞か動名詞（ここでは seeing）が続きます。ahead や front では熟語になりません。`
        },
        {
          label: '(2)',
          q: R`Please take (    ) of my cat while I am away.`,
          type: 'choice',
          choices: ['care', 'part', 'place', 'turn'],
          answer: 0,
          explain: R`**take care of ~** で「〜の世話をする」です。「私がいない間、猫の世話をしてください」という意味になります。take part in は「〜に参加する」、take place は「行われる」で、of とは結びつきません。`
        },
        {
          label: '(3)',
          q: R`She is waiting (    ) the bus at the bus stop.`,
          type: 'choice',
          choices: ['at', 'on', 'to', 'for'],
          answer: 3,
          explain: R`**wait for ~** で「〜を待つ」です。「バス停でバスを待っている」という意味です。wait の後ろに at / on / to を置いても「待つ」の意味にはなりません。`
        },
        {
          label: '(4)',
          q: R`My sister (    ) our mother. They have the same smile and the same voice.`,
          type: 'choice',
          choices: ['looks for', 'gets over', 'takes after', 'puts on'],
          answer: 2,
          explain: R`**take after ~** は「〜に似ている」（顔つきや性格が親などに似る）です。「同じ笑顔と同じ声」とあるので takes after が合います。look for は「〜を探す」、get over は「〜を乗り越える」、put on は「〜を身につける」です。`
        },
        {
          label: '(5)',
          q: R`The result of the game depends (    ) the weather.`,
          type: 'choice',
          choices: ['in', 'on', 'at', 'by'],
          answer: 1,
          explain: R`**depend on ~** で「〜次第である; 〜に頼る」です。「試合の結果は天気次第だ」という意味になります。depend は前置詞 on（または upon）とセットで使います。`
        }
      ],
      solution: [
        {
          t: '「動詞 + 前置詞」はセットで覚える',
          n: R`look forward to ~（〜を楽しみにする）、take care of ~（〜の世話をする）、wait for ~（〜を待つ）、depend on ~（〜次第である）のように、動詞と前置詞は 1 つのかたまりで覚えます。空所の前後を見て、決まった組み合わせを探します。`,
          easy: R`熟語は、**英語のかたまり**を日本語の意味と一緒に丸ごと覚えるのがコツです。たとえば「wait for」は「ウェイト・フォー」と声に出して、「待つ」とセットにします。前置詞だけを別に覚えようとすると、混ざってしまいます。`,
          pro: R`look forward to の to は不定詞ではなく前置詞です。後ろに動詞を置くときは look forward to seeing のように -ing 形になります。この点は文法問題や整序問題でもよく問われます。`
        },
        {
          t: '意味が似た熟語を区別する',
          n: R`take after ~（〜に似ている）、take care of ~（〜の世話をする）、look after ~（〜の世話をする）は、同じ take / look でも意味が大きく違います。文の内容（似ている話か、世話の話か）で判断します。`,
          easy: R`「take after」は「あとから追いかけるように似ていく」と考えて、「〜に似ている」と覚えましょう。「世話をする」は take care of か look after、と別に覚えておくと混ざりません。`
        }
      ],
      tags: ['熟語', '動詞句', '前置詞']
    },

    {
      id: 'd-e-idiom-02',
      subject: 'english',
      level: 'drill',
      unit: 'e-idiom',
      title: '熟語：動詞 + 副詞',
      source: SRC(),
      time: 3,
      body: R`「動詞 + 副詞」の熟語（句動詞）を確認します。それぞれの問いに答えなさい。`,
      fig: null,
      parts: [
        {
          label: '(1)',
          q: R`空所に入る最も適切な語を選びなさい。

It is dark in here. Please (    ) on the light.`,
          type: 'choice',
          choices: ['take', 'give', 'pick', 'turn'],
          answer: 3,
          explain: R`**turn on ~** で「〜（電気・機器）をつける」です。「暗いので電気をつけてください」という意味になります。反対の「〜を消す」は turn off です。`
        },
        {
          label: '(2)',
          q: R`空所に入る最も適切な語句を選びなさい。

It is cold outside. You should (    ) your coat.`,
          type: 'choice',
          choices: ['put on', 'take off', 'give up', 'look at'],
          answer: 0,
          explain: R`**put on ~** は「〜を着る; 〜を身につける」です。「外は寒いのでコートを着たほうがいい」となります。take off は「〜を脱ぐ」で反対の意味です。`
        },
        {
          label: '(3)',
          q: R`空所に入る最も適切な語句を選びなさい。

I cannot (    ) the answer to this question. Can you help me?`,
          type: 'choice',
          choices: ['turn off', 'take off', 'find out', 'put off'],
          answer: 2,
          explain: R`**find out ~** は「〜を見つけ出す; 〜を知る」です。「この問題の答えが分からない」という文脈に合います。turn off は「消す」、take off は「脱ぐ」、put off は「延期する」です。`
        },
        {
          label: '(4)',
          q: R`空所に入る最も適切な語句を選びなさい。

My brother (    ) smoking last year because of his health.`,
          type: 'choice',
          choices: ['turned on', 'put on', 'looked up', 'gave up'],
          answer: 3,
          explain: R`**give up ~** は「〜をあきらめる; 〜をやめる」です。give up doing の形で「〜するのをやめる」と使います。「健康のために去年タバコをやめた」となります。`
        },
        {
          label: '(5)',
          q: R`次の英文の太字部分の意味として最も適切なものを選びなさい。

I will **look up** the word in my dictionary.`,
          type: 'choice',
          choices: ['〜を調べる', '〜を尊敬する', '〜の世話をする', '〜をつける'],
          answer: 0,
          explain: R`**look up ~** は「（辞書などで）〜を調べる」です。「辞書でその語を調べる」という意味になります。「〜を尊敬する」は look up to ~、「〜の世話をする」は look after ~、「〜をつける」は turn on ~ です。`
        }
      ],
      solution: [
        {
          t: '反対の意味の組で覚える',
          n: R`turn on（つける）⇔ turn off（消す）、put on（着る）⇔ take off（脱ぐ）のように、反対の意味の熟語をペアにして覚えます。空所の文脈（暗い・寒い）から、どちらが入るかを決めます。`,
          easy: R`「on」は「くっついている」、「off」は「離れている」というイメージです。電気が on ならついている、服を put on すれば体にくっつく、と考えると、反対の意味の組が覚えやすくなります。`
        },
        {
          t: '動詞のあとの小さな語が意味を変える',
          n: R`look の後ろに up をつけると「調べる」、up to をつけると「尊敬する」、after をつけると「世話をする」と意味が変わります。小さな語（up / after など）を落とさずに覚えます。`,
          easy: R`同じ「look（見る）」でも、後ろの語で意味が大きく変わります。**後ろの小さな語まで丸ごと**覚えるのが熟語の勉強です。`,
          pro: R`目的語が代名詞のときは、put it on / turn it off のように動詞と副詞の間に入れます（put on it とは言いません）。語順の問題で差がつきやすいポイントです。`
        }
      ],
      tags: ['熟語', '句動詞']
    },

    {
      id: 'd-e-idiom-03',
      subject: 'english',
      level: 'drill',
      unit: 'e-idiom',
      title: '熟語：be + 形容詞 + 前置詞',
      source: SRC(),
      time: 3,
      body: R`「be + 形容詞 + 前置詞」の熟語を確認します。空所に入る最も適切な語を選びなさい。`,
      fig: null,
      parts: [
        {
          label: '(1)',
          q: R`My brother is good (    ) playing soccer.`,
          type: 'choice',
          choices: ['in', 'at', 'with', 'for'],
          answer: 1,
          explain: R`**be good at ~** で「〜が得意である」です。後ろは名詞か動名詞（playing）が続きます。反対の「〜が苦手である」は be poor at ~ や be bad at ~ です。`
        },
        {
          label: '(2)',
          q: R`I am interested (    ) Japanese history.`,
          type: 'choice',
          choices: ['at', 'of', 'in', 'on'],
          answer: 2,
          explain: R`**be interested in ~** で「〜に興味がある」です。「日本の歴史に興味がある」という意味になります。interested の後ろは in を使います。`
        },
        {
          label: '(3)',
          q: R`Many people are afraid (    ) snakes.`,
          type: 'choice',
          choices: ['of', 'for', 'by', 'to'],
          answer: 0,
          explain: R`**be afraid of ~** で「〜を恐れている」です。「多くの人がヘビを怖がる」という意味になります。by は「〜によって」、to や for は afraid の後ろには使いません。`
        },
        {
          label: '(4)',
          q: R`Kyoto is famous (    ) its old temples.`,
          type: 'choice',
          choices: ['as', 'of', 'from', 'for'],
          answer: 3,
          explain: R`**be famous for ~** で「〜で有名である」です。for の後ろには有名な理由（古いお寺）が続きます。be famous as ~ は「〜として有名だ」で、後ろには立場や資格（a tourist city など）が続きます。`
        },
        {
          label: '(5)',
          q: R`This box is full (    ) old toys.`,
          type: 'choice',
          choices: ['with', 'of', 'by', 'in'],
          answer: 1,
          explain: R`**be full of ~** で「〜でいっぱいである」です。「その箱は古いおもちゃでいっぱいだ」という意味になります。be filled with ~ も同じ意味ですが、full は of と結びつきます。`
        }
      ],
      solution: [
        {
          t: '形容詞ごとに決まった前置詞を覚える',
          n: R`good at ~（得意）、interested in ~（興味がある）、afraid of ~（恐れている）、famous for ~（で有名）、full of ~（でいっぱい）のように、形容詞と前置詞はセットで暗記します。意味が分からなくても、組み合わせを知っていれば答えられます。`,
          easy: R`形容詞と前置詞は**くっついた 1 つの単語**だと思って覚えましょう。「good at」「interested in」「afraid of」と、声に出して 3 回言うと耳に残ります。前置詞だけ別の単語に変えると、英語としておかしく聞こえます。`
        },
        {
          t: 'for と as の違い（famous）',
          n: R`be famous for ~ は有名な理由（古いお寺・おいしい料理など）が、be famous as ~ は「〜として」有名な立場（作家・観光地など）が続きます。後ろに来る名詞が「理由」か「立場」かで使い分けます。`,
          easy: R`「famous for」の for は「〜の理由で」、「famous as」の as は「〜として」と覚えます。「京都は古いお寺 **で** 有名」なら for、「彼は作家 **として** 有名」なら as です。`,
          pro: R`be afraid of ~ のあとに動詞を置くときは afraid of doing とします。be afraid to do は「怖くて〜できない」と、意味が少し変わる点も入試では狙われます。`
        }
      ],
      tags: ['熟語', '形容詞句', '前置詞']
    },

    {
      id: 'd-e-idiom-04',
      subject: 'english',
      level: 'drill',
      unit: 'e-idiom',
      title: '熟語：群前置詞・副詞句',
      source: SRC(),
      time: 3,
      body: R`2 語以上で 1 つの前置詞や副詞の働きをする熟語を確認します。空所に入る最も適切なものを選びなさい。`,
      fig: null,
      parts: [
        {
          label: '(1)',
          q: R`(    ) of the heavy snow, the train was late.`,
          type: 'choice',
          choices: ['Instead', 'In front', 'At least', 'Because'],
          answer: 3,
          explain: R`**because of ~** で「〜のために」です。「大雪のために電車が遅れた」という意味になります。instead of は「〜の代わりに」、in front of は「〜の前に」で、意味が合いません。at least は of を続けられません。`
        },
        {
          label: '(2)',
          q: R`I will call you (    ) soon as I get home.`,
          type: 'choice',
          choices: ['so', 'as', 'how', 'too'],
          answer: 1,
          explain: R`**as soon as ~** で「〜するとすぐに」です。「家に着いたらすぐに電話します」という意味になります。as soon as の後ろは文（主語 + 動詞）が続き、時を表す節の中なので未来のことでも現在形（get）を使います。`
        },
        {
          label: '(3)',
          q: R`I had tea (    ) of coffee this morning.`,
          type: 'choice',
          choices: ['instead', 'because', 'front', 'spite'],
          answer: 0,
          explain: R`**instead of ~** で「〜の代わりに」です。「今朝はコーヒーの代わりに紅茶を飲んだ」となります。because of は「〜のために」、in front of は「〜の前に」、in spite of は「〜にもかかわらず」で、前に in が必要です。`
        },
        {
          label: '(4)',
          q: R`It is a long trip. It will take (    ) two days to get there.`,
          type: 'choice',
          choices: ['at last', 'at first', 'at least', 'at once'],
          answer: 2,
          explain: R`**at least** は「少なくとも」です。「少なくとも 2 日はかかる」という意味になります。at last は「ついに」、at first は「最初は」、at once は「すぐに」で、two days の前に置いても意味が通りません。`
        },
        {
          label: '(5)',
          q: R`(    ) the way, what time is it now?`,
          type: 'choice',
          choices: ['In', 'By', 'On', 'At'],
          answer: 1,
          explain: R`**by the way** は「ところで」と話題を変えるときの熟語です。in the way は「邪魔になって」、on the way は「途中で」です。`
        }
      ],
      solution: [
        {
          t: '2〜3 語で 1 つの前置詞・副詞になる熟語',
          n: R`because of ~（〜のために）、instead of ~（〜の代わりに）、in front of ~（〜の前に）は、最後の of までをセットで 1 つの前置詞と考えます。空所の後ろに of があるかどうかも手がかりになります。`,
          easy: R`「because of」「instead of」は、**2 語で 1 つの言葉**です。日本語の「〜のために」「〜の代わりに」と 1 対 1 で覚えましょう。後ろには名詞（the heavy snow / coffee）が来ます。`
        },
        {
          t: '時や話題を表す副詞句',
          n: R`as soon as ~（〜するとすぐに）、at least（少なくとも）、by the way（ところで）は文頭・文中でよく使います。at last（ついに）、at first（最初は）、at once（すぐに）と混同しないように、日本語の意味で区別します。`,
          easy: R`「at last」は「ついに」、「at least」は「少なくとも」、と 1 つずつ日本語にします。つづりが似ているので、**last = 最後 → ついに**、**least = 最も少ない → 少なくとも** と、もとの意味から覚えるのがおすすめです。`,
          pro: R`as soon as 〜 のように「時を表す副詞節」では、未来のことでも現在形を使うのが決まりです（get home であって will get home ではない）。時制の問題でも頻出です。`
        }
      ],
      tags: ['熟語', '群前置詞', '副詞句']
    },

    /* ---------- e-grammar0（中学英文法）---------- */
    {
      id: 'd-e-grammar0-01',
      subject: 'english',
      level: 'drill',
      unit: 'e-grammar0',
      title: '中学文法：be動詞・一般動詞',
      source: SRC(),
      time: 3,
      body: R`be 動詞と一般動詞、疑問文・否定文の基本を確認します。空所に入る最も適切なものを選びなさい。`,
      fig: null,
      parts: [
        {
          label: '(1)',
          q: R`I (    ) a high school student.`,
          type: 'choice',
          choices: ['am', 'is', 'are', 'be'],
          answer: 0,
          explain: R`主語が **I** のとき、be 動詞は **am** を使います（I am ~）。is は he / she / it など 3 人称単数、are は you や複数の主語に使います。`
        },
        {
          label: '(2)',
          q: R`My father (    ) to work by train every day.`,
          type: 'choice',
          choices: ['go', 'goes', 'going', 'gone'],
          answer: 1,
          explain: R`主語 My father は **3 人称単数**で、現在の習慣を表す文なので、動詞の語尾に -s / -es をつけます。go は **goes** になります。going は進行形や不定詞の中で、gone は完了形で使う形です。`
        },
        {
          label: '(3)',
          q: R`(    ) your sister like music?`,
          type: 'choice',
          choices: ['Is', 'Do', 'Are', 'Does'],
          answer: 3,
          explain: R`一般動詞 like の疑問文は、主語に合わせて Do / Does を文頭に置きます。your sister は 3 人称単数なので **Does** で、動詞は原形（like）のままです。Is や Are は be 動詞の疑問文で使います。`
        },
        {
          label: '(4)',
          q: R`My brother (    ) play baseball. He likes soccer.`,
          type: 'choice',
          choices: ["don't", "isn't", "doesn't", "aren't"],
          answer: 2,
          explain: R`一般動詞 play の否定文は、do not / does not + 動詞の原形です。主語 My brother は 3 人称単数なので **doesn't** を使います。isn't や aren't は be 動詞の否定です。`
        },
        {
          label: '(5)',
          q: R`There (    ) two cats under the table.`,
          type: 'choice',
          choices: ['is', 'has', 'have', 'are'],
          answer: 3,
          explain: R`**There is / are ~** は「〜がある; いる」という文で、後ろの名詞に合わせて be 動詞を選びます。two cats は複数なので **are** です。has / have は「〜を持っている」という意味で、ここでは使えません。`
        }
      ],
      solution: [
        {
          t: '主語を見て be 動詞・一般動詞を選ぶ',
          n: R`I → am、you・複数 → are、he / she / it など 3 人称単数 → is です。一般動詞は、3 人称単数・現在なら -s / -es をつけ、疑問文は Do / Does、否定文は don't / doesn't を使います。`,
          easy: R`まず「だれの話か（主語）」を見ます。**I なら am、あなた・たくさんなら are、1 人の第三者なら is** です。一般動詞（go, like など）の文では、1 人の第三者のとき動詞に s がつきます（goes）。`
        },
        {
          t: '疑問文・否定文では動詞が原形に戻る',
          n: R`Does your sister like ~? や My brother doesn't play ~ では、Does / doesn't が 3 人称単数の s の役目をするので、動詞は原形（like / play）に戻ります。likes / plays と書かないように注意します。`,
          easy: R`「s」は 1 つの文に **1 回だけ**つければよい、と考えましょう。Does がもう s の役目をしているので、like には s をつけません。`,
          pro: R`There is / are ~ の be 動詞は、直後の名詞（意味上の主語）に合わせます。There is a pen and two books. のように最初の名詞に合わせる場合もあり、共通テストでも出題されます。`
        }
      ],
      tags: ['中学文法', 'be動詞', '一般動詞', '疑問文', '否定文']
    },

    {
      id: 'd-e-grammar0-02',
      subject: 'english',
      level: 'drill',
      unit: 'e-grammar0',
      title: '中学文法：時制の基本',
      source: SRC(),
      time: 3,
      body: R`現在・過去・未来・進行形の基本を確認します。空所に入る最も適切なものを選びなさい。`,
      fig: null,
      parts: [
        {
          label: '(1)',
          q: R`Yesterday I (    ) to the library with my friends.`,
          type: 'choice',
          choices: ['went', 'go', 'gone', 'going'],
          answer: 0,
          explain: R`**Yesterday（昨日）** があるので過去の文です。go の過去形は **went** です（go - went - gone）。gone は過去分詞で、単独では過去の文に使えません。`
        },
        {
          label: '(2)',
          q: R`Look! It (    ) now.`,
          type: 'choice',
          choices: ['rains', 'rained', 'is raining', 'has rained'],
          answer: 2,
          explain: R`Look! と now から、「今、ちょうど雨が降っている」という進行中の動作です。進行形（be 動詞 + 動詞の -ing 形）の **is raining** が入ります。`
        },
        {
          label: '(3)',
          q: R`I (    ) my grandmother tomorrow.`,
          type: 'choice',
          choices: ['visited', 'will visit', 'have visited', 'visits'],
          answer: 1,
          explain: R`**tomorrow（明日）** があるので未来の文です。未来は will + 動詞の原形で表し、「明日、祖母を訪ねるつもりだ」となります。visited は過去形、visits は主語 I には合わない形です。`
        },
        {
          label: '(4)',
          q: R`What (    ) you doing at eight last night?`,
          type: 'choice',
          choices: ['are', 'was', 'do', 'were'],
          answer: 3,
          explain: R`**at eight last night（昨夜 8 時に）** なので、過去進行形（was / were + -ing）の疑問文です。主語は you なので **were** を使います。was は主語が I や 3 人称単数のときの形です。`
        },
        {
          label: '(5)',
          q: R`He (    ) a new bike last week.`,
          type: 'choice',
          choices: ['buys', 'is buying', 'bought', 'has bought'],
          answer: 2,
          explain: R`**last week（先週）** があるので過去の文です。buy の過去形は **bought** です（buy - bought - bought）。現在完了（has bought）は last week のような過去を表す語句とは一緒に使えません。`
        }
      ],
      solution: [
        {
          t: '時を表す語句に注目する',
          n: R`yesterday / last week → 過去形、tomorrow → will + 原形、now / Look! → 現在進行形、at eight last night → 過去進行形、と時を表す語句から時制を決めます。`,
          easy: R`英語の動詞は「いつの話か」で形が変わります。**yesterday（昨日）や last week（先週）があれば過去形**、tomorrow（明日）があれば will を使います。まず時を表す言葉を探しましょう。`
        },
        {
          t: '不規則動詞の過去形を覚える',
          n: R`go - went - gone、buy - bought - bought のように、不規則に変化する動詞は過去形・過去分詞形を覚えておく必要があります。規則動詞は -ed をつけて作ります。`,
          easy: R`go → went、buy → bought のように、形が大きく変わる動詞が**不規則動詞**です。よく使うものから少しずつ覚えていきます。`,
          pro: R`現在完了（have + 過去分詞）は yesterday / last week / ago のような「過去の一点を表す語句」とは一緒に使えません。時制の判断問題の定番ポイントです。`
        }
      ],
      tags: ['中学文法', '時制', '過去形', '未来', '進行形']
    },

    {
      id: 'd-e-grammar0-03',
      subject: 'english',
      level: 'drill',
      unit: 'e-grammar0',
      title: '中学文法：助動詞・疑問詞',
      source: SRC(),
      time: 3,
      body: R`助動詞と疑問詞の基本を確認します。空所に入る最も適切なものを選びなさい。`,
      fig: null,
      parts: [
        {
          label: '(1)',
          q: R`(    ) you speak English?  —  Yes, I can.`,
          type: 'choice',
          choices: ['Are', 'Do', 'Can', 'Is'],
          answer: 2,
          explain: R`答えが Yes, I **can**. なので、質問も **Can** you ~?（〜できますか）の形です。Do you ~? に対しては Yes, I do. と答えます。Are / Is の後ろには動詞の原形 speak を置けません。`
        },
        {
          label: '(2)',
          q: R`You (    ) run in the library. It is against the rules.`,
          type: 'choice',
          choices: ['must not', "don't have to", 'should', 'will'],
          answer: 0,
          explain: R`「規則に反する」ので、禁止を表す **must not**（〜してはいけない）が入ります。don't have to は「〜する必要はない」で、禁止ではありません。should や will では「規則に反する」という説明と合いません。`
        },
        {
          label: '(3)',
          q: R`(    ) is your birthday?  —  It is May 5th.`,
          type: 'choice',
          choices: ['What', 'When', 'Where', 'Who'],
          answer: 1,
          explain: R`答えが「5 月 5 日です」と日付なので、「いつ」をたずねる **When** が入ります。What は「何」、Where は「どこ」、Who は「だれ」です。`
        },
        {
          label: '(4)',
          q: R`(    ) do you go to school?  —  By bus.`,
          type: 'choice',
          choices: ['What', 'Where', 'Why', 'How'],
          answer: 3,
          explain: R`答えが By bus.（バスで）なので、手段をたずねる **How** が入ります。How do you go to school? で「どうやって学校に行きますか」です。Where なら場所、Why なら理由を答えます。`
        },
        {
          label: '(5)',
          q: R`Would you like (    ) cookies?`,
          type: 'choice',
          choices: ['much', 'a', 'some', 'an'],
          answer: 2,
          explain: R`食べ物や飲み物を勧める文では、**some**（いくらかの）を使って Would you like some cookies? と言います。cookies は数えられる名詞の複数形なので、a や an（1 つの）は使えません。much（多量の）は数えられない名詞に使う語です。`
        }
      ],
      solution: [
        {
          t: '答えの形から疑問文を決める',
          n: R`Yes, I can. → Can ~?、It is May 5th. → When ~?、By bus. → How ~? のように、返事の言葉が疑問文を決める手がかりになります。疑問詞は、答えが「時 → When」「場所 → Where」「手段 → How」「理由 → Why」と対応します。`,
          easy: R`会話では、**返事から質問を考える**と答えが選びやすくなります。「5 月 5 日です」と答えるなら、質問は「いつ？」（When）です。`
        },
        {
          t: '助動詞のニュアンスを区別する',
          n: R`must not は「〜してはいけない」（禁止）、don't have to は「〜する必要はない」（不必要）です。同じ must / have to の否定でも意味が大きく違います。Would you like some ~? は、人に物を勧める決まった言い方です。`,
          easy: R`「must not」は赤信号の「止まれ！」のように**ダメ**を表し、「don't have to」は「しなくても**いいよ**」を表します。まったく反対のような意味なので、まちがえないようにしましょう。`,
          pro: R`疑問文では some ではなく any を使うのが原則ですが、「相手に勧める・頼む」文（Would you like some ~? / Can I have some ~?）では some を使います。英作文でも使える細かなルールです。`
        }
      ],
      tags: ['中学文法', '助動詞', '疑問詞']
    },

    {
      id: 'd-e-grammar0-04',
      subject: 'english',
      level: 'drill',
      unit: 'e-grammar0',
      title: '中学文法：比較・受動態',
      source: SRC(),
      time: 3,
      body: R`比較の文と受動態（〜される）の基本を確認します。空所に入る最も適切なものを選びなさい。`,
      fig: null,
      parts: [
        {
          label: '(1)',
          q: R`Tom is (    ) than Ken.`,
          type: 'choice',
          choices: ['tall', 'tallest', 'more tall', 'taller'],
          answer: 3,
          explain: R`後ろに than があるので比較級です。tall のような短い形容詞は語尾に -er をつけて **taller**（より背が高い）とします。more tall のように more をつけるのは、interesting など長い語の場合です。`
        },
        {
          label: '(2)',
          q: R`This is the (    ) building in our town.`,
          type: 'choice',
          choices: ['high', 'higher', 'highest', 'most high'],
          answer: 2,
          explain: R`the と in our town（町の中で）があるので、最上級の文です。high の最上級は **highest**（the highest = 最も高い）です。most high とは言いません。`
        },
        {
          label: '(3)',
          q: R`This book is (    ) interesting than that one.`,
          type: 'choice',
          choices: ['very', 'more', 'most', 'much'],
          answer: 1,
          explain: R`interesting のように長い形容詞の比較級は、**more + 原級** で作ります。「この本はあの本よりおもしろい」です。than があるので very や most は使えず、much interesting とも言いません。`
        },
        {
          label: '(4)',
          q: R`English (    ) in many countries.`,
          type: 'choice',
          choices: ['is spoken', 'speaks', 'is speaking', 'spoken'],
          answer: 0,
          explain: R`English は「話される」側なので受動態（be 動詞 + 過去分詞）にします。「英語は多くの国で話されている」は English **is spoken** in many countries. です。speaks は「話す」という能動の形です。`
        },
        {
          label: '(5)',
          q: R`This picture was (    ) by my brother.`,
          type: 'choice',
          choices: ['paint', 'paints', 'painted', 'painting'],
          answer: 2,
          explain: R`was と by my brother（兄によって）から、受動態「この絵は兄によって描かれた」です。受動態は be 動詞 + 過去分詞で、paint の過去分詞は **painted** です。`
        }
      ],
      solution: [
        {
          t: '比較級・最上級の作り方',
          n: R`短い形容詞は -er / -est（tall - taller - tallest、high - higher - highest）、長い形容詞は more / most をつけます（interesting - more interesting - most interesting）。than があれば比較級、the と in ~ / of ~ があれば最上級です。`,
          easy: R`「〜より…」を表すときは than の前の形容詞を**比較級**にします。短い語は語尾に -er、長い語は前に more です。「いちばん…」のときは、the をつけて -est か most です。`
        },
        {
          t: '受動態は「be 動詞 + 過去分詞」',
          n: R`「〜される」の文は be 動詞 + 過去分詞で作ります。is spoken（話される）、was painted（描かれた）のように、時制は be 動詞の形で表します。「〜によって」は by で示します。`,
          easy: R`受動態は「ものごとが**〜される側**」を主語にした文です。「英語は話される」「絵は描かれた」のように考えます。形は「be 動詞 + 過去分詞（3 番目の形）」と覚えましょう。`,
          pro: R`by 〜 は「だれがしたか」が重要なときだけ書き、一般の人や分かりきった行為者は省略します。This picture was painted. のように by を落とした受動態もよく出ます。`
        }
      ],
      tags: ['中学文法', '比較', '受動態']
    },

    {
      id: 'd-e-grammar0-05',
      subject: 'english',
      level: 'drill',
      unit: 'e-grammar0',
      title: '中学文法：不定詞・動名詞・文型',
      source: SRC(),
      time: 3,
      body: R`to 不定詞・動名詞・文型の基本を確認します。それぞれの問いに答えなさい。`,
      fig: null,
      parts: [
        {
          label: '(1)',
          q: R`空所に入る最も適切なものを選びなさい。

I want (    ) a doctor.`,
          type: 'choice',
          choices: ['be', 'to be', 'being', 'am'],
          answer: 1,
          explain: R`want は後ろに **to 不定詞**（to + 動詞の原形）を置いて「〜したい」を表します。「私は医者になりたい」は I want **to be** a doctor. です。want の後ろに動名詞（being）は置きません。`
        },
        {
          label: '(2)',
          q: R`空所に入る最も適切なものを選びなさい。

She enjoys (    ) pictures.`,
          type: 'choice',
          choices: ['take', 'to take', 'took', 'taking'],
          answer: 3,
          explain: R`enjoy は後ろに **動名詞**（動詞の -ing 形）を置いて「〜して楽しむ」を表します。「彼女は写真をとるのを楽しむ」は She enjoys **taking** pictures. です。enjoy to take とは言いません。`
        },
        {
          label: '(3)',
          q: R`空所に入る最も適切なものを選びなさい。

I have a lot of homework (    ) today.`,
          type: 'choice',
          choices: ['do', 'doing', 'to do', 'done'],
          answer: 2,
          explain: R`名詞 homework を後ろから説明して「今日やるべき宿題」とするときは、**to + 動詞の原形**（形容詞的用法の不定詞）を使います。a lot of homework **to do** で「やるべきたくさんの宿題」です。`
        },
        {
          label: '(4)',
          q: R`次の英文の文型として正しいものを選びなさい。

My mother gave me a nice present.`,
          type: 'choice',
          choices: ['SVC', 'SVOO', 'SVO', 'SVOC'],
          answer: 1,
          explain: R`My mother（S）+ gave（V）+ me（O）+ a nice present（O）の形で、**SVOO（第 4 文型）**です。「〜に…を与える」を表す give 型の動詞は、人と物の 2 つの目的語をとります。`
        },
        {
          label: '(5)',
          q: R`空所に入る最も適切なものを選びなさい。

This soup (    ) delicious.`,
          type: 'choice',
          choices: ['tastes', 'tastes like', 'is tasting', 'tastes of'],
          answer: 0,
          explain: R`taste は「〜の味がする」という意味の SVC（第 2 文型）の動詞で、後ろに形容詞を置きます。This soup **tastes** delicious.（このスープはおいしい味がする）となります。like や of を入れると名詞を続けることになり、形容詞 delicious の前には置けません。`
        }
      ],
      solution: [
        {
          t: '不定詞と動名詞は動詞によって使い分ける',
          n: R`want は to 不定詞（want to ~）、enjoy は動名詞（enjoy -ing）をとります。名詞を後ろから説明する to 不定詞（something to drink / homework to do）もあります。動詞とセットで形を覚えましょう。`,
          easy: R`「〜したい」は want **to** ~、「〜して楽しむ」は enjoy ~**ing** と、動詞ごとに続く形が決まっています。**want は to、enjoy は ing** と、ペアで暗記します。`
        },
        {
          t: '文型は動詞の後ろの形で決まる',
          n: R`SVC は「主語 = 補語」（This soup tastes delicious.）、SVOO は「人に物を〜する」（My mother gave me a present.）です。give / show / tell / buy などは SVOO をとる代表的な動詞です。`,
          easy: R`動詞のあとに **名詞が 2 つ**並んだら SVOO（「〜に…をあげる」）、**形容詞が続いたら** SVC（「〜の状態だ」）と考えましょう。S は主語、V は動詞、O は目的語、C は補語の略です。`,
          pro: R`give 型の SVOO は、前置詞を使った SVO（gave a nice present to me）に書き換えられます。to を使う動詞（give / show / tell）と for を使う動詞（buy / make / cook）の区別が、書き換え問題でよく問われます。`
        }
      ],
      tags: ['中学文法', '不定詞', '動名詞', '文型']
    },

    /* ---------- e-grammar（文法・語法）---------- */
    {
      id: 'd-e-grammar-01',
      subject: 'english',
      level: 'drill',
      unit: 'e-grammar',
      title: '文法：時制と完了形',
      source: SRC(),
      time: 3,
      body: R`現在完了形・過去完了形と時を表す語句を確認します。空所に入る最も適切なものを選びなさい。`,
      fig: null,
      parts: [
        {
          label: '(1)',
          q: R`I have lived in Kyoto (    ) five years.`,
          type: 'choice',
          choices: ['for', 'since', 'during', 'from'],
          answer: 0,
          explain: R`「5 年間」のように**期間の長さ**を表すときは **for** を使います（for five years）。since は「〜以来」で、起点（since 2015 / since last year）が続きます。`
        },
        {
          label: '(2)',
          q: R`She has been sick in bed (    ) last Sunday.`,
          type: 'choice',
          choices: ['for', 'from', 'during', 'since'],
          answer: 3,
          explain: R`last Sunday は**起点となる時**なので、「〜以来」を表す **since** を使います。「先週の日曜日からずっと病気で寝ている」という意味です。for の後ろには期間の長さ（for three days など）が続きます。`
        },
        {
          label: '(3)',
          q: R`I have (    ) to Hokkaido three times.`,
          type: 'choice',
          choices: ['gone', 'been', 'went', 'go'],
          answer: 1,
          explain: R`three times（3 回）とあるので経験を表す現在完了です。**have been to ~** は「〜に行ったことがある」です。have gone to ~ は「〜に行ってしまった（今ここにはいない）」という意味で、経験には使いません。went は過去形で have の後ろには置けません。`
        },
        {
          label: '(4)',
          q: R`When (    ) you buy this bag?`,
          type: 'choice',
          choices: ['did', 'have', 'do', 'were'],
          answer: 0,
          explain: R`**When（いつ）** で過去の一時点をたずねる文では、現在完了は使えず、過去形を使います。疑問文では did + 主語 + 動詞の原形（buy）の形になります。`
        },
        {
          label: '(5)',
          q: R`By the time we arrived, the movie (    ) already started.`,
          type: 'choice',
          choices: ['has', 'was', 'had', 'will'],
          answer: 2,
          explain: R`「私たちが着いた時点（過去）よりも前に映画が始まっていた」ので、**過去完了（had + 過去分詞）**を使います。「過去のある時点までに完了していたこと」を表す形です。`
        }
      ],
      solution: [
        {
          t: 'for と since の使い分け',
          n: R`期間の長さを表すなら for（for five years）、起点の時を表すなら since（since last Sunday）です。どちらも現在完了（have + 過去分詞）と一緒に使います。空所の後ろが「5 年」のような長さか、「去年・日曜日」のような時点かで決めます。`,
          easy: R`「ずっと〜している」と言うとき、**どれだけの長さか**を言うなら for、**いつから**かを言うなら since です。for は「〜の間」、since は「〜から」と覚えましょう。`
        },
        {
          t: '完了形が使えない場合に注意する',
          n: R`When ~?（いつ〜）や yesterday / last week のような過去を表す語句がある文は、現在完了にできず、過去形にします。一方、過去のある時点よりも前のことは過去完了（had + 過去分詞）で表します。`,
          easy: R`現在完了は「**今とつながっている**話」に使います。「いつ？」と過去の一点をたずねる When の文は、今とつながっていないので、過去形（did）を使います。`,
          pro: R`have been to（行ったことがある）と have gone to（行ってしまった）の区別は、共通テストでも頻出です。「3 人称主語 + have gone to」は「今ここにいない」という意味になる点まで押さえましょう。`
        }
      ],
      tags: ['文法', '完了形', '時制', 'for/since']
    },

    {
      id: 'd-e-grammar-02',
      subject: 'english',
      level: 'drill',
      unit: 'e-grammar',
      title: '文法：助動詞と仮定法',
      source: SRC(),
      time: 3,
      body: R`助動詞と仮定法の基本を確認します。空所に入る最も適切なものを選びなさい。`,
      fig: null,
      parts: [
        {
          label: '(1)',
          q: R`He (    ) have said such a thing. He is always kind to everyone.`,
          type: 'choice',
          choices: ['must', "can't", 'should', 'need'],
          answer: 1,
          explain: R`**can't have + 過去分詞** は「〜したはずがない」という、過去についての強い否定の推量です。「いつも親切な彼がそんなことを言ったはずがない」という意味になります。must have + 過去分詞は「〜したにちがいない」で、文意が逆になります。`
        },
        {
          label: '(2)',
          q: R`If I (    ) a bird, I could fly to you.`,
          type: 'choice',
          choices: ['am', 'will be', 'were', 'would be'],
          answer: 2,
          explain: R`現実とは違う「もし〜なら」を表す**仮定法過去**では、if 節の中で過去形を使い、be 動詞は主語にかかわらず **were** にします。主節は could fly（would / could + 動詞の原形）になっています。`
        },
        {
          label: '(3)',
          q: R`I wish I (    ) more time to study.`,
          type: 'choice',
          choices: ['have', 'will have', 'having', 'had'],
          answer: 3,
          explain: R`**I wish + 過去形** は「〜であればいいのに」と、現在の事実と反対の願望を表します。「勉強する時間がもっとあればいいのに」なので had が入ります。have のままでは現実の願いにならず、will have や having は形が合いません。`
        },
        {
          label: '(4)',
          q: R`If it (    ) tomorrow, we will stay home.`,
          type: 'choice',
          choices: ['rains', 'rain', 'rained', 'will rain'],
          answer: 0,
          explain: R`**条件を表す if 節**の中では、未来のことでも現在形を使います。「もし明日雨が降ったら」は If it **rains** tomorrow と書きます。will rain とは書きません。主語 it が 3 人称単数なので s がつきます。`
        },
        {
          label: '(5)',
          q: R`(    ) I open the window?  —  Sure, go ahead.`,
          type: 'choice',
          choices: ['May', 'Must', 'Need', 'Will'],
          answer: 0,
          explain: R`**May I ~?** は「〜してもよろしいですか」と許可を求める丁寧な言い方です。Sure, go ahead.（どうぞ）という返事とも合います。Must I ~? は「〜しなければなりませんか」、Will I ~? は文として不自然です。`
        }
      ],
      solution: [
        {
          t: '仮定法は「現実とのズレ」を表す',
          n: R`If I were a bird, I could fly to you. や I wish I had more time. のように、現在の事実と反対のことを言うときは、動詞を過去形にします（if 節の be 動詞は were）。主節は would / could + 動詞の原形です。`,
          easy: R`「もし〜なら…なのに」と、**今ありえないこと**を想像する文が仮定法です。事実と違うことを言うので、動詞を 1 つ「過去」にずらして表します。「鳥ではない私が鳥だったら」という想像だから、am ではなく were を使います。`
        },
        {
          t: '助動詞 + have + 過去分詞と if 節の時制',
          n: R`can't have done は「〜したはずがない」、must have done は「〜したにちがいない」と、過去のことへの推量を表します。また、時や条件を表す if 節の中では、未来のことでも現在形（If it rains ~）を使います。`,
          easy: R`「**助動詞 + have + 過去分詞**」は、「あのとき〜だったはず」と過去を推測する形です。can't は「〜のはずがない」、must は「〜にちがいない」と、強さが正反対なので注意します。`,
          pro: R`should have done（〜すべきだったのに）と could have done（〜できたのに）も、後悔を表す定番です。過去の推量（must / may / can't have done）とセットで整理しておきましょう。`
        }
      ],
      tags: ['文法', '助動詞', '仮定法', 'if節']
    },

    {
      id: 'd-e-grammar-03',
      subject: 'english',
      level: 'drill',
      unit: 'e-grammar',
      title: '文法：不定詞と動名詞',
      source: SRC(),
      time: 3,
      body: R`不定詞と動名詞の使い分けを確認します。空所に入る最も適切なものを選びなさい。`,
      fig: null,
      parts: [
        {
          label: '(1)',
          q: R`I remember (    ) the door before I left home.`,
          type: 'choice',
          choices: ['lock', 'to lock', 'locked', 'locking'],
          answer: 3,
          explain: R`**remember doing** は「〜したことを覚えている」（過去の記憶）、remember to do は「忘れずに〜する」です。「家を出る前にドアに鍵をかけたことを覚えている」なので動名詞の locking が入ります。`
        },
        {
          label: '(2)',
          q: R`Do not forget (    ) the light when you leave the room.`,
          type: 'choice',
          choices: ['turning off', 'to turn off', 'turn off', 'turned off'],
          answer: 1,
          explain: R`**forget to do** は「〜するのを忘れる」で、Don't forget to do ~ は「忘れずに〜しなさい」という言い方です。これから行うことなので to 不定詞を使います。forget doing は「〜したことを忘れる」という過去の話です。`
        },
        {
          label: '(3)',
          q: R`My teacher told me (    ) harder.`,
          type: 'choice',
          choices: ['to study', 'study', 'studying', 'studied'],
          answer: 0,
          explain: R`**tell + 人 + to do** で「人に〜するように言う」です。「先生は私にもっと一生懸命勉強するように言った」となります。tell の後ろに動詞の原形や -ing 形をそのまま続けることはできません。`
        },
        {
          label: '(4)',
          q: R`I cannot stop (    ). The story is so interesting.`,
          type: 'choice',
          choices: ['read', 'to read', 'reads', 'reading'],
          answer: 3,
          explain: R`**stop doing** は「〜するのをやめる」です。「その話がおもしろくて、読むのをやめられない」となります。stop to do は「〜するために立ち止まる」という別の意味で、ここでは文意に合いません。`
        },
        {
          label: '(5)',
          q: R`It is important for us (    ) our environment.`,
          type: 'choice',
          choices: ['to protect', 'protect', 'protecting', 'protected'],
          answer: 0,
          explain: R`**It is ~ for A to do** で「A が〜するのは…だ」です。It は形式主語で、to protect our environment が本当の主語を表します。「私たちが環境を守ることは大切だ」という意味になります。`
        }
      ],
      solution: [
        {
          t: '動詞によって to do / doing が決まる',
          n: R`enjoy / stop / finish / avoid は動名詞（doing）、want / decide / hope は to 不定詞（to do）をとります。remember / forget / stop は、doing と to do で意味が変わる点に注意します。`,
          easy: R`「**もう終わったこと**には -ing、**これからすること**には to」と覚えましょう。remember doing は「（すでに）〜したことを覚えている」、remember to do は「（これから）忘れずに〜する」です。`
        },
        {
          t: '「It is ~ for A to do」と「tell + 人 + to do」の型',
          n: R`形式主語 It を使った It is important for us to protect ~ や、tell / ask / want + 人 + to do の型は、整序問題や書き換え問題でも頻出です。まとめて 1 つの型として覚えておきます。`,
          easy: R`「It is 形容詞 for 人 to do」は、「人が〜するのは…だ」という決まった文型です。**to のあとは動詞の原形**になることを忘れないようにしましょう。`,
          pro: R`want / tell / ask / allow / advise などは「動詞 + 人 + to do」の型をとります。一方、make / let / have は「動詞 + 人 + 原形」で to がつきません（使役動詞）。この対比は頻出です。`
        }
      ],
      tags: ['文法', '不定詞', '動名詞']
    },

    {
      id: 'd-e-grammar-04',
      subject: 'english',
      level: 'drill',
      unit: 'e-grammar',
      title: '文法：分詞と受動態',
      source: SRC(),
      time: 3,
      body: R`現在分詞・過去分詞と受動態を確認します。空所に入る最も適切なものを選びなさい。`,
      fig: null,
      parts: [
        {
          label: '(1)',
          q: R`The movie was so (    ) that I could not stop laughing.`,
          type: 'choice',
          choices: ['amused', 'amusing', 'amuse', 'amuses'],
          answer: 1,
          explain: R`主語 The movie は「人を楽しませる側」なので現在分詞の **amusing**（おもしろい）が入ります。amused は「楽しんでいる」という人の気持ちを表す形で、人が主語のときに使います。`
        },
        {
          label: '(2)',
          q: R`I was (    ) at the news.`,
          type: 'choice',
          choices: ['surprising', 'surprise', 'surprised', 'surprises'],
          answer: 2,
          explain: R`主語 I は「驚かされた側」なので、過去分詞の **surprised**（驚いた）を使います。**be surprised at ~** で「〜に驚く」です。surprising は「（物事が）驚くべき」という意味です。`
        },
        {
          label: '(3)',
          q: R`The girl (    ) with Tom is my sister.`,
          type: 'choice',
          choices: ['talks', 'talked', 'to talk', 'talking'],
          answer: 3,
          explain: R`名詞 The girl を後ろから説明する分詞です。「トムと話している女の子」は、女の子が「話している」側なので**現在分詞** talking を使います。The girl who is talking with Tom の who is が省略された形と考えられます。`
        },
        {
          label: '(4)',
          q: R`English is a language (    ) all over the world.`,
          type: 'choice',
          choices: ['spoken', 'speaking', 'speak', 'to speak'],
          answer: 0,
          explain: R`a language を後ろから説明します。言語は「話される」側なので、**過去分詞** spoken を使います。a language (which is) spoken all over the world の省略と考えます。`
        },
        {
          label: '(5)',
          q: R`The old man was (    ) care of by his daughter.`,
          type: 'choice',
          choices: ['took', 'taken', 'taking', 'take'],
          answer: 1,
          explain: R`take care of ~（〜の世話をする）を受動態にした **be taken care of by ~** の形です。was の後ろなので過去分詞 taken が入ります。「その老人は娘に世話をされていた」という意味です。`
        }
      ],
      solution: [
        {
          t: '現在分詞か過去分詞かは「する側 / される側」で決める',
          n: R`修飾される名詞が「〜している」なら現在分詞（-ing）、「〜される・〜された」なら過去分詞（-ed など）を使います。感情を表す動詞（surprise / amuse / excite など）は、主語が人なら過去分詞、物事なら現在分詞です。`,
          easy: R`**「〜している」なら -ing、「〜される」なら -ed**（3 番目の形）と、まず覚えましょう。「おもしろい映画」は映画が人を楽しませるので amusing、「楽しんでいる私」は楽しませられる側なので amused です。`
        },
        {
          t: '群動詞の受動態',
          n: R`take care of ~ や look after ~ のような熟語は、全体を 1 つの動詞のように扱い、be taken care of by ~（〜に世話をされる）の形で受動態にします。of や after などの前置詞を落とさないように注意します。`,
          easy: R`「take care of」のかたまりは、受動態でも**バラバラにしません**。「was taken care of by his daughter」と、of まで残します。`,
          pro: R`be laughed at（笑われる）、be looked up to（尊敬される）、be spoken to（話しかけられる）なども同様の受動態です。前置詞を落とす誤りが、整序問題や誤文訂正でよく狙われます。`
        }
      ],
      tags: ['文法', '分詞', '受動態']
    },

    {
      id: 'd-e-grammar-05',
      subject: 'english',
      level: 'drill',
      unit: 'e-grammar',
      title: '文法：関係詞と比較',
      source: SRC(),
      time: 3,
      body: R`関係代名詞と比較表現を確認します。空所に入る最も適切なものを選びなさい。`,
      fig: null,
      parts: [
        {
          label: '(1)',
          q: R`The woman (    ) lives next door is a nurse.`,
          type: 'choice',
          choices: ['who', 'whom', 'which', 'whose'],
          answer: 0,
          explain: R`先行詞 The woman は人で、関係詞のあとに動詞 lives が続くので、関係詞は主語の働きをします。主格の関係代名詞 **who** が入ります。whom は目的格、which は人以外、whose は所有格です。`
        },
        {
          label: '(2)',
          q: R`This is the book (    ) I bought yesterday.`,
          type: 'choice',
          choices: ['who', 'whose', 'what', 'which'],
          answer: 3,
          explain: R`先行詞 the book は物で、関係詞のあとに I bought という文が続きます（bought の目的語が欠けている）。物を先行詞とする目的格の **which** が入ります（that でも可）。what は先行詞を含む関係代名詞で、the book の後ろには置けません。`
        },
        {
          label: '(3)',
          q: R`I have a friend (    ) father is a pilot.`,
          type: 'choice',
          choices: ['who', 'whom', 'whose', 'which'],
          answer: 2,
          explain: R`関係詞のあとに名詞 father が続き、「その友達の」父という所有の関係なので、所有格の **whose** が入ります。「お父さんがパイロットである友達がいる」という意味になります。`
        },
        {
          label: '(4)',
          q: R`My bag is twice as (    ) as yours.`,
          type: 'choice',
          choices: ['heavier', 'more heavy', 'heaviest', 'heavy'],
          answer: 3,
          explain: R`**twice as ~ as ...** は「…の 2 倍の〜」という倍数表現で、as と as の間には**原級**を置きます。したがって heavy が入ります。as ... as の間に比較級（heavier）や最上級を置くことはできません。`
        },
        {
          label: '(5)',
          q: R`The (    ) you practice, the better you will play.`,
          type: 'choice',
          choices: ['most', 'more', 'much', 'many'],
          answer: 1,
          explain: R`**The 比較級 ~, the 比較級 ...** は「〜すればするほど…」を表します。practice は動詞なので、「たくさん」の比較級 **more** が入ります（The more you practice, the better you will play.）。`
        }
      ],
      solution: [
        {
          t: '関係代名詞は「先行詞」と「後ろの形」で選ぶ',
          n: R`先行詞が人なら who（主格）/ whom（目的格）、物なら which、どちらも後ろに名詞が続く所有の関係なら whose です。後ろに動詞が続けば主格、「主語 + 動詞」が続けば目的格です。`,
          easy: R`関係代名詞は、**前の名詞（先行詞）の説明を始める言葉**です。「だれのこと？（人か物か）」と「そのあとに何が続くか」を見れば選べます。人なら who、物なら which、「〜の」なら whose、と覚えましょう。`
        },
        {
          t: '倍数表現と「the 比較級, the 比較級」',
          n: R`twice as ~ as ... では、as と as の間は必ず原級（heavy）です。The more you practice, the better you will play. のように、前後に「the + 比較級」を並べると「〜すればするほど…」の意味になります。`,
          easy: R`「2 倍」「3 倍」は、**倍数 + as + 原級 + as** で表します。はさまれた形容詞は、変形させずにそのまま書きます。`,
          pro: R`as ... as の倍数表現は、twice / three times / half などを as の前に置きます。「…の 2 倍の重さ」を比較級を使って twice heavier と書く誤りは、入試で頻出の引っかけです。`
        }
      ],
      tags: ['文法', '関係代名詞', '比較']
    },

    /* ---------- e-struct（構文・語句整序）---------- */
    {
      id: 'd-e-struct-01',
      subject: 'english',
      level: 'drill',
      unit: 'e-struct',
      title: '整序：基本の語順',
      source: SRC(),
      time: 4,
      body: R`日本語の意味に合うように、語を並べかえて英文を完成させなさい。（語は句読点なしで、文頭の語も小文字で示してあります。）`,
      fig: null,
      parts: [
        {
          label: '(1)',
          q: R`私の弟はとても速く走ることができます。`,
          type: 'order',
          words: ['run', 'very', 'my', 'can', 'fast', 'brother'],
          answer: 'My brother can run very fast.',
          explain: R`主語 My brother の後ろに、助動詞 can + 動詞の原形 run を置きます。副詞 very fast（とても速く）は動詞の後ろに続けます。`
        },
        {
          label: '(2)',
          q: R`あなたはそのかばんをどこで買いましたか。`,
          type: 'order',
          words: ['you', 'buy', 'did', 'that', 'where', 'bag'],
          answer: 'Where did you buy that bag?',
          explain: R`疑問詞 Where を文頭に置き、そのあとは疑問文の語順（did + 主語 + 動詞の原形）にします。did があるので buy は原形のままです。`
        },
        {
          label: '(3)',
          q: R`私はこの機械の使い方を知りません。`,
          type: 'order',
          words: ['machine', 'use', 'this', 'to', "don't", 'know', 'how', 'I'],
          answer: "I don't know how to use this machine.",
          explain: R`**how to + 動詞の原形**で「〜のしかた; 〜する方法」を表し、know の目的語になります。I don't know の後ろに how to use this machine を続けます。`
        },
        {
          label: '(4)',
          q: R`机の上にペンが 3 本あります。`,
          type: 'order',
          words: ['desk', 'pens', 'are', 'three', 'there', 'on', 'the'],
          answer: 'There are three pens on the desk.',
          explain: R`**There are ~** は「〜がある」を表す文で、be 動詞の後ろに主語（three pens）、場所を表す語句（on the desk）の順に並べます。pens が複数なので be 動詞は are です。`
        }
      ],
      solution: [
        {
          t: '主語と動詞を最初に決める',
          n: R`整序問題は、まず日本語の意味から「主語 + 動詞」を決めます。そのあとに目的語・修飾語を、決まった型（can + 原形、疑問詞 + 疑問文の語順、how to + 原形、There are ~）にあてはめて並べます。`,
          easy: R`単語をバラバラに並べようとせず、まず**主役（だれが・何が）と動作**を決めましょう。(1) なら「My brother」が主役で、動作は「can run」です。そこから、残りの語をくっつけていきます。`
        },
        {
          t: 'よく使う型を覚える',
          n: R`疑問詞 + did + 主語 + 動詞の原形、how to + 動詞の原形、There + be 動詞 + 名詞 + 場所、はどれも整序問題の定番です。型として覚えておくと、短時間で正確に並べられます。`,
          easy: R`英語には、よく使う**文の型**があります。「Where did you ~?」「how to ~」「There are ~」を、まるごと暗記しておくと、並べかえのときに役立ちます。`,
          pro: R`整序問題では、最後に完成した文を日本語に直して、元の日本語と意味が合うか確かめましょう。助動詞の後ろの原形や、複数形の名詞に合う be 動詞の形を見直すと、ケアレスミスが減ります。`
        }
      ],
      tags: ['整序', '基本文型', '疑問文', 'how to']
    },

    {
      id: 'd-e-struct-02',
      subject: 'english',
      level: 'drill',
      unit: 'e-struct',
      title: '整序：不定詞・動名詞',
      source: SRC(),
      time: 4,
      body: R`日本語の意味に合うように、語を並べかえて英文を完成させなさい。（語は句読点なしで、文頭の語も小文字で示してあります。）`,
      fig: null,
      parts: [
        {
          label: '(1)',
          q: R`私はあなたに宿題を手伝ってほしい。`,
          type: 'order',
          words: ['help', 'you', 'to', 'want', 'I', 'me', 'with', 'my', 'homework'],
          answer: 'I want you to help me with my homework.',
          explain: R`**want + 人 + to do** で「人に〜してほしい」です。want の後ろに you to help を置き、help A with B（A の B を手伝う）の形で me with my homework を続けます。`
        },
        {
          label: '(2)',
          q: R`十分な睡眠をとることは大切です。`,
          type: 'order',
          words: ['sleep', 'get', 'to', 'is', 'enough', 'important', 'it'],
          answer: 'It is important to get enough sleep.',
          explain: R`形式主語 **It is ~ to do** の文です。It is important（大切だ）の後ろに、本当の主語にあたる to get enough sleep（十分な睡眠をとること）を置きます。`
        },
        {
          label: '(3)',
          q: R`彼女は疲れすぎていて、夕食を作ることができなかった。`,
          type: 'order',
          words: ['to', 'dinner', 'tired', 'was', 'cook', 'she', 'too'],
          answer: 'She was too tired to cook dinner.',
          explain: R`**too ~ to do** は「あまりに〜なので…できない」です。was too tired（疲れすぎていた）の後ろに to cook dinner（夕食を作ること）を続けます。`
        },
        {
          label: '(4)',
          q: R`私の趣味は古い硬貨を集めることです。`,
          type: 'order',
          words: ['hobby', 'old', 'is', 'collecting', 'my', 'coins'],
          answer: 'My hobby is collecting old coins.',
          explain: R`「〜すること」を表す動名詞（collecting）が補語になる文です。My hobby is（私の趣味は〜です）の後ろに collecting old coins を置きます。形容詞 old は名詞 coins の前につけます。`
        }
      ],
      solution: [
        {
          t: '不定詞を使う型を見抜く',
          n: R`want + 人 + to do（人に〜してほしい）、It is 形容詞 to do（〜するのは…だ）、too ~ to do（〜すぎて…できない）は、整序問題で非常によく出る型です。to の後ろには動詞の原形が来ます。`,
          easy: R`文のなかに **to** があったら、「to + 動詞」のかたまりを先に作っておきます。(3) なら「to cook」、(2) なら「to get」です。かたまりを作ってから、前の語につなげていくと迷いません。`
        },
        {
          t: '動名詞は「〜すること」',
          n: R`動詞の -ing 形（動名詞）は名詞の働きをして、補語（My hobby is collecting ~）や主語（Collecting coins is ~）になります。-ing の後ろには目的語を続けます。`,
          easy: R`「〜すること」という日本語が出てきたら、**-ing** か **to + 動詞** が使えないかを考えましょう。「趣味は集めること」→ My hobby is collecting ~ です。`,
          pro: R`It is important to ~ は、文頭の主語を動名詞にして Getting enough sleep is important. と書き換えられます。ただし「for + 人」を入れた形（It is important for us to ~）は to 不定詞にしか使えない点に注意します。`
        }
      ],
      tags: ['整序', '不定詞', '動名詞', '形式主語']
    },

    {
      id: 'd-e-struct-03',
      subject: 'english',
      level: 'drill',
      unit: 'e-struct',
      title: '整序：比較・受動態',
      source: SRC(),
      time: 4,
      body: R`日本語の意味に合うように、語を並べかえて英文を完成させなさい。（語は句読点なしで、文頭の語も小文字で示してあります。固有名詞の頭文字は大文字のままです。）`,
      fig: null,
      parts: [
        {
          label: '(1)',
          q: R`この本はあの本よりおもしろい。`,
          type: 'order',
          words: ['interesting', 'than', 'is', 'more', 'book', 'that', 'one', 'this'],
          answer: 'This book is more interesting than that one.',
          explain: R`比較級 **more interesting than ~** で「〜よりおもしろい」です。that one の one は、前に出た book のくり返しを避ける代名詞です。`
        },
        {
          label: '(2)',
          q: R`富士山は日本でいちばん高い山です。`,
          type: 'order',
          words: ['mountain', 'Fuji', 'is', 'highest', 'in', 'Mount', 'Japan', 'the'],
          answer: 'Mount Fuji is the highest mountain in Japan.',
          explain: R`最上級 **the + 最上級 + 名詞 + in + 範囲** の形です。Mount Fuji is の後ろに the highest mountain を置き、範囲を表す in Japan で終わります。`
        },
        {
          label: '(3)',
          q: R`このお寺は約 400 年前に建てられました。`,
          type: 'order',
          words: ['about', 'ago', 'built', 'temple', 'years', 'was', 'four', 'this', 'hundred'],
          answer: 'This temple was built about four hundred years ago.',
          explain: R`受動態 **was built**（建てられた）の文です。「約 400 年前に」は about four hundred years ago で、about + 数 + years ago の順に並べます。hundred に s はつきません。`
        },
        {
          label: '(4)',
          q: R`英語は多くの国で話されています。`,
          type: 'order',
          words: ['spoken', 'English', 'is', 'in', 'countries', 'many'],
          answer: 'English is spoken in many countries.',
          explain: R`受動態 **is spoken**（話されている）の文です。場所を表す in many countries（多くの国で）を最後に置きます。many の後ろの名詞は複数形 countries です。`
        }
      ],
      solution: [
        {
          t: '比較・最上級の型',
          n: R`比較は「比較級 + than ~」、最上級は「the + 最上級 + 名詞 + in / of ~」の型です。長い形容詞（interesting）は more を前につけて比較級にします。`,
          easy: R`「〜より…」は **than** を探します。than の前に比較級（more interesting）、後ろに比べる相手（that one）を置きます。「いちばん…」は **the + 最上級（highest）** で、「どの範囲で」を in で表します。`
        },
        {
          t: '受動態は「be 動詞 + 過去分詞」を先に作る',
          n: R`受動態の文は、まず was built / is spoken のように「be 動詞 + 過去分詞」のかたまりを作ります。そのあとに、場所（in many countries）や時（about four hundred years ago）を表す語句を置きます。`,
          easy: R`「〜される」の文は、**be 動詞 + 過去分詞（3 番目の形）**のかたまりを先に作りましょう。(3) なら「was built」、(4) なら「is spoken」です。そのあとに、時や場所の言葉を並べます。`,
          pro: R`「約 400 年前」のように数値を表す部分は、about / more than / nearly などの位置も含めて 1 つの意味のかたまりとして扱います。語数の多い整序問題では、このかたまり作りが効きます。`
        }
      ],
      tags: ['整序', '比較', '最上級', '受動態']
    },

    {
      id: 'd-e-struct-04',
      subject: 'english',
      level: 'drill',
      unit: 'e-struct',
      title: '整序：関係詞・間接疑問',
      source: SRC(),
      time: 5,
      body: R`日本語の意味に合うように、語を並べかえて英文を完成させなさい。（語は句読点なしで、文頭の語も小文字で示してあります。）`,
      fig: null,
      parts: [
        {
          label: '(1)',
          q: R`ピアノをひいている少年は私のいとこです。`,
          type: 'order',
          words: ['playing', 'who', 'boy', 'is', 'the', 'piano', 'is', 'my', 'the', 'cousin'],
          answer: 'The boy who is playing the piano is my cousin.',
          explain: R`主格の関係代名詞 **who** が、先行詞 The boy を説明します。who is playing the piano（ピアノをひいている）が The boy を修飾し、全体の述語が is my cousin です。`
        },
        {
          label: '(2)',
          q: R`私は彼が何を食べたいのか知りません。`,
          type: 'order',
          words: ['know', "don't", 'I', 'what', 'he', 'to', 'wants', 'eat'],
          answer: "I don't know what he wants to eat.",
          explain: R`know の目的語になる**間接疑問**は「疑問詞 + 主語 + 動詞」の語順になります。what he wants to eat（彼が何を食べたいか）で、疑問文の語順（what does he want）にはしません。`
        },
        {
          label: '(3)',
          q: R`ドアのそばに立っている女の子を知っていますか。`,
          type: 'order',
          words: ['the', 'standing', 'know', 'by', 'do', 'door', 'girl', 'you', 'the'],
          answer: 'Do you know the girl standing by the door?',
          explain: R`Do you know ~? の文で、the girl を現在分詞 standing by the door（ドアのそばに立っている）が後ろから説明します。the girl standing by the door でひとかたまりです。`
        },
        {
          label: '(4)',
          q: R`これは祖父が建てた家です。`,
          type: 'order',
          words: ['grandfather', 'the', 'which', 'built', 'house', 'is', 'my', 'this'],
          answer: 'This is the house which my grandfather built.',
          explain: R`目的格の関係代名詞 **which** が、先行詞 the house を説明します。which my grandfather built（祖父が建てた）が the house を修飾します。built の目的語は先行詞 house なので、built の後ろに it は不要です。`
        }
      ],
      solution: [
        {
          t: '関係代名詞は「先行詞のすぐ後ろ」に置く',
          n: R`関係代名詞（who / which）は、説明したい名詞（先行詞）のすぐ後ろに置き、そのあとに説明の文を続けます。(1) The boy who is playing ~、(4) the house which my grandfather built の形です。`,
          easy: R`関係代名詞は、「その名詞の**くわしい説明を足すスイッチ**」です。説明したい名詞のすぐ後ろに置いて、そのあとに説明の文を続けます。`
        },
        {
          t: '間接疑問と分詞の後置修飾',
          n: R`間接疑問では、疑問詞のあとが「主語 + 動詞」の語順になります（what he wants to eat）。また、分詞（standing by the door）は、説明する名詞の後ろに置きます。`,
          easy: R`文の中に入った疑問文（間接疑問）では、**do / does を使わず**、ふつうの文の語順に戻します。「彼が何を食べたいか」は what he wants to eat です。`,
          pro: R`関係代名詞のあとの文には、目的語が欠けます。(4) の built の後ろに it を残さないことは、誤文訂正や整序で必ずチェックされます。完成した文の動詞の目的語が足りているか、見直す習慣をつけましょう。`
        }
      ],
      tags: ['整序', '関係代名詞', '間接疑問', '分詞']
    },

    /* ---------- e-conv（会話文）---------- */
    {
      id: 'd-e-conv-01',
      subject: 'english',
      level: 'drill',
      unit: 'e-conv',
      title: '会話文：洋服店で',
      source: SRC(),
      time: 4,
      body: R`次の会話文を読み、空所 ( 1 )〜( 4 ) に入る最も適切なものを選びなさい。（場面: 洋服店で、ミカが兄へのプレゼントを選んでいます。）

Clerk: Good afternoon. ( 1 )
Mika: I'm looking for a T-shirt for my brother.
Clerk: How about this blue one?
Mika: It looks nice. ( 2 )
Clerk: It's 1,800 yen.
Mika: ( 3 ) Can I try a larger size?
Clerk: Sure. Here you are.
Mika: This one fits him. I'll take it. ( 4 )
Clerk: Of course. I'll wrap it for you.`,
      fig: null,
      parts: [
        {
          label: '(1)',
          q: R`空所 ( 1 ) に入る最も適切なものを選びなさい。`,
          type: 'choice',
          choices: ['How was your trip?', 'What time is it?', 'May I help you?', 'Where do you live?'],
          answer: 2,
          explain: R`店員が客に最初にかけるあいさつです。**May I help you?**（いらっしゃいませ; 何かお探しですか）が入ります。直後にミカが「兄のために T シャツを探しています」と答えているのとも合います。`
        },
        {
          label: '(2)',
          q: R`空所 ( 2 ) に入る最も適切なものを選びなさい。`,
          type: 'choice',
          choices: ['How long is it?', 'How much is it?', 'How old is it?', 'How many is it?'],
          answer: 1,
          explain: R`直後に店員が「1,800 円です」と値段を答えているので、値段をたずねる **How much is it?** が入ります。How long は長さ・期間、How old は年齢や古さ、How many は数をたずねる表現です。`
        },
        {
          label: '(3)',
          q: R`空所 ( 3 ) に入る最も適切なものを選びなさい。`,
          type: 'choice',
          choices: ["I'm sorry I'm late.", "It's very delicious.", "You're welcome.", "I'm afraid it's a little small."],
          answer: 3,
          explain: R`ミカは直後で「もっと大きいサイズを試せますか」と言っています。その理由として、「**ちょっと小さいようです**（I'm afraid it's a little small.）」が自然です。I'm afraid ~ は「残念ながら〜のようです」とやんわり伝える言い方です。`
        },
        {
          label: '(4)',
          q: R`空所 ( 4 ) に入る最も適切なものを選びなさい。`,
          type: 'choice',
          choices: ['Could you wrap it as a present?', 'Could you tell me the way?', 'Would you like some more?', 'How long will it take?'],
          answer: 0,
          explain: R`店員が直後に「もちろんです。お包みします」と答えているので、包装を頼む **Could you wrap it as a present?**（プレゼント用に包んでもらえますか）が入ります。Could you ~? は丁寧に依頼する表現です。`
        }
      ],
      solution: [
        {
          t: '場面と話の流れをつかんでから空所を見る',
          n: R`会話文では、まず「だれが・どこで・何をしているか」をつかみます。この会話は「洋服店で兄への T シャツを買う」場面です。そのうえで、空所の直前・直後の発言から、何を言えば会話がつながるかを考えます。`,
          easy: R`会話文の問題は、**空所の前後をヒントに**して解きます。たとえば (2) の直後で店員が「1,800 円です」と答えているので、その前では「値段をたずねた」とわかります。`
        },
        {
          t: '買い物の定番表現を覚える',
          n: R`May I help you?（いらっしゃいませ）、How much is it?（いくらですか）、Can I try ~?（〜を試してもいいですか）、Could you wrap it ~?（包んでもらえますか）、I'll take it.（それをいただきます）は、買い物の会話の定番表現です。`,
          easy: R`買い物でよく使う英語は、決まった**セリフ**として覚えておくと便利です。「May I help you?」は店員さんの定番のあいさつです。`,
          pro: R`I'm afraid ~ は、断る・悪い知らせを伝えるときにやわらかく言う表現です。共通テストの会話文では、直接的な言い方とやわらげた言い方を比べて選ばせる問題がよく出ます。`
        }
      ],
      tags: ['会話文', '買い物', '依頼']
    },

    {
      id: 'd-e-conv-02',
      subject: 'english',
      level: 'drill',
      unit: 'e-conv',
      title: '会話文：電話で映画に誘う',
      source: SRC(),
      time: 4,
      body: R`次の会話文を読み、空所 ( 1 )〜( 4 ) に入る最も適切なものを選びなさい。（場面: ケンがエミに電話をかけて、映画に誘っています。）

Ken: Hello, Emi. This is Ken. ( 1 )
Emi: Yes, I am. What's up?
Ken: There is a new movie at the theater. ( 2 )
Emi: That sounds great! What time does it start?
Ken: At two o'clock. ( 3 )
Emi: How about meeting at the station at one thirty?
Ken: Perfect. ( 4 )
Emi: Me, too. See you then. Bye!`,
      fig: null,
      parts: [
        {
          label: '(1)',
          q: R`空所 ( 1 ) に入る最も適切なものを選びなさい。`,
          type: 'choice',
          choices: ['Do you have a pen?', 'How old are you?', 'Are you free this Saturday?', 'Where is the station?'],
          answer: 2,
          explain: R`エミの返事が Yes, I am. なので、be 動詞の疑問文です。Are you free this Saturday?（今度の土曜日は空いている？）と予定をたずねる文が合います。他の選択肢は、Yes, I am. では答えられません。`
        },
        {
          label: '(2)',
          q: R`空所 ( 2 ) に入る最も適切なものを選びなさい。`,
          type: 'choice',
          choices: ['Did you see it yesterday?', 'Is it far from your house?', 'Can you tell me the way?', 'Would you like to see it with me?'],
          answer: 3,
          explain: R`直後のエミの That sounds great!（それはいいね）は、誘いに対する返事です。「新しい映画がある」に続けて、**Would you like to see it with me?**（いっしょに見に行かない？）と誘う文が入ります。`
        },
        {
          label: '(3)',
          q: R`空所 ( 3 ) に入る最も適切なものを選びなさい。`,
          type: 'choice',
          choices: ['Where shall we meet?', 'Who is your favorite actor?', 'How long is the movie?', 'Which movie did you see?'],
          answer: 0,
          explain: R`直後でエミが「駅で 1 時半に会うのはどう？」と待ち合わせ場所を提案しています。これに合うのは、場所をたずねる **Where shall we meet?**（どこで会おうか）です。Shall we ~? は「〜しましょうか」と提案する言い方です。`
        },
        {
          label: '(4)',
          q: R`空所 ( 4 ) に入る最も適切なものを選びなさい。`,
          type: 'choice',
          choices: ["That's too bad.", "I'm looking forward to it.", "I don't think so.", "I'm sorry to hear that."],
          answer: 1,
          explain: R`エミが Me, too.（私もよ）と答えているので、ケンの発言は前向きな内容です。**I'm looking forward to it.**（楽しみにしているよ）が入ります。That's too bad. や I'm sorry to hear that. は残念な知らせへの返事です。`
        }
      ],
      solution: [
        {
          t: '返事の形から空所の文の種類を決める',
          n: R`(1) の返事は Yes, I am. なので be 動詞の疑問文、(4) の返事は Me, too. なので前向きな気持ちを伝える文です。返事の形（Yes / No、Me, too など）は、空所の文を決める有力な手がかりになります。`,
          easy: R`会話文では、**相手の返事**がいちばんのヒントです。返事が「Yes, I am.」なら、その前の質問は「Are you ~?」の形のはずです。`
        },
        {
          t: '誘う・提案する表現',
          n: R`Would you like to ~?（〜しませんか）、Shall we ~? / Where shall we meet?（〜しましょうか / どこで会いましょうか）、How about ~ing?（〜するのはどう？）、I'm looking forward to it.（楽しみにしています）は、誘い・提案の会話の定番です。`,
          easy: R`「誘う」ときの英語は、まとめて覚えておきましょう。「Would you like to ~?」は丁寧な誘い、「How about ~ing?」はくだけた提案です。誘われて乗り気なら「That sounds great!」と答えます。`,
          pro: R`Shall I ~?（〜しましょうか: 申し出）と Shall we ~?（〜しましょうか: 提案）は、主語が違うと意味も変わります。会話文の空所補充では、この違いが選択肢の差になることがあります。`
        }
      ],
      tags: ['会話文', '電話', '誘い・提案']
    },

    {
      id: 'd-e-conv-03',
      subject: 'english',
      level: 'drill',
      unit: 'e-conv',
      title: '会話文：体調が悪いとき',
      source: SRC(),
      time: 4,
      body: R`次の会話文を読み、空所 ( 1 )〜( 4 ) に入る最も適切なものを選びなさい。（場面: 先生が、体調の悪そうな生徒のトムに声をかけています。）

Teacher: You don't look well, Tom. ( 1 )
Tom: I have a headache. I think I have a cold.
Teacher: ( 2 ) Did you take any medicine?
Tom: No, I didn't. ( 3 )
Teacher: You should go to the nurse's office and rest for a while.
Tom: ( 4 )
Teacher: I'll tell your classmates.`,
      fig: null,
      parts: [
        {
          label: '(1)',
          q: R`空所 ( 1 ) に入る最も適切なものを選びなさい。`,
          type: 'choice',
          choices: ['Where are you going?', "What's the matter?", 'Who is she?', 'How much is it?'],
          answer: 1,
          explain: R`先生は「具合が悪そうだね」と言ったあとに、原因をたずねています。直後でトムが「頭が痛い」と答えているので、**What's the matter?**（どうしたの？）が入ります。`
        },
        {
          label: '(2)',
          q: R`空所 ( 2 ) に入る最も適切なものを選びなさい。`,
          type: 'choice',
          choices: ['Good for you.', "You're welcome.", 'See you later.', "That's too bad."],
          answer: 3,
          explain: R`トムが頭痛と風邪を訴えたので、先生は同情を表す **That's too bad.**（それはいけませんね; お気の毒に）と言います。Good for you.（よかったね）は喜ばしいことへの返事なので合いません。`
        },
        {
          label: '(3)',
          q: R`空所 ( 3 ) に入る最も適切なものを選びなさい。`,
          type: 'choice',
          choices: ["I don't have any with me.", "I'm very hungry.", "It's too expensive.", "I'll be there soon."],
          answer: 0,
          explain: R`先生に「薬は飲んだ？」と聞かれ、No, I didn't. と答えたあとの説明です。**I don't have any with me.**（薬を持っていないんです）が自然な続きです。この any は medicine を指します。`
        },
        {
          label: '(4)',
          q: R`空所 ( 4 ) に入る最も適切なものを選びなさい。`,
          type: 'choice',
          choices: ['Can you tell me the way?', 'What time is it?', "Thank you. I'll go there now.", "I'll have some tea."],
          answer: 2,
          explain: R`先生に「保健室で休みなさい」と勧められた直後なので、**Thank you. I'll go there now.**（ありがとうございます。今から行きます）と答えます。直後の「クラスの友達には私から伝えておくよ」という先生の返事ともつながります。`
        }
      ],
      solution: [
        {
          t: '「状況 → 気持ち → 助言」の流れで読む',
          n: R`この会話は、「具合が悪そう（状況）→ 頭が痛い（症状）→ 同情する → 薬は？ → 休むよう助言 → 了承」という流れです。先生の質問・助言に、トムが自然に答える形を選びます。`,
          easy: R`会話は、**話の流れ（ストーリー）**で考えます。具合の悪い人にかける言葉は、「どうしたの？」「それは大変だね」「休んだほうがいいよ」の順に進みます。`
        },
        {
          t: '体調・助言の表現を覚える',
          n: R`What's the matter?（どうしたの？）、That's too bad.（それはいけませんね）、You should ~.（〜したほうがいい）、I have a headache.（頭が痛い）は、体調に関する会話の定番表現です。`,
          easy: R`相手が困っているときの定番は、「What's the matter?」と「That's too bad.」です。そのあとに、「You should ~（〜したほうがいいよ）」とアドバイスします。`,
          pro: R`I don't have any with me. のように、any が省略した名詞（ここでは medicine）の代わりをする用法は、会話文の「文中の代名詞が何を指すか」を問う設問で出ます。前後の名詞を意識して読む習慣をつけましょう。`
        }
      ],
      tags: ['会話文', '体調', '助言']
    },

    /* ---------- e-reading（長文読解・短い文章）---------- */
    {
      id: 'd-e-reading-01',
      subject: 'english',
      level: 'drill',
      unit: 'e-reading',
      title: '長文：パン屋のアルバイト',
      source: SRC(),
      time: 4,
      body: R`次の英文を読み、問いに答えなさい。空所は ( 1 )・( 2 )、下線部は (3) です。

注　bakery = パン屋　owner = 店主　customer = 客　baker = パン職人`,
      fig: null,
      passage: 'ep-drill-01',
      parts: [
        {
          label: '(1)',
          q: R`空所 ( 1 ) に入る最も適切な語を選びなさい。`,
          type: 'choice',
          choices: ['work', 'working', 'works', 'to work'],
          answer: 2,
          explain: R`Every Saturday（毎週土曜日）から、習慣を表す現在形の文です。主語 she は 3 人称単数なので、動詞に s がついた **works** が入ります。working は進行形や動名詞、to work は不定詞の形で、ここでは使えません。`
        },
        {
          label: '(2)',
          q: R`空所 ( 2 ) に入る最も適切な語を選びなさい。`,
          type: 'choice',
          choices: ['by', 'in', 'on', 'with'],
          answer: 0,
          explain: R`交通手段を表すときは **by + 乗り物**（冠詞なし）で、by bicycle（自転車で）となります。in / on / with の後ろに無冠詞の bicycle を置く言い方はありません。`
        },
        {
          label: '(3)',
          q: R`下線部 (3) の It が指す内容として最も適切なものを選びなさい。`,
          type: 'choice',
          choices: ['the small bakery', 'helping the owner make bread', 'going to the shop by bicycle', 'saying "Welcome!" to customers'],
          answer: 1,
          explain: R`It は直前の文 First, she helps the owner make bread. の内容（店主がパンを作るのを手伝うこと）を指しています。「それ（パン作りの手伝い）は重労働だが、彼女は楽しんでいる」という流れです。`
        },
        {
          label: '(4)',
          q: R`本文の内容に合うものを 1 つ選びなさい。`,
          type: 'choice',
          choices: ['Yuki works at the bakery every day of the week.', 'Yuki is already a baker.', "Yuki's family dislikes the bread she brings home.", 'Yuki enjoys her work at the bakery.'],
          answer: 3,
          explain: R`第 1 段落の最後に she enjoys it とあり、ユキが仕事を楽しんでいることがわかります。働くのは毎週**土曜日**だけ（毎日ではない）、パン職人は「将来なりたい」職業、家族はパンを**楽しみにしている**ので、他の選択肢は本文と合いません。`
        }
      ],
      solution: [
        {
          t: '全体の内容をつかむ',
          n: R`第 1 段落は「ユキの土曜日のアルバイト（パン作りの手伝い）」、第 2 段落は「接客、パンのお土産、将来の夢」の話です。最初に、だれが・いつ・何をしているかをつかみます。`,
          easy: R`長文を読むときは、まず「**だれが・いつ・何をしているか**」を探します。この文章は「ユキが、土曜日に、パン屋で働いている」という話です。`
        },
        {
          t: '空所は文法、指示語は直前の文から決める',
          n: R`(1) は主語 she と every Saturday から 3 単現の works、(2) は交通手段の by bicycle、(3) の It は直前の文の内容を指します。内容一致問題は、選択肢の語句を本文で探して照らし合わせます。`,
          easy: R`空所が文法の問題なら、**主語や前後の言葉**を見て決めます。It や they のような言葉が何を指すかは、**すぐ前の文**にヒントがあります。`,
          pro: R`内容一致では、every day と every Saturday のように、少しだけ違う語句に変えた選択肢が誤答として出ます。本文のどの語句を言い換えているか、1 語ずつ照合する習慣をつけましょう。`
        }
      ],
      tags: ['長文', '短い文章', '空所補充', '指示語', '内容一致']
    },

    {
      id: 'd-e-reading-02',
      title: '長文：猫のモモ',
      subject: 'english',
      level: 'drill',
      unit: 'e-reading',
      source: SRC(),
      time: 4,
      body: R`次の英文を読み、問いに答えなさい。空所は ( 1 )・( 2 )、下線部は (3) です。

注　fur = （動物の）毛　paw = （動物の）前足`,
      fig: null,
      passage: 'ep-drill-02',
      parts: [
        {
          label: '(1)',
          q: R`空所 ( 1 ) に入る最も適切な語を選びなさい。`,
          type: 'choice',
          choices: ['by', 'for', 'with', 'to'],
          answer: 2,
          explain: R`touch my face **with** her paw で「前足で私の顔にさわる」です。with は道具・手段（〜を使って）を表します。by は by + 動名詞（by touching）の形ですでに使われていて、for / to では意味が通りません。`
        },
        {
          label: '(2)',
          q: R`空所 ( 2 ) に入る最も適切な語を選びなさい。`,
          type: 'choice',
          choices: ['happy', 'sad', 'angry', 'tired'],
          answer: 0,
          explain: R`「餌をもらって食べているとき」の様子なので、**happy**（幸せな）が入ります。sad（悲しい）、angry（怒った）、tired（疲れた）では、食べているときの様子として不自然です。`
        },
        {
          label: '(3)',
          q: R`下線部 (3) の意味として最も適切なものを選びなさい。`,
          type: 'choice',
          choices: ['窓を開ける', '窓をふく', '窓から飛び出す', '窓から外を見る'],
          answer: 3,
          explain: R`**look out of ~** は「〜から外を見る」です。「モモは家にいて、一日中窓の外を眺めている」という意味になります。飼い主が学校に行っている間のモモの様子を表しています。`
        },
        {
          label: '(4)',
          q: R`本文の内容に合うものを 1 つ選びなさい。`,
          type: 'choice',
          choices: ['Momo is a dog with soft white fur.', 'Momo wakes the writer up in the morning.', 'Momo goes to school with the writer.', 'Momo is afraid of the door.'],
          answer: 1,
          explain: R`第 2 段落の最初に、In the morning, she wakes me up ... とあります。つまり、モモは朝、書き手を起こします。モモは犬ではなく猫で、学校へは行かず家で待ち、ドアには（怖がるのではなく）走っていきます。`
        }
      ],
      solution: [
        {
          t: '全体の内容をつかむ',
          n: R`第 1 段落は猫のモモの紹介、第 2 段落は朝の様子、第 3 段落は書き手が学校に行っている間と帰宅後の様子です。時間の流れ（夜 → 朝 → 昼 → 帰宅後）に沿って整理します。`,
          easy: R`この文章は、**モモの一日**を順番に説明しています。夜（ベッドで眠る）→ 朝（起こす・ごはん）→ 昼（窓の外を見る）→ 夕方（ドアへ走る）、と流れを追いましょう。`
        },
        {
          t: '空所は前後の語句から、内容一致は本文の言い換えから',
          n: R`(1) は touch A with B（B を使って A にさわる）、(2) は「食べているとき」の様子から happy を選びます。(4) の内容一致は、wakes me up を wakes the writer up に言い換えた選択肢が正解です。`,
          easy: R`選択肢の英文は、本文の言葉を**少し言い換えて**作られています。「wakes me up」の「me」が「the writer（書き手）」に変わっているだけなので、落ち着いて照らし合わせましょう。`,
          pro: R`内容一致問題では、本文の「I（私）」が選択肢で「the writer」や「the girl」のような言い方に変わることがよくあります。主語の言い換えに慣れておくと、誤答の選択肢を早く切り捨てられます。`
        }
      ],
      tags: ['長文', '短い文章', '空所補充', '熟語', '内容一致']
    },

    {
      id: 'd-e-reading-03',
      title: '長文：運動会の一日',
      subject: 'english',
      level: 'drill',
      unit: 'e-reading',
      source: SRC(),
      time: 4,
      body: R`次の英文（日記）を読み、問いに答えなさい。空所は ( 1 )・( 2 )、下線部は (3) です。

注　sports day = 運動会　tug of war = 綱引き　rope = ロープ`,
      fig: null,
      passage: 'ep-drill-03',
      parts: [
        {
          label: '(1)',
          q: R`空所 ( 1 ) に入る最も適切な語を選びなさい。`,
          type: 'choice',
          choices: ['runs', 'run', 'running', 'ran'],
          answer: 3,
          explain: R`日記の最初に Today was ~ とあるので、すべて過去の出来事です。run の過去形は **ran** です（run - ran - run）。「私は 100 メートル走に出て、2 位になった」という過去の話になります。`
        },
        {
          label: '(2)',
          q: R`空所 ( 2 ) に入る最も適切な語を選びなさい。`,
          type: 'choice',
          choices: ['possible', 'possibly', 'impossible', 'possibility'],
          answer: 0,
          explain: R`**as ~ as possible** で「できるだけ〜」です。as hard as possible は「できるだけ強く」という意味になります。as と as の間には形容詞・副詞の原形（hard）、後ろには形容詞 possible を置きます。`
        },
        {
          label: '(3)',
          q: R`下線部 (3) の意味として最も適切なものを選びなさい。`,
          type: 'choice',
          choices: ['大差で勝った', '小差で勝った', '引き分けた', '負けた'],
          answer: 1,
          explain: R`**by a small difference** は「小さな差で」、つまり僅差という意味です。won by a small difference は「僅差で勝った」になります。by a large difference なら「大差で」です。`
        },
        {
          label: '(4)',
          q: R`本文の内容に合うものを 1 つ選びなさい。`,
          type: 'choice',
          choices: ['It rained all day.', 'The writer came in first in the race.', "The writer's class won the tug of war.", 'The writer was not tired at all.'],
          answer: 2,
          explain: R`第 2 段落の最後に Our team won ~ とあり、書き手のクラスが綱引きに勝ったことがわかります。雨は降らず（did not rain）、徒競走は 2 位（came in second）、帰宅後は very tired と書かれているので、他の選択肢は誤りです。`
        }
      ],
      solution: [
        {
          t: '全体の内容をつかむ',
          n: R`3 つの段落が、午前（徒競走）→ 午後（綱引き）→ 夜（感想）の順に並んでいます。日記なので、すべて過去形で書かれていることにも注目します。`,
          easy: R`日記は、**その日にあったことを順番に書いた文章**です。「いつ（朝・午後）」「何をした」を追っていくと、内容がつかめます。`
        },
        {
          t: '時制・熟語・内容一致の確認',
          n: R`(1) は過去の文なので ran、(2) は as ~ as possible の決まった形、(3) は by a small difference（僅差で）の意味、(4) は本文と選択肢を 1 つずつ照らし合わせて正解を選びます。`,
          easy: R`「as ~ as possible（できるだけ〜）」は決まった言い方です。まるごと覚えましょう。内容一致では、本文に書いてあることだけを正解にして、書いていないことや逆のことは選びません。`,
          pro: R`as ~ as possible は as ~ as one can と書き換えられます（as hard as we could）。時制の一致に注意して、書き換え問題にも対応できるようにしておきましょう。`
        }
      ],
      tags: ['長文', '短い文章', '時制', '熟語', '内容一致']
    }
  ]);
})();
