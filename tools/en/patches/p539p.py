import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# children may even feel embarrassed to use it in public → 人前でそれを使うのを恥ずかしく思う / I was afraid to go → 行くのが怖かった / He was ashamed to ask for help → 助けを求めるのが恥ずかしかった
# （恐れ・恥ずかしさ・ためらいの形容詞 + to 不定詞は「〜のが怖い・恥ずかしい」「〜のをためらう」。「〜のに」「〜ために」にしない）
rep("""            if (EMO[a.lemma]) {   // was surprised to hear the news → ニュースを聞いて驚いた（出来事なので「驚いている」にしない）""",
    """            if (/^(?:afraid|scared|frightened|ashamed|embarrassed|shy|reluctant|hesitant)$/.test(a.lemma) && verbal(pv) && !cmp && !sup) {
              name('inf-adv');
              const tlA = /^(?:afraid|scared|frightened)$/.test(a.lemma) ? 'のが' + deg + '怖い' : (/^(?:reluctant|hesitant)$/.test(a.lemma) ? 'のを' + deg + 'ためらう' : 'のが' + deg + '恥ずかしい');
              const mNg = mark();
              const inf3n = gap.used ? vpNonfin(e + 1, lim, 'base', { subj: sj }) : null;
              if (gap.used && !inf3n) fail(mNg);
              const iA = inf3n || inf3;
              return fin(P(vpJoin(iA, iA.neg ? 'neg' : 'dict') + tlA, /ためらう$/.test(tlA) ? 'v5' : 'i'), iA.end, 'SVC', []);
            }
            if (EMO[a.lemma]) {   // was surprised to hear the news → ニュースを聞いて驚いた（出来事なので「驚いている」にしない）""")

# feel + 形容詞 + to 不定詞も be と同じに読む（feel embarrassed to use it）
rep("""      if (aFt && isW(T[kFt + 1], 'that') && kFt + 2 < lim && (EMO[aFt.lemma] ||""",
    """      if (aFt && (isW(T[kFt + 1], 'that') || (isW(T[kFt + 1], 'to') && T[kFt + 2] && T[kFt + 2].k === 'w' && !!vc(T[kFt + 2], ['base']))) && kFt + 2 < lim && (EMO[aFt.lemma] ||""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
