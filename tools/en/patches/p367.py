import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# See you next class / See you on Monday → また次の授業でね・また月曜日にね
rep("""    // Hi, Ken. → こんにちは、ケン""",
    """    if (seq(0, ['see', 'you']) && b > 2 && !(T[2].k === 'w' && (DET[T[2].w] !== undefined && !/^(?:next|this|that)$/.test(T[2].w)))) {
      const mSy2 = mark();
      if (seq(2, ['next', 'class']) || seq(2, ['next', 'lesson'])) return { ok: true, ja: 'また次の授業でね。', sp: '', names: ['fixed'], sel: selMap(), unknown: UNK.slice(), idioms: USED.slice() };
      const stSy2 = newSt(null);
      const eSy2 = tail(2, b, stSy2, {}, null);
      if (eSy2 === b && stSy2.time.concat(stSy2.other).length) return { ok: true, ja: 'また' + stSy2.time.concat(stSy2.other).join('').replace(/^今度の?/, '今度').replace(/に$/, '') + 'ね。', sp: '', names: ['fixed'], sel: selMap(), unknown: UNK.slice(), idioms: USED.slice() };
      fail(mSy2);
    }
    // Hi, Ken. → こんにちは、ケン""")

rep("""    ja = ja.replace(/中国の万里の長城/g, '万里の長城');""",
    """    ja = ja.replace(/中国の万里の長城/g, '万里の長城');
    ja = ja.replace(/([0-9０-９]+ページ)で([^、。]{1,10}?)を(見|読|探)/, '$1の$2を$3');   // Look at the picture on page 10 → 10ページの絵を見なさい""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
