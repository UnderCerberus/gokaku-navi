import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# 1) earn a degree → 学位を取得する
rep("""'earn|money income|を|稼ぐ', 'earn|living|を|立てる',""",
    """'earn|money income|を|稼ぐ', 'earn|living|を|立てる', 'earn|degree degrees diploma qualification qualifications|を|取得する', 'get|degree degrees diploma|を|取得する', 'receive|degree degrees diploma|を|取得する',""")

# 2) the first woman in the country to earn a medical degree → 国で初めて医学の学位を取得した女性（first + 名詞 + 前置詞句 + to do）
rep("""        if (/^(?:最初の|最後の|唯一の|[0-9]+番目の)/.test(node.ja) && !gap2.used && verbal(inf.pred) && !inf.neg && T.slice(0, j).some((x) => x.k === 'w' && /^(?:was|were)$/.test(x.w))) return""",
    """        const mFx = /^(.+?)の(最初の|最後の|唯一の)([^の]{1,6})$/.exec(node.ja || '');
        if (mFx && !gap2.used && verbal(inf.pred) && !inf.neg) {
          const pastFx = T.slice(0, j).some((x, q) => x.k === 'w' && (/^(?:was|were)$/.test(x.w) || (isW(x, 'have') && isW(T[q + 1], 'been'))));
          return Object.assign({}, node, { ja: mFx[1] + 'で' + ({ '最初の': '初めて', '最後の': '最後に', '唯一の': '唯一' })[mFx[2]] + inf.parts.join('') + (pastFx ? inf.pred.form('past') : inf.pred.plain()) + mFx[3], end: inf.end });   // the first woman in the country to earn … → 国で初めて〜を取得した女性
        }
        if (/^(?:最初の|最後の|唯一の|[0-9]+番目の)/.test(node.ja) && !gap2.used && verbal(inf.pred) && !inf.neg && T.slice(0, j).some((x) => x.k === 'w' && /^(?:was|were)$/.test(x.w))) return""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
