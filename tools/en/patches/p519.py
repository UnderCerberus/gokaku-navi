import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# Writing was invented not to record stories but to keep track of goods → 物語を記録するためではなく、商品を把握するために
rep("""    // rushed out of the classroom, eager to enjoy the vacation → 休暇を楽しみたくて（文末の , 形容詞 + to do）""",
    """    if (seq(j, ['not', 'to']) && vg && j + 3 < lim && T[j + 2].k === 'w' && !!vc(T[j + 2], ['base'])) {
      const mNtb = mark();
      const kBtb = T.findIndex((x, q) => q > j + 2 && q < lim - 2 && isW(x, 'but') && isW(T[q + 1], 'to'));
      if (kBtb > 0) {
        const eAtb = isP(T[kBtb - 1], ',') ? kBtb - 1 : kBtb;
        const v1tb = vpNonfin(j + 2, eAtb, 'base', {}), v2tb = v1tb && v1tb.end === eAtb ? vpNonfin(kBtb + 2, lim, 'base', {}) : null;
        if (v1tb && v2tb && verbal(v1tb.pred) && verbal(v2tb.pred)) { name('not-but'); st.other.push(vpJoin(v1tb, 'dict') + 'ためではなく、' + vpJoin(v2tb, 'dict') + 'ために'); return v2tb.end; }   // not to record … but to keep track of …
      }
      fail(mNtb);
    }
    // rushed out of the classroom, eager to enjoy the vacation → 休暇を楽しみたくて（文末の , 形容詞 + to do）""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
