import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# is lost or thrown away → 失われたり捨てられたりしている / were sold or given away（並列の過去分詞の後ろの副詞は熟語として読む。離れて にしない）
rep("""          if (r3 && passiveOK(r3, lim) && !(nx && nx.k === 'w' && (DET[nx.w] !== undefined || PRON[nx.w]))) { vg.coord = { conj: cj.w, c: r3.c, idx: r3.idx }; vg.end = r3.end; pick(r3.idx, r3.c.e); }""",
    """          if (r3 && passiveOK(r3, lim) && !(nx && nx.k === 'w' && (DET[nx.w] !== undefined || PRON[nx.w]))) {
            vg.coord = { conj: cj.w, c: r3.c, idx: r3.idx }; vg.end = r3.end; pick(r3.idx, r3.c.e);
            if (nx && nx.k === 'w' && /^(?:away|out|up|down|off)$/.test(nx.w)) {
              const itPc = (idiomIndex().verb[r3.c.lemma] || []).find((it) => it.lit.length === 1 && it.lit[0] === nx.w && /^〜(?:を|に)?[^〜]+$/.test((it.ja || '').split(/;\\s*/)[0]));
              if (itPc) { vg.coord.core = itPc.ja.split(/;\\s*/)[0].replace(/^〜(?:を|に)?/, ''); vg.end = r3.end + 1; if (itPc.it) useIdiom(itPc.it); }
            }
          }""")

# were lost or destroyed → 失われたり破壊されたりした（並列の動詞の訳の 〜を を取り除いてから受け身にする。破壊したり にしない）
rep("""        const ss = en.jp.senses(vg.coord.c.e.ja);
        const s2 = ss.filter((s) => s.tr)[0] || ss[0];
        const p2 = P(String(s2.core).replace(/[〜…]/g, '')).aux('pass');""",
    """        const ss = en.jp.senses(vg.coord.c.e.ja);
        const s2 = ss.filter((s) => s.tr)[0] || ss[0];
        const p2 = P(vg.coord.core || String(s2.core).replace(/^[〜…](?:を|に|が|と)?/, '').replace(/[〜…]/g, '')).aux('pass');""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
