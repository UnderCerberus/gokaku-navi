import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# 省略節の主語（補った代名詞）は接続詞の後ろでも省く: Once finished, the bridge … → いったん〜すると
rep("""          if (rE && rE.ok && nounE) rE.ja = rE.ja.replace(new RegExp('^(?:もし)?' + ({ they: '彼ら', he: '彼', it: 'それ' })[subjE] + '(?:が|は)、?'), (m0) => (/^もし/.test(m0) ? 'もし' : ''));""",
    """          if (rE && rE.ok && nounE) rE.ja = rE.ja.replace(new RegExp('^([^、。]{0,6}?)' + ({ they: '彼ら', he: '彼', it: 'それ' })[subjE] + '(?:が|は)、?'), '$1');""")
# a teacher who had inspired them as children → 子どものころに（as + 冠詞なしの複数形も）
rep("""    if (tokens.some((x, q) => x.w === 'as' && tokens[q + 1] && /^(?:a|an)$/.test(tokens[q + 1].w || '') && tokens[q + 2] && /^(?:child|kid|boy|girl|teenager|student)$/.test(tokens[q + 2].w || ''))) ja = ja.replace(""",
    """    if (tokens.some((x, q) => x.w === 'as' && ((tokens[q + 1] && /^(?:a|an)$/.test(tokens[q + 1].w || '') && tokens[q + 2] && /^(?:child|kid|boy|girl|teenager|student)$/.test(tokens[q + 2].w || '')) || (tokens[q + 1] && /^(?:children|kids|teenagers)$/.test(tokens[q + 1].w || '') && (!tokens[q + 2] || tokens[q + 2].k === 'p') && !tokens.slice(Math.max(0, q - 4), q).some((y) => /^(?:same|such|way|as)$/.test(y.w || '')))))) ja = ja.replace(""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
