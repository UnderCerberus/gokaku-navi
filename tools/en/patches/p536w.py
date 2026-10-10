import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# he apologized to the family himself → 自分で家族に謝った（前置詞句のあとの節末の再帰代名詞も「自分で」。目的語にしない）
rep("""      if (objs.length >= 1 && j0 === j && t.k === 'w' && /(?:self|selves)$/.test(t.w) && (j0 + 1 >= lim""",
    """      if ((objs.length >= 1 || (j0 > i && /^(?:himself|herself|myself|yourself|ourselves|themselves)$/.test(t.w) && (st.other.length || st.manner.length || st.time.length))) && j0 === j && t.k === 'w' && /(?:self|selves)$/.test(t.w) && (j0 + 1 >= lim""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
