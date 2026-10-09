import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# Ten years went by / Time goes by quickly → 10年が過ぎた・時間はすぐに過ぎる（時の名詞が主語の go by / pass by は「過ぎる」。go by bus は従来どおり）
rep("""      if (it.it && BLOCK[it.it.phrase] && !okHead) continue;
      if (it.shape === 'Ado' && (CAUS[vg.lemma] || OTOV[vg.lemma])) continue;      // 使役・知覚・V + O + to do は専用の型で訳す""",
    """      if (it.it && /^(?:go by|pass by)$/.test(it.it.phrase) && it.shape === 'fixed' && seq(i, it.lit) && !vg.passive && o.subj && (o.subj.time || o.subj.dur || /(?:^| )(?:time|times|day|days|week|weeks|month|months|year|years|hour|hours|minute|minutes|second|seconds|decade|decades|century|centuries|summer|winter|spring|autumn|fall|season|seasons|moment|moments|life)$/.test(plainSubj(o.subj).head || '')) && (i + n >= lim || T[i + n].k === 'p' || (T[i + n].k === 'w' && (!!ADV[T[i + n].w] || /^(?:and|but|so|without|before|since|until|as|when)$/.test(T[i + n].w))))) {
        const rBy = done(vg, P('過ぎる', 'v1'), st, tail(i + n, lim, st, o, vg), 'SV', o, [], { noStative: true });
        if (rBy) { useIdiom(it.it); name('idiom'); return rBy; }
        fail(m); continue;
      }
      if (it.it && BLOCK[it.it.phrase] && !okHead) continue;
      if (it.shape === 'Ado' && (CAUS[vg.lemma] || OTOV[vg.lemma])) continue;      // 使役・知覚・V + O + to do は専用の型で訳す""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
