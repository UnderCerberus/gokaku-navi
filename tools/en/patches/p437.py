import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

rep("""    // It was the first time for my little brother to see a real elephant → 弟が本物のゾウを見るのは初めてだった
""",
    """    // It is a good idea for high school students to have part-time jobs → 高校生がアルバイトをするのは良い考えだ（It is + a + 名詞 + (for X) + to V）
    if (vg.lemma === 'be' && j + 3 < b && /^(?:a|an)$/.test(T[j].w || '')) {
      const kNi = T.findIndex((x, q) => q > j + 1 && q < j + 6 && (isW(x, 'for') || isW(x, 'to')));
      if (kNi > 0) {
        const mNi = mark();
        const nNi = np(j, kNi, { noRel: true, noCoord: true });
        if (nNi && nNi.end === kNi && /^(?:idea|way|mistake|pity|shame|waste|challenge|pleasure|honor|honour|privilege|tradition|custom|rule|habit|joy|fun|surprise|relief|thing|chance|opportunity|experience|dream)$/.test(nNi.head || '')) {
          let sjNi = null, kTo = kNi;
          if (isW(T[kNi], 'for')) { const ftNi = forTo(kNi, b); if (ftNi.np && isW(T[ftNi.end], 'to')) { sjNi = ftNi.np; kTo = ftNi.end; } else kTo = -1; }
          if (kTo > 0 && isW(T[kTo], 'to') && kTo + 1 < b) {
            const infNi = vpNonfin(kTo + 1, b, 'base', sjNi ? { subj: sjNi } : {});
            if (infNi && infNi.end === b && verbal(infNi.pred)) { name('it-to'); return mkClause(null, done(vg, P(nNi.ja.replace(/^(?:1つの|ある)/, '') + 'だ', 'da'), st, b, 'SVC', o, [(sjNi ? sjNi.ja + 'が' : '') + vpJoin(infNi, 'dict') + 'のは'], { noStative: true }), ''); }
          }
        }
        fail(mNi);
      }
    }
    // It was the first time for my little brother to see a real elephant → 弟が本物のゾウを見るのは初めてだった
""")

rep("""    ja = ja.replace(/世紀の最中に/g, '世紀半ばに').replace(/世紀の終わりに/g, '世紀末に');""",
    """    ja = ja.replace(/世紀の最中に/g, '世紀半ばに').replace(/世紀の終わりに/g, '世紀末に');
    ja = ja.replace(/アルバイトを持つ/g, 'アルバイトをする').replace(/^未来に、/, '将来、').replace(/^(将来、)?より多くの人々は(.+?)するでしょうか/, '$1$2する人は増えるでしょうか');   // have part-time jobs → アルバイトをする / In the future, will more people work from home? → 将来、在宅勤務をする人は増えるでしょうか""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
