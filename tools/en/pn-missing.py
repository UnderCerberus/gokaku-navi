"""固有名詞の候補のうち、PN（syntax.js）にも辞書にもないものを表示する: python tools/en/pn-missing.py "key|訳" "key|訳" …
（プロジェクト直下で実行。--add をつけると PN の先頭に足す）"""
import io
import re
import sys

syn = 'js/english/syntax.js'
s = io.open(syn, encoding='utf-8').read()
dic = io.open('js/data/dict-a-l.js', encoding='utf-8').read() + io.open('js/data/dict-m-z.js', encoding='utf-8').read()
i = s.index('  const PN = dic({')
j = s.index('});', i)
pn = s[i:j]
add = '--add' in sys.argv
items = []
for arg in sys.argv[1:]:
    if arg == '--add':
        continue
    k, ja = arg.split('|')
    inPN = re.search(r"[{ ,]'?%s'?: '" % re.escape(k), pn) is not None
    inDic = ("['%s', '名'" % k) in dic
    if inPN or inDic:
        print('exists:', k, '(PN)' if inPN else '(dict)')
    else:
        items.append((k, ja))
        print('missing:', k, ja)
if add and items:
    body = ', '.join(("'%s': '%s'" % (k, ja)) if (' ' in k or '-' in k) else ("%s: '%s'" % (k, ja)) for k, ja in items)
    s = s.replace('  const PN = dic({', '  const PN = dic({ ' + body + ',', 1)
    io.open(syn, 'w', encoding='utf-8', newline='\n').write(s)
    print('added', len(items))
