import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# 代名詞 them の先行詞
#  ・many of them had copied sentences（部分の of them + 人の動作の動詞）→ 人（彼らの多く）
#  ・repair them or give them to charity（近くの同じ them は同じものを指す）→ それら
#  ・the bees that pollinate them, many of the fruits …（前に先行詞がなければ後ろの物の複数名詞）→ それら
rep("""    if (theirAnimal(i) >= 0) return 'inan';   // products made from their skins → それらの皮（動物）
""",
    """    if (theirAnimal(i) >= 0) return 'inan';   // products made from their skins → それらの皮（動物）
    if (T[i].w === 'them' && i > 1 && isW(T[i - 1], 'of') && /^(?:many|most|some|all|none|each|one|few|several|both|half|neither|either|two|three|majority)$/.test(T[i - 2].w || '')) {
      let kV = i + 1;
      while (T[kV] && T[kV].k === 'w' && (HAVE[T[kV].w] || MODAL[T[kV].w] || DO[T[kV].w] || /^(?:also|still|even|never|often|always|already|really|actually|now)$/.test(T[kV].w))) kV++;
      const cvP = T[kV] && T[kV].k === 'w' ? vc(T[kV], ['base', 'past', 'pp', '3sg']) : null;
      if (cvP && /^(?:copy|cheat|share|say|said|tell|think|believe|feel|want|hope|know|decide|choose|agree|disagree|complain|admit|answer|reply|respond|vote|work|live|study|learn|read|write|speak|talk|laugh|cry|smile|leave|stay|move|travel|marry|die|survive|own|buy|pay|spend|earn|graduate|attend|join|quit|refuse|try|fail|manage|struggle|suffer|enjoy|prefer|like|love|hate|plan|expect|report|mention|describe|explain|remember|forget|worry|wish|need)$/.test(cvP.lemma) && T.slice(0, i).some((x) => { const cx = x.k === 'w' && !PRON[x.w] ? cand(x, '名', ['pl']) : null; return !!cx && (isPerson(cx) || PERSONS[cx.lemma]); })) return 'an';   // many of them had copied sentences → 彼らの多く
    }
""")
rep("""      if (/^(?:they|them|their)$/.test(t.w)) continue;""",
    """      if (/^(?:they|them|their)$/.test(t.w)) { if (t.w === 'them' && T[i].w === 'them' && i - x <= 8 && !T.slice(x + 1, i).some((y) => y.k === 'p')) { const rTh = pluralAntecedent(x); if (rTh) return rTh; } continue; }   // repair them or give them to charity → 同じ them""")
rep("""    const anyThing = T.some((t, q) => q < i && t.k === 'w' && nounC(t) && !vc(t, ['3sg', 'past', 'base']) && !isPerson(nounC(t)) && !PERSONS[nounC(t).lemma]);
    return !anyAnim && anyThing ? 'inan' : null;""",
    """    const anyThing = T.some((t, q) => q < i && t.k === 'w' && nounC(t) && !vc(t, ['3sg', 'past', 'base']) && !isPerson(nounC(t)) && !PERSONS[nounC(t).lemma]);
    if (T[i].w === 'them') {   // Were it not for the bees that pollinate them, many of the fruits … → 後ろの物の複数名詞（前に人の複数名詞がないとき）
      const prevPl = T.slice(0, i).some((t) => t.k === 'w' && !PRON[t.w] && !!cand(t, '名', ['pl']) && !cand(t, '名', ['base']) && (() => { const c = cand(t, '名', ['pl']); return isPerson(c) || PERSONS[c.lemma]; })());
      if (!prevPl) for (let x = i + 1; x < Math.min(T.length, i + 10); x++) {
        const t = T[x];
        if (t.k !== 'w' || PRON[t.w]) continue;
        const c = cand(t, '名', ['pl']);
        if (c && !cand(t, '名', ['base']) && !vc(t, ['3sg', 'past'])) return isPerson(c) || PERSONS[c.lemma] || ORG[c.lemma] ? 'an' : 'inan';
      }
    }
    return !anyAnim && anyThing ? 'inan' : null;""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
