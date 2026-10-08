import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

def rep_line(key, old, new):
    # key を含む唯一の行の中だけで old → new
    global s
    lines = s.split('\n')
    hits = [k for k, ln in enumerate(lines) if key in ln]
    assert len(hits) == 1, (len(hits), key)
    k = hits[0]
    assert lines[k].count(old) == 1, (lines[k].count(old), key, old)
    lines[k] = lines[k].replace(old, new)
    s = '\n'.join(lines)

# 書き換えで作り直したトークンに、元の文の同じ語の番号 oi を順に引き継ぐ（語注の対応づけ用）
rep("""  function selMap() {
    const out = {};
    SEL.forEach((x) => { out[x[0]] = x[1]; });
    return out;
  }
""", """  function selMap() {
    const out = {};
    SEL.forEach((x) => { out[x[0]] = x[1]; });
    return out;
  }
  // 文字列から作り直したトークン列 nt に、元のトークン列 src の同じ語の番号（oi）を前から順に引き継ぐ（語注の対応づけ用）
  function adoptOi(nt, src) {
    let q = 0;
    (nt || []).forEach((x) => {
      if (x.k !== 'w' || x.oi !== undefined) return;
      for (let r = q; r < src.length; r++) if (src[r].k === 'w' && src[r].w === x.w && src[r].oi !== undefined) { x.oi = src[r].oi; q = r + 1; return; }
    });
    return nt;
  }
""")

# 2 つに分けて訳した文は、両方の辞書選択を合わせて返す（後半だけ・空にならないように）
rep_line("if (sj2 && okEnd) return Object.assign({}, rM2, { ja: p1", "rM2.ja.slice(sj2[0].length) });", "rM2.ja.slice(sj2[0].length), sel: Object.assign({}, rM1.sel, rM2.sel) });")
rep_line("return Object.assign({}, rBR, { ja:", "return Object.assign({}, rBR, { ja:", "return Object.assign({}, rBR, { sel: Object.assign({}, rBL.sel, rBR.sel), ja:")
rep_line("if (r1W && r1W.ok && r2W && r2W.ok", "sel: selMap()", "sel: Object.assign({}, r1W.sel, r2W.sel)")
rep_line("if (r1Ot && r1Ot.ok && r2Ot && r2Ot.ok", "sel: selMap()", "sel: Object.assign({}, r1Ot.sel, r2Ot.sel)")
rep_line("if (r1B && r1B.ok && r2B && r2B.ok)", "sel: selMap()", "sel: Object.assign({}, r1B.sel, r2B.sel)")
rep_line("if (r1D && r1D.ok && r2D && r2D.ok)", "sel: selMap()", "sel: Object.assign({}, r1D.sel, r2D.sel)")
rep_line("if (rTh && rTh.ok) return { ok: true, ja: (kTh > thx", "sel: selMap()", "sel: rTh.sel || {}")

rep("""        const t2W = tokenize('Some ' + hdW + ' ' + T.slice(kOw + 1, b).map((x) => x.s || x.w).join(' ') + '.');""",
    """        const t2W = adoptOi(tokenize('Some ' + hdW + ' ' + T.slice(kOw + 1, b).map((x) => x.s || x.w).join(' ') + '.'), T.slice(kOw + 1, b));""")
rep("""        const t1Ot = tokenize('Some people ' + T.slice(1, kEt).map((x) => x.s || x.w).join(' ') + '.');
        const t2Ot = tokenize('Some people ' + T.slice(kOt + 1, b).map((x) => x.s || x.w).join(' ') + '.');""",
    """        const t1Ot = adoptOi(tokenize('Some people ' + T.slice(1, kEt).map((x) => x.s || x.w).join(' ') + '.'), T.slice(0, kEt));
        const t2Ot = adoptOi(tokenize('Some people ' + T.slice(kOt + 1, b).map((x) => x.s || x.w).join(' ') + '.'), T.slice(kOt + 1, b));""")
rep("""          const t2B = tokenize('I ' + T[kBt + 2].w + ' not ' + T[kTo + 1].w + pronB + '.');""",
    """          const t2B = adoptOi(tokenize('I ' + T[kBt + 2].w + ' not ' + T[kTo + 1].w + pronB + '.'), T.slice(kBt + 1));""")
rep("""          const t2D = tokenize(T[kBt2 + 1].w + ' did not ' + vD.lemma + (trD ? ' it' : '') + '.');""",
    """          const t2D = adoptOi(tokenize(T[kBt2 + 1].w + ' did not ' + vD.lemma + (trD ? ' it' : '') + '.'), T.slice(kBt2 + 1));""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
