import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# Scientists call these natural differences in sleep timing chronotypes → …違いをクロノタイプと呼ぶ / We call this kind of behavior altruism
# （call / name + 目的語 + 冠詞なしの補語を 1 つの名詞句に読んだときは、最後の名詞句を補語として分け直す）
rep("""    if (L === 'look' && objs.length === 0 && j === i && !vg.passive) sense = { particle: '', core: '見える', tr: false };      // as he looks""",
    """    if (/^(?:call|name|term|label|dub|nickname)$/.test(L) && !vg.passive && objs.length === 1 && !objs[0].pron && !objs[0].coord && typeof objs[0].end === 'number' && objs[0].end - i >= 2 && T[i] && T[i].k === 'w' && /^(?:the|this|these|that|those|such|a|an)$/.test(T[i].w) && T[objs[0].end - 1] && !T[objs[0].end - 1].cap) {
      for (let k = objs[0].end - 1; k > i; k--) {
        if (T[k].k !== 'w' || DET[T[k].w] !== undefined || PREP[T[k].w] || !nounC(T[k])) continue;
        const mCs = mark();
        const o1Cs = np(i, k, { pp: true, noRel: true });
        const o2Cs = o1Cs && o1Cs.end === k ? np(k, objs[0].end, { noRel: true }) : null;
        if (o2Cs && o2Cs.end === objs[0].end) { objs.splice(0, 1, o1Cs, o2Cs); break; }
        fail(mCs);
        break;
      }
    }
    if (L === 'look' && objs.length === 0 && j === i && !vg.passive) sense = { particle: '', core: '見える', tr: false };      // as he looks""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
