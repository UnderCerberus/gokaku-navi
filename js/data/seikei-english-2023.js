/* GOKAKU NAVI — 成蹊大学 理工学部 英語 2023 年度 準拠の類題
   大問構成・設問形式・語数の目安だけを 2023 年度に合わせ、
   英文・設問・選択肢・解説はすべて書き下ろしたもの（過去問の文面は含まない）。 */
(function () {
  'use strict';
  const R = String.raw;
  const src = function (no) {
    return { univ: '成蹊大学', faculty: '理工学部', year: 2023, no: no, kind: '類題' };
  };

  /* ================================================================
   *  長文（passage）
   * ================================================================ */
  JK.registerPassages([
    /* ---------- 第1問: 科学史の読み物（羅針盤と磁石） ---------- */
    {
      id: 'sk-ep-2023-1',
      title: 'The Needle That Points North',
      level: 'mid',
      topic: '科学史・技術',
      source: src('第1問'),
      paras: [
        [
          { en: R`Hand a child a compass, and the same thing almost always happens.`, ja: R`子どもに方位磁針を手渡すと、ほとんどいつも同じことが起こる。` },
          { en: R`The child turns it around and around, watching the needle swing back to the same direction every time.`, ja: R`子どもはそれをぐるぐると回し、針が毎回同じ方角に戻っていくのを見つめる。` },
          { en: R`There is no battery inside, and nothing seems to push the needle.`, ja: R`中に電池は入っていないし、針を押しているものは何もなさそうだ。` },
          { en: R`So what moves it?`, ja: R`では、何が針を動かしているのか。` },
          { en: R`This simple question went unanswered for more than a thousand years.`, ja: R`この単純な問いは、千年以上ものあいだ答えが出ないままだった。` }
        ],
        [
          { en: R`The story begins with a strange black stone.`, ja: R`話は、ある奇妙な黒い石から始まる。` },
          { en: R`Both the ancient Greeks and the ancient Chinese noticed that certain rocks could pull small pieces of iron toward them.`, ja: R`古代ギリシャ人も古代中国人も、ある種の岩石が小さな鉄片を引き寄せることに気づいていた。` },
          { en: R`The English word "magnet" comes {b1:from} Magnesia, an area of the ancient Greek world where such stones were found.`, ja: R`英語の magnet（磁石）という語は、そうした石が見つかった古代ギリシャ世界の一地方、マグネシアに由来する。` },
          { en: R`The rock itself is called a lodestone, an old English name meaning "the stone that leads the way."`, ja: R`その岩石自体は lodestone（天然磁石）と呼ばれるが、これは「道を導く石」を意味する古い英語の名前である。` }
        ],
        [
          { en: R`{b2:At} first, however, nobody thought of using the stone to find the way.`, ja: R`しかし最初は、道を知るためにその石を使おうと考える者はだれもいなかった。` },
          { en: R`About two thousand years ago, Chinese fortune-tellers carved lodestones into the shape of a spoon and placed them on a smooth bronze plate.`, ja: R`およそ2000年前、中国の占い師たちは天然磁石をさじの形に削り、なめらかな青銅の板の上に置いた。` },
          { en: R`The spoon would turn until its handle pointed south.`, ja: R`さじは回転し、柄が南を指したところで止まるのだった。` },
          { en: R`This early compass {b8:had nothing to do with travel}; people used it to tell fortunes and to choose lucky places for houses and graves.`, ja: R`この初期の羅針盤は旅とは何の関係もなく、人々はそれを、運勢を占ったり、家や墓のための縁起のよい場所を選んだりするのに使っていた。` }
        ],
        [
          { en: R`It took about a thousand years for the idea to reach the sea.`, ja: R`この考えが海に届くまでには、およそ千年かかった。` },
          { en: R`By the end of the twelfth century, sailors in both China and Europe had learned a useful trick.`, ja: R`12世紀の終わりまでには、中国とヨーロッパの両方の船乗りたちが、ある便利なこつを身につけていた。` },
          { en: R`If an iron needle is rubbed against a lodestone, the needle becomes a magnet too.`, ja: R`鉄の針を天然磁石にこすりつけると、その針も磁石になるのである。` },
          { en: R`When such a needle was pushed through a piece of straw and floated in a bowl of water, it always came to rest along a north-south line.`, ja: R`そのような針をわらに通して水を張った鉢に浮かべると、針はいつも南北の線に沿って止まった。` }
        ],
        [
          { en: R`Why did this matter so much?`, ja: R`なぜこれがそれほど重要だったのか。` },
          { en: R`Before the compass, sailors depended {b3:on} the sun and the stars to find their direction.`, ja: R`羅針盤が登場する以前、船乗りたちは方角を知るのに太陽と星に頼っていた。` },
          { en: R`In clear weather this worked well.`, ja: R`晴れた天気なら、これでうまくいった。` },
          { en: R`But when clouds covered the sky for days, a ship far from land could easily lose its way.`, ja: R`しかし雲が何日も空を覆うと、陸から遠く離れた船は簡単に進路を見失いかねなかった。` },
          { en: R`In the Mediterranean Sea, many captains simply kept their ships in port during the stormy, cloudy months of winter.`, ja: R`地中海では、多くの船長は、嵐と曇り空の続く冬の数か月のあいだ、船をただ港にとどめておいた。` }
        ],
        [
          { en: R`The floating needle changed all that.`, ja: R`水に浮かぶ針が、そのすべてを変えた。` },
          { en: R`It {b9:enabled sailors to find their way} even when neither the sun nor the stars could be seen.`, ja: R`それのおかげで、船乗りたちは太陽も星も見えないときでさえ進路を知ることができるようになった。` },
          { en: R`Ships could now cross open water in almost any season and return {b5:safely} to port.`, ja: R`いまや船は、ほとんどどの季節でも外洋を渡り、無事に港へ戻ることができた。` },
          { en: R`Trade between distant cities grew, and long voyages across the oceans became possible.`, ja: R`遠く離れた都市どうしの交易は拡大し、大洋を越える長い航海が可能になった。` }
        ],
        [
          { en: R`Yet nobody on board {b10:knew what made the needle move}.`, ja: R`それでも、船に乗っている者のだれひとりとして、何が針を動かしているのかを知らなかった。` },
          { en: R`Sailors trusted the compass with their lives, but they could not explain it.`, ja: R`船乗りたちは羅針盤に命を預けていたが、その仕組みを説明することはできなかった。` },
          { en: R`Naturally, people searched {b4:for} an explanation, and several ideas became popular.`, ja: R`当然、人々は説明を探し求め、いくつかの考えが広まった。` }
        ],
        [
          { en: R`Some scholars supported the idea {u11:that} the needle was attracted by the North Star, since it seemed to point toward that star.`, ja: R`針は北極星に引きつけられているのだという考えを支持する学者もいた。針がその星のほうを指しているように見えたからである。` },
          { en: R`Others imagined a huge mountain of lodestone somewhere in the far north, pulling every needle in the world toward it.`, ja: R`また、はるか北のどこかに天然磁石でできた巨大な山があり、それが世界中のあらゆる針を引き寄せているのだと想像する人々もいた。` },
          { en: R`Some beliefs of the time seem amusing today.`, ja: R`当時信じられていたことの中には、今日ではこっけいに思えるものもある。` },
          { en: R`It was {b6:widely} believed, for example, that garlic could destroy a magnet's power, so sailors who handled the compass were told not to eat it.`, ja: R`たとえば、ニンニクは磁石の力を失わせると広く信じられていたので、羅針盤を扱う船乗りはニンニクを食べないように言われていた。` }
        ],
        [
          { en: R`The man who finally tested such ideas with great care was William Gilbert, an English doctor.`, ja: R`こうした考えをついに入念に検証したのが、イングランドの医師ウィリアム・ギルバートだった。` },
          { en: R`Gilbert did not simply repeat what old books said.`, ja: R`ギルバートは、古い書物に書かれていることをただ繰り返したりはしなかった。` },
          { en: R`Instead, he spent many years doing experiments with magnets, and in 1600 he published his results.`, ja: R`その代わりに、彼は長い年月をかけて磁石の実験を行い、1600年にその成果を出版した。` },
          { en: R`He showed, for example, that garlic had no effect at all: a magnet rubbed with garlic attracted iron just as strongly as before.`, ja: R`たとえば彼は、ニンニクにはまったく効果がないことを示した。ニンニクをこすりつけた磁石は、以前とまったく同じ強さで鉄を引きつけたのである。` }
        ],
        [
          { en: R`His most famous experiment used a lodestone cut into the shape of a ball.`, ja: R`彼の最も有名な実験では、球の形に削った天然磁石が使われた。` },
          { en: R`Gilbert called it his "little Earth."`, ja: R`ギルバートはそれを自分の「小さな地球」と呼んだ。` },
          { en: R`He moved a tiny compass needle over the surface of the ball and watched carefully.`, ja: R`彼は小さな磁針を球の表面に沿って動かし、注意深く観察した。` },
          { en: R`At every point, the needle behaved just as real compasses behaved in different parts of the world.`, ja: R`どの地点でも、針は、世界各地で本物の羅針盤が示すのとまったく同じふるまいをした。` }
        ],
        [
          { en: R`From this, Gilbert reached a bold conclusion.`, ja: R`このことから、ギルバートは大胆な結論に達した。` },
          { en: R`The needle is not pulled by a star or by a mountain.`, ja: R`針は星に引かれているのでも、山に引かれているのでもない。` },
          { en: R`The Earth itself is a giant magnet, and every compass needle simply lines up with it.`, ja: R`地球そのものが巨大な磁石であり、あらゆる羅針盤の針はただそれに沿って向きをそろえているのだ。` },
          { en: R`The force that had guided ships for centuries came from beneath the sailors' feet.`, ja: R`何世紀にもわたって船を導いてきた力は、船乗りたちの足の下から来ていたのである。` }
        ],
        [
          { en: R`Gilbert could not say why the Earth is a magnet, and scientists needed more than three hundred years to find out.`, ja: R`ギルバートには地球がなぜ磁石なのかは説明できず、科学者たちがそれを突き止めるには300年以上が必要だった。` },
          { en: R`Today we know that the outer part of the Earth's core is made of hot liquid iron.`, ja: R`今日では、地球の核の外側の部分が高温の液体の鉄でできていることがわかっている。` },
          { en: R`As this metal moves, it produces electric currents, and these currents create a magnetic field around the whole planet.`, ja: R`この金属が動くと電流が生じ、その電流が地球全体のまわりに磁場をつくり出す。` }
        ],
        [
          { en: R`We have also learned that a compass does not point {b7:exactly} to the North Pole.`, ja: R`また、羅針盤は正確に北極点を指しているわけではないこともわかっている。` },
          { en: R`It points toward the magnetic north pole, a place that lies hundreds of kilometers away from the "true" North Pole on the map.`, ja: R`羅針盤が指すのは北磁極であり、そこは地図上の「真の」北極点から数百キロメートル離れた場所にある。` },
          { en: R`Moreover, this place does not stay still.`, ja: R`しかも、この場所はじっとしていない。` },
          { en: R`Because the liquid iron keeps moving, the magnetic pole moves as well, by tens of kilometers every year.`, ja: R`液体の鉄が動き続けているので、磁極もまた毎年数十キロメートルずつ移動している。` }
        ],
        [
          { en: R`Today most ships and airplanes find their position with the help of satellites.`, ja: R`今日では、ほとんどの船や飛行機は人工衛星の助けを借りて自分の位置を知る。` },
          { en: R`Even so, they still carry a magnetic compass, because it needs no electricity and almost never breaks down.`, ja: R`それでもなお、船や飛行機は今も磁気コンパスを積んでいる。電気を必要とせず、ほとんど故障しないからである。` }
        ],
        [
          { en: R`The history of the compass teaches an interesting lesson.`, ja: R`羅針盤の歴史は、興味深い教訓を与えてくれる。` },
          { en: R`We often assume that science comes first and useful tools follow.`, ja: R`私たちは、科学が先にあって、役に立つ道具はその後から生まれるものだと思い込みがちだ。` },
          { en: R`In this case, the order was reversed: people used the tool for centuries before anyone understood it.`, ja: R`この場合、順序は逆だった。だれかがその仕組みを理解する何世紀も前から、人々はこの道具を使っていたのである。` },
          { en: R`Sometimes we learn to use nature long before we learn to explain it.`, ja: R`私たちは、自然を説明できるようになるよりずっと前に、自然を利用できるようになることがあるのだ。` }
        ]
      ],
      vocab: ['compass', 'needle', 'magnet', 'lodestone', 'carve', 'rub', 'float', 'depend', 'enable', 'voyage',
        'explanation', 'attract', 'experiment', 'publish', 'surface', 'conclusion', 'core', 'current', 'satellite', 'assume'],
      vocabExtra: [
        ['compass', '名', '羅針盤; 方位磁針', 2],
        ['needle', '名', '針', 2],
        ['magnet', '名', '磁石', 2],
        ['lodestone', '名', '天然磁石', 3],
        ['carve', '動', '〜を彫る; 〜を削って作る', 2],
        ['rub', '動', '〜をこする', 2],
        ['float', '動', '浮かぶ; 〜を浮かべる', 2],
        ['depend', '動', '頼る; 〜次第である', 1],
        ['enable', '動', '〜を可能にする', 2],
        ['voyage', '名', '航海', 2],
        ['explanation', '名', '説明', 1],
        ['attract', '動', '〜を引きつける', 2],
        ['experiment', '名', '実験', 1],
        ['publish', '動', '〜を出版する; 〜を発表する', 2],
        ['surface', '名', '表面', 2],
        ['conclusion', '名', '結論', 2],
        ['core', '名', '核; 中心部', 2],
        ['current', '名', '電流; 流れ', 2],
        ['satellite', '名', '人工衛星; 衛星', 2],
        ['assume', '動', '〜だと思い込む; 〜と仮定する', 2],
        ['magnetic', '形', '磁気の; 磁石の', 2],
        ['garlic', '名', 'ニンニク', 2],
        ['bronze', '名', '青銅', 2],
        ['straw', '名', 'わら; ストロー', 2],
        ['grave', '名', '墓', 2],
        ['port', '名', '港', 2],
        ['pole', '名', '極; 棒', 2]
      ]
    },

    /* ---------- 第2問: 科学解説（熱と温度） ---------- */
    {
      id: 'sk-ep-2023-2',
      title: 'Why Sparks Do Not Burn: Heat and Temperature',
      level: 'mid',
      topic: '科学・物理',
      source: src('第2問'),
      paras: [
        [
          { en: R`On a summer night, children wave sparklers in the dark.`, ja: R`夏の夜、子どもたちは暗がりの中で手持ち花火を振り回す。` },
          { en: R`The sparks that fly from a sparkler are hotter than 1,000 degrees Celsius, yet when one lands on your hand, you hardly notice it.`, ja: R`手持ち花火から飛び散る火花はセ氏1000度よりも高温だが、それでも、その一つが手に落ちてもほとんど気づかない。` },
          { en: R`A cup of tea, by contrast, is only about 80 degrees, but if you spill it on your hand, it really hurts.`, ja: R`それに対して、カップ1杯の紅茶は80度ほどにすぎないが、手にこぼすと本当に痛い。` },
          { en: R`How can something so hot be harmless, and something much cooler be dangerous?`, ja: R`それほど熱いものが無害で、それよりずっと温度の低いものが危険だというのは、いったいどういうことなのか。` }
        ],
        [
          { en: R`The answer lies in a pair of ideas that sound alike but are not the same: "heat" and "temperature."`, ja: R`その答えは、似た響きをもちながら同じではない一対の考え方、すなわち「熱」と「温度」にある。` },
          { en: R`Each has its own meaning and its own unit.`, ja: R`それぞれに固有の意味があり、固有の単位がある。` },
          { en: R`Let us look at each of them in turn.`, ja: R`それぞれを順番に見ていこう。` }
        ],
        [
          { en: R`Everything around us is made of tiny particles, and these particles are always {b1:in} motion.`, ja: R`私たちの身の回りのものはすべて微小な粒子でできており、その粒子は常に運動している。` },
          { en: R`In a hot object they move rapidly; in a cold one they move slowly.`, ja: R`熱い物体の中では粒子は速く動き、冷たい物体の中ではゆっくり動く。` },
          { en: R`Temperature is a measure of how much energy of motion the particles have {b2:on} average.`, ja: R`温度とは、粒子が平均してどれだけの運動エネルギーを持っているかを表す尺度である。` },
          { en: R`We usually measure it in degrees Celsius.`, ja: R`私たちはふつう、それをセ氏の度数で測る。` }
        ],
        [
          { en: R`Temperature tells us nothing about the size of an object.`, ja: R`温度は、物体の大きさについては何も教えてくれない。` },
          { en: R`If you fill a cup from a warm bath, the water in the cup and the water in the bath have exactly the same temperature.`, ja: R`温かい風呂からカップに湯をくめば、カップの中の湯と風呂の中の湯の温度はまったく同じである。` },
          { en: R`Temperature does not depend on {b10:how much water there is}.`, ja: R`温度は、水がどれだけあるかには左右されない。` }
        ],
        [
          { en: R`Heat is different.`, ja: R`熱は違う。` },
          { en: R`It is energy that moves from a hotter object to a colder one.`, ja: R`熱とは、より熱い物体からより冷たい物体へと移動するエネルギーのことである。` },
          { en: R`Because heat is a form of energy, it is measured in joules.`, ja: R`熱はエネルギーの一形態なので、ジュールという単位で測られる。` },
          { en: R`The amount of heat that an object gains or loses depends on three things: its mass, the kind of material it is made of, and how much its temperature changes.`, ja: R`物体が得たり失ったりする熱の量は、三つのもので決まる。すなわち、物体の質量、それを構成している物質の種類、そして温度がどれだけ変化するかである。` }
        ],
        [
          { en: R`Some simple numbers make this clear.`, ja: R`簡単な数字を見れば、このことがはっきりする。` },
          { en: R`You need about 4.2 joules to raise the temperature of 1 gram of water {b3:by} 1 degree.`, ja: R`1グラムの水の温度を1度上げるには、約4.2ジュールが必要である。` },
          { en: R`To heat 200 grams of water for a cup of tea from 20 degrees to 80 degrees, you therefore need about {b8:50,400} joules.`, ja: R`したがって、紅茶1杯分にあたる200グラムの水を20度から80度まで温めるには、約50,400ジュールが必要になる。` },
          { en: R`To warm 200 kilograms of bath water from 20 degrees to 40 degrees, you need about {b9:16,800,000} joules.`, ja: R`200キログラムの風呂の水を20度から40度まで温めるには、約16,800,000ジュールが必要である。` },
          { en: R`The bath never becomes as hot as the tea, yet the heat it takes in is more than 300 times greater.`, ja: R`風呂が紅茶ほど熱くなることは決してないが、それでも風呂が取り込む熱は300倍以上も大きい。` }
        ],
        [
          { en: R`Now we can explain the sparkler.`, ja: R`これで手持ち花火のことが説明できる。` },
          { en: R`A spark has a very high temperature, but its mass is far less than one milligram, so it carries only a tiny quantity of heat.`, ja: R`火花は温度こそ非常に高いが、質量は1ミリグラムよりはるかに小さいので、ごくわずかな量の熱しか運ばない。` },
          { en: R`When it comes {b4:into} contact with your skin, it gives up that heat at once and cools before any damage is done.`, ja: R`火花は皮膚に触れると、その熱をすぐに手放し、害が生じる前に冷えてしまう。` },
          { en: R`The tea is much cooler, but even a few drops of it have thousands of times more mass than a spark, and they keep pouring heat into your skin.`, ja: R`紅茶のほうがずっと温度は低いが、わずか数滴でも火花の何千倍もの質量があり、皮膚に熱を注ぎ込み続ける。` }
        ],
        [
          { en: R`The kind of material matters, too.`, ja: R`物質の種類も重要である。` },
          { en: R`Different materials require different amounts of energy to become one degree warmer.`, ja: R`物質が違えば、温度が1度上がるのに必要なエネルギーの量も違う。` },
          { en: R`Water is an unusual substance: it needs about five times {b5:as} much energy as the same mass of dry sand.`, ja: R`水は珍しい物質で、同じ質量の乾いた砂の約5倍のエネルギーを必要とする。` },
          { en: R`That is why, on a sunny beach, the temperature of the sand rises much higher than {u7:that} of the sea, although both receive the same sunlight.`, ja: R`だからこそ、晴れた日の浜辺では、砂も海も同じ日光を受けているのに、砂の温度は海の温度よりもずっと高くなるのである。` },
          { en: R`At night the sand cools quickly, while the sea stays warm.`, ja: R`夜になると砂はすぐに冷えるが、海は温かいままである。` }
        ],
        [
          { en: R`Heat also has a direction.`, ja: R`熱には向きもある。` },
          { en: R`It always flows from the hotter object to the colder one, and it goes on flowing until both are {b6:at} the same temperature.`, ja: R`熱は必ず熱いほうの物体から冷たいほうの物体へと流れ、両者が同じ温度になるまで流れ続ける。` },
          { en: R`When you put ice in a drink, "cold" does not move into the drink.`, ja: R`飲み物に氷を入れたとき、「冷たさ」が飲み物の中へ移動するわけではない。` },
          { en: R`Instead, heat leaves the drink and enters the ice.`, ja: R`そうではなく、熱が飲み物から出ていき、氷の中へ入るのである。` }
        ],
        [
          { en: R`This explains one more everyday puzzle.`, ja: R`これで、日常のもう一つの謎も説明がつく。` },
          { en: R`On a cold morning, a metal bench feels much colder than a wooden one, even though the two have the same temperature.`, ja: R`寒い朝、金属のベンチは木のベンチよりずっと冷たく感じられるが、実は両者の温度は同じである。` },
          { en: R`Metal simply carries heat away from your body more quickly than wood does.`, ja: R`金属は木よりも速く体から熱を奪っていく、というだけのことなのだ。` },
          { en: R`Our skin, it turns out, is a poor thermometer: what it senses is the loss of heat, not temperature itself.`, ja: R`私たちの皮膚は、実は出来の悪い温度計である。皮膚が感じ取っているのは熱が失われることであって、温度そのものではないのだ。` }
        ],
        [
          { en: R`Temperature tells us how hot something is; heat tells us how much energy has moved.`, ja: R`温度は物がどれくらい熱いかを教え、熱はどれだけのエネルギーが移動したかを教えてくれる。` },
          { en: R`Once you keep the two ideas apart, sparks, beaches and benches are no longer a mystery.`, ja: R`この二つの考え方をきちんと区別すれば、火花も浜辺もベンチも、もはや謎ではなくなる。` }
        ]
      ],
      vocab: ['sparkler', 'spark', 'temperature', 'degree', 'spill', 'harmless', 'particle', 'motion', 'average', 'measure',
        'mass', 'material', 'substance', 'quantity', 'require', 'contact', 'rapidly', 'flow', 'thermometer', 'sense'],
      vocabExtra: [
        ['sparkler', '名', '手持ち花火', 3],
        ['spark', '名', '火花', 2],
        ['temperature', '名', '温度; 気温', 1],
        ['degree', '名', '度; 程度', 1],
        ['spill', '動', '〜をこぼす', 2],
        ['harmless', '形', '無害な', 2],
        ['particle', '名', '粒子', 2],
        ['motion', '名', '運動; 動き', 2],
        ['average', '名', '平均', 1],
        ['measure', '名', '尺度; 基準', 2],
        ['measure', '動', '〜を測る', 1],
        ['mass', '名', '質量; かたまり', 2],
        ['material', '名', '物質; 材料', 1],
        ['substance', '名', '物質', 2],
        ['quantity', '名', '量', 2],
        ['require', '動', '〜を必要とする', 2],
        ['contact', '名', '接触; 連絡', 2],
        ['rapidly', '副', '急速に; 速く', 2],
        ['flow', '動', '流れる', 2],
        ['thermometer', '名', '温度計', 2],
        ['sense', '動', '〜を感じ取る', 2],
        ['joule', '名', 'ジュール（エネルギーの単位）', 3],
        ['celsius', '名', 'セ氏（温度の目盛り）', 2],
        ['milligram', '名', 'ミリグラム', 2],
        ['wooden', '形', '木製の', 1]
      ]
    },

    /* ---------- 第3問: 経営・運営の読み物（山あいのバス会社の立て直し・架空の事例） ---------- */
    {
      id: 'sk-ep-2023-3',
      title: 'Counting the Empty Seats',
      level: 'mid',
      topic: 'ビジネス・経営',
      source: src('第3問'),
      paras: [
        [
          { en: R`In 2018, Hanamizuki Bus, a small company in a mountain town, was losing money every year.`, ja: R`2018年、山あいの町にある小さな会社、ハナミズキバスは、毎年赤字を出していた。` },
          { en: R`Fewer people were riding its buses, and the president asked a young office worker, Rina Hayashi, to find a way to save the routes.`, ja: R`バスに乗る人は減る一方で、社長は、若い事務職員のハヤシ・リナに、路線を守る方法を見つけるよう頼んだ。` }
        ],
        [
          { en: R`For thirty years, the company had sent a bus from the station every hour, from six in the morning until nine at night, whether or not anyone wanted to ride.`, ja: R`30年間、会社は、乗りたい人がいてもいなくても、朝6時から夜9時まで毎時間、駅からバスを1台出してきた。` },
          { en: R`At noon, most buses carried only two or three passengers, but the morning buses were often full.`, ja: R`昼には、ほとんどのバスが2、3人しか乗客を乗せていなかったが、朝のバスはしばしば満員だった。` },
          { en: R`Nobody knew exactly how many people used each bus, because nobody had ever counted.`, ja: R`どのバスを何人が利用しているのかを正確に知る人はだれもいなかった。これまでだれも数えたことがなかったからである。` }
        ],
        [
          { en: R`Rina began by counting.`, ja: R`リナはまず、数えることから始めた。` },
          { en: R`She gave the drivers small hand counters and asked them to press one each time a passenger got on.`, ja: R`彼女は運転手たちに小さな手持ちの数取り器を渡し、乗客が乗るたびにそれを押してほしいと頼んだ。` },
          { en: R`The drivers also wrote down the stop and the time.`, ja: R`運転手たちはさらに、停留所と時刻も書き留めた。` }
        ],
        [
          { en: R`After a month, Rina had thousands of numbers instead of guesses, and they told a clear story.`, ja: R`1か月後、リナの手元には推測ではなく何千もの数字がそろい、それらははっきりした事実を物語っていた。` },
          { en: R`Nearly half of the passengers rode early in the morning or in the afternoon, when school ended.`, ja: R`乗客のほぼ半数は、早朝か、学校が終わる午後に乗っていた。` },
          { en: R`So Rina moved several buses from midday to those hours, and the noon buses began to run only every two hours.`, ja: R`そこでリナは、数台のバスを日中からそれらの時間帯へ移し、昼のバスは2時間おきにしか走らないようにした。` },
          { en: R`Within weeks, the morning buses were no longer crowded.`, ja: R`数週間のうちに、朝のバスは混み合わなくなった。` }
        ],
        [
          { en: R`The numbers also revealed that a route to two small villages in the hills often carried no passengers at all.`, ja: R`数字はまた、丘の上の二つの小さな村へ向かう路線が、乗客を1人も乗せないことがしばしばあることも明らかにした。` },
          { en: R`Rina replaced it with a small van that had no fixed timetable.`, ja: R`リナはその路線を、決まった時刻表のない小型のバンに置き換えた。` },
          { en: R`Villagers phoned the company the day before, and the van picked them up at their front doors.`, ja: R`村人たちは前日に会社へ電話をかけ、バンは彼らを玄関先まで迎えに行った。` }
        ],
        [
          { en: R`A year later, the number of passengers had risen by a quarter, and the yearly loss had been cut in half.`, ja: R`1年後、乗客数は4分の1増え、年間の赤字は半分に減っていた。` },
          { en: R`No route had to be closed.`, ja: R`廃止せざるをえない路線は1本もなかった。` },
          { en: R`{u1:The buses were the same old buses; the company had only learned to send them to the people who needed them.}`, ja: R`バスは昔と同じバスだった。会社はただ、バスを必要としている人のもとへ送り出すすべを身につけただけだった。` }
        ]
      ],
      vocab: ['passenger', 'route', 'timetable', 'president', 'crowded', 'reveal', 'replace', 'quarter', 'yearly', 'loss',
        'guess', 'villager', 'van', 'fixed', 'midday'],
      vocabExtra: [
        ['villager', '名', '村人', 2],
        ['van', '名', '小型のバン; ワゴン車', 2],
        ['fixed', '形', '決まった; 固定された', 2],
        ['midday', '名', '日中; 正午', 3]
      ]
    }
  ]);

  /* ================================================================
   *  問題カード（大問ごとに 1 枚）
   * ================================================================ */
  const PREP_I = ['at', 'for', 'from', 'on'];
  const ADV_I = ['exactly', 'safely', 'widely'];
  const SUMMARY_I = R`Gilbert concluded that the compass needle is pulled not by a ( ア ) in the sky but by the ( イ ) itself.`;

  JK.registerProblems([
    /* ---------- 第1問 ---------- */
    {
      id: 'sk-e-2023-1',
      subject: 'english',
      level: 'mid',
      unit: 'e-reading',
      title: '長文：羅針盤と磁石の科学史',
      source: src('第1問'),
      time: 25,
      body: R`次の英文は、羅針盤と磁石の歴史を述べた読み物です。英文を読んで、問1〜問6 と、記述式の問に答えなさい。段落は上から順に第1段落〜第15段落と数えます。空所は ( 1 )〜( 10 )、下線部は (11) です。

注　lodestone = 天然磁石　fortune-teller = 占い師　bronze = 青銅　straw = わら　the Mediterranean Sea = 地中海　the North Star = 北極星　garlic = ニンニク　core = （地球の）核　magnetic field = 磁場`,
      fig: null,
      passage: 'sk-ep-2023-1',
      parts: [
        {
          label: '問1(1)',
          q: R`空所 ( 1 )（第2段落）に入る最も適切な前置詞を選びなさい。空所 ( 1 )〜( 4 ) には、4 つの選択肢を 1 回ずつ使います（空所が文頭にある場合も、語は小文字で書いてあります）。`,
          type: 'choice', choices: PREP_I, answer: 2,
          explain: R`**come from 〜** で「〜に由来する」です。magnet という語がマグネシアという地名から来た、という語源の説明になります。at / for / on では come と結びついて「由来」を表すことができません。`
        },
        {
          label: '問1(2)',
          q: R`空所 ( 2 )（第3段落の最初の文の文頭）に入る最も適切な前置詞を選びなさい。`,
          type: 'choice', choices: PREP_I, answer: 0,
          explain: R`**at first** で「最初は」です。直後の however と、「千年ほどたってから航海に使われるようになった」という第4段落への流れから、「最初は、道を知るために石を使おうと考える人はいなかった」と読めます。first だけを後ろに置いて「最初は」の意味になるのは at だけで、for first / from first / on first とは言いません。`
        },
        {
          label: '問1(3)',
          q: R`空所 ( 3 )（第5段落）に入る最も適切な前置詞を選びなさい。`,
          type: 'choice', choices: PREP_I, answer: 3,
          explain: R`**depend on 〜** で「〜に頼る」です。羅針盤が登場する前の船乗りは、方角を知るのに太陽と星を頼りにしていた、という内容です。depend は on（または upon）と結びつく動詞で、at / for / from を続けることはできません。`
        },
        {
          label: '問1(4)',
          q: R`空所 ( 4 )（第7段落）に入る最も適切な前置詞を選びなさい。`,
          type: 'choice', choices: PREP_I, answer: 1,
          explain: R`**search for 〜** で「〜を探し求める」です。船乗りは羅針盤の仕組みを説明できなかったので、人々が「説明を探し求めた」という流れになります。at / from / on では「説明を探す」という意味になりません。`
        },
        {
          label: '問2(5)',
          q: R`空所 ( 5 )（第6段落）に入る最も適切な副詞を選びなさい。問2 の空所 ( 5 )〜( 7 ) では、同じ語は一度しか使いません。`,
          type: 'choice', choices: ADV_I, answer: 1,
          explain: R`return **safely** to port で「無事に港へ戻る」です。羅針盤のおかげで、太陽や星が見えなくても進路を見失わなくなった、という文脈に合うのは safely だけです。exactly（正確に）や widely（広く）は return to port を修飾しても意味が通りません。`
        },
        {
          label: '問2(6)',
          q: R`空所 ( 6 )（第8段落）に入る最も適切な副詞を選びなさい。`,
          type: 'choice', choices: ADV_I, answer: 2,
          explain: R`It was **widely** believed that 〜 で「〜と広く信じられていた」という決まった言い方です。believed を自然に修飾できるのは widely だけで、exactly believed や safely believed とは言いません。`
        },
        {
          label: '問2(7)',
          q: R`空所 ( 7 )（第13段落）に入る最も適切な副詞を選びなさい。`,
          type: 'choice', choices: ADV_I, answer: 0,
          explain: R`not ... **exactly** で「正確に〜というわけではない」という部分否定になります。直後の文で「北磁極は地図上の北極点から数百キロメートル離れている」と説明されているので、「羅針盤は正確に北極点を指しているわけではない」という内容です。safely や widely では point to the North Pole を修飾しても意味が通りません。`
        },
        {
          label: '問3(8)',
          q: R`空所 ( 8 )（第3段落）に入るように、次の語を並べかえて英文を完成させなさい。`,
          type: 'order',
          words: ['do', 'travel', 'had', 'with', 'nothing', 'to'],
          answer: 'had nothing to do with travel',
          explain: R`**have nothing to do with 〜** で「〜とは何の関係もない」です。主語 This early compass の直後なので動詞 had から始め、had nothing to do with travel（旅とは何の関係もなかった）とします。セミコロンの後ろの「運勢を占ったり、家や墓の場所を選んだりするのに使った」という説明が、「旅とは無関係だった」ことの具体的な内容になっています。`
        },
        {
          label: '問3(9)',
          q: R`空所 ( 9 )（第6段落）に入るように、次の語を並べかえて英文を完成させなさい。`,
          type: 'order',
          words: ['find', 'sailors', 'way', 'enabled', 'their', 'to'],
          answer: 'enabled sailors to find their way',
          explain: R`**enable O to do** で「O が〜できるようにする」です。主語 It（＝水に浮かぶ針）の後に、動詞 enabled、目的語 sailors、不定詞 to find their way の順に並べます。find one's way は「進むべき道がわかる」という決まった言い方です。後ろの even when 〜（太陽も星も見えないときでさえ）につながります。`
        },
        {
          label: '問3(10)',
          q: R`空所 ( 10 )（第7段落）に入るように、次の語を並べかえて英文を完成させなさい。`,
          type: 'order',
          words: ['made', 'move', 'knew', 'the', 'what', 'needle'],
          answer: 'knew what made the needle move',
          explain: R`主語 nobody on board の直後なので動詞 knew を置き、その目的語として間接疑問 what made the needle move（何が針を動かしているのか）を続けます。**make O do**（O に〜させる）という使役の形で、疑問詞 what が made の主語になっています。第1段落の So what moves it? という問いを受けた文です。`
        },
        {
          label: '問4',
          q: R`下線部 (11) の that（第8段落）と同じ用法の that を含む文を 1 つ選びなさい。`,
          type: 'choice',
          choices: [
            R`This is the house that my grandfather built.`,
            R`She was so tired that she fell asleep at once.`,
            R`It was in Kyoto that we first met.`,
            R`The news that he had won the prize surprised everyone.`,
            R`I did not know the problem was that serious.`
          ],
          answer: 3,
          explain: R`下線部は the idea **that** the needle was attracted by the North Star（針は北極星に引きつけられているという考え）で、直前の名詞 idea の内容を説明する**同格の that**（接続詞。後ろは欠けた要素のない完全な文）です。同じ用法は The news that he had won the prize（彼が受賞したという知らせ）です。the house that 〜 は関係代名詞（built の目的語が欠けている）、so tired that 〜 は so ... that 構文、It was in Kyoto that 〜 は強調構文、that serious の that は「それほど」という意味の副詞です。`
        },
        {
          label: '問5A',
          q: R`本文の内容と一致するように、次の英文の空所に入る最も適切な語を選びなさい。

The earliest Chinese compasses were tools for (    ) rather than for travel.`,
          type: 'choice',
          choices: ['fortune-telling', 'fishing', 'farming', 'cooking'],
          answer: 0,
          explain: R`第3段落に、さじの形をした初期の羅針盤は「旅とは何の関係もなく」、「運勢を占ったり、家や墓の縁起のよい場所を選んだりするのに使った」とあります。したがって fortune-telling（占い）が正解です。さじ（spoon）の形をしていても、料理（cooking）に使ったわけではありません。`
        },
        {
          label: '問5B',
          q: R`本文の内容と一致するように、次の英文の空所に入る最も適切な語を選びなさい。

Before the compass, a ship far from land could easily lose its way when the sky was (    ).`,
          type: 'choice',
          choices: ['clear', 'bright', 'empty', 'cloudy'],
          answer: 3,
          explain: R`第5段落に「晴れた天気ならうまくいったが、雲が何日も空を覆うと、陸から遠い船は進路を見失いかねなかった」とあります。太陽や星が見えなくなるのは cloudy（曇った）ときです。clear（晴れた）は反対に「うまくいった」ほうの条件です。`
        },
        {
          label: '問5C',
          q: R`本文の内容と一致するように、次の英文の空所に入る最も適切な語（句）を選びなさい。

Gilbert concluded that compass needles point north because the (    ) itself is a huge magnet.`,
          type: 'choice',
          choices: ['Sun', 'North Star', 'Earth', 'Moon'],
          answer: 2,
          explain: R`第11段落に The Earth itself is a giant magnet（地球そのものが巨大な磁石である）とあります。北極星（North Star）が針を引いているというのは、ギルバートより前の学者たちの考え（第8段落）で、ギルバートはこれを否定しました。`
        },
        {
          label: '問5D',
          q: R`本文の内容と一致するように、次の英文の空所に入る最も適切な語を選びなさい。

The Earth's magnetic field is produced by moving liquid (    ) deep inside the planet.`,
          type: 'choice',
          choices: ['water', 'iron', 'rock', 'gas'],
          answer: 1,
          explain: R`第12段落に「地球の核の外側の部分は高温の液体の鉄でできており、この金属が動くと電流が生じ、その電流が磁場をつくる」とあります。したがって iron（鉄）が正解です。`
        },
        {
          label: '問6',
          q: R`本文の内容と一致するものを、次の中から 2 つ選びなさい。`,
          type: 'multi',
          choices: [
            R`The ancient Chinese began to use the compass for sea travel about two thousand years ago.`,
            R`Before the compass, sailors could not find their direction even in clear weather.`,
            R`The compass made it possible to sail in seasons when ships had earlier stayed in port.`,
            R`Sailors who handled the compass were encouraged to eat garlic.`,
            R`Gilbert proved that a huge mountain of lodestone in the far north attracts every compass needle.`,
            R`Gilbert explained that the Earth is a magnet because its core contains liquid iron.`,
            R`The magnetic north pole is in a different place from the North Pole shown on maps, and it keeps moving.`
          ],
          answer: [2, 6],
          explain: R`正解の 1 つ目は「羅針盤のおかげで、以前は船が港にとどまっていた季節にも航海できるようになった」です。第5段落の終わりに「冬のあいだは船を港にとどめておいた」、第6段落に「ほとんどどの季節でも外洋を渡れるようになった」とあります。2 つ目は「北磁極は地図上の北極点とは別の場所にあり、動き続けている」で、第13段落の内容です。
ほかの選択肢は次の点が誤りです。「約 2000 年前に中国で航海に使い始めた」→ 当時は占いの道具で、航海に使われるのは約千年後です（第3・4段落）。「晴れていても方角がわからなかった」→ 晴天ならうまくいきました（第5段落）。「ニンニクを食べるよう勧められた」→ 食べないように言われました（第8段落）。「ギルバートが北の磁石の山を証明した」→ 星でも山でもないと結論しました（第11段落）。「ギルバートが液体の鉄から理由を説明した」→ 彼には理由は説明できず、解明には 300 年以上かかりました（第12段落）。`
        },
        {
          label: '記述ア',
          q: R`本文の内容と一致する英文になるように、空所 ( ア ) に入る最も適切な英語 1 語を本文中から抜き出して答えなさい。

${SUMMARY_I}`,
          type: 'text', answer: 'star', hint: '半角英字で 1 語',
          explain: R`第11段落の The needle is not pulled by a star or by a mountain. が根拠です。in the sky（空にある）に合うのは star（星）で、mountain（山）は空にはありません。第8段落の「針は北極星に引きつけられている」という古い説を否定した内容です。`
        },
        {
          label: '記述イ',
          q: R`同じ英文の空所 ( イ ) に入る最も適切な英語 1 語を本文中から抜き出して答えなさい。

${SUMMARY_I}`,
          type: 'text', answer: ['Earth', 'planet'], hint: '半角英字で 1 語',
          explain: R`第11段落の The Earth itself is a giant magnet が根拠です。**not A but B**（A ではなく B）の形で、「空の星にではなく、地球そのものに引かれている」とまとめます。the planet itself と書いても同じ内容になります。`
        }
      ],
      solution: [
        {
          t: '全体の流れをつかむ',
          n: R`段落ごとの要旨は次のとおりです。
第1〜2段落: 導入（何が針を動かすのか／鉄を引きつける石の発見と語源）。
第3〜4段落: 中国の占いの道具から、12 世紀末の航海用の針へ。
第5〜6段落: 羅針盤以前（太陽と星が頼り、冬は港で待機）と以後（季節を問わず航海でき、交易が拡大）。
第7〜8段落: 仕組みがわからないまま広まった説（北極星、磁石の山、ニンニク）。
第9〜11段落: ギルバートの実験と「地球そのものが巨大な磁石」という結論。
第12〜13段落: 現代の理解（液体の鉄の運動、北磁極のずれと移動）。
第14〜15段落: 今も使われる理由と教訓（道具が科学より先に来ることがある）。`,
          easy: R`「疑問（何が針を動かすのか）→ 昔の人の使い方 → まちがった説明 → 実験による正しい説明 → 現代の知識 → 教訓」という順に、時代を追って進む文章です。各段落の最初の文だけを拾い読みすると、この流れが先につかめます。`,
          pro: R`本番の第1問は約 1,250 語で、この類題（855 語）より 4〜5 割長くなります。短い段落が 20 ほど続く形式なので、段落番号の横に 3〜4 字のメモを書きながら読むと、内容一致で戻る場所をすぐに見つけられます。`
        },
        {
          t: '問1 前置詞は結びつく語で決める',
          n: R`空所の前後の語とのセットで考えます。come **from**（〜に由来する）、**at** first（最初は）、depend **on**（〜に頼る）、search **for**（〜を探し求める）。4 つとも熟語の知識で決まります。`,
          pro: R`「同じ選択肢を 1 回ずつ使う」形式では、確実なものから埋めて、残りを消去法で確認すると速く正確に解けます。`
        },
        {
          t: '問2 副詞は修飾する相手との相性で決める',
          n: R`return **safely**（無事に戻る）、**widely** believed（広く信じられた）、not point **exactly** to 〜（正確に〜を指すわけではない）。それぞれがどの語を修飾するかを確認すると、意味が通る組合せは 1 つしかありません。`
        },
        {
          t: '問3 整序は核になる構文を見つける',
          n: R`( 8 ) have nothing to do with 〜（〜と無関係である）、( 9 ) enable O to do（O が〜できるようにする）、( 10 ) know + 間接疑問 what made O do（何が O に〜させたのか）。まず主語の直後に来る動詞を決め、残りの語を構文の型に当てはめます。`,
          easy: R`整序問題は、単語を 1 つずつ並べるのではなく、「かたまり」を先に作るのがこつです。たとえば ( 9 ) なら to find、their way というかたまりを作ってから、enabled sailors の後ろにつなげます。`
        },
        {
          t: '問4 that の識別',
          n: R`that の後ろが完全な文で、直前の名詞（idea, news, fact, belief など）の内容を表していれば同格の that です。後ろの文で名詞が欠けていれば関係代名詞、so や such と組になっていれば so ... that 構文、It is と that にはさまれた語句を強調していれば強調構文です。`
        },
        {
          t: '問5・問6 内容一致は段落に戻って照合する',
          n: R`選択肢のキーワード（fortune, cloudy, Gilbert, garlic, magnetic pole など）を本文で探し、その段落の記述と 1 つずつ照らし合わせます。誤りの選択肢には、「時代のずれ」（2000 年前は占い、航海は 12 世紀末）、「肯定と否定の入れ替え」（食べるな → 食べるよう勧めた）、「人物と業績の入れ替え」（ギルバートは理由までは説明できなかった）といった型があります。`
        },
        {
          t: '記述 本文の語を使って言い換える',
          n: R`第11段落の「星でも山でもなく、地球そのものが磁石である」を、not by a star in the sky but by the Earth itself と言い換えた文です。本文の語をそのまま使えば答えられるので、根拠になる段落をすばやく見つけ、つづりを正確に書き写すことが大切です。`
        }
      ],
      tags: ['空所補充', '語句整序', 'that の識別', '内容一致', '科学史']
    },

    /* ---------- 第2問 ---------- */
    {
      id: 'sk-e-2023-2',
      subject: 'english',
      level: 'mid',
      unit: 'e-reading',
      title: '長文：熱と温度のちがい',
      source: src('第2問'),
      time: 18,
      body: R`次の英文は、熱（heat）と温度（temperature）がどう違うのかを、身近な例を使って説明したものです。英文を読んで、問1〜問4 と、記述式の問に答えなさい。段落は上から順に第1段落〜第11段落と数えます。空所は ( 1 )〜( 6 ) と ( 8 )〜( 10 )、下線部は (7) です。

注　sparkler = 手持ち花火　spark = 火花　degrees Celsius = セ氏〜度　particle = 粒子　joule = ジュール（エネルギーの単位）　thermometer = 温度計`,
      fig: null,
      passage: 'sk-ep-2023-2',
      parts: [
        {
          label: '問1(1)',
          q: R`空所 ( 1 )（第3段落）に入る最も適切な語を選びなさい。`,
          type: 'choice', choices: ['at', 'in', 'on', 'with'], answer: 1,
          explain: R`**in motion** で「運動している（動いている）状態で」です。be in motion は be moving とほぼ同じ意味になります。at / on / with は motion と結びついてこの意味を表すことができません。`
        },
        {
          label: '問1(2)',
          q: R`空所 ( 2 )（第3段落）に入る最も適切な語を選びなさい。`,
          type: 'choice', choices: ['at', 'by', 'in', 'on'], answer: 3,
          explain: R`**on average** で「平均して」です。温度は、粒子の 1 個 1 個ではなく「平均として」どれだけの運動エネルギーを持っているかを表す、という定義になります。at average / by average / in average とは言いません。`
        },
        {
          label: '問1(3)',
          q: R`空所 ( 3 )（第6段落）に入る最も適切な語を選びなさい。`,
          type: 'choice', choices: ['by', 'for', 'in', 'with'], answer: 0,
          explain: R`変化の幅（差）を表す **by** です。raise 〜 by 1 degree で「〜を 1 度（だけ）上げる」という意味になります。increase by 10 percent（10 パーセント増える）と同じ用法で、for / in / with では変化の幅を表せません。`
        },
        {
          label: '問1(4)',
          q: R`空所 ( 4 )（第7段落）に入る最も適切な語を選びなさい。`,
          type: 'choice', choices: ['across', 'over', 'into', 'under'], answer: 2,
          explain: R`**come into contact with 〜** で「〜と接触する」です。火花が皮膚に触れる場面を表しています。across / over / under では contact with 〜 とつながりません。`
        },
        {
          label: '問1(5)',
          q: R`空所 ( 5 )（第8段落）に入る最も適切な語を選びなさい。`,
          type: 'choice', choices: ['as', 'more', 'so', 'than'], answer: 0,
          explain: R`倍数表現 **X times as much + 名詞 + as 〜**（〜の X 倍の…）です。後ろに as the same mass of dry sand があるので、それと組になる as を入れます。more を使うなら後ろは than になるはずですし、空所の直後に much があるので more much とも言えません。`
        },
        {
          label: '問1(6)',
          q: R`空所 ( 6 )（第9段落）に入る最も適切な語を選びなさい。`,
          type: 'choice', choices: ['by', 'on', 'at', 'to'], answer: 2,
          explain: R`**at the same temperature** で「同じ温度で」です。温度・速度・値段のように目盛りの上の一点を表すときは at を使います（at 80 degrees、at full speed など）。熱は、両方の物体が同じ温度になるまで流れ続ける、という内容です。`
        },
        {
          label: '問2',
          q: R`下線部 (7) の that（第8段落）が指しているものを 1 つ選びなさい。`,
          type: 'choice',
          choices: ['the sunlight', 'the beach', 'the temperature', 'the energy'],
          answer: 2,
          explain: R`the temperature of the sand rises much higher than **that** of the sea は比較の文で、that は同じ名詞のくり返しを避けるために使われています。the temperature of the sand と that of the sea が同じ形で並んでいるので、that ＝ the temperature（海の「温度」）です。`
        },
        {
          label: '問3',
          q: R`空所 ( 8 ) と ( 9 )（第6段落）には、それぞれ数値が入ります。本文の説明に合う ( 8 )、( 9 ) の順の組合せとして最も適切なものを 1 つ選びなさい。`,
          type: 'choice',
          choices: [
            '12,000 ／ 4,000,000',
            '50,400 ／ 16,800',
            '67,200 ／ 16,800,000',
            '50,400 ／ 16,800,000',
            '67,200 ／ 33,600,000'
          ],
          answer: 3,
          explain: R`第6段落に「1 グラムの水の温度を 1 度上げるには約 4.2 ジュールが必要」とあるので、必要な熱は「水の質量（グラム）× 4.2 × 温度の変化（度）」で求められます。
紅茶: 200 × 4.2 × (80 − 20) = 200 × 4.2 × 60 = 50,400（ジュール）。
風呂: 200 キログラム = 200,000 グラムなので、200,000 × 4.2 × (40 − 20) = 200,000 × 4.2 × 20 = 16,800,000（ジュール）。
直後の「300 倍以上」（16,800,000 ÷ 50,400 ≒ 333）とも合います。67,200 や 33,600,000 は、温度の「変化」ではなく最後の温度（80、40）を掛けてしまった誤り、16,800 はキログラムをグラムに直し忘れた誤り、12,000 と 4,000,000 は 4.2 を掛け忘れた誤りです。`
        },
        {
          label: '問4',
          q: R`本文の内容と一致するものを、次の中から 2 つ選びなさい。`,
          type: 'multi',
          choices: [
            R`Heat is a form of energy, and it is measured in joules.`,
            R`A larger amount of water always has a higher temperature than a smaller amount.`,
            R`The sparks from a sparkler are harmless because their temperature is lower than that of hot tea.`,
            R`Sand needs more energy than water does to become one degree warmer.`,
            R`A metal bench can feel colder than a wooden one even when their temperatures are the same.`,
            R`When ice is put into a drink, cold flows from the ice into the drink.`
          ],
          answer: [0, 4],
          explain: R`正解は「熱はエネルギーの一形態で、ジュールで測られる」（第5段落）と、「金属のベンチは、温度が同じでも木のベンチより冷たく感じられることがある」（第10段落）です。
ほかの選択肢は次の点が誤りです。「水の量が多いほど温度が高い」→ 温度は水の量には左右されません（第4段落）。「火花が無害なのは紅茶より温度が低いから」→ 火花は 1,000 度を超えていて紅茶よりはるかに高温です。無害なのは質量が小さく、運ぶ熱が少ないからです（第1・7段落）。「砂は水より多くのエネルギーを必要とする」→ 逆で、水が砂の約 5 倍のエネルギーを必要とします（第8段落）。「氷から冷たさが流れ込む」→ 熱が飲み物から出て氷に入ります（第9段落）。`
        },
        {
          label: '記述1a',
          q: R`本文中で、次の語と同じ意味で使われている英語 1 語を本文から抜き出して答えなさい。

material（第5段落）`,
          type: 'text', answer: 'substance', hint: '半角英字で 1 語',
          explain: R`第8段落の Water is an unusual **substance** が該当します。material も substance も「物質」という意味です。第8段落では、Different materials ... と述べた直後に、水を指して substance と言い換えています。`
        },
        {
          label: '記述1b',
          q: R`本文中で、次の語と同じ意味で使われている英語 1 語を本文から抜き出して答えなさい。

amount（第5段落）`,
          type: 'text', answer: 'quantity', hint: '半角英字で 1 語',
          explain: R`第7段落の only a tiny **quantity** of heat が該当します。the amount of heat（熱の量）と a quantity of heat は同じ意味で、どちらも「量」を表します。`
        },
        {
          label: '記述1c',
          q: R`本文中で、次の語と同じ意味で使われている英語 1 語を本文から抜き出して答えなさい。

need（第6段落）`,
          type: 'text', answer: ['require', 'requires'], hint: '半角英字で 1 語',
          explain: R`第8段落の Different materials **require** different amounts of energy が該当します。need も require も「〜を必要とする」という意味です。同じ段落の次の文では it needs ... と need に戻っているので、言い換えであることがわかります。`
        },
        {
          label: '記述1d',
          q: R`本文中で、次の語と同じ意味で使われている英語 1 語を本文から抜き出して答えなさい。

quickly（第8・10段落）`,
          type: 'text', answer: 'rapidly', hint: '半角英字で 1 語',
          explain: R`第3段落の they move **rapidly** が該当します。直後の slowly（ゆっくり）と対比されていて、quickly と同じ「速く」という意味です。`
        },
        {
          label: '記述2',
          q: R`空所 ( 10 )（第4段落）に「水がどれだけあるか」という意味の英語が入るように、次の 5 語を並べかえなさい。`,
          type: 'order',
          words: ['there', 'water', 'is', 'how', 'much'],
          answer: 'how much water there is',
          explain: R`前置詞 on の目的語になる**間接疑問**です。間接疑問は「疑問詞 + 主語 + 動詞」の語順になるので、how much water（どれだけの水が）の後に there is（あるか）を続けます。ふつうの疑問文の語順 how much water is there のままにしないことがポイントです。直前の「カップの湯も風呂の湯も温度は同じ」という例から、「温度は水の量には左右されない」という内容になります。`
        }
      ],
      solution: [
        {
          t: '全体の流れをつかむ',
          n: R`段落ごとの要旨は次のとおりです。
第1段落: 問い（1,000 度を超える火花は平気なのに、80 度の紅茶ではやけどをするのはなぜか）。
第2段落: 熱と温度は別のものである。
第3〜4段落: 温度の定義（粒子の運動エネルギーの平均。物の量にはよらない）。
第5〜6段落: 熱の定義（移動するエネルギー、単位はジュール。質量・物質の種類・温度変化で決まる）と計算例。
第7段落: 火花の問いへの答え（質量がごく小さいので熱が少ない）。
第8段落: 物質による違い（水は砂の約 5 倍のエネルギーが必要）。
第9段落: 熱が流れる向き（熱いほうから冷たいほうへ）。
第10段落: ベンチの例（皮膚は熱の出入りを感じている）。
第11段落: まとめ。`,
          easy: R`温度は「どれくらい熱いか（粒子の動きの激しさ）」、熱は「どれだけのエネルギーが移動したか」です。小さじ 1 杯の熱湯と、浴槽いっぱいのぬるま湯を比べると、温度が高いのは熱湯ですが、たくさんの熱を持っているのは浴槽のほうです。このイメージを持って読むと全体がすっきりします。`,
          pro: R`物理の「熱量と比熱」で学ぶ内容（熱量 = 質量 × 比熱 × 温度変化）を英語で説明した文章です。理工学部の英語では、物理基礎・化学基礎で習う内容の解説文がよく出題されるので、単位や物理量の英語名（mass, temperature, energy, force など）に慣れておくと有利です。`
        },
        {
          t: '問1 熟語と語法で決める',
          n: R`**in** motion（運動して）、**on** average（平均して）、raise 〜 **by** 1 degree（差を表す by）、come **into** contact with 〜（〜と接触する）、five times **as** much 〜 as …（…の 5 倍の〜）、**at** the same temperature（同じ温度で）。空所の前後 2〜3 語を見れば決まるものばかりです。`
        },
        {
          t: '問2 that of 〜 は前の名詞の言い換え',
          n: R`比較の文では、比べるものの形をそろえます。the temperature of the sand と比べられているのは the temperature of the sea なので、that ＝ the temperature です。複数の名詞を受けるときは those of 〜 になります。`
        },
        {
          t: '問3 本文の説明どおりに計算する',
          m: [
            R`200 \times 4.2 \times (80 - 20) = 50400`,
            R`200000 \times 4.2 \times (40 - 20) = 16800000`
          ],
          n: R`「1 グラムを 1 度上げるのに 4.2 ジュール」という本文の説明から、質量（グラム）× 4.2 × 温度の変化、で求めます。キログラムをグラムに直すこと、最後の温度ではなく「変化した分」を掛けることに注意します。`,
          pro: R`本番でも、本文の説明をもとに簡単な比例計算をして数値を選ぶ設問が出ています。英文を読みながら、与えられた数値と単位を余白にメモしておくと、計算にすぐ取りかかれます。`
        },
        {
          t: '問4 内容一致',
          n: R`選択肢のキーワード（joules, amount of water, sparks, sand, bench, ice）から該当する段落に戻って確認します。誤りの選択肢は「大小・高低の逆転」（砂と水、火花と紅茶）や「向きの逆転」（冷たさが流れ込む）で作られています。`
        },
        {
          t: '記述1 同義語は品詞と文脈をそろえて探す',
          n: R`指定された段落で語の意味と品詞を確認してから、本文のほかの部分で同じ内容を別の語で述べている箇所を探します。material → substance、amount → quantity、need → require、quickly → rapidly のように、近くで言い換えたり、反対語（slowly）と並べたりしている箇所が手がかりになります。`
        },
        {
          t: '記述2 間接疑問の語順',
          n: R`文の一部になった疑問文（間接疑問）は「疑問詞 + 主語 + 動詞」の語順になります。how much water there is は depend on の目的語です。語数が指定された英作文は、使う構文が 1 つに決まるように作られているので、基本構文を正確に書けるようにしておきましょう。`
        }
      ],
      tags: ['空所補充', '指示語', '数値の読み取り', '同義語', '間接疑問', '物理']
    },

    /* ---------- 第3問 ---------- */
    {
      id: 'sk-e-2023-3',
      subject: 'english',
      level: 'mid',
      unit: 'e-reading',
      title: '長文：バス会社の立て直し',
      source: src('第3問'),
      time: 10,
      body: R`次の英文は、山あいの町の小さなバス会社が、赤字から立て直されていくようすを述べたものです（会社名・人物は架空のものです）。英文を読み、下の問に答えなさい。段落は上から順に第1段落〜第6段落と数えます。下線部は (1) です。

注　route = 路線　timetable = 時刻表　hand counter = 押すたびに数が増える手持ちの数取り器　van = 小型のワゴン車`,
      fig: null,
      passage: 'sk-ep-2023-3',
      parts: [
        {
          label: '問1',
          q: R`本文で、リナが会社を立て直すために**実際に行ったこと**を、次の中から 3 つ選びなさい。立て直しが始まる前からあったことや、行った結果として起きたことは含めません。`,
          type: 'multi',
          choices: [
            R`運転手に数取り器を持たせ、乗客数を停留所・時刻とともに記録させた。`,
            R`朝 6 時から夜 9 時まで、乗る人がいてもいなくても、毎時間 1 本ずつバスを出発させていた。`,
            R`古いバスを新しい型のバスに買い換えて、走る速さを上げ、どの路線でも所要時間を短くした。`,
            R`乗客の多い早朝と午後の時間帯にバスを移し、昼のバスは 2 時間おきにした。`,
            R`1 年後には、乗客の数が 4 分の 1 ほど増え、年間の赤字も半分に減った。`,
            R`乗客の少ない山の村の路線を、前日に電話で呼ぶと玄関先まで迎えに来る小型のバンに置き換えた。`,
            R`乗客のほとんどいない山の村の路線を、赤字を減らすために思いきって廃止した。`
          ],
          answer: [0, 3, 5],
          explain: R`取り組みは第3〜5段落に 1 つずつ書かれています。第3段落: 運転手に数取り器を持たせ、乗客数を停留所・時刻とともに記録させた（Rina began by counting）。第4段落: 数字をもとに、数台のバスを乗客の多い時間帯へ移し、昼のバスは 2 時間おきにした（moved several buses ... only every two hours）。第5段落: 乗客を 1 人も乗せないことも多かった山の村の路線を、前日に電話で呼ぶ小型のバンに置き換えた（replaced it with a small van）。
ほかの選択肢は選べません。「乗る人がいてもいなくても毎時間 1 本ずつ出発させていた」は第2段落の、立て直し前のやり方です。「古いバスを新しい型に買い換えた」は、最後の文に The buses were the same old buses（バスは昔と同じ）とあるのに反します。「乗客の数が 4 分の 1 ほど増え、赤字も半分に減った」は第6段落の結果で、リナが行ったことではありません。「山の村の路線を廃止した」は、第6段落の No route had to be closed（廃止せざるをえない路線は 1 本もなかった）に反し、実際には小型のバンに置き換えています。`
        },
        {
          label: '問2',
          q: R`立て直しが始まる前のハナミズキバスのようすとして、本文の内容に合うものを 1 つ選びなさい。`,
          type: 'choice',
          choices: [
            R`乗客の数を毎月数えて、その結果をもとに、時刻表を何度も作りかえていた。`,
            R`朝のバスはたいてい空いていて、昼のバスのほうが乗客が多く、ときには満員になることもあった。`,
            R`山の村へ向かう路線は、毎日たくさんの乗客を乗せて、会社の収入を支えていた。`,
            R`乗る人がいてもいなくても毎時間バスを出し、どのバスに何人乗るのかも数えたことがなかった。`
          ],
          answer: 3,
          explain: R`第2段落に、会社は 30 年間、乗りたい人がいてもいなくても、朝 6 時から夜 9 時まで毎時間バスを出してきた（had sent a bus ... every hour ... whether or not anyone wanted to ride）とあり、どのバスに何人が乗っているのかもだれも数えたことがなかった（nobody had ever counted）とあります。乗客の数を数えたのはリナが最初で（第3段落）、バスの出し方を変えたのもその後です（第4段落）。昼は乗客が少なく、朝のバスは満員になることが多かった（第2段落）ので、朝が空いていたという選択肢は逆です。山の村の路線は、乗客を 1 人も乗せないことも多かった（第5段落）ので、たくさんの乗客を乗せていたという選択肢も誤りです。`
        },
        {
          label: '問3',
          q: R`下線部 (1)（第6段落）の内容を具体的に説明したものとして、最も適切なものを 1 つ選びなさい。`,
          type: 'choice',
          choices: [
            R`バスの台数を増やして、できるだけ多くの停留所に止まるようにし、乗れる人の数を増やした。`,
            R`乗客の数を調べ、人の多い時間にバスを回し、利用の少ない路線は呼べば来る小型車に替えた。`,
            R`運賃を引き下げ、乗客がバスに乗りやすいようにして、利用する人を増やした。`,
            R`古いバスを修理して長く使い、運転手の数を減らして、会社の費用を抑えた。`
          ],
          answer: 1,
          explain: R`下線部は「バスは昔と同じバスで、会社はただ、バスを必要としている人のもとへ送り出すすべを身につけただけだった」という意味です。第3〜5段落の 3 つの取り組み（乗客を数える → 乗客の多い時間帯へバスを移す → 乗客の少ない路線は呼べば来る小型のバンに置き換える）は、どれも、バスを走らせる時間や場所を、乗客のいるところに合わせるものでした。バスの台数を増やした、運賃を下げた、運転手を減らしたといった記述は本文にありません。バスそのものは the same old buses（昔と同じバス）で、変わったのは送り出し方です。`
        }
      ],
      solution: [
        {
          t: '全体の流れをつかむ',
          n: R`段落ごとの要旨は次のとおりです。
第1段落: 赤字が続くバス会社で、若い事務職員のリナが、路線を守る方法を探すよう頼まれる。
第2段落: 以前のやり方（30 年間、乗る人がいてもいなくても毎時間 1 本、昼は空いていて朝は満員、だれも乗客を数えたことがない）。
第3段落: 取り組み① 運転手に数取り器を持たせ、乗客数・停留所・時刻を記録する。
第4段落: 取り組み② 数字をもとに、バスを乗客の多い時間帯へ移し、昼の便は 2 時間おきにする。
第5段落: 取り組み③ 乗客の少ない山の村の路線を、前日に電話で呼ぶ小型のバンに置き換える。
第6段落: 結果（乗客 4 分の 1 増、赤字半減、廃止路線なし）とまとめ（バスは同じ。送り出し方を変えただけ）。`,
          easy: R`「困りごと → 以前のやり方 → 調べる → 変える → 結果」の順に進む文章です。リナが「数える」「移す」「置き換える」という動作をする文を見つけると、取り組みの部分がすぐにわかります。`
        },
        {
          t: '「以前のやり方」と「取り組み」を見分ける',
          n: R`第2段落は had sent、carried、were、had ever counted のように、立て直しの前の状態や習慣を表す文が続きます。第3段落からは Rina を主語にして、began、gave、moved、replaced という動作を表す動詞が使われ、「何をしたか」が述べられます。第6段落の A year later 〜 は結果なので、取り組みには数えません。`,
          easy: R`「前はこうだった」という説明と、「それをこう変えた」という説明を分けて読むのがポイントです。本文の横に「以前」「取り組み①②③」「結果」と書きこむと整理しやすくなります。`
        },
        {
          t: '取り組みを日本語でまとめる（記述対策）',
          n: R`本番では、具体的な取り組みを 3 つ、字数制限つきの日本語で書く形式で出題されています。「何を・どうしたか」を 1 文でまとめる練習をしておきましょう。この英文なら、「運転手に数取り器を持たせ、乗客数・停留所・時刻を記録させた」「乗客の多い時間帯にバスを移し、昼の便は 2 時間おきにした」「乗客の少ない村の路線を、前日に電話で呼ぶ小型のバンに置き換えた」のようになります。`,
          pro: R`字数が限られているときは、数字や例（2018 年、30 年、2、3 人など）は省き、動作の中心（何をどうしたか）だけを書きます。以前のやり方や結果を書いてしまうと得点になりません。`
        },
        {
          t: '下線部は具体例をまとめた文として読む',
          n: R`最後の文は、第3〜5段落の 3 つの取り組みをひとことでまとめた文です。「バスを必要としている人のもとへ送り出す」とは、乗客を数えたうえで、人のいる時間に（第4段落）、人のいる場所へ（第5段落）バスを向けるようになった、ということです。抽象的な表現の意味を問われたら、直前までの具体例に戻って、共通する点を考えます。`
        }
      ],
      tags: ['内容説明', '具体例の抜き出し', '要約', 'ビジネス']
    },

    /* ---------- 第4問 ---------- */
    {
      id: 'sk-e-2023-4',
      subject: 'english',
      level: 'mid',
      unit: 'e-vocab',
      title: '英語の定義から単語を書く',
      source: src('第4問'),
      time: 5,
      body: R`次の (1)〜(4) は、英単語を英語で定義した文です。かっこ内に示された文字で始まる単語を、1 語ずつ答えなさい。`,
      fig: null,
      passage: null,
      parts: [
        {
          label: '(1)',
          q: R`( h... ) = the time of year when crops such as rice or corn are cut and gathered from the fields, or the crops that are gathered at that time`,
          type: 'text', answer: 'harvest', hint: '最初の 1 文字も含めて、単語全体を半角英字で入力',
          explain: R`crops（作物）を cut and gather（刈り取って集める）する時期、またはそのとき集められる作物のことなので、**harvest**（収穫（期）、収穫物）です。動詞で「〜を収穫する」という意味もあります。`
        },
        {
          label: '(2)',
          q: R`( p... ) = a secret series of letters, numbers, or symbols that you must type in order to use a computer system, a website, or an app`,
          type: 'text', answer: 'password', hint: '最初の 1 文字も含めて、単語全体を半角英字で入力',
          explain: R`secret series of letters, numbers, or symbols（文字・数字・記号の秘密の並び）を入力して、コンピューターやウェブサイトを使えるようにするものなので、**password**（パスワード）です。pass（通る）+ word（言葉）で、1 語でつづります。`
        },
        {
          label: '(3)',
          q: R`( t... ) = an instrument shaped like a tube, with lenses or mirrors inside, that makes distant objects such as stars and planets look larger and nearer`,
          type: 'text', answer: 'telescope', hint: '最初の 1 文字も含めて、単語全体を半角英字で入力',
          explain: R`筒の形（shaped like a tube）をしていて、中にレンズや鏡があり、星や惑星など遠くの物体（distant objects）を大きく近く見せる器具なので、**telescope**（望遠鏡）です。小さな物を拡大して見る microscope（顕微鏡）と区別しましょう。tele- は「遠い」、micro- は「小さい」という意味を表します。`
        },
        {
          label: '(4)',
          q: R`( f... ) = the force that makes it difficult for one surface to slide over another when the two are touching, and that produces heat when things are rubbed together`,
          type: 'text', answer: 'friction', hint: '最初の 1 文字も含めて、単語全体を半角英字で入力',
          explain: R`触れ合っている 2 つの面が滑る（slide）のを妨げる力で、物をこすり合わせる（rub）と熱を生むものなので、**friction**（摩擦）です。gravity（重力）、pressure（圧力）、density（密度）などと並ぶ、物理の基本語です。`
        }
      ],
      solution: [
        {
          t: '定義文の最初の名詞で「何の仲間か」をつかむ',
          n: R`英語の定義は「= a / the + 名詞 + 説明」の形で書かれます。最初の名詞（上位語）を見ると、(1) time（時期）、(2) series（並び）、(3) instrument（器具）、(4) force（力）と、答えがどんな種類の語かがすぐにわかります。`,
          easy: R`英英辞典の説明は、「大きな分類（〜の一種）」を先に言い、その後で「どんな特徴があるか」を付け足す形になっています。日本語で「望遠鏡とは、遠くの物を大きく見せる器具である」と言うときの「器具」に当たる語を、まず探しましょう。`
        },
        {
          t: '説明の部分から特徴を拾う',
          n: R`(1) crops / cut and gathered → 作物の刈り入れ。(2) secret / type / computer → 入力する秘密の文字列。(3) tube / lenses / distant objects → 遠くを見る筒形の器具。(4) surface / slide / rubbed / heat → 面どうしの滑りを妨げ、熱を生む力。キーワードを 2〜3 個拾えば、日本語で何のことかが決まります。`
        },
        {
          t: '頭文字に合わせて英単語にし、つづりを確認する',
          n: R`日本語で思いついた語を、指定された頭文字で始まる英単語に直します。harvest、password、telescope、friction。記述式なので、つづりを 1 字でもまちがえると得点になりません。-vest、-scope、-tion のような語尾を意識して覚えましょう。`
        },
        {
          t: '対策: 理工系の基本語を英語で説明できるようにする',
          n: R`この形式では、日常の語・社会生活の語に加えて、理科や技術に関する語が出題されます。単語帳の語を「上位語 + 特徴」の形で英語で説明する練習（例: a thermometer = an instrument for measuring temperature）をしておくと、定義文を読む速さも上がります。`,
          pro: R`教科書の物理・化学で出てくる用語（力、エネルギー、物質、器具の名前）の英語名を、ふだんから意識して覚えておくと、この大問と科学系の長文の両方に役立ちます。`
        }
      ],
      tags: ['英英定義', '語彙', '記述', '理工系語彙']
    }
  ]);
})();
