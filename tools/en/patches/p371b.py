import io, re
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

# 形容詞の特別な訳（tall / cold / hot / serious）でも最上級の印 sup を立てる（the tallest tower in Japan → 日本で最も高い塔）
olds = [
    ("return { ja: pre + (a.form === 'comp' ? 'より' : (a.form === 'sup' ? '最も' : '')) + '高い', end: j + 1, te: '高くて' }; }   // tall trees",
     "return { ja: pre + (a.form === 'comp' ? 'より' : (a.form === 'sup' ? '最も' : '')) + '高い', end: j + 1, te: '高くて', sup: a.form === 'sup' }; }   // tall trees"),
    ("return { ja: (a.form === 'comp' ? 'より' : (a.form === 'sup' ? '最も' : '')) + '寒い', end: j + 1, te: '寒くて' }; }",
     "return { ja: (a.form === 'comp' ? 'より' : (a.form === 'sup' ? '最も' : '')) + '寒い', end: j + 1, te: '寒くて', sup: a.form === 'sup' }; }"),
    ("return { ja: (a.form === 'comp' ? 'より' : (a.form === 'sup' ? '最も' : '')) + '暑い', end: j + 1, te: '暑くて' }; }",
     "return { ja: (a.form === 'comp' ? 'より' : (a.form === 'sup' ? '最も' : '')) + '暑い', end: j + 1, te: '暑くて', sup: a.form === 'sup' }; }"),
    ("return { ja: pre + (a.form === 'comp' ? 'より' : (a.form === 'sup' ? '最も' : '')) + '深刻な', end: j + 1 }; }   // a serious problem",
     "return { ja: pre + (a.form === 'comp' ? 'より' : (a.form === 'sup' ? '最も' : '')) + '深刻な', end: j + 1, sup: a.form === 'sup' || /最も$/.test(pre) }; }   // a serious problem"),
]
for old, new in olds:
    n = s.count(old)
    assert n == 1, (n, old[:60])
    s = s.replace(old, new)

old = "    ja = ja.replace(/^(春|夏|秋|冬)に、/, '$1には、');"
assert s.count(old) == 1
s = s.replace(old, old + "\n    ja = ja.replace(/(あなた|彼|彼女|君)が聞こえ(ない|なかった|ますか|ません)/g, '$1の声が聞こえ$2');   // I can't hear you → あなたの声が聞こえない")
io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
