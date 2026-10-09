import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# A car went by → 車が通り過ぎた（節末の go by / pass by。時の主語は上で 過ぎる）
rep("""      if (it.it && BLOCK[it.it.phrase] && !okHead) continue;
      if (it.shape === 'Ado' && (CAUS[vg.lemma] || OTOV[vg.lemma])) continue;      // 使役・知覚・V + O + to do は専用の型で訳す""",
    """      if (it.it && /^(?:go by|pass by)$/.test(it.it.phrase) && it.shape === 'fixed' && seq(i, it.lit) && !vg.passive && (i + n >= lim || T[i + n].k === 'p')) {
        const rBy2 = done(vg, P('通り過ぎる', 'v1'), st, i + n, 'SV', o, [], { noStative: true });
        if (rBy2) { useIdiom(it.it); name('idiom'); return rBy2; }
        fail(m); continue;
      }
      if (it.it && BLOCK[it.it.phrase] && !okHead) continue;
      if (it.shape === 'Ado' && (CAUS[vg.lemma] || OTOV[vg.lemma])) continue;      // 使役・知覚・V + O + to do は専用の型で訳す""")

# without someone asking me … → 誰かが私に…尋ねることなく / without anyone noticing → 誰も気づかないうちに（without + 名詞 + -ing は意味上の主語つきの動名詞）
rep("""    // from across Japan / from all over the country → 日本各地から""",
    """    if (key === 'without' && !idi && j < lim && T[j].k === 'w' && !vc(T[j], ['ing']) && (DET[T[j].w] !== undefined || /^(?:anyone|anybody|someone|somebody|everyone|everybody|him|her|them|me|us|you|it|people)$/.test(T[j].w) || T[j].cap)) {
      const mWs = mark();
      const nWs = np(j, lim, { noRel: true, noPost: true, noCoord: true });
      if (nWs && nWs.end === lim && T[lim] && T[lim].k === 'w' && !!vc(T[lim], ['ing']) && !nounC(T[lim])) return fail(m);   // left the room without anyone noticing（区切りの手前で without 句を名詞につけない）
      if (nWs && nWs.end < lim && T[nWs.end].k === 'w' && !!vc(T[nWs.end], ['ing']) && !(DET[T[nWs.end].w] !== undefined)) {
        const vWs = vpNonfin(nWs.end, lim, 'ing', { subj: nWs });
        if (vWs && verbal(vWs.pred)) {
          const anyWs = /^(?:anyone|anybody)$/.test(T[j].w);
          const jaWs = anyWs ? '誰も' + vpJoin(vWs, 'neg') + 'うちに' : nWs.ja + 'が' + vpJoin(vWs, 'dict') + 'ことなく';
          return { ja: jaWs, adn: anyWs ? '誰も' + vpJoin(vWs, 'neg') : nWs.ja + 'が' + vpJoin(vWs, 'dict') + 'ことのない', kind: 'other', end: vWs.end, prep: 'without', subjIng: { n: nWs, vp: vWs, any: anyWs } };
        }
      }
      fail(mWs);
    }
    // from across Japan / from all over the country → 日本各地から""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
