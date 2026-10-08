/* GOKAKU NAVI — 英語エンジン: 文法パターン（和訳ツールの「文法ポイント」）
   JK.registerGrammar([{ id, name, level, test(c), explain, example: { en, ja } }])
   test に渡す c: { text, low（小文字の語を空白でつないだ文字列。前後に空白つき・短縮形は展開済み）, w（語の配列）, n,
                    sp（構文解析できた文の文型）, names（解析で使った構文名）, has(name), q（疑問文）, ex（感嘆文）,
                    pp(語) ing(語) base(語) past(語) adj(語) noun(語) }
   並び順 = 表示の優先順（特徴的な構文 → 準動詞・関係詞 → 時制・助動詞 → 文型）。 */
(function (g) {
  'use strict';
  const JK = g.JK;

  const set = (s) => { const o = Object.create(null); s.split(' ').forEach((w) => { o[w] = true; }); return o; };
  const BE = set('am is are was were be been being');
  const OBJP = set('me you him her us them it');
  const DETS = set('the a an my your his her its our their this that these those');
  const SKIP = set('not never always already just also still only really ever often usually sometimes now');
  // 語を順に見て、条件に合う位置があるか
  const any = (c, fn) => { for (let i = 0; i < c.w.length; i++) { if (fn(c.w[i], i)) return true; } return false; };
  // i の次の語（not や副詞は読み飛ばす）
  const nextWord = (c, i) => { let k = i + 1; while (k < c.w.length && SKIP[c.w[k]]) k++; return k < c.w.length ? k : -1; };
  const bePP = (c) => any(c, (w, i) => {
    if (!BE[w]) return false;
    const k = nextWord(c, i);
    return k > 0 && c.pp(c.w[k]) && !(c.adj(c.w[k]) && !/ by /.test(c.low)) && c.w[k] !== 'been';
  });
  const beIng = (c) => any(c, (w, i) => {
    if (!BE[w] || w === 'being') return false;
    const k = nextWord(c, i);
    return k > 0 && c.ing(c.w[k]) && c.w[k] !== 'going' && !c.adj(c.w[k]);
  });
  const havePP = (c, forms) => any(c, (w, i) => {
    if (forms.indexOf(w) < 0) return false;
    const k = nextWord(c, i);
    return k > 0 && c.pp(c.w[k]);
  });
  const perfProg = (c) => any(c, (w, i) => /^(?:have|has|had)$/.test(w) && (c.w[i + 1] === 'been' || (SKIP[c.w[i + 1]] && c.w[i + 2] === 'been')) &&
    c.ing(c.w[c.w[i + 1] === 'been' ? i + 2 : i + 3]));
  const SUP_NOT = set('rest west forest test request interest guest contest best');
  const MODALW = set('would could should must may might will shall can cannot to');
  const WHVW = set('know knows knew wonder wonders wondered ask asks asked tell tells told see sure doubt doubts check decide');
  const NOM = set('i you he she we they it there');
  // 従属接続詞として使われているか（前置詞の as / before / after / since、間接疑問の if、as ～ as は除く）
  const subConj = (c) => any(c, (w, i) => {
    const nx = c.w[i + 1], n2 = c.w[i + 2];
    if (!nx || !n2) return false;
    if (/^(?:when|while|because|although|though|unless|until|once|whereas)$/.test(w)) return !(i === 0 && c.q) && !(w === 'when' && i > 0 && WHVW[c.w[i - 1]]);
    if (w === 'if') return !(i > 0 && WHVW[c.w[i - 1]]) && !(i > 1 && WHVW[c.w[i - 2]]) && c.w[i - 1] !== 'as' && c.w[i - 1] !== 'even';
    if (w === 'since' || w === 'before' || w === 'after') return !!NOM[nx];
    if (w === 'as') return !!NOM[nx] && !(i > 1 && c.w[i - 2] === 'as') && c.w[i - 1] !== 'such' && nx !== 'if' && c.w[i - 1] !== 'as';
    return false;
  }) || / (?:as soon as|even if|even though) /.test(c.low);

  JK.registerGrammar([
    /* ---------- 特徴的な構文 ---------- */
    {
      id: 'g-the-more', name: 'the 比較級 ～, the 比較級 …', level: 3,
      test: (c) => c.has('the-more') || /^ the (?:more|less|[a-z]+er) [^,]+ , the (?:more|less|[a-z]+er) /.test(c.low),
      explain: '「～すればするほど、ますます…」。前半が条件、後半が結果を表します。比較級が the とともに文頭に出るのが目印です。',
      example: { en: 'The more you read, the more you learn.', ja: '読めば読むほど、多くのことを学ぶ。' }
    },
    {
      id: 'g-so-that-result', name: 'so ～ that …（結果）', level: 2,
      test: (c) => c.has('so-that') || / so [a-z]+ (?:[a-z]+ ){0,2}that /.test(c.low) || / such (?:a |an )?(?:[a-z]+ ){1,3}that /.test(c.low),
      explain: '「とても～なので…」。so の後ろは形容詞・副詞、such の後ろは名詞を含む語句です。that 以下が結果を表します。',
      example: { en: 'He was so tired that he fell asleep at once.', ja: '彼はとても疲れていたので、すぐに眠ってしまった。' }
    },
    {
      id: 'g-too-to', name: 'too ～ to do', level: 2,
      test: (c) => c.has('too-to') || any(c, (w, i) => w === 'too' && c.w.slice(i + 1, i + 8).some((x, k) => x === 'to' && c.base(c.w[i + 2 + k]))),
      explain: '「～すぎて…できない」。否定語はありませんが、意味は否定になります。for A は不定詞の意味上の主語です。',
      example: { en: 'This box is too heavy for me to carry.', ja: 'この箱は重すぎて私には運べない。' }
    },
    {
      id: 'g-enough-to', name: '～ enough to do', level: 2,
      test: (c) => c.has('enough-to') || / enough (?:for [a-z]+(?: [a-z]+)? )?to [a-z]+/.test(c.low),
      explain: '「…するのに十分～」「…できるほど～」。enough は形容詞・副詞の後ろに置きます。',
      example: { en: 'She is old enough to travel alone.', ja: '彼女は一人で旅行できる年齢だ。' }
    },
    {
      id: 'g-so-that-purpose', name: 'so that ～（目的）', level: 2,
      test: (c) => / so that /.test(c.low),
      explain: '「～するように」「～するために」。後ろの節には can / will / may などがよく使われます。',
      example: { en: 'Speak slowly so that everyone can understand you.', ja: 'みんなが理解できるように、ゆっくり話しなさい。' }
    },
    {
      id: 'g-not-only', name: 'not only A but also B', level: 2,
      test: (c) => c.has('not-only') || / not only .+ but /.test(c.low),
      explain: '「A だけでなく B も」。B のほうに意味の重点があります。主語になるとき、動詞は B に合わせます。',
      example: { en: 'He speaks not only English but also French.', ja: '彼は英語だけでなくフランス語も話す。' }
    },
    {
      id: 'g-correlative', name: '相関接続詞（both A and B / either A or B / neither A nor B）', level: 2,
      test: (c) => / both .+ and /.test(c.low) || / either .+ or /.test(c.low) || / neither .+ nor /.test(c.low),
      explain: 'both A and B「A も B も両方」、either A or B「A か B のどちらか」、neither A nor B「A も B も～ない」。A と B には同じ種類の語句を置きます。',
      example: { en: 'Neither my brother nor I can swim.', ja: '兄も私も泳げない。' }
    },
    {
      id: 'g-not-but', name: 'not A but B', level: 2,
      test: (c) => c.has('not-but') || (/ not [a-z ]{2,40} but /.test(c.low) && !/ not only /.test(c.low) && !/ , but /.test(c.low)),
      explain: '「A ではなく B」。not と but が組になって、取り違えを正す言い方です。',
      example: { en: 'He is not a singer but an actor.', ja: '彼は歌手ではなく俳優だ。' }
    },
    {
      id: 'g-cleft', name: '強調構文（It is ～ that …）', level: 3,
      test: (c) => c.has('cleft'),
      explain: '「…なのは～だ」。強調したい語句を It is と that の間に置きます。It is と that を取り除いても文が成り立つのが、形式主語の文との違いです。',
      example: { en: 'It was Ken that broke the window.', ja: '窓を割ったのはケンだ。' }
    },
    {
      id: 'g-it-takes', name: 'It takes（人）時間 to do', level: 2,
      test: (c) => c.has('it-takes') || / it (?:takes|took|will take|would take) /.test(c.low),
      explain: '「（人が）…するのに（時間）がかかる」。it は形式主語で、to 以下の内容を指します。',
      example: { en: 'It takes me twenty minutes to walk to the station.', ja: '私が駅まで歩くのに 20 分かかる。' }
    },
    {
      id: 'g-it-said', name: 'It is said that ～ / be said to do', level: 3,
      test: (c) => c.has('it-said') || / it (?:is|was) (?:said|believed|thought|known|reported|expected) that /.test(c.low) ||
        / (?:is|are|was|were) (?:said|believed|thought|known|reported|expected) to /.test(c.low),
      explain: '「～だと言われている」。うわさや一般的な見方を表します。S is said to do の形に書き換えられます。',
      example: { en: 'It is said that the temple was built 800 years ago.', ja: 'その寺は 800 年前に建てられたと言われている。' }
    },
    {
      id: 'g-it-to', name: '形式主語 It ～ (for A) to do', level: 2,
      test: (c) => c.has('it-to') || /^ it (?:is|was|will be|would be|may be|has been) (?:not )?(?:[a-z]+ ){1,4}(?:(?:for|of) [a-z]+(?: [a-z]+)? )?to [a-z]+/.test(c.low),
      explain: '長い主語（to 不定詞）を後ろに回し、文頭には形だけの主語 it を置きます。for A は「A が」と訳します。',
      example: { en: 'It is necessary for you to see a doctor.', ja: 'あなたは医者に診てもらう必要がある。' }
    },
    {
      id: 'g-it-that', name: '形式主語 It ～ that …', level: 2,
      test: (c) => !c.has('cleft') && !c.has('it-said') && !/^ it (?:is|was) (?:said|believed|thought|known|reported|expected) that /.test(c.low) &&
        (c.has('it-that') || /^ it (?:is|was|seems|seemed|appears|appeared) (?:not )?(?:[a-z]+ ){0,3}that /.test(c.low)),
      explain: 'that 節が本当の主語です。「…ということは～だ」と、that 以下から訳します。',
      example: { en: 'It is clear that he told a lie.', ja: '彼がうそをついたことは明らかだ。' }
    },
    {
      id: 'g-there', name: 'There is / are 構文', level: 1,
      test: (c) => c.has('there') || /(?:^| , | and | but ) ?there (?:is|are|was|were|will be|has been|have been|must be|may be|might be|seems to be|used to be) /.test(c.low),
      explain: '「～がある・いる」。主語は be 動詞の後ろの名詞で、動詞の形はその名詞に合わせます。相手がまだ知らないものの存在を伝えます。',
      example: { en: 'There are two parks near my house.', ja: '私の家の近くに公園が 2 つある。' }
    },
    {
      id: 'g-inversion', name: '倒置（否定語が文頭）', level: 3,
      test: (c) => c.has('inversion') || /^ (?:never|hardly|scarcely|seldom|rarely|little|nor|not only|not until [a-z ]+|no sooner|only [a-z]+(?: [a-z]+)?) (?:have|has|had|do|does|did|is|are|was|were|can|could|will|would|should) /.test(c.low),
      explain: '否定の意味の語句が文頭に出ると、その後ろは疑問文と同じ語順（助動詞 + 主語）になります。否定を強める書き言葉の表現です。',
      example: { en: 'Never have I seen such a beautiful sunset.', ja: 'これほど美しい夕日は一度も見たことがない。' }
    },
    {
      id: 'g-inversion-loc', name: '倒置（場所・補語が文頭）', level: 3,
      test: (c) => c.has('inversion-loc'),
      explain: '場所を表す句や分詞・補語を文頭に出すと、主語と動詞の順番が入れ替わります（副詞句 + 動詞 + 主語）。新しい情報である主語を文末に置いて目立たせる書き方です。',
      example: { en: 'Behind the house lies a small garden.', ja: '家の裏には小さな庭がある。' }
    },
    {
      id: 'g-absolute', name: '独立分詞構文・付帯状況（, 名詞 + 句）', level: 3,
      test: (c) => c.has('absolute'),
      explain: '主節のあとにコンマで「名詞 + 分詞・形容詞・前置詞句」を添えて、「…で、〜は…」と補足します。many of them / one of which のように主節の名詞を受ける形がよく使われます。',
      example: { en: 'The room was full of students, most of them from Asia.', ja: '部屋は学生でいっぱいで、そのほとんどはアジアからの学生だった。' }
    },
    {
      id: 'g-subj-pp', name: '仮定法過去完了', level: 3,
      test: (c) => c.has('subjunctive-pp') || / if [^,]* had (?:not )?[a-z]+ .*(?:would|could|might) (?:not )?have /.test(c.low) ||
        /(?:would|could|might) (?:not )?have [a-z]+ .* if [^,]* had /.test(c.low),
      explain: '過去の事実に反する仮定。「もし（あのとき）～だったら、…だっただろうに」。If S had 過去分詞, S would have 過去分詞 の形です。',
      example: { en: 'If I had left earlier, I would have caught the train.', ja: 'もっと早く出ていたら、電車に間に合っただろうに。' }
    },
    {
      id: 'g-subj-past', name: '仮定法過去', level: 2,
      test: (c) => c.has('subjunctive-past') || (/ if /.test(c.low) && / (?:would|could|might) (?:not )?(?!have )[a-z]+/.test(c.low) &&
        (/ if [a-z ]*(?:were|had|could|knew|did) /.test(c.low) || any(c, (w, i) => i > 0 && c.past(w) && c.w.slice(0, i).indexOf('if') >= 0))),
      explain: '現在の事実に反する仮定。「もし（今）～なら、…だろうに」。if 節は過去形、主節は would / could + 動詞の原形です。be 動詞は were を使います。',
      example: { en: 'If I had a car, I could drive you home.', ja: '車があれば、家まで送ってあげられるのに。' }
    },
    {
      id: 'g-wish', name: 'I wish / as if + 仮定法', level: 3,
      test: (c) => c.has('wish') || / wish(?:es|ed)? (?:that )?(?:i|you|he|she|we|they|it) (?:were|had|could|would|did)/.test(c.low) || / as (?:if|though) /.test(c.low),
      explain: 'I wish + 過去形「～ならいいのに」（かなわない願い）、as if + 過去形「まるで～であるかのように」。事実と違うことを過去形で表します。',
      example: { en: 'I wish I could play the guitar.', ja: 'ギターが弾けたらいいのに。' }
    },
    {
      id: 'g-without', name: 'without / but for（仮定法）', level: 3,
      test: (c) => / (?:without|but for) [a-z ]+ , [a-z ]*(?:would|could|might) /.test(c.low) || / (?:would|could|might) (?:not )?(?:have )?[a-z]+ [a-z ]*without /.test(c.low),
      explain: '「～がなければ…だろう」。if 節の代わりに without / but for が条件を表します。主節が would have 過去分詞 なら過去の仮定です。',
      example: { en: 'Without your help, I could not finish the work.', ja: 'あなたの助けがなければ、その仕事を終えられないだろう。' }
    },
    {
      id: 'g-subj-present', name: '仮定法現在（要求・提案の that 節）', level: 3,
      test: (c) => / (?:suggest|suggests|suggested|demand|demands|demanded|insist|insists|insisted|recommend|recommends|recommended|propose|proposed|require|requires|required|request|requested) that /.test(c.low),
      explain: '要求・提案・主張を表す動詞に続く that 節では、動詞を原形（または should + 原形）にします。主語が三人称単数でも -s を付けません。',
      example: { en: 'The doctor suggested that he take a rest.', ja: '医者は彼に休むように勧めた。' }
    },
    {
      id: 'g-multiple', name: '倍数表現（twice as ～ as / three times 比較級）', level: 2,
      test: (c) => / (?:twice|half|[a-z]+ times) as [a-z]+ as /.test(c.low) || / (?:twice|[a-z0-9,]+ times) (?:more|less|[a-z]+er) /.test(c.low),
      explain: '「…の～倍」。倍数を表す語（twice, three times, half など）を as ～ as の前に置きます。five times hotter than ～ のように比較級の前に置く言い方もあります。',
      example: { en: 'This room is twice as large as mine.', ja: 'この部屋は私の部屋の 2 倍の広さだ。' }
    },
    {
      id: 'g-as-as', name: '原級比較（as ～ as）', level: 1,
      test: (c) => c.has('as-as') || (/ as [a-z]+ as /.test(c.low) && !/ as (?:soon|well|long|far|much|many) as /.test(c.low)),
      explain: '「…と同じくらい～」。否定文 not as ～ as は「…ほど～ではない」という意味になります。',
      example: { en: 'This bag is as heavy as that one.', ja: 'このかばんはあのかばんと同じくらい重い。' }
    },
    {
      id: 'g-superlative', name: '最上級', level: 1,
      test: (c) => c.has('superlative') || / the (?:most|least) [a-z]+/.test(c.low) ||
        any(c, (w, i) => i > 0 && c.w[i - 1] === 'the' && /est$/.test(w) && !SUP_NOT[w] && c.adj(w)) || / the (?:best|worst) /.test(c.low),
      explain: '「（…の中で）最も～」。the + 最上級。範囲は in + 場所・集団、of + 複数のもの で表します。',
      example: { en: 'This is the oldest temple in the city.', ja: 'これは市内で最も古い寺だ。' }
    },
    {
      id: 'g-comparative', name: '比較級（-er than / more ～ than）', level: 1,
      test: (c) => c.has('comparative') || / (?:more|less) [a-z]+ than /.test(c.low) || / [a-z]+er than /.test(c.low) || / (?:better|worse|more|less) than /.test(c.low),
      explain: '「…よりも～」。差を強めるときは much / far を比較級の前に置きます（very は使えません）。',
      example: { en: 'This question is much easier than the last one.', ja: 'この問題は前の問題よりずっと簡単だ。' }
    },

    /* ---------- 関係詞・節 ---------- */
    {
      id: 'g-rel-what', name: '関係代名詞 what', level: 2,
      test: (c) => c.has('relative-what') || (!c.q && / what (?:i|you|he|she|we|they|it|the [a-z]+|people|is|was) /.test(c.low) && !/^ what /.test(c.low) === false) ||
        (!c.q && /^ what (?:i|you|he|she|we|they|it) [a-z]+ .*(?:is|was) /.test(c.low)),
      explain: '「～すること・もの」。先行詞を含む関係代名詞で、the thing(s) which に置き換えられます。what 節は名詞の働きをします。',
      example: { en: 'What he said surprised everyone.', ja: '彼が言ったことはみんなを驚かせた。' }
    },
    {
      id: 'g-rel-nonrestrictive', name: '関係詞の非制限用法（, which / , who）', level: 3,
      test: (c) => / , (?:which|who|whose|whom|where|when) /.test(c.low),
      explain: 'コンマの後ろの関係詞は、先行詞に説明を付け足します。「…で、それは～」のように前から訳します。which は前の文全体を指すこともあります。',
      example: { en: 'She lent me a book, which I read in a day.', ja: '彼女は本を貸してくれて、私はそれを 1 日で読んだ。' }
    },
    {
      id: 'g-rel-prep', name: '前置詞 + 関係代名詞', level: 3,
      test: (c) => / (?:in|on|at|to|for|with|from|by|of|about|through|during) (?:which|whom) /.test(c.low),
      explain: '関係詞節の中の前置詞が、関係代名詞の前に出た形です。in which は where、on which は when に置き換えられることがあります。',
      example: { en: 'This is the town in which I grew up.', ja: 'ここは私が育った町だ。' }
    },
    {
      id: 'g-rel-adv', name: '関係副詞（where / when / why / how）', level: 2,
      test: (c) => c.has('rel-adv') || / (?:place|house|town|city|country|village|room|school|shop|park|day|time|year|week|month|moment|age|reason|way|case|situation) (?:where|when|why) /.test(c.low),
      explain: '場所は where、時は when、理由は why で先行詞を説明します。関係副詞の後ろには、欠けた要素のない完全な文が続きます。',
      example: { en: 'I remember the day when we first met.', ja: '私たちが初めて会った日を覚えている。' }
    },
    {
      id: 'g-rel-compound', name: '複合関係詞・no matter ～', level: 3,
      test: (c) => c.has('concession') || / (?:whatever|whoever|whichever|whenever|wherever) /.test(c.low) || /(?:^| , )however [a-z]+ (?:i|you|he|she|we|they|it|the) /.test(c.low) ||
        / no matter (?:what|who|which|when|where|how) /.test(c.low),
      explain: 'whatever「～するものは何でも／何を～しても」、whenever「～するときはいつでも」、however + 形容詞「どんなに～でも」。no matter + 疑問詞 でも言い換えられます。',
      example: { en: 'Whatever happens, I will support you.', ja: '何が起きても、私はあなたを支える。' }
    },
    {
      id: 'g-relative', name: '関係代名詞（who / which / that / whose）', level: 1,
      test: (c) => c.has('relative') || (!/^ (?:who|which|whose|whom) /.test(c.low) && / [a-z]+ (?:who|whom|whose|which) [a-z]+/.test(c.low) && !/ , (?:which|who) /.test(c.low)),
      explain: '関係代名詞の節は、直前の名詞（先行詞）を後ろから説明します。人には who、物には which、どちらにも that が使えます。目的格は省略できます。',
      example: { en: 'The girl who is singing on the stage is my sister.', ja: '舞台で歌っている少女は私の妹だ。' }
    },
    {
      id: 'g-appositive', name: '同格の that', level: 3,
      test: (c) => c.has('appositive') || / (?:fact|idea|news|belief|hope|possibility|evidence|rumor|opinion|claim|conclusion|feeling|impression) that /.test(c.low),
      explain: '「～という（事実・考え）」。that 節が直前の名詞の内容を説明します。関係代名詞と違い、that の後ろは完全な文です。',
      example: { en: 'I was surprised at the news that he had won the prize.', ja: '彼が賞を取ったという知らせに驚いた。' }
    },
    {
      id: 'g-apposition', name: '同格（名詞, 名詞）', level: 2,
      test: (c) => c.has('apposition'),
      explain: '名詞のすぐあとにコンマで区切って別の名詞を置くと、「～である…」「…という～」と前の名詞を言い換えて説明できます。固有名詞と、その説明を並べる形が多いです。',
      example: { en: 'Mr. Tanaka, our English teacher, is from Osaka.', ja: '私たちの英語の先生である田中先生は大阪出身だ。' }
    },
    {
      id: 'g-direct-speech', name: '直接話法（"…" と言う）', level: 1,
      test: (c) => c.has('direct-speech'),
      explain: '発言をそのまま引用符でくくって伝える形です。"…," he said. のように発言を先に出すことも、"…," said Tom. のように主語と動詞を入れ替えることもあります。訳すときは「…」と～は言った、とします。',
      example: { en: '"I will be back soon," she said.', ja: '「すぐに戻ります」と彼女は言った。' }
    },
    {
      id: 'g-indirect-q', name: '間接疑問', level: 2,
      test: (c) => c.has('indirect-q') ||
        / (?:know|knows|knew|wonder|wonders|wondered|ask|asks|asked|tell|tells|told|understand|understood|remember|remembered|decide|decided|explain|explained|see|show|shows|showed|learn|learned|sure|idea|matter) (?:me |us |him |her |them |you )?(?:what|who|which|where|when|why|how|whether|if) [a-z]+/.test(c.low),
      explain: '疑問文が文の一部（名詞節）になった形です。語順は 疑問詞 + 主語 + 動詞 になり、do / does / did は使いません。',
      example: { en: 'Do you know where she lives?', ja: '彼女がどこに住んでいるか知っていますか。' }
    },
    {
      id: 'g-that-clause', name: '接続詞 that（名詞節）', level: 1,
      test: (c) => c.has('that-clause') ||
        / (?:think|thinks|thought|believe|believes|believed|know|knows|knew|say|says|said|hope|hopes|hoped|find|finds|found|feel|feels|felt|show|shows|showed|suggest|suggests|explain|realize|realized|understand|understood|mean|means|sure|afraid|glad) that /.test(c.low),
      explain: '「～ということ」。that 節が動詞の目的語になります。この that はよく省略されます。主節が過去形のとき、that 節の動詞も過去形にそろえます（時制の一致）。',
      example: { en: 'I think that this plan is the best.', ja: 'この計画が一番よいと思う。' }
    },
    {
      id: 'g-conj-sub', name: '従属接続詞（時・理由・条件・譲歩）', level: 1,
      test: (c) => subConj(c) && !c.has('subjunctive-past') && !c.has('subjunctive-pp') && !c.has('the-more'),
      explain: 'when「～するとき」、because「～なので」、if「もし～なら」、although「～だけれども」など。時や条件を表す節の中では、未来のことも現在形で表します。',
      example: { en: 'Although it was cold, we went for a walk.', ja: '寒かったけれども、私たちは散歩に出かけた。' }
    },

    /* ---------- 準動詞（不定詞・動名詞・分詞） ---------- */
    {
      id: 'g-causative', name: '使役動詞（make / let / have + 目的語 + 原形）', level: 2,
      test: (c) => !/^ let us /.test(c.low) && (c.has('causative') || any(c, (w, i) => /^(?:make|makes|made|making|let|lets|letting|have|has|had|help|helps|helped)$/.test(w) && OBJP[c.w[i + 1]] && i + 2 < c.n && c.base(c.w[i + 2]) && !c.noun(c.w[i + 2]))),
      explain: 'make「（強制的に）～させる」、let「（望みどおり）～させてやる」、have「～してもらう」。目的語の後ろは to のない原形不定詞です。',
      example: { en: 'The teacher made us write the sentence again.', ja: '先生は私たちにその文をもう一度書かせた。' }
    },
    {
      id: 'g-perception', name: '知覚動詞（see / hear + 目的語 + 原形・-ing）', level: 2,
      test: (c) => c.has('perception') || any(c, (w, i) => /^(?:see|sees|saw|seen|hear|hears|heard|watch|watches|watched|feel|feels|felt|notice|noticed)$/.test(w) && OBJP[c.w[i + 1]] && i + 2 < c.n && (c.ing(c.w[i + 2]) || (c.base(c.w[i + 2]) && !c.noun(c.w[i + 2])))),
      explain: '「目的語が～するのを見る・聞く」。原形なら動作の全体、-ing 形なら動作の途中を見たり聞いたりしたことを表します。',
      example: { en: 'I heard someone call my name.', ja: '誰かが私の名前を呼ぶのが聞こえた。' }
    },
    {
      id: 'g-have-pp', name: 'have / get + 目的語 + 過去分詞', level: 3,
      test: (c) => c.has('have-pp') || any(c, (w, i) => /^(?:have|has|had|having|get|gets|got|getting)$/.test(w) && DETS[c.w[i + 1]] && i + 3 < c.n + 1 && c.noun(c.w[i + 2]) && c.w[i + 3] !== undefined && c.pp(c.w[i + 3]) && !c.noun(c.w[i + 3])),
      explain: '「目的語を～してもらう」（依頼）または「～される」（被害）。目的語と過去分詞の間に「～される」という受け身の関係があります。',
      example: { en: 'I had my bicycle repaired yesterday.', ja: '昨日、自転車を修理してもらった。' }
    },
    {
      id: 'g-v-o-to', name: '動詞 + 目的語 + to do', level: 2,
      test: (c) => c.has('v-o-to') || (!c.has('inf-adj') && / (?:want|wants|wanted|tell|tells|told|ask|asks|asked|allow|allows|allowed|enable|enables|enabled|expect|expects|expected|advise|advised|encourage|encouraged|force|forced|order|ordered|persuade|persuaded|teach|taught|cause|caused|require|required) (?!something|anything|nothing)(?:me|you|him|her|us|them|it|(?!how |what |where |when |which |who |why )[a-z]+(?: (?!how |what |where |when |which |who |why )[a-z]+)?) (?:not )?to [a-z]+/.test(c.low)),
      explain: '「目的語に～してほしい／～するように言う・頼む」。目的語が to 不定詞の意味上の主語になります。否定は not to do です。',
      example: { en: 'My parents want me to study abroad.', ja: '両親は私に留学してほしいと思っている。' }
    },
    {
      id: 'g-wh-to', name: '疑問詞 + to do', level: 2,
      test: (c) => any(c, (w, i) => /^(?:how|what|where|when|which)$/.test(w) && c.w[i + 1] === 'to' && c.base(c.w[i + 2])),
      explain: 'how to do「～の仕方」、what to do「何を～すべきか」、where to do「どこで～すべきか」。全体で名詞の働きをします。',
      example: { en: 'Please tell me how to use this machine.', ja: 'この機械の使い方を教えてください。' }
    },
    {
      id: 'g-seem-to', name: 'seem to do / appear to do', level: 2,
      test: (c) => / (?:seem|seems|seemed|appear|appears|appeared) (?:not )?to [a-z]+/.test(c.low),
      explain: '「～するようだ」「～らしい」。It seems that S V の形に書き換えられます。to have 過去分詞 なら「～したようだ」です。',
      example: { en: 'He seems to know the answer.', ja: '彼は答えを知っているようだ。' }
    },
    {
      id: 'g-inf-adj', name: '不定詞の形容詞的用法', level: 1,
      test: (c) => c.has('inf-adj') || any(c, (w, i) => /^(?:something|anything|nothing|someone|anyone|time|way|chance|right|ability|plan|place|money|homework|work|things|thing|opportunity|reason|effort|decision)$/.test(w) && c.w[i + 1] === 'to' && c.base(c.w[i + 2])),
      explain: '「～するための…」「～すべき…」。to 不定詞が直前の名詞を後ろから説明します。',
      example: { en: 'I have a lot of homework to do today.', ja: '今日はやるべき宿題がたくさんある。' }
    },
    {
      id: 'g-inf-adv', name: '不定詞の副詞的用法（目的・感情の原因）', level: 1,
      test: (c) => c.has('inf-adv') || c.has('tough') || / (?:in order|so as) to /.test(c.low) || / (?:glad|happy|sorry|sad|surprised|pleased|excited|disappointed) to [a-z]+/.test(c.low) || /^ to [a-z]+ [^,]+ , /.test(c.low),
      explain: '目的「～するために」（in order to で意味をはっきりさせられます）、感情の原因「～して（うれしい・驚く）」などを表します。',
      example: { en: 'She went to the library to borrow some books.', ja: '彼女は本を借りるために図書館へ行った。' }
    },
    {
      id: 'g-inf-noun', name: '不定詞の名詞的用法', level: 1,
      test: (c) => c.has('inf-noun') || /^ to [a-z]+ .* (?:is|was) /.test(c.low) ||
        / (?:want|wants|wanted|hope|hopes|hoped|decide|decides|decided|like|likes|liked|need|needs|needed|try|tries|tried|plan|plans|planned|begin|begins|began|start|starts|started|learn|learns|learned|promise|promised|refuse|refused|wish|agree|agreed) (?:not )?to [a-z]+/.test(c.low),
      explain: '「～すること」。to 不定詞が主語・目的語・補語になります。want / hope / decide などは、目的語に to 不定詞をとります。',
      example: { en: 'I decided to join the tennis club.', ja: '私はテニス部に入ることに決めた。' }
    },
    {
      id: 'g-be-to', name: 'be to 不定詞', level: 3,
      test: (c) => any(c, (w, i) => /^(?:am|is|are|was|were)$/.test(w) && c.w[i + 1] === 'to' && c.base(c.w[i + 2]) && i > 0 && !/^(?:it|this|that|what|aim|goal|purpose|plan|dream|job)$/.test(c.w[i - 1])),
      explain: '予定「～することになっている」、義務「～すべきだ」、可能「～できる」などを表す、かたい言い方です。',
      example: { en: 'The meeting is to begin at ten.', ja: '会議は 10 時に始まることになっている。' }
    },
    {
      id: 'g-participle-const', name: '分詞構文', level: 3,
      test: (c) => c.has('participle-const') || (any(c, (w, i) => i === 0 && c.ing(w) && !c.noun(w) && !/^(?:according|including|regarding|concerning|during)$/.test(w)) && /^ [a-z]+ [^,]* , (?:i|you|he|she|we|they|it|the|a|an|my|his|her|their|our|[a-z]+) /.test(c.low)) ||
        / , (?:[a-z]+ing) [a-z ]+ $/.test(c.low.replace(/[.!?] $/, ' ')),
      explain: '分詞で始まる句が「～しながら」「～するとき」「～なので」などの意味を表します。接続詞と主語を省いた形で、意味は文脈から判断します。',
      example: { en: 'Walking in the park, I found a wallet.', ja: '公園を歩いているとき、財布を見つけた。' }
    },
    {
      id: 'g-with-oc', name: '付帯状況の with', level: 3,
      test: (c) => c.has('with-oc') || / with (?:his|her|my|your|their|its|the|a) [a-z]+ (?:closed|open|crossed|folded|turned|on|off|[a-z]+ing) /.test(c.low),
      explain: 'with + 名詞 + 分詞・形容詞「（名詞）を～の状態にして」。主な動作と同時の状況を付け加えます。',
      example: { en: 'He sat with his eyes closed.', ja: '彼は目を閉じて座っていた。' }
    },
    {
      id: 'g-participle-mod', name: '分詞の後置修飾', level: 2,
      test: (c) => c.has('participle-mod'),
      explain: '現在分詞（-ing）は「～している…」、過去分詞は「～された…」の意味で、名詞を後ろから説明します。分詞に語句が付くと名詞の後ろに置かれます。',
      example: { en: 'The language spoken in Brazil is Portuguese.', ja: 'ブラジルで話されている言語はポルトガル語だ。' }
    },
    {
      id: 'g-gerund', name: '動名詞', level: 1,
      test: (c) => c.has('gerund') || any(c, (w, i) => /^(?:enjoy|enjoys|enjoyed|finish|finishes|finished|stop|stops|stopped|keep|keeps|kept|mind|avoid|avoided|practice|practiced|by|without|of|about|after|before|at|in)$/.test(w) && i + 1 < c.n && c.ing(c.w[i + 1]) && !c.adj(c.w[i + 1])) ||
        (c.n > 2 && c.ing(c.w[0]) && !c.adj(c.w[0]) && any(c, (w, i) => i > 0 && i < 6 && (w === 'is' || w === 'was'))),
      explain: '「～すること」。動詞の -ing 形が名詞の働きをします。enjoy / finish / stop などの目的語や、前置詞の後ろでは、to 不定詞ではなく動名詞を使います。',
      example: { en: 'He finished writing the report before noon.', ja: '彼は正午前に報告書を書き終えた。' }
    },

    /* ---------- 態・時制・助動詞 ---------- */
    {
      id: 'g-modal-perfect', name: '助動詞 + have + 過去分詞', level: 3,
      test: (c) => c.has('modal-perfect') || any(c, (w, i) => /^(?:must|may|might|should|could|would|cannot|can)$/.test(w) && (c.w[i + 1] === 'have' || (c.w[i + 1] === 'not' && c.w[i + 2] === 'have'))),
      explain: '過去のことへの推量や後悔を表します。must have done「～したに違いない」、may have done「～したかもしれない」、should have done「～すべきだったのに」。',
      example: { en: 'You should have told me the truth.', ja: 'あなたは本当のことを私に話すべきだったのに。' }
    },
    {
      id: 'g-perfect-prog', name: '完了進行形', level: 2,
      test: (c) => perfProg(c),
      explain: 'have been -ing「（今まで）ずっと～し続けている」。動作が過去から現在まで続いていることを表します。',
      example: { en: 'It has been raining since this morning.', ja: '今朝からずっと雨が降っている。' }
    },
    {
      id: 'g-past-perfect', name: '過去完了', level: 2,
      test: (c) => !c.has('subjunctive-pp') && !c.has('have-pp') && (c.has('pastperfect') || (havePP(c, ['had']) && !/ if [^,]* had /.test(c.low))),
      explain: 'had + 過去分詞。過去のある時点までの完了・経験・継続、または「それより前に起きたこと」（大過去）を表します。',
      example: { en: 'The train had already left when I got to the station.', ja: '私が駅に着いたとき、電車はすでに出発していた。' }
    },
    {
      id: 'g-perfect', name: '現在完了', level: 1,
      test: (c) => !perfProg(c) && (c.has('perfect') || any(c, (w, i) => {
        if ((w !== 'have' && w !== 'has') || (i > 0 && (MODALW[c.w[i - 1]] || (c.w[i - 1] === 'not' && i > 1 && MODALW[c.w[i - 2]])))) return false;
        const k = nextWord(c, i);
        return k > 0 && c.pp(c.w[k]) && !c.has('have-pp');
      })),
      explain: 'have / has + 過去分詞。完了「～したところだ」、経験「～したことがある」、継続「ずっと～している」を表します。過去を表す語句（yesterday など）とは一緒に使えません。',
      example: { en: 'I have visited Kyoto three times.', ja: '私は京都を 3 回訪れたことがある。' }
    },
    {
      id: 'g-passive', name: '受動態', level: 1,
      test: (c) => c.has('passive') || bePP(c),
      explain: 'be 動詞 + 過去分詞「～される」。動作をする人は by ～ で表しますが、言う必要がなければ省略します。助動詞があれば 助動詞 + be + 過去分詞 です。',
      example: { en: 'This bridge was built fifty years ago.', ja: 'この橋は 50 年前に建設された。' }
    },
    {
      id: 'g-progressive', name: '進行形', level: 1,
      test: (c) => !perfProg(c) && (c.has('progressive') || beIng(c)),
      explain: 'be 動詞 + -ing「～している（ところだ）」。know や like のような状態を表す動詞は、ふつう進行形にしません。',
      example: { en: 'They were playing soccer in the park.', ja: '彼らは公園でサッカーをしていた。' }
    },
    {
      id: 'g-used-to', name: 'used to do（過去の習慣・状態）', level: 2,
      test: (c) => c.has('used-to') || any(c, (w, i) => w === 'used' && c.w[i + 1] === 'to' && c.base(c.w[i + 2]) && !(i > 0 && BE[c.w[i - 1]])),
      explain: '「以前はよく～した」「以前は～だった」。今はそうではないことを含みます。be used to -ing「～に慣れている」と区別します。',
      example: { en: 'My father used to play baseball.', ja: '父は以前、野球をしていた。' }
    },
    {
      id: 'g-future', name: '未来表現（will / be going to）', level: 1,
      test: (c) => c.has('be-going-to') || / (?:will|shall) (?:not )?[a-z]+/.test(c.low) || / (?:am|is|are|was|were) (?:not )?going to [a-z]+/.test(c.low),
      explain: 'will はその場で決めたことや予測、be going to は前から決めていた予定や、兆候にもとづく予測を表します。',
      example: { en: 'I am going to visit my grandmother this weekend.', ja: '今週末、祖母を訪ねるつもりだ。' }
    },
    {
      id: 'g-must', name: '助動詞 must / have to', level: 1,
      test: (c) => / must (?:not )?[a-z]+/.test(c.low) || / (?:have|has|had) to [a-z]+/.test(c.low),
      explain: 'must / have to「～しなければならない」。must には「～に違いない」の意味もあります。否定は must not「～してはいけない」、don\'t have to「～する必要はない」で意味が違います。',
      example: { en: 'You do not have to hurry.', ja: '急ぐ必要はない。' }
    },
    {
      id: 'g-should', name: '助動詞 should / ought to / had better', level: 1,
      test: (c) => / should (?:not )?[a-z]+/.test(c.low) || / ought to /.test(c.low) || / had better /.test(c.low),
      explain: 'should / ought to「～すべきだ」「～のはずだ」、had better「～したほうがよい」（強い忠告）。had better の否定は had better not です。',
      example: { en: 'You had better see a doctor.', ja: '医者に診てもらったほうがよい。' }
    },
    {
      id: 'g-may', name: '助動詞 may / might', level: 1,
      test: (c) => / (?:may|might) (?:not )?[a-z]+/.test(c.low),
      explain: 'may「～かもしれない」（推量）、「～してもよい」（許可）。might は may より可能性が低い言い方です。',
      example: { en: 'It may snow tonight.', ja: '今夜は雪が降るかもしれない。' }
    },
    {
      id: 'g-can', name: '助動詞 can / could / be able to', level: 1,
      test: (c) => / (?:can|could|cannot) (?:not )?[a-z]+/.test(c.low) || / (?:am|is|are|was|were|be|been) able to /.test(c.low),
      explain: 'can「～できる」（能力）、「～しうる」（可能性）、「～してもよい」（許可）。ほかの助動詞の後ろでは be able to を使います（will be able to）。',
      example: { en: 'She can speak three languages.', ja: '彼女は 3 つの言語を話すことができる。' }
    },

    /* ---------- 否定・疑問・命令 ---------- */
    {
      id: 'g-partial-neg', name: '部分否定', level: 2,
      test: (c) => c.has('partial-neg') || / not (?:all|every|always|necessarily|both|quite|entirely|completely|everyone|everything) /.test(c.low) || / (?:all|every|both) [a-z ]{0,30} not /.test(c.low),
      explain: 'not + all / every / always など「すべてが～というわけではない」「いつも～とは限らない」。全部を否定する全否定（none, never など）と区別します。',
      example: { en: 'Not all students like sports.', ja: 'すべての生徒がスポーツを好きなわけではない。' }
    },
    {
      id: 'g-tag-q', name: '付加疑問', level: 1,
      test: (c) => c.has('tag-question') || (c.q && / , (?:is|are|was|were|do|does|did|have|has|had|can|could|will|would|should) (?:not )?(?:i|you|he|she|it|we|they|there) \? ?$/.test(c.low)),
      explain: '「～ですね」と確認したり同意を求めたりします。肯定文には否定の形、否定文には肯定の形を付けます。',
      example: { en: 'You are from Osaka, aren\'t you?', ja: 'あなたは大阪の出身ですよね。' }
    },
    {
      id: 'g-exclamation', name: '感嘆文', level: 1,
      test: (c) => c.has('exclamation') || (c.ex && /^ (?:what (?:a |an )?[a-z]+|how [a-z]+) /.test(c.low)),
      explain: 'What + (a) 形容詞 + 名詞 + S V!／How + 形容詞・副詞 + S V!「なんと～なのだろう」。後ろの S V は省略できます。',
      example: { en: 'What a beautiful view this is!', ja: 'これはなんと美しい景色だろう。' }
    },
    {
      id: 'g-wh-question', name: '疑問詞を使った疑問文', level: 1,
      test: (c) => c.q && /^ (?:what|who|whom|whose|which|where|when|why|how) /.test(c.low),
      explain: '疑問詞は文頭に置き、その後ろは疑問文の語順にします。疑問詞が主語のときは、そのまま動詞を続けます（Who broke it?）。',
      example: { en: 'Where did you buy that bag?', ja: 'そのかばんをどこで買いましたか。' }
    },
    {
      id: 'g-imperative-and', name: '命令文 + and / or', level: 2,
      test: (c) => c.has('imperative') && / , (?:and|or) (?:you|i|we|he|she|they|it) /.test(c.low),
      explain: '命令文 + and「～しなさい、そうすれば…」、命令文 + or「～しなさい、さもないと…」。if を使って書き換えられます。',
      example: { en: 'Hurry up, or you will miss the bus.', ja: '急ぎなさい、さもないとバスに乗り遅れる。' }
    },
    {
      id: 'g-imperative', name: '命令文', level: 1,
      test: (c) => c.has('imperative') || (!c.q && !c.has('inversion') && c.n > 1 && /^(?:please|do|let|never)$/.test(c.w[0]) && (c.w[0] !== 'do' || c.w[1] === 'not') &&
        (c.w[0] !== 'never' || (c.base(c.w[1]) && !/^(?:have|do|be)$/.test(c.w[1])))),
      explain: '動詞の原形で文を始めます。否定は Don\'t + 原形、ていねいに言うときは please、「～しましょう」は Let\'s + 原形 です。',
      example: { en: 'Please open the window.', ja: '窓を開けてください。' }
    },

    /* ---------- 文型 ---------- */
    {
      id: 'g-svoc', name: '第 5 文型（S V O C）', level: 2,
      test: (c) => c.sp === 'SVOC',
      explain: '目的語 O と補語 C の間に「O = C」「O が C する」の関係があります。make O C「O を C にする」、call O C「O を C と呼ぶ」、find O C「O が C だと分かる」など。',
      example: { en: 'The news made her happy.', ja: 'その知らせは彼女を喜ばせた。' }
    },
    {
      id: 'g-svoo', name: '第 4 文型（S V O O）', level: 1,
      test: (c) => c.sp === 'SVOO',
      explain: '「（人）に（物）を～する」。give / show / tell / teach / send / buy などがこの形をとります。語順を入れ替えると to（または for）+ 人 になります。',
      example: { en: 'My uncle gave me a watch.', ja: 'おじは私に腕時計をくれた。' }
    },
    {
      id: 'g-svc', name: '第 2 文型（S V C）', level: 1,
      test: (c) => c.sp === 'SVC',
      explain: '補語 C が主語 S を説明し、「S = C」の関係になります。be 動詞のほか、become / look / seem / feel / get などがこの形をとります。',
      example: { en: 'She became a nurse.', ja: '彼女は看護師になった。' }
    },
    {
      id: 'g-svo', name: '第 3 文型（S V O）', level: 1,
      test: (c) => c.sp === 'SVO',
      explain: '「S は O を～する」。動詞のすぐ後ろに目的語（名詞・代名詞・that 節など）を置きます。',
      example: { en: 'I read the newspaper every morning.', ja: '私は毎朝、新聞を読む。' }
    },
    {
      id: 'g-sv', name: '第 1 文型（S V）', level: 1,
      test: (c) => c.sp === 'SV',
      explain: '主語と動詞だけで文が成り立ちます。場所や時を表す語句（修飾語）が付いても、文型は変わりません。',
      example: { en: 'The sun rises in the east.', ja: '太陽は東から昇る。' }
    }
  ]);
})(typeof window !== 'undefined' ? window : globalThis);
