import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# It remains to be seen whether the plan will succeed → 計画が成功するかどうかはまだ分からない
rep("""    // Hi, Ken. → こんにちは、ケン""",
    """    if (seq(0, ['it', 'remains', 'to', 'be', 'seen']) && b > 6 && T[5].k === 'w' && /^(?:whether|if|how|what|who|when|where|why|which)$/.test(T[5].w)) {
      const mRs = mark();
      const wRs = whClause(5, b);
      if (wRs && wRs.end === b) return { ok: true, ja: wRs.str.replace(/だろう(か)$/, '$1') + 'はまだ分からない。', sp: '', names: ['indirect-q'], sel: selMap(), unknown: UNK.slice(), idioms: USED.slice() };
      fail(mRs);
    }
    // Hi, Ken. → こんにちは、ケン""")

rep("""    ja = ja.replace(/注意深くなる必要/g, '気をつける必要')""",
    """    ja = ja.replace(/([^、。]{1,8}?)の中に(?:その)?([^、。]{1,8}?)を(拡大|広げ|進出)/g, '$2を$1に$3').replace(/柔軟な時間を働/g, '柔軟な時間で働').replace(/(雑誌|学術誌|科学雑誌|新聞|専門誌)で出版され/g, '$1に掲載され').replace(/に([^、。]{1,12}?(?:ドル|円|ユーロ)もの?)を救(う|った)/, (m0, a0, b0) => 'の' + a0.replace(/もの?$/, 'もの') + '費用を節約' + (b0 === 'う' ? 'する' : 'した'));   // expand its business into Asia → 事業をアジアに拡大する / published in a scientific journal → 科学雑誌に掲載された / save the city millions of dollars → 市の何百万ドルもの費用を節約する
    ja = ja.replace(/注意深くなる必要/g, '気をつける必要')""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
