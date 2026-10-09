import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# It was only after she had moved abroad that … → 〜のは、外国に引っ越した後になってからだった（only + after / when は「ただ」にしない）
rep("""            node.out = (z) => main.out(Object.assign({}, z || {}, { form: 'attr', part: 'が' })) + 'のは、' + pre + subStr(sb0.key, sc, main, undefined, true).replace(/、$/, '') +""",
    """            const onlyT = T[j].k === 'w' && T[j].w === 'only' && /^(?:after|when|once|since)$/.test(sb0.key);
            const subS = (q) => { const s0 = subStr(sb0.key, q, main, undefined, true).replace(/、$/, ''); return onlyT ? s0.replace(/後で$/, '後になってから').replace(/(とき|と)に?$/, 'ときになってから').replace(/て以来$/, 'てから') : s0; };
            node.out = (z) => main.out(Object.assign({}, z || {}, { form: 'attr', part: 'が' })) + 'のは、' + (onlyT ? '' : pre) + subS(sc) +""")
rep("""              (app ? '、つまり' + subStr(sb0.key, app, main, undefined, true).replace(/、$/, '') : '') + (vg.past ? 'だった' : 'だ');
            return node;""",
    """              (app ? '、つまり' + subS(app) : '') + (vg.past ? 'だった' : 'だ');
            return node;""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
