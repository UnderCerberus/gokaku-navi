import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()
old = "    // Hi, Ken. → こんにちは、ケン\n    if (b === 3 && T[0].k === 'w'"
new = """    // Hello, this is Mike. → もしもし、こちらはマイクです（電話の名乗り）
    if (b >= 5 && T[0].k === 'w' && /^(?:hi|hello)$/.test(T[0].w) && isP(T[1], ',') && seq(2, ['this', 'is']) && T[4].k === 'w' && (T[4].cap || NAME_JA[T[4].w])) {
      const nmT = np(4, b, {});
      if (nmT && nmT.end === b) return { ok: true, ja: 'もしもし、こちらは' + nmT.ja + 'です。', sp: '', names: ['fixed'], sel: selMap(), unknown: UNK.slice(), idioms: USED.slice() };
      reset(tokens);
    }
    // Hi, Ken. → こんにちは、ケン
    if (b === 3 && T[0].k === 'w'"""
assert s.count(old) == 1
s = s.replace(old, new)
io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
