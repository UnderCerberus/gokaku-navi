import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# on the way back to the station / on the way back home は決まり文句（帰り道で）で切らず、前置詞句で読む（駅へ戻る途中で・帰り道で）
rep("""      if (j + fx[k].toks.length <= lim && seq(j, fx[k].toks)) return { ja: fx[k].ja, end: j + fx[k].toks.length, it: fx[k].it };
      // on one's own → on their own（one's の位置は所有格の限定詞）""",
    """      if (/^on (?:the|my|his|her|our|their|your) way(?: back)?$/.test(fx[k].toks.join(' ')) && isW(T[j + 3], 'back') && j + 4 < lim && /^(?:to|from|home)$/.test(T[j + 4].w || '')) continue;
      if (j + fx[k].toks.length <= lim && seq(j, fx[k].toks)) return { ja: fx[k].ja, end: j + fx[k].toks.length, it: fx[k].it };
      // on one's own → on their own（one's の位置は所有格の限定詞）""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
