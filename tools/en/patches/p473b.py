import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

rep("""        if (gG2 && verbal(gG2.pred)) { name('gerund'); return { ja: sG2.ja + 'が'""",
    """        if (gG2) { name('gerund'); return { ja: sG2.ja + 'が'""")

# 結果の不定詞: 自分の家 → 家、短い後半はコンマなしで続ける
rep("""            return { ok: true, ja: rLy.ja.replace(/。$/, '') + (onlyY ? 'が、' : 'ら、') + jRy + '。',""",
    """            jRy = jRy.replace(/^自分の/, '');
            return { ok: true, ja: rLy.ja.replace(/。$/, '') + (onlyY ? 'が、' : (/は/.test(jRy) ? 'ら、' : 'ら')) + jRy + '。',""")

# Do you mind my opening the window? → 窓を開けてもよろしいですか（Do you mind if I open … と同じに訳す）
rep("""    // There is no use crying over spilt milk.""",
    """    if (b > 5 && !tokens.__mindMy && /^(?:do|would)$/.test(T[0].w || '') && seq(1, ['you', 'mind']) && /^(?:my|me)$/.test(T[3].w || '') && T[4] && /ing$/.test(T[4].w || '') && !!vc(T[4], ['ing'])) {
      const lemMm = vc(T[4], ['ing']).lemma;
      const tMm = tokens.slice(0, 3).concat([Object.assign({}, tokens[3], { w: 'if', s: 'if', raw: 'if', an: undefined, oi: undefined }), Object.assign({}, tokens[3], { w: 'i', s: 'I', raw: 'I', cap: true, an: undefined, oi: undefined }), Object.assign({}, tokens[4], { w: lemMm, s: lemMm, raw: lemMm, an: undefined })], tokens.slice(5)).map((x, k) => Object.assign({}, x, { i: k }));
      tMm.__mindMy = true;
      const rMm = translate1(tMm);
      reset(tokens);
      if (rMm && rMm.ok) return Object.assign({}, rMm, { names: rMm.names.concat(['gerund']) });
    }
    // There is no use crying over spilt milk.""")

rep("""    ja = ja.replace(/知識の隙間/g, '知識の空白')""",
    """    ja = ja.replace(/ことの(希望|望み|見込み|可能性|チャンス|危険|恐れ)/g, '$1');   // There is no hope of his winning → 彼が勝つ見込みはない
    ja = ja.replace(/知識の隙間/g, '知識の空白')""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
