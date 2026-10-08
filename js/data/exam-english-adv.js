/* GOKAKU NAVI — 英語 問題バンク（難関大レベル: 目安 偏差値 60 以上 / 早慶・旧帝）
   15 カード = 語彙 3 / 熟語 2 / 文法・語法 4 / 整序 2 / 会話文 1 / 長文 3。
   英文・設問・選択肢・解説はすべて書き下ろしのオリジナル（既存の入試問題・参考書の文面は含まない）。 */
(function () {
  'use strict';
  const R = String.raw;
  const SRC = { univ: 'オリジナル' };

  /* ================================================================
   *  長文（passage）  ep-adv-01 〜 ep-adv-03
   * ================================================================ */
  JK.registerPassages([
    /* ---------- ep-adv-01: 知識の呪い（心理・教育） ---------- */
    {
      id: 'ep-adv-01',
      title: 'The Curse of Knowledge',
      level: 'adv',
      topic: '心理・教育',
      source: SRC,
      paras: [
        [
          { en: R`Anyone who has tried to learn a skill from an expert knows a particular kind of frustration.`, ja: R`専門家から何かの技能を学ぼうとしたことのある人なら、だれでもある特有のもどかしさを知っている。` },
          { en: R`The expert explains something, apparently with great clarity, and yet the learner understands almost nothing.`, ja: R`専門家は、一見きわめて明快に何かを説明するのに、学ぶ側はほとんど何も理解できない。` },
          { en: R`It is tempting to blame the learner's lack of ability.`, ja: R`学ぶ側の能力不足のせいにしたくなるものだ。` },
          { en: R`Psychologists, however, have long suspected that the real cause lies elsewhere: in the expert's own mind.`, ja: R`だが心理学者たちは、本当の原因は別のところ、すなわち専門家自身の心の中にあるのではないかと、以前から疑ってきた。` }
        ],
        [
          { en: R`Once we know something well, it becomes remarkably difficult to imagine not knowing it.`, ja: R`あることをよく知るようになると、それを知らない状態を想像することは驚くほど難しくなる。` },
          { en: R`This effect is sometimes called the curse of knowledge.`, ja: R`この効果は「知識の呪い」と呼ばれることがある。` },
          { en: R`A chess master looking at a position sees at once which pieces are in danger, and she can hardly recall what it was like to see only a confusing pattern of black and white shapes.`, ja: R`局面を見たチェスの名人は、どの駒が危険にさらされているかをただちに見抜き、白と黒の形が入り乱れた混乱した模様しか見えなかったころがどんなふうだったか、ほとんど思い出せない。` }
        ],
        [
          { en: R`In a typical study, participants who have been shown the solution to a puzzle are asked to guess how long a newcomer would need to solve it.`, ja: R`典型的な研究では、パズルの解答を見せられた参加者が、初めて挑戦する人がそれを解くのにどのくらいの時間を要するかを推測するよう求められる。` },
          { en: R`Such studies have repeatedly found that people who know the answer {b1:overestimate} how easily others will find it.`, ja: R`このような研究は、答えを知っている人は、他人がそれをどれほど容易に見つけるかを過大に見積もることを、繰り返し明らかにしてきた。` },
          { en: R`The answer, once learned, seems to have been obvious all along.`, ja: R`答えは、ひとたび知ってしまうと、初めから明白だったように思えるのである。` },
          { en: R`{u2:This} is not a sign of arrogance; it is simply how the mind works.`, ja: R`これは傲慢さの表れではない。単に、心がそのように働くということである。` }
        ],
        [
          { en: R`The consequences reach well beyond the classroom.`, ja: R`その影響は教室をはるかに越えて及ぶ。` },
          { en: R`A programmer may call a menu obvious simply because he designed it himself.`, ja: R`プログラマーは、自分で設計したというだけの理由で、あるメニューを明白だと言うかもしれない。` },
          { en: R`Instruction manuals written by engineers are often {b3:incomprehensible} to ordinary users; doctors use technical terms without noticing that their patients are lost; and experienced teachers skip steps that seem too obvious to mention, although these are exactly the steps that beginners need.`, ja: R`技術者が書いた取扱説明書は、一般の利用者にはしばしば理解できない。医師は専門用語を使い、患者が戸惑っていることに気づかない。経験豊かな教師は、あまりに明白に思えて口にするまでもないと考える段階を飛ばすが、それらはまさに初心者が必要とする段階である。` }
        ],
        [
          { en: R`Can the curse be lifted?`, ja: R`この呪いは解けるのだろうか。` },
          { en: R`Rarely {b4:do experts notice the problem on their own}, and simply warning them that it exists helps little.`, ja: R`専門家が自力でその問題に気づくことはめったになく、問題が存在すると警告するだけでは、ほとんど役に立たない。` },
          { en: R`What works better is feedback: the expert must watch a real beginner struggle.`, ja: R`もっと効果があるのはフィードバックである。専門家は、本物の初心者が苦戦する姿を実際に見なければならない。` },
          { en: R`Another remedy is to recall one's own early mistakes, not the polished version of one's learning story, but the confusion, the wrong turns, and the misunderstandings.`, ja: R`もう1つの対策は、自分自身の初期の失敗を思い出すことである。それは、洗練された形に整えた学習の物語ではなく、混乱や回り道や思い違いのことである。` },
          { en: R`Some of the best teachers keep notes on what puzzled them as students, {b5:precisely} because such memories fade so quickly.`, ja: R`最良の教師の中には、学生のころに自分を悩ませたことを書き留めておく人がいる。そうした記憶は非常に早く薄れてしまうからこそである。` }
        ],
        [
          { en: R`There is an irony here.`, ja: R`ここには皮肉がある。` },
          { en: R`The more completely we master a subject, the less qualified we may be to teach it, unless we make a deliberate effort to remember what it was like not to know.`, ja: R`ある科目を完全に習得すればするほど、それを教える資格は薄れるかもしれない。知らないということがどのようなものだったかを思い出そうと、意識して努力しないかぎりは。` },
          { en: R`Expertise, in other words, is not merely a matter of acquiring knowledge; {u6:it also requires keeping alive the memory of ignorance}.`, ja: R`言い換えれば、専門性とは単に知識を獲得することではなく、無知であったころの記憶を生かし続けることも求めるのである。` }
        ]
      ],
      vocab: ['frustration', 'tempting', 'remarkably', 'confusing', 'overestimate', 'arrogance', 'consequence', 'incomprehensible', 'remedy', 'polished', 'qualified', 'deliberate', 'expertise', 'ignorance', 'struggle'],
      vocabExtra: [
        ['frustration', '名', 'いらだち; もどかしさ; 欲求不満', 3],
        ['tempting', '形', '心をそそる; 〜したくなる', 3],
        ['remarkably', '副', '驚くほど; 著しく', 3],
        ['overestimate', '動', '〜を過大評価する; 〜を多く見積もりすぎる', 3],
        ['arrogance', '名', '傲慢さ; 横柄', 3],
        ['incomprehensible', '形', '理解できない; 不可解な', 3],
        ['polished', '形', '洗練された; 磨き上げられた', 3],
        ['ignorance', '名', '無知; 知らないこと', 3]
      ]
    },

    /* ---------- ep-adv-02: 翻訳できない言葉（言語・文化） ---------- */
    {
      id: 'ep-adv-02',
      title: 'Words Without Equivalents',
      level: 'adv',
      topic: '言語・文化',
      source: SRC,
      paras: [
        [
          { en: R`Every language seems to contain a few words that its speakers regard as impossible to translate.`, ja: R`どの言語にも、その話者が翻訳不可能だと考える言葉がいくつかあるように思える。` },
          { en: R`The Portuguese word saudade, the German word Schadenfreude and the Japanese word komorebi are often cited as examples.`, ja: R`ポルトガル語の saudade、ドイツ語の Schadenfreude、日本語の komorebi などが、しばしば例として挙げられる。` },
          { en: R`Such words are frequently offered as proof that different languages divide human experience in different ways.`, ja: R`そうした言葉は、言語ごとに人間の経験の区切り方が異なることの証拠として、しばしば持ち出される。` },
          { en: R`But does it follow that speakers of other languages cannot experience what such a word names?`, ja: R`しかし、だからといって、他の言語の話者はそうした言葉が指し示すものを経験できない、ということになるだろうか。` }
        ],
        [
          { en: R`The strongest form of this claim, popular in the last century, holds that language determines thought: people who have no word for a concept cannot grasp it.`, ja: R`この主張の最も強い形は、前世紀に流行したものだが、言語が思考を決定する、つまり、ある概念を表す語をもたない人々はその概念を理解できない、というものである。` },
          { en: R`{b1:Few} scholars today accept this view.`, ja: R`今日、この見解を受け入れる学者はほとんどいない。` },
          { en: R`An English speaker who has never heard the word komorebi can still enjoy sunlight falling through leaves; {u2:the pleasure does not wait for a name}.`, ja: R`komorebi という語を聞いたことのない英語話者でも、木の葉のあいだから差し込む日の光を楽しむことはできる。喜びは名前の登場を待ってはくれない。` }
        ],
        [
          { en: R`A weaker version of the claim, however, has survived, and it has found some support in experiments.`, ja: R`しかし、この主張のより弱い形は生き残っており、実験によってある程度の裏づけも得ている。` },
          { en: R`It holds that language influences, rather than {b3:determines}, what we notice and remember.`, ja: R`それは、言語が私たちの注意や記憶の対象を、決定するのではなく、左右するというものである。` },
          { en: R`Speakers of languages in which light blue and dark blue have separate basic names are reported to tell shades of blue apart slightly faster than speakers of languages with a single name for both.`, ja: R`薄い青と濃い青に別々の基本的な名前がある言語の話者は、両方に1つの名前しかない言語の話者よりも、青の色合いをわずかに速く見分けると報告されている。` },
          { en: R`The difference is small, but it suggests that a name can make a distinction easier to notice and to keep in mind.`, ja: R`その差はわずかだが、名前があれば、区別に気づき、それを記憶にとどめておくことが容易になりうることを示唆している。` },
          { en: R`These findings are modest, yet they keep the weaker version of the claim alive.`, ja: R`こうした発見はささやかなものだが、それでも、この主張の弱い形を生き永らえさせている。` }
        ],
        [
          { en: R`For translators, the lesson is less dramatic than it may seem.`, ja: R`翻訳者にとって、この教訓は見かけほど劇的なものではない。` },
          { en: R`A word with no equivalent can still be explained, and the explanation, though longer, may convey what the word means.`, ja: R`対応する語のない言葉でも説明することはでき、その説明は、長くなるとしても、その語の意味を伝えられるかもしれない。` },
          { en: R`Consider a translator who must render saudade into English.`, ja: R`saudade を英語に訳さなければならない翻訳者を考えてみよう。` },
          { en: R`She may choose longing, nostalgia, or a sweet sadness for what is gone, but each choice loses something and adds something.`, ja: R`彼女は longing、nostalgia、あるいは「去ったものへの甘い悲しみ」を選ぶかもしれないが、どの選択も何かを失い、何かを付け加える。` },
          { en: R`What cannot be preserved is the effect the word has in its original setting: its rhythm, its associations, and {b4:the ease with which native speakers use it} without a second thought.`, ja: R`保存できないのは、その語が本来の場面でもつ効果である。すなわち、その響きや連想、そして母語話者がさして考えもせずにそれを使いこなせる気安さである。` },
          { en: R`A translator, therefore, must decide what to keep and what to give up, because nothing can be carried across whole.`, ja: R`したがって翻訳者は、何を残し何を手放すかを決めなければならない。完全な形で運び越えられるものはないからである。` }
        ],
        [
          { en: R`Seen in {u5:this light}, the so-called untranslatable word is not a wall between languages but a reminder of how translation actually works.`, ja: R`この観点から見れば、いわゆる翻訳不可能な語は、言語間の壁ではなく、翻訳が実際にどう行われるかを思い出させてくれるものである。` },
          { en: R`It never reproduces; it re-creates.`, ja: R`翻訳は決して複製しない。再創造するのだ。` },
          { en: R`And in the effort to re-create, readers may learn something that no dictionary can give them: that their own language, too, carries assumptions {b6:so} familiar that they have never noticed them.`, ja: R`そして再創造の努力の中で、読者は、どんな辞書も与えてくれないことを学ぶかもしれない。自分たちの言語もまた、あまりになじみ深いために一度も気づいたことのない前提を抱えているということを。` }
        ]
      ],
      vocab: ['regard', 'claim', 'determine', 'grasp', 'concept', 'version', 'influence', 'equivalent', 'convey', 'render', 'preserve', 'association', 'reminder', 'assumption'],
      vocabExtra: [
        ['render', '動', '〜を訳す; 〜を表現する; 〜を（ある状態に）する', 3],
        ['reminder', '名', '思い出させるもの; 注意; 催促', 2]
      ]
    },

    /* ---------- ep-adv-03: 便利さの代償（技術・社会） ---------- */
    {
      id: 'ep-adv-03',
      title: 'The Price of Convenience',
      level: 'adv',
      topic: '技術・社会',
      source: SRC,
      paras: [
        [
          { en: R`Few people today could find their way across an unfamiliar city without the help of a navigation app.`, ja: R`今日では、ナビゲーションアプリの助けなしに、見知らぬ都市を横断して目的地にたどり着ける人はほとんどいない。` },
          { en: R`This is no cause for alarm in itself; nobody mourns the loss of the ability to start a fire with flint.`, ja: R`これ自体は警戒すべきことではない。火打ち石で火をおこす能力が失われたことを嘆く人はいない。` },
          { en: R`But the example raises a broader question: when a machine takes over a task, what happens to the human skill that the task once required?`, ja: R`だがこの例は、より広い問いを投げかける。機械が作業を引き継ぐとき、その作業がかつて必要としていた人間の技能はどうなるのか。` }
        ],
        [
          { en: R`Engineers who study automated systems have noticed a troubling pattern.`, ja: R`自動化されたシステムを研究する技術者たちは、ある気がかりなパターンに気づいている。` },
          { en: R`As machines become more reliable, the people who supervise them are called on less and less often, and so their skills gradually weaken.`, ja: R`機械の信頼性が高まるにつれ、それを監督する人間が出番を求められる頻度はますます減り、その結果、人間の技能は徐々に衰えていく。` },
          { en: R`{b1:Yet} it is precisely when something goes wrong, when the machine fails or meets a situation its designers never imagined, that human skill is needed most.`, ja: R`しかし、人間の技能が最も必要とされるのは、まさに何かがうまくいかないとき、つまり機械が故障したり、設計者が想像もしなかった状況に遭遇したりするときである。` },
          { en: R`{b2:The more advanced the system, the more serious this problem becomes}.`, ja: R`システムが高度になればなるほど、この問題はいっそう深刻になる。` }
        ],
        [
          { en: R`Aviation offers a well-known illustration.`, ja: R`航空は、よく知られた例を提供している。` },
          { en: R`Modern aircraft can fly almost entirely on autopilot, which has made flying far safer than it once was.`, ja: R`現代の航空機はほとんど完全に自動操縦で飛行でき、そのおかげで飛行は以前よりはるかに安全になった。` },
          { en: R`Nevertheless, aviation authorities have long worried that pilots who rarely fly by hand may react less skillfully in the rare emergencies when the automatic systems shut down.`, ja: R`それでも航空当局は、手動で飛ぶことがめったにないパイロットは、自動システムが停止するまれな緊急事態において、対応がまずくなるのではないかと、長く懸念してきた。` }
        ],
        [
          { en: R`The problem is not {b3:confined} to technical professions, either.`, ja: R`この問題は、技術系の職業に限られたものでもない。` },
          { en: R`Medical students who rely on software to read test results may never develop the intuition of an experienced doctor, and writers who accept every correction that a program suggests may stop noticing their own mistakes.`, ja: R`検査結果を読むのにソフトウェアに頼る医学生は、経験豊かな医師の直観を身につけないままになるかもしれず、プログラムが示す訂正をすべて受け入れる書き手は、自分の誤りに気づかなくなるかもしれない。` },
          { en: R`In each case the machine does the work well, and the person gains time, but {u4:something slowly disappears that only practice can maintain}.`, ja: R`どの場合も、機械は仕事をうまくこなし、人は時間を得るが、練習によってしか維持できない何かが、静かに失われていく。` }
        ],
        [
          { en: R`Does this mean that we should refuse the help that machines offer?`, ja: R`だからといって、機械が提供する助けを拒むべきだということになるのだろうか。` },
          { en: R`Hardly.`, ja: R`まったくそうではない。` },
          { en: R`No one seriously proposes that pilots abandon autopilots or that doctors give up their instruments.`, ja: R`パイロットに自動操縦をやめさせるべきだとか、医師に器具を手放させるべきだとか、真剣に提案する者はいない。` },
          { en: R`A more reasonable conclusion is that skills worth keeping must be kept deliberately.`, ja: R`より理にかなった結論は、守る価値のある技能は意識的に守らなければならない、ということである。` },
          { en: R`Pilots are now encouraged to fly by hand at regular intervals, and some teachers ask students to solve problems without calculators before allowing them to use the machines.`, ja: R`パイロットは今では定期的に手動で飛ぶことを奨励されており、教師の中には、生徒に電卓を使うことを許す前に、電卓なしで問題を解かせる者もいる。` },
          { en: R`Such practices accept a cost, in time and effort, {b5:in return for} a kind of insurance.`, ja: R`こうした慣行は、時間と労力という犠牲を、ある種の保険と引き換えに受け入れている。` }
        ],
        [
          { en: R`Underlying this approach is a simple idea: that {u6:convenience is never free}.`, ja: R`この取り組みの根底にあるのは、単純な考えである。便利さは決してただではない、ということだ。` },
          { en: R`What we gain in comfort we may lose in capability, and it is for each of us to decide, individually and as a society, which capabilities are worth the effort of preserving.`, ja: R`快適さの面で得るものを、能力の面で失うかもしれない。そして、どの能力が守る努力に値するかは、個人として、また社会として、私たち一人ひとりが決めるべきことである。` }
        ]
      ],
      vocab: ['navigation', 'mourn', 'automated', 'reliable', 'supervise', 'gradually', 'illustration', 'aviation', 'intuition', 'maintain', 'abandon', 'deliberately', 'insurance', 'capability', 'convenience', 'confine'],
      vocabExtra: [
        ['navigation', '名', '道案内; 航行; ナビゲーション', 2],
        ['mourn', '動', '〜を悼む; 〜を嘆き悲しむ', 3],
        ['automated', '形', '自動化された; 自動の', 2],
        ['supervise', '動', '〜を監督する; 〜を管理する', 3],
        ['intuition', '名', '直観; 直感', 3],
        ['capability', '名', '能力; 可能性', 2]
      ]
    }
  ]);

  /* ================================================================
   *  問題カード（15 枚）
   * ================================================================ */
  JK.registerProblems([
    /* ---------- 語彙 1: 空所補充（形の似た語） ---------- */
    {
      id: 'e-adv-vocab-01',
      subject: 'english',
      level: 'adv',
      unit: 'e-vocab',
      title: '語彙：空所補充（形の似た語）',
      source: SRC,
      time: 6,
      body: R`次の (1)〜(5) の英文の空所に入れるのに最も適切なものを、それぞれ選びなさい。`,
      fig: null,
      passage: null,
      parts: [
        {
          label: '(1)',
          q: R`The government announced a new package of measures to ( ) the damage that the drought has caused to farmers.`,
          type: 'choice', choices: ['mediate', 'militate', 'mitigate', 'meditate'], answer: 2,
          explain: R`**mitigate**（〜を和らげる、軽減する）が入ります。mitigate the damage で「被害を軽減する」という意味です。mediate は「〜を仲裁する」（mediate a dispute）、militate は自動詞で militate against ~（〜に不利に働く）、meditate は meditate on ~（〜をじっくり考える）または「瞑想する」で、いずれも the damage を直接の目的語にして「被害を和らげる」という意味にはなりません。mitigate は alleviate / lessen に近い語で、mitigate the effects of ~（〜の影響を緩和する）の形でよく使われます。`
        },
        {
          label: '(2)',
          q: R`Meteorologists warned that the arrival of the typhoon was ( ), and residents of the coastal area were told to evacuate at once.`,
          type: 'choice', choices: ['eminent', 'imminent', 'immense', 'immune'], answer: 1,
          explain: R`**imminent**（差し迫った、今にも起こりそうな）が入ります。「台風の到達が差し迫っている」→「ただちに避難するよう指示された」という流れです。eminent は「著名な、卓越した」（an eminent scholar）、immense は「巨大な」、immune は「免疫のある、（〜の）影響を受けない」（immune to ~）で、the arrival of the typhoon の状態を表す語として合いません。imminent と eminent（さらに immanent「内在する」）は、つづりも発音も似ているので、区別して覚えておきましょう。`
        },
        {
          label: '(3)',
          q: R`Cutting the budget for public transport will only ( ) the problem of traffic congestion rather than solve it.`,
          type: 'choice', choices: ['exaggerate', 'exasperate', 'exhilarate', 'exacerbate'], answer: 3,
          explain: R`**exacerbate**（〜を悪化させる）が入ります。「公共交通機関の予算を削ると、渋滞の問題を解決するどころか悪化させるだけだ」という文脈です。exaggerate は「〜を誇張する」、exasperate は「（人）をひどくいらだたせる」（目的語は人）、exhilarate は「〜を陽気にさせる、うきうきさせる」で、予算削減が問題に及ぼす影響を表せません。exacerbate は aggravate / worsen と同じ方向（悪化）の語で、(1) の mitigate（和らげる）とは反対の意味です。`
        },
        {
          label: '(4)',
          q: R`The scheme looked ( ) on paper, but it proved impossible to carry out in practice.`,
          type: 'choice', choices: ['feasible', 'futile', 'fertile', 'fragile'], answer: 0,
          explain: R`**feasible**（実行可能な、実現できそうな）が入ります。but 以下の「実際には実行不可能だった」と対比されるので、空所には「机上では実行可能に見えた」という肯定的な評価が必要です。futile は「むだな、効果のない」、fertile は「肥沃な、多産な」、fragile は「壊れやすい」で、but 以下とのつながりが成り立ちません。feasible は practicable / workable に近い語で、a feasible plan（実行可能な計画）の形で頻出します。反意語は infeasible（実行不可能な）です。`
        },
        {
          label: '(5)',
          q: R`No one has the right to ( ) physical pain on a child, whatever the child may have done.`,
          type: 'choice', choices: ['afflict', 'conflict', 'inflict', 'inflate'], answer: 2,
          explain: R`**inflict**（〜を（人・物に）与える、負わせる）が入ります。inflict A on B で「B に A（苦痛・損害など）を負わせる」という形をとり、inflict pain on ~ / inflict damage on ~ のように使います。afflict は「（病気・苦痛などが）〜を苦しめる」で、afflict A with B（A を B で苦しめる）の形をとるため、pain を目的語にして on a child とつなぐことはできません。conflict は「（〜と）衝突する」（自動詞）、inflate は「〜を膨らませる」で、意味が合いません。`
        }
      ],
      solution: [
        {
          t: '空所の前後から、品詞と語法を確かめる',
          n: R`(1) the damage を目的語にとる他動詞、(2) was の補語になる形容詞、(3) the problem を目的語にとる他動詞、(4) looked の補語になる形容詞、(5) pain を目的語にして on ~ を伴う他動詞、というように、まず空所に入る語の品詞と文型を決めます。4 つの選択肢は形が似ているので、意味だけでなく語法（自動詞か他動詞か、あとにどんな前置詞が続くか）でも絞り込めます。`,
          easy: R`形の似た語は、語の出だしではなく「語の中身（語根）」で区別します。たとえば mitigate は「穏やか（mit-）な状態にする」、exacerbate は「とげとげしく（acerb- = 苦い、きびしい）する」というイメージを持つと、反対の意味の語どうしも覚えやすくなります。`,
          pro: R`4 択の語がすべて同じ出だしのときは、まず文法的に成り立たないもの（目的語をとれない自動詞など）を外し、残りを文脈で決めます。語法で 2 択に絞れることが多く、時間の節約になります。`
        },
        {
          t: '文脈の手がかりで方向（よい・悪い）を決める',
          n: R`(2) は「ただちに避難するよう指示された」、(3) は「解決するどころか」、(4) は but 以下の「実際には不可能」との対比が決め手です。空所の語そのものがわからなくても、前後の語句が示す方向（肯定的か否定的か、強まるか弱まるか）を読めば、候補を絞れます。`,
          lv: 2
        },
        {
          t: '対になる語・混同しやすい語をセットで整理する',
          n: R`mitigate（和らげる）⇔ exacerbate（悪化させる）、feasible（実行可能な）⇔ infeasible（実行不可能な）、imminent（差し迫った）と eminent（著名な）の区別、inflict A on B と afflict B with A の語法の違い、というように、対比や型の違いをセットにして覚えておくと、混同しません。`,
          lv: 2
        }
      ],
      tags: ['空所補充', '語彙', '形の似た語', '語法', '難関大']
    },

    /* ---------- 語彙 2: 下線部に近い意味 ---------- */
    {
      id: 'e-adv-vocab-02',
      subject: 'english',
      level: 'adv',
      unit: 'e-vocab',
      title: '語彙：下線部に近い意味（難語）',
      source: SRC,
      time: 6,
      body: R`次の (1)〜(5) の英文の下線部の語に最も近い意味のものを、それぞれ選びなさい。`,
      fig: null,
      passage: null,
      parts: [
        {
          label: '(1)',
          q: R`Her __frugal__ lifestyle surprised her colleagues, who knew that she had inherited a large fortune from her uncle.`,
          type: 'choice', choices: ['thrifty', 'lavish', 'solitary', 'ordinary'], answer: 0,
          explain: R`**frugal** は「倹約的な、つましい」という意味で、thrifty が最も近い語です。「多額の遺産を相続したことを知っている同僚が、彼女の暮らしぶりに驚いた」という文脈から、「財産があるのに質素に暮らしている」と推測できます。lavish（ぜいたくな）は反対の意味、solitary は「孤独な、ひとりきりの」、ordinary は「ふつうの」で、frugal の言い換えにはなりません。名詞は frugality（倹約）です。`
        },
        {
          label: '(2)',
          q: R`The mayor tried to __placate__ the angry residents by promising to reconsider the plan.`,
          type: 'choice', choices: ['ignore', 'warn', 'inspire', 'calm'], answer: 3,
          explain: R`**placate** は「〜をなだめる、〜の怒りを静める」という意味で、calm（down）に最も近い語です。「計画を再検討すると約束して、怒った住民をなだめようとした」という文脈に合います。ignore は「〜を無視する」、warn は「〜に警告する」、inspire は「〜を奮い立たせる」で、怒っている相手に約束をする場面には合いません。pacify や appease も近い意味の語です。`
        },
        {
          label: '(3)',
          q: R`The two countries have agreed to __curtail__ military activity along their common border.`,
          type: 'choice', choices: ['expand', 'reduce', 'record', 'reveal'], answer: 1,
          explain: R`**curtail** は「〜を切り詰める、〜を削減する」という意味で、reduce に最も近い語です。「国境付近の軍事活動を〜することで両国が合意した」という文脈から、緊張を和らげる方向の「削減」だと推測できます。expand（〜を拡大する）は反対の意味、record は「〜を記録する」、reveal は「〜を明らかにする」で、合意の内容として不自然です。curtail は curt（簡潔な、短い）と同じ系統の語で、「短く切る」が原義です。`
        },
        {
          label: '(4)',
          q: R`The professor's argument was so __lucid__ that even first-year students could follow it without difficulty.`,
          type: 'choice', choices: ['lengthy', 'cautious', 'clear', 'original'], answer: 2,
          explain: R`**lucid** は「明快な、わかりやすい」という意味で、clear に最も近い語です。so ~ that ... の形で、「1 年生でもむりなく理解できるほど（明快だった）」と結果が示されています。lengthy は「長たらしい」、cautious は「慎重な」、original は「独創的な」で、「1 年生でも理解できる」という結果につながりません。lucid は「光る」を表す語根 luc- から来ていて、「見通しがよく明るい」というイメージです。`
        },
        {
          label: '(5)',
          q: R`The usually __reticent__ author spoke at length about his childhood in the interview.`,
          type: 'choice', choices: ['talkative', 'reserved', 'arrogant', 'popular'], answer: 1,
          explain: R`**reticent** は「口数の少ない、控えめな」という意味で、reserved に最も近い語です。usually（ふだんは）と spoke at length（長々と語った）が対比になっているので、「ふだんは寡黙な作家が、このときは珍しく長々と語った」と読み取れます。talkative は反対の意味（おしゃべりな）、arrogant は「傲慢な」、popular は「人気のある」で、spoke at length との対比になりません。`
        }
      ],
      solution: [
        {
          t: '知らない語でも、文脈の「論理を示す語」から意味を絞る',
          n: R`(1) は「多額の遺産を相続したことを知っているのに（同僚が）驚いた」という意外さ、(4) は so ~ that ... の結果、(5) は usually と spoke at length の対比のように、文中の論理を示す語句（逆接・対比・結果）が意味を決める手がかりです。下線部の語を知らなくても、選択肢のうち文脈に合うものは 1 つに絞れます。`,
          easy: R`下線部の意味が思い出せないときは、「この文で筆者が言いたいこと」を日本語で考えてみましょう。たとえば (5) は「ふだんは〜な作家が、長々と語った」という文なので、「ふだんは口数が少ない」という意味が入りそうだと予想できます。`,
          pro: R`同意語問題の選択肢には、反意語（lavish, talkative, expand）がしばしば混ぜてあります。反意語が見つかったら、それが正解の「反対側」にあたると確認して、消去に使いましょう。`
        },
        {
          t: '反意語とセットで覚える',
          n: R`frugal ⇔ lavish / extravagant、placate ⇔ provoke / enrage、curtail ⇔ expand / extend、lucid ⇔ obscure / vague、reticent ⇔ talkative / outspoken。反対の意味の語とペアで覚えておくと、文脈の「方向」から意味を絞りやすくなります。`,
          lv: 2
        },
        {
          t: '語根・派生語から意味を思い出す',
          n: R`lucid の luc- は「光」、curtail は「短く切る」、frugal は名詞 frugality、reticent は名詞 reticence（寡黙）のように、語根や派生語と結びつけておくと、初めて見る関連語（elucidate「〜を明らかにする」など）にも対応できます。`,
          lv: 2
        }
      ],
      tags: ['同意語', '語彙', '文脈から意味を推測', '難関大']
    },

    /* ---------- 語彙 3: 3 文に共通して入る語（多義語） ---------- */
    {
      id: 'e-adv-vocab-03',
      subject: 'english',
      level: 'adv',
      unit: 'e-vocab',
      title: '語彙：3 文に共通して入る語',
      source: SRC,
      time: 7,
      body: R`次の (1)〜(5) の各組の (a)(b)(c) の英文の空所には、形を変えずに同じ 1 語が入ります。その語を、与えられた頭文字で始まる英単語 1 語（原形）で答えなさい。`,
      fig: null,
      passage: null,
      parts: [
        {
          label: '(1)',
          q: R`（頭文字：a）
(a) The new president promised to ( ) the problem of unemployment without delay.
(b) She stood up to ( ) the audience.
(c) Please ( ) the envelope to the head of the sales department.`,
          type: 'text', answer: 'address', hint: '頭文字 a で始まる 1 語を半角英字で入力',
          explain: R`3 つの空所に共通して入るのは **address** です。(a) address the problem は「問題に取り組む」、(b) address the audience は「聴衆に向かって話す」、(c) address the envelope は「封筒に宛名を書く」という意味です。address の中心にあるイメージは「（人や物事に）向ける」で、そこから「宛名を書く」「（人に）話しかける」「（問題に）取り組む」という意味が出てきます。名詞の「住所」しか知らないと、動詞で使われているこの 3 文は解けません。`
        },
        {
          label: '(2)',
          q: R`（頭文字：b）
(a) I can't ( ) the sight of blood.
(b) The old bridge cannot ( ) the weight of a heavy truck.
(c) The two brothers ( ) a strong resemblance to each other.`,
          type: 'text', answer: 'bear', hint: '頭文字 b で始まる 1 語を半角英字で入力',
          explain: R`3 つの空所に共通して入るのは **bear** です。(a) cannot bear the sight of blood は「血を見るのに耐えられない」、(b) cannot bear the weight は「重さを支えられない」、(c) bear a strong resemblance to ~ は「〜とよく似ている」という意味です。bear の中心は「（重みを）支える」で、そこから「（苦痛などに）耐える」「（特徴・名前・責任などを）帯びる、もつ」へ広がります。活用は bear - bore - borne です。`
        },
        {
          label: '(3)',
          q: R`（頭文字：d）
(a) The new museum is expected to ( ) large crowds from all over the country.
(b) The teacher's question failed to ( ) any response from the class.
(c) She stopped for a moment to ( ) a deep breath.`,
          type: 'text', answer: 'draw', hint: '頭文字 d で始まる 1 語を半角英字で入力',
          explain: R`3 つの空所に共通して入るのは **draw** です。(a) draw large crowds は「大勢の客を引きつける」、(b) draw a response は「反応を引き出す」、(c) draw a deep breath は「深く息を吸い込む」という意味です。draw の中心は「引く」で、「（人を）引きつける」「（反応・情報などを）引き出す」「（息を）吸い込む」「（線・絵を）描く」へ広がります。draw - drew - drawn と活用する不規則動詞です。`
        },
        {
          label: '(4)',
          q: R`（頭文字：f）
(a) Share prices began to ( ) as soon as the news was announced.
(b) My birthday will ( ) on a Sunday this year.
(c) The general knew that the city would ( ) to the enemy within a week.`,
          type: 'text', answer: 'fall', hint: '頭文字 f で始まる 1 語を半角英字で入力',
          explain: R`3 つの空所に共通して入るのは **fall** です。(a) fall は「（価格が）下がる」、(b) fall on a Sunday は「（日付が）日曜日にあたる」、(c) fall to the enemy は「敵の手に落ちる、陥落する」という意味です。fall は「落ちる」が中心で、「（日付が）あたる」「（都市・要塞が）攻め落とされる」へ広がります。(b) の fall on ~ は、誕生日や祝日が「何曜日にあたるか」を言うときの決まった言い方です。`
        },
        {
          label: '(5)',
          q: R`（頭文字：h）
(a) The new stadium can ( ) more than fifty thousand spectators.
(b) My offer will still ( ) if you decide to accept it next week.
(c) The committee will ( ) a public hearing next month.`,
          type: 'text', answer: 'hold', hint: '頭文字 h で始まる 1 語を半角英字で入力',
          explain: R`3 つの空所に共通して入るのは **hold** です。(a) hold ~ spectators は「〜人の観客を収容できる」、(b) The offer will hold は「申し出が有効である」、(c) hold a hearing は「公聴会を開く」という意味です。hold は「持つ」が中心で、「収容する」「（約束・規則などが）有効である」「（会などを）開催する」へ広がります。(b) の hold は自動詞で、hold true / hold good（あてはまる）の形もよく使われます。`
        }
      ],
      solution: [
        {
          t: '3 つの文のうち、自信のある文から候補を出して、残りで確かめる',
          n: R`まず (a)(b)(c) のそれぞれについて、空所に入る語の日本語訳を、目的語や前置詞から推測します。たとえば (2) は「血を見るのに（耐える）」「重さを（支える）」「よく似ている点を（もつ）」のように、3 文で日本語訳が異なります。訳が違っても同じ 1 語が 3 文すべてに入るので、「よく知っている基本語の、別の意味」を探す問題だとわかります。`,
          easy: R`この形式の問題は、「よく知っている簡単な単語に、じつは知らない意味がある」ことを見抜く練習です。たとえば fall は「落ちる」だけでなく、「（日付が）〜にあたる」という意味もあります。3 つの文のうち、答えやすい 1 文から候補を出し、ほかの 2 文に入れて確かめましょう。`,
          pro: R`頭文字が与えられているので、候補は多くありません。1 文目で候補を 2〜3 個あげ、2 文目・3 文目で消去すると速く解けます。`
        },
        {
          t: '多義語は「中心イメージ」からつなげて覚える',
          n: R`address は「向ける」、bear は「支える」、draw は「引く」、fall は「落ちる」、hold は「持つ」が中心のイメージで、そこから複数の意味が派生しています。意味を 1 つずつ暗記するのではなく、中心のイメージと、よく使われる結びつき（address the audience、bear a resemblance、draw a breath、fall on a Sunday、hold a hearing）をセットで覚えておきましょう。`,
          lv: 2
        },
        {
          t: '形を最後に確認する',
          n: R`空所に入れた語を 3 文それぞれに入れ直して、文法的に正しいかを確認します。今回は空所の直前が to・助動詞・複数の主語・命令文（Please ~）のいずれかなので、すべて原形が入ります。`,
          lv: 2
        }
      ],
      tags: ['多義語', '共通語補充', '語彙', '英単語の別の意味', '難関大']
    },

    /* ---------- 熟語 1: 句動詞・動詞句の空所補充 ---------- */
    {
      id: 'e-adv-idiom-01',
      subject: 'english',
      level: 'adv',
      unit: 'e-idiom',
      title: '熟語：句動詞・動詞句の空所補充',
      source: SRC,
      time: 6,
      body: R`次の (1)〜(5) の英文の空所に入れるのに最も適切なものを、それぞれ選びなさい。`,
      fig: null,
      passage: null,
      parts: [
        {
          label: '(1)',
          q: R`Their plan to open a branch in London ( ) when the bank refused to lend them any more money.`,
          type: 'choice', choices: ['fell through', 'fell for', 'fell back', 'fell off'], answer: 0,
          explain: R`**fall through**（（計画・取引などが）失敗に終わる、実現しない）の過去形 fell through が入ります。「銀行がそれ以上の融資を断ったので、ロンドン支店を開く計画は実現しなかった」という意味です。fall back は「後退する、（〜に）頼る」（fall back on ~）、fall for は「〜にだまされる、〜に夢中になる」、fall off は「（数量・成績などが）落ちる」で、plan を主語にして「計画が頓挫した」という意味にはなりません。`
        },
        {
          label: '(2)',
          q: R`The company has decided to ( ) its older models and concentrate on electric cars.`,
          type: 'choice', choices: ['pass out', 'pick out', 'point out', 'phase out'], answer: 3,
          explain: R`**phase out**（〜を段階的に廃止する）が入ります。「古いモデルの生産を段階的にやめて、電気自動車に力を入れる」という文脈です。pass out は「気を失う、〜を配る」、pick out は「〜を選び出す」、point out は「〜を指摘する」で、older models を目的語にして「やめる」という意味にはなりません。反対の意味の句動詞は phase in（〜を段階的に導入する）です。`
        },
        {
          label: '(3)',
          q: R`We can't ( ) on the weather staying fine for the whole week, so we had better prepare for rain.`,
          type: 'choice', choices: ['dwell', 'bank', 'touch', 'hold'], answer: 1,
          explain: R`**bank on ~**（〜をあてにする）が入ります。「1 週間ずっと晴れるとは当てにできないので、雨に備えたほうがよい」という意味で、count on ~ / rely on ~ と同じ意味です。dwell on ~ は「〜についてくよくよ考える」、touch on ~ は「〜に軽く触れる」、hold on は「待つ、持ちこたえる」で、「天気が晴れ続けることをあてにする」という意味にはなりません。bank on ~ のあとには、名詞のほか、このように「名詞 + 動名詞」の形も続けられます。`
        },
        {
          label: '(4)',
          q: R`You should ( ) your grammar before the entrance examination, since you made so many careless mistakes in the last mock test.`,
          type: 'choice', choices: ['cut down on', 'put up with', 'brush up on', 'look up to'], answer: 2,
          explain: R`**brush up on ~**（〜を磨き直す、〜を復習して勘を取り戻す）が入ります。「前回の模擬試験でうっかりミスが多かったので、入試前に文法を復習し直すべきだ」という意味です。cut down on ~ は「〜を減らす」、put up with ~ は「〜を我慢する」、look up to ~ は「〜を尊敬する」で、grammar を目的語にして文意が通るものはありません。brush up (on) は、いちど身につけたことの「さびを落とす」イメージの表現です。`
        },
        {
          label: '(5)',
          q: R`A good coach knows how to ( ) the best in every player.`,
          type: 'choice', choices: ['bring out', 'bring up', 'bring in', 'bring about'], answer: 0,
          explain: R`**bring out the best in ~**（〜の最もよい面を引き出す）という決まった言い方です。bring out は「〜を引き出す、〜を出版する」で、the best in every player（どの選手にもある最善の力）を目的語にします。bring up は「〜を育てる、〜（話題）を持ち出す」、bring in は「〜を導入する、〜（収入）をもたらす」、bring about は「〜を引き起こす」で、いずれも the best in ~ とは結びつきません。`
        }
      ],
      solution: [
        {
          t: '句動詞は「動詞 + 小辞」それぞれのイメージで意味を決める',
          n: R`(1) fall through は fall（落ちる）+ through（突き抜けて）で「底を抜けて落ちる → 計画が頓挫する」、(2) phase out は phase（段階）+ out（外へ）で「段階的に外へ出す → 廃止する」、(5) bring out は「奥にあるものを外へ引き出す」のように、動詞と小辞（前置詞・副詞）それぞれのイメージから意味を組み立てます。`,
          easy: R`句動詞は丸暗記だと大変ですが、out は「外へ出す・出尽くす」、up は「上へ・完全に」、down は「下へ・減らす」、through は「通り抜けて・最後まで」のように、小辞ごとにイメージが決まっています。たとえば bring out は「持ってくる + 外へ」→「外へ引き出す」です。`,
          pro: R`句動詞の空所補充では、目的語や主語の意味（older models, grammar, the best in ~, plan）が決め手になることが多くあります。目的語と自然に結びつくかを 1 つずつ確認し、結びつかない選択肢を消去します。`
        },
        {
          t: '空所の外に出ている小辞も手がかりにする',
          n: R`(3) は on が空所の外に出ているので、「動詞 + on」で成り立つものを選びます。bank on ~（〜をあてにする）のほか、dwell on ~（〜をくよくよ考える）、touch on ~（〜に軽く触れる）も「動詞 + on」ですが、「天気が晴れ続けることを当てにする」という文脈に合うのは bank on だけです。(4) のように選択肢が小辞まで含む場合は、cut down on / brush up on / look up to の最後の小辞まで、正確に覚えておく必要があります。`,
          lv: 2
        },
        {
          t: '類義の表現をまとめて覚える',
          n: R`あてにする: bank on ≒ count on ≒ rely on ≒ depend on、段階的に廃止する: phase out ≒ do away with（〜を廃止する）、復習し直す: brush up on ≒ review、実現しない: fall through ≒ come to nothing。1 つの意味に複数の言い方がある表現は、言い換え問題や英作文でも使えるので、まとめて整理しておきましょう。`,
          lv: 2
        }
      ],
      tags: ['句動詞', '空所補充', '熟語', '難関大']
    },

    /* ---------- 熟語 2: 群前置詞・副詞句の言い換え ---------- */
    {
      id: 'e-adv-idiom-02',
      subject: 'english',
      level: 'adv',
      unit: 'e-idiom',
      title: '熟語：群前置詞・副詞句の言い換え',
      source: SRC,
      time: 6,
      body: R`次の (1)〜(5) の英文の下線部に最も近い意味のものを、それぞれ選びなさい。`,
      fig: null,
      passage: null,
      parts: [
        {
          label: '(1)',
          q: R`The outdoor festival was cancelled __in the wake of__ the typhoon.`,
          type: 'choice', choices: ['in spite of', 'in place of', 'as a result of', 'on behalf of'], answer: 2,
          explain: R`**in the wake of ~** は「〜の結果として、〜に続いて」という意味で、as a result of ~ に最も近い表現です。wake は船が通ったあとに残る「航跡」のことで、「（出来事の）あとに続いて」というイメージです。「台風の結果として、野外フェスティバルが中止された」となります。in spite of ~ は「〜にもかかわらず」、in place of ~ は「〜の代わりに」、on behalf of ~ は「〜を代表して」で、いずれも文意に合いません。`
        },
        {
          label: '(2)',
          q: R`She advanced her career __at the expense of__ her family life.`,
          type: 'choice', choices: ['for the sake of', 'in support of', 'by sacrificing', 'on account of'], answer: 2,
          explain: R`**at the expense of ~** は「〜を犠牲にして」という意味で、by sacrificing に最も近い表現です。「家庭生活を犠牲にして、仕事の経歴を伸ばした」となります。for the sake of ~ は「〜のために」で、at the expense of ~ とほぼ反対の関係になる点に注意しましょう。in support of ~ は「〜を支持して」、on account of ~ は「〜が原因で」で、どちらも合いません。`
        },
        {
          label: '(3)',
          q: R`The old theory has been __all but__ abandoned by researchers.`,
          type: 'choice', choices: ['almost', 'entirely', 'hardly', 'partly'], answer: 0,
          explain: R`**all but ~** は「ほとんど〜（形容詞・過去分詞など）」という意味で、almost に最も近い表現です。「その古い理論は、研究者たちにほとんど見捨てられている」となります。all but のあとに名詞が来る場合は「〜以外すべて」の意味になる（all but one = 1 つを除いてすべて）ので、混同しないようにしましょう。entirely は「完全に」、hardly は「ほとんど〜ない」、partly は「部分的に」で、いずれも「ほぼ見捨てられた」という意味にはなりません。`
        },
        {
          label: '(4)',
          q: R`His explanation was __anything but__ convincing, and nobody in the room believed him.`,
          type: 'choice', choices: ['nothing but', 'more or less', 'none other than', 'by no means'], answer: 3,
          explain: R`**anything but ~** は「決して〜ではない」という意味で、by no means に最も近い表現です。「彼の説明は決して説得力のあるものではなく、部屋にいただれも彼を信じなかった」となります。nothing but ~ は「〜にすぎない、〜だけ」（= only）で、anything but とは意味が大きく異なります。more or less は「多かれ少なかれ」、none other than ~ は「ほかならぬ〜」で、この文には合いません。`
        },
        {
          label: '(5)',
          q: R`She sent flowers __in lieu of__ attending the funeral.`,
          type: 'choice', choices: ['in addition to', 'on behalf of', 'regardless of', 'instead of'], answer: 3,
          explain: R`**in lieu of ~** は「〜の代わりに」という意味で、instead of ~ に最も近い表現です。「葬儀に出席する代わりに、花を送った」となります。in addition to ~ は「〜に加えて」、on behalf of ~ は「〜を代表して」（in place of ~ と取り違えやすい）、regardless of ~ は「〜にかかわらず」で、いずれも文意に合いません。lieu はフランス語由来で「場所」を表し、in lieu of は in place of とほぼ同じ構成の表現です。`
        }
      ],
      solution: [
        {
          t: '熟語の中の名詞のイメージから、意味を推測する',
          n: R`wake（航跡）、expense（費用・犠牲）、lieu（場所）のように、熟語の中心にある名詞のイメージから意味を推測します。in the wake of ~ は「〜が通った跡に」、at the expense of ~ は「〜を費用（犠牲）にして」、in lieu of ~ は「〜の場所に」と、1 語ずつ分解して考えます。`,
          easy: R`熟語は、1 語ずつ日本語にしてみると意外とわかります。at the expense of ~ は「〜という費用を払って」→「〜を犠牲にして」、in the wake of ~ は「〜の航跡の中で」→「〜に続いて」というふうに、元のイメージがそのまま意味になっています。`,
          pro: R`言い換え問題では、紛らわしい「意味が正反対の熟語」（at the expense of ⇔ for the sake of、nothing but ⇔ anything but）が選択肢に混ぜてあります。反対の意味の熟語とセットで整理しておくと、確実に消去できます。`
        },
        {
          t: '紛らわしい all but / anything but / nothing but を区別する',
          n: R`all but ~ = ほとんど〜（almost）、anything but ~ = 決して〜ない（by no means）、nothing but ~ = 〜だけ、〜にすぎない（only）。3 つとも「〜でないもの」を意味しそうに見えますが、nothing but だけが肯定の意味で、anything but は否定の意味で使われます。(3) と (4) は、この 3 つを区別できるかを確かめる設問です。`,
          lv: 2
        },
        {
          t: '類義の群前置詞をまとめて覚える',
          n: R`原因・結果: in the wake of ≒ as a result of ≒ in consequence of、代わりに: in lieu of ≒ in place of ≒ instead of、犠牲にして: at the expense of ≒ to the detriment of、目的: for the sake of ≒ for the benefit of。「in + 名詞 + of」「at the + 名詞 + of」の形の群前置詞は、まとめて整理しておくと長文でも役立ちます。`,
          lv: 2
        }
      ],
      tags: ['熟語', '群前置詞', '言い換え', 'all but', 'anything but', '難関大']
    },

    /* ---------- 文法 1: 仮定法 ---------- */
    {
      id: 'e-adv-grammar-01',
      subject: 'english',
      level: 'adv',
      unit: 'e-grammar',
      title: '文法：仮定法（倒置・混合・時制）',
      source: SRC,
      time: 7,
      body: R`次の (1)〜(5) の英文の空所に入れるのに最も適切なものを、それぞれ選びなさい。`,
      fig: null,
      passage: null,
      parts: [
        {
          label: '(1)',
          q: R`( ) your timely advice, I would have made a serious mistake.`,
          type: 'choice', choices: ['If it were not for', 'Had it not been for', 'If it had been for', 'Were it not for'], answer: 1,
          explain: R`**Had it not been for ~**（もし〜がなかったら）が入ります。これは If it had not been for ~ の if を省略して倒置した形で、**過去の事実に反する仮定**を表します。主節が would have made（仮定法過去完了）なので、条件節も過去完了の形にそろえます。If it were not for ~ / Were it not for ~ は「（今）〜がなければ」という現在の仮定を表し、主節は would + 原形になります。If it had been for ~ という形はありません。`
        },
        {
          label: '(2)',
          q: R`If I had followed my teacher's advice at that time, I ( ) in such trouble now.`,
          type: 'choice', choices: ['would not have been', 'will not be', 'would not be', 'had not been'], answer: 2,
          explain: R`**would not be** が入ります。条件節は at that time（過去）の事実に反する仮定なので If I had followed（仮定法過去完了）、主節は now（現在）の結果なので would + 原形（仮定法過去）の形になります。このように、条件節と主節の時が異なる仮定法を**混合仮定法**といいます。would not have been は主節も過去の結果になるので now と合わず、will not be は仮定法ではなく単なる未来の予測、had not been は主節にできない形です。`
        },
        {
          label: '(3)',
          q: R`( ) anyone call while I am out, please ask them to leave a message.`,
          type: 'choice', choices: ['Should', 'Would', 'Were', 'Had'], answer: 0,
          explain: R`**Should** が入ります。If anyone should call の if を省略して should を文頭に出した倒置形で、「万が一〜したら」という実現の可能性が低い未来の仮定を表します。主節に please ~ のような命令文や、will / can などがくることもあります。Were は were to ~ や be 動詞の仮定法過去（Were I you, ...）、Had は過去完了（Had I known, ...）の倒置に使うので、原形の call の前には置けません。Would を文頭に置くと疑問文になってしまいます。`
        },
        {
          label: '(4)',
          q: R`The old man looked at me as though he ( ) me somewhere before, but he could not remember where.`,
          type: 'choice', choices: ['saw', 'would see', 'has seen', 'had seen'], answer: 3,
          explain: R`**had seen** が入ります。as if / as though のあとは、事実とは違う（または確かでない）ことを想像する仮定法で、主節の動詞（looked）と同じ時のことなら過去形、それより前のことなら過去完了形（had + 過去分詞）を使います。ここでは、老人が私を見た時点より前に「どこかで私を見たことがある」ようすなので、had seen になります。saw は主節と同じ時点のことになるので before と合わず、would see は未来、has seen は現在完了で、主節の過去形 looked と時制が合いません。`
        },
        {
          label: '(5)',
          q: R`The latest survey suggests that most citizens ( ) in favor of the plan at present.`,
          type: 'choice', choices: ['be', 'were', 'are', 'should be'], answer: 2,
          explain: R`**are** が入ります。suggest には 2 つの意味があります。①「提案する」のときは that 節の中が仮定法現在（原形、または should + 原形）になります（He suggested that she be present.）。②「〜を示している、〜を暗示する」のときは、that 節の中は事実をそのまま述べる直説法になります。ここでは主語が the latest survey（調査結果）で、at present（現在のところ）があるので②の意味であり、現在の事実を表す are が入ります。`
        }
      ],
      solution: [
        {
          t: '仮定法の「時」と「形」を対応させる',
          n: R`まず、条件節と主節それぞれが「いつのことか」を読み取り、仮定法の形に当てはめます。仮定法過去は If + 過去形, would + 原形（現在の事実に反する仮定）、仮定法過去完了は If + had + 過去分詞, would have + 過去分詞（過去の事実に反する仮定）です。(2) のように now などの時を表す語があると、主節の形が変わる混合仮定法になります。`,
          easy: R`仮定法は、「事実とは違うことを想像する」ための文法です。英語は、事実からの「距離」を時制をずらして表します。現在の想像は過去形、過去の想像は過去完了形というように、時制を 1 つ「さかのぼらせる」と覚えましょう。`,
          pro: R`倒置形（Had S + 過去分詞 / Were S ~ / Should S + 原形）は、if を省略するかわりに助動詞を文頭に出します。文頭の語と、そのあとに続く形を見れば、どの倒置かを一瞬で判断できます。`
        },
        {
          t: '倒置の 3 パターンを見分ける',
          n: R`Had + S + 過去分詞（仮定法過去完了）、Were + S ~（仮定法過去の be 動詞、または were to ~）、Should + S + 原形（未来の万が一）の 3 つです。(1) は Had it not been for ~、(3) は Should anyone call のように、文頭の語のあとに続く形で見分けます。`,
          lv: 2
        },
        {
          t: '時制のずれと、動詞の意味による形の違いに注意する',
          n: R`(4) の as if / as though のあとの仮定法は、主節と同じ時のことなら過去形、主節より前のことなら過去完了形にします。また (5) の suggest は、2 つの意味（「提案する」→ 仮定法現在、「示唆する」→ 直説法）で that 節の形が変わります。「提案・要求・命令を表す動詞（suggest, insist, demand, propose など）のあとの that 節は原形」が原則ですが、同じ動詞でも「事実を述べる」意味のときは直説法になる点に注意しましょう。`,
          lv: 2
        }
      ],
      tags: ['仮定法', '倒置', '混合仮定法', 'as if', 'suggest', '難関大']
    },

    /* ---------- 文法 2: 倒置・省略・強調 ---------- */
    {
      id: 'e-adv-grammar-02',
      subject: 'english',
      level: 'adv',
      unit: 'e-grammar',
      title: '文法：倒置・省略・強調',
      source: SRC,
      time: 7,
      body: R`次の (1)〜(5) の英文の空所に入れるのに最も適切なものを、それぞれ選びなさい。`,
      fig: null,
      passage: null,
      parts: [
        {
          label: '(1)',
          q: R`Only after the typhoon had passed ( ) leave the shelter.`,
          type: 'choice', choices: ['the villagers were able to', 'were able the villagers to', 'were the villagers able to', 'did the villagers able to'], answer: 2,
          explain: R`**were the villagers able to** が入ります。Only + 副詞（句・節）が文頭に出ると、そのあとの主節は疑問文の語順（助動詞・be 動詞 + 主語）に倒置します。ここでは Only after the typhoon had passed が文頭にあるので、主節は were the villagers able to leave ~ となります。the villagers were able to は倒置していない形、were able the villagers to は語順が不自然、did the villagers able to は did と able を並べることができないので、いずれも誤りです。`
        },
        {
          label: '(2)',
          q: R`Hardly had the concert begun ( ) it started to rain.`,
          type: 'choice', choices: ['than', 'when', 'that', 'while'], answer: 1,
          explain: R`**when** が入ります。Hardly（Scarcely）+ had + S + 過去分詞 ... when（before）~ で「…するかしないうちに〜した」という意味になります。No sooner + had + S + 過去分詞 ... than ~ も同じ意味ですが、than と when を取り違えやすいので、Hardly / Scarcely には when（before）、No sooner には than、と対応を覚えておきましょう。文頭に Hardly があるので had the concert begun と倒置しています。`
        },
        {
          label: '(3)',
          q: R`So rapidly ( ) that even the engineers could hardly keep up with it.`,
          type: 'choice', choices: ['the technology advanced', 'the technology did advance', 'does the technology advance', 'did the technology advance'], answer: 3,
          explain: R`**did the technology advance** が入ります。so + 副詞（形容詞）が文頭に出ると、そのあとが倒置します（So rapidly did the technology advance that ~）。本来の語順は The technology advanced so rapidly that ~ で、一般動詞の過去形 advanced は、倒置では did + 原形の形に変わります。the technology advanced / the technology did advance は倒置していない形、does the technology advance は現在形で、後ろの could hardly と時制が合いません。`
        },
        {
          label: '(4)',
          q: R`It was not until she was thirty ( ) she published her first novel.`,
          type: 'choice', choices: ['when', 'then', 'that', 'which'], answer: 2,
          explain: R`**that** が入ります。It is not until ~ that ... は、強調構文（It is ... that ~）の一種で、「〜になって初めて…する」という意味を表します。ここでは she published her first novel の前に that を置き、「30 歳になって初めて最初の小説を出版した」という意味になります。when / then / which は、強調構文の that の代わりにはなりません。（Not until she was thirty did she publish her first novel. と倒置で書き換えることもできます。）`
        },
        {
          label: '(5)',
          q: R`He seldom, if ( ), goes out on weekdays.`,
          type: 'choice', choices: ['ever', 'any', 'once', 'much'], answer: 0,
          explain: R`**ever** が入ります。seldom, if ever, ... は「たとえあるとしても、めったに〜ない」という意味の省略表現で、He seldom goes out on weekdays, if he ever does. の後半が省略された形です。同じ型で、rarely, if ever（めったに〜ない）、few, if any（〜はほとんどない）、little, if any ... のように、「頻度・回数」には ever、「数・量」には any を使います。ここでは頻度を表す seldom と対応するので ever が正解です。`
        }
      ],
      solution: [
        {
          t: 'まず文頭の語句を見て、倒置するかどうかを判断する',
          n: R`文頭に否定・制限の意味の副詞（句・節）が出ると、そのあとが疑問文の語順になります。代表的なものは、Never / Rarely / Seldom / Little / Hardly / Scarcely / No sooner / Not only / Only + 副詞（句・節）/ Not until ~ / So + 形容詞（副詞）~ です。(1) の Only after ~ や、(3) の So rapidly のあとが倒置になることを確認します。`,
          easy: R`倒置とは、「主語 + 動詞」の順を「動詞（助動詞・be 動詞）+ 主語」の順に入れ替えることです。否定の意味の語を文頭に出して目立たせるとき、英語は「疑問文の形」に変えるきまりがあります。たとえば Hardly had the concert begun ... は、本来 The concert had hardly begun ... の語順です。`,
          pro: R`倒置を含む整序・空所補充では、「倒置するかしないか」と「助動詞の選択（do / did / have / be）」の 2 点が問われます。助動詞は、元の文の時制（過去なら did、完了なら had / have、進行・受動なら be）をそのまま引き継ぎます。`
        },
        {
          t: '対になる接続の形を覚える',
          n: R`Hardly / Scarcely ... when（before）、No sooner ... than、Not only ... but (also) ...、It is not until ... that ... のように、前半と後半がセットになった表現は、後半の語（when か than か that か）を、前半の語から決めます。(2) では Hardly があるので when、(4) では It was not until があるので that です。`,
          lv: 2
        },
        {
          t: '省略表現の型を覚える',
          n: R`(5) の seldom, if ever / few, if any / little, if any は、「あるとしても〜」という意味の挿入句です。ever は「頻度」、any は「数・量」と結びつけて覚えましょう。そのほか、if necessary（必要なら）、if possible（可能なら）のように、if / when / while / though のあとの「主語 + be 動詞」が省略されることもあります。`,
          lv: 2
        }
      ],
      tags: ['倒置', '強調構文', '省略', 'Only', 'Hardly ~ when', '難関大']
    },

    /* ---------- 文法 3: 準動詞 ---------- */
    {
      id: 'e-adv-grammar-03',
      subject: 'english',
      level: 'adv',
      unit: 'e-grammar',
      title: '文法：準動詞（分詞・動名詞・不定詞）',
      source: SRC,
      time: 7,
      body: R`次の (1)〜(5) の英文の空所に入れるのに最も適切なものを、それぞれ選びなさい。`,
      fig: null,
      passage: null,
      parts: [
        {
          label: '(1)',
          q: R`( ) from a distance, the rock looks like a human face.`,
          type: 'choice', choices: ['Seeing', 'Seen', 'To see', 'Having seen'], answer: 1,
          explain: R`**Seen** が入ります。分詞構文の意味上の主語は、主節の主語 the rock です。岩は「見られる」側なので、受け身の意味の過去分詞（Being seen の being が省略された形）を使います。Seeing は「見る」という能動の意味になり、「岩が見る」ことになってしまいます。To see は不定詞で、Having seen は完了形の能動の分詞構文なので、どちらも「岩が見られる」という受け身の意味を表せません。Seen from a distance, ... は「遠くから見ると、〜」という決まった言い方です。`
        },
        {
          label: '(2)',
          q: R`All things ( ), his proposal seems reasonable.`,
          type: 'choice', choices: ['considered', 'considering', 'to consider', 'having considered'], answer: 0,
          explain: R`**considered** が入ります。All things considered（すべてを考慮すると、全体として見れば）は、独立分詞構文（分詞の意味上の主語が主節の主語と異なる分詞構文）から生まれた決まった言い方です。「すべてのことが考慮されると」という受け身の関係なので、過去分詞を使います。同じように慣用化した分詞構文に、Generally speaking（一般的に言えば）、Judging from ~（〜から判断すると）、Weather permitting（天気がよければ）などがあります。`
        },
        {
          label: '(3)',
          q: R`We regret ( ) you that your application has not been successful.`,
          type: 'choice', choices: ['informing', 'to inform', 'to have informed', 'having informed'], answer: 1,
          explain: R`**to inform** が入ります。regret to do は「残念ながら〜する」（これから伝える内容を残念に思いながら述べる）という意味で、We regret to inform you that ~（残念ながら〜をお知らせします）は、不合格通知などで使う定型表現です。一方、regret doing は「〜したことを後悔する」という意味で、過去の行為を指します。informing / to have informed / having informed は、すでに知らせたことへの後悔を表すので、ここでは合いません。`
        },
        {
          label: '(4)',
          q: R`The students complained about ( ) too much homework by the new teacher.`,
          type: 'choice', choices: ['giving', 'given', 'to be given', 'being given'], answer: 3,
          explain: R`**being given** が入ります。前置詞 about の後ろなので動名詞にします。意味上の主語である the students は宿題を「出される」側なので、受動態の動名詞 being given（being + 過去分詞）にします。giving は「出す」という能動の意味、given は動名詞にならない過去分詞、to be given は不定詞なので、前置詞のあとには置けません。by the new teacher があることも受け身の手がかりです。`
        },
        {
          label: '(5)',
          q: R`The old bridge is said ( ) built in the fifteenth century.`,
          type: 'choice', choices: ['to be', 'to have', 'to have been', 'having been'], answer: 2,
          explain: R`**to have been** が入ります。It is said that the old bridge was built in the fifteenth century. を、主語を the old bridge にして書き換えた形です。「言われている」より、「建てられた」のほうが時が前（過去）です。述語動詞より前の時を表すには、完了不定詞（to have + 過去分詞）を使います。ここでは受け身（was built）なので、to have been built になります。to be built は「言われている時点と同時、または未来」を表し、to have built は能動の形になるので、いずれも合いません。having been は不定詞ではなく分詞なので、is said のあとに置けません。`
        }
      ],
      solution: [
        {
          t: '準動詞の「意味上の主語」と「受け身かどうか」を確認する',
          n: R`分詞・動名詞・不定詞を選ぶときは、まず、その準動詞の「意味上の主語」が何かを確認します。(1) は主節の主語 the rock が「見られる」側なので過去分詞、(4) は the students が「出される」側なので being given、のように、主語との関係が能動なら -ing、受け身なら過去分詞（being + 過去分詞）です。`,
          easy: R`「〜している」の意味なら -ing、「〜される・〜された」の意味なら過去分詞（受け身）が基本です。その -ing や過去分詞の動作を「する人・される人」はだれなのかを、文の主語と結びつけて考えましょう。`,
          pro: R`分詞構文では「主節の主語 = 分詞の意味上の主語」が原則です。違う主語を立てるときは独立分詞構文（Weather permitting など）にしますが、入試で出るのは、ほぼ慣用表現（All things considered, Judging from ~ など）に限られます。`
        },
        {
          t: '時のずれは完了形で表す',
          n: R`述語動詞より前の出来事は、完了不定詞（to have + 過去分詞）や完了動名詞・完了分詞（having + 過去分詞）で表します。(5) では「言われている」時より「建てられた」時が前なので to have been built です。(1) の Having seen のように、完了形にすると「主節より前の動作」の意味になる点も確認しておきましょう。`,
          lv: 2
        },
        {
          t: 'to 不定詞と動名詞で意味が変わる動詞を押さえる',
          n: R`regret to do（残念ながら〜する）⇔ regret doing（〜したことを後悔する）、remember / forget to do（〜することを覚えている・忘れる）⇔ remember / forget doing（〜したことを覚えている・忘れる）、stop to do（〜するために立ち止まる）⇔ stop doing（〜するのをやめる）のように、to 不定詞は「これから」、動名詞は「すでに」というイメージで意味が変わります。(3) のように、定型表現とセットで整理しておきましょう。`,
          lv: 2
        }
      ],
      tags: ['準動詞', '分詞構文', '動名詞', '完了不定詞', 'regret to do', '難関大']
    },

    /* ---------- 文法 4: 関係詞・比較・語法 ---------- */
    {
      id: 'e-adv-grammar-04',
      subject: 'english',
      level: 'adv',
      unit: 'e-grammar',
      title: '文法：関係詞・比較・語法',
      source: SRC,
      time: 7,
      body: R`次の (1)〜(5) の英文の空所に入れるのに最も適切なものを、それぞれ選びなさい。`,
      fig: null,
      passage: null,
      parts: [
        {
          label: '(1)',
          q: R`( ) surprised me was not the high price of the goods but their poor quality.`,
          type: 'choice', choices: ['That', 'Which', 'It', 'What'], answer: 3,
          explain: R`**What** が入ります。関係代名詞 what は「〜するもの、〜すること」という意味の名詞節を作り、ここでは What surprised me（私を驚かせたこと）が文全体の主語になります。That surprised me は、それだけで主語・動詞のそろった節になってしまい、後ろの was につながりません。Which や It も同様に、「〜したこと」という意味の名詞節を作れないので、文頭に置いて was の主語にすることはできません。`
        },
        {
          label: '(2)',
          q: R`The museum has over two thousand paintings, most of ( ) were donated by private collectors.`,
          type: 'choice', choices: ['which', 'them', 'whom', 'what'], answer: 0,
          explain: R`**which** が入ります。「数量表現 + of + 関係代名詞」の形（most of which など）は、前の節（The museum has over two thousand paintings）に補足を加える非制限用法の関係節を作ります。先行詞が paintings（物）なので which を使い、most of which は「そのうちのほとんど」という意味です。them を使うと、カンマだけで 2 つの節がつながってしまい（接続詞が必要になるので）誤りです。whom は先行詞が人のときに使い、what は先行詞を含む関係代名詞なので、先行詞 paintings の後ろには置けません。`
        },
        {
          label: '(3)',
          q: R`Mr. Tanaka is the only one of the teachers who ( ) never been late for class.`,
          type: 'choice', choices: ['have', 'has', 'having', 'to have'], answer: 1,
          explain: R`**has** が入ります。who の先行詞は、of the teachers ではなく the only one（単数）なので、関係節の動詞も単数の has になります。the only one of the teachers who has ... は「教師の中でただ 1 人、〜した人」という意味です。これに対し、one of the teachers who have ...（〜する教師のうちの 1 人）は、先行詞が複数の teachers なので have になります。having と to have は、関係詞 who の後ろの動詞（述語動詞）としては使えません。`
        },
        {
          label: '(4)',
          q: R`He is ( ) a poet as a scholar.`,
          type: 'choice', choices: ['no more', 'not so much', 'not less', 'much less'], answer: 1,
          explain: R`**not so much** が入ります。not so much A as B は「A というよりむしろ B」という意味で、「彼は詩人というよりむしろ学者だ」となります。as が後ろにあるので、as と呼応する not so much を選びます。no more A than B（B でないのと同じく A でもない）と not less A than B（B に劣らず A だ）は、どちらも than と呼応する形で、much less は「まして〜ではない」という意味なので、ここでは合いません。`
        },
        {
          label: '(5)',
          q: R`The more carefully you read, ( ) mistakes you will make.`,
          type: 'choice', choices: ['fewer', 'the lesser', 'the fewest', 'the fewer'], answer: 3,
          explain: R`**the fewer** が入ります。the + 比較級 ~, the + 比較級 ... の形（〜すればするほど、ますます…）で、前半と後半の両方に the が必要です。mistakes は数えられる名詞なので、few の比較級 fewer を使います。fewer だけでは the が欠けているので誤りで、the fewest は最上級、the lesser は「（2 つのうち）小さいほうの」という意味で、形も意味も合いません。「注意深く読めば読むほど、間違いは少なくなる」となります。`
        }
      ],
      solution: [
        {
          t: '関係詞は「先行詞」と「関係節の中での働き」を確認する',
          n: R`関係詞を選ぶときは、①先行詞があるか（what は先行詞を含む）、②先行詞が人か物か、③関係節の中で主語・目的語・前置詞の目的語のどれにあたるか、の順に確認します。(1) は先行詞がなく文頭にあるので what、(2) は「most of + 関係代名詞」で先行詞が物なので which です。`,
          easy: R`関係詞は、2 つの文をつなぐ接着剤のようなものです。(2) なら「博物館は絵画を 2000 点以上持っている。そのうちのほとんどは寄贈品だ」という 2 文を、「そのうちの（of them）」を of which に変えてつないだ形です。つなぐ言葉（接続詞か関係詞）がないとき、them のような代名詞だけで文をつなぐことはできません。`,
          pro: R`「one of the + 複数名詞 + who + 複数の動詞」と「the only one of the + 複数名詞 + who + 単数の動詞」の区別は、数の一致の定番問題です。先行詞が one なのか、複数名詞なのかを、冠詞（the only）で見分けましょう。`
        },
        {
          t: '比較の構文は、対になる語から決める',
          n: R`not so much A as B（A というよりむしろ B）、no more A than B（B でないのと同じく A でもない）、the + 比較級 ~, the + 比較級 ...（〜すればするほど…）は、前半と後半が呼応する構文です。(4) は後ろに as があるので not so much、(5) は前半にも the があるので、後半も the + 比較級にします。`,
          lv: 2
        },
        {
          t: '数えられる名詞・数えられない名詞で比較級を使い分ける',
          n: R`few / many（数えられる名詞）の比較級は fewer / more、little / much（数えられない名詞）の比較級は less / more です。(5) の mistakes は数えられるので fewer（the fewer）を使います。the less mistakes と言うのは、くだけた話し言葉でも標準的とはされません。`,
          lv: 2
        }
      ],
      tags: ['関係詞', '比較', '語法', '主語と動詞の一致', 'not so much A as B', '難関大']
    },

    /* ---------- 整序 1: 倒置・付帯状況・前置詞 + 関係代名詞 ---------- */
    {
      id: 'e-adv-struct-01',
      subject: 'english',
      level: 'adv',
      unit: 'e-struct',
      title: '整序：倒置・付帯状況・関係詞',
      source: SRC,
      time: 10,
      body: R`次の (1)〜(4) の日本語の意味になるように、与えられた語を並べかえて英文を完成させなさい。文頭に来る語は大文字で始めてあります。`,
      fig: null,
      passage: null,
      parts: [
        {
          label: '(1)',
          q: R`その問題がそれほど難しいとは、彼は夢にも思わなかった。`,
          type: 'order',
          words: ['dream', 'would', 'he', 'the', 'Little', 'be', 'that', 'problem', 'so', 'did', 'difficult'],
          answer: 'Little did he dream that the problem would be so difficult',
          explain: R`**否定の意味の副詞 Little の倒置**の問題です。Little did he dream that ~ は「〜とは夢にも思わなかった」という意味の慣用的な言い方で、文頭に Little が出るので、そのあとは疑問文の語順（did he dream）になります。that 以下は、the problem would be so difficult と、主語・動詞のそろった節です。would は、dream した時点（過去）から見た未来の推量を表す過去形の助動詞です。so difficult は「それほど難しい」という意味で、so を difficult の前に置きます。`
        },
        {
          label: '(2)',
          q: R`その手紙を読んで初めて、彼女は真実を理解した。`,
          type: 'order',
          words: ['read', 'did', 'the', 'Only', 'she', 'truth', 'understand', 'had', 'letter', 'after', 'she', 'the'],
          answer: 'Only after she had read the letter did she understand the truth',
          explain: R`**Only + 副詞節の倒置**の問題です。Only after ~（〜してはじめて）が文頭に出ているので、主節は疑問文の語順（did she understand）になります。Only after she had read the letter が副詞節で、その中は通常の語順（she had read）のままです。「手紙を読み終えた」のは「理解した」より前のことなので、副詞節は過去完了（had read）、主節は過去形（did she understand）になります。the が 2 つ（the letter / the truth）ある点に注意して、それぞれの名詞の前に置きます。`
        },
        {
          label: '(3)',
          q: R`彼女は顔に涙を流しながら、部屋から出て行った。`,
          type: 'order',
          words: ['down', 'room', 'with', 'She', 'tears', 'of', 'out', 'running', 'face', 'walked', 'the', 'her'],
          answer: 'She walked out of the room with tears running down her face',
          explain: R`**with + 名詞 + 現在分詞（付帯状況）**の問題です。with tears running down her face は、「涙が顔を伝い落ちている状態で」という意味で、with + 名詞（tears）+ 分詞（running）の形で、同時に起きている状況を表します。tears と running は「涙が流れる」という能動の関係なので、現在分詞を使います。walked out of the room（部屋から歩いて出て行った）は、out of ~（〜の外へ）を使った表現です。down her face は「顔を伝って」という意味で、running のあとに置きます。`
        },
        {
          label: '(4)',
          q: R`彼には、心配事を分かち合える相手がだれもいない。`,
          type: 'order',
          words: ['to', 'worries', 'no', 'with', 'He', 'share', 'whom', 'has', 'his', 'one'],
          answer: 'He has no one with whom to share his worries',
          explain: R`**前置詞 + 関係代名詞 + to 不定詞**の問題です。「分かち合える相手」は、share his worries with ~（〜と心配事を分かち合う）の with の目的語にあたるので、with whom to share his worries（心配事を分かち合うべき相手）の形にします。「前置詞 + whom + to 不定詞」は、no one / someone / nobody などの人を表す名詞のすぐ後ろに置いて、「〜できる（すべき）相手」という意味を表します。no one with whom to share ~ は、no one to share ~ with（口語的）と書き換えられます。`
        }
      ],
      solution: [
        {
          t: '核になる構文を見つけて、かたまりを作る',
          n: R`まず、(1) 否定の副詞 Little の倒置、(2) Only + 副詞節の倒置、(3) with + 名詞 + 分詞（付帯状況）、(4) 前置詞 + 関係代名詞 + to 不定詞、のように、構文の型を決めます。次に、その型にあてはまるかたまりを作り、最後に全体を並べます。`,
          easy: R`整序問題は、単語を 1 つずつ並べるのではなく、「かたまり」を先に作るのがコツです。たとえば (4) なら、with whom to share his worries（心配事を分かち合う相手）というかたまりを作ってから、no one の後ろにつなげます。`,
          pro: R`文頭の語が決まっているので、その直後に続く形（助動詞か、主語か、to 不定詞か）を決めてから、残りの語を構文の型に当てはめます。倒置の文では、「文頭の語 + 助動詞 + 主語 + 動詞の原形」の順を最初に固定します。`
        },
        {
          t: '倒置の文は、助動詞の形と時制を確認する',
          n: R`(1) Little did he dream ~ は did + 原形（過去）、(2) Only after ~ did she understand ~ も did + 原形（過去）です。倒置では、助動詞が時制を引き受け、本動詞は原形になります。dreamed / understood のように過去形のまま並べないように注意しましょう。`,
          lv: 2
        },
        {
          t: '並べたあとに見直す',
          n: R`与えられた語をすべて使ったか、文法的に正しいか（動詞の形、主語と動詞の対応、冠詞）を確認します。語が余ったり不足したりするときは、かたまりの作り方を見直します。`,
          lv: 2
        }
      ],
      tags: ['整序', '倒置', 'with+付帯状況', '前置詞+関係代名詞', '難関大']
    },

    /* ---------- 整序 2: 仮定法の倒置・譲歩・分詞構文・強調構文 ---------- */
    {
      id: 'e-adv-struct-02',
      subject: 'english',
      level: 'adv',
      unit: 'e-struct',
      title: '整序：仮定法・譲歩・分詞構文・強調',
      source: SRC,
      time: 10,
      body: R`次の (1)〜(4) の日本語の意味になるように、与えられた語を並べかえて英文を完成させなさい。文頭に来る語は大文字で始めてあります。`,
      fig: null,
      passage: null,
      parts: [
        {
          label: '(1)',
          q: R`もし彼の助けがなかったら、私たちは締め切りに間に合わなかっただろう。`,
          type: 'order',
          words: ['missed', 'for', 'would', 'Had', 'help', 'not', 'the', 'we', 'it', 'deadline', 'been', 'his', 'have'],
          answer: 'Had it not been for his help, we would have missed the deadline',
          explain: R`**仮定法過去完了の倒置**の問題です。「もし〜がなかったら」を表す If it had not been for ~ の if を省略し、Had it not been for ~ と倒置した形です。文頭の Had が手がかりです。主節は、過去の事実に反する結果を表す would have + 過去分詞（we would have missed the deadline）になります。miss the deadline は「締め切りに間に合わない」という意味です。`
        },
        {
          label: '(2)',
          q: R`どんなに疲れていても、彼は日記をつけることを決して欠かさない。`,
          type: 'order',
          words: ['never', 'in', 'tired', 'However', 'diary', 'he', 'to', 'may', 'write', 'fails', 'he', 'his', 'be'],
          answer: 'However tired he may be, he never fails to write in his diary',
          explain: R`**譲歩を表す However + 形容詞 + S + may be** の問題です。However tired he may be は、「どんなに疲れていても」（= No matter how tired he may be）という意味で、However の直後に形容詞（tired）を置き、そのあとに主語と動詞（he may be）を続けます。主節は he never fails to write in his diary で、never fail to do は「必ず〜する、〜することを決して欠かさない」という意味です。`
        },
        {
          label: '(3)',
          q: R`どうしたらよいかわからなかったので、彼女は先生に助言を求めた。`,
          type: 'order',
          words: ['advice', 'asked', 'what', 'she', 'Not', 'for', 'do', 'her', 'knowing', 'to', 'teacher'],
          answer: 'Not knowing what to do, she asked her teacher for advice',
          explain: R`**否定の分詞構文**の問題です。「どうしたらよいかわからなかったので」は、Because she did not know what to do という理由を表す節を、分詞構文にした形です。分詞構文を否定にするときは、分詞の前に Not を置きます（Not knowing ~）。what to do は「何をすべきか」（疑問詞 + to 不定詞）で、knowing の目的語になります。主節の ask A for B は「A に B を求める」という意味で、asked her teacher for advice の語順になります。`
        },
        {
          label: '(4)',
          q: R`彼女の成功を決定づけたのは、才能ではなく、日々の努力だった。`,
          type: 'order',
          words: ['determined', 'but', 'effort', 'It', 'talent', 'that', 'not', 'her', 'was', 'daily', 'success'],
          answer: 'It was not talent but daily effort that determined her success',
          explain: R`**強調構文 It was ~ that ...** と **not A but B** の組み合わせです。「〜だったのは…だ」は、It was ~ that ... という強調構文で、強調したい語句を It was と that の間に置きます。「A ではなく B」は not A but B で、ここでは A = talent、B = daily effort です。強調される部分は not talent but daily effort（才能ではなく日々の努力）全体で、そのあとの that determined her success が「彼女の成功を決定づけた」にあたります。`
        }
      ],
      solution: [
        {
          t: '構文の「型」を先に決める',
          n: R`まず、(1) Had it not been for ~（仮定法過去完了の倒置）、(2) However + 形容詞 + S + may be（譲歩）、(3) Not + 現在分詞（否定の分詞構文）、(4) It was ~ that ...（強調構文）+ not A but B、のように、日本語の意味から構文の型を決めます。型が決まれば、並べる順序の大半が決まります。`,
          easy: R`整序問題は、日本語の意味から「これは〇〇の構文だ」と見当をつけることが第一歩です。「もし〜がなかったら」→ Had it not been for ~、「どんなに〜でも」→ However ~、「〜だったのは…だ」→ It was ~ that ... というように、日本語のサインと構文を結びつけておきましょう。`,
          pro: R`文頭の語（Had / However / Not / It）から、構文の型を確定できます。型のあとの「かたまり」は、助動詞と主語（Had it not been）、形容詞と主語と助動詞（tired he may be）、のように、まとまりごとに固定します。`
        },
        {
          t: '日本語の語順に引きずられない',
          n: R`(3) の「〜わからなかったので」は、because 節ではなく、Not knowing ~ という分詞構文で表します。(4) の「決定づけたのは〜だった」は、It was ~ that ... という「枠」に、強調したい語句（not talent but daily effort）を入れて表します。日本語の表現と英語の構文は、1 対 1 に対応するとは限りません。日本語をそのまま英語に置き換えるのではなく、英語の構文の型に合わせて並べかえましょう。`,
          lv: 2
        },
        {
          t: '並べたあとに見直す',
          n: R`与えられた語をすべて使ったか、文法的に正しいか（動詞の形、主語と動詞の対応、冠詞）を確認します。(4) のように、not A but B の A と B を入れ替えると、日本語と意味が逆になるので、日本語の意味と照らして確認しましょう。`,
          lv: 2
        }
      ],
      tags: ['整序', '仮定法の倒置', 'However', '分詞構文', '強調構文', '難関大']
    },

    /* ---------- 会話文 ---------- */
    {
      id: 'e-adv-conv-01',
      subject: 'english',
      level: 'adv',
      unit: 'e-conv',
      title: '会話文：ゼミ発表の準備',
      source: SRC,
      time: 8,
      body: R`次の会話文を読み、空所 ( 1 )〜( 5 ) に入れるのに最も適切なものを、それぞれ選びなさい。

Mina: Daniel, did you get a chance to read the draft of our presentation?
Daniel: I did. Overall it's good, but I have a few concerns about the conclusion. ( 1 )
Mina: Go ahead. I'd rather hear it now than from Professor Allen on Friday.
Daniel: Well, we claim that bike-sharing reduces traffic, but all our data comes from a single city. ( 2 )
Mina: You've got a point. Professor Allen did warn us about generalizing from one case.
Daniel: Right. ( 3 ) Maybe we should say that the results "suggest" a trend instead of saying that they "prove" it.
Mina: ( 4 ) Still, I'm worried that we don't have enough time to collect a second set of data before Friday.
Daniel: It will be tight, but we can manage if we split the work. I'll look for data on Osaka tonight, and you can revise the slides.
Mina: All right. ( 5 )
Daniel: Don't worry. I'll send you whatever I find by midnight.`,
      fig: null,
      passage: null,
      parts: [
        {
          label: '( 1 )',
          q: R`空所 ( 1 ) に入る最も適切なものを選びなさい。`,
          type: 'choice',
          choices: ["I'm sure you will agree with me completely.", 'Could you finish the rest of it by yourself?', "Never mind. It's none of my business.", "I hope you won't take this the wrong way."],
          answer: 3,
          explain: R`直後の Mina の発言 Go ahead.（どうぞ話して）が決め手です。Go ahead. は、相手が何か言いにくいことを切り出そうとしたときに「遠慮なくどうぞ」と促す表現なので、Daniel は「これから批判めいたことを言う」と前置きしたはずです。I hope you won't take this the wrong way.（悪く取らないでほしいんだけど）が、そのような前置きにあたります。ほかの選択肢は、Go ahead. と応じる発言としてつながりません。`
        },
        {
          label: '( 2 )',
          q: R`空所 ( 2 ) に入る最も適切なものを選びなさい。`,
          type: 'choice',
          choices: ['That makes our results all the more convincing.', "That's a rather bold claim to base on such a small sample.", "That's why we don't need any more evidence.", "That's the most interesting part of the research."],
          answer: 1,
          explain: R`直後の Mina の You've got a point.（もっともだ）は、直前の Daniel の指摘に同意するときの表現です。「データは 1 つの都市のものだけだ」という指摘に続くのは、That's a rather bold claim to base on such a small sample.（そんなに少ないサンプルに基づいて主張するには、かなり大胆だ）と、問題点をまとめた発言です。ほかの選択肢は、データの少なさを問題にしていない（むしろ肯定的にとらえている）ので、You've got a point. とつながりません。`
        },
        {
          label: '( 3 )',
          q: R`空所 ( 3 ) に入る最も適切なものを選びなさい。`,
          type: 'choice',
          choices: ['We should tone down the conclusion a little.', 'We should stand by the conclusion no matter what.', 'We should make the conclusion even stronger.', 'We should cut the conclusion out altogether.'],
          answer: 0,
          explain: R`直後の Daniel の発言 Maybe we should say that the results "suggest" a trend instead of saying that they "prove" it.（結果は「証明する」ではなく「示唆する」と言うべきかもしれない）が手がかりです。「証明する」を「示唆する」に変えるのは主張の調子を弱めることなので、tone down（〜の調子を和らげる、〜を控えめにする）が合います。stand by ~ は「〜を支持し続ける」、make ~ even stronger は「さらに強くする」で反対の方向、cut ~ out altogether は「完全に削除する」で、言葉づかいを変える提案とは合いません。`
        },
        {
          label: '( 4 )',
          q: R`空所 ( 4 ) に入る最も適切なものを選びなさい。`,
          type: 'choice',
          choices: ['That seems like a sensible compromise.', "I'll believe it when I see it.", "I couldn't disagree with you more.", "That's easier said than done."],
          answer: 0,
          explain: R`空所のあとの Mina の発言は、Still, I'm worried that ~（それでも、〜が心配だ）と続いています。Still は「それでも」という意味で、前の内容をいったん認めたうえで、懸念を述べるときに使います。したがって、空所には Daniel の提案を認める発言が入ります。That seems like a sensible compromise.（それは賢明な折衷案ね）が正解です。I couldn't disagree with you more.（まったく賛成できない）、I'll believe it when I see it.（実際に見るまで信じない）、That's easier said than done.（言うは易く行うは難し）は、いずれも提案を受け入れていないので、Still につながりません。`
        },
        {
          label: '( 5 )',
          q: R`空所 ( 5 ) に入る最も適切なものを選びなさい。`,
          type: 'choice',
          choices: ["I'll start on the slides now and ignore whatever you find.", "I'll go to Osaka myself and collect the data by hand.", "Let's ask the professor to cancel the presentation instead.", "I'm counting on you, though; I can't finish the slides without the new data."],
          answer: 3,
          explain: R`直後の Daniel の発言 Don't worry. I'll send you whatever I find by midnight.（心配しないで。見つけたものは何でも真夜中までに送るよ）は、Mina の不安や念押しに答える形です。空所には、データがないとスライドを仕上げられないという念押し、I'm counting on you, though; I can't finish the slides without the new data.（でも、あなたが頼りなの。新しいデータがないとスライドを仕上げられないから）が入ります。count on ~ は「〜をあてにする」という意味です。ほかの選択肢は、直前に決めた分担（Daniel がデータを探し、Mina がスライドを直す）と食い違うため、Don't worry. という返答につながりません。`
        }
      ],
      solution: [
        {
          t: '会話の流れと場面をつかむ',
          n: R`ゼミの発表を控えた 2 人が、発表原稿の結論の弱さについて話し合う場面です。「指摘 → 同意」「提案 → 受け入れ」「念押し → 返答」という組になっているので、空所の直前と直後の発言の両方を読んで、つながりを確認します。`,
          easy: R`会話文は、「相手が何を言ったか」と「そのあとに続く返事」をセットで読むパズルです。たとえば (1) は、返事が Go ahead.（どうぞ）なので、その直前には「言いにくいことを切り出す前置き」があったと推理できます。`,
          pro: R`会話文の空所補充は、直前より直後の発言のほうが決め手になることが多くあります。Still や But のような逆接の語、Go ahead. や Don't worry. のような返答の型から、直前の発言の種類を逆算します。`
        },
        {
          t: '「つなぎの語」と「返答の型」を手がかりにする',
          n: R`(1) の Go ahead.、(2) の You've got a point.、(4) の Still, ~、(5) の Don't worry. のように、会話にはつながりを示す定型の言い回しがあります。それぞれの意味（促す、同意する、それでも、安心させる）を知っていれば、空所の発言がどんな内容か、見当がつきます。`,
          lv: 2
        },
        {
          t: '決まり文句・イディオムを覚える',
          n: R`take ~ the wrong way（〜を誤解する）、tone down ~（〜を控えめにする）、count on ~（〜をあてにする）、easier said than done（言うは易く行うは難し）、I couldn't agree more.（まったく同感だ）などは、意味を知らないと、文脈があっても判断できません。意味と使う場面をセットで覚えておきましょう。`,
          lv: 2
        }
      ],
      tags: ['会話文', '空所補充', '決まり文句', '難関大']
    },

    /* ---------- 長文 1: 知識の呪い ---------- */
    {
      id: 'e-adv-reading-01',
      subject: 'english',
      level: 'adv',
      unit: 'e-reading',
      title: '長文：知識の呪いと専門家の盲点',
      source: SRC,
      time: 22,
      body: R`次の英文（「知識の呪い」と呼ばれる心の働きについての文章）を読み、設問に答えなさい。段落は上から順に第1段落〜第6段落と数えます。空所は ( 1 )・( 3 )・( 4 )・( 5 )、下線部は (2)・(6) です。

注　curse = 呪い　chess = チェス　newcomer = 初心者、新参者　instruction manual = 取扱説明書　lift = （呪いなどを）解く　fade = 薄れる、消えていく`,
      fig: null,
      passage: 'ep-adv-01',
      parts: [
        {
          label: '(1)',
          q: R`空所 ( 1 ) に入る最も適切な語を選びなさい。`,
          type: 'choice', choices: ['underestimate', 'overestimate', 'overlook', 'overrule'], answer: 1,
          explain: R`空所を含む文は、「答えを知っている人は、他人がそれをどれほど容易に見つけるかを〜する」という意味です。直後の文に The answer, once learned, seems to have been obvious all along.（答えは、ひとたび知ってしまうと、初めから明白だったように思える）とあるので、答えを知っている人は「他人も簡単に見つけられる」と考えがちだとわかります。したがって **overestimate**（〜を過大に見積もる）が正解です。underestimate（〜を過小に見積もる）は正反対の意味で、overlook は「〜を見落とす」、overrule は「〜を覆す、却下する」で、how easily ~ を目的語とする動詞として合いません。`
        },
        {
          label: '(2)',
          q: R`下線部 (2) の This が指す内容として最も適切なものを選びなさい。`,
          type: 'choice',
          choices: [
            R`答えを知ると、それが初めから明白だったように思え、他人もすぐに見つけられると考えてしまうこと`,
            R`パズルの解答を見た参加者が、自分の解答を人に教えたがらないこと`,
            R`初めてパズルに挑戦する人が、解くのに長い時間を要すること`,
            R`研究者が、実験の参加者の能力を過小に評価してしまうこと`
          ],
          answer: 0,
          explain: R`This is not a sign of arrogance; it is simply how the mind works.（これは傲慢さの表れではなく、単に心がそのように働くということである）の This は、直前の内容を受けています。直前の 2 文は、「答えを知っている人は、他人がそれを見つけるのを容易だと過大に見積もる」「答えは、知ってしまうと初めから明白だったように思える」という内容です。したがって「答えを知ると、それが最初から明白だったように感じ、他人もすぐ見つけられると考えてしまうこと」が正解です。「傲慢さの表れではない」とは、相手を見下してそう考えるのではなく、知識を得た心の自然な働きだという意味です。他の選択肢は、本文に書かれていない内容です。`
        },
        {
          label: '(3)',
          q: R`空所 ( 3 ) に入る最も適切な語を選びなさい。`,
          type: 'choice', choices: ['indispensable', 'incompatible', 'incomprehensible', 'insignificant'], answer: 2,
          explain: R`空所を含む文は、技術者が書いた説明書が一般の利用者にとってどうなのかを述べ、続けて「医師は専門用語を使い、患者が戸惑っていることに気づかない」「経験豊かな教師は、初心者に必要な段階を飛ばす」と、専門家が初心者の立場を忘れる例を挙げています。したがって、説明書は一般の利用者にとって **incomprehensible**（理解できない）という意味になります。indispensable は「不可欠な」、insignificant は「取るに足りない」で、文脈に合いません。incompatible は「両立しない、相容れない」で、後ろには to ではなく with をとります。`
        },
        {
          label: '(4)',
          q: R`空所 ( 4 ) に入る最も適切なものを選びなさい。`,
          type: 'choice',
          choices: ['experts notice the problem on their own', 'notice experts the problem on their own', 'experts do notice the problem on their own', 'do experts notice the problem on their own'],
          answer: 3,
          explain: R`Rarely（めったに〜ない）のような否定の意味の副詞が文頭に出ると、そのあとは疑問文の語順（助動詞 + 主語 + 動詞の原形）に倒置します。したがって **do experts notice the problem on their own**（専門家が自力でその問題に気づくことはめったにない）が正解です。on their own は「自力で、独力で」という意味です。experts notice ~ / experts do notice ~ は、倒置していない形で誤りです。notice experts ~ は、動詞を主語の前に出しただけの語順（助動詞を使っていない形）で、現代英語ではできません。`
        },
        {
          label: '(5)',
          q: R`空所 ( 5 ) に入る最も適切な語を選びなさい。`,
          type: 'choice', choices: ['precisely', 'previously', 'presently', 'recently'], answer: 0,
          explain: R`空所は、理由を表す because ~ の直前に置かれて、その理由を強調する語です。「そうした記憶は非常に早く薄れてしまうからこそ、学生のころに自分を悩ませたことを書き留めておく」という意味になるので、**precisely**（まさに〜だからこそ）が正解です。precisely because ~ は「まさにそれが理由で」という強調の決まった言い方で、just because / only because なども同じ種類の表現です。previously は「以前に」、presently は「まもなく、現在」、recently は「最近」という時を表す副詞で、because の直前に置いても理由を強調する働きはありません。`
        },
        {
          label: '(6)',
          q: R`下線部 (6) の内容として最も適切なものを選びなさい。`,
          type: 'choice',
          choices: [
            R`専門家は、自分が知らないことを他人に知られないように、隠し続けなければならない。`,
            R`専門家は、初心者の無知を厳しく批判し続けなければならない。`,
            R`専門家は、かつて自分が何も知らなかったころの記憶を、保ち続けなければならない。`,
            R`専門家は、新しい知識を獲得するための努力を、生涯続けなければならない。`
          ],
          answer: 2,
          explain: R`keep ~ alive は「〜を生かし続ける、〜を保ち続ける」、the memory of ignorance は「無知であった（何も知らなかった）ころの記憶」です。直前までの内容（専門家は、知らない状態を想像するのが難しくなる。教える資格は、知らないということがどのようなものだったかを思い出す努力をしないかぎり薄れる）から、「専門性には、知識を得ることだけでなく、無知だったころの記憶を保ち続けることも必要だ」という意味だとわかります。本文は、専門家が自分の無知を隠すことにも、初心者の無知を批判することにも触れていません。また、「知識を獲得する努力を続けること」は下線部の前半（not merely a matter of acquiring knowledge）にあたり、also が示す「追加の条件」ではありません。`
        },
        {
          label: '問7',
          q: R`本文の内容と一致するものを 2 つ選びなさい。`,
          type: 'multi',
          choices: [
            R`The curse of knowledge is a sign of arrogance in experts who look down on beginners.`,
            R`People who know the answer to a puzzle tend to think that others will find it easier than they actually do.`,
            R`Experts usually notice the problem by themselves, so a warning is not necessary.`,
            R`The curse of knowledge affects only teachers and does not appear in other professions.`,
            R`Watching a real beginner struggle is more effective for experts than being warned about the problem.`,
            R`Mastering a subject completely always makes a person a better teacher of it.`
          ],
          answer: [1, 4],
          explain: R`正しいのは 2 つです。「答えを知っている人は、他人がそれを見つけるのを実際より容易だと考えがちだ」は第3段落（overestimate how easily others will find it）と一致し、「本物の初心者が苦戦する姿を見るほうが、警告されるよりも効果がある」は第5段落（What works better is feedback: the expert must watch a real beginner struggle. / simply warning them that it exists helps little）と一致します。
誤りの選択肢は次のとおりです。「傲慢さの表れ」→ 第3段落は not a sign of arrogance。「専門家はふつう自分で気づく」→ 第5段落は Rarely do experts notice ~。「教師だけに影響する」→ 第4段落は、プログラマー・技術者・医師・教師など、さまざまな専門家に及ぶと述べている。「完全に習得すれば、必ず教えるのがうまくなる」→ 第6段落は、習得すればするほど教える資格は薄れるかもしれないと述べている。`
        }
      ],
      solution: [
        {
          t: '全体の流れをつかむ',
          n: R`段落ごとの要旨は次のとおりです。
第1段落: 専門家から学ぶときに感じるもどかしさ。その原因は学ぶ側ではなく、専門家の心の中にあるのではないかという問題提起。
第2段落: 「知識の呪い」の定義（よく知ると、知らない状態を想像しにくくなる）と、チェスの名人の例。
第3段落: 研究の紹介。答えを知っている人は、他人が見つける容易さを過大に見積もる。これは傲慢さではなく、心の働き。
第4段落: 影響は教室の外にも及ぶ（プログラマー、技術者、医師、教師の例）。
第5段落: この呪いは解けるか。警告だけでは効果が小さく、初心者の苦戦を見ることや、自分の初期の失敗を思い出すことが有効。
第6段落: 皮肉な結論。習得すればするほど、教える資格は薄れるかもしれない。専門性には、無知だった記憶を保つことも必要。`,
          easy: R`長文は、各段落の 1 文目と最後の文に、段落の主題が書かれることが多くあります。この文章は、第1段落で問いを出し（原因は専門家の心にある？）、第2〜4段落で答え（知識の呪い）と例を示し、第5〜6段落で対策と結論を述べる流れです。段落ごとの役割を意識しながら読みましょう。`,
          pro: R`Can the curse be lifted? のような疑問文は、そのあとに筆者の答え（対策）が続く合図です。また There is an irony here. のような評価の表現は、結論（筆者の主張）の直前に置かれる定番の合図です。`
        },
        {
          t: '空所補充は、文法・語法と文脈の両方で決める',
          n: R`(1) overestimate は直後の文との整合、(3) incomprehensible は専門家が初心者の立場を忘れる例の列挙という文脈、(4) は Rarely による倒置（語順）、(5) precisely because ~ は理由を強調する定型表現、というように、設問ごとに決め手が異なります。語彙は文脈の方向（肯定・否定）、文法は文頭の語や語順から決めましょう。`,
          lv: 2
        },
        {
          t: '指示語・下線部は、前後の内容に戻って確認する',
          n: R`(2) の This は直前の 2 文の内容を、(6) の下線部は直前までの議論を踏まえた筆者の結論を表します。指示語の問題は、指示語を含む文の 1 つ前の文（または同じ文の前半）から、同じ働きをする内容を探します。(6) のように、also や not merely A but B が出てきたら、「追加される条件」が何かを正確に読み取りましょう。`,
          easy: R`「これ（This）」と出てきたら、「これ」を候補の内容に置き換えて、文が成り立つか確かめましょう。「答えを知ると、他人も簡単に見つけられると思ってしまうことは、傲慢さの表れではない」なら筋が通ります。`,
          lv: 2
        },
        {
          t: '内容一致は、本文の記述と 1 つずつ照合する',
          n: R`選択肢のキーワード（arrogance, notice the problem on their own, only teachers, mastering）を本文で探し、その箇所の記述と照らし合わせます。「ふつうは」「必ず」「だけ」のような極端な表現には、特に注意します。`,
          lv: 2
        }
      ],
      tags: ['空所補充', '倒置', '指示語', '内容説明', '内容一致', '心理・教育', '難関大']
    },

    /* ---------- 長文 2: 翻訳できない言葉 ---------- */
    {
      id: 'e-adv-reading-02',
      subject: 'english',
      level: 'adv',
      unit: 'e-reading',
      title: '長文：翻訳できない語は存在するか',
      source: SRC,
      time: 22,
      body: R`次の英文（言語と思考、翻訳についての文章）を読み、設問に答えなさい。段落は上から順に第1段落〜第5段落と数えます。空所は ( 1 )・( 3 )・( 4 )・( 6 )、下線部は (2)・(5) です。

注　saudade = ポルトガル語で「去ったものへの切ない思慕」　Schadenfreude = ドイツ語で「他人の不幸を喜ぶ気持ち」　komorebi = 木漏れ日　shade = 色合い　render = 〜を（別の言語に）訳す　association = 連想`,
      fig: null,
      passage: 'ep-adv-02',
      parts: [
        {
          label: '(1)',
          q: R`空所 ( 1 ) に入る最も適切な語を選びなさい。`,
          type: 'choice', choices: ['Most', 'Few', 'Little', 'Many'], answer: 1,
          explain: R`直前の文は「言語が思考を決定する」という最も強い主張を紹介し、popular in the last century（前世紀に流行した）と述べています。空所の文のあと、筆者はこの見解への反例（komorebi という語を知らなくても木漏れ日を楽しめる）を挙げ、第3段落では A weaker version of the claim, however, has survived（しかしこの主張のより弱い形は生き残っている）と続けます。これは、強い主張が今日では受け入れられていないことを示す流れなので、**Few**（〜する人はほとんどいない）が入ります。Most / Many では、however による対比や反例の紹介と矛盾します。Little も「ほとんどない」の意味ですが、数えられる名詞 scholars の前には置けません。`
        },
        {
          label: '(2)',
          q: R`下線部 (2) の内容として最も適切なものを選びなさい。`,
          type: 'choice',
          choices: [
            R`名前をつけるまでは、その喜びは感じられない。`,
            R`喜びを感じるには、その名前を知っている必要がある。`,
            R`名前のない経験は、他人と分かち合うことができない。`,
            R`名前がなくても、その喜びを感じることはできる。`
          ],
          answer: 3,
          explain: R`The pleasure does not wait for a name. は直訳すると「喜びは名前を待たない」で、直前の「komorebi という語を聞いたことのない英語話者でも、木の葉のあいだから差し込む日の光を楽しむことはできる」を言い換えた表現です。つまり、「名前がなくても、喜びは感じられる」という意味です。「名前をつけるまで喜びを感じられない」「名前を知っていないと喜べない」は、本文とは反対の内容です。分かち合えるかどうかは、本文では述べられていません。`
        },
        {
          label: '(3)',
          q: R`空所 ( 3 ) に入る最も適切な語を選びなさい。`,
          type: 'choice', choices: ['reflects', 'determines', 'describes', 'denies'], answer: 1,
          explain: R`空所を含む文は、「より弱い形の主張」の内容を説明しています。第2段落で紹介された最も強い主張は、language determines thought（言語が思考を決定する）でした。弱い形は、その「決定する」を「左右する」にやわらげたものなので、language influences, rather than **determines**, what we notice and remember（言語は、私たちの注意や記憶の対象を、決定するのではなく、左右する）となります。reflects（〜を反映する）、describes（〜を描写する）、denies（〜を否定する）では、強い主張との対比が成り立ちません。`
        },
        {
          label: '(4)',
          q: R`空所 ( 4 ) に入る最も適切なものを選びなさい。`,
          type: 'choice',
          choices: ['the ease with which native speakers use it', 'the ease in which native speakers use it', 'the ease at which native speakers use it', 'the ease by which native speakers use it'],
          answer: 0,
          explain: R`空所の前は「保存できないのは、その語が本来の場面でもつ効果、すなわちその響きや連想、そして…」で、its rhythm, its associations, and the ease ~ と名詞を並べています。the ease with which native speakers use it は、native speakers use it with ease（母語話者は気安くそれを使う）の with ease を、関係代名詞を使って the ease with which に変えた形です。前置詞は、もとの表現（with ease）の with をそのまま使います。in which / at which / by which は、with ease という結びつきが成り立たないので誤りです。`
        },
        {
          label: '(5)',
          q: R`下線部 (5) の this light が指す内容として最も適切なものを選びなさい。`,
          type: 'choice',
          choices: [
            R`明るい場所で翻訳をすれば、翻訳不可能な語はなくなるという考え`,
            R`言語が思考を決定するという、最も強い形の主張`,
            R`翻訳では、何を残し何を手放すかを選ばなければならず、完全には運べないという見方`,
            R`翻訳者が、母語話者と同じ気安さで原語を使いこなせるという見方`
          ],
          answer: 2,
          explain: R`Seen in this light は「この見方（観点）で見れば」という意味で、this light は、直前までの議論の内容を指します。第4段落の終わりで、筆者は「翻訳者は、何を残し何を手放すかを決めなければならない。完全な形で運び越えられるものはないからだ」と述べています。この「翻訳には選択が避けられず、完全には運べない」という見方で見ると、翻訳不可能な語は、言語間の壁ではなく、翻訳の実際の姿を思い出させるものだ、とつながります。light を「光」と訳して「明るい場所」と考えるのは誤りです。`
        },
        {
          label: '(6)',
          q: R`空所 ( 6 ) に入る最も適切な語を選びなさい。`,
          type: 'choice', choices: ['such', 'so', 'very', 'too'], answer: 1,
          explain: R`空所を含む文は、assumptions ( ) familiar that they have never noticed them（あまりになじみ深いために、一度も気づいたことのない前提）という意味で、so ~ that ... の形です。so + 形容詞（familiar）+ that ~ で「とても〜なので…」という意味になります。such は such + 名詞（such familiar assumptions）の形なので、形容詞だけの前には置けません。very は very familiar（とてもなじみ深い）で、that 節の結果と結びつきません。too は too ~ to do の形をとり、that 節を続けられません。`
        },
        {
          label: '問7',
          q: R`本文の内容と一致するものを 1 つ選びなさい。`,
          type: 'choice',
          choices: [
            R`翻訳不可能とされる語も、説明によって意味を伝えることはできる。そして翻訳とは、原語の効果の複製ではなく、再創造である。`,
            R`翻訳不可能とされる語が存在することは、言語が思考を完全に決定することの証明である。`,
            R`青の名前を細かく区別する言語の話者は、色の区別がまったくできなくなる。`,
            R`辞書を使えば、母語話者と同じ感覚で、どんな語でも使いこなせるようになる。`
          ],
          answer: 0,
          explain: R`第4段落は、「対応する語のない言葉でも、説明すれば意味を伝えられるかもしれない」「原語の本来の場面での効果は保存できない」と述べ、第5段落は「翻訳は決して複製せず、再創造する」と結論づけています。したがって、この内容に合うのは「説明によって意味を伝えられるが、翻訳は原語の効果の複製ではなく再創造である」です。他の選択肢は、「翻訳不可能な語の存在は、強い主張の証明になる」（第2段落は、この強い主張を今日の学者はほとんど受け入れないと述べている）、「色の区別ができなくなる」（第3段落は、青の名前が別々にある言語の話者は、色合いをわずかに速く見分けると述べている）、「辞書で母語話者と同じ感覚になる」（第5段落は、辞書では得られないことがあると述べている）で、いずれも本文と合いません。`
        }
      ],
      solution: [
        {
          t: '全体の流れをつかむ',
          n: R`段落ごとの要旨は次のとおりです。
第1段落: どの言語にも「翻訳できない」とされる語がある。それは、言語ごとに経験の区切り方が違う証拠なのかという問題提起。
第2段落: 最も強い主張（言語が思考を決定する）は、今日ではほとんど受け入れられていない（反例: 木漏れ日の喜び）。
第3段落: より弱い主張（言語は注意や記憶を左右する）は、実験によって一定の支持を得ている（青の色合いの例）。
第4段落: 翻訳者への教訓。説明はできるが、原語の効果は保存できず、何を残し何を手放すかを決めなければならない。
第5段落: 翻訳不可能な語は壁ではなく、翻訳の実際の姿を思い出させるもの。翻訳は再創造である。`,
          easy: R`この文章は、「強い主張 → 否定 → 弱い主張 → 支持 → 翻訳への教訓」という流れで進みます。However（しかし）や yet（それでも）のような逆接の語が、筆者の考えが切り替わる場所の目印です。段落の最初の文に注目して、流れを追いましょう。`,
          pro: R`このタイプの文章（A という強い見解 → 弱い見解に修正）は、「どの程度の主張か」を区別して読むのが重要です。determines（決定する）と influences（左右する）のように、動詞の強さの違いが、設問の根拠になります。`
        },
        {
          t: '空所補充の決め手を整理する',
          n: R`(1) Few は直後の「反例」と、第3段落冒頭の however による対比、(3) determines は第2段落の強い主張の言い換え、(4) the ease with which は with ease の関係詞化、(6) so ~ that ... の構文、というように、論理のつながりで決まるものと、文法・語法で決まるものを区別して確認します。`,
          lv: 2
        },
        {
          t: '下線部の内容は、前後の論理から言い換える',
          n: R`(2) は直前の文の言い換え（名前がなくても喜びは感じられる）、(5) の this light は直前の議論を受ける「この観点」です。下線部の表現が比喩的なとき（does not wait for a name, in this light）は、字面ではなく、前後の文との論理関係から意味を考えます。`,
          easy: R`「喜びは名前を待たない」と言われても、すぐにはわかりませんね。そんなときは、直前の文（名前を知らなくても木漏れ日は楽しめる）に戻って、「同じことを別の言い方で言っているのでは？」と考えてみましょう。`,
          lv: 2
        },
        {
          t: '主旨・内容一致は、筆者の結論と照らし合わせる',
          n: R`問7 は、第4段落（説明はできるが効果は保存できない）と第5段落（翻訳は再創造）の結論に一致する選択肢を選びます。誤りの選択肢は、本文の逆（強い主張の証明、区別ができなくなる）や、本文にない断定（辞書で完全に使いこなせる）になっています。`,
          lv: 2
        }
      ],
      tags: ['空所補充', '関係詞', '下線部の内容説明', '主旨', '言語・文化', '難関大']
    },

    /* ---------- 長文 3: 便利さの代償 ---------- */
    {
      id: 'e-adv-reading-03',
      subject: 'english',
      level: 'adv',
      unit: 'e-reading',
      title: '長文：便利さの代償と人間の技能',
      source: SRC,
      time: 22,
      body: R`次の英文（機械に任せることと、人間の技能についての文章）を読み、設問に答えなさい。段落は上から順に第1段落〜第6段落と数えます。空所は ( 1 )・( 2 )・( 3 )・( 5 )、下線部は (4)・(6) です。

注　navigation app = 経路案内アプリ　flint = 火打ち石　autopilot = 自動操縦装置　aviation authorities = 航空当局　interval = 間隔　insurance = 保険`,
      fig: null,
      passage: 'ep-adv-03',
      parts: [
        {
          label: '(1)',
          q: R`空所 ( 1 ) に入る最も適切な語を選びなさい。`,
          type: 'choice', choices: ['Besides', 'Thus', 'Likewise', 'Yet'], answer: 3,
          explain: R`直前の文は「機械の信頼性が高まるにつれ、人間の技能は徐々に衰える」という内容で、空所を含む文は「人間の技能が最も必要とされるのは、まさに何かがうまくいかないときだ」という内容です。前後は対照的（技能は衰えるが、いちばん必要になる）なので、逆接の **Yet**（しかし）が入ります。Besides（その上）は追加、Thus（したがって）は結果、Likewise（同様に）は類似を表すので、文脈に合いません。`
        },
        {
          label: '(2)',
          q: R`空所 ( 2 ) に入る最も適切なものを選びなさい。`,
          type: 'choice',
          choices: [
            'The more advanced the system, more serious this problem becomes',
            'More advanced the system, the more serious this problem becomes',
            'The more advanced the system, the more serious this problem becomes',
            'The more advanced the system is, the most serious this problem becomes'
          ],
          answer: 2,
          explain: R`空所には、「システムが高度になればなるほど、この問題はいっそう深刻になる」という意味の文が入ります。the + 比較級 ~, the + 比較級 ... の形で、前半（The more advanced the system）と後半（the more serious this problem becomes）の両方に the が必要です。前半の the が欠けている選択肢、後半の the が欠けている選択肢、比較級ではなく最上級（the most serious）を使っている選択肢は、いずれも誤りです。なお、前半の the more advanced the system は、the more advanced the system is の is が省略された形です。`
        },
        {
          label: '(3)',
          q: R`空所 ( 3 ) に入る最も適切な語を選びなさい。`,
          type: 'choice', choices: ['confirmed', 'conformed', 'conferred', 'confined'], answer: 3,
          explain: R`be confined to ~ は「〜に限られている、〜に閉じ込められている」という意味で、The problem is not confined to technical professions, either. は「この問題は、技術系の職業に限られたものでもない」となります。続く文で、医学生や書き手の例が挙げられ、問題が技術系以外にも広がっていることが示されます。confirm は「〜を確認する」、conform は「従う」（自動詞で conform to ~）、confer は「〜を授ける、協議する」で、いずれも be ~ to の形で「限られている」という意味にはなりません。confine / confirm / conform / confer は形が似ているので、区別して覚えておきましょう。`
        },
        {
          label: '(4)',
          q: R`下線部 (4) の内容として最も適切なものを選びなさい。`,
          type: 'choice',
          choices: [
            R`機械が行う作業の正確さが、使い続けるうちに少しずつ低下していくこと`,
            R`練習を続けることでしか保てない人間の技能や勘が、少しずつ失われていくこと`,
            R`機械を使うことで人間が手にする自由な時間が、少しずつ減っていくこと`,
            R`技能を磨くための練習の機会が、機械の導入によって少しずつ増えていくこと`
          ],
          answer: 1,
          explain: R`something slowly disappears that only practice can maintain は、「練習によってしか維持できない何かが、ゆっくりと消えていく」という意味です。この文の前半 the machine does the work well, and the person gains time（機械は仕事をうまくこなし、人は時間を得る）との対比で、「失われるもの」は、人が実際に練習しないと保てない技能や勘（直観）のことだとわかります。直前の例（医学生の直観、書き手が自分の誤りに気づく力）も手がかりです。機械の正確さが下がる、人が得る時間が減る、練習の機会が増える、はいずれも本文の内容と合いません。`
        },
        {
          label: '(5)',
          q: R`空所 ( 5 ) に入る最も適切なものを選びなさい。`,
          type: 'choice', choices: ['on behalf of', 'in spite of', 'in return for', 'in charge of'], answer: 2,
          explain: R`空所を含む文は、「時間と労力という犠牲を払う」ことと、「ある種の保険を得る」ことの関係を述べています。時間と労力を払う代わりに、保険（技能を守ること）を得るという交換の関係なので、**in return for ~**（〜と引き換えに）が入ります。on behalf of ~ は「〜を代表して」、in spite of ~ は「〜にもかかわらず」、in charge of ~ は「〜を担当して」で、犠牲（a cost）と保険（insurance）の関係を表せません。`
        },
        {
          label: '(6)',
          q: R`下線部 (6) の内容として最も適切なものを選びなさい。`,
          type: 'choice',
          choices: [
            R`便利さには、それと引き換えに何かを失うという代償がともなうということ`,
            R`便利なものは、どれも使用料を払わずに手に入れられるということ`,
            R`便利な機械は、料金がかかるので、使わないほうがよいということ`,
            R`無料で提供されるサービスは、たいてい使い勝手が悪いということ`
          ],
          answer: 0,
          explain: R`free は「無料の」という意味で、convenience is never free は文字どおりには「便利さは決してただではない」です。直後の文 What we gain in comfort we may lose in capability（快適さの面で得るものを、能力の面で失うかもしれない）が、その具体的な内容で、便利さを得る代わりに何かを失う、つまり代償を払うことになるという意味です。「必ず無料」は反対の内容で、「使うべきでない」とは筆者は述べておらず（第5段落の Hardly. で否定している）、「無料のサービスは不便」も本文に根拠がありません。`
        },
        {
          label: '問7',
          q: R`本文の内容と一致するものを 2 つ選びなさい。`,
          type: 'multi',
          choices: [
            R`As machines become more reliable, the people who supervise them may lose skills because they are needed less often.`,
            R`Aviation authorities have banned autopilots because pilots' skills have weakened.`,
            R`The author argues that people should stop using machines that take over human tasks.`,
            R`Some teachers ask students to solve problems without calculators before allowing them to use the machines.`,
            R`Medical students who use software always develop better intuition than experienced doctors.`,
            R`Automation is a problem only in the aviation industry.`
          ],
          answer: [0, 3],
          explain: R`正しいのは 2 つです。「機械の信頼性が高まると、それを監督する人は、出番が減るために技能が衰えるかもしれない」は第2段落（the people who supervise them are called on less and less often, and so their skills gradually weaken）と一致し、「生徒に電卓を使わせる前に、電卓なしで問題を解かせる教師がいる」は第5段落（some teachers ask students to solve problems without calculators ~）と一致します。
誤りの選択肢は次のとおりです。「航空当局が自動操縦を禁止した」→ 第5段落は No one seriously proposes that pilots abandon autopilots。「筆者は機械の使用をやめるべきだと主張している」→ 第5段落は Hardly.（そんなことはない）と否定し、守る価値のある技能は意識して守るべきだと述べている。「医学生は必ず経験豊かな医師より優れた直観を身につける」→ 第4段落は、ソフトウェアに頼る医学生は直観を身につけないままになるかもしれないと述べている。「自動化の問題は航空業界だけ」→ 第4段落は、問題が技術系の職業に限られないと述べている。`
        }
      ],
      solution: [
        {
          t: '全体の流れをつかむ',
          n: R`段落ごとの要旨は次のとおりです。
第1段落: ナビアプリの例から、機械が作業を引き継ぐと、その作業に必要だった人間の技能はどうなるのかという問い。
第2段落: 自動化されたシステムを監督する人間は、出番が減って技能が衰える。しかし、異常時にこそ技能が最も必要になる。
第3段落: 航空の例。自動操縦で安全にはなったが、手動操縦の機会が減ったパイロットの、緊急時の対応力が懸念されている。
第4段落: 問題は技術系の職業に限られない（医学生、書き手の例）。便利さの陰で、練習でしか保てないものが消えていく。
第5段落: 機械を拒むべきか。→ そうではない。守る価値のある技能は意識して守る（定期的な手動操縦、電卓なしの練習）。時間と労力は、保険の代価である。
第6段落: 結論。便利さはただではない。どの能力を守るかは、個人と社会が決める。`,
          easy: R`英語の長文では、第1段落に「問い」、最終段落に「筆者の結論」が来ることが多くあります。この文章でも、第1段落の問い（機械が作業を引き継ぐと、人間の技能はどうなるのか）に、第6段落で「便利さはただではない」と答えています。`,
          pro: R`Does this mean that ~? Hardly. のように、読者の疑問を先取りして否定する展開は、筆者の主張を際立たせる定番の構成です。Hardly が筆者の立場を示す転換点だと気づけると、内容一致の判断が速くなります。`
        },
        {
          t: '空所補充は、前後の文の論理関係を先に決める',
          n: R`(1) の Yet は「技能は衰える。しかし最も必要になるのは異常時」という逆接、(2) の the + 比較級 ~, the + 比較級 ... は「比例関係」、(5) の in return for は「犠牲と引き換えに保険を得る」という交換の関係を表します。空所補充では、前後の文が「逆接・追加・因果・対比・交換」のどの関係にあるのかを先に決めると、選択肢を絞り込めます。(3) の confined は、語の形が似た選択肢の中から、be confined to ~ の語法で選びます。`,
          lv: 2
        },
        {
          t: '下線部の内容は、前後の文から具体化する',
          n: R`(4) の something は漠然とした語ですが、前半（機械が仕事をうまくこなし、人が時間を得る）との対比と、前の例（医学生の直観、書き手が自分の誤りに気づく力）から、「練習でしか維持できない人間の技能や勘」と具体化できます。(6) の convenience is never free は、直後の文（快適さの面で得るものを、能力の面で失うかもしれない）が言い換えになっています。`,
          easy: R`something（何か）のように、内容がぼかされている語が出てきたら、「前後の文では、具体的に何のことを言っていたかな？」と探してみましょう。この文では、医学生の直観や、書き手が自分のミスに気づく力のことです。`,
          lv: 2
        },
        {
          t: '内容一致は、極端な表現と、本文の否定表現に注意する',
          n: R`「禁止した」「やめるべきだ」「必ず」「だけ」のような極端な表現を含む選択肢は、本文に根拠があるかを慎重に確かめます。本文には Hardly.（そんなことはない）や No one seriously proposes ~（〜と真剣に提案する者はいない）のような否定表現があり、筆者が機械の使用そのものには反対していないことを示しています。`,
          lv: 2
        }
      ],
      tags: ['空所補充', '比較構文', '下線部の内容説明', '内容一致', '技術・社会', '難関大']
    }
  ]);
})();
