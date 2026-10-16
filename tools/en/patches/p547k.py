import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# arrive in class without having had enough sleep → 十分な睡眠をとらずに / Did you have a good sleep? → よく眠れましたか（have + enough / good + sleep は使役ではなく「睡眠をとる」）
rep("""    if (CAUS[L] && !cmpN && !(isW(tj, 'own') && /^(?:his|her|my|your|our|their|its)$/.test((T[j - 1] || {}).w || ''))""",
    """    if (CAUS[L] && !cmpN && !(L === 'have' && T[i] && /^(?:enough|plenty|much|more|less|little|good|a|some|no)$/.test(T[i].w || '') && /^(?:sleep|rest|nap|break|time|fun|look|try|talk|chat|walk|swim|bath|shower|drink|bite|go)$/.test(tj.w || '')) && !(isW(tj, 'own') && /^(?:his|her|my|your|our|their|its)$/.test((T[j - 1] || {}).w || ''))""")
rep("""      else if (L === 'have' && /^(?:breakfast|lunch|dinner|supper)$/.test(oh)) sense = { particle: 'を', core: '食べる', tr: true };""",
    """      else if (L === 'have' && /^(?:breakfast|lunch|dinner|supper)$/.test(oh)) sense = { particle: 'を', core: '食べる', tr: true };
      else if (L === 'have' && /^(?:sleep|rest|nap|break|breaks)$/.test(oh)) sense = { particle: 'を', core: 'とる', tr: true };""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
