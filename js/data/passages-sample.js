/* GOKAKU NAVI — 和訳ツール用サンプル長文（6 本）
   basic 2 本 / mid 2 本 / adv 2 本。英文・和訳ともに書き下ろし（既存の書籍・記事・試験問題の文面は含まない）。
   和訳ツールの翻訳メモリ（文単位の完全一致・類似文照合）と、サンプル長文の選択に使われる。 */
(function () {
  'use strict';
  const R = String.raw;

  JK.registerPassages([
    /* ================= basic ================= */
    {
      id: 'ep-sample-basic-01',
      title: 'Learning to Cook',
      level: 'basic',
      topic: '生活・体験',
      source: { univ: 'オリジナル' },
      paras: [
        [
          { en: R`Last spring, I decided to learn how to cook.`, ja: R`昨年の春、私は料理の仕方を学ぶことに決めた。` },
          { en: R`My mother works late on weekdays, so I often had to eat dinner alone.`, ja: R`母は平日は遅くまで働いているので、私はよく一人で夕食を食べなければならなかった。` },
          { en: R`I was tired of eating cold food from the supermarket.`, ja: R`私はスーパーで買った冷めた食べ物を食べるのにうんざりしていた。` }
        ],
        [
          { en: R`At first, it was not easy.`, ja: R`最初は、それは簡単ではなかった。` },
          { en: R`I burned the rice, and the soup was too salty to drink.`, ja: R`私はご飯を焦がしてしまい、スープは塩辛すぎて飲めなかった。` },
          { en: R`My little brother laughed at me, but my mother gave me some good advice.`, ja: R`弟は私を笑ったが、母はいくつかよい助言をしてくれた。` },
          { en: R`She told me to read the recipe carefully and to taste the food while cooking.`, ja: R`母は私に、レシピを注意深く読み、調理しながら味見をするように言った。` }
        ],
        [
          { en: R`Now I can make five different dishes.`, ja: R`今では、私は5種類の料理を作ることができる。` },
          { en: R`My favorite is vegetable curry because it is easy and healthy.`, ja: R`私の好物は野菜カレーだ。簡単で健康的だからである。` },
          { en: R`Last Sunday, my family enjoyed the curry I made.`, ja: R`先週の日曜日、家族は私が作ったカレーを楽しんで食べた。` },
          { en: R`My mother said it was the best curry she had ever eaten, and I felt very proud.`, ja: R`母はこれまで食べた中で最高のカレーだと言ってくれて、私はとても誇らしく感じた。` },
          { en: R`Cooking has taught me that small efforts can lead to big changes.`, ja: R`料理は私に、小さな努力が大きな変化につながりうることを教えてくれた。` }
        ]
      ],
      vocab: ['weekday', 'advice', 'recipe', 'taste', 'burn', 'salty', 'proud', 'effort', 'lead'],
      vocabExtra: [
        ['salty', '形', '塩辛い; しょっぱい', 1]
      ]
    },
    {
      id: 'ep-sample-basic-02',
      title: 'Bicycles in Our Town',
      level: 'basic',
      topic: '社会・環境',
      source: { univ: 'オリジナル' },
      paras: [
        [
          { en: R`More and more people in our town ride bicycles to work and school.`, ja: R`私たちの町では、仕事や学校へ自転車で通う人がますます増えている。` },
          { en: R`There are several reasons for this change.`, ja: R`この変化にはいくつかの理由がある。` },
          { en: R`First, a bicycle is cheaper than a car or a train.`, ja: R`第一に、自転車は車や電車よりも安い。` },
          { en: R`You do not have to buy gas, and you do not pay for tickets.`, ja: R`ガソリンを買う必要はなく、切符代を払うこともない。` }
        ],
        [
          { en: R`Second, riding a bicycle is good for your health.`, ja: R`第二に、自転車に乗ることは健康によい。` },
          { en: R`It makes your legs strong and helps you stay fit.`, ja: R`それは脚を強くし、体調を保つ助けになる。` },
          { en: R`Doctors say that we should exercise for at least thirty minutes every day.`, ja: R`医師たちは、私たちは毎日少なくとも30分は運動すべきだと言う。` },
          { en: R`Many people cannot find the time, but riding to work solves this problem.`, ja: R`多くの人は時間を見つけられないが、自転車で通勤すればこの問題は解決する。` }
        ],
        [
          { en: R`Third, bicycles are kind to the environment.`, ja: R`第三に、自転車は環境にやさしい。` },
          { en: R`They do not make any noise or dirty the air.`, ja: R`自転車は騒音を出すことも、空気を汚すこともない。` },
          { en: R`Our town has built new bike lanes along the main roads, so riding is much safer than before.`, ja: R`町は幹線道路沿いに新しい自転車専用レーンを作ったので、自転車に乗ることは以前よりずっと安全になった。` },
          { en: R`Of course, bicycle riders must follow the rules.`, ja: R`もちろん、自転車に乗る人は決まりを守らなければならない。` },
          { en: R`They should stop at red lights and wear a helmet.`, ja: R`赤信号では止まり、ヘルメットをかぶるべきだ。` },
          { en: R`If everyone does this, our town will become a better place to live.`, ja: R`全員がそうすれば、私たちの町はもっと住みやすい場所になるだろう。` }
        ]
      ],
      vocab: ['gas', 'exercise', 'solve', 'environment', 'noise', 'lane', 'fit', 'helmet'],
      vocabExtra: []
    },

    /* ================= mid ================= */
    {
      id: 'ep-sample-mid-01',
      title: 'Bees and the Food on Our Table',
      level: 'mid',
      topic: '科学・環境',
      source: { univ: 'オリジナル' },
      paras: [
        [
          { en: R`When we sit down to eat, we rarely think about the insects that helped to produce our meal.`, ja: R`食卓につくとき、私たちは食事を作るのに役立った昆虫のことをめったに考えない。` },
          { en: R`Yet about one third of the food we eat depends on pollination, and bees do much of that work.`, ja: R`しかし、私たちが食べる食べ物のおよそ3分の1は受粉に依存しており、その仕事の多くをミツバチが担っている。` },
          { en: R`When a bee visits a flower to collect a sweet liquid called nectar, tiny grains of pollen stick to its body.`, ja: R`ミツバチが蜜と呼ばれる甘い液体を集めに花を訪れると、その体に小さな花粉の粒がくっつく。` },
          { en: R`The bee then carries the pollen to the next flower it visits, and this makes it possible for the plant to produce seeds and fruit.`, ja: R`ミツバチはその花粉を次に訪れる花へと運び、これによって植物は種子や果実をつけることができるようになる。` }
        ],
        [
          { en: R`Apples, almonds, blueberries, and many other crops would be much harder to grow without bees.`, ja: R`リンゴ、アーモンド、ブルーベリー、そのほか多くの作物は、ミツバチがいなければ育てるのがずっと難しくなるだろう。` },
          { en: R`In some regions, farmers must now rent hives and move them into their orchards every spring.`, ja: R`地域によっては、農家は今や巣箱を借りて、毎年春にそれを果樹園へ運び入れなければならない。` },
          { en: R`Unfortunately, bee populations have been falling in many countries.`, ja: R`残念ながら、多くの国でミツバチの数は減り続けている。` },
          { en: R`Scientists believe that several causes are working together.`, ja: R`科学者たちは、いくつかの原因が重なり合って作用していると考えている。` }
        ],
        [
          { en: R`The use of strong chemicals on farms is one cause, because these substances can harm the insects even in very small amounts.`, ja: R`農場での強い化学薬品の使用は原因の一つである。そうした物質は、ごく少量でも昆虫に害を及ぼしうるからだ。` },
          { en: R`Another cause is the loss of wild flowers, which gives bees fewer places to find food.`, ja: R`もう一つの原因は野の花の減少であり、そのせいでミツバチが食べ物を見つけられる場所が少なくなっている。` },
          { en: R`Diseases spread by tiny mites also kill large numbers of bees every year.`, ja: R`ごく小さなダニが広める病気も、毎年大量のミツバチを死なせている。` }
        ],
        [
          { en: R`What can ordinary people do to help?`, ja: R`ふつうの人々には、助けるために何ができるだろうか。` },
          { en: R`One simple answer is to plant flowers that bloom at different times of the year, so that bees can find food from early spring until late autumn.`, ja: R`簡単な答えの一つは、一年のうちさまざまな時期に咲く花を植えて、ミツバチが早春から晩秋まで食べ物を見つけられるようにすることである。` },
          { en: R`Buying honey from local farmers and avoiding unnecessary chemicals in the garden also make a difference.`, ja: R`地元の農家から蜂蜜を買ったり、庭で不必要な薬品を使わないようにしたりすることも、違いを生む。` },
          { en: R`Small actions like these may seem unimportant, but when many people take them together, the results can be surprisingly large.`, ja: R`こうした小さな行動は取るに足りないように思えるかもしれないが、多くの人がいっしょに行えば、その成果は驚くほど大きくなりうる。` }
        ]
      ],
      vocab: ['insect', 'pollination', 'nectar', 'pollen', 'crop', 'hive', 'orchard', 'population', 'chemical', 'substance', 'harm', 'disease', 'mite', 'bloom', 'unnecessary'],
      vocabExtra: [
        ['pollination', '名', '受粉', 3],
        ['nectar', '名', '(花の)蜜', 3],
        ['pollen', '名', '花粉', 3],
        ['hive', '名', 'ミツバチの巣箱; 蜂の巣', 3],
        ['orchard', '名', '果樹園', 3],
        ['mite', '名', 'ダニ', 3]
      ]
    },
    {
      id: 'ep-sample-mid-02',
      title: 'Reading on Paper and on Screens',
      level: 'mid',
      topic: '教育・技術',
      source: { univ: 'オリジナル' },
      paras: [
        [
          { en: R`These days, many students read more on screens than on paper.`, ja: R`近ごろは、紙よりも画面で読む量のほうが多い学生がたくさんいる。` },
          { en: R`Smartphones and tablets are convenient because they allow us to carry hundreds of books in a bag.`, ja: R`スマートフォンやタブレットは、カバンの中に何百冊もの本を入れて持ち運べるので便利だ。` },
          { en: R`However, several studies suggest that the medium may affect how well we understand what we read.`, ja: R`しかし、読んだものをどれだけよく理解できるかに媒体が影響を及ぼすかもしれないと、いくつかの研究は示唆している。` }
        ],
        [
          { en: R`In one experiment, two groups of students read the same short story.`, ja: R`ある実験では、2つの学生グループが同じ短編小説を読んだ。` },
          { en: R`One group used printed pages, and the other used a tablet.`, ja: R`一方のグループは印刷されたページを使い、もう一方はタブレットを使った。` },
          { en: R`Afterward, both groups were asked to put the main events of the story in the correct order.`, ja: R`その後、両グループは物語の主な出来事を正しい順序に並べるよう求められた。` },
          { en: R`The students who had read the paper version did slightly better than those who had read on the tablet.`, ja: R`紙版を読んだ学生のほうが、タブレットで読んだ学生よりもわずかによい成績を収めた。` },
          { en: R`The researchers explained that paper gives readers a physical sense of where they are in a text.`, ja: R`研究者たちは、紙は読み手に、文章のどのあたりにいるのかという物理的な感覚を与えるのだと説明した。` },
          { en: R`You can feel the thickness of the pages you have already read and the pages that remain.`, ja: R`すでに読んだページの厚みと、残っているページの厚みを、手で感じ取ることができる。` }
        ],
        [
          { en: R`Screens, on the other hand, have their own advantages.`, ja: R`一方、画面にはそれ独自の利点がある。` },
          { en: R`Readers can change the size of the letters, search for a word in seconds, and look up its meaning without leaving the page.`, ja: R`読み手は文字の大きさを変え、数秒で単語を検索し、ページを離れずにその意味を調べることができる。` },
          { en: R`For people with poor eyesight, such features are not just helpful but necessary.`, ja: R`視力の弱い人にとって、そうした機能は役に立つだけでなく必要不可欠でもある。` },
          { en: R`Moreover, digital books are often cheaper, and they never take up space on a shelf.`, ja: R`さらに、電子書籍はたいてい値段が安く、本棚の場所をとることもない。` }
        ],
        [
          { en: R`So which is better?`, ja: R`では、どちらがよいのか。` },
          { en: R`The answer depends on what we are reading and why.`, ja: R`答えは、何を、何のために読むかによって決まる。` },
          { en: R`For a long and difficult text that requires careful thought, many experts recommend printing it out.`, ja: R`じっくり考える必要のある長くて難しい文章については、印刷して読むことを勧める専門家が多い。` },
          { en: R`For a quick look at the news, however, a screen is perfectly suitable.`, ja: R`しかし、ニュースにざっと目を通すだけなら、画面で十分に事足りる。` },
          { en: R`What matters most is that we choose the method that suits our purpose instead of simply following habit.`, ja: R`最も大切なのは、習慣にただ従うのではなく、自分の目的に合った方法を選ぶことである。` }
        ]
      ],
      vocab: ['convenient', 'medium', 'experiment', 'version', 'physical', 'advantage', 'feature', 'eyesight', 'necessary', 'recommend', 'suitable', 'purpose', 'habit'],
      vocabExtra: [
        ['eyesight', '名', '視力', 2]
      ]
    },

    /* ================= adv ================= */
    {
      id: 'ep-sample-adv-01',
      title: 'The Hidden Cost of Convenience',
      level: 'adv',
      topic: '社会・経済',
      source: { univ: 'オリジナル' },
      paras: [
        [
          { en: R`Few inventions have changed daily life as quickly as online shopping.`, ja: R`オンラインショッピングほど急速に日常生活を変えた発明はほとんどない。` },
          { en: R`With a few taps on a screen, we can order almost anything, and it often arrives at our door the very next day.`, ja: R`画面を数回タップするだけで、私たちはほとんど何でも注文でき、しかもそれはたいてい翌日には玄関先に届く。` },
          { en: R`For busy families in particular, the change has saved a great deal of time and effort.`, ja: R`とりわけ忙しい家庭にとって、この変化は多くの時間と手間を省いてくれた。` },
          { en: R`It is hardly surprising, then, that many people have come to regard this speed as a basic right rather than a special service.`, ja: R`それゆえ、多くの人がこの速さを特別なサービスではなく基本的な権利とみなすようになったのも、ほとんど驚くには当たらない。` }
        ],
        [
          { en: R`Behind this convenience, however, lies a cost that is easy to overlook.`, ja: R`しかし、この便利さの裏には、見過ごされやすい代償がある。` },
          { en: R`Every package has to be wrapped, sorted, loaded onto a truck, and driven to its destination, and each of these steps uses energy.`, ja: R`どの荷物も、包装され、仕分けられ、トラックに積まれ、目的地まで運ばれなければならず、これらの各段階がエネルギーを消費する。` },
          { en: R`What is worse, many deliveries are made in half-empty vehicles, because customers expect their goods to arrive at the exact time they have chosen.`, ja: R`さらに悪いことに、客は自分が選んだちょうどその時刻に商品が届くことを期待するため、多くの配達が半分空の車で行われている。` },
          { en: R`The result is that the number of delivery trucks on city streets has risen sharply, adding to traffic jams and air pollution.`, ja: R`その結果、市街地の道路を走る配送トラックの数は急増し、交通渋滞や大気汚染に拍車をかけている。` }
        ],
        [
          { en: R`Packaging is another source of waste.`, ja: R`包装材はもう一つのごみの発生源である。` },
          { en: R`A small item such as a phone case is often shipped in a box several times larger than necessary, surrounded by plastic that will be thrown away within minutes.`, ja: R`スマートフォンのケースのような小さな品物が、必要な大きさの何倍もある箱に入れられ、数分のうちに捨てられるプラスチックに囲まれて発送されることもよくある。` },
          { en: R`Had consumers been aware of this, some of them might have chosen to wait a little longer in return for less packaging.`, ja: R`もし消費者がこのことに気づいていたなら、包装が少なくなる代わりにもう少し待つことを選んだ人もいたかもしれない。` },
          { en: R`Recycling helps, but it is no substitute for producing less waste in the first place.`, ja: R`リサイクルは役に立つが、そもそもごみを出さないようにすることの代わりにはならない。` }
        ],
        [
          { en: R`Some companies have started to respond.`, ja: R`対応を始めた企業もある。` },
          { en: R`They offer a slower delivery option that groups several orders together, and they reward customers who choose it with a small discount.`, ja: R`そうした企業は、複数の注文をまとめて届ける、より遅い配送方法を用意し、それを選んだ客には少額の割引で報いている。` },
          { en: R`Others have redesigned their boxes so that they can be reused or turned into new paper.`, ja: R`箱を設計し直して、再利用したり新しい紙に作り替えたりできるようにした企業もある。` },
          { en: R`Such efforts are encouraging, but they will not succeed unless customers are willing to change their own habits.`, ja: R`こうした取り組みは心強いが、客自身が習慣を変える気にならなければ、成功しないだろう。` },
          { en: R`The more we demand speed, the more the planet pays for it.`, ja: R`私たちが速さを求めれば求めるほど、地球はその代償を払うことになる。` },
          { en: R`It is not the technology itself but the way we use it that deserves our attention.`, ja: R`注意を向けるべきなのは、技術そのものではなく、それを使う私たちのやり方である。` }
        ]
      ],
      vocab: ['invention', 'overlook', 'destination', 'vehicle', 'sharply', 'pollution', 'packaging', 'consumer', 'aware', 'discount', 'reward', 'redesign', 'reuse', 'demand', 'deserve'],
      vocabExtra: [
        ['sharply', '副', '急激に; 鋭く', 2],
        ['packaging', '名', '包装; 梱包材', 2],
        ['redesign', '動', '〜を設計し直す', 3],
        ['reuse', '動', '〜を再利用する', 2]
      ]
    },
    {
      id: 'ep-sample-adv-02',
      title: 'How Cities Keep Cool',
      level: 'adv',
      topic: '科学・都市',
      source: { univ: 'オリジナル' },
      paras: [
        [
          { en: R`On a hot summer afternoon, the temperature in the center of a large city can be several degrees higher than in the countryside around it.`, ja: R`暑い夏の午後には、大都市の中心部の気温が、周囲の田園地帯より数度高くなることがある。` },
          { en: R`Scientists call this the urban heat island effect.`, ja: R`科学者たちはこれを都市ヒートアイランド現象と呼ぶ。` },
          { en: R`Its causes are not difficult to understand.`, ja: R`その原因は理解しにくいものではない。` },
          { en: R`A hot city is also a restless one: at night, the stored heat keeps the air warm, and people find it hard to sleep.`, ja: R`暑い都市は眠れない都市でもある。夜になっても蓄えられた熱が空気を暖かく保ち、人々はなかなか寝つけない。` },
          { en: R`Dark roofs and roads absorb sunlight and release it slowly as heat, while concrete buildings trap warm air between them.`, ja: R`黒っぽい屋根や道路は日光を吸収してそれをゆっくりと熱として放出し、コンクリートの建物は建物どうしのあいだに暖かい空気を閉じ込める。` },
          { en: R`In addition, air conditioners push the heat from inside buildings out into the streets, which makes the outdoor air even warmer.`, ja: R`さらに、エアコンは建物の中の熱を通りへと押し出すので、屋外の空気はいっそう暖かくなる。` }
        ],
        [
          { en: R`This is not merely a matter of comfort.`, ja: R`これは単に快適さの問題ではない。` },
          { en: R`During long heat waves, elderly people and small children are especially likely to become seriously ill, and hospitals often report a sharp rise in patients.`, ja: R`長い熱波のあいだは、高齢者や幼い子どもがとりわけ重い病気になりやすく、病院では患者の急増が報告されることも多い。` },
          { en: R`Moreover, the demand for electricity rises so quickly on such days that power companies sometimes have difficulty supplying enough.`, ja: R`さらに、そのような日には電力需要があまりに急激に増えるため、電力会社が十分な電力を供給するのに苦労することもある。` }
        ],
        [
          { en: R`Fortunately, city planners have a number of tools at their disposal.`, ja: R`幸い、都市計画の担当者には自由に使える手段がいくつもある。` },
          { en: R`One of the most effective is to increase the amount of greenery.`, ja: R`最も効果的なものの一つは、緑の量を増やすことである。` },
          { en: R`Trees provide shade, and the water that evaporates from their leaves cools the surrounding air, much as sweat cools our skin.`, ja: R`木々は日陰をつくり、葉から蒸発する水分は、汗が私たちの肌を冷やすのとちょうど同じように、周囲の空気を冷やす。` },
          { en: R`Some cities have gone further by covering the roofs of public buildings with grass and low plants.`, ja: R`公共の建物の屋根を芝や背の低い植物で覆うことで、さらに踏み込んだ都市もある。` },
          { en: R`Another approach is to paint roofs and roads in light colors, which reflect more sunlight than dark ones.`, ja: R`もう一つの方法は、屋根や道路を明るい色に塗ることで、明るい色は暗い色よりも多くの日光を反射する。` },
          { en: R`Even something as modest as a fountain in a public square can bring some relief on a hot day.`, ja: R`広場に噴水を設けるといった控えめな工夫でも、暑い日にはいくらかの涼しさをもたらしてくれる。` }
        ],
        [
          { en: R`No single measure can solve the problem, however.`, ja: R`しかし、単一の対策でこの問題が解決できるわけではない。` },
          { en: R`Having studied several cities, researchers concluded that the best results came from combining many small changes.`, ja: R`いくつかの都市を調査した研究者たちは、最良の成果は多くの小さな変化を組み合わせることから得られると結論づけた。` },
          { en: R`A park, a row of trees, and a white roof may each reduce the temperature only slightly, but together they can make a street noticeably cooler.`, ja: R`公園、並木、白い屋根は、それぞれでは気温をわずかしか下げないかもしれないが、組み合わせれば通りを目に見えて涼しくすることができる。` },
          { en: R`In the end, a cool city is not the product of one clever invention but the result of patient, shared effort.`, ja: R`結局のところ、涼しい都市は一つの賢い発明の産物ではなく、辛抱強く皆で取り組んだ努力の成果である。` }
        ]
      ],
      vocab: ['urban', 'absorb', 'release', 'trap', 'concrete', 'elderly', 'supply', 'greenery', 'shade', 'evaporate', 'reflect', 'measure', 'noticeably', 'conclude', 'patient'],
      vocabExtra: [
        ['greenery', '名', '緑; 草木', 3],
        ['noticeably', '副', '目立って; 著しく', 3]
      ]
    }
  ]);
})();
