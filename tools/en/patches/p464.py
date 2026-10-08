import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

rep("""fullObj = !!nFo && nFo.end === lim && !nFo.pron && (T.slice(i, lim).some((x) => isW(x, 'to')) || (/^(?:recognize|identify)$/.test(L) && !!cand(T[lim - 1], '名', ['pl']))); fail(mFo); }""",
    """fullObj = !!nFo && nFo.end === lim && !nFo.pron && (T.slice(i, lim).some((x) => isW(x, 'to')) || (/^(?:recognize|identify)$/.test(L) && !!cand(T[lim - 1], '名', ['pl'])) || (/^(?:evidence|fact|facts|idea|news|proof|sign|signs|possibility|belief|hope|rumor|rumour|feeling|impression|theory|claim|report|information)$/.test(nFo.head || '') && T.slice(i, lim).some((x) => isW(x, 'that')))); fail(mFo); }   // found evidence that water once flowed on Mars（同格の that 節つきの名詞が目的語）""")

rep("""    ja = ja.replace(/知識の隙間/g, '知識の空白')""",
    """    ja = ja.replace(/人生の(?:簡単な|単純な)形/g, '単純な生命体').replace(/土台を(建てる|建設する|作る)/g, '基地を建設する').replace(/土台を(建て|建設し|作っ)た/g, '基地を建設した');   // simple forms of life → 単純な生命体 / build a base there → 基地を建設する
    ja = ja.replace(/知識の隙間/g, '知識の空白')""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
