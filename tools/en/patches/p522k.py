import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# a bottle with a message inside it → 伝言の入ったびん / an envelope with money in it → お金の入った封筒（with + 名詞 + inside / in it は名詞にかける）
rep("""      // those inside a car / those in need（〜の人々）
""",
    """      if (isW(t, 'with') && !node.pron && !node.an && !node.time && j + 2 < lim && T[j + 1].k === 'w') {
        const mWi = mark();
        const nWi = np1(j + 1, lim, { noPost: true, noRel: true, noCoord: true });
        const kWi = nWi ? nWi.end : -1;
        const eWi = kWi > 0 && kWi < lim ? (isW(T[kWi], 'inside') ? (T[kWi + 1] && /^(?:it|them)$/.test(T[kWi + 1].w || '') ? kWi + 2 : kWi + 1) : (isW(T[kWi], 'in') && T[kWi + 1] && /^(?:it|them)$/.test(T[kWi + 1].w || '') ? kWi + 2 : -1)) : -1;
        if (eWi > 0 && (eWi >= lim || T[eWi].k === 'p' || (T[eWi].k === 'w' && (PREP[T[eWi].w] || /^(?:and|but|or|that|which|when|because)$/.test(T[eWi].w) || !!vc(T[eWi], ['3sg', 'past']))))) { node = Object.assign({}, node, { ja: nWi.ja + 'の入った' + node.ja, end: eWi }); continue; }
        fail(mWi);
      }
      // those inside a car / those in need（〜の人々）
""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
