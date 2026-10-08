import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()
old = "    ja = ja.replace(/世界の(多くの|一部の|さまざまな|ほかの|他の|あらゆる)部分/g, '世界の$1地域');"
assert s.count(old) == 1
s = s.replace(old, old + "\n    ja = ja.replace(/^((?:[^、。]{0,12}、)?(?:多くの人々|人々|科学者|専門家|多くの科学者|多くの専門家|研究者|一部の人々|多くの研究者)は.+)と信じている(。?)$/, '$1と考えている$2').replace(/最も一般的な理由/g, '最も多い理由');   // Many people believe that … → …と考えている / The most common reason → 最も多い理由")
io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
