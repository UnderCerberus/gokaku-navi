/* GOKAKU NAVI — 英語 問題バンク（中堅大レベル: 目安 偏差値 50〜60 / 日東駒専〜GMARCH 下位）
   15 カード = 語彙 3 / 熟語 2 / 文法・語法 4 / 整序 2 / 会話文 1 / 長文 3。
   英文・設問・選択肢・解説はすべて書き下ろしのオリジナル（既存の入試問題・参考書の文面は含まない）。 */
(function () {
  'use strict';
  const R = String.raw;
  const SRC = { univ: 'オリジナル' };

  /* ================================================================
   *  長文（passage）  ep-mid-01 〜 ep-mid-03
   * ================================================================ */
  JK.registerPassages([
    /* ---------- ep-mid-01: 屋上庭園（環境・都市） ---------- */
    {
      id: 'ep-mid-01',
      title: 'Gardens in the Sky',
      level: 'mid',
      topic: '環境・都市',
      source: SRC,
      paras: [
        [
          { en: R`In big cities, there is hardly any empty land left on the ground.`, ja: R`大都市では、地上に空き地はほとんど残っていない。` },
          { en: R`Buildings stand side by side, and roads cover most of the rest.`, ja: R`ビルは隣り合って建ち並び、残りの土地の大部分は道路でおおわれている。` },
          { en: R`Yet there is one kind of space that people have long ignored: the flat roofs of the buildings themselves.`, ja: R`だが、人々が長いあいだ見過ごしてきた種類の空間が1つある。ビルそのものの平らな屋根である。` },
          { en: R`In recent years, more and more cities have started turning these roofs {b1:into} gardens.`, ja: R`近年、ますます多くの都市が、こうした屋根を庭園に変え始めている。` }
        ],
        [
          { en: R`A rooftop garden does more than make a building look pleasant.`, ja: R`屋上庭園は、建物の見栄えをよくするだけにとどまらない。` },
          { en: R`First, it keeps the building cool.`, ja: R`第一に、建物を涼しく保つ。` },
          { en: R`On a hot summer day, an ordinary roof can become much hotter than the air, but a layer of plants and soil absorbs much of the sun's heat.`, ja: R`暑い夏の日には、ふつうの屋根は気温よりずっと高温になることがあるが、植物と土の層は太陽の熱の多くを吸収する。` },
          { en: R`{b2:As a result}, the rooms below need less air conditioning, and the owner of the building saves money on electricity.`, ja: R`その結果、下の階の部屋は冷房があまり必要でなくなり、ビルの持ち主は電気代を節約できる。` }
        ],
        [
          { en: R`Second, a rooftop garden helps a city deal with heavy rain.`, ja: R`第二に、屋上庭園は都市が大雨に対処するのに役立つ。` },
          { en: R`Concrete and asphalt cannot soak up water, so rain runs quickly into the drains, which may be unable to carry all of it away in a storm.`, ja: R`コンクリートやアスファルトは水を吸い込めないため、雨はすぐに排水溝へ流れ込むが、嵐のときには、排水溝がその全部を運び去れないことがある。` },
          { en: R`Plants and soil, {b3:on the other hand}, hold water like a sponge and release it slowly.`, ja: R`一方、植物と土はスポンジのように水を保ち、それをゆっくりと放出する。` },
          { en: R`{u4:This} lowers the risk of flooding in the streets below.`, ja: R`これが、下の通りで洪水が起こる危険を小さくするのである。` }
        ],
        [
          { en: R`Third, roof gardens give city dwellers a place to meet nature.`, ja: R`第三に、屋上庭園は都市の住民に自然とふれあう場所を与える。` },
          { en: R`On the roof of one apartment house, neighbors grow tomatoes and herbs and share the harvest every weekend.`, ja: R`ある集合住宅の屋上では、近所の人々がトマトやハーブを育て、毎週末に収穫物を分け合っている。` },
          { en: R`They say that working together has made them better acquainted with one another than they ever were in the elevator.`, ja: R`一緒に作業をするようになって、エレベーターで顔を合わせていたころよりも互いによく知り合えるようになったと、彼らは言う。` }
        ],
        [
          { en: R`Of course, building a roof garden is not easy.`, ja: R`もちろん、屋上庭園をつくるのは簡単ではない。` },
          { en: R`Wet soil is heavy, so the roof must be strong enough to carry it, and the garden also needs a waterproof sheet and regular care.`, ja: R`湿った土は重いので、屋根にはそれを支えられるだけの強度がなければならず、庭にはまた、防水シートや定期的な手入れも必要である。` },
          { en: R`All this costs money, and many owners {b5:hesitate} to pay for it.`, ja: R`これにはすべて費用がかかり、多くの持ち主は、それを払うのをためらう。` }
        ],
        [
          { en: R`Even so, the idea is spreading.`, ja: R`それでも、この考えは広がりつつある。` },
          { en: R`Some cities now give money to owners who build green roofs, and a few have even made them {u6:a requirement for large new buildings}.`, ja: R`緑の屋根をつくる持ち主に資金を出す都市もあり、いくつかの都市は、それを大規模な新築ビルの義務にすることさえしている。` },
          { en: R`If this trend continues, the skyline of the future may look not like a forest of gray boxes but like a hillside covered with green.`, ja: R`この傾向が続けば、未来の街のスカイラインは、灰色の箱の森ではなく、緑におおわれた丘の斜面のように見えるかもしれない。` }
        ]
      ],
      vocab: ['ignore', 'absorb', 'soak', 'drain', 'flood', 'dweller', 'acquainted', 'harvest', 'waterproof', 'hesitate', 'requirement', 'trend', 'skyline', 'concrete'],
      vocabExtra: [
        ['dweller', '名', '住民; 居住者', 3],
        ['acquainted', '形', '知り合いの; 精通している', 2],
        ['waterproof', '形', '防水の', 2],
        ['skyline', '名', 'スカイライン（空を背景にした街の輪郭）', 3],
        ['asphalt', '名', 'アスファルト', 3],
        ['drain', '名', '排水溝; 排水管', 3]
      ]
    },

    /* ---------- ep-mid-02: マルチタスク（心理・科学） ---------- */
    {
      id: 'ep-mid-02',
      title: 'Can We Really Do Two Things at Once?',
      level: 'mid',
      topic: '心理・科学',
      source: SRC,
      paras: [
        [
          { en: R`Many people are proud of being able to do several things at the same time, a skill known as multitasking.`, ja: R`多くの人は、同時にいくつものことをこなせること、つまりマルチタスクと呼ばれる能力を誇りにしている。` },
          { en: R`They answer e-mails during meetings, listen to music while studying, and check their phones while talking with friends.`, ja: R`会議中にメールに返信し、勉強しながら音楽を聴き、友人と話しながら携帯電話を確認する。` }
        ],
        [
          { en: R`{b1:However}, scientists who study the brain have doubts about this idea.`, ja: R`しかし、脳を研究する科学者たちは、この考えに疑いを抱いている。` },
          { en: R`According to their research, the brain cannot really pay attention to two difficult tasks at the same moment.`, ja: R`彼らの研究によれば、脳は2つの難しい作業に同時に注意を向けることは実際にはできない。` },
          { en: R`What feels like multitasking is actually rapid switching: the brain moves its attention from one task to another and back again.`, ja: R`マルチタスクのように感じられるものは、実際には素早い切り替えである。脳は注意をある作業から別の作業へ、そしてまた元へと移しているのだ。` },
          { en: R`Each switch takes only a fraction of a second, {b2:but} these small delays quickly add up.`, ja: R`1回の切り替えにかかるのは1秒のごくわずかな時間にすぎないが、こうした小さな遅れはすぐに積み重なる。` }
        ],
        [
          { en: R`In one experiment, researchers asked two groups of students to solve a set of math problems.`, ja: R`ある実験で、研究者たちは2つの学生グループに、一組の数学の問題を解くよう求めた。` },
          { en: R`One group worked on the problems without a break.`, ja: R`一方のグループは、休まずに問題に取り組んだ。` },
          { en: R`The other group was {b3:interrupted} every few minutes by a text message and had to answer it before returning to the problems.`, ja: R`もう一方のグループは、数分おきに携帯メッセージで作業を中断され、問題に戻る前にそれに返信しなければならなかった。` },
          { en: R`The students who were interrupted took much longer to finish {b4:than} those who were not, and they also made more mistakes.`, ja: R`中断された学生たちは、中断されなかった学生たちよりも、終えるのにずっと長くかかり、間違いも多かった。` }
        ],
        [
          { en: R`Why does switching cost so much?`, ja: R`なぜ切り替えにはそれほど大きな代償がかかるのだろうか。` },
          { en: R`One reason is that the brain needs time to start up again.`, ja: R`1つの理由は、脳が再び働き始めるのに時間を必要とすることである。` },
          { en: R`When we return to the first task, we must remember where we stopped and what we were going to do next.`, ja: R`最初の作業に戻るとき、私たちはどこでやめたのか、次に何をするつもりだったのかを思い出さなければならない。` },
          { en: R`{u5:This process} is invisible, so we do not notice the time we lose.`, ja: R`この過程は目に見えないので、私たちは自分が失っている時間に気づかない。` }
        ],
        [
          { en: R`This does not mean that we should never do two things at once.`, ja: R`これは、2つのことを同時にしてはいけないということではない。` },
          { en: R`The trouble begins when both tasks need our full attention, such as reading a report while talking on the phone.`, ja: R`問題が始まるのは、報告書を読みながら電話で話すときのように、両方の作業が私たちの全神経を必要とする場合である。` },
          { en: R`In such cases, it is better to finish one task before starting the next.`, ja: R`そのような場合には、1つの作業を終えてから次の作業を始めるほうがよい。` }
        ],
        [
          { en: R`Some people find this advice hard to follow, because doing just one thing seems like a waste of time.`, ja: R`この助言に従うのは難しいと感じる人もいる。1つのことだけをするのは時間の無駄に思えるからである。` },
          { en: R`Yet the evidence suggests that {u6:the opposite is true}.`, ja: R`しかし、証拠は逆が真実であることを示している。` },
          { en: R`People who concentrate on one thing at a time often finish earlier and do better work than those who try to do everything at once.`, ja: R`一度に1つのことに集中する人は、何もかもを一度にやろうとする人よりも、早く終えて質の高い仕事をすることが多い。` }
        ]
      ],
      vocab: ['attention', 'rapid', 'fraction', 'experiment', 'interrupt', 'delay', 'process', 'invisible', 'concentrate', 'evidence', 'opposite', 'demand'],
      vocabExtra: [
        ['multitasking', '名', 'マルチタスク（同時に複数の作業をすること）', 3],
        ['fraction', '名', '一部; 分数', 2]
      ]
    },

    /* ---------- ep-mid-03: 町の本屋（物語・エッセイ） ---------- */
    {
      id: 'ep-mid-03',
      title: 'Take Your Time',
      level: 'mid',
      topic: '物語・エッセイ',
      source: SRC,
      paras: [
        [
          { en: R`When I was a child, my favorite place in town was the small bookshop at the corner of our street.`, ja: R`子どものころ、町でいちばん好きな場所は、うちの通りの角にある小さな本屋だった。` },
          { en: R`Its owner, Mr. Hayashi, was an old man with white hair and round glasses.`, ja: R`店主の林さんは、白髪で丸いめがねをかけた年配の男性だった。` },
          { en: R`He never seemed to be in a hurry.`, ja: R`彼は急いでいるように見えたことが一度もなかった。` },
          { en: R`Whenever I came in, he looked up from his newspaper, smiled, and said, "Take your time."`, ja: R`私が入っていくといつも、彼は新聞から顔を上げ、にっこりして「ごゆっくり」と言った。` }
        ],
        [
          { en: R`I took his words {b1:literally}.`, ja: R`私はその言葉を文字どおりに受け取った。` },
          { en: R`Every Saturday I spent hours between the shelves, reading a few pages of one book and then a few pages of another.`, ja: R`毎週土曜日、私は書棚のあいだで何時間も過ごし、ある本を数ページ、それから別の本を数ページと読んでいった。` },
          { en: R`I could not afford to buy many books, so I read most of them standing up.`, ja: R`たくさんの本を買う余裕はなかったので、私はそのほとんどを立ち読みした。` },
          { en: R`Mr. Hayashi never once told me to leave.`, ja: R`林さんは、出ていくようにと私に言ったことは一度もなかった。` }
        ],
        [
          { en: R`Years later, after I had moved to another city for university, I came home one summer and found a sign on the shop door: "Closing on August 31. Thank you for sixty years."`, ja: R`何年もあと、大学進学のために別の町へ引っ越していた私は、ある夏に帰省して、店の扉に貼り紙を見つけた。「8月31日で閉店します。60年間ありがとうございました」。` },
          { en: R`{u2:My heart sank}.`, ja: R`私は胸が沈んだ。` }
        ],
        [
          { en: R`I ran to the shop the next morning.`, ja: R`翌朝、私はその店へ走っていった。` },
          { en: R`It was full of customers, most of them people of my age who had grown up in the neighborhood.`, ja: R`店は客でいっぱいで、その大半は、この近所で育った私と同年代の人たちだった。` },
          { en: R`Mr. Hayashi was behind the counter, older and slower than I remembered, but with the same calm smile.`, ja: R`林さんはカウンターの向こうにいた。記憶にあるよりも年をとって動作もゆっくりしていたが、穏やかな笑顔は昔のままだった。` },
          { en: R`{b3:To} my surprise, he remembered me.`, ja: R`驚いたことに、彼は私を覚えていた。` },
          { en: R`I said I was sorry for all the books I had read without paying, and he laughed.`, ja: R`代金も払わずに読んでしまった数々の本のことを謝ると、彼は笑った。` },
          { en: R`"{u4:Children like you were my best advertisement}," he said.`, ja: R`「君のような子どもたちが、私にとって最高の宣伝だったんだよ」と彼は言った。` },
          { en: R`"You stayed, your friends came, and then their parents came."`, ja: R`「君が通い、君の友達が来て、そのうち友達の親たちも来るようになった」` }
        ],
        [
          { en: R`Online shopping, he explained, had made it hard to keep the business going.`, ja: R`ネット通販のせいで商売を続けるのが難しくなったのだと、彼は説明した。` },
          { en: R`People now buy books with one click, and he did not blame them.`, ja: R`人々は今ではワンクリックで本を買う。彼はそれを責めるつもりはなかった。` },
          { en: R`But he thought something was lost when no one stood in front of a shelf and found a book {b5:by accident}.`, ja: R`だが、書棚の前に立って偶然に1冊の本を見つける人がいなくなれば、何かが失われると彼は考えていた。` }
        ],
        [
          { en: R`On the last day, I bought five books, more than I had bought in all my childhood.`, ja: R`最後の日、私は5冊の本を買った。子ども時代を通じて買ったすべての本より多かった。` },
          { en: R`Mr. Hayashi wrapped them slowly in brown paper, as if he wanted the afternoon to last, and said, "Take your time."`, ja: R`林さんは、まるで午後のひとときが続いてほしいと願うかのように、それらをゆっくりと茶色の紙で包み、「ごゆっくり」と言った。` },
          { en: R`This time, I understood that {u6:he was not talking about reading}.`, ja: R`今度は、彼が読書のことを言っているのではないと、私にはわかった。` },
          { en: R`He meant that neither of us needed to hurry to say goodbye.`, ja: R`彼が言いたかったのは、私たちのどちらも、別れを告げるのを急ぐ必要はないということだった。` }
        ]
      ],
      vocab: ['literally', 'afford', 'shelf', 'neighborhood', 'counter', 'advertisement', 'blame', 'accident', 'wrap', 'paperback'],
      vocabExtra: [
        ['paperback', '名', '文庫本; ペーパーバック', 3]
      ]
    }
  ]);

  /* ================================================================
   *  問題カード（15 枚）
   * ================================================================ */
  JK.registerProblems([
    /* ---------- 語彙 1: 空所補充（紛らわしい語） ---------- */
    {
      id: 'e-mid-vocab-01',
      subject: 'english',
      level: 'mid',
      unit: 'e-vocab',
      title: '語彙：空所補充（紛らわしい語）',
      source: SRC,
      time: 5,
      body: R`次の (1)〜(5) の英文の空所に入れるのに最も適切なものを、それぞれ選びなさい。`,
      fig: null,
      passage: null,
      parts: [
        {
          label: '(1)',
          q: R`The heavy snow forced the railway company to ( ) all trains on the northern line until the next morning.`,
          type: 'choice', choices: ['suspect', 'suppress', 'suspend', 'suppose'], answer: 2,
          explain: R`**suspend**（〜を一時停止する）が入ります。「大雪のために、翌朝まで北線の全列車の運転を止めざるをえなかった」という文脈です。suspect は「〜ではないかと疑う」、suppress は「〜を抑える、鎮圧する」、suppose は「〜だと思う」で、いずれも all trains を目的語にして「運転を止める」という意味にはなりません。語頭が sus- / sup- でつづりが似ているので、-pend（ぶら下げる → 宙づりにする → 一時停止する）という語の中身で覚えておきましょう。`
        },
        {
          label: '(2)',
          q: R`The young pianist was ( ) to play in front of a large audience, because she had never done so before.`,
          type: 'choice', choices: ['reliable', 'relevant', 'resistant', 'reluctant'], answer: 3,
          explain: R`be **reluctant** to do（〜するのに気が進まない）が入ります。「大観衆の前で演奏した経験がないので、気が進まなかった」という文脈です。reliable は「信頼できる」、relevant は「関連のある（to ~ を伴う）」、resistant は「抵抗力のある（to ~ を伴う）」で、to 不定詞を続けても意味が通りません。`
        },
        {
          label: '(3)',
          q: R`After a long argument, the two sides finally reached a ( ) in which each of them gave up a part of its demands.`,
          type: 'choice', choices: ['compromise', 'comparison', 'competition', 'complaint'], answer: 0,
          explain: R`reach a **compromise**（妥協に達する）です。「それぞれが要求の一部を取り下げた」という内容は、双方が譲り合う「妥協」と一致します。comparison は「比較」、competition は「競争」、complaint は「不平、苦情」で、reach の目的語としても文意としても合いません。`
        },
        {
          label: '(4)',
          q: R`It was very ( ) of you to give your seat to the old man on the crowded train.`,
          type: 'choice', choices: ['considerable', 'considerate', 'considering', 'considered'], answer: 1,
          explain: R`It is **considerate** of A to do（A が〜するとは思いやりがある）の形です。「混んだ電車で老人に席をゆずるとは思いやりがある」という意味になります。considerate は人の性質を表す形容詞で、kind / nice / polite などと同じく of you を伴います。considerable は「かなりの」（量・程度）、considering は「〜を考えると」、considered は「熟慮された」で、ここには合いません。`
        },
        {
          label: '(5)',
          q: R`Our teacher told us never to ( ) the importance of reviewing what we have learned on the same day.`,
          type: 'choice', choices: ['overcome', 'overtake', 'overlook', 'overwork'], answer: 2,
          explain: R`**overlook**（〜を見落とす、見過ごす）です。never overlook the importance of ~ で「〜の重要性を見過ごしてはならない」という意味になります。overcome は「〜に打ち勝つ」、overtake は「〜を追い越す」、overwork は「〜を働かせすぎる」で、the importance を目的語にして意味が通るのは overlook だけです。`
        }
      ],
      solution: [
        {
          t: '空所の品詞と、前後の語との結びつきを確認する',
          n: R`(1) all trains を目的語にとる動詞、(2) be 動詞のあとに入り to 不定詞を続けられる形容詞、(3) reached の目的語になる名詞、(4) It was very ( ) of you の形容詞、(5) the importance を目的語にとる動詞、というように、まず品詞と文型を決めます。`,
          easy: R`選択肢の 4 語は、語の出だしがそっくりです。あてずっぽうで選ばず、「空所の前後の語とどうつながるか」を手がかりにしましょう。たとえば (2) は「be ( ) to do」の形に入る形容詞だけが残ります。`,
          pro: R`つづりの似た語を並べる問題は、意味より先に「品詞・文型」で 4 択を 2 択に絞ると速く解けます。`
        },
        {
          t: 'つづりの似た語は、語の中身で区別する',
          n: R`suspend / suspect / suppress / suppose は、語頭の sus- / sup- が sub-（下に）の変形で、残りの部分が語根です。pend は「ぶら下がる」、spect は「見る」、press は「押す」、pose は「置く」を表します。語根の意味から、suspend は「宙づりにする → 一時停止する」、suppress は「下に押さえる → 抑える」というイメージで思い出せます。`,
          lv: 2
        },
        {
          t: '「セット」で覚える',
          n: R`reluctant to do（〜したがらない）／ reach a compromise（妥協に達する）／ It is considerate of A to do（A が〜するとは思いやりがある）／ overlook the importance（重要性を見過ごす）。語を単独でなく、よく結びつく語句ごと覚えると、空所補充で迷いません。`,
          easy: R`単語帳で「reluctant = 気が進まない」だけ覚えても、「to do がつづく」という使い方を知らないと、文の中で見分けられません。例文ごと声に出して覚えるのがおすすめです。`,
          lv: 2
        }
      ],
      tags: ['空所補充', '紛らわしい語', '語彙', '語の結びつき']
    },

    /* ---------- 語彙 2: 下線部に近い意味の語 ---------- */
    {
      id: 'e-mid-vocab-02',
      subject: 'english',
      level: 'mid',
      unit: 'e-vocab',
      title: '語彙：下線部に近い意味の語',
      source: SRC,
      time: 5,
      body: R`次の (1)〜(5) の英文の下線部の語に最も近い意味のものを、それぞれ選びなさい。`,
      fig: null,
      passage: null,
      parts: [
        {
          label: '(1)',
          q: R`The explorers had to __abandon__ their plan to climb the mountain because of the storm.`,
          type: 'choice', choices: ['carry out', 'give up', 'look for', 'put off'], answer: 1,
          explain: R`**abandon** は「〜を捨てる、断念する」で、give up と同じ意味です。「嵐のために登山の計画を断念せざるをえなかった」となります。carry out は「〜を実行する」で反対の意味、look for は「〜を探す」、put off は「〜を延期する」（やめるのではなく後回しにする）です。`
        },
        {
          label: '(2)',
          q: R`Please don't worry about such a __trivial__ mistake.`,
          type: 'choice', choices: ['serious', 'unusual', 'unimportant', 'embarrassing'], answer: 2,
          explain: R`**trivial** は「ささいな、取るに足りない」で、unimportant に最も近い意味です。「そんなささいな間違いは気にしないで」という文です。serious（重大な）は反対の意味、unusual は「めずらしい」、embarrassing は「恥ずかしい」で、trivial の言い換えにはなりません。`
        },
        {
          label: '(3)',
          q: R`The new neighbors were quite __hostile__, and they never said hello to us.`,
          type: 'choice', choices: ['generous', 'curious', 'talkative', 'unfriendly'], answer: 3,
          explain: R`**hostile** は「敵意のある、非友好的な」で、unfriendly に近い意味です。「一度もあいさつしなかった」という内容と合います。generous は「気前のよい」、curious は「好奇心の強い」、talkative は「おしゃべりな」で、あいさつさえしない隣人のようすには合いません。`
        },
        {
          label: '(4)',
          q: R`He tried to __conceal__ his disappointment by smiling.`,
          type: 'choice', choices: ['express', 'hide', 'explain', 'forget'], answer: 1,
          explain: R`**conceal** は「〜を隠す」で、hide と同じ意味です。「笑顔を見せてがっかりした気持ちを隠そうとした」という文です。express（〜を表す）は反対のはたらき、explain は「〜を説明する」、forget は「〜を忘れる」で、意味が合いません。`
        },
        {
          label: '(5)',
          q: R`The damage to the car was not an accident; it was __deliberate__.`,
          type: 'choice', choices: ['intentional', 'temporary', 'sudden', 'minor'], answer: 0,
          explain: R`**deliberate** は形容詞で「故意の、意図的な」を表し、intentional と同じ意味です。「事故ではなく、故意だった」という文脈に合います。temporary は「一時的な」、sudden は「突然の」、minor は「小さい、軽微な」で、not an accident の言い換えにはなりません。（deliberate には「慎重な、ゆっくりした」の意味もありますが、ここでは文脈から「故意の」と判断します。）`
        }
      ],
      solution: [
        {
          t: '知らない語でも、文脈から意味を絞る',
          n: R`(1) は「嵐のせいで〜せざるをえなかった」→ 計画をやめた、(3) は「あいさつもしなかった」→ 友好的でない、(5) は「事故ではない」→ わざとだ、のように、文の中のヒントから意味を推測します。下線部の語を知らなくても、選択肢のうち文脈に合うものは 1 つに絞れます。`,
          easy: R`下線部の意味が思い出せないときは、「この文で作者が言いたいこと」を日本語で考えてみましょう。たとえば (2) は「そんな〜な間違いは気にしないで」と励ましている文なので、「大したことのない」という意味が入りそうだと予想できます。`,
          pro: R`同意語問題では、選択肢が「反対の意味の語」や「文脈に合わない語」で固められています。確信が持てない場合は、消去法で文脈に合わないものから外します。`
        },
        {
          t: '同意語は「中心のイメージ」でまとめて覚える',
          n: R`abandon = give up（捨てる）、trivial = unimportant（重要でない）、hostile = unfriendly（友好的でない）、conceal = hide（隠す）、deliberate = intentional（わざとの）。英語どうしの言い換えで覚えておくと、長文の中で知らない語に出会っても、近い意味の語に置き換えて読み進められます。`,
          lv: 2
        },
        {
          t: '多義語に注意する',
          n: R`deliberate は形容詞で「故意の、慎重な」、動詞（発音が異なる）で「熟考する」の意味もあります。1 つの語に複数の意味があるときは、文脈にいちばん合うものを選びます。`,
          lv: 2
        }
      ],
      tags: ['同意語', '語彙', '文脈から意味を推測']
    },

    /* ---------- 語彙 3: 英語の定義から単語を書く ---------- */
    {
      id: 'e-mid-vocab-03',
      subject: 'english',
      level: 'mid',
      unit: 'e-vocab',
      title: '語彙：英語の定義から単語を書く',
      source: SRC,
      time: 6,
      body: R`次の (1)〜(5) は、それぞれある英単語の意味を英語で説明したものです。かっこ内に示された文字で始まる英単語 1 語を答えなさい。`,
      fig: null,
      passage: null,
      parts: [
        {
          label: '(1)',
          q: R`( a... ) = a person in your family who lived a very long time ago, long before your grandparents were born`,
          type: 'text', answer: 'ancestor', hint: '最初の 1 文字も含めて、単語全体を半角英字で入力',
          explain: R`「ずっと昔に生きていた家族の一員（祖父母が生まれる前の人）」とあるので、**ancestor**（祖先）です。反対の意味の語は descendant（子孫）です。語の成り立ちは ante-（前に）+ cede（行く）で、「先に行った人」というイメージです。`
        },
        {
          label: '(2)',
          q: R`( t... ) = to accept a situation or behavior that you do not like, without trying to stop it or complaining about it`,
          type: 'text', answer: 'tolerate', hint: '最初の 1 文字も含めて、単語全体を半角英字で入力',
          explain: R`「好まない状況や行動を、やめさせようとしたり文句を言ったりせずに受け入れる」という説明から、**tolerate**（〜を我慢する、〜を許容する）です。名詞は tolerance（寛容、我慢）、形容詞は tolerant（寛容な）です。`
        },
        {
          label: '(3)',
          q: R`( e... ) = a sudden and serious situation that is dangerous and needs quick action`,
          type: 'text', answer: 'emergency', hint: '最初の 1 文字も含めて、単語全体を半角英字で入力',
          explain: R`「突然起こる深刻で危険な状況で、すぐに行動が必要なもの」という説明から、**emergency**（緊急事態、非常時）です。in an emergency（緊急の場合には）、emergency exit（非常口）の形でよく使われます。つづりは e-m-e-r-g-e-n-c-y です。`
        },
        {
          label: '(4)',
          q: R`( p... ) = to say what you think will happen in the future, usually on the basis of facts or experience`,
          type: 'text', answer: 'predict', hint: '最初の 1 文字も含めて、単語全体を半角英字で入力',
          explain: R`「これから何が起こるかを、事実や経験にもとづいて言う」という説明から、**predict**（〜を予測する）です。名詞は prediction（予測）です。pre-（前もって）+ dict（言う）という成り立ちで、「前もって言う」が原義です。`
        },
        {
          label: '(5)',
          q: R`( v... ) = a person who does a job or helps other people because he or she wants to, not because he or she is paid`,
          type: 'text', answer: 'volunteer', hint: '最初の 1 文字も含めて、単語全体を半角英字で入力',
          explain: R`「給料のためではなく、自分がしたいという気持ちから仕事をしたり人を助けたりする人」という説明から、**volunteer**（ボランティア、志願者）です。動詞として「進んで〜する」の意味もあります（volunteer to do）。つづりの最後は -eer です。`
        }
      ],
      solution: [
        {
          t: '定義文の出だしで「答えの品詞と種類」をつかむ',
          n: R`英語の定義は、「a person who ~」（人を表す名詞）、「to do ~」（動詞）、「a ... situation」（状況を表す名詞）のように、答えの品詞と種類を最初に示します。(1)(5) は人、(2)(4) は動詞、(3) は状況を表す名詞です。`,
          easy: R`英英辞典の説明は、「大きな分類」を先に言ってから「どんな特徴があるか」を足す形です。日本語でも「望遠鏡とは、遠くの物を大きく見せる器具である」と言うとき、まず「器具」と分類しますね。これと同じ順序で読み取りましょう。`,
          pro: R`この形式の問題では、答えを「頭文字 + 品詞 + 説明のキーワード 2〜3 個」で決めます。キーワードは (2) accept / not like、(3) sudden / quick action、(4) future / facts のように拾います。`
        },
        {
          t: '頭文字のヒントと、説明のキーワードを合わせる',
          n: R`頭文字が与えられているので、その文字で始まる語の中から候補を考えます。(2) は t で始まり「我慢する」→ tolerate、(4) は p で始まり「未来を言う」→ predict と決まります。`,
          lv: 2
        },
        {
          t: 'つづりを正確に書く',
          n: R`ancestor（× ancester）、emergency（× emergancy）、volunteer（× volunter）のように、母音の部分でつづりの間違いが起こりやすい語です。入力して提出する前に、語の最後の文字まで見直しましょう。`,
          lv: 2
        }
      ],
      tags: ['英英定義', '語彙', 'つづり']
    },

    /* ---------- 熟語 1: 空所補充 ---------- */
    {
      id: 'e-mid-idiom-01',
      subject: 'english',
      level: 'mid',
      unit: 'e-idiom',
      title: '熟語：空所補充（句動詞）',
      source: SRC,
      time: 5,
      body: R`次の (1)〜(5) の英文の空所に入れるのに最も適切なものを、それぞれ選びなさい。`,
      fig: null,
      passage: null,
      parts: [
        {
          label: '(1)',
          q: R`The company has decided to ( ) its plan to build a new factory abroad, because the cost would be too high.`,
          type: 'choice', choices: ['carry out', 'give up', 'take over', 'set up'], answer: 1,
          explain: R`**give up ~**（〜をあきらめる）です。「費用が高すぎるので海外に新工場を建てる計画を断念する」という内容です。carry out（〜を実行する）は because 以下の理由と矛盾します。take over は「〜を引き継ぐ」、set up は「〜を設立する」で、plan を目的語にしても文意が通りません。`
        },
        {
          label: '(2)',
          q: R`I can't ( ) with his rude attitude any longer.`,
          type: 'choice', choices: ['catch up', 'come up', 'keep up', 'put up'], answer: 3,
          explain: R`**put up with ~**（〜を我慢する）です。「彼の失礼な態度にはもう我慢できない」という意味になります。catch up with ~ は「〜に追いつく」、come up with ~ は「〜を思いつく」、keep up with ~ は「〜に遅れずについていく」で、いずれも「態度を我慢する」意味にはなりません。4 つとも up ... with の形なので、with の後ろに続く語（我慢する対象）で見分けます。`
        },
        {
          label: '(3)',
          q: R`She is easy to talk to and gets ( ) with everyone in her class.`,
          type: 'choice', choices: ['along', 'over', 'through', 'away'], answer: 0,
          explain: R`**get along with ~**（〜と仲よくやっていく）です。「話しやすくて、クラスのだれとでも仲よくやっている」という意味になります。get over ~ は「〜を乗り越える」、get through ~ は「〜を終える、切り抜ける」、get away with ~ は「〜をうまく逃れる」で、with everyone の前には合いません。`
        },
        {
          label: '(4)',
          q: R`It took her a long time to ( ) the shock of her father's death.`,
          type: 'choice', choices: ['get on', 'get away', 'get over', 'get off'], answer: 2,
          explain: R`**get over ~**（〜から立ち直る、〜を乗り越える）です。「父親の死のショックから立ち直るのに長い時間がかかった」という意味になります。get on は「〜に乗る、うまくやる」、get away は「逃げる、離れる」、get off は「〜から降りる」で、the shock を直接の目的語にとる形は取れません。`
        },
        {
          label: '(5)',
          q: R`The new law is expected to ( ) a great change in the way people work.`,
          type: 'choice', choices: ['bring up', 'bring about', 'bring out', 'bring back'], answer: 1,
          explain: R`**bring about ~**（〜をもたらす、引き起こす）です。「新しい法律は人々の働き方に大きな変化をもたらすと期待されている」という意味になります。bring up は「〜を育てる、〜を持ち出す」、bring out は「〜を引き出す、〜を発売する」、bring back は「〜を持ち帰る、〜を思い出させる」で、change を目的語にして「変化を起こす」意味にはなりません。`
        }
      ],
      solution: [
        {
          t: '空所を含む「動詞 + 副詞（前置詞）」の型を見つける',
          n: R`(1) give up（あきらめる）、(2) put up with（我慢する）、(3) get along with（仲よくやる）、(4) get over（立ち直る）、(5) bring about（もたらす）。動詞と副詞・前置詞の組合せで意味が決まる熟語は、組合せごと覚えておく必要があります。`,
          easy: R`熟語は、1 語ずつ訳しても意味が出てきません（give は「与える」、up は「上へ」でも、give up は「あきらめる」）。「かたまりで 1 つの意味」と考えて、例文ごと覚えましょう。`,
          pro: R`4 択がすべて「同じ動詞 + 異なる副詞」か「異なる動詞 + 同じ副詞」の形のときは、前後の語（目的語・前置詞 with など）を最初に確認すると、2 択まで絞れます。`
        },
        {
          t: '似た形の熟語を区別する',
          n: R`up ... with の形をとる熟語は、put up with（我慢する）、catch up with（追いつく）、keep up with（遅れずについていく）、come up with（思いつく）と多くあります。get の熟語も、get along with（仲よくやる）、get over（乗り越える）、get through（終える、切り抜ける）、get away with（罰を逃れる）と、意味が大きく異なります。`,
          lv: 2
        },
        {
          t: '目的語・主語との相性で確かめる',
          n: R`(4) は目的語が the shock なので、「ショックから立ち直る」の get over が最も自然です。(5) は a great change が目的語なので、「変化をもたらす」の bring about を選びます。目的語との相性を確認することで、熟語の意味を確実に判断できます。`,
          lv: 2
        }
      ],
      tags: ['句動詞', '熟語', '空所補充']
    },

    /* ---------- 熟語 2: 下線部に近い意味 ---------- */
    {
      id: 'e-mid-idiom-02',
      subject: 'english',
      level: 'mid',
      unit: 'e-idiom',
      title: '熟語：下線部に近い意味',
      source: SRC,
      time: 5,
      body: R`次の (1)〜(5) の英文の下線部の熟語に最も近い意味のものを、それぞれ選びなさい。`,
      fig: null,
      passage: null,
      parts: [
        {
          label: '(1)',
          q: R`My grandfather __takes after__ his father in many ways.`,
          type: 'choice', choices: ['visits', 'admires', 'resembles', 'follows'], answer: 2,
          explain: R`**take after ~** は「〜に似ている」（親や祖先に性格・外見が似る）で、resemble と同じ意味です。「祖父は多くの点で自分の父親に似ている」となります。follow は「〜のあとについていく」、visit は「〜を訪ねる」、admire は「〜を尊敬する」で、血縁による「似ている」とは別の意味です。`
        },
        {
          label: '(2)',
          q: R`The committee will __look into__ the cause of the accident next week.`,
          type: 'choice', choices: ['examine', 'ignore', 'report', 'forget'], answer: 0,
          explain: R`**look into ~** は「〜を調べる」で、examine（〜を調査する）と同じ意味です。「委員会は来週、事故の原因を調査する」となります。ignore は「〜を無視する」、report は「〜を報告する」、forget は「〜を忘れる」で、原因を「調べる」意味にはなりません。`
        },
        {
          label: '(3)',
          q: R`We must __make up for__ the lost time by working harder.`,
          type: 'choice', choices: ['take care of', 'compensate for', 'get rid of', 'look forward to'], answer: 1,
          explain: R`**make up for ~** は「〜の埋め合わせをする」で、compensate for と同じ意味です。「懸命に働いて失われた時間の埋め合わせをしなければならない」となります。take care of は「〜の世話をする」、get rid of は「〜を取り除く」、look forward to は「〜を楽しみに待つ」で、意味が合いません。`
        },
        {
          label: '(4)',
          q: R`He __turned down__ the offer because the salary was too low.`,
          type: 'choice', choices: ['considered', 'accepted', 'explained', 'rejected'], answer: 3,
          explain: R`**turn down ~** は「〜を断る、拒否する」で、reject と同じ意味です。「給料が低すぎたので、彼はその申し出を断った」となります。accept は反対の意味、consider は「〜をよく考える」、explain は「〜を説明する」で、because 以下の理由につながりません。（turn down には「音量を下げる」の意味もあります。）`
        },
        {
          label: '(5)',
          q: R`A fire __broke out__ in the middle of the night.`,
          type: 'choice', choices: ['was extinguished', 'spread widely', 'began suddenly', 'was noticed'], answer: 2,
          explain: R`**break out** は、戦争・火事・病気などが「突然起こる」ことを表し、begin suddenly と同じ意味です。「真夜中に火事が起こった」となります。was extinguished は「消された」（put out に近い意味で、反対方向の動作）、spread widely は「広がった」、was noticed は「気づかれた」で、break out の意味ではありません。`
        }
      ],
      solution: [
        {
          t: '熟語の意味を、動詞と副詞のイメージから推測する',
          n: R`take after（あとから取る → 似る）、look into（中を見る → 調べる）、make up for（〜のために埋める → 埋め合わせる）、turn down（下に向ける → 断る）、break out（外に破れ出る → 突然起こる）。動詞の基本の意味と、副詞（up, down, out, into など）が表すイメージを組み合わせると、意味を思い出しやすくなります。`,
          easy: R`out は「外へ出る」、down は「下げる」、into は「中へ」のように、副詞には基本のイメージがあります。break out は、「閉じ込められていたものが外へ破れ出る」→「火事や戦争が突然起こる」と考えると覚えやすくなります。`,
          pro: R`言い換え問題は、「動詞 1 語」で書き直せる熟語（take after = resemble、turn down = reject、look into = investigate など）をセットで覚えておくと、長文の中でもすぐに処理できます。`
        },
        {
          t: '選択肢の中の「反対の意味」を確認する',
          n: R`選択肢には、反対の意味の語（turn down に対する accepted など）や、同じ動詞を使った別の熟語の意味（take care of など）がよく混ぜてあります。文脈から「肯定か否定か」「始まるか終わるか」の方向を確認してから選びましょう。`,
          lv: 2
        },
        {
          t: '多義の熟語に注意',
          n: R`turn down は「〜を断る」のほかに「（音量・火力）を下げる」の意味があります。break out も「火事・戦争が起こる」のほかに「脱走する」の意味があります。文脈で意味を判断する習慣をつけましょう。`,
          lv: 3
        }
      ],
      tags: ['熟語', '言い換え', '句動詞']
    },

    /* ---------- 文法 1: 時制 ---------- */
    {
      id: 'e-mid-grammar-01',
      subject: 'english',
      level: 'mid',
      unit: 'e-grammar',
      title: '文法：時制と完了形',
      source: SRC,
      time: 6,
      body: R`次の (1)〜(5) の英文の空所に入れるのに最も適切なものを、それぞれ選びなさい。`,
      fig: null,
      passage: null,
      parts: [
        {
          label: '(1)',
          q: R`I will call you as soon as I ( ) at the station.`,
          type: 'choice', choices: ['will arrive', 'arrived', 'arrive', 'would arrive'], answer: 2,
          explain: R`**arrive** が入ります。as soon as ~（〜するとすぐに）は時を表す副詞節をつくる接続詞で、**時や条件を表す副詞節の中では、未来のことでも現在形で表します**。主節が I will call と未来でも、as soon as 以下は will arrive ではなく arrive です。arrived（過去形）は、未来の話には使えません。`
        },
        {
          label: '(2)',
          q: R`By the time you come back, I ( ) the report.`,
          type: 'choice', choices: ['will have finished', 'finish', 'finished', 'would finish'], answer: 0,
          explain: R`**will have finished**（未来完了）が入ります。by the time ~（〜するまでには）は「その時点までに動作が完了している」ことを表すので、主節には will have + 過去分詞を使います。なお、by the time you come back の中は、時を表す副詞節なので現在形（come）になっています。`
        },
        {
          label: '(3)',
          q: R`It ( ) since early this morning, so the ground is still wet.`,
          type: 'choice', choices: ['rains', 'has been raining', 'is raining', 'rained'], answer: 1,
          explain: R`**has been raining**（現在完了進行形）が入ります。since early this morning（今朝早くから）は「過去のある時点から現在まで」の継続を表すので、現在完了系の時制を使います。進行形にして「ずっと降り続けている」動作の継続を強調しています。rains / is raining / rained は、いずれも since 〜 と一緒には使えません。`
        },
        {
          label: '(4)',
          q: R`When Mr. Ito retired last year, he ( ) at the same company for forty years.`,
          type: 'choice', choices: ['works', 'has worked', 'would work', 'had worked'], answer: 3,
          explain: R`**had worked**（過去完了）が入ります。「退職した（過去の時点）までの 40 年間」という、過去のある時点までの継続を表すので、過去完了にします。has worked は現在とつながる現在完了で、last year のような明確な過去を表す語句とは一緒に使えません。works は現在形、would work は過去の習慣や仮定を表す形で、文意に合いません。`
        },
        {
          label: '(5)',
          q: R`Hardly had I closed the door ( ) I realized that I had left my key inside.`,
          type: 'choice', choices: ['when', 'than', 'while', 'until'], answer: 0,
          explain: R`**when** が入ります。**Hardly[Scarcely] + had + 主語 + 過去分詞 ~ when[before] + 主語 + 過去形 ...** で「〜するかしないうちに…した」という意味を表します（否定の副詞 hardly が文頭に出るので、had I closed と倒置になっています）。than は **No sooner had + 主語 + 過去分詞 ~ than ...** の形で使う語で、hardly とは組み合わせません。while は「〜の間」、until は「〜まで」で、意味が合いません。`
        }
      ],
      solution: [
        {
          t: '時制を決める手がかりの語句を探す',
          n: R`(1) as soon as（時の副詞節）、(2) by the time ~（〜までには）、(3) since early this morning（今朝からずっと）、(4) when Mr. Ito retired last year（過去の時点）、(5) Hardly had（否定の副詞の倒置）。まず、時を表す語句と接続詞に印をつけて、どの時制の問題かを判断します。`,
          easy: R`時制の問題は、「いつの話か」を最初につかむのがコツです。「今朝から（since）」なら「今まで続いている」、「去年（last year）」なら「過去の話」というふうに、時を表す語句を手がかりに考えましょう。`,
          pro: R`時制問題は次の 4 パターンで整理すると速く処理できます。(a) 時・条件の副詞節 → 現在形が未来を表す、(b) by the time / by + 時点 → 完了形、(c) since / for ~ → 現在完了（進行形）、(d) 過去の基準点より前 → 過去完了。`
        },
        {
          t: '時・条件の副詞節では、現在形が未来を表す',
          n: R`when / if / as soon as / before / after / until などが導く副詞節では、未来の内容でも現在形を使います（(1) arrive、(2) の by the time you come back）。ただし、主節は未来形（will）のままです。`,
          lv: 2
        },
        {
          t: '完了形の使い分け',
          n: R`現在完了（has been raining）は「現在とつながっている」、過去完了（had worked）は「過去のある時点より前のこと」、未来完了（will have finished）は「未来のある時点までに完了している」ことを表します。last year などの明確な過去を表す語句とは、現在完了を一緒に使えません。`,
          lv: 2
        }
      ],
      tags: ['時制', '現在完了', '過去完了', '未来完了', '倒置']
    },

    /* ---------- 文法 2: 関係詞 ---------- */
    {
      id: 'e-mid-grammar-02',
      subject: 'english',
      level: 'mid',
      unit: 'e-grammar',
      title: '文法：関係詞',
      source: SRC,
      time: 6,
      body: R`次の (1)〜(5) の英文の空所に入れるのに最も適切なものを、それぞれ選びなさい。`,
      fig: null,
      passage: null,
      parts: [
        {
          label: '(1)',
          q: R`This is the village ( ) my grandfather was born.`,
          type: 'choice', choices: ['which', 'that', 'where', 'what'], answer: 2,
          explain: R`**where** が入ります。先行詞 the village は場所で、後ろの my grandfather was born は主語・動詞がそろった完全な文です（born の後ろに in the village を補う必要がありません）。このように後ろが完全な文のときは、関係代名詞（which, that）ではなく**関係副詞 where**（= in which）を使います。what は先行詞を含む語なので、先行詞 the village の後には置けません。`
        },
        {
          label: '(2)',
          q: R`The man ( ) I thought was honest turned out to be a thief.`,
          type: 'choice', choices: ['whom', 'who', 'which', 'whose'], answer: 1,
          explain: R`**who** が入ります。I thought（挿入された節）を取り除くと The man ( ) was honest となり、空所は was の主語です。したがって主格の who を選びます。I thought の後ろに続くので whom と間違えやすいのですが、**I think / I thought / I believe などの挿入節は、関係詞の格に影響しません**。whose は後ろに名詞が必要で、which は人には使いません。`
        },
        {
          label: '(3)',
          q: R`( ) surprised everyone was that he had quit his job without telling anybody.`,
          type: 'choice', choices: ['That', 'It', 'Which', 'What'], answer: 3,
          explain: R`**What** が入ります。what は「〜するもの・こと」という意味の、先行詞を含む関係代名詞で、What surprised everyone で「みんなを驚かせたこと」という名詞節をつくり、文の主語になります。That は接続詞なので、surprised の主語が欠けてしまいます。Which は先行詞が必要で、It は主語を 2 つ作ることができません。`
        },
        {
          label: '(4)',
          q: R`Mr. Tanaka, for ( ) I have worked for twenty years, will retire next month.`,
          type: 'choice', choices: ['whom', 'who', 'whose', 'which'], answer: 0,
          explain: R`**whom** が入ります。前置詞 for の目的語になるので目的格です。for whom I have worked for twenty years は「私が 20 年間（その人のもとで）働いてきた」という意味で、Mr. Tanaka を補足説明する非制限用法の節です。前置詞の直後に who は置けません。whose は後ろに名詞が必要で、which は人を先行詞にできません。`
        },
        {
          label: '(5)',
          q: R`He told me that he was sick, ( ) was not true.`,
          type: 'choice', choices: ['which', 'that', 'what', 'it'], answer: 0,
          explain: R`**which** が入ります。カンマの後ろの which は、前の節 he was sick の内容全体を先行詞とする**非制限用法**で、「彼は病気だと言ったが、それは本当ではなかった」という意味です。that は非制限用法（カンマの後）では使えず、what は先行詞を含むのでカンマの後には置けません。it は代名詞なので、接続詞なしに 2 つの節をつなぐことができません。`
        }
      ],
      solution: [
        {
          t: '空所のあとの形から、関係詞の種類を決める',
          n: R`関係詞の問題は、(a) 先行詞は人か物か場所か、(b) 空所のあとが「主語が欠けている」「目的語が欠けている」「完全な文」のどれか、の 2 点で決まります。(1) は場所で後ろが完全 → where、(2) は後ろの主語が欠けている → who、(4) は for の目的語 → whom、(5) は前の節全体が先行詞 → which です。`,
          easy: R`関係詞は、「2 つの文を 1 つにつなぐ接着剤」です。たとえば (2) は The man turned out to be a thief. と He was honest.（と私は思った）の 2 文で、共通の The man / He を who に置き換えてつないだ形です。空所に入る語は、その「置き換えられた語」の役目（主語か目的語か所有か）で決まります。`,
          pro: R`関係詞は「先行詞の種類 → 空所のあとの欠け方」の順に 5 秒で判断します。選択肢に what と which / that が並んでいるときは、先行詞の有無で決まります。`
        },
        {
          t: 'what と関係代名詞のちがい',
          n: R`what は先行詞を含み（= the thing which）、「〜するもの・こと」という名詞節をつくります。(3) の What surprised everyone は、文の主語になっています。先行詞が前にある場合は what は使えず、which / that / who などを使います。`,
          lv: 2
        },
        {
          t: '挿入節 I thought に惑わされない',
          n: R`(2) の I thought は、関係詞節の中に挿入された語句です。これを消して The man who was honest と読み直すと、who が主語の位置にあることがわかります。同様に、(5) のカンマのあとの which は、前の節全体（He told me that he was sick）の内容を受けています。`,
          lv: 2
        }
      ],
      tags: ['関係代名詞', '関係副詞', 'what', '非制限用法', '前置詞+関係詞']
    },

    /* ---------- 文法 3: 仮定法 ---------- */
    {
      id: 'e-mid-grammar-03',
      subject: 'english',
      level: 'mid',
      unit: 'e-grammar',
      title: '文法：仮定法',
      source: SRC,
      time: 6,
      body: R`次の (1)〜(5) の英文の空所に入れるのに最も適切なものを、それぞれ選びなさい。`,
      fig: null,
      passage: null,
      parts: [
        {
          label: '(1)',
          q: R`If I ( ) you, I would accept the offer without hesitation.`,
          type: 'choice', choices: ['were', 'am', 'will be', 'had been'], answer: 0,
          explain: R`**were** が入ります。主節が would accept なので、現在の事実に反する仮定を表す**仮定法過去**です。if 節では動詞を過去形にし、be 動詞は主語にかかわらず were を使うのが基本です（口語では If I was ~ も使われます）。am / will be は現実にありうることを述べる形で、would accept とは合いません。had been は仮定法過去完了で、主節が would have accepted の形になるときに使います。`
        },
        {
          label: '(2)',
          q: R`If she had left home a little earlier, she ( ) the first train.`,
          type: 'choice', choices: ['would catch', 'would have caught', 'will catch', 'had caught'], answer: 1,
          explain: R`**would have caught** が入ります。if 節が had left（過去完了）なので、過去の事実に反する仮定を表す**仮定法過去完了**です。主節は would + have + 過去分詞にして、「（あのとき）もう少し早く家を出ていれば、始発に間に合っただろうに」という意味になります。would catch は仮定法過去（現在の仮定）、will catch は単なる未来の予想、had caught は主節の形としては使えません。`
        },
        {
          label: '(3)',
          q: R`I wish I ( ) more time to talk with my grandmother when she was alive.`,
          type: 'choice', choices: ['have', 'had', 'had had', 'would have'], answer: 3,
          explain: R`**had had** が入ります。I wish + 仮定法で「〜であればいいのに」という願望を表します。現在の願望には過去形、**過去の事実に反する願望（〜だったらよかったのに）には過去完了**を使います。when she was alive（祖母が生きていたとき）は過去なので、had + had（have の過去分詞）にします。`
        },
        {
          label: '(4)',
          q: R`She spends money as if she ( ) a millionaire, although she is only a student.`,
          type: 'choice', choices: ['is', 'will be', 'were', 'had been'], answer: 2,
          explain: R`**were** が入ります。as if（まるで〜であるかのように）の後ろは、事実と反対の内容のとき仮定法を使います。although she is only a student（実際はただの学生）とあるので、「まるで億万長者であるかのように」は仮定法過去の were です。主節の動詞（spends）と同じ時点の話なので、過去完了ではなく過去形（be 動詞は were）にします。`
        },
        {
          label: '(5)',
          q: R`( ) it not been for your advice, I would have made a terrible mistake.`,
          type: 'choice', choices: ['If', 'Were', 'Unless', 'Had'], answer: 3,
          explain: R`**Had** が入ります。Had it not been for ~ は If it had not been for ~（もし〜がなかったなら）の if を省略して、主語と助動詞を倒置した形です。主節が would have made（過去の仮定）なので、過去完了の Had を使います。Were it not for ~ は現在の仮定を表す形で、ここには合いません。If や Unless のあとに it not been を続けることはできません。`
        }
      ],
      solution: [
        {
          t: '仮定法の 3 つの形を整理する',
          n: R`(a) 仮定法過去（現在の事実に反する仮定）: If + 主語 + 過去形, 主語 + would + 原形。(b) 仮定法過去完了（過去の事実に反する仮定）: If + 主語 + had + 過去分詞, 主語 + would have + 過去分詞。(c) if の省略による倒置: Had + 主語 + 過去分詞 ~, ... / Were + 主語 ~, ...。`,
          easy: R`仮定法は、「本当のこと」ではなく「ありえないこと・実現しなかったこと」を想像して話すときの形です。「現実から 1 つ時制を過去にずらす」と覚えましょう。現在のことは過去形（were）、過去のことは過去完了（had + 過去分詞）で表します。`,
          pro: R`主節（would / would have）か if 節のどちらか一方でも見えれば、もう片方が決まります。倒置（Had / Were / Should が文頭）が出たら、if を補って読み直します。`
        },
        {
          t: '時を表す語句で、仮定法の時制を決める',
          n: R`(3) when she was alive は過去を表すので、wish の後ろは過去完了（had had）です。(4) although she is only a student は現在の事実なので、as if の後ろは過去形（were）です。願望・比喩の仮定法も、「いつの話か」で時制を選びます。`,
          lv: 2
        },
        {
          t: 'if を省略した倒置',
          n: R`If it had not been for ~ → Had it not been for ~ のように、if を省略すると、主語と had / were / should が倒置されます。文頭に Had / Were / Should が来たら、仮定法の倒置の可能性を考えましょう。`,
          lv: 2
        }
      ],
      tags: ['仮定法過去', '仮定法過去完了', 'I wish', 'as if', '倒置']
    },

    /* ---------- 文法 4: 準動詞 ---------- */
    {
      id: 'e-mid-grammar-04',
      subject: 'english',
      level: 'mid',
      unit: 'e-grammar',
      title: '文法：不定詞・動名詞・分詞',
      source: SRC,
      time: 6,
      body: R`次の (1)〜(5) の英文の空所に入れるのに最も適切なものを、それぞれ選びなさい。`,
      fig: null,
      passage: null,
      parts: [
        {
          label: '(1)',
          q: R`She suggested ( ) a taxi because it had started to rain.`,
          type: 'choice', choices: ['to take', 'taking', 'take', 'to taking'], answer: 1,
          explain: R`**taking** が入ります。suggest は動名詞（-ing）を目的語にとる動詞で、suggest + doing で「〜することを提案する」です（that 節を使うなら suggested that she take a taxi と言えます）。不定詞は目的語にとれません。enjoy, finish, avoid, mind, give up, put off, consider, deny, admit なども、動名詞だけを目的語にとる動詞です。`
        },
        {
          label: '(2)',
          q: R`I remember ( ) the door before I left, so it must still be locked.`,
          type: 'choice', choices: ['locking', 'to lock', 'lock', 'to be locking'], answer: 0,
          explain: R`**locking** が入ります。remember doing は「〜したことを覚えている」（過去の行為）、remember to do は「忘れずに〜する」（これからの行為）という違いがあります。ここは「出かける前にドアに鍵をかけたことを覚えている」ので locking です。to lock にすると「（これから）忘れずに鍵をかける」という意味になり、before I left と合いません。`
        },
        {
          label: '(3)',
          q: R`The teacher made the students ( ) the whole story aloud.`,
          type: 'choice', choices: ['to read', 'reading', 'read', 'to have read'], answer: 2,
          explain: R`**read** が入ります。make + O + 原形不定詞（動詞の原形）で「O に〜させる」（使役）を表します。to read や reading にはなりません。受け身にすると The students were made to read ~ となり、to が現れる点も覚えておきましょう。let・have・make は原形不定詞をとる使役動詞で、get は to 不定詞をとります。`
        },
        {
          label: '(4)',
          q: R`( ) from a distance, the building looks like a ship.`,
          type: 'choice', choices: ['See', 'Seeing', 'To see', 'Seen'], answer: 3,
          explain: R`**Seen** が入ります。分詞構文で、意味上の主語 the building と see の関係が「建物は（人に）見られる」という受け身なので、過去分詞 Seen にします。Seeing from a distance だと「建物が遠くから見る」という能動の意味になってしまいます。もとの形は When it is seen from a distance です。`
        },
        {
          label: '(5)',
          q: R`He is said ( ) a famous pianist when he was young.`,
          type: 'choice', choices: ['to have been', 'to be', 'being', 'having been'], answer: 0,
          explain: R`**to have been** が入ります。He is said to ~ は It is said that he ~（彼は〜だと言われている）の書き換えです。「言われている」時点（現在）より、ピアニストだったとき（when he was young）のほうが前なので、完了形の不定詞 to have been を使います。`
        }
      ],
      solution: [
        {
          t: '動詞の語法を確認する',
          n: R`(1) suggest は doing をとる、(2) remember は doing と to do で意味が変わる、(3) make は原形不定詞をとる（使役）、(5) be said to do の形。動詞のあとにどの形が来るかは、動詞ごとに決まっています。`,
          easy: R`「動詞 + 〜ing」「動詞 + to 〜」の形は、動詞ごとにセットで決まっています。たとえば enjoy は enjoy playing（○）、enjoy to play（×）と、-ing だけです。例文で覚えましょう。`,
          pro: R`-ing だけをとる動詞（enjoy, finish, avoid, mind, give up, put off, consider, suggest など）と、to 不定詞だけをとる動詞（want, hope, decide, plan, refuse, promise など）を、グループごとにまとめて覚えておくと、4 択を一瞬で絞れます。`
        },
        {
          t: '分詞構文は、主語との関係（能動・受動）で決める',
          n: R`(4) 分詞の意味上の主語は the building です。建物は「見る」のではなく「見られる」ので、過去分詞 Seen を使います。主語が「〜する」なら現在分詞、「〜される」なら過去分詞と判断します。`,
          lv: 2
        },
        {
          t: '不定詞の「完了形」で時のずれを表す',
          n: R`(5) is said to have been ~ は、「言われている」時点より前のことを表します。述語動詞と同じ時点なら to be、それより前のことなら to have + 過去分詞を使います。`,
          lv: 2
        }
      ],
      tags: ['動名詞', '不定詞', '分詞構文', '使役動詞', '語法']
    },

    /* ---------- 整序 1: 基本構文 ---------- */
    {
      id: 'e-mid-struct-01',
      subject: 'english',
      level: 'mid',
      unit: 'e-struct',
      title: '整序：間接疑問・比較・分詞',
      source: SRC,
      time: 8,
      body: R`次の (1)〜(4) の日本語の意味になるように、与えられた語を並べかえて英文を完成させなさい。文頭に来る語は大文字で始めてあります。`,
      fig: null,
      passage: null,
      parts: [
        {
          label: '(1)',
          q: R`彼がなぜその会議を欠席したのか、だれも知らない。`,
          type: 'order',
          words: ['why', 'absent', 'Nobody', 'the', 'from', 'he', 'meeting', 'was', 'knows'],
          answer: 'Nobody knows why he was absent from the meeting',
          explain: R`**間接疑問**（疑問詞 + 主語 + 動詞）の問題です。Nobody knows のあとに、why he was absent from the meeting を続けます。間接疑問の中は疑問文の語順（why was he ~）ではなく、平叙文の語順（why he was ~）にするのがポイントです。be absent from ~ は「〜を欠席している」という意味です。`
        },
        {
          label: '(2)',
          q: R`練習すればするほど、あなたの英語は上達する。`,
          type: 'order',
          words: ['better', 'you', 'The', 'becomes', 'practice', 'your', 'the', 'more', 'English'],
          answer: 'The more you practice, the better your English becomes',
          explain: R`**the + 比較級 ~, the + 比較級 ...**（〜すればするほど、ますます…）の形です。「練習する」ほうが条件、「上達する」ほうが結果なので、The more you practice を前半、the better your English becomes を後半に置きます。前半の more は、動詞 practice を修飾する副詞（より多く）として働いています。`
        },
        {
          label: '(3)',
          q: R`窓のそばに立っている少女は、私の妹です。`,
          type: 'order',
          words: ['standing', 'sister', 'The', 'is', 'girl', 'by', 'my', 'window', 'the'],
          answer: 'The girl standing by the window is my sister',
          explain: R`**現在分詞の後置修飾**の問題です。「窓のそばに立っている」が「少女」を後ろから説明するので、The girl standing by the window とまとめ、これが文の主語になります。述語は is my sister です。分詞 1 語だけなら名詞の前に置きますが、standing by the window のように語句がつくときは、名詞の後ろに置きます。`
        },
        {
          label: '(4)',
          q: R`彼女はとても親切な人なので、みんなに好かれている。`,
          type: 'order',
          words: ['kind', 'such', 'She', 'everyone', 'that', 'a', 'person', 'is', 'likes', 'her'],
          answer: 'She is such a kind person that everyone likes her',
          explain: R`**such a(n) + 形容詞 + 名詞 + that ~**（とても…な〜なので、…だ）の形です。名詞 person があるので so ではなく such を使い、such a kind person の語順にします（so を使うなら She is so kind that ~ の形になります）。that 以下は everyone likes her と、主語・動詞のそろった完全な文です。`
        }
      ],
      solution: [
        {
          t: '核になる構文を見つけて、かたまりを作る',
          n: R`まず、(1) 間接疑問 why he was ~、(2) the + 比較級 ~, the + 比較級 ...、(3) 名詞 + 現在分詞 + 修飾語句、(4) such a + 形容詞 + 名詞 + that ~ のように、構文の型を決めます。次に、その型にあてはまる「かたまり」を作り、最後に全体を並べます。`,
          easy: R`整序問題は、単語を 1 つずつ並べるのではなく、「かたまり」を先に作るのがコツです。たとえば (3) なら、standing by the window（窓のそばに立っている）というかたまりを作ってから、girl の後ろにつなげます。`,
          pro: R`文頭の語が決まっているので、その直後に続く語（動詞か、関係詞か、形容詞か）を決めてから、残りの語を構文の型に当てはめます。語の数が 9〜10 語でも、かたまりに分ければ 3〜4 個の部品になります。`
        },
        {
          t: '日本語の語順に引きずられない',
          n: R`(1) の日本語は「なぜ〜か、だれも知らない」の順ですが、英語は Nobody knows why ~ の順です。主語と動詞を先に置き、疑問詞の節をそのあとにまとめます。日本語をそのまま英語に置き換えるのではなく、英語の構文の型に合わせて並べかえましょう。`,
          lv: 2
        },
        {
          t: '並べたあとに見直す',
          n: R`与えられた語をすべて使ったか、文法的に正しいか（動詞の形、主語と動詞の対応、冠詞）を確認します。語が余ったり不足したりするときは、かたまりの作り方を見直します。`,
          lv: 2
        }
      ],
      tags: ['整序', '間接疑問', 'the+比較級', '分詞の後置修飾', 'such ~ that']
    },

    /* ---------- 整序 2: 関係副詞・無生物主語ほか ---------- */
    {
      id: 'e-mid-struct-02',
      subject: 'english',
      level: 'mid',
      unit: 'e-struct',
      title: '整序：関係副詞・感情・間接疑問',
      source: SRC,
      time: 8,
      body: R`次の (1)〜(4) の日本語の意味になるように、与えられた語を並べかえて英文を完成させなさい。文頭に来る語は大文字で始めてあります。`,
      fig: null,
      passage: null,
      parts: [
        {
          label: '(1)',
          q: R`これが、私がこの町を好きな理由です。`,
          type: 'order',
          words: ['the', 'like', 'This', 'town', 'why', 'is', 'I', 'reason', 'this'],
          answer: 'This is the reason why I like this town',
          explain: R`**関係副詞 why**（理由を表す）の問題です。the reason の後ろに why が続き、why 以下は I like this town という完全な文です。This is the reason why I like this town（これが、私がこの町を好きな理由です）となります。the reason を省略した This is why I like this town や、why を省略した This is the reason I like this town という形もよく使われます。`
        },
        {
          label: '(2)',
          q: R`私は、彼が約束を守らなかったことに腹を立てた。`,
          type: 'order',
          words: ['angry', 'promise', 'I', 'that', 'had', 'was', 'kept', 'he', 'his', 'not'],
          answer: 'I was angry that he had not kept his promise',
          explain: R`**感情を表す形容詞 + that 節**（〜ということに…の気持ちだ）の形です。I was angry のあとに、「腹が立った原因」を表す that 節を続けます。「約束を守らなかった」のは腹を立てた時点より前のことなので、that 節の中は過去完了 had not kept にします。keep one's promise は「約束を守る」という意味です。`
        },
        {
          label: '(3)',
          q: R`この写真を見ると、私はいつも子どものころを思い出す。`,
          type: 'order',
          words: ['me', 'of', 'This', 'always', 'my', 'picture', 'reminds', 'childhood'],
          answer: 'This picture always reminds me of my childhood',
          explain: R`**remind A of B**（A に B を思い出させる）の形です。This picture が主語で、「いつも」を表す always は一般動詞 reminds の前に置きます。「この写真を見ると〜を思い出す」という日本語は、英語では「この写真は、私に子どものころを思い出させる」という物を主語にした形（無生物主語）で表します。`
        },
        {
          label: '(4)',
          q: R`彼は、自分がどれほど幸運だったかに気づいていなかった。`,
          type: 'order',
          words: ['lucky', 'He', 'of', 'was', 'how', 'not', 'aware', 'he', 'was'],
          answer: 'He was not aware of how lucky he was',
          explain: R`**be aware of ~**（〜に気づいている）の「〜」の部分に、間接疑問 how lucky he was（どれほど幸運だったか）を置きます。how は形容詞 lucky とセットで how lucky の語順になり、そのあとが he was（主語 + 動詞）です。前置詞 of の後ろには、名詞の働きをする間接疑問を置くことができます。`
        }
      ],
      solution: [
        {
          t: '構文の型を先に決める',
          n: R`(1) the reason why ~（関係副詞）、(2) be angry that ~（感情の形容詞 + that 節）、(3) remind A of B、(4) be aware of ~ + 間接疑問（how + 形容詞 + 主語 + 動詞）。型が決まれば、語の並びはほぼ決まります。`,
          easy: R`与えられた語の中から、まず「動詞」と「それにくっつく語（前置詞や that など）」を探します。(3) なら reminds + me + of のセット、(4) なら aware + of のセットが見つかります。これが文の骨組みです。`,
          pro: R`整序問題は、(a) 文頭の語、(b) 動詞と、動詞が決める形（SVOO、SVC、前置詞など）、(c) 接続詞・関係詞・疑問詞のあとの語順、の 3 点を決めれば、ほぼ正解にたどり着けます。`
        },
        {
          t: '日本語の「〜すると…する」は物を主語にして考える',
          n: R`(3) は「この写真を見ると思い出す」という日本語ですが、英語では This picture reminds me of ~（この写真が私に〜を思い出させる）と物を主語にします。「〜のせいで…になる」「〜のおかげで…できる」のような日本語も、同様に物を主語にした英文にできることが多くあります。`,
          lv: 2
        },
        {
          t: '時制を確認する',
          n: R`(2) の had not kept は、腹を立てた時点（過去）よりも前の出来事なので、過去完了を使います。語順だけでなく、与えられた語（had, was）が、時制の手がかりにもなります。`,
          lv: 2
        }
      ],
      tags: ['整序', '関係副詞', '感情形容詞+that節', 'remind A of B', '間接疑問']
    },

    /* ---------- 会話文 ---------- */
    {
      id: 'e-mid-conv-01',
      subject: 'english',
      level: 'mid',
      unit: 'e-conv',
      title: '会話文：文化祭の出し物',
      source: SRC,
      time: 6,
      body: R`次の会話文を読み、空所 ( 1 )〜( 5 ) に入れるのに最も適切なものを、それぞれ選びなさい。

Yuki: Hi, Ben. Have you decided what to do for the school festival?
Ben: Not yet. Our class can't agree. Some students want to run a café, but others want to put on a play.
Yuki: ( 1 )
Ben: A café is easier, but a play would be more memorable. I can't make up my mind.
Yuki: Why don't you take a vote?
Ben: We did, but the result was a tie. ( 2 )
Yuki: Hmm. Maybe you could do both. A short play in a café, I mean.
Ben: ( 3 ) That would be a great way to bring both groups together!
Yuki: Do you think the teacher will allow it?
Ben: ( 4 ) I'll ask her tomorrow.
Yuki: Good luck! ( 5 )
Ben: Thanks. I will.`,
      fig: null,
      passage: null,
      parts: [
        {
          label: '( 1 )',
          q: R`空所 ( 1 ) に入る最も適切なものを選びなさい。`,
          type: 'choice',
          choices: ['Who is going to the festival?', 'When will the festival be held?', 'Which do you prefer?', 'How much does it cost?'],
          answer: 2,
          explain: R`直後の Ben の発言 A café is easier, but a play would be more memorable. I can't make up my mind. が手がかりです。喫茶店と劇を比べて「決められない」と答えているので、直前の Yuki は「どちらがいい（と思う）？」とたずねたはずです。したがって Which do you prefer? が正解です。make up one's mind は「決心する」の意味です。他の選択肢は、Ben の返答（2 つの案の比較）とつながりません。`
        },
        {
          label: '( 2 )',
          q: R`空所 ( 2 ) に入る最も適切なものを選びなさい。`,
          type: 'choice',
          choices: ["We're all set.", "We're on the same page.", "We're in good shape.", "We're back to square one."],
          answer: 3,
          explain: R`直前の「投票したが、結果は同数だった」が手がかりです。決まらなかったのだから、**be back to square one**（振り出しに戻る）が合います。We're all set は「準備万端だ」、We're on the same page は「同じ考えだ（意見が一致している）」、We're in good shape は「調子がよい」で、投票が同数で決まらなかったという状況には合いません。`
        },
        {
          label: '( 3 )',
          q: R`空所 ( 3 ) に入る最も適切なものを選びなさい。`,
          type: 'choice',
          choices: ["I don't care at all.", "That's not a bad idea.", 'You must be kidding.', 'Never mind.'],
          answer: 1,
          explain: R`Ben は直後に That would be a great way to bring both groups together!（両方のグループをまとめるすばらしい方法だ）と言っているので、Yuki の提案に賛成しているとわかります。That's not a bad idea.（悪くない考えだ）が正解です。I don't care at all.（まったく気にしない）や Never mind.（気にしないで）では、直後の熱心な発言とつながりません。You must be kidding.（冗談でしょう）は、提案への驚きや拒否を表します。`
        },
        {
          label: '( 4 )',
          q: R`空所 ( 4 ) に入る最も適切なものを選びなさい。`,
          type: 'choice',
          choices: ["It's a piece of cake.", "It's none of your business.", "It's hard to say.", "It's too good to be true."],
          answer: 2,
          explain: R`「先生が許可してくれると思う？」という質問に、Ben は「明日、先生に聞いてみる」と続けています。まだ許可されるかどうかわからないので、It's hard to say.（何とも言えない）が合います。It's a piece of cake.（朝飯前だ）、It's none of your business.（あなたには関係ない）、It's too good to be true.（話がうますぎる）は、質問の答えとして成り立ちません。`
        },
        {
          label: '( 5 )',
          q: R`空所 ( 5 ) に入る最も適切なものを選びなさい。`,
          type: 'choice',
          choices: ['Let me know how it goes.', 'Please tell me why.', "I'll be there on time.", 'You should have asked her.'],
          answer: 0,
          explain: R`Yuki の Good luck!（がんばってね）に続けて、Ben は Thanks. I will.（ありがとう、そうするよ）と答えています。I will は、直前の依頼を受けた返事なので、Let me know how it goes.（どうなったか教えてね）が合います。Please tell me why. や I'll be there on time.、You should have asked her. では、I will という返事とつながりません。`
        }
      ],
      solution: [
        {
          t: '会話の流れと場面をつかむ',
          n: R`文化祭の出し物を決められないクラスの Ben に、友人の Yuki が相談に乗っている場面です。「質問 → 答え」「提案 → 反応」「依頼 → 受け答え」という組になっているので、空所の直前と直後の発言の両方を読んで、つながりを確認します。`,
          easy: R`会話文は、「相手が何を言ったか」と「そのあとに続く返事」をセットで読むパズルです。たとえば (1) は、返事が「喫茶店のほうが楽だが、劇のほうが思い出に残る」なので、「どちらがいい？」とたずねられたのだと推理できます。`,
          pro: R`会話文の空所補充は、直前より直後の発言のほうが決め手になることが多くあります。直後が Yes / No や That's right で始まる、I will のように代用表現で答えているなど、返事の形から質問の種類を逆算します。`
        },
        {
          t: '直後の発言が、答えを決める大きなヒント',
          n: R`(1) は直後の「どちらにするか迷っている」という返事、(3) は直後の That would be a great way ~ という賛成の発言、(5) は Thanks. I will. という返事が、それぞれ決め手になります。`,
          lv: 2
        },
        {
          t: '決まり文句を覚える',
          n: R`be back to square one（振り出しに戻る）、It's hard to say.（何とも言えない）、That's not a bad idea.（悪くない考えだ）、Let me know how it goes.（結果を教えてね）などの決まり文句は、意味を知らないと、文脈があっても判断できません。意味と使う場面をセットで覚えておきましょう。`,
          lv: 2
        }
      ],
      tags: ['会話文', '空所補充', '決まり文句']
    },

    /* ---------- 長文 1: 屋上庭園 ---------- */
    {
      id: 'e-mid-reading-01',
      subject: 'english',
      level: 'mid',
      unit: 'e-reading',
      title: '長文：空の上の庭（屋上庭園）',
      source: SRC,
      time: 14,
      body: R`次の英文（都市の屋上庭園についての文章）を読み、設問に答えなさい。段落は上から順に第1段落〜第6段落と数えます。空所は ( 1 )・( 2 )・( 3 )・( 5 )、下線部は (4)・(6) です。

注　rooftop = 屋上の　asphalt = アスファルト　drain = 排水溝　soak up ~ = 〜を吸い込む　dweller = 住民　herb = ハーブ　acquainted = 知り合いの　waterproof = 防水の　skyline = （建物が空に描く）街の輪郭`,
      fig: null,
      passage: 'ep-mid-01',
      parts: [
        {
          label: '(1)',
          q: R`空所 ( 1 ) に入る最も適切な語を選びなさい。`,
          type: 'choice', choices: ['into', 'for', 'with', 'from'], answer: 0,
          explain: R`**turn A into B**（A を B に変える）です。「こうした屋根を庭園に変え始めている」という意味になります。for / with / from では、turn の後ろの「A を B に変える」という変化の結果を表せません。`
        },
        {
          label: '(2)',
          q: R`空所 ( 2 ) に入る最も適切な語句を選びなさい。`,
          type: 'choice', choices: ['For example', 'In contrast', 'As a result', 'In other words'], answer: 2,
          explain: R`直前の文は「植物と土の層が太陽の熱の多くを吸収する」、空所の後ろは「下の階の部屋は冷房があまり必要でなくなり、電気代が節約できる」で、原因 → 結果の関係です。したがって **As a result**（その結果）が入ります。For example（たとえば）は具体例、In contrast（対照的に）は反対の内容、In other words（言い換えれば）は直前の言い直しを導くときに使うので、合いません。`
        },
        {
          label: '(3)',
          q: R`空所 ( 3 ) に入る最も適切な語句を選びなさい。`,
          type: 'choice', choices: ['as a result', 'on the other hand', 'for instance', 'in the same way'], answer: 1,
          explain: R`直前の文は「コンクリートやアスファルトは水を吸い込めない」、空所を含む文は「植物と土は、スポンジのように水を保つ」で、両者は対照的な内容です。したがって **on the other hand**（一方で）が入ります。as a result（その結果）や for instance（たとえば）は、つなぎ方が合いません。in the same way（同じように）は似た内容を並べるときの表現で、この文脈とは反対です。`
        },
        {
          label: '(4)',
          q: R`下線部 (4) の This が指す内容として最も適切なものを選びなさい。`,
          type: 'choice',
          choices: [
            R`The drains cannot carry all of the rain away.`,
            R`Concrete and asphalt cannot soak up water.`,
            R`Rain runs quickly into the drains.`,
            R`Plants and soil hold water and release it slowly.`
          ],
          answer: 3,
          explain: R`This lowers the risk of flooding（これが洪水の危険を小さくする）の This は、直前の文の内容を受けています。洪水の危険を小さくするのは、「植物と土が水をスポンジのように保ち、ゆっくり放出する」ことです。ほかの選択肢は、洪水が起こる「原因」にあたる内容（排水溝が運びきれない、コンクリートが水を吸わない、雨がすぐ排水溝に流れ込む）で、危険を小さくするはたらきではありません。`
        },
        {
          label: '(5)',
          q: R`空所 ( 5 ) に入る最も適切な語を選びなさい。`,
          type: 'choice', choices: ['hesitate', 'promise', 'pretend', 'happen'], answer: 0,
          explain: R`直前の「これにはすべて費用がかかる」から、多くの持ち主は支払いを「ためらう」という流れです。**hesitate to do**（〜するのをためらう）が入ります。次の文の Even so（それでも）も、ここまでが「屋上庭園をつくる難しさ」を述べていたことを示しています。promise to do（〜すると約束する）、pretend to do（〜するふりをする）、happen to do（たまたま〜する）では、費用が障害になっているという文脈に合いません。`
        },
        {
          label: '(6)',
          q: R`下線部 (6) の内容として最も適切なものを選びなさい。`,
          type: 'choice',
          choices: [
            R`大規模な新築ビルは、緑の屋根をつくると、必ず補助金をもらえる。`,
            R`大規模な新築ビルでは、緑の屋根をつくる持ち主が増えている。`,
            R`大規模な新築ビルには、緑の屋根をつくることが義務づけられている。`,
            R`大規模な新築ビルには、緑の屋根をつくることが禁止されている。`
          ],
          answer: 2,
          explain: R`a requirement for ~ は「〜に対する要件、必須条件」という意味です。made them a requirement for large new buildings は、「それ（緑の屋根）を大規模な新築ビルの必須条件にした」、つまり**義務づけた**ということです。前の「資金を出す都市もある」は補助金の話で、「さらに義務にまでした都市もある」と続いています。補助金は前半の内容、「禁止」は反対の内容、「増えている」は義務かどうかを述べておらず、いずれも誤りです。`
        },
        {
          label: '問7',
          q: R`本文の内容と一致するものを 2 つ選びなさい。`,
          type: 'multi',
          choices: [
            R`Concrete and asphalt help a city deal with heavy rain because they soak up water.`,
            R`A layer of plants and soil on a roof can reduce the heat that enters a building.`,
            R`The neighbors who grow vegetables on the roof sell them to pay for the garden.`,
            R`A rooftop garden makes air conditioning unnecessary in the rooms below.`,
            R`Some cities have started to support owners who build green roofs.`,
            R`Building a roof garden is cheap, but few owners know about the idea.`
          ],
          answer: [1, 4],
          explain: R`正しいのは 2 つです。「植物と土の層が、建物に入る熱を減らす」は第2段落（a layer of plants and soil absorbs much of the sun's heat）と一致し、「緑の屋根をつくる持ち主を支援し始めた都市がある」は第6段落（Some cities now give money to owners who build green roofs）と一致します。
誤りの選択肢は次のとおりです。「コンクリートとアスファルトが水を吸い込む」→ 第3段落は cannot soak up water。「野菜を売って庭の費用にあてる」→ 第4段落は share the harvest（収穫物を分け合う）。「冷房が不要になる」→ 第2段落は need less air conditioning（冷房があまり必要でなくなる）で、不要ではありません。「費用は安いが知られていない」→ 第5段落は All this costs money（費用がかかる）。`
        }
      ],
      solution: [
        {
          t: '全体の流れをつかむ',
          n: R`段落ごとの要旨は次のとおりです。
第1段落: 都市に空き地がなく、屋根が庭園に変わり始めている（話題の提示）。
第2段落: 利点① 建物を涼しく保つ。
第3段落: 利点② 大雨への対処（水をため込んで、ゆっくり放出する）。
第4段落: 利点③ 住民が自然とふれあえる場所になる。
第5段落: 欠点（重さ・設備・費用）。
第6段落: それでも広がっている（支援・義務化）と、今後の展望。`,
          easy: R`First / Second / Third のような順序を表す語は、段落の主題を示す目印です。この文章は「利点 3 つ → 欠点 → それでも広がる」という流れで進んでいます。各段落の最初の文だけを拾い読みすると、この流れが先につかめます。`,
          pro: R`「Of course ~」で欠点や反論に入り、「Even so」で話題を戻す展開は、筆者の主張（屋上庭園は有益）を支える定番の構成です。逆接の位置（Yet / Even so）が主張の中心になりやすい、と覚えておくと内容把握が速くなります。`
        },
        {
          t: '空所補充は、接続の語句と文脈で決める',
          n: R`(2) は直前との関係が「原因 → 結果」、(3) は「対照（コンクリート ⇔ 植物と土）」、(5) は「費用がかかる → ためらう」という論理関係を確認します。(1) の turn A into B のように、語と語の結びつきで決まる空所は、熟語の知識で即答できます。`,
          lv: 2
        },
        {
          t: '指示語・下線部は、直前の内容に戻って確認する',
          n: R`(4) の This は直前の文の内容を、(6) の them は green roofs を指します。指示語の問題は、指示語を含む文の 1 つ前の文（または同じ文の前半）から、同じ働きをする内容を探します。ここでは「洪水の危険を小さくする」ものが何かを考えます。`,
          easy: R`「これ（This）」と出てきたら、「これ」を候補の内容に置き換えて、文が成り立つか確かめましょう。「雨が排水溝に流れ込むことが、洪水の危険を小さくする」は変ですね。「水をゆっくり放出することが、洪水の危険を小さくする」なら筋が通ります。`,
          lv: 2
        },
        {
          t: '内容一致は、本文の記述と 1 つずつ照合する',
          n: R`選択肢のキーワード（soak up, share the harvest, need less air conditioning, costs money など）を本文で探し、その箇所の記述と照らし合わせます。「必要なくなる（unnecessary）」のような極端な表現には、特に注意します。`,
          lv: 2
        }
      ],
      tags: ['空所補充', '接続語', '指示語', '内容説明', '内容一致', '環境']
    },

    /* ---------- 長文 2: マルチタスク ---------- */
    {
      id: 'e-mid-reading-02',
      subject: 'english',
      level: 'mid',
      unit: 'e-reading',
      title: '長文：同時に 2 つのことはできるか',
      source: SRC,
      time: 14,
      body: R`次の英文（マルチタスクについての文章）を読み、設問に答えなさい。段落は上から順に第1段落〜第6段落と数えます。空所は ( 1 )・( 2 )・( 3 )・( 4 )、下線部は (5)・(6) です。

注　multitasking = マルチタスク（複数の作業を同時にこなすこと）　a fraction of a second = 1 秒のごく一部　add up = 積み重なる　text message = 携帯メッセージ`,
      fig: null,
      passage: 'ep-mid-02',
      parts: [
        {
          label: '(1)',
          q: R`空所 ( 1 ) に入る最も適切な語を選びなさい。`,
          type: 'choice', choices: ['Therefore', 'However', 'For example', 'Similarly'], answer: 1,
          explain: R`第1段落は「多くの人がマルチタスクを誇りに思っている」という肯定的な内容、空所を含む文は「脳を研究する科学者はこの考えに疑いを持っている」という反対の内容です。逆接を表す **However**（しかし）が入ります。Therefore（それゆえ）は結果、For example（たとえば）は具体例、Similarly（同様に）は似た内容を続けるときに使うので、合いません。`
        },
        {
          label: '(2)',
          q: R`空所 ( 2 ) に入る最も適切な語を選びなさい。`,
          type: 'choice', choices: ['so', 'because', 'but', 'unless'], answer: 2,
          explain: R`「1 回の切り替えにかかるのは 1 秒のごく一部」と「こうした小さな遅れはすぐに積み重なる」は、小さいのに積み重なると大きくなるという対比の関係です。逆接の接続詞 **but** が入ります。so（だから）は原因 → 結果、because（なぜなら）は理由、unless（〜でない限り）は条件を表し、前後の関係に合いません。`
        },
        {
          label: '(3)',
          q: R`空所 ( 3 ) に入る最も適切な語を選びなさい。`,
          type: 'choice', choices: ['introduced', 'interrupted', 'intended', 'invented'], answer: 1,
          explain: R`**be interrupted**（中断される）が入ります。「数分おきに携帯メッセージで作業を中断され、それに返信しなければならなかった」という文脈で、次の文の The students who were interrupted でも同じ語が使われています。introduce は「〜を紹介する」、intend は「〜するつもりである」、invent は「〜を発明する」で、意味が合いません。語の出だしが似ているので、つづりと意味を結びつけて覚えましょう。`
        },
        {
          label: '(4)',
          q: R`空所 ( 4 ) に入る最も適切な語を選びなさい。`,
          type: 'choice', choices: ['as', 'then', 'that', 'than'], answer: 3,
          explain: R`空所の直前の longer は比較級なので、比較の対象を導く **than** が入ります。「中断された学生たちは、中断されなかった学生たち（those who were not）よりも、ずっと長くかかった」という意味です。as は as ~ as の形で原級に使い、then は「そのとき」、that は接続詞・関係詞で、比較級のあとには置けません。`
        },
        {
          label: '(5)',
          q: R`下線部 (5) の This process が指す内容として最も適切なものを選びなさい。`,
          type: 'choice',
          choices: [
            R`The brain remembers where we stopped and what we were going to do next.`,
            R`Two groups of students solve a set of math problems.`,
            R`The brain pays attention to two difficult tasks at the same time.`,
            R`Researchers measure how long the students take to finish.`
          ],
          answer: 0,
          explain: R`This process（この過程）は、直前の文の内容、つまり「最初の作業に戻るとき、どこでやめたのか、次に何をするつもりだったのかを思い出さなければならない」ことを指します。脳が再び働き出すのに時間が必要な理由として挙げられた過程で、「目に見えないので、失っている時間に気づかない」と続きます。ほかの選択肢は実験の内容や、筆者が否定している内容で、指示語の内容にあたりません。`
        },
        {
          label: '(6)',
          q: R`下線部 (6) the opposite is true の内容として最も適切なものを選びなさい。`,
          type: 'choice',
          choices: [
            R`1 つのことだけをするのは、実際に時間の無駄である。`,
            R`この助言に従うのが難しいと感じる人は、実際にはほとんどいない。`,
            R`1 つのことだけをするのは時間の無駄に思えるが、実際には無駄ではなく、効率がよい。`,
            R`2 つのことを同時にしても、実際には問題は起こらない。`
          ],
          answer: 2,
          explain: R`the opposite は、直前の文 doing just one thing seems like a waste of time（1 つのことだけをするのは時間の無駄に思える）の反対、つまり「1 つのことだけをするのは時間の無駄ではない」ことを指します。次の文で、1 つのことに集中する人は早く終えて質の高い仕事をすることが多い、と具体的に述べられています。1 つめの選択肢は直前の文と同じ内容で、2 つめと 4 つめは the opposite が指す内容ではありません。`
        },
        {
          label: '問7',
          q: R`この文章の内容に最も合うタイトルを選びなさい。`,
          type: 'choice',
          choices: [
            R`Why Doing One Thing at a Time Is Often Better`,
            R`How to Answer E-mails During a Meeting`,
            R`How to Become a Better Multitasker`,
            R`Why Math Problems Are Difficult for Students`
          ],
          answer: 0,
          explain: R`筆者は、マルチタスクは実際には素早い切り替えであり、切り替えには時間と注意のコストがかかるので、多くの場合、1 つずつ集中して片づけるほうがよいと述べています（第2〜6段落）。したがって、「一度に 1 つのことをするほうがよいことが多い理由」が最適です。会議中のメール返信は第1段落の例の 1 つにすぎず、「より上手なマルチタスクの方法」は筆者の主張とは反対の内容です。数学の問題が難しい理由は、実験の素材にすぎません。`
        }
      ],
      solution: [
        {
          t: '全体の流れをつかむ',
          n: R`段落ごとの要旨は次のとおりです。
第1段落: マルチタスクを誇りに思う人が多い（一般的な見方）。
第2段落: しかし脳は 2 つの難しい作業に同時に注意を向けられず、実際は素早い切り替えをしている。
第3段落: 実験（中断された学生は終えるのにずっと長くかかり、間違いも多い）。
第4段落: 切り替えに時間がかかる理由（作業の再開に時間が必要）。
第5段落: 2 つの作業に全神経が必要なときは、1 つずつ終えるほうがよい。
第6段落: 一度に 1 つに集中する人のほうが、早く質の高い仕事をする。`,
          easy: R`この文章は、「世間の常識（第1段落）→ 筆者の反論（第2段落の However 以降）→ 実験での証拠 → 理由 → 助言」という、論説文の典型的な流れです。逆接の語（However / Yet）が出たら、そこから筆者の主張が始まると考えましょう。`,
          pro: R`論説文は、第1段落で一般的な見方を示し、However / Yet で筆者の立場を示す型が多く出題されます。内容一致の選択肢では、「一般的な見方」を筆者の主張であるかのように述べた文が、誤答として混ぜられます。`
        },
        {
          t: '接続語の問題は、前後の論理関係で決める',
          n: R`(1) 肯定的な見方 ⇔ 疑い → 逆接（However）、(2) 小さい遅れ ⇔ 積み重なる → 逆接（but）、(4) 比較級の後ろ → than、(3) の interrupted は前後の内容（作業を中断される）から決めます。接続語は、前後を日本語に訳して「順接か逆接か、原因か具体例か」を判断します。`,
          lv: 2
        },
        {
          t: '指示語・下線部の問題',
          n: R`(5) This process は直前の文の内容、(6) the opposite は直前の文 doing just one thing seems like a waste of time の反対を指します。「何と反対なのか」を確認してから、選択肢を比べます。`,
          easy: R`the opposite（反対）の問題は、「何の反対か」を先に決めるのが大切です。ここでは直前の「1 つのことだけをするのは時間の無駄に思える」の反対なので、「無駄ではない」と考えます。`,
          lv: 2
        },
        {
          t: 'タイトル問題は、全体のまとめになる選択肢を選ぶ',
          n: R`タイトルや要旨は、「一部の例」や「世間の考え」ではなく、筆者の主張全体を表すものを選びます。この文章の主張は、「1 つずつ集中するほうが効率がよい」です。`,
          lv: 2
        }
      ],
      tags: ['空所補充', '接続語', '指示語', '内容説明', 'タイトル', '心理']
    },

    /* ---------- 長文 3: 町の本屋 ---------- */
    {
      id: 'e-mid-reading-03',
      subject: 'english',
      level: 'mid',
      unit: 'e-reading',
      title: '長文：町の本屋と「ごゆっくり」',
      source: SRC,
      time: 14,
      body: R`次の英文（町の本屋と店主についての思い出）を読み、設問に答えなさい。段落は上から順に第1段落〜第6段落と数えます。空所は ( 1 )・( 3 )・( 5 )、下線部は (2)・(4)・(6) です。

注　shelf = 書棚　sign = 貼り紙　neighborhood = 近所　counter = （店の）カウンター　advertisement = 広告、宣伝　wrap = 〜を包む`,
      fig: null,
      passage: 'ep-mid-03',
      parts: [
        {
          label: '(1)',
          q: R`空所 ( 1 ) に入る最も適切な語を選びなさい。`,
          type: 'choice', choices: ['hardly', 'nearly', 'literally', 'recently'], answer: 2,
          explain: R`take ~ literally は「〜を文字どおりに受け取る」という意味です。林さんの Take your time.（ごゆっくり）という言葉を、「本当に時間をかけてよい」という意味にそのまま受け取った、ということです。直後の文で、毎週土曜日に何時間も書棚のあいだで過ごしたと述べられています。hardly（ほとんど〜ない）、nearly（ほとんど）、recently（最近）は、took his words を修飾しても意味が通りません。`
        },
        {
          label: '(2)',
          q: R`下線部 (2) の My heart sank. の意味として最も適切なものを選びなさい。`,
          type: 'choice',
          choices: [
            R`安心して、ほっとした。`,
            R`驚いて、思わず立ち止まった。`,
            R`腹が立って、いらいらした。`,
            R`悲しくなり、がっかりした。`
          ],
          answer: 3,
          explain: R`My heart sank. は「胸が沈んだ」、つまり「気持ちが沈んだ、がっかりした」という意味の表現です。大好きだった本屋が閉店するという貼り紙を見たときの気持ちです。sink は「沈む」という意味で、heart が主語のときは、悲しみやがっかりした気持ちを表します。この後すぐ店へ走っていった（第4段落）という行動とも合います。`
        },
        {
          label: '(3)',
          q: R`空所 ( 3 ) に入る最も適切な語を選びなさい。`,
          type: 'choice', choices: ['At', 'To', 'With', 'In'], answer: 1,
          explain: R`**to one's surprise**（驚いたことに）という決まった言い方です。「驚いたことに、彼は私を覚えていた」という意味になります。同じ形で to my joy（うれしいことに）、to my disappointment（がっかりしたことに）なども使います。be surprised at ~（〜に驚く）と混同して At を選ばないようにしましょう。`
        },
        {
          label: '(4)',
          q: R`下線部 (4) で、林さんは「君のような子どもたちが最高の宣伝だった」と言っています。その理由として最も適切なものを選びなさい。`,
          type: 'choice',
          choices: [
            R`子どもたちが店に通い続け、友達や、さらにその親たちを店に連れてきてくれたから。`,
            R`子どもたちが、店の広告を作るのが上手だったから。`,
            R`子どもたちが、店の宣伝のためにたくさんの本を買ってくれたから。`,
            R`子どもたちのせいで、店の悪い評判が近所に広まってしまったから。`
          ],
          answer: 0,
          explain: R`best advertisement（最高の宣伝）は、直後の You stayed, your friends came, and then their parents came.（君が通い、君の友達が来て、そのうち友達の親たちも来るようになった）で具体的に説明されています。店に通い続けた子どもが、友達を連れてきて、さらにその親もやってきた、つまり子どもたちが店の評判を広める役割を果たしたということです。「広告を作った」「宣伝のために本を買った」「悪い評判」は、本文に書かれていません。`
        },
        {
          label: '(5)',
          q: R`空所 ( 5 ) に入る最も適切な語句を選びなさい。`,
          type: 'choice', choices: ['at last', 'in public', 'by accident', 'for sure'], answer: 2,
          explain: R`**by accident**（偶然に）が入ります。「書棚の前に立って、偶然 1 冊の本を見つける」ことが、オンラインでワンクリックで本を買うこととの対比になっています。at last は「ついに」、in public は「人前で」、for sure は「確かに」で、found a book を修飾しても意味が合いません。`
        },
        {
          label: '(6)',
          q: R`下線部 (6) の he was not talking about reading について、林さんの Take your time. は、最後の日にはどのような意味だったと筆者は理解しましたか。最も適切なものを選びなさい。`,
          type: 'choice',
          choices: [
            R`買った本を、時間をかけてゆっくり読みなさいという意味。`,
            R`店を閉める時刻が迫っているので、急いで会計をしてほしいという意味。`,
            R`これからは、本を買わずに立ち読みだけをしてもよいという意味。`,
            R`別れのあいさつを急がず、最後の時間をゆっくり過ごしてよいという意味。`
          ],
          answer: 3,
          explain: R`下線部の直後の文で、He meant that neither of us needed to hurry to say goodbye.（私たちのどちらも、別れを告げるのを急ぐ必要はないという意味だった）と説明されています。子どものころの Take your time. は「本をゆっくり選んで読んでよい」という意味でしたが、閉店の日の Take your time. は「別れを急がず、最後の時間を一緒に過ごそう」という意味に変わっています。読書を急ぐなという意味ではないので、「ゆっくり読みなさい」という選択肢は誤りです。`
        },
        {
          label: '問7',
          q: R`本文の内容と一致するものを 1 つ選びなさい。`,
          type: 'choice',
          choices: [
            R`The narrator could not buy many books as a child, so Mr. Hayashi often gave her books for free.`,
            R`Many of the customers on the shop's last days had grown up in the neighborhood.`,
            R`Mr. Hayashi often told the narrator to leave when she read books without buying them.`,
            R`Mr. Hayashi blamed the people who bought books online for the closing of his shop.`
          ],
          answer: 1,
          explain: R`正しいのは「閉店のころの客の多くは、近所で育った人たちだった」です。第4段落に most of them people of my age who had grown up in the neighborhood とあります。「本をただでくれた」は書かれておらず（第2段落: 立ち読みをしても出ていくように言われなかっただけ）、「出ていくように何度も言った」は never once told me to leave に反します。「オンラインで買う人を責めた」は、第5段落の he did not blame them に反します。`
        }
      ],
      solution: [
        {
          t: '全体の流れをつかむ',
          n: R`段落ごとの要旨は次のとおりです。
第1段落: 子どものころ好きだった本屋と、店主の口ぐせ Take your time。
第2段落: 毎週土曜日に立ち読みを楽しんだ思い出（追い出されなかった）。
第3段落: 大学進学後、帰省して閉店の貼り紙を見つけ、気持ちが沈む。
第4段落: 翌朝、店を訪ねると店主が自分を覚えていて、「最高の宣伝だった」と言う。
第5段落: 閉店の理由（ネット通販）と、店主の考え。
第6段落: 最後の日に 5 冊を買い、Take your time. の意味が変わる。`,
          easy: R`物語文・エッセイは、「いつ・どこで・だれが・何をして・どう思ったか」を、段落ごとに整理しながら読みます。この文章では、最初と最後に同じ言葉 Take your time. が出てくる点が、全体を貫くしかけです。`,
          pro: R`物語文では、同じ表現が最初と最後に出てくる構成（くり返し）が多く、「意味の変化」が最後の設問で問われやすい傾向があります。`
        },
        {
          t: '心情・慣用表現は、場面と直後の内容から判断する',
          n: R`(2) My heart sank. のような慣用表現は、場面（閉店の貼り紙）から感情を推測し、前後の行動（翌朝すぐ店に走った）と矛盾しないか確認します。sink（沈む）のイメージから「気持ちが沈む」と覚えておくと確実です。`,
          lv: 2
        },
        {
          t: '引用された発言の意味は、直後の説明文を探す',
          n: R`(4) は直後の You stayed, your friends came, ... が、(6) は直後の He meant that ~ が、それぞれ下線部の意味を説明しています。下線部の問題は、直前よりも、直後の文に答えのヒントがあることが多くあります。`,
          easy: R`人の発言の意味がわからないときは、そのあとの文を読み進めてみましょう。たとえば (4) の「最高の宣伝」は、次の文の「君が通い、友達が来て、親も来た」で言い換えられています。`,
          lv: 2
        },
        {
          t: '内容一致は、誤りの型を意識する',
          n: R`誤りの選択肢には、「書かれていないこと」（本をただでくれた）、「反対のこと」（出ていくように言った）、「人物の取り違え」（ネット購入者を責めた）の型があります。本文の根拠を 1 つずつ探して照合します。`,
          lv: 2
        }
      ],
      tags: ['空所補充', '心情', '慣用表現', '内容説明', '内容一致', '物語']
    },

    /* ---- END OF CARDS ---- */
  ]);
})();
