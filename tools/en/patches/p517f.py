import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# more responsible and caring (than those who …) → 〜より責任感があって、思いやりがある（more を 2 つの形容詞で共有）
rep("""            const a3 = k3 < lim ? adjC(T[k3]) : null;
            if (a3 && (d3 || a3.form === 'comp') && isW(T[k3 + 1], 'than') && k3 + 2 < lim) {""",
    """            const a3 = k3 < lim ? adjC(T[k3]) : null;
            const shareMore = !d3 && cmp === 'more' && isW(T[k - 1], 'more') && !!a3 && a3.form === 'base';   // more responsible and caring
            if (a3 && (d3 || a3.form === 'comp' || shareMore) && isW(T[k3 + 1], 'than') && k3 + 2 < lim) {""")
rep("""            if (a3 && (d3 || a3.form === 'comp') && (k3 + 1 === lim || T[k3 + 1].k === 'p')) {
              pick(k3, a3.e);
              const f3 = en.jp.adj(a3.e.ja);""",
    """            if (a3 && shareMore && (k3 + 1 === lim || T[k3 + 1].k === 'p')) { pick(k3, a3.e); const f3 = en.jp.adj(a3.e.ja); return W(fin(P((deg || 'より') + f.te + '、' + f3.pred.s, f3.pred.cls), k3 + 1)); }
            if (a3 && (d3 || a3.form === 'comp') && (k3 + 1 === lim || T[k3 + 1].k === 'p')) {
              pick(k3, a3.e);
              const f3 = en.jp.adj(a3.e.ja);""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
