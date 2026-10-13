import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# Other groups are recording elderly speakers and creating online dictionaries → 年配の話者を録音していて、オンラインの辞書を作っている
# （左の be + -ing を右の -ing にも及ぼす: They are reading books and writing letters）
rep("""        // The letter was written in English and sent to London（左の be + 過去分詞を右の過去分詞にも及ぼす → 送られた）""",
    """        if (!rv && isCC && /^(?:and|or|but)$/.test(w) && left.subj && T[rs] && T[rs].k === 'w' && !!vc(T[rs], ['ing']) && !BE[T[rs].w]) {
          const btkP = T.slice(a, je).find((x, q) => x.k === 'w' && /^(?:is|are|was|were|am)$/.test(x.w) && T[a + q + 1] && T[a + q + 1].k === 'w' && (!!vc(T[a + q + 1], ['ing']) || (!!ADV[T[a + q + 1].w] && T[a + q + 2] && T[a + q + 2].k === 'w' && !!vc(T[a + q + 2], ['ing']))));
          if (btkP) {
            const mrP = mark();
            const newTP = [btkP].concat(T.slice(rs, b));
            const rvP = withTokens(newTP, () => predOnly(0, newTP.length, Object.assign({}, o, { subj: left.subj })));
            if (rvP) rv = rvP; else fail(mrP);
          }
        }
        // The letter was written in English and sent to London（左の be + 過去分詞を右の過去分詞にも及ぼす → 送られた）""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
