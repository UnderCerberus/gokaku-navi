import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# Plants get enough light → 十分な光を得る（get + enough + 名詞にもなる語は名詞句の目的語。「十分な量を軽くする」にしない）
rep("""!(tj && tj.k === 'w' && /^(?:back|home|away)$/.test(tj.w)) && !isW(tj, 'left')) {""",
    """!(tj && tj.k === 'w' && /^(?:back|home|away)$/.test(tj.w)) && !isW(tj, 'left') && !(isW(T[j - 1], 'enough') && j - 1 === i && !!nounC(tj))) {""")

# Plants grow faster / grow quickly in warm weather → より速く成長する（生き物・経済の grow + 速さの副詞は「成長する」。「より速くなる」にしない）
rep("""      const ap = /^(?:keep|stop|start|begin|continue|quit|finish|avoid|enjoy|mind)$/.test(L)""",
    """      if (L === 'grow' && !vg.passive && T[i] && T[i].k === 'w' && /^(?:fast|faster|fastest|quickly|slowly|rapidly|steadily|slower|quicker)$/.test(T[i].w) && !(T[i + 1] && T[i + 1].k === 'w' && !!nounC(T[i + 1]) && !PREP[T[i + 1].w])) {
        const spG = /^(?:faster|quicker)$/.test(T[i].w) ? 'より速く' : (T[i].w === 'slower' ? 'よりゆっくり' : (T[i].w === 'fastest' ? '最も速く' : ((advC(T[i]) || {}).ja || '速く')));
        const mGr = mark();
        const eGr = tail(i + 1, lim, st, o, vg);
        if (eGr === lim) { st.manner.push(spG); return done(vg, P('成長する', 'suru'), st, lim, 'SV', o, [], { noStative: true }); }
        fail(mGr);
      }
      const ap = /^(?:keep|stop|start|begin|continue|quit|finish|avoid|enjoy|mind)$/.test(L)""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
