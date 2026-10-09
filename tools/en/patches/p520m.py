import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# The problem with relying solely on test scores → もっぱら試験の得点に頼ることの問題（problem with + 動名詞も の。rely solely on → もっぱら）
rep("""(pp.prep === 'with' && pp.obj && node.head && /^(?:problem|problems|trouble|matter|difficulty|issue|issues|thing)$/.test(node.head) ? pp.obj.ja + 'の' : """,
    """(pp.prep === 'with' && pp.obj && node.head && /^(?:problem|problems|trouble|matter|difficulty|issue|issues|thing)$/.test(node.head) ? pp.obj.ja + 'の' : (pp.prep === 'with' && !pp.obj && node.head && /^(?:problem|problems|trouble|difficulty|issue|issues)$/.test(node.head) && /ことでの$/.test(pp.adn || '') ? pp.adn.replace(/での$/, 'の') : """)
rep("""(pp.prep === 'with' && pp.obj && node.head && /^(?:relationship|relationships|relation|relations|connection|connections|contact|experience|experiences|conversation|meeting|friendship)$/.test(node.head) ? pp.obj.ja + 'との' : pp.adn));""",
    """(pp.prep === 'with' && pp.obj && node.head && /^(?:relationship|relationships|relation|relations|connection|connections|contact|experience|experiences|conversation|meeting|friendship)$/.test(node.head) ? pp.obj.ja + 'との' : pp.adn)));""")
rep("""largely: /^(?:depend|rely)$/.test(vg.lemma) ? '主に' : null };""",
    """largely: /^(?:depend|rely)$/.test(vg.lemma) ? '主に' : null, solely: 'もっぱら', exclusively: 'もっぱら', entirely: /^(?:depend|rely)$/.test(vg.lemma) ? '完全に' : null, mainly: '主に', mostly: '主に', primarily: '主に', partly: '部分的に' };""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
