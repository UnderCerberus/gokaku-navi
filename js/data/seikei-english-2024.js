/* GOKAKU NAVI — 成蹊大学 理工学部 英語 2024 年度 準拠の類題
   大問構成・設問形式・語数の目安だけを 2024 年度に合わせ、
   英文・設問・選択肢・解説はすべて書き下ろしたもの（過去問の文面・題材は含まない）。
   第1問: 社会・経済史の読み物（空所補充・数値・内容一致・抜き出し）
   第2問: 科学の解説文（前置詞・整序・同義語・数値表記・指示内容）
   第3問: 物語文（理由説明・英英定義から単語を書く） */
(function () {
  'use strict';
  const R = String.raw;
  const src = function (no) {
    return { univ: '成蹊大学', faculty: '理工学部', year: 2024, no: no, kind: '類題' };
  };

  /* ================================================================
   *  長文（passage）
   * ================================================================ */
  JK.registerPassages([
    /* ---------- 第1問: 社会・経済史の読み物（貨物用コンテナ） ---------- */
    {
      id: 'sk-ep-2024-1',
      title: 'The Box That Shrank the World',
      level: 'mid',
      topic: '社会・経済史',
      source: src('第1問'),
      paras: [
        [
          { en: R`Look around your room and pick up almost anything: a phone, a pair of shoes, a coffee mug.`, ja: R`自分の部屋を見回して、ほとんどどんなものでも手に取ってみてほしい。携帯電話でも、1足の靴でも、コーヒーカップでもよい。` },
          { en: R`There is a good chance that it crossed an ocean inside a plain steel box.`, ja: R`それがありふれた鋼鉄の箱に入って大洋を渡ってきた可能性は十分にある。` },
          { en: R`The shipping container is so common that we hardly ever notice it, yet it is one of the most important inventions of the twentieth century.`, ja: R`貨物用コンテナはあまりにありふれているので、私たちはめったにその存在に気づかないが、それでも20世紀の最も重要な発明の一つである。` }
        ],
        [
          { en: R`Until the 1950s, loading a ship was slow and heavy work.`, ja: R`1950年代まで、船への積み込みは時間のかかる重労働だった。` },
          { en: R`Goods arrived at the port in sacks, barrels, and wooden crates of every size.`, ja: R`荷物は、あらゆる大きさの袋や樽や木箱に入れられて港に届いた。` },
          { en: R`Teams of dockworkers lifted them one by one with ropes and hooks and packed each item into the ship {b1:by} hand.`, ja: R`港湾労働者の班が、それらを縄やフックで1つずつ持ち上げ、手作業で船内に詰め込んでいった。` },
          { en: R`A typical cargo ship spent about a week in port, and its owner earned no money while it sat there.`, ja: R`典型的な貨物船は港に約1週間とどまり、その間、船主は一銭も稼げなかった。` },
          { en: R`Worse still, goods were often broken or stolen on the way.`, ja: R`さらに悪いことに、荷物は途中で壊されたり盗まれたりすることがよくあった。` }
        ],
        [
          { en: R`The man who changed all this was Malcolm McLean, an American who owned a trucking company.`, ja: R`こうした状況を一変させたのは、トラック運送会社を経営していたアメリカ人、マルコム・マクリーンだった。` },
          { en: R`He noticed that the greatest waste was in handling: the same goods were lifted off a truck, put down on the dock, and lifted again onto a ship.`, ja: R`彼は、最大の無駄は荷役にあることに気づいた。同じ荷物がトラックから降ろされ、埠頭に置かれ、再び持ち上げられて船に載せられていたのである。` },
          { en: R`His idea was simple.`, ja: R`彼の考えは単純だった。` },
          { en: R`Why not pack the goods into one large metal box at the factory, and move the whole box from truck to ship without ever opening it?`, ja: R`荷物を工場で大きな金属の箱1つに詰め、その箱ごと、一度も開けることなくトラックから船へ移してはどうか。` }
        ],
        [
          { en: R`McLean sold his trucking business and bought a shipping company.`, ja: R`マクリーンはトラック運送の事業を売却し、海運会社を買い取った。` },
          { en: R`In April 1956, one of his old oil tankers, the Ideal X, left Newark, New Jersey, {b2:for} Houston, Texas, carrying 58 metal boxes on its deck.`, ja: R`1956年4月、彼の持つ古い石油タンカーの1隻、アイデアル X 号が、甲板に58個の金属の箱を載せて、ニュージャージー州ニューアークからテキサス州ヒューストンへ向けて出港した。` },
          { en: R`The voyage itself was uneventful, but the result was surprising: loading a ton of cargo this way cost only a small fraction of the usual price.`, ja: R`航海そのものは何事もなかったが、結果は驚くべきものだった。この方法だと、貨物1トンの積み込み費用は、通常の価格のごくわずかな割合ですんだのである。` }
        ],
        [
          { en: R`In the beginning, however, the idea did not spread widely.`, ja: R`しかし当初、この考えは広くは普及しなかった。` },
          { en: R`Each company built boxes of its own size, and a box from one company often did not fit the trucks, trains, or cranes of another.`, ja: R`各社がそれぞれ独自の大きさの箱を作っていたので、ある会社の箱が、別の会社のトラックや列車やクレーンに合わないことがよくあった。` },
          { en: R`In 1968, international standards fixed a few common sizes.`, ja: R`1968年、国際規格がいくつかの共通の大きさを定めた。` },
          { en: R`After that, a container could pass {b3:from} a ship to a train to a truck almost anywhere in the world without being unpacked.`, ja: R`その後は、コンテナは中身を出されることなく、世界のほぼどこでも、船から列車へ、さらにトラックへと受け渡せるようになった。` }
        ],
        [
          { en: R`The effect on speed was dramatic.`, ja: R`速さへの影響は劇的だった。` },
          { en: R`An old-fashioned cargo ship stayed in port for about a week, but a container ship could be unloaded and loaded again in about a day.`, ja: R`昔ながらの貨物船は港に約1週間とどまったが、コンテナ船は約1日で荷を降ろし、再び積み込むことができた。` },
          { en: R`A ship that spends less time in port and more time {b4:at} sea can make more trips every year, so the cost of carrying each box falls.`, ja: R`港にいる時間が短く海上にいる時間が長い船は、毎年より多くの航海ができるので、箱1つを運ぶ費用は下がる。` },
          { en: R`As ships grew larger, the savings grew larger as well.`, ja: R`船が大型化するにつれて、節約できる額もいっそう大きくなった。` }
        ],
        [
          { en: R`Not everyone welcomed the change.`, ja: R`だれもがその変化を歓迎したわけではなかった。` },
          { en: R`A ship that once needed hundreds of dockworkers could now be handled by a few crane operators.`, ja: R`かつては何百人もの港湾労働者を必要とした船が、いまや数人のクレーン操作員で扱えるようになった。` },
          { en: R`Dockworkers' unions were afraid that their skills would no longer be needed, and some of them went {b5:on} strike.`, ja: R`港湾労働者の組合は、自分たちの技能がもう必要とされなくなることを恐れ、そのうちのいくつかはストライキに入った。` },
          { en: R`In several countries the unions finally accepted the new machines, but only after they won promises to protect their members' pay.`, ja: R`いくつかの国では、組合は最終的に新しい機械を受け入れたが、それは組合員の賃金を守るという約束を勝ち取ってからのことだった。` },
          { en: R`Old harbors near city centers, which had little space for the new cranes, lost their business to huge new ports built on empty land outside the cities.`, ja: R`市の中心部に近い古い港は、新しいクレーンのための場所がほとんどなく、都市の外の空き地に造られた巨大な新しい港に仕事を奪われた。` }
        ],
        [
          { en: R`Cheap and reliable shipping also changed the way companies think.`, ja: R`安くて信頼できる海上輸送は、企業の考え方も変えた。` },
          { en: R`It became profitable to make a product in a country where wages were low and to sell it thousands of kilometers away.`, ja: R`賃金の低い国で製品を作り、何千キロも離れた場所で売ることが、採算に合うようになったのである。` },
          { en: R`A single product could be designed in one country, built from parts made in several others, and sold in dozens more.`, ja: R`1つの製品が、ある国で設計され、ほかの数か国で作られた部品から組み立てられ、さらに数十の国で売られることもありうるようになった。` },
          { en: R`Many economists believe that the container is a key reason why world trade grew so fast after the 1960s.`, ja: R`多くの経済学者は、1960年代以降に世界貿易がこれほど急速に伸びた大きな理由の一つがコンテナだと考えている。` }
        ],
        [
          { en: R`The container is not a clever machine; it is only an empty box.`, ja: R`コンテナは賢い機械ではない。ただの空っぽの箱にすぎない。` },
          { en: R`Yet by making every shipment the same shape, it allowed ships, trains, and trucks to work together as one system.`, ja: R`それでも、すべての荷物を同じ形にすることで、船も列車もトラックも1つの仕組みとして一体となって働けるようにしたのである。` },
          { en: R`Sometimes the most powerful ideas are not complicated ones.`, ja: R`最も力強い発想は、複雑なものとは限らない。` },
          { en: R`They are the ones that make everything else fit together.`, ja: R`それは、ほかのすべてをうまくかみ合わせる発想なのである。` }
        ]
      ],
      vocab: ['cargo', 'barrel', 'crate', 'dockworker', 'handle', 'waste', 'deck', 'voyage', 'fraction', 'fit',
        'dramatic', 'union', 'strike', 'wage', 'profitable', 'reliable', 'economist', 'shipment', 'container', 'unpack', 'crane', 'tanker'],
      vocabExtra: [
        ['barrel', '名', '樽', 2],
        ['crate', '名', '木箱; 荷箱', 3],
        ['dockworker', '名', '港湾労働者', 3],
        ['deck', '名', '甲板; デッキ', 2],
        ['profitable', '形', '利益のある; もうかる', 2],
        ['economist', '名', '経済学者', 2],
        ['unpack', '動', '〜の荷を解く; 中身を取り出す', 2],
        ['crane', '名', 'クレーン; 起重機', 2],
        ['tanker', '名', 'タンカー', 2],
        ['dock', '名', '埠頭; 波止場', 3]
      ]
    },

    /* ---------- 第2問: 科学の解説文（雷の仕組みと安全） ---------- */
    {
      id: 'sk-ep-2024-2',
      title: 'Lightning: How It Works and How to Stay Safe',
      level: 'mid',
      topic: '科学・物理',
      source: src('第2問'),
      paras: [
        [
          { en: R`Somewhere on Earth, a thunderstorm is lighting up the sky at this very moment.`, ja: R`いまこの瞬間にも、地球のどこかで雷雨が空を明るく照らしている。` },
          { en: R`Each flash is a bright spark of {u1:electricity}, and the energy it carries is {u2:enormous}.`, ja: R`どの閃光も明るい電気の火花であり、それが運ぶエネルギーは莫大である。` },
          { en: R`Let us look at how lightning is made, how it behaves, and how to stay safe from it.`, ja: R`ここでは、雷がどのようにしてできるのか、どんな性質をもつのか、そしてどうすれば身を守れるのかを見ていこう。` }
        ],
        [
          { en: R`To begin with, a storm cloud is a huge battery in the sky.`, ja: R`まず、雷雲は空に浮かぶ巨大な電池である。` },
          { en: R`Inside a storm cloud, strong winds carry tiny pieces of ice and drops of water up and down.`, ja: R`雷雲の中では、強い風が小さな氷のかけらや水滴を上へ下へと運んでいる。` },
          { en: R`They collide {b3:with} each other again and again, and every collision moves a little electric charge from one piece to another.`, ja: R`それらは何度も何度も互いにぶつかり合い、ぶつかるたびに少しの電荷が一方から他方へ移る。` },
          { en: R`Little by little, the top of the cloud becomes positive and the bottom becomes negative.`, ja: R`少しずつ、雲の上のほうはプラスに、下のほうはマイナスになっていく。` },
          { en: R`The ground under the cloud becomes positive, too, so the cloud and the ground are like the two ends of a battery.`, ja: R`雲の下の地面もプラスの電気を帯びるので、雲と地面は電池の両端のようになる。` }
        ],
        [
          { en: R`A bolt of lightning is more than five times hotter than the surface of the Sun.`, ja: R`稲妻は、太陽の表面の5倍以上も熱い。` },
          { en: R`When the difference in charge becomes too much to hold back, a spark jumps from the cloud to the ground.`, ja: R`電気の差が大きくなりすぎて抑えきれなくなると、雲から地面へ火花が飛ぶ。` },
          { en: R`The air around the bolt is heated to about 30,000 degrees Celsius, while the surface of the Sun is only about 5,500 degrees.`, ja: R`稲妻のまわりの空気は約3万度（セ氏）まで熱せられるが、太陽の表面は約5500度にすぎない。` },
          { en: R`The air is heated so {u4:rapidly} that it bursts outward with a bang.`, ja: R`空気はあまりにも急速に熱せられるので、バンという音とともに外側へ爆発的に広がる。` },
          { en: R`The heat can even turn sand {b5:into} glass.`, ja: R`その熱は、砂をガラスに変えてしまうことさえある。` },
          { en: R`The voltage between the cloud and the ground can reach about {u6:one hundred million} volts, far more than that of a wall socket at home.`, ja: R`雲と地面の間の電圧は約1億ボルトにも達することがあり、家庭のコンセントの電圧をはるかに上回る。` }
        ],
        [
          { en: R`{b7:Sound travels nearly a million times more slowly than light}.`, ja: R`音は光より100万倍近くもゆっくり進む。` },
          { en: R`Light travels {b8:at} about 300,000 kilometers per second, while sound covers only about one third of a kilometer in the same time.`, ja: R`光は秒速約30万キロメートルで進むが、音は同じ時間にわずか約3分の1キロメートルしか進まない。` },
          { en: R`That is why you see a flash first and hear the thunder afterward.`, ja: R`だから、先に閃光が見え、雷鳴はあとから聞こえるのである。` },
          { en: R`Thunder is the sound of the hot air spreading outward.`, ja: R`雷鳴は、その熱い空気が外側へ広がるときの音である。` },
          { en: R`You can use the delay to find out how far away a storm is: count the seconds {b9:between} the flash and the thunder, and divide the number by three to get the distance in kilometers.`, ja: R`この遅れを使うと、嵐がどれくらい離れているかがわかる。閃光と雷鳴の間の秒数を数え、その数を3で割れば、キロメートル単位の距離が得られる。` }
        ],
        [
          { en: R`A lightning rod gives lightning an easy way home.`, ja: R`避雷針は雷に、地面への楽な帰り道を用意する。` },
          { en: R`Lightning likes to strike tall objects, such as trees and towers, because they are closer to the cloud.`, ja: R`雷は、木や塔のような背の高いものに落ちたがる。それらのほうが雲に近いからである。` },
          { en: R`A lightning rod is a metal bar fixed to the top of a building and joined to the ground by a thick wire.`, ja: R`避雷針は、建物の屋上に取り付けられ、太い電線で地面につながれた金属の棒である。` },
          { en: R`It gives the electricity an easy path to the ground and so protects the building {b10:from} damage.`, ja: R`それは電気に地面への楽な通り道を与え、そうして建物を損害から守る。` }
        ],
        [
          { en: R`A car is a safe place in a storm, but not because of its tires.`, ja: R`車は嵐の中では安全な場所だが、それはタイヤのおかげではない。` },
          { en: R`Many people think that the rubber tires protect those inside a car from lightning.`, ja: R`多くの人は、ゴムのタイヤが車内の人を雷から守ってくれると考えている。` },
          { en: R`{u11:This idea} is a myth.`, ja: R`この考えは俗説である。` },
          { en: R`If a car is struck {b12:by} lightning, the electricity runs along the metal body and flows into the ground, so the people inside are usually safe.`, ja: R`車に雷が落ちても、電気は金属の車体に沿って流れて地面へ逃げるので、車内の人はたいてい安全である。` }
        ],
        [
          { en: R`If you are caught {b13:in} a storm outdoors, move quickly to a building or a car with a metal roof, and stay away from tall trees.`, ja: R`屋外で嵐にあってしまったら、すばやく建物か金属の屋根の車の中へ移動し、背の高い木からは離れていること。` },
          { en: R`Lightning is beautiful, but it is no toy.`, ja: R`雷は美しいが、おもちゃではない。` },
          { en: R`Respect it, and enjoy the show from a safe place.`, ja: R`雷に敬意を払い、その光のショーは安全な場所から楽しもう。` }
        ]
      ],
      vocab: ['thunderstorm', 'spark', 'electricity', 'enormous', 'collide', 'charge', 'positive', 'negative', 'bolt', 'rapidly',
        'burst', 'outward', 'delay', 'distance', 'rod', 'protect', 'damage', 'myth', 'battery', 'surface'],
      vocabExtra: [
        ['thunderstorm', '名', '雷雨', 3],
        ['bolt', '名', '稲妻; ボルト', 3],
        ['collide', '動', '衝突する', 3],
        ['outward', '副', '外側へ; 外向きに', 3],
        ['rod', '名', '棒; さお', 3]
      ]
    },

    /* ---------- 第3問: 物語文（消えたバイオリン・架空の学校の出来事） ---------- */
    {
      id: 'sk-ep-2024-3',
      title: 'The Missing Violin',
      level: 'mid',
      topic: '文学・物語',
      source: src('第3問'),
      paras: [
        [
          { en: R`On Monday morning, our music teacher, Mr. Sato, opened the door of the music room and stopped.`, ja: R`月曜日の朝、音楽の先生のサトウ先生は、音楽室のドアを開けて立ち止まった。` },
          { en: R`The old violin that always stood in the glass case by the window was gone.`, ja: R`窓のそばのガラスケースにいつも置かれていた古いバイオリンが、なくなっていた。` },
          { en: R`The case was not broken, and the key was still in his desk drawer.`, ja: R`ケースは壊されておらず、鍵も先生の机の引き出しに入ったままだった。` },
          { en: R`"That violin is more than eighty years old," he said in a low voice.`, ja: R`「あのバイオリンは80年以上も前のものなんだ」と、先生は低い声で言った。` }
        ],
        [
          { en: R`My best friend Rin and I looked at each other.`, ja: R`親友のリンと私は顔を見合わせた。` },
          { en: R`We were the last students to leave the music room on Friday.`, ja: R`金曜日に最後に音楽室を出た生徒は、私たちだった。` },
          { en: R`"It was in the case when we went home," I told Mr. Sato.`, ja: R`「私たちが帰るときには、ケースの中にありました」と、私はサトウ先生に伝えた。` },
          { en: R`He nodded slowly, but I could see that he was worried.`, ja: R`先生はゆっくりうなずいたが、心配しているのが私にはわかった。` },
          { en: R`All morning I felt that everyone looked at us as if one of us were a {b1:suspect}.`, ja: R`午前中ずっと、私は、みんなが私たちのうちの1人が容疑者であるかのような目で見ている気がしていた。` }
        ],
        [
          { en: R`"It wasn't a thief from outside," Rin whispered at lunch.`, ja: R`「外から来た泥棒じゃないよ」と、リンは昼休みにささやいた。` },
          { en: R`"A thief would have broken the glass."`, ja: R`「泥棒ならガラスを割っているはずだもの。」` },
          { en: R`"Someone opened the case with the key and then put the key back in the drawer."`, ja: R`「だれかが鍵でケースを開けて、そのあと鍵を引き出しに戻したのよ。」` },
          { en: R`"So it must be a person from our school, someone who knew where the key was."`, ja: R`「だから、この学校の人、鍵のありかを知っていた人に違いないわ。」` },
          { en: R`"But who would do such a thing?" I asked.`, ja: R`「でも、だれがそんなことをするの？」と私はたずねた。` },
          { en: R`Rin shook her head.`, ja: R`リンは首を横に振った。` }
        ],
        [
          { en: R`On Tuesday after school, I was walking past the old gym when I heard a thin, shaky sound from the storeroom behind it.`, ja: R`火曜日の放課後、私が古い体育館のそばを歩いていると、その裏の物置から、細くて震えるような音が聞こえてきた。` },
          { en: R`It was a violin, and the player was not good.`, ja: R`それはバイオリンの音で、弾き手は上手ではなかった。` },
          { en: R`I opened the door slowly.`, ja: R`私はそっとドアを開けた。` },
          { en: R`A first-year boy named Daichi was sitting on a box with the violin under his chin, and his face turned red.`, ja: R`ダイチという1年生の男の子が、あごの下にバイオリンをはさんで箱の上に座っており、その顔がみるみる赤くなった。` }
        ],
        [
          { en: R`"I'm not a thief!" he cried.`, ja: R`「ぼくは泥棒じゃありません！」と彼は叫んだ。` },
          { en: R`"I only {b2:borrowed} it, and I was going to put it back on Wednesday."`, ja: R`「ちょっと借りただけで、水曜日には戻すつもりだったんです。」` },
          { en: R`"Then why didn't you ask Mr. Sato?" I said.`, ja: R`「それなら、どうしてサトウ先生に頼まなかったの？」と私は言った。` },
          { en: R`He looked down at his shoes.`, ja: R`彼は自分のくつに目を落とした。` },
          { en: R`"Everyone in my class plays in the brass band, and they can all read music."`, ja: R`「クラスのみんなは吹奏楽部で演奏していて、全員が楽譜を読めるんです。」` },
          { en: R`"I have never even touched a violin."`, ja: R`「ぼくはバイオリンに触ったことさえありません。」` },
          { en: R`"I was afraid that they would laugh at me, and that Mr. Sato would say no."`, ja: R`「みんなに笑われるのが怖かったし、サトウ先生に断られるのも怖かったんです。」` }
        ],
        [
          { en: R`I sat down beside him.`, ja: R`私は彼の隣に腰を下ろした。` },
          { en: R`"A violin is not happy in a glass case," I said.`, ja: R`「バイオリンは、ガラスケースの中では幸せじゃないよ」と私は言った。` },
          { en: R`"If you tell Mr. Sato the truth yourself, I think he will understand."`, ja: R`「自分でサトウ先生に本当のことを話せば、先生はわかってくれると思う。」` },
          { en: R`We walked to the teachers' room together.`, ja: R`私たちは一緒に職員室へ歩いていった。` },
          { en: R`Mr. Sato listened until Daichi had finished, and then, to my surprise, he smiled.`, ja: R`サトウ先生はダイチが話し終えるまで聞き、そして驚いたことに、にっこり笑った。` },
          { en: R`"I have kept that violin in a glass case for ten years," he said.`, ja: R`「私はあのバイオリンを10年間、ガラスケースにしまい込んできた」と先生は言った。` },
          { en: R`"A violin should be played, not just looked at."`, ja: R`「バイオリンは弾かれるべきものだ。眺めるだけのものではない。」` },
          { en: R`"Come to the music room tomorrow after school, and I will teach you how to hold it."`, ja: R`「明日の放課後、音楽室に来なさい。持ち方を教えてあげよう。」` }
        ],
        [
          { en: R`Daichi's eyes were shining.`, ja: R`ダイチの目は輝いていた。` },
          { en: R`On the way home, Rin said, "We were afraid of a thief, but we only found a boy who loved music."`, ja: R`帰り道、リンは言った。「泥棒を恐れていたのに、見つけたのは音楽が好きな男の子だけだったね。」` },
          { en: R`I nodded.`, ja: R`私はうなずいた。` },
          { en: R`It was the best surprise of that week.`, ja: R`それは、その週で一番うれしい驚きだった。` }
        ]
      ],
      vocab: ['violin', 'drawer', 'suspect', 'whisper', 'thief', 'shaky', 'storeroom', 'borrow', 'brass', 'chin', 'truth', 'nod', 'afraid', 'surprise'],
      vocabExtra: [
        ['shaky', '形', '震えている; 不安定な', 3],
        ['storeroom', '名', '物置; 倉庫', 3],
        ['brass', '名', '真ちゅう; 金管楽器', 3]
      ]
    }
  ]);

  /* ================================================================
   *  問題カード（大問ごとに 1 枚）
   * ================================================================ */
  JK.registerProblems([
    /* ---------- 第1問 ---------- */
    {
      id: 'sk-e-2024-1',
      subject: 'english',
      level: 'mid',
      unit: 'e-reading',
      title: '長文：コンテナが変えた貿易',
      source: src('第1問'),
      time: 22,
      body: R`次の英文は、貨物用コンテナの発明と、それが港や貿易に与えた影響について述べたものです。英文を読み、問1〜問7 と記述式の問に答えなさい。段落は上から順に第1段落〜第9段落と数えます。空所は ( 1 )〜( 5 ) です。

注　dockworker = 港湾労働者　crate = 木箱　tanker = タンカー　deck = 甲板　crane = クレーン　union = 労働組合　strike = ストライキ　harbor = 港
　　Newark = ニューアーク（米国ニュージャージー州の港湾都市）　Houston = ヒューストン（米国テキサス州の港湾都市）`,
      fig: null,
      passage: 'sk-ep-2024-1',
      parts: [
        {
          label: '問1(1)',
          q: R`空所 ( 1 )（第2段落）に入る最も適切な前置詞を選びなさい。問1 の空所 ( 1 )〜( 5 ) では、同じ語は一度しか使いません。`,
          type: 'choice', choices: ['at', 'by', 'for', 'from', 'on'], answer: 1,
          explain: R`**by hand** で「手で、手作業で」です。港湾労働者が荷物を 1 つずつ持ち上げ、「手作業で」船内に積み込んでいた、という昔のようすを表しています。at hand（手近に）や on hand（手元に）では、packed each item into the ship の後ろに続けても意味が通りません。`
        },
        {
          label: '問1(2)',
          q: R`空所 ( 2 )（第4段落）に入る最も適切な前置詞を選びなさい。`,
          type: 'choice', choices: ['at', 'by', 'for', 'from', 'on'], answer: 2,
          explain: R`**leave A for B** で「A を出て B へ向かう」です。for は「〜へ向かって」という行き先を表します。ニューアークを出てヒューストンへ向かった、という航海の説明です。from は出発点を表す語で、出発地 Newark がすでに示されているので入りません。`
        },
        {
          label: '問1(3)',
          q: R`空所 ( 3 )（第5段落）に入る最も適切な前置詞を選びなさい。`,
          type: 'choice', choices: ['at', 'by', 'for', 'from', 'on'], answer: 3,
          explain: R`**from A to B** で「A から B へ」です。コンテナが、船から列車へ、さらにトラックへと受け渡されるようすを表しています（from a ship to a train to a truck）。to と対になる前置詞は from です。`
        },
        {
          label: '問1(4)',
          q: R`空所 ( 4 )（第6段落）に入る最も適切な前置詞を選びなさい。`,
          type: 'choice', choices: ['at', 'by', 'for', 'from', 'on'], answer: 0,
          explain: R`**at sea** で「海上で、航海中で」です。港にいる時間が短く、海の上にいる時間が長いほど、1 年の航海の回数が増える、という内容です。by sea は「海路で」という移動の手段を表す言い方で、「海上にいる時間」を表す more time ( ) sea の形には合いません。`
        },
        {
          label: '問1(5)',
          q: R`空所 ( 5 )（第7段落）に入る最も適切な前置詞を選びなさい。`,
          type: 'choice', choices: ['at', 'by', 'for', 'from', 'on'], answer: 4,
          explain: R`**go on strike** で「ストライキに入る」という決まった言い方です。自分たちの技能が不要になることを恐れた組合が、抗議のためにストライキを行った、という内容です。`
        },
        {
          label: '問2-A',
          q: R`本文の内容と一致するように、次の英文の空所 (2-A) に入る最も適切な語を選びなさい。2-A と 2-B には別々の語が入ります。

Before 1968, boxes made by different companies were ( 2-A ) in size, so they often did not fit one another's trucks and cranes. The international standards made the sizes ( 2-B ) all over the world.`,
          type: 'choice', choices: ['heavy', 'uniform', 'fragile', 'huge', 'different', 'tiny'], answer: 4,
          explain: R`第5段落に、each company built boxes of its own size（各社が独自の大きさの箱を作っていた）とあり、そのため、ある会社の箱が別の会社のトラックやクレーンに合わないことがよくあった、と続きます。1968 年より前の箱は、大きさが会社ごとに**ちがっていた**（different）のです。heavy（重い）と fragile（壊れやすい）は大きさの説明にならず、huge（巨大な）と tiny（とても小さい）も本文には書かれていません。`
        },
        {
          label: '問2-B',
          q: R`同じ英文の空所 (2-B) に入る最も適切な語を選びなさい。

Before 1968, boxes made by different companies were ( 2-A ) in size, so they often did not fit one another's trucks and cranes. The international standards made the sizes ( 2-B ) all over the world.`,
          type: 'choice', choices: ['heavy', 'uniform', 'fragile', 'huge', 'different', 'tiny'], answer: 1,
          explain: R`第5段落に、In 1968, international standards fixed a few common sizes（1968 年に国際規格がいくつかの共通の大きさを定めた）とあります。規格ができたあとの箱は、大きさが**そろった**（uniform）ものになり、世界のどこでも受け渡しができるようになりました。前半の 2-A が different（ちがっている）なので、2-B はその反対の意味の語を選びます。`
        },
        {
          label: '問3',
          q: R`本文の内容と一致するように、次の英文の空所に入る最も適切な語句を選びなさい。

A container ship needed only about (    ) of the time that an old-fashioned cargo ship spent in port.`,
          type: 'choice', choices: ['one fifth', 'one sixth', 'one seventh', 'one tenth'], answer: 2,
          explain: R`第6段落に、昔ながらの貨物船は港に約 1 週間（= 7 日）とどまったが、コンテナ船は約 1 日で荷を降ろして再び積み込めた、とあります。1 日 ÷ 7 日 より、港にいる時間は約 **7 分の 1**（one seventh）になりました。1 週間は 7 日なので、one sixth（6 分の 1）は 6 日で割った場合の値で、合いません。`
        },
        {
          label: '問4',
          q: R`本文の内容と一致するように、次の英文の空所に入る最も適切な語を選びなさい。

At first, dockworkers' unions were against the container, because they were afraid that their skills would become (    ).`,
          type: 'choice', choices: ['dangerous', 'expensive', 'valuable', 'unnecessary'], answer: 3,
          explain: R`第7段落に、組合は their skills would no longer be needed（自分たちの技能がもう必要とされなくなる）ことを恐れた、とあります。これを 1 語で言い換えたのが **unnecessary**（不必要な）です。valuable（価値のある）と expensive（高価な）は反対向きの内容で、dangerous（危険な）は本文に出てきません。`
        },
        {
          label: '問5',
          q: R`本文の内容に基づいて、次の問いに対する正しい答えを選びなさい。

How many years passed between the voyage in which the Ideal X carried the metal boxes and the year in which international standards fixed the sizes of containers?`,
          type: 'choice', choices: ['12 years', '2 years', '8 years', '20 years'], answer: 0,
          explain: R`金属の箱を載せたアイデアル X 号の航海は 1956 年 4 月（第4段落）、国際規格が共通の大きさを定めたのは 1968 年（第5段落）です。1968 − 1956 = **12** なので、12 年です。年の差を問う問題では、本文から 2 つの年号を拾って引き算をします。`
        },
        {
          label: '問6',
          q: R`本文の内容と一致するように、次の英文の空所に入る最も適切な語を選びなさい。

The standard sizes made it possible to (    ) containers easily from one kind of transport to another.`,
          type: 'choice', choices: ['translate', 'transfer', 'transform', 'transmit'], answer: 1,
          explain: R`「ある乗り物から別の乗り物へコンテナを移す」という意味なので **transfer**（〜を移す、乗り換えさせる）が正解です。translate は「〜を翻訳する」、transform は「〜の形や性質を変える」、transmit は「〜（信号・病気など）を伝える」という意味で、コンテナを船から列車へ移す内容には合いません。第5段落の pass from a ship to a train to a truck がヒントです。`
        },
        {
          label: '問7',
          q: R`本文の内容と一致するものを、次の中から 2 つ選びなさい。`,
          type: 'multi',
          choices: [
            R`Dockworkers' unions accepted the container at once, without any protest.`,
            R`The Ideal X was a new ship built specially to carry containers.`,
            R`Before the container appeared, a cargo ship usually stayed in port for about a week.`,
            R`In the early years, a container made by one company could be used by every other company.`,
            R`Container shipping made it profitable to sell products far from where they were made.`,
            R`Old harbors near city centers gained more business after the container appeared.`
          ],
          answer: [2, 4],
          explain: R`正解の 1 つ目は「コンテナが登場する前、貨物船はふつう約 1 週間港にとどまった」です。第2段落と第6段落に、船が約 1 週間港にいた、とあります。2 つ目は「コンテナ輸送のおかげで、作った場所から遠く離れたところで製品を売ることが採算に合うようになった」で、第8段落の内容です。
ほかの選択肢は次の点が誤りです。「組合はすぐに受け入れた」→ ストライキに入った組合もあり、受け入れたのは賃金を守る約束を勝ち取ってからです（第7段落）。「アイデアル X 号は新造船」→ 古い石油タンカーでした（第4段落）。「どの会社の箱でも使えた」→ 初期は別の会社のトラックやクレーンに合わないことがよくありました（第5段落）。「古い港の仕事が増えた」→ 新しい港に仕事を奪われました（第7段落）。`
        },
        {
          label: '記述I-a',
          q: R`本文の内容と一致する英文になるように、空所 ( a ) に入る最も適切な英語 1 語を、本文中から抜き出して答えなさい。

Because ships spent less ( a ) in port, they could make more ( b ) in a year.`,
          type: 'text', answer: 'time', hint: '半角英字で 1 語',
          explain: R`第6段落の A ship that spends less **time** in port can make more trips every year が根拠です。「港で過ごす時間が短いほど、1 年の航海の回数が増える」という因果関係を、Because ships spent less ( a ) in port, they could make more ( b ) in a year と言い換えています。less の後ろには「量」を表す不可算名詞 time が入ります。`
        },
        {
          label: '記述I-b',
          q: R`同じ英文の空所 ( b ) に入る最も適切な英語 1 語を、本文中から抜き出して答えなさい。

Because ships spent less ( a ) in port, they could make more ( b ) in a year.`,
          type: 'text', answer: 'trips', hint: '半角英字で 1 語',
          explain: R`同じ第6段落の can make more **trips** every year が根拠です。make a trip は「（1 回の）航海や旅をする」で、more の後ろなので数えられる名詞の複数形 trips にします。voyage（航海）も近い意味の語ですが、「本文中から抜き出す」指示なので trips と答えます。`
        }
      ],
      solution: [
        {
          t: '全体の流れをつかむ',
          n: R`段落ごとの要旨は次のとおりです。
第1段落: 導入（身の回りの品は鋼鉄の箱で海を渡ってきた）。
第2段落: 昔の積み込み（手作業・約 1 週間・破損や盗難）。
第3段落: マクリーンの発想（荷物を箱ごと移す）。
第4段落: 最初の航海（1956 年 4 月、58 個、費用はごくわずか）。
第5段落: 規格化（各社バラバラ → 1968 年に共通の大きさ）。
第6段落: 速さと費用への効果（約 1 週間 → 約 1 日）。
第7段落: 労働者と港への影響（反発・ストライキ・古い港の衰退）。
第8段落: 世界貿易への影響。
第9段落: まとめ（「空の箱」が全体をかみ合わせた）。`,
          easy: R`「昔のやり方の問題点 → 新しい発想 → うまく広まらなかった理由 → 効果 → 副作用 → 世の中全体への影響」という順に、変化を追って進む文章です。技術の歴史を述べる文章は、このように「before → after」で書かれることが多いので、段落の最初の 1 文だけを拾い読みすると流れが先につかめます。`,
          pro: R`本番の第1問は 800 語前後で、この類題より 3 割ほど長くなります。段落が 9 つ前後に分かれているので、段落番号の横に 3〜4 字のメモを書きながら読むと、内容一致や数値の問題で戻る場所がすぐに見つかります。`
        },
        {
          t: '問1 前置詞は結びつく語で決める',
          n: R`空所の前後の語とのセットで考えます。by hand（手作業で）、leave A **for** B（A を出て B へ向かう）、**from** A to B（A から B へ）、**at** sea（海上で）、go **on** strike（ストライキに入る）。5 つとも熟語や決まった言い方の知識で決まります。`,
          pro: R`「同じ選択肢は 1 回しか使えない」という条件があるときは、確実に決まるもの（from … to、go on strike）から埋め、残りを消去法で確認すると、速く正確に解けます。`
        },
        {
          t: '問2 「前と後」の対比は、反対の意味の語の組を探す',
          n: R`Before 1968, ... ( 2-A ) ... The international standards made the sizes ( 2-B ) という形は、規格ができる前と後が対比になっています。本文で「前」と「後」を分けている箇所（第5段落: 各社が独自の大きさ → 国際規格が共通の大きさ）を探し、それぞれを 1 語に言い換えます。different（ちがっている）⇔ uniform（そろっている）のように、反対の意味の語が対になります。`,
          easy: R`「in size（大きさについて）」と書いてあるので、heavy（重い）や fragile（壊れやすい）のような、大きさと関係のない語は先に消せます。そのうえで、「各社が自分の大きさで作った」＝バラバラ、「共通の大きさを決めた」＝そろった、と日本語で言い換えてから英語の選択肢に戻ります。`
        },
        {
          t: '問3・問5 数値の問題は本文の数字を拾って計算する',
          m: [
            R`\text{問3: }\ \frac{1\ \text{日}}{7\ \text{日}} = \frac{1}{7}`,
            R`\text{問5: }\ 1968 - 1956 = 12\ \text{(年)}`
          ],
          n: R`数値を問う問題は、答えが本文にそのまま書かれていません。問3 は「約 1 週間」と「約 1 日」から、1 週間 = 7 日と換算して比を求めます。問5 は 2 つの年号（1956 年、1968 年）を別々の段落から拾って差を計算します。単位（週と日、年）をそろえてから計算するのがこつです。`,
          pro: R`本番でも、本文の数字をもとに簡単な計算をして答えを選ぶ設問が出ています。英文を読みながら、数字と単位（何が・いつ・いくつ）を余白にメモしておくと、計算にすぐ取りかかれます。`
        },
        {
          t: '問4・問6 語彙は「言い換え」と「語の意味の違い」で決める',
          n: R`問4 は本文の no longer be needed（もう必要とされない）を 1 語にした unnecessary を選ぶ、言い換えの問題です。問6 は trans- で始まる 4 語（translate / transfer / transform / transmit）から、「ある乗り物から別の乗り物へ移す」に合う transfer を選ぶ、語の意味の区別の問題です。`,
          easy: R`trans- は「向こうへ、越えて」という意味の接頭辞です。transfer = trans-（越えて）+ fer（運ぶ）で「別の場所へ運んで移す」、translate は「言語を越えて」＝翻訳、transform は「形（form）を越えて」＝変形、と考えると、意味を覚えやすくなります。`
        },
        {
          t: '問7 内容一致は段落に戻って 1 つずつ照合する',
          n: R`選択肢のキーワード（unions, Ideal X, week, any other company, far from where they were made, old harbors）を本文で探し、その段落の記述と照らし合わせます。誤りの選択肢には、「肯定と否定の入れ替え」（受け入れた・抗議もなかった）、「事実の取り違え」（新造船 → 古いタンカー）、「範囲の拡大」（いつでもどの会社の箱でも使えた）、「結果の逆転」（古い港の仕事が増えた）といった型があります。`
        },
        {
          t: '記述 本文の語を使って言い換える',
          n: R`第6段落の「港にいる時間が短い船は、毎年より多くの航海ができる」を、Because ships spent less ( a ) in port, they could make more ( b ) in a year と書き換えた文です。語形を変えずに本文から名詞を抜き出せば答えられるので、根拠の段落をすばやく見つけて、つづりを正確に書き写すことが大切です。`
        }
      ],
      tags: ['空所補充', '前置詞', '数値の読み取り', '語彙', '内容一致', '経済史']
    },

    /* ---------- 第2問 ---------- */
    {
      id: 'sk-e-2024-2',
      subject: 'english',
      level: 'mid',
      unit: 'e-reading',
      title: '長文：雷のしくみと身の守り方',
      source: src('第2問'),
      time: 18,
      body: R`次の英文は、雷（稲妻と雷鳴）の仕組みと安全についての科学の解説文です。英文を読み、問1〜問3 と記述式の問に答えなさい。段落は上から順に第1段落〜第7段落と数えます。第2〜6段落では、最初の文がその段落の話題を述べています。下線部は (1)(2)(4)(6)(11)、空所は (3)(5)(7)〜(10)(12)(13) です。

注　charge = 電荷　bolt = 稲妻（落雷の 1 本の光）　Celsius = セ氏（摂氏）　lightning rod = 避雷針　myth = 俗説`,
      fig: null,
      passage: 'sk-ep-2024-2',
      parts: [
        {
          label: '問1(1)',
          q: R`下線部 (1) の英単語 electricity（第1段落）で、最も強く発音する音節を選びなさい。

e-lec-tric-i-ty（5 音節）`,
          type: 'choice',
          choices: ['1音節目（e）', '2音節目（lec）', '3音節目（tric）', '4音節目（i）', '5音節目（ty）'],
          answer: 2,
          explain: R`**-ity で終わる語**は、その直前の音節に第 1 アクセントが来ます。electricity は **e-lec-TRIC-i-ty** で、3 音節目の tric を強く読みます。もとの形容詞 electric は e-LEC-tric で 2 音節目が強いので、語尾 -ity が付くとアクセントが 1 つ後ろへ移ります。同じ -ity の語には ability（a-BIL-i-ty）、activity（ac-TIV-i-ty）、possibility（pos-si-BIL-i-ty）があり、いずれも -ity の直前の音節が強くなります。`
        },
        {
          label: '問2(3)',
          q: R`空所 ( 3 )（第2段落）に入る最も適切な前置詞を選びなさい。`,
          type: 'choice', choices: ['with', 'at', 'by', 'on'], answer: 0,
          explain: R`**collide with 〜** で「〜と衝突する」です。氷のかけらや水滴が互いにぶつかり合う、という雷雲の中のようすです。collide は「ぶつかる」という意味の自動詞で、ぶつかる相手を with で表します。at / by / on では「衝突する」の意味になりません。`
        },
        {
          label: '問2(5)',
          q: R`空所 ( 5 )（第3段落）に入る最も適切な前置詞を選びなさい。`,
          type: 'choice', choices: ['at', 'on', 'with', 'into'], answer: 3,
          explain: R`**turn A into B** で「A を B に変える」です。雷の熱が砂を溶かしてガラスに変える、という内容です。into は変化の結果（砂 → ガラス）を表す前置詞で、at / on / with では「変える」の意味になりません。`
        },
        {
          label: '問2(8)',
          q: R`空所 ( 8 )（第4段落）に入る最も適切な前置詞を選びなさい。`,
          type: 'choice', choices: ['by', 'at', 'in', 'with'], answer: 1,
          explain: R`**at 〜 kilometers per second** で「秒速 〜 キロメートルで」です。速さや割合の数値の前には at を使います（at a speed of 〜、at 100 km/h と同じ使い方）。by は「差・手段」、in は「〜かかって」という所要時間を表すので、速さの数値の前には置けません。`
        },
        {
          label: '問2(9)',
          q: R`空所 ( 9 )（第4段落）に入る最も適切な前置詞を選びなさい。`,
          type: 'choice', choices: ['among', 'during', 'between', 'within'], answer: 2,
          explain: R`**between A and B** で「A と B の間」です。閃光と雷鳴という 2 つの出来事のあいだの秒数を数える、という内容です。among は 3 つ以上のものの「あいだ」、during は「〜のあいだずっと」という期間、within は「〜以内に」で、2 つの出来事の間隔を表す文には合いません。`
        },
        {
          label: '問2(10)',
          q: R`空所 ( 10 )（第5段落）に入る最も適切な前置詞を選びなさい。`,
          type: 'choice', choices: ['from', 'for', 'of', 'at'], answer: 0,
          explain: R`**protect A from B** で「A を B から守る」です。避雷針が建物を損害から守る、という内容です。for / of / at では、「守る」対象と脅威（損害）の関係を表せません。同じ形の言い方に keep A from B、save A from B などがあります。`
        },
        {
          label: '問2(12)',
          q: R`空所 ( 12 )（第6段落）に入る最も適切な前置詞を選びなさい。`,
          type: 'choice', choices: ['at', 'in', 'on', 'by'], answer: 3,
          explain: R`**be struck by lightning** で「雷に打たれる」です。受け身の文で、動作をするもの（ここでは雷）を表すには by を使います。at / in / on では「雷に打たれる」という受け身の意味になりません。`
        },
        {
          label: '問2(13)',
          q: R`空所 ( 13 )（第7段落）に入る最も適切な前置詞を選びなさい。`,
          type: 'choice', choices: ['at', 'in', 'for', 'to'], answer: 1,
          explain: R`**be caught in 〜** で「（雨や嵐などに）あう」です。「屋外で嵐にあってしまったら」という意味になります。caught at / for / to という形は使いません。`
        },
        {
          label: '問3(7)',
          q: R`空所 ( 7 )（第4段落の最初の文）に入るように、次の語句を並べかえて、英文を完成させなさい。文頭に来る語は大文字で始めてあります。`,
          type: 'order',
          words: ['more slowly', 'light', 'Sound', 'a million times', 'than', 'nearly', 'travels'],
          answer: 'Sound travels nearly a million times more slowly than light',
          explain: R`**倍数を表す語句 + 比較級 + than 〜** の形で、「〜より…倍…」という意味になります。主語 Sound に動詞 travels を続け、倍数を表す a million times を more slowly（比較級）の前に置き、最後に than light を付けます。nearly（ほぼ）は a million times を修飾するので、その直前に置きます。文頭の語は大文字で始まる Sound なので、「音は光よりゆっくり進む」という内容の文になります。次の文で「光は秒速約 30 万キロメートル、音は同じ時間に約 3 分の 1 キロメートル」と説明されていて、300,000 ÷ (1/3) = 900,000（ほぼ 100 万倍）となり、内容とも合います。`
        },
        {
          label: '記述1a(2)',
          q: R`本文中の下線部 (2) の enormous（第1段落）と同じ意味で使われている語を、enormous 以外で本文中から 1 語抜き出して答えなさい。`,
          type: 'text', answer: 'huge', hint: '半角英字で 1 語',
          explain: R`第2段落の最初の文にある **huge**（巨大な）が、enormous（莫大な、巨大な）と同じ意味で使われています。第1段落の「雷が運ぶエネルギーは莫大だ」と、第2段落の「雷雲は巨大な電池だ」は、どちらも規模の大きさを表す表現です。ほかの形容詞（bright, tiny, strong など）は意味が違います。`
        },
        {
          label: '記述1b(4)',
          q: R`本文中の下線部 (4) の rapidly（第3段落）と同じ意味で使われている語を、rapidly 以外で本文中から 1 語抜き出して答えなさい。`,
          type: 'text', answer: 'quickly', hint: '半角英字で 1 語',
          explain: R`第7段落の move **quickly** to a building の quickly が、rapidly（急速に）と同じ「速く」という意味の副詞です。同義語を探すときは、まず品詞（ここでは副詞）をそろえ、次に文の中でどんな動作を修飾しているかを確認します。`
        },
        {
          label: '記述2(6)',
          q: R`本文中の下線部 (6) の one hundred million（第3段落）を、算用数字で表しなさい。位取りのカンマは付けても付けなくてもかまいません。`,
          type: 'text', answer: ['100000000', '100,000,000'], hint: '半角の算用数字で（例: 2500）',
          explain: R`hundred は 100、million は 100 万（1,000,000）なので、one hundred million は 100 × 1,000,000 = **100,000,000**（日本語の 1 億）です。英語の大きな数は、右から 3 桁ごとに新しい単位名になります。thousand = 1,000（千）、million = 1,000,000（百万）、billion = 1,000,000,000（十億）、trillion = 1,000,000,000,000（一兆）です。日本語は 4 桁ごと（万・億・兆）に区切るので、英語の数をそのまま日本語の位に当てはめると桁をまちがえます。いったん算用数字に直し、右から 3 桁ごとにカンマを打ってから読む習慣をつけましょう。`
        },
        {
          label: '記述3(11)',
          q: R`本文中の下線部 (11) の This idea（第6段落）が指す内容として、最も適切なものを選びなさい。`,
          type: 'choice',
          choices: [
            R`車の金属の車体が、雷の電気を地面へ逃がしてくれるという考え`,
            R`車のゴムのタイヤが、車内の人を雷から守ってくれるという考え`,
            R`雷は、背の高いものに落ちやすいという考え`,
            R`雷が落ちた車の中にいる人は、必ず大けがをするという考え`
          ],
          answer: 1,
          explain: R`This idea は、直前の文の内容を指しています。Many people think that the rubber tires protect those inside a car from lightning（多くの人は、ゴムのタイヤが車内の人を雷から守ってくれると考えている）という「考え」を受けて、「これは俗説（myth）だ」と述べています。第6段落の最初の文にも not because of its tires（タイヤのおかげではない）とあり、実際に車内の人を守っているのは金属の車体です（第6段落の最後の文）。金属の車体が電気を地面へ逃がす、という説明は正しい内容で、this idea が指す「誤った考え」ではありません。`
        }
      ],
      solution: [
        {
          t: '全体の流れをつかむ',
          n: R`段落ごとの要旨は次のとおりです。
第1段落: 導入（雷は電気の火花で、エネルギーは莫大）。
第2段落: 雷雲の中で氷と水滴がぶつかり、電気がたまる。
第3段落: 空気は約 3 万度になり、電圧は約 1 億ボルトに達する。
第4段落: 光と音の速さの違い。秒数を 3 で割ると距離。
第5段落: 避雷針は電気に通り道を与える。
第6段落: 車が安全なのは金属の車体のおかげ。
第7段落: 安全のための行動。`,
          easy: R`このような解説文では、各段落の最初の文が、その段落の話題を一言でまとめています。最初の文だけを先に拾い読みすると、全体のあらすじがつかめます。「雷雲 → 熱 → 光と音 → 避雷針 → 車」のように話題が順に並んでいると気づくと、設問の根拠がどの段落にあるか見当をつけやすくなります。`,
          pro: R`本番の第2問は、見出しのついた 700 語前後の解説文で、この類題より 4 割ほど長くなります。科学の解説文は、本文中の数値（秒数・温度・距離）や、段落ごと（本番では見出し）の最初の文が設問の根拠になることが多いので、数字には線を引き、段落の話題に短いメモをつけながら読むと、設問に答えるときに根拠の位置をすぐ探せます。`
        },
        {
          t: '問1 アクセントは語尾の形で決める',
          n: R`**-ic / -ity / -tion / -sion / -ian** などで終わる語は、その直前の音節にアクセントが来ます。electricity は -ity の直前の tric に、第 1 アクセントが来ます（e-lec-TRIC-i-ty）。語尾で規則的に決まる語は、単語を覚えるときに語尾の形とセットで覚えておくと、アクセント問題で確実に得点できます。`,
          easy: R`「音節」とは、母音を中心とした音のまとまりです。e-lec-tric-i-ty のように、母音ごとにハイフンで区切ると 5 つに分けられます。辞書を引いて発音記号を見る習慣がないと難しい問題なので、新しい単語を覚えるたびに「どこを強く読むか」を声に出して確かめましょう。`
        },
        {
          t: '問2 前置詞は動詞・名詞との結びつきで決める',
          n: R`collide **with** 〜（〜と衝突する）、turn A **into** B（A を B に変える）、**at** 〜 kilometers per second（秒速 〜 キロメートルで）、**between** A and B（A と B の間）、protect A **from** B（A を B から守る）、be struck **by** 〜（〜に打たれる）、be caught **in** 〜（〜にあう）。選択肢の 4 つの前置詞を実際に空所に入れて、文として成り立つものを 1 つ選びます。`,
          pro: R`前置詞の問題は、空所の前後 2〜3 語だけで決まるものが多く、1 問 10〜15 秒で処理できます。ここで時間を稼ぐと、長い英文の内容一致や記述に時間を回せます。`
        },
        {
          t: '問3 整序は倍数表現のかたまりを先に作る',
          n: R`「a million times」（100 万倍）は、比較級の前に置いて「〜倍ほど」を表します。まず Sound travels を文頭に置き、a million times more slowly than light という 1 つの大きなかたまりを作ってから、nearly を a million times の前に差し込みます。語数が多い整序は、文頭の主語と動詞を先に決め、残りのかたまりの順番を、文法の型（倍数 + 比較級 + than）に当てはめると確実です。`,
          easy: R`「A は B の 2 倍の速さだ」は A is twice as fast as B のほかに、A is two times as fast as B とも書けます。倍数を表す語句は、as ... as や比較級の前に置く、という決まりを覚えておきましょう。`
        },
        {
          t: '記述1 同義語は品詞と文の働きをそろえて探す',
          n: R`指定された段落で語の意味と品詞を確認したうえで、本文のほかの部分で同じ内容を別の語で述べている箇所を探します。enormous（形容詞）→ huge（形容詞）、rapidly（副詞）→ quickly（副詞）のように、同じ品詞で、似た文脈（規模の大きさ、動作の速さ）に出てくる語が答えです。`
        },
        {
          t: '記述2 大きな数の英語表記は 3 桁ごとに読む',
          m: R`\text{one hundred million} = 100 \times 1\,000\,000 = 100\,000\,000`,
          n: R`英語の大きな数は、右から 3 桁ごとに thousand（千）、million（百万）、billion（十億）と単位が変わります。one hundred million は「hundred（100）× million（100 万）」なので、100 × 1,000,000 = 100,000,000 です。日本語の「1 億」と同じ大きさです。`,
          easy: R`日本語は 4 桁ごと（万・億・兆）、英語は 3 桁ごと（千・百万・十億）に区切るので、そのまま訳すと桁がずれます。「million は 0 が 6 個」「billion は 0 が 9 個」と、ゼロの個数で覚えるとまちがえません。`
        },
        {
          t: '記述3 指示語は直前の文から探す',
          n: R`This idea（この考え）のように、this + 名詞 の形は、直前の文や 1 つ前の内容を受けています。直前の文 Many people think that 〜 を探し、think の目的語になっている that 以下の内容をまとめれば答えです。「誤った考えを紹介し、それを this idea で受けて『俗説だ』と否定する」のは、説明文でよく使われる展開です。`,
          pro: R`日本語の選択肢では、「正しい説明」と「誤った考え」が両方並びます。指示語の指す内容を問われたら、「筆者がその後で否定している側」か「肯定している側」かを必ず確かめましょう。`
        }
      ],
      tags: ['アクセント', '前置詞', '語句整序', '同義語', '数値表記', '指示語', '科学']
    },

    /* ---------- 第3問 ---------- */
    {
      id: 'sk-e-2024-3',
      subject: 'english',
      level: 'mid',
      unit: 'e-reading',
      title: '長文：消えたバイオリン',
      source: src('第3問'),
      time: 12,
      body: R`次の英文は、中学校の音楽室から古いバイオリンが消えた出来事を、「私」の視点で描いた物語です（人物名・学校は架空のものです）。英文を読み、問1〜問4 と記述式の問に答えなさい。段落は上から順に第1段落〜第7段落と数えます。空所は ( 1 )(2) です。

注　violin = バイオリン　drawer = 引き出し　storeroom = 物置　first-year = 1年生　brass band = 吹奏楽部`,
      fig: null,
      passage: 'sk-ep-2024-3',
      parts: [
        {
          label: '問1',
          q: R`第3段落で、リンは「バイオリンを持ち去ったのは外から来た泥棒ではない」と考えています。その理由として最も適切なものを選びなさい。`,
          type: 'choice',
          choices: [
            R`外から来た泥棒には、このバイオリンの値打ちがわかるはずがないから`,
            R`サトウ先生が、毎日ケースの鍵をかけ忘れてしまう人だったから`,
            R`窓のそばに、割られたガラスの破片がたくさん落ちていたから`,
            R`ケースは壊されておらず、鍵を使って開けられたと考えられるから`
          ],
          answer: 3,
          explain: R`第3段落で、リンは A thief would have broken the glass（泥棒ならガラスを割るはずだ）と言い、続けて Someone opened the case with the key and then put the key back in the drawer（だれかが鍵でケースを開け、鍵を引き出しに戻した）と述べています。第1段落にも、ケースは壊されておらず、鍵は引き出しに残っていた、とあります。そこでリンは、鍵のありかを知っていた学校の人の仕業だ、と推理しました。「窓のそばにガラスの破片」「鍵のかけ忘れ」は本文にありません。`
        },
        {
          label: '問2',
          q: R`ダイチがサトウ先生に頼まずにバイオリンを持ち出した理由として、本文の内容に合うものを選びなさい。`,
          type: 'choice',
          choices: [
            R`初心者の自分が笑われること、先生に断られることを恐れたから`,
            R`古いバイオリンを売って、お金を手に入れたいと考えていたから`,
            R`吹奏楽部をやめて、バイオリンのクラブに入りたいと考えていたから`,
            R`サトウ先生や友達のリンを困らせるための、いたずらをしたかったから`
          ],
          answer: 0,
          explain: R`第5段落で、ダイチは「クラスのみんなは吹奏楽部で、全員が楽譜を読める」「自分はバイオリンに触ったこともない」と話し、I was afraid that they would laugh at me, and that Mr. Sato would say no（みんなに笑われるのが怖かったし、サトウ先生に断られるのも怖かった）と理由を述べています。バイオリンを売るためでも、いたずらのためでもありません。吹奏楽部をやめたいとも言っていません。`
        },
        {
          label: '問3',
          q: R`第6段落で、サトウ先生がダイチの話を聞いて笑顔になったのはなぜですか。本文の内容に合うものを選びなさい。`,
          type: 'choice',
          choices: [
            R`ダイチの言いわけがあまりにおかしくて、思わず笑ってしまったから`,
            R`ダイチがバイオリンを上手に弾いているのを聞いて、感心したから`,
            R`古い楽器は、しまい込むより弾かれるほうがよいと考えていたから`,
            R`ダイチではなく別の生徒が犯人だったことが、はっきりしたから`
          ],
          answer: 2,
          explain: R`第6段落で、先生は I have kept that violin in a glass case for ten years（10 年間ケースにしまい込んできた）と言い、A violin should be played, not just looked at（バイオリンは弾かれるべきで、眺めるだけのものではない）と続けています。古い楽器は弾いてもらうほうがよい、という考えが笑顔の理由です。ダイチは上手には弾けていませんでした（第4段落: the player was not good）。また、バイオリンを持ち出したのはダイチ本人で（第5段落）、先生は話を最後まで聞いたうえで、弾き方を教えると言っています。ダイチの話をおかしがって笑ったわけではありません。`
        },
        {
          label: '問4',
          q: R`本文の内容と一致するものを、次の中から 2 つ選びなさい。`,
          type: 'multi',
          choices: [
            R`The glass case was broken on Monday morning.`,
            R`Rin thought that the person who took the violin knew where the key was.`,
            R`Daichi was playing the violin well when the narrator found him.`,
            R`Daichi had planned to put the violin back on Wednesday.`,
            R`Mr. Sato was very angry and told Daichi to leave the school band.`
          ],
          answer: [1, 3],
          explain: R`正解の 1 つ目は「リンは、バイオリンを持ち出した人は鍵のありかを知っていたと考えた」です。第3段落の So it must be a person from our school, someone who knew where the key was が根拠です。2 つ目は「ダイチは水曜日にバイオリンを戻すつもりだった」で、第5段落の I was going to put it back on Wednesday と一致します。
ほかの選択肢は次の点が誤りです。「ケースが壊されていた」→ 壊されていませんでした（第1段落）。「ダイチは上手に弾いていた」→ 上手ではありませんでした（第4段落）。「先生はひどく怒った」→ 先生は笑顔になり、持ち方を教えると言いました（第6段落）。また、ダイチが吹奏楽部をやめるという話も本文にありません。`
        },
        {
          label: '記述1(1)',
          q: R`空所 ( 1 )（第2段落）に入る名詞は、次の英語の説明に当たる語です。最初の 1 文字で始まる英単語 1 語を、つづりを正確に書きなさい。

( s ... ) = a person who is thought to have done something wrong or illegal`,
          type: 'text', answer: 'suspect', hint: '最初の 1 文字も含めて、単語全体を半角英字で入力',
          explain: R`説明文の a person who is **thought to have done** something wrong（悪いことをしたと考えられている人）から、**suspect**（容疑者、疑わしい人）です。第2段落では、金曜日に最後に音楽室を出た「私」とリンが、まわりから「容疑者であるかのように」見られている気がする、という場面で使われています。suspect は動詞（〜を疑う）としても同じつづりで使われます。`
        },
        {
          label: '記述2(2)',
          q: R`空所 ( 2 )（第5段落）に入る動詞は、次の英語の説明に当たる語です。本文中では過去形が入りますが、**原形**（変化する前の形）で答えなさい。最初の 1 文字で始まる英単語 1 語を書きなさい。

( b ... ) = to take something that belongs to someone else and use it for a short time, planning to give it back`,
          type: 'text', answer: 'borrow', hint: '最初の 1 文字も含めて、単語全体を半角英字で入力（原形）',
          explain: R`説明文の to take something that belongs to someone else（他人のものを取る）、use it for a short time（短い間使う）、planning to give it back（返すつもりで）から、**borrow**（〜を借りる）です。第5段落では borrowed と過去形になっていますが、指示どおり原形で答えます。borrow（無料で借りる）と lend（貸す）は反対の動きなので、区別して覚えましょう。`
        }
      ],
      solution: [
        {
          t: '物語文は「人物・場面・出来事」を整理して読む',
          n: R`この物語は、登場人物（語り手の「私」、友人のリン、音楽の先生のサトウ先生、1 年生のダイチ）と、出来事の順序を押さえると読みやすくなります。第1段落: バイオリンが消える。第2〜3段落: 「私」とリンは疑われている気がして不安になり、リンが「学校の人の仕業」と推理する。第4〜5段落: 「私」が物置でダイチを見つけ、事情を聞く。第6〜7段落: ダイチが先生に打ち明け、先生はバイオリンを弾くことを許す。`,
          easy: R`物語文では、「だれが・どこで・何をしたか」と、登場人物の気持ちの変化に注目します。段落の横に「事件」「推理」「発見」「告白」「解決」とメモを書きながら読むと、あとで設問の根拠を探すときに迷いません。`,
          pro: R`本番の第3問は 650 語前後の物語文で、会話文が多く、登場人物の行動の理由や、出来事の説明を問われる形式が出ています。理由はたいてい、登場人物自身のセリフ（I was afraid that ... など）や、直後の地の文に書かれています。`
        },
        {
          t: '問1 推理の根拠は、直前の段落とセリフから集める',
          n: R`リンの推理は、2 つの事実から成り立っています。① 泥棒ならガラスを割るのに、割られていない（A thief would have broken the glass）。② 鍵が使われて、引き出しに戻されていた（Someone opened the case with the key ...）。この 2 つが「外の人ではなく、鍵のありかを知る学校の人」という結論の根拠です。第1段落の The case was not broken, and the key was still in his desk drawer という描写とも合っています。`
        },
        {
          t: '問2・問3 「なぜ」の問いは、セリフの中の理由を探す',
          n: R`問2 はダイチ自身が I was afraid that 〜 で理由をはっきり述べています。問3 はサトウ先生の A violin should be played, not just looked at という言葉が、笑顔の理由になっています。「なぜ〜したのか」を問われたら、その人物のセリフや、because / so / afraid / want などの理由を表す語の周辺を探します。`,
          easy: R`not A but B や not just A（A だけでなく）は、「本当に言いたいことは後ろにある」というサインです。A violin should be played, not just looked at では、「眺めるだけではなく、弾かれるべきだ」という後半に、先生の本心があります。`
        },
        {
          t: '問4 内容一致は誤りの型を見分ける',
          n: R`選択肢の英文を、本文の該当箇所と 1 つずつ照らし合わせます。誤りの選択肢には、「事実の取り違え」（ケースが壊されていた）、「程度の逆転」（上手に弾いていた）、「人物の反応の取り違え」（先生が怒った）といった型があります。本文にない話（吹奏楽部をやめる）が混ざっているものも、不一致です。`
        },
        {
          t: '記述 英語の説明から単語を書く',
          n: R`英英の説明は「上位の語（どんな種類か）+ 特徴」の形で書かれます。( s ... ) は a **person** who ...（人の一種）、( b ... ) は to **take** something ... and use it ...（動作の一種）なので、それぞれ「人を表す名詞」と「動作を表す動詞」を思い浮かべ、頭文字に合う語を選びます。動詞は原形で答える指示があるので、borrowed ではなく borrow と書きます。`,
          pro: R`本番の第3問でも、英語の説明から単語を書く形式が出題されています。「見たことのある単語を、英語で説明できるか」が問われるので、単語帳の語を「a person who ... / to ... / a place where ...」の形で短く言い換える練習をしておくと、定義文を読む力と語彙力が同時に伸びます。`
        }
      ],
      tags: ['物語文', '推理・理由の把握', '内容一致', '英英定義', '記述']
    }
  ]);
})();
