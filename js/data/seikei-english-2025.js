/* GOKAKU NAVI — 成蹊大学 理工学部 英語 2025 年度 準拠の類題
   大問構成・設問形式・語数の目安だけを 2025 年度に合わせ、
   英文・設問・選択肢・解説はすべて書き下ろしたもの（過去問の文面・題材は含まない）。
   第1問: 生物学の読み物（空所補充〔前置詞は 5 語から 1 回ずつ〕・respectively・指示語・語句整序 2 問・内容一致）
   第2問: 技術の解説文（アクセント・前置詞 7 問・正誤の組合せ・語の抜き出し・訳の選択・neither の指す語）
   第3問: 物語文（出来事の日本語要約・英英定義から単語を書く） */
(function () {
  'use strict';
  const R = String.raw;
  const src = function (no) {
    return { univ: '成蹊大学', faculty: '理工学部', year: 2025, no: no, kind: '類題' };
  };

  /* ================================================================
   *  長文（passage）
   * ================================================================ */
  JK.registerPassages([
    /* ---------- 第1問: 生物学の読み物（ミツバチのダンス） ---------- */
    {
      id: 'sk-ep-2025-1',
      title: 'How Honeybees Give Directions',
      level: 'mid',
      topic: '生物・動物行動',
      source: src('第1問'),
      paras: [
        [
          { en: R`When a honeybee finds a field of flowers, she cannot simply tell her sisters where it is.`, ja: R`ミツバチは花畑を見つけても、それがどこにあるのかを姉妹たちに簡単に伝えることはできない。` },
          { en: R`Instead, she flies back to the hive and begins to dance.`, ja: R`その代わり、彼女は巣に飛んで帰り、踊り始める。` },
          { en: R`Her short, strange performance tells the other bees how far to fly and in which direction.`, ja: R`その短くて不思議な演技は、ほかのハチたちに、どれだけ遠くへ、どの方向に飛べばよいかを教える。` },
          { en: R`Scientists have studied this dance {b1:for} many decades.`, ja: R`科学者たちはこのダンスを何十年も研究してきた。` }
        ],
        [
          { en: R`The dance was first explained by Karl von Frisch, an Austrian scientist.`, ja: R`このダンスを最初に解き明かしたのは、オーストリアの科学者カール・フォン・フリッシュである。` },
          { en: R`He watched bees in hives with glass walls and marked each one with a tiny dot of color.`, ja: R`彼はガラスの壁の巣箱の中のハチを観察し、1 匹ずつに小さな色の点で印をつけた。` },
          { en: R`After years of patient watching, he worked out what the dance meant.`, ja: R`何年にもわたる辛抱強い観察のすえに、彼はそのダンスの意味を解き明かした。` }
        ],
        [
          { en: R`Von Frisch found that a bee uses two main kinds of dances.`, ja: R`フォン・フリッシュは、ハチが主に 2 種類のダンスを使うことを発見した。` },
          { en: R`When the food is close to the hive, she runs in a small circle.`, ja: R`餌が巣の近くにあるときは、ハチは小さな円を描いて走る。` },
          { en: R`When it is farther away, she runs in a straight line, shaking her body from side to side, and then circles back to repeat the pattern.`, ja: R`餌がもっと遠くにあるときは、体を左右に振りながら直線上を走り、それから円を描いて戻って、同じパターンを繰り返す。` },
          { en: R`This second pattern is known {b2:as} the waggle dance.`, ja: R`この 2 つめのパターンは、尻振りダンスとして知られている。` }
        ],
        [
          { en: R`The dance takes place on the upright wall of the honeycomb, so the bee cannot simply point at the food.`, ja: R`ダンスは巣板の垂直に立つ面の上で行われるので、ハチは餌を直接指し示すことができない。` },
          { en: R`Instead, she uses the sun as a guide.`, ja: R`その代わり、ハチは太陽を道しるべとして使う。` },
          { en: R`A run straight up the comb means "fly toward the sun," and a run tilted to the right means "fly to the right of the sun."`, ja: R`巣板をまっすぐ上に向かう走りは「太陽に向かって飛べ」を意味し、右に傾いた走りは「太陽の右側へ飛べ」を意味する。` },
          { en: R`In this way, the angle of the straight run shows the direction of the food.`, ja: R`このようにして、直進する走りの角度が、餌のある方向を示している。` }
        ],
        [
          { en: R`The distance is shown by the length of the straight run.`, ja: R`距離は、直進する走りの長さによって示される。` },
          { en: R`{b3:The longer the bee keeps waggling, the farther away the food is}.`, ja: R`ハチが体を振り続ける時間が長いほど、餌は遠くにある。` },
          { en: R`A short waggle sends the watchers to a place nearby, while a long one sends them far across the countryside.`, ja: R`短い尻振りは見ているハチたちを近くの場所へ向かわせ、長い尻振りは、田園地帯の遠くまで向かわせる。` }
        ],
        [
          { en: R`Because {b4:of} the darkness inside the hive, the watching bees cannot see the dancer.`, ja: R`巣の中は暗いので、見ているハチたちには踊り手の姿が見えない。` },
          { en: R`They cannot rely {b5:on} their eyes, so they follow her movements and touch her with their antennae.`, ja: R`目に頼ることができないので、ハチたちは踊り手の動きを追い、触角で彼女に触れる。` },
          { en: R`They also pick up the smell of the flowers from her body.`, ja: R`彼らは、踊り手の体から花のにおいも感じ取る。` }
        ],
        [
          { en: R`The sun moves across the sky during the day, so the dancer slowly changes the angle of her dance according {b6:to} the sun's new position.`, ja: R`太陽は日中に空を横切って動くので、踊り手は太陽の新しい位置に合わせて、ダンスの角度を少しずつ変える。` },
          { en: R`She does this even though she is inside the hive and cannot see the sun.`, ja: R`ハチは、巣の中にいて太陽が見えないのに、これを行う。` }
        ],
        [
          { en: R`A bee that has found a rich supply of nectar dances for longer and more eagerly than a bee that has found only a little.`, ja: R`蜜をたっぷり見つけたハチは、ほんの少ししか見つけなかったハチよりも、長く、そして熱心に踊る。` },
          { en: R`As a result, more bees are sent to the best flowers.`, ja: R`その結果、より多くのハチが最良の花へ送り出される。` }
        ],
        [
          { en: R`In one test of von Frisch's discovery, researchers glued tiny radar tags to bees that had watched a dancer and followed their flights.`, ja: R`フォン・フリッシュの発見を確かめたある実験で、研究者たちは、踊り手を見たハチに小さなレーダー用の標識を貼りつけ、その飛行を追跡した。` },
          { en: R`Many of {u7:these bees} flew toward the place that the dance had described.`, ja: R`これらのハチの多くは、ダンスが示した場所に向かって飛んだ。` },
          { en: R`The results show that {b8:these dances give the other bees most of the information they need to find the food}.`, ja: R`この結果は、これらのダンスが、ほかのハチたちに、餌を見つけるのに必要な情報のほとんどを与えていることを示している。` }
        ],
        [
          { en: R`People can read the dance, too.`, ja: R`人間にもダンスを読み取ることはできる。` },
          { en: R`By filming the dances and measuring the angle and the length of each straight run, scientists can draw a map of the flowers that the bees visit.`, ja: R`ダンスを撮影し、それぞれの直進する走りの角度と長さを測ることで、科学者たちはハチが訪れる花の地図を描くことができる。` },
          { en: R`Because many of the crops we eat depend on bees, such maps can help farmers and city planners decide where to plant more flowers.`, ja: R`私たちが食べる作物の多くはハチに頼っているので、そうした地図は、農家や都市計画の担当者が、どこにもっと花を植えるべきかを決めるのに役立つ。` }
        ],
        [
          { en: R`It is surprising that such a small animal can do all this.`, ja: R`こんなに小さな動物がこれほどのことをやってのけるとは驚きだ。` },
          { en: R`A honeybee's brain is no bigger than a sesame seed, yet it lets her remember the way to the flowers and pass the news on to her sisters.`, ja: R`ミツバチの脳はゴマ粒より大きくはないが、それでもその脳のおかげで、ハチは花までの道を覚え、その知らせを姉妹たちに伝えることができる。` }
        ],
        [
          { en: R`The honeybee's dance reminds us that a message does not always need words to be clear.`, ja: R`ミツバチのダンスは、メッセージが明確であるために、いつも言葉が必要とは限らないことを私たちに思い出させてくれる。` },
          { en: R`A few movements in the dark, repeated again and again, are enough to guide many sisters to the right place.`, ja: R`暗闇の中でのわずかな動きも、何度も繰り返されれば、多くの姉妹を正しい場所へ導くのに十分である。` }
        ]
      ],
      vocab: ['honeybee', 'hive', 'waggle', 'upright', 'honeycomb', 'tilt', 'angle', 'direction', 'distance', 'nearby', 'countryside',
        'antenna', 'nectar', 'supply', 'eagerly', 'radar', 'tag', 'crop', 'decade', 'patient'],
      vocabExtra: [
        ['honeybee', '名', 'ミツバチ', 2],
        ['hive', '名', '巣箱; ミツバチの巣', 3],
        ['waggle', '動', '〜を左右に振る; 尻を振る', 3],
        ['honeycomb', '名', '蜂の巣; 巣板', 3],
        ['antenna', '名', '触角（複数形 antennae）; アンテナ', 3],
        ['antennae', '名', '触角（antenna の複数形）', 3],
        ['eagerly', '副', '熱心に; 熱望して', 2],
        ['nectar', '名', '(花の)蜜', 3],
        ['tilt', '動', '〜を傾ける; 傾く', 3],
        ['sesame', '名', 'ゴマ', 3]
      ]
    },

    /* ---------- 第2問: 技術の解説文（GPS） ---------- */
    {
      id: 'sk-ep-2025-2',
      title: 'How a Phone Knows Where It Is',
      level: 'mid',
      topic: '科学技術・物理',
      source: src('第2問'),
      paras: [
        [
          { en: R`GPS, or the Global Positioning System, is a {u1:technology} that tells you where you are on the Earth.`, ja: R`GPS（全地球測位システム）は、自分が地球上のどこにいるかを教えてくれる技術である。` },
          { en: R`A small receiver, such as the one inside your smartphone, picks up signals {b2:from} several satellites and works out its own position.`, ja: R`スマートフォンの中にあるような小さな受信機が、数個の衛星からの信号を受け取り、自分の位置を割り出す。` },
          { en: R`Long ago, travelers had to find their way with maps, compasses, and the stars, but today a phone can do the job in a few seconds.`, ja: R`昔の旅人は、地図や羅針盤や星を頼りに道を探さなければならなかったが、今ではスマートフォンがそれをほんの数秒でやってのける。` }
        ],
        [
          { en: R`So who built this system?`, ja: R`では、このシステムをつくったのはだれなのか。` },
          { en: R`It was built by the United States, and it began as a military project.`, ja: R`それはアメリカ合衆国によってつくられ、軍事計画として始まった。` },
          { en: R`Since then, other countries and regions have built {u3:similar systems}: Europe has Galileo, Russia has GLONASS, and China has BeiDou.`, ja: R`それ以来、ほかの国や地域も同様のシステムをつくってきた。ヨーロッパにはガリレオ、ロシアにはグロナス、中国には北斗がある。` },
          { en: R`Japan also runs a smaller system called Michibiki, which works together with GPS.`, ja: R`日本も、GPS と協力して働く、より小規模な「みちびき」というシステムを運用している。` }
        ],
        [
          { en: R`How does GPS work?`, ja: R`GPS はどのように働くのか。` },
          { en: R`About thirty satellites circle the Earth {b4:at} a height of about 20,000 kilometers, and each one keeps sending out a radio signal.`, ja: R`約 30 個の衛星が、高さおよそ 2 万キロメートルのところで地球のまわりを回っており、それぞれが電波の信号を送り出し続けている。` },
          { en: R`The signal carries two pieces of {u5:information}: the moment when it was sent and the position of the {u6:satellite}.`, ja: R`その信号は、信号が送られた瞬間と衛星の位置という、2 つの情報を運んでいる。` },
          { en: R`A receiver that has {u7:neither} of them cannot work out how far away the satellite is.`, ja: R`そのどちらも持たない受信機は、衛星がどれだけ離れているかを割り出すことができない。` }
        ],
        [
          { en: R`The receiver compares the time of sending {b8:with} the time of arrival.`, ja: R`受信機は、信号が送られた時刻と届いた時刻を比べる。` },
          { en: R`Radio waves travel at the speed of light, about 300,000 kilometers per second, so the difference tells the receiver how far the signal has come.`, ja: R`電波は光の速さ、つまり秒速約 30 万キロメートルで進むので、その時刻の差から、信号がどれだけの距離を進んできたかが受信機にわかる。` }
        ],
        [
          { en: R`Knowing the distance to one satellite is not enough.`, ja: R`1 つの衛星までの距離がわかるだけでは十分ではない。` },
          { en: R`It only tells you that you are somewhere on a huge sphere around that satellite.`, ja: R`それは、その衛星を中心とする巨大な球面のどこかにあなたがいる、ということしか教えてくれない。` },
          { en: R`Two satellites narrow your position down to a circle, and three leave just two points, one of which is usually far from the Earth's surface.`, ja: R`2 つの衛星があれば位置は 1 つの円の上に絞られ、3 つあれば 2 点しか残らず、そのうちの 1 点はたいてい地表から遠く離れている。` },
          { en: R`So, in theory, three distances are enough to fix a position.`, ja: R`だから理論上は、3 つの距離がわかれば位置を決めるのに十分である。` }
        ],
        [
          { en: R`In practice, however, three satellites are not quite enough.`, ja: R`しかし実際には、衛星が 3 つでは十分とはいえない。` },
          { en: R`A receiver needs a fourth satellite.`, ja: R`受信機には 4 つ目の衛星が必要である。` },
          { en: R`{u9:The clock inside a smartphone is far less exact than the atomic clocks on the satellites}, and a tiny error in time causes a large error in distance.`, ja: R`スマートフォンの中の時計は、衛星の原子時計よりはるかに正確さが劣り、時刻のわずかな誤差が距離の大きな誤差を生む。` },
          { en: R`A mistake {b10:of} just one millionth of a second, for example, would put the position about 300 meters off.`, ja: R`たとえば、100 万分の 1 秒というわずかな誤りでも、位置は約 300 メートルずれてしまう。` },
          { en: R`The fourth signal lets the receiver correct its own clock.`, ja: R`4 つ目の信号があれば、受信機は自分の時計を修正できる。` }
        ],
        [
          { en: R`The clocks on the satellites need special care, too.`, ja: R`衛星の時計にも、特別な注意が必要である。` },
          { en: R`The satellites move fast and are far from the Earth's gravity, so time passes slightly differently for them than for us on the ground, as the theory of relativity predicts.`, ja: R`衛星は高速で動き、地球の重力からも遠いので、相対性理論が予測するとおり、時間の進み方が、衛星では地上にいる私たちとは少し違う。` },
          { en: R`{u11:Engineers} adjust the clocks to make up {b12:for} this difference.`, ja: R`技術者たちは、この違いを補うように時計を調整している。` },
          { en: R`Without such adjustments, the position would be wrong {b13:by} about ten kilometers after only one day.`, ja: R`こうした調整がなければ、位置は、わずか 1 日で約 10 キロメートルも間違ってしまうだろう。` }
        ],
        [
          { en: R`Where is GPS used?`, ja: R`GPS はどこで使われているのか。` },
          { en: R`Ships and airplanes use it for navigation, and rescue teams use it to find people who are lost in the mountains.`, ja: R`船や飛行機は航行のために GPS を使い、救助隊は山で道に迷った人を見つけるために使う。` },
          { en: R`Farmers use it to guide tractors across their fields so that seeds are planted in straight lines.`, ja: R`農家は、種がまっすぐな列に植えられるように、畑でトラクターを誘導するために使う。` },
          { en: R`It works {u14:almost anywhere on the Earth, from the middle of the ocean to the top of a mountain}.`, ja: R`GPS は、海の真ん中から山の頂上まで、地球上のほとんどどこでも働く。` }
        ],
        [
          { en: R`Scientists use GPS, too.`, ja: R`科学者たちも GPS を使う。` },
          { en: R`By measuring tiny movements of the ground, they can study how the plates that make up the Earth's surface move, and how the land changes after an earthquake.`, ja: R`地面の小さな動きを測ることで、地球の表面をつくる岩盤（プレート）がどう動くか、また地震のあとで土地がどう変わるかを調べることができる。` },
          { en: R`Weather experts even use the signals, because water vapor in the air slightly delays them.`, ja: R`気象の専門家も GPS の信号を使う。空気中の水蒸気が信号をわずかに遅らせるからである。` }
        ],
        [
          { en: R`Time is another gift of GPS.`, ja: R`時刻も、GPS がもたらすもう 1 つの贈り物である。` },
          { en: R`Each satellite carries atomic clocks, so a receiver can use its signals to set a very accurate clock.`, ja: R`各衛星は原子時計を積んでいるので、受信機はその信号を使って、非常に正確な時計を合わせることができる。` },
          { en: R`Mobile phone networks, power systems, and stock markets depend {b15:on} this time to keep their machines in step with one another.`, ja: R`携帯電話の通信網や電力システム、株式市場は、機械どうしの歩調を合わせるために、この時刻に頼っている。` }
        ],
        [
          { en: R`GPS may look like magic, but it is built on two simple ideas: measuring distances with the speed of light, and keeping very good time.`, ja: R`GPS は魔法のように見えるかもしれないが、2 つの単純な考えの上に成り立っている。光の速さを使って距離を測ることと、非常に正確に時を刻むことである。` },
          { en: R`It shows how simple ideas from science can become a tool that millions of people use every day.`, ja: R`それは、科学の単純な考えが、何百万もの人々が毎日使う道具になりうることを示している。` }
        ]
      ],
      vocab: ['satellite', 'signal', 'receiver', 'smartphone', 'technology', 'military', 'project', 'position', 'sphere', 'narrow', 'atomic',
        'gravity', 'relativity', 'adjustment', 'delay', 'navigation', 'tractor', 'rescue', 'vapor', 'network', 'stock', 'plate', 'earthquake', 'accurate'],
      vocabExtra: [
        ['receiver', '名', '受信機; 受け取る人', 2],
        ['smartphone', '名', 'スマートフォン', 1],
        ['relativity', '名', '相対性; 相対性理論', 3],
        ['adjustment', '名', '調整; 修正', 3],
        ['navigation', '名', '航行; 航海術; ナビゲーション', 3],
        ['vapor', '名', '蒸気; 水蒸気', 3]
      ]
    },

    /* ---------- 第3問: 物語文（架空の家族の、とんだ出来事） ---------- */
    {
      id: 'sk-ep-2025-3',
      title: 'The Wrong Turn',
      level: 'mid',
      topic: '文学・物語',
      source: src('第3問'),
      paras: [
        [
          { en: R`Last spring, the Carter family got up early on a Saturday and set off for a cousin's wedding in a town three hours away.`, ja: R`この春のある土曜日、カーター一家は朝早く起き、3 時間かかる町で開かれるいとこの結婚式に向けて出発した。` },
          { en: R`Mr. Carter was in charge of the map, and he was sure that he knew the way.`, ja: R`カーターさんが地図の係で、自分は道を知っていると信じ込んでいた。` }
        ],
        [
          { en: R`By noon, however, they were lost.`, ja: R`しかし正午までには、一家は道に迷っていた。` },
          { en: R`The road signs in the small town were hard to read, and the phone had no signal.`, ja: R`その小さな町の道路標識は読みにくく、電話も電波が届かなかった。` },
          { en: R`"Turn left here," said Mr. Carter, and he drove into a narrow street.`, ja: R`「ここを左に曲がろう」とカーターさんは言い、狭い通りに車を乗り入れた。` }
        ],
        [
          { en: R`Soon they heard music, and before they knew it, their small blue car was between a marching band and a long line of floats covered with flowers.`, ja: R`すぐに音楽が聞こえてきて、気がつくと、一家の小さな青い車は、マーチングバンドと、花で飾られた山車の長い列とのあいだにはさまれていた。` },
          { en: R`It was the town's spring parade, and the Carters had driven straight into the middle of it.`, ja: R`それは町の春のパレードで、カーター一家はそのど真ん中にまっすぐ入り込んでしまったのだ。` }
        ],
        [
          { en: R`Mr. Carter could not turn around, because the floats were already close behind him.`, ja: R`カーターさんは、山車がすでにすぐ後ろまで来ていたので、引き返すことができなかった。` },
          { en: R`"What should I do?" he {b1:whispered}.`, ja: R`「どうしたらいいんだ」と彼はささやいた。` },
          { en: R`"Just keep driving!" said his wife.`, ja: R`「とにかく運転を続けて！」と妻は言った。` },
          { en: R`People along the street began to {b2:cheer}, because they thought that the family was part of the show.`, ja: R`通りに沿った人々は、一家をショーの一部だと思って、歓声をあげ始めた。` }
        ],
        [
          { en: R`The children in the back seat waved back happily, and even Mrs. Carter could not help smiling.`, ja: R`後部座席の子どもたちは楽しそうに手を振り返し、カーター夫人でさえ思わず笑顔になった。` },
          { en: R`A man with a microphone saw them and shouted, "And here comes the family with the most surprised faces in town!"`, ja: R`マイクを持った男性が一家に気づいて叫んだ。「さあ、町でいちばん驚いた顔をした家族の登場です！」` },
          { en: R`At the end of the street, a judge in a funny hat was writing something on a sheet of paper.`, ja: R`通りの端では、おかしな帽子をかぶった審査員が、紙に何かを書き込んでいた。` }
        ],
        [
          { en: R`Just then, a police officer stepped in front of the car and raised his hand.`, ja: R`ちょうどそのとき、警察官が車の前に歩み出て、手を上げた。` },
          { en: R`"Excuse me, sir," he said. "Which group are you with?"`, ja: R`「失礼ですが」と彼は言った。「どちらの団体の方ですか。」` },
          { en: R`"We are only trying to get to a wedding," said Mr. Carter.`, ja: R`「私たちは結婚式に行こうとしているだけなんです」とカーターさんは言った。` },
          { en: R`The officer burst out laughing, and then he showed them the way out through a side road.`, ja: R`警察官は思わず吹き出し、それから脇道を通って抜け出す道を教えてくれた。` }
        ],
        [
          { en: R`The Carters reached the wedding an hour late.`, ja: R`カーター一家は、結婚式に 1 時間遅れて到着した。` },
          { en: R`The next day, the judge told a reporter that he had been about to give their car a prize.`, ja: R`翌日、審査員は記者に、一家の車に賞を与えようとしていたところだったと語った。` }
        ]
      ],
      vocab: ['wedding', 'cousin', 'sign', 'signal', 'narrow', 'march', 'float', 'whisper', 'cheer', 'wave', 'microphone', 'judge',
        'officer', 'burst', 'prize', 'reporter', 'parade', 'noon'],
      vocabExtra: [
        ['float', '名', '山車; 浮き', 2],
        ['microphone', '名', 'マイク', 2]
      ]
    }
  ]);

  /* ================================================================
   *  問題カード（大問ごとに 1 枚）
   * ================================================================ */
  JK.registerProblems([
    /* ---------- 第1問 ---------- */
    {
      id: 'sk-e-2025-1',
      subject: 'english',
      level: 'mid',
      unit: 'e-reading',
      title: '長文：ミツバチの尻振りダンス',
      source: src('第1問'),
      time: 20,
      body: R`次の英文は、ミツバチが仲間に花畑の位置を伝える「ダンス」について、研究の歴史をまじえて紹介した読み物です。英文を読み、問1〜問7 に答えなさい。段落は上から順に第1段落〜第12段落と数えます。空所は ( 1 )〜( 6 ) と ( 8 )、下線部は (7) です。( 3 ) は 1 文全体、( 8 ) は文の後半が空所になっています。

注　hive = ミツバチの巣箱　honeycomb = 巣板（蜂の巣の板状の部分）　antennae = 触角　waggle = 体を左右に振る　nectar = 花の蜜　radar tag = 位置を電波で追うための小さな標識　sesame = ゴマ`,
      fig: null,
      passage: 'sk-ep-2025-1',
      parts: [
        {
          label: '問1(1)',
          q: R`空所 ( 1 )（第1段落）に入る最も適切な語を、次の 5 つの中から選びなさい。問1 の空所 ( 1 )(2)(4)(5)(6) には、それぞれ異なる語が入ります（同じ語は 1 度しか使いません）。`,
          type: 'choice', choices: ['as', 'for', 'of', 'on', 'to'], answer: 1,
          explain: R`**for many decades** で「何十年もの間」です。for は「〜の間」と期間の長さを表す前置詞で、decades（10 年を単位とする語）が続くので for を選びます。as / of / on / to では期間を表せません。問1 は 5 つの語を 1 度ずつ使うので、for は残りの空所の候補から外せます。`
        },
        {
          label: '問1(2)',
          q: R`空所 ( 2 )（第3段落）に入る最も適切な語を選びなさい。`,
          type: 'choice', choices: ['as', 'for', 'of', 'on', 'to'], answer: 0,
          explain: R`**be known as 〜** で「〜として知られている」です。「この 2 つめのパターンは、尻振りダンスとして知られている」という、呼び名を述べる文になります。be known for 〜（〜で有名だ）は特徴や業績を述べる言い方で、この文の the waggle dance は「この 2 つめのパターン」そのものを指すので、意味が通りません。`
        },
        {
          label: '問1(4)',
          q: R`空所 ( 4 )（第6段落）に入る最も適切な語を選びなさい。`,
          type: 'choice', choices: ['as', 'for', 'of', 'on', 'to'], answer: 2,
          explain: R`**because of 〜** で「〜のために、〜が原因で」です。because は後ろに「主語 + 動詞」を置く接続詞ですが、the darkness のように名詞（句）が続くときは、2 語で前置詞の働きをする because of を使います。同じ働きの語句に、thanks to 〜（〜のおかげで）、due to 〜（〜が原因で）があります。`
        },
        {
          label: '問1(5)',
          q: R`空所 ( 5 )（第6段落）に入る最も適切な語を選びなさい。`,
          type: 'choice', choices: ['as', 'for', 'of', 'on', 'to'], answer: 3,
          explain: R`**rely on 〜** で「〜に頼る」です。暗い巣の中では目に頼れないので、ハチたちは踊り手の動きを追い、触角で触れて情報を受け取る、という流れです。rely は後ろに on を取る動詞で、depend on 〜、count on 〜 も同じ意味です。`
        },
        {
          label: '問1(6)',
          q: R`空所 ( 6 )（第7段落）に入る最も適切な語を選びなさい。`,
          type: 'choice', choices: ['as', 'for', 'of', 'on', 'to'], answer: 4,
          explain: R`**according to 〜** で「〜に従って、〜に合わせて」です。太陽が動くので、踊り手は太陽の新しい位置に合わせて、ダンスの角度を少しずつ変えます。according の直後には必ず to が来る決まりなので、5 つの語のうち to が残ります。`
        },
        {
          label: '問2-A',
          q: R`"How are the direction and the distance of the food shown in the waggle dance, respectively?"（尻振りダンスでは、餌の方向と距離は、それぞれどのように示されますか）に対する正しい答えとなるように、次の英文の空所 ( 2-A ) に入る最も適切な語句を選びなさい。

The direction is shown by ( 2-A ), and the distance is shown by ( 2-B ).`,
          type: 'choice', choices: ['the number of watching bees', 'the angle of the straight run', 'the size of the small circle', 'the length of the straight run'], answer: 1,
          explain: R`第4段落の最後の文 the angle of the straight run shows the direction of the food が根拠です。巣板をまっすぐ上に走れば「太陽の方向」、右に傾いて走れば「太陽の右側」を表すように、**直進する走りの角度**が方向を示します。the size of the small circle は、餌が近いときの円を描く動きの話で、方向を伝える手がかりとしては本文に出てきません。`
        },
        {
          label: '問2-B',
          q: R`同じ問いに対する答えとして、空所 ( 2-B ) に入る最も適切な語句を選びなさい。

The direction is shown by ( 2-A ), and the distance is shown by ( 2-B ).`,
          type: 'choice', choices: ['the number of watching bees', 'the angle of the straight run', 'the size of the small circle', 'the length of the straight run'], answer: 3,
          explain: R`第5段落の最初の文 The distance is shown by the length of the straight run が根拠です。直進する走りが長く続く（体を振り続ける）ほど餌は遠くにあるので、距離を表すのは**走りの長さ**です。respectively（それぞれ）の問題では、前半（方向）と後半（距離）に同じ選択肢を入れないように、2 つの空所の対応を確かめます。the number of watching bees（見ているハチの数）は、情報の伝え方として本文に出てきません。`
        },
        {
          label: '問3(7)',
          q: R`下線部 (7) の these bees（第9段落）は、何を指しますか。最も適切なものを選びなさい。`,
          type: 'choice',
          choices: ['the researchers', 'all of the bees in the hive', 'the radar tags', 'the bees that had watched a dancer', 'the bees that had danced'],
          answer: 3,
          explain: R`these は直前の文の内容を受けます。直前の文は researchers glued tiny radar tags to **bees that had watched a dancer** and followed their flights（踊り手を見たハチに標識をつけて、その飛行を追った）で、標識をつけられたハチを these bees と呼んでいます。踊り手そのもの（the bees that had danced）ではなく、「ダンスを見ていた側」である点に注意します。the researchers と the radar tags は、「ダンスが示した場所に向かって飛んだ」主語にはなりません。`
        },
        {
          label: '問4',
          q: R`本文の内容と一致するように、次の英文の空所に入る最も適切な語句を選びなさい。

More bees are sent to the best flowers, because a bee that has found a rich supply of nectar (    ) than a bee that has found only a little.`,
          type: 'choice', choices: ['carries the smell of the hive', 'flies home more slowly', 'dances for a longer time', 'makes a smaller circle'], answer: 2,
          explain: R`第8段落に、A bee that has found a rich supply of nectar dances for longer and more eagerly than a bee that has found only a little（蜜をたっぷり見つけたハチは、少ししか見つけなかったハチよりも長く、熱心に踊る）とあり、続けて As a result, more bees are sent to the best flowers（その結果、より多くのハチが最良の花へ送り出される）と述べています。つまり、豊かな餌場を見つけたハチほど**長く踊る**（dances for a longer time）ので、見ているハチが多く集まります。ほかの選択肢は本文に書かれていません。`
        },
        {
          label: '問5(3)',
          q: R`空所 ( 3 )（第5段落）に入るように、次の語句を並べかえて、英文を完成させなさい。文頭に来る語句は大文字で始めてあります。`,
          type: 'order',
          words: ['the farther away', 'is', 'The longer', 'the bee', 'the food', 'keeps', 'waggling'],
          answer: 'The longer the bee keeps waggling the farther away the food is',
          explain: R`**the + 比較級 〜, the + 比較級 …** で「〜すればするほど、ますます…」です。前半は The longer（長いほど）+ 主語 the bee + 動詞 keeps waggling（体を振り続ける）、後半は the farther away（それだけ遠くに）+ the food is という形です。前の文で「距離は走りの長さで示される」と述べ、次の文で「短い尻振りは近く、長い尻振りは遠く」と述べているので、「長く振るほど遠い」という並べ方が文脈にも合います。`
        },
        {
          label: '問6(8)',
          q: R`空所 ( 8 )（第9段落）に入るように、次の 8 つの語句をすべて使って英文を完成させたい。並べかえたときに 4 番目に来る語句を選びなさい。ただし、語句はすべて小文字で示してあります。

The results show that ( 8 ).`,
          type: 'choice',
          choices: ['the food', 'they need', 'to find', 'give', 'the information', 'these dances', 'most of', 'the other bees'],
          answer: 6,
          explain: R`完成する文は **these dances give the other bees most of the information they need to find the food** です。give A B（A に B を与える）の形で、these dances（主語）→ give（動詞）→ the other bees（A）→ **most of**（B の前半）→ the information → they need（the information を説明する語句）→ to find → the food の順になります。したがって 4 番目は most of です。most of the + 名詞（〜のほとんど）は 1 つのかたまりで、of の直後に the information が続くことが決め手になります。`
        },
        {
          label: '問7',
          q: R`本文の内容と一致するものを、次の中から 2 つ選びなさい。`,
          type: 'multi',
          choices: [
            R`A bee that finds food close to the hive tells the others by doing the waggle dance.`,
            R`Von Frisch learned what the dance meant by watching bees in hives with glass walls.`,
            R`The bees that watch a dance can see the dancer clearly because the hive is bright.`,
            R`The study with radar tags showed that the watching bees flew in every direction.`,
            R`A dancing bee changes the angle of her dance during the day because the sun moves.`,
            R`Scientists cannot read the dance unless they follow the bees to the flowers.`
          ],
          answer: [1, 4],
          explain: R`正解の 1 つ目は「フォン・フリッシュは、ガラスの壁の巣箱でハチを観察して、ダンスの意味を解き明かした」で、第2段落の内容と一致します。2 つ目は「踊るハチは、太陽が動くので、日中にダンスの角度を変える」で、第7段落の内容です。
ほかの選択肢は次の点が誤りです。「巣の近くの餌は尻振りダンスで伝える」→ 近い餌は小さな円を描く動きで、尻振りダンスは遠い餌のときです（第3段落）。「巣が明るいので踊り手がよく見える」→ 巣の中は暗く、ハチたちは触角で触れて動きを追います（第6段落）。「レーダー標識の研究では、ハチはあらゆる方向に飛んだ」→ 多くはダンスが示した場所に向かいました（第9段落）。「ハチを追いかけない限りダンスは読めない」→ 撮影して角度と長さを測れば読み取れます（第10段落）。`
        }
      ],
      solution: [
        {
          t: '全体の流れをつかむ',
          n: R`段落ごとの要旨は次のとおりです。
第1段落: 導入（ミツバチは「ダンス」で花畑の位置を伝える）。
第2段落: フォン・フリッシュの研究。
第3段落: 2 種類のダンス（小さな円と尻振りダンス）。
第4段落: 方向の伝え方（太陽が目安で、走りの角度が方向を示す）。
第5段落: 距離の伝え方（走りの長さ）。
第6段落: 暗い巣の中で、見ているハチは触れて学ぶ。
第7段落: 太陽の動きに合わせて角度を変える。
第8段落: 餌の質も伝える。
第9段落: レーダー標識による検証。
第10段落: 人間によるダンスの解読と、その利用。
第11〜12段落: まとめ（小さな脳と、言葉のいらないメッセージ）。`,
          easy: R`この文章は、「発見した人 → 仕組み（方向・距離）→ 工夫（太陽の動き）→ 確かめた実験 → 役立て方」の順に進みます。仕組みを説明する文章では、「どんな方法で、何を伝えるか」を段落ごとに 1 つずつ拾うと、あとで設問の根拠を探すときに迷いません。`,
          pro: R`本番の第1問は 700 語台・14 段落ほどで、この類題より 2〜3 割ほど長くなります。長い科学記事は、段落の横に 3〜4 字のメモ（「方向」「距離」「検証」など）を書きながら読むと、指示語・整序・内容一致の根拠へすぐ戻れます。`
        },
        {
          t: '問1 前置詞は結びつきで決め、使った語を消していく',
          n: R`空所の前後の語とのセットで考えます。for many decades（何十年も）、be known **as** 〜（〜として知られる）、because **of** 〜（〜のために）、rely **on** 〜（〜に頼る）、according **to** 〜（〜に従って）。5 つとも熟語・語法で決まります。「同じ語は 1 度しか使えない」という条件があるので、確実に決まるもの（according to、because of）から埋め、残りを消去法で確かめます。`,
          pro: R`前置詞の空所は、前後 2〜3 語を見れば解けるものが大半です。1 問 10〜15 秒で処理して、整序や内容一致に時間を回しましょう。`
        },
        {
          t: '問2・問4 本文の言い換えを探す',
          n: R`問2 は respectively（それぞれ）の問題で、方向と距離の 2 つに、別々の語句を対応させます。方向は「走りの角度」（第4段落）、距離は「走りの長さ」（第5段落）です。問4 は、本文の dances for longer and more eagerly を、選択肢の dances for a longer time に言い換えた問題です。選択肢の語句を 1 つずつ本文と照らし合わせて、書かれていないものを消します。`,
          easy: R`respectively は「それぞれ、順に」という意味で、並べた 2 つのものを、順番どおりに 1 対 1 で対応させる合図です。「A は X で、B は Y です」と書き分けて、どちらにも同じ答えを入れないようにしましょう。`
        },
        {
          t: '問3 指示語は直前の文から探す',
          n: R`these bees のように、these + 名詞 は、直前の文の中の、同じ名詞（句）を受けることが多い表現です。直前の文で bees が出てくる箇所を探すと、bees that had watched a dancer（踊り手を見たハチ）と、標識をつけられた対象がわかります。踊り手（dancer）と、見ていたハチ（watcher）を取り違えないように注意します。`
        },
        {
          t: '問5・問6 整序は「骨組み」から決める',
          n: R`まず主語と動詞（文の骨組み）を決め、残りのかたまりを、文法の型に当てはめます。問5 は the + 比較級 〜, the + 比較級 … の型で、The longer ... keeps waggling（前半）、the farther away ... is（後半）に分けます。問6 は give A B（A に B を与える）の型で、A = the other bees、B = most of the information they need to find the food です。4 番目を問われる問題は、先頭から数えて、そこまでの語順だけを確実に決めれば解けます。`,
          easy: R`the longer, the farther のように、the を 2 回使う文は、「前半が原因（長く振る）、後半が結果（遠い）」という対になっています。比較級が出てきたら、まず the + 比較級 を 2 つ探して、前半と後半に分けましょう。`,
          pro: R`本番では、整序の問題は語句が 8〜9 個のかたまりに分けられ、4 番目の記号だけを答える形で出ます。完全な文を作らなくても、主語・動詞・目的語の順が決まれば 4 番目はわかります。先頭から順に決めていく練習をしておきましょう。`
        },
        {
          t: '問7 内容一致は段落に戻って 1 つずつ照合する',
          n: R`選択肢のキーワード（close to the hive, glass walls, bright, radar tags, changes the angle, follow the bees）を本文で探し、その段落の記述と照らし合わせます。誤りの選択肢には、「事実の取り違え」（近い餌 → 尻振りダンス）、「正反対」（暗い → 明るい）、「範囲の拡大」（多くの → あらゆる方向）、「条件の付け足し」（〜しない限り読めない）といった型があります。`
        }
      ],
      tags: ['前置詞', 'respectively', '指示語', '語句整序', '内容一致', '生物・動物行動']
    },

    /* ---------- 第2問 ---------- */
    {
      id: 'sk-e-2025-2',
      subject: 'english',
      level: 'mid',
      unit: 'e-reading',
      title: '長文：GPSはなぜ位置がわかるか',
      source: src('第2問'),
      time: 20,
      body: R`次の英文は、衛星を使って位置を知るしくみ GPS の原理と使い道についての解説文です。英文を読み、問1〜問3 と記述式の問に答えなさい。段落は上から順に第1段落〜第11段落と数えます。第2・3・8 段落の最初の文は、その段落の見出しにあたる疑問文です。下線部は (1)(3)(5)(6)(7)(9)(11)(14)、空所は (2)(4)(8)(10)(12)(13)(15) です。

注　receiver = 受信機　satellite = 人工衛星　atomic clock = 原子時計　relativity = 相対性理論　vapor = 蒸気　Galileo・GLONASS・BeiDou・Michibiki = 衛星を使った位置測定システムの名前`,
      fig: null,
      passage: 'sk-ep-2025-2',
      parts: [
        {
          label: '問1(1)',
          q: R`下線部 (1) の英単語 technology（第1段落）で、最も強く発音する音節を選びなさい。

tech-nol-o-gy（4 音節）`,
          type: 'choice',
          choices: ['1音節目（tech）', '2音節目（nol）', '3音節目（o）', '4音節目（gy）'],
          answer: 1,
          explain: R`**-ology で終わる語**は、語尾の -o-gy の直前の音節（語尾から 3 つ目）に第 1 アクセントが来ます。technology は tech-**NOL**-o-gy で、2 音節目の nol を強く読みます。同じ語尾の語に biology（bi-OL-o-gy）、geology（ge-OL-o-gy）、psychology（psy-CHOL-o-gy）があります。形容詞の technological は tech-no-**LOG**-i-cal で、語尾が変わると強く読む位置も 1 つ後ろへ移ります。`
        },
        {
          label: '問1(5)',
          q: R`下線部 (5) の英単語 information（第3段落）で、最も強く発音する音節を選びなさい。

in-for-ma-tion（4 音節）`,
          type: 'choice',
          choices: ['1音節目（in）', '2音節目（for）', '3音節目（ma）', '4音節目（tion）'],
          answer: 2,
          explain: R`**-tion で終わる語**は、-tion の直前の音節に第 1 アクセントが来ます。information は in-for-**MA**-tion で、3 音節目の ma を強く読みます。同じ語尾の語に station（STA-tion）、education（ed-u-CA-tion）、population（pop-u-LA-tion）があります。もとの動詞 inform は in-**FORM** で 2 音節目が強いので、-ation が付くと強く読む位置が 1 つ後ろへ移ります。`
        },
        {
          label: '問1(6)',
          q: R`下線部 (6) の英単語 satellite（第3段落）で、最も強く発音する音節を選びなさい。

sat-el-lite（3 音節）`,
          type: 'choice',
          choices: ['1音節目（sat）', '2音節目（el）', '3音節目（lite）'],
          answer: 0,
          explain: R`satellite は **SAT**-el-lite で、1 音節目の sat を強く読みます。3 音節の名詞には、最初の音節が強い語が多くあります（animal、camera、holiday など）。つづりの最後の lite（ライト）に引かれて、3 音節目を強く読んでしまう間違いが多いので注意しましょう。`
        },
        {
          label: '問1(11)',
          q: R`下線部 (11) の英単語 Engineers（第7段落）の単数形 engineer で、最も強く発音する音節を選びなさい。

en-gi-neer（3 音節）`,
          type: 'choice',
          choices: ['1音節目（en）', '2音節目（gi）', '3音節目（neer）'],
          answer: 2,
          explain: R`**-eer で終わる語**は、その -eer の部分を強く読みます。engineer は en-gi-**NEER** で、3 音節目の neer が第 1 アクセントです。同じ語尾の語に volunteer（vol-un-TEER）、career（ca-REER）、pioneer（pi-o-NEER）があります。-eer のほかにも、-ee（referee）、-ese（Japanese）、-ique（unique）は、語の最後の音節が強くなる代表的な語尾です。`
        },
        {
          label: '問2(2)',
          q: R`空所 ( 2 )（第1段落）に入る最も適切な前置詞を選びなさい。`,
          type: 'choice', choices: ['from', 'for', 'to', 'by'], answer: 0,
          explain: R`**signals from 〜** で「〜からの信号」です。from は出どころ（起点）を表す前置詞で、衛星から届いた信号を受信機が受け取る、という内容です。for（〜のために）や to（〜へ）では、信号の向きが逆になってしまいます。`
        },
        {
          label: '問2(4)',
          q: R`空所 ( 4 )（第3段落）に入る最も適切な前置詞を選びなさい。`,
          type: 'choice', choices: ['in', 'on', 'at', 'by'], answer: 2,
          explain: R`**at a height of 〜** で「〜の高さで」です。at は、高さ・速さ・温度などの数値の前に置く前置詞で、at a speed of 〜（〜の速さで）、at a temperature of 〜（〜の温度で）も同じ使い方です。in や on では、「その高さのところを回る」という意味を表せません。`
        },
        {
          label: '問2(8)',
          q: R`空所 ( 8 )（第4段落）に入る最も適切な前置詞を選びなさい。`,
          type: 'choice', choices: ['with', 'by', 'for', 'at'], answer: 0,
          explain: R`**compare A with B** で「A を B と比べる」です。ここでは、送った時刻（A）と届いた時刻（B）を比べて、差を求めています。compare A to B も使われますが、違いや差を調べるときは with がよく使われます。選択肢に to はないので、with を選びます。`
        },
        {
          label: '問2(10)',
          q: R`空所 ( 10 )（第6段落）に入る最も適切な前置詞を選びなさい。`,
          type: 'choice', choices: ['at', 'for', 'in', 'of'], answer: 3,
          explain: R`**a mistake of 〜** で「〜という（大きさの）誤り」です。of は「〜という大きさの」と数量を表す名詞につなぐ働きで、a mistake of one millionth of a second は「100 万分の 1 秒という誤り」を意味します。a difference of 3 cm（3 センチの差）、an error of 2 percent（2 パーセントの誤差）も同じ形です。`
        },
        {
          label: '問2(12)',
          q: R`空所 ( 12 )（第7段落）に入る最も適切な前置詞を選びなさい。`,
          type: 'choice', choices: ['on', 'for', 'to', 'of'], answer: 1,
          explain: R`**make up for 〜** で「〜を補う、〜の埋め合わせをする」です。衛星の時計の進み方が地上と違うので、その差を補うように調整する、という内容です。make up for lost time（失った時間を取り戻す）のようにも使います。`
        },
        {
          label: '問2(13)',
          q: R`空所 ( 13 )（第7段落）に入る最も適切な前置詞を選びなさい。`,
          type: 'choice', choices: ['by', 'at', 'for', 'in'], answer: 0,
          explain: R`**wrong by 〜** で「〜だけ間違っている、〜の差がある」です。by は「差の大きさ」を表す前置詞で、wrong by ten kilometers は「10 キロメートルの差で間違っている」という意味になります。late by five minutes（5 分遅れ）、win by two points（2 点差で勝つ）と同じ使い方です。`
        },
        {
          label: '問2(15)',
          q: R`空所 ( 15 )（第10段落）に入る最も適切な前置詞を選びなさい。`,
          type: 'choice', choices: ['with', 'at', 'on', 'by'], answer: 2,
          explain: R`**depend on 〜** で「〜に頼る、〜しだいである」です。携帯電話の通信網や電力システム、株式市場が、GPS の正確な時刻に頼っている、という内容です。depend は後ろに on を取る動詞で、rely on 〜 も同じ意味です。`
        },
        {
          label: '問3',
          q: R`次の英文 (3-1)〜(3-3) について、本文の内容と合っているものを ○、合っていないものを × として、○× の組合せが正しいものを選びなさい。ただし、○× は (3-1)〜(3-3) の順に並んでいます。

(3-1) The signal from a GPS satellite includes the time at which it was sent.
(3-2) A receiver can find its position on the Earth from the signal of one satellite alone.
(3-3) Michibiki was built to take the place of GPS in Japan.`,
          type: 'choice',
          choices: ['○○○', '○○×', '○×○', '×○○', '○××', '×○×', '××○', '×××'],
          answer: 4,
          explain: R`(3-1) は ○ です。第3段落に、信号は the moment when it was sent（送られた瞬間）と the position of the satellite（衛星の位置）の 2 つを運ぶ、とあります。選択肢の the time at which it was sent は、この the moment when it was sent の言い換えです。(3-2) は × です。第5段落に、1 つの衛星までの距離だけでは「巨大な球面のどこか」にいることしかわからない、とあり、位置を決めるには足りません。(3-3) は × です。第2段落に、Michibiki は GPS と**協力して働く**（works together with GPS）システムとあり、GPS の代わりではありません。したがって、5 番目の ○×× が正解です。`
        },
        {
          label: '記述1(14)',
          q: R`第8段落の下線部 (14) は、GPS が使える範囲について述べています。これと同じ内容を 1 語で言い表した形容詞が、第1段落の GPS の正式名称（the ... Positioning System）の中に含まれています。その語を抜き出して答えなさい。`,
          type: 'text', answer: 'global', hint: '半角英字で 1 語（大文字・小文字は問いません）',
          explain: R`下線部は「海の真ん中から山の頂上まで、地球上のほとんどどこでも使える」という意味です。「地球全体の、世界的な」を表す語は **global** で、GPS は Global Positioning System の略なので、名前の最初の語 Global がこの特徴を表しています。Positioning（位置を測ること）と System（しくみ）は、場所の広がりを表す語ではありません。global は globe（地球）の形容詞で、global warming（地球温暖化）のようにも使います。`
        },
        {
          label: '記述2(3)',
          q: R`下線部 (3) の similar systems（第2段落）の具体例として、本文中の固有名詞を 1 つ抜き出して答えなさい。`,
          type: 'text', answer: ['Galileo', 'GLONASS', 'BeiDou', 'Michibiki'], hint: '半角英字で 1 語（大文字・小文字は問いません）',
          explain: R`similar systems は「GPS に似たシステム」です。コロン（:）の後ろに具体例が並んでいて、Europe has **Galileo**, Russia has **GLONASS**, and China has **BeiDou** とあります。次の文の **Michibiki**（日本）も、GPS と協力して働く衛星を使った位置測定システムなので、正解とします。コロンの後ろは、前の語句を「具体的に言うと」と説明する働きをすることを覚えておきましょう。`
        },
        {
          label: '記述3(9)',
          q: R`下線部 (9)（第6段落）の意味として、最も適切なものを選びなさい。`,
          type: 'choice',
          choices: [
            'スマートフォンの時計は、衛星の原子時計よりはるかに正確である。',
            'スマートフォンの時計と衛星の原子時計は、同じくらい正確である。',
            '衛星の原子時計は、スマートフォンの時計よりはるかに正確さに欠ける。',
            'スマートフォンの時計は、衛星の原子時計よりはるかに正確さに欠ける。'
          ],
          answer: 3,
          explain: R`**less + 形容詞 + than 〜** は「〜ほど…ではない」を表す比較で、far は「はるかに」と差の大きさを強めます。far less exact than the atomic clocks は「原子時計よりはるかに正確でない」、つまり正確さがはるかに劣るという意味です。主語は The clock inside a smartphone なので、劣っているのはスマートフォンの時計のほうです。「衛星の原子時計が劣る」とする選択肢は、主語と比べる相手を取り違えています。同じ正確さだとする選択肢や、スマートフォンのほうが正確だとする選択肢は、less の向きを読み落としたものです。この文のあとで、時刻のわずかな誤差が距離の大きな誤差を生む、と問題点が続きます。`
        },
        {
          label: '記述4(7)①',
          q: R`下線部 (7) の neither（第3段落）は、直前の文に出てくる 2 つのものを受けています。その 2 つを表す英単語を、直前の文から 1 語ずつ抜き出し、出現順に答えなさい。まず 1 つ目を答えなさい。`,
          type: 'text', answer: 'moment', hint: '半角英字で 1 語',
          explain: R`neither は「（2 つのうち）どちらも〜ない」という意味で、直前の文で並べられた 2 つのものを受けます。直前の文は The signal carries two pieces of information: the **moment** when it was sent and the **position** of the satellite（信号は、送られた瞬間と衛星の位置という 2 つの情報を運ぶ）です。この 2 つの情報のどちらも持っていない受信機は、距離を割り出せない、という文脈です。出現順に、1 つ目は moment（瞬間）です。`
        },
        {
          label: '記述4(7)②',
          q: R`同じ neither が受けている 2 つ目の英単語を、直前の文から抜き出して答えなさい。`,
          type: 'text', answer: 'position', hint: '半角英字で 1 語',
          explain: R`直前の文の the moment when it was sent and the **position** of the satellite のうち、and の後ろに並べられた 2 つ目が position（位置）です。「moment（送られた瞬間）」と「position（衛星の位置）」の 2 つが揃って、はじめて受信機は信号の進んだ距離を求められます。neither は、この 2 つの両方を否定しています。`
        }
      ],
      solution: [
        {
          t: '全体の流れをつかむ',
          n: R`段落ごとの要旨は次のとおりです。
第1段落: GPS とは（受信機が衛星の信号から自分の位置を割り出す）。
第2段落: 開発の歴史と、似たシステム（ガリレオ・グロナス・北斗・みちびき）。
第3段落: 衛星が送る信号の中身（時刻と衛星の位置）。
第4段落: 距離の測り方（時刻の差 × 光の速さ）。
第5段落: 衛星 1 つでは足りない理由（理論上は 3 つで足りる）。
第6段落: 実際には 4 つ目が必要な理由（受信機の時計の誤差）。
第7段落: 衛星の時計の補正（相対性理論）。
第8段落: 使い道（航行・救助・農業）と、地球上どこでも使えること。
第9段落: 科学での利用（プレート・地震・気象）。
第10段落: 正確な時刻の利用。
第11段落: まとめ。`,
          easy: R`この文章は、「GPS とは何か → だれがつくったか → どう働くか → 難しい点 → どこで使われるか」と、疑問に答える順で進みます。第2・3・8段落の最初の疑問文を見出しとして拾い読みすると、全体の流れが先につかめます。`,
          pro: R`本番の第2問は 800 語台・13 段落ほどで、この類題より 3〜4 割長くなります。見出しの下に段落が続く形の解説文は、下線部と空所が段落をまたいで出るので、段落番号の横に内容のメモを書きながら読むと、根拠の段落へ戻る時間が短くなります。`
        },
        {
          t: '問1 アクセントは語尾の形で決める',
          n: R`語尾の形で、アクセントの位置はほぼ決まります。**-ology**（technology）は語尾から 3 つ目の音節（tech-**NOL**-o-gy）、**-tion**（information）は -tion の直前（in-for-**MA**-tion）、**-eer**（engineer）は語尾そのもの（en-gi-**NEER**）に第 1 アクセントが来ます。satellite のように規則に当てはまらない 3 音節の名詞は、最初の音節（**SAT**-el-lite）が強い語が多くあります。`,
          easy: R`「音節」は、母音を中心とした音のまとまりです。単語を声に出して、1 つの音のまとまりごとに手をたたくと、たたいた回数が音節の数になります。新しい単語を覚えるときは、「語尾の形 + 強く読む場所」をセットで覚えましょう。`,
          pro: R`アクセントの問題は、語尾の規則（-tion・-ic・-ity・-ology など）を知っていれば 1 問 10 秒で解けます。規則に当てはまらない語（satellite など）は、単語帳でアクセント記号まで確かめて、例外として覚えておきます。`
        },
        {
          t: '問2 前置詞は結びつく語で決める',
          n: R`空所の前後の語とのセットで考えます。signals **from** 〜（〜からの信号）、**at** a height of 〜（〜の高さで）、compare A **with** B（A を B と比べる）、a mistake **of** 〜（〜という誤り）、make up **for** 〜（〜を補う）、wrong **by** 〜（〜だけ間違っている）、depend **on** 〜（〜に頼る）。7 つとも熟語や語法の知識で決まるので、前後の 2〜3 語を見て、選択肢を 1 つずつ当てはめます。`,
          pro: R`選択肢の前置詞がばらばらなのは、「動詞や名詞との結びつき」が問われているサインです。わからないときは、選択肢を入れて音読し、日本語にして自然かどうかを確かめます。`
        },
        {
          t: '問3 正誤の組合せは 1 文ずつ判定する',
          n: R`3 つの英文を 1 つずつ本文と照らし合わせて、○か × を決めてから、組合せの選択肢を探します。(3-1) は第3段落（信号が運ぶのは「送った時刻」と「衛星の位置」）で ○、(3-2) は第5段落（1 つの衛星だけでは位置が決まらない）で ×、(3-3) は第2段落（みちびきは GPS と協力して働く）で × です。したがって ○×× を選びます。`,
          easy: R`組合せの問題は、先に 3 つとも自分で判定してから選択肢を見ると、迷いません。選択肢を先に見てしまうと、「○が多そう」といった思い込みで判定がぶれやすくなります。`
        },
        {
          t: '記述1・2 本文の別の場所から語を探す',
          n: R`記述1 は、下線部の内容を 1 語で言い表す語を、本文の別の場所（GPS の正式名称）から探す問題です。下線部は「地球上のほとんどどこでも」という意味なので、**Global**（地球全体の）が答えです。記述2 は、similar systems の具体例を、コロンの後ろの固有名詞（Galileo / GLONASS / BeiDou）から 1 つ抜き出します。`
        },
        {
          t: '記述3 比較の向きと主語を確かめて訳す',
          n: R`less + 形容詞 + than 〜（〜ほど…でない）のような比較の文は、「だれが」「だれと比べて」「どちら向きか」の 3 点を確かめて訳します。ここでは、主語は The clock inside a smartphone、比べる相手は the atomic clocks on the satellites、向きは far less exact（はるかに正確でない）なので、「スマートフォンの時計は、衛星の原子時計よりはるかに正確さに欠ける」となります。選択肢は、主語と相手の入れ替え、less と more の取り違え、「同じくらい」への置き換えで作られているので、1 つずつ確かめます。`,
          easy: R`「A is less exact than B」は、「A は B ほど正確ではない」、つまり「B のほうが A より正確」と言い換えられます。less は more の反対で、「〜より少ない」ことを表す語です。far を付けると「はるかに」と、差が大きいことを強めます。`,
          pro: R`和訳を選ぶ設問では、本文の文を主語から順に日本語にしておいてから選択肢を見ると、向きを逆にした罠に引っかかりません。比較の文では、「主語と相手の入れ替え」が定番の誤答です。`
        },
        {
          t: '記述4 neither は直前の「2 つ」を受ける',
          n: R`neither は、2 つのものを否定して「どちらも〜ない」を表す語です（both の反対）。直前の文で、2 つ並んでいるもの（the moment ... and the position ...）を探して、それぞれを 1 語で抜き出します。`,
          easy: R`both（どちらも〜）、either（どちらか一方）、neither（どちらも〜ない）は、いずれも「2 つのもの」について使う語です。3 つ以上のときは、all（すべて）、any（どれか）、none（どれも〜ない）を使います。`
        },
        {
          t: '本文の数値を確かめる',
          m: R`300000\ \text{km/s} \times 0.000001\ \text{s} = 0.3\ \text{km} = 300\ \text{m}`,
          n: R`第6段落の「100 万分の 1 秒の誤りで、位置は約 300 メートルずれる」は、第4段落の「光の速さは秒速約 30 万キロメートル」から確かめられます。距離 = 速さ × 時間 なので、300000 km/s × 0.000001 s = 0.3 km = 300 m です。本文の数値が筋道だっているかを自分で計算して確かめる習慣は、数値の入った設問や選択肢を判断するときに役立ちます。`,
          lv: 2
        }
      ],
      tags: ['アクセント', '前置詞', '正誤の組合せ', '語の抜き出し', '和訳', 'neither', '科学技術']
    },

    /* ---------- 第3問 ---------- */
    {
      id: 'sk-e-2025-3',
      subject: 'english',
      level: 'mid',
      unit: 'e-reading',
      title: '長文：まちがえて入ったパレード',
      source: src('第3問'),
      time: 10,
      body: R`次の英文は、ある家族が旅の途中で出会ったとんだ出来事を語った物語です（人物名・町は架空のものです）。英文を読み、問1・問2 に答えなさい。さらに、読解を確かめる追加の問3・問4 に答えなさい。段落は上から順に第1段落〜第7段落と数えます。空所は ( 1 )(2) です。

注　float = 山車（パレードで人や飾りを乗せて進む車）　marching band = 行進しながら演奏する楽団　judge = 審査員　microphone = マイク　side road = 脇道`,
      fig: null,
      passage: 'sk-ep-2025-3',
      parts: [
        {
          label: '問1ア',
          q: R`次の文は、本文の出来事をまとめたものです。空所（ア）に入る最も適切な日本語を選びなさい。

カーター一家は、（ア）ために、もう少しで（イ）ところだった。`,
          type: 'choice',
          choices: ['道に迷ってパレードに入り込んだ', '結婚式の会場で道に迷った', 'パレードに参加を申し込んだ', '警察官に道をたずねた'],
          answer: 0,
          explain: R`第2〜3段落に、一家は道に迷い（they were lost）、狭い通りに入ると、町のパレードの真ん中に入り込んでいた、とあります。したがって、原因は「道に迷ってパレードに入り込んだ」ことです。結婚式の会場で迷ったのではなく、会場へ向かう途中の町で迷いました。パレードに参加を申し込んだ事実はなく、道をたずねたのも一家ではありません（第6段落では、警察官のほうが一家に所属をたずねています）。`
        },
        {
          label: '問1イ',
          q: R`同じ文の空所（イ）に入る最も適切な日本語を選びなさい。

カーター一家は、（ア）ために、もう少しで（イ）ところだった。`,
          type: 'choice',
          choices: ['警察官に逮捕される', '結婚式に出られなくなる', '見物客にけがをさせる', 'パレードの賞をもらう'],
          answer: 3,
          explain: R`第7段落に、the judge told a reporter that he had been about to give their car a prize（審査員は、一家の車に賞を与えようとしていたところだったと記者に語った）とあります。be about to 〜 は「まさに〜しようとしている」で、実際には賞は与えられなかったので、「もう少しで賞をもらう**ところだった**」が正解です。警察官は笑い出して脇道を教えてくれたので、逮捕されるところではありませんでした。結婚式には 1 時間遅れましたが、出られなくなってはいません。見物客にけがをさせる場面は本文にありません。`
        },
        {
          label: '問2A(1)',
          q: R`空所 ( 1 )（第4段落）に入る動詞は、次の英語の説明に当たる語です。最初の 1 文字で始まる英単語 1 語を、つづりを正確に書きなさい。ただし、語の形（時制など）は、説明文や本文の文脈に合う形で書くこと。

( w ... ) = spoke very quietly, so that only the person next to you could hear`,
          type: 'text', answer: 'whispered', hint: '最初の 1 文字も含めて、単語全体を半角英字で入力（過去形で）',
          explain: R`説明文の spoke very quietly（とても小さな声で話した）、so that only the person next to you could hear（隣にいる人にしか聞こえないように）から、**whisper**（ささやく）です。説明文が spoke と過去形で書かれ、本文でも「カーターさんが妻にささやいた」という過去の出来事なので、過去形の **whispered** と書きます。第4段落では、山車がすぐ後ろまで迫っていて動揺しながらも、周囲に聞こえないように声を落とす場面です。`
        },
        {
          label: '問2B(2)',
          q: R`空所 ( 2 )（第4段落）に入る動詞は、次の英語の説明に当たる語です。最初の 1 文字で始まる英単語 1 語を、つづりを正確に書きなさい。ただし、語の形（時制など）は、説明文や本文の文脈に合う形で書くこと。

( c ... ) = to shout loudly to show that you are happy about someone or something, or to give them support`,
          type: 'text', answer: 'cheer', hint: '最初の 1 文字も含めて、単語全体を半角英字で入力',
          explain: R`説明文の to shout loudly（大声で叫ぶ）、to show that you are happy about someone or something（だれかや何かについて喜んでいることを示すために）、or to give them support（または応援するために）から、**cheer**（歓声をあげる、声援を送る）です。第4段落では、通りの人々が、一家をショーの一部だと思って歓声をあげ始める場面です。began to の後ろなので、動詞の原形 cheer を書きます。`
        },
        {
          label: '問3',
          q: R`第4段落で、カーターさんが車の向きを変えて引き返せなかったのはなぜですか。本文の内容に合うものを選びなさい。`,
          type: 'choice',
          choices: ['道が狭すぎて、車の向きを変えられなかったから', '妻が運転を続けるように強く求めたから', '山車がすでにすぐ後ろまで来ていたから', '警察官が車の前に立ちふさがっていたから'],
          answer: 2,
          explain: R`第4段落の最初の文に、Mr. Carter could not turn around, because the floats were already close behind him（山車がすでにすぐ後ろまで来ていたので、引き返せなかった）とあります。because の後ろが理由です。妻の Just keep driving! という言葉は、引き返せないとわかったあとの発言です。警察官が現れるのは第6段落で、あとの出来事です。道の狭さが理由だとは、本文に書かれていません。`
        },
        {
          label: '問4',
          q: R`本文の内容と一致するものを、次の中から 2 つ選びなさい。`,
          type: 'multi',
          choices: [
            R`The Carters were late for the wedding because their car broke down.`,
            R`Mr. Carter turned the car around as soon as he saw the parade.`,
            R`The people along the street thought that the family was part of the parade.`,
            R`The police officer was angry and gave Mr. Carter a ticket.`,
            R`A judge at the parade was about to give the family's car a prize.`,
            R`The family arrived at the wedding before it started.`
          ],
          answer: [2, 4],
          explain: R`正解の 1 つ目は「通りの人々は、一家がパレードの一部だと思った」で、第4段落の because they thought that the family was part of the show と一致します。2 つ目は「パレードの審査員は、一家の車に賞を与えようとしていた」で、第7段落の内容です。
ほかの選択肢は次の点が誤りです。「車が故障して遅れた」→ 遅れたのは、道に迷ってパレードに入り込んだためで、故障の話は本文にありません。「パレードを見てすぐ引き返した」→ 山車が後ろにいて、引き返せませんでした（第4段落）。「警察官は怒って違反切符を切った」→ 警察官は笑い出して、脇道を教えてくれました（第6段落）。「結婚式が始まる前に着いた」→ 1 時間遅れて着きました（第7段落）。`
        }
      ],
      solution: [
        {
          t: '物語文は「人物・場面・出来事の順序」を整理して読む',
          n: R`この物語は、登場人物（カーター夫妻、子どもたち、警察官、審査員）と、出来事の順序を押さえると読みやすくなります。
第1〜2段落: 出発し、地図係のカーターさんの勘違いで道に迷う。
第3段落: 町のパレードの真ん中に入り込む。
第4〜5段落: 引き返せず、見物客に歓迎される。
第6段落: 警察官に止められて事情を話し、脇道を教えてもらう。
第7段落: 結婚式に遅れて着き、翌日、審査員の話が伝わる。`,
          easy: R`物語文では、「だれが・どこで・何をしたか」を段落ごとに 1 行でメモしながら読みます。出来事が、時間の順に並んでいるかどうかも確かめましょう。この物語のように、思いがけない出来事が重なる話では、「きっかけ」と「結果」の対応が設問になりやすいです。`,
          pro: R`本番の第3問は 270 語前後の短い物語で、日本語の記述で出来事を要約する問題と、英語の説明から頭文字つきで単語を書く問題が出ます。長い第1問・第2問に時間を回せるよう、この大問は短時間で確実に終えたいところです。`
        },
        {
          t: '問1 「原因」と「もう少しで起こりかけたこと」の要約',
          n: R`出来事の要約は、「原因（何をしたために）」と「結果（どうなりかけたか）」の 2 つを、本文から 1 つずつ探します。原因は、第2〜3段落の「道に迷って、パレードに入り込んだ」こと。結果は、第7段落の「審査員が一家の車に賞を与えようとしていた」こと、つまり「もう少しで賞をもらうところだった」です。`,
          easy: R`「もう少しで〜するところだった」は、実際には起こらなかったことを表します。英語では be about to 〜（まさに〜しようとする）や almost（もう少しで）にあたります。本文の had been about to give ... a prize が、「賞をもらうところだった」の根拠です。`
        },
        {
          t: '問2 英語の説明から単語を書く',
          n: R`英語の説明は、「上位の語（どんな種類か）+ 特徴」の形で書かれます。( w ... ) は spoke very quietly ...（動作の一種）、( c ... ) は to shout ...（動作の一種）なので、それぞれ頭文字に合う動詞を思い浮かべます。語の形は、説明文の形（過去形、to + 原形）と本文の文脈（he whispered、began to）で決めます。`,
          easy: R`whisper は「ささやく」という動詞のほかに、「ささやき声」という名詞でもあります。cheer は「元気づける」の意味もあり、cheer up（元気を出す）の形でも使います。知っているつもりの単語も、別の意味や形で出てくることがあるので、使われ方ごと覚えましょう。`,
          pro: R`頭文字つきの記述問題は、(1) 品詞（名詞か動詞か）、(2) 語の形（原形・過去形・-ing 形）、(3) つづり、の 3 点を確かめれば取りこぼしません。説明文が過去形なら、答えも過去形になることが多いです。`
        },
        {
          t: '問3・問4 理由と内容一致は本文の根拠を探す',
          n: R`問3 は、理由を問う設問です。「なぜ〜できなかったのか」は、because や so の周辺を探します。第4段落の最初の文に because the floats were already close behind him とあります。問4 の内容一致は、選択肢のキーワード（broke down, turned around, thought, ticket, prize, before it started）を本文で探し、1 つずつ照合します。誤りの選択肢は、「本文にない原因」「順序の入れ替え」「人物の反応の取り違え」の型で作られています。`
        }
      ],
      tags: ['物語文', '出来事の要約', '英英定義', '語形の指定', '理由', '内容一致']
    }
  ]);
})();
