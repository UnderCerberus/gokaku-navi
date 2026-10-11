import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# the gap between the two schools gradually disappeared → 2つの学校の間の差（gap between + 物でない名詞は「差」。歯・壁・岩などの間なら「隙間」のまま）
rep("""          if (node.head === 'exposure' && pp.prep === 'to' && pp.obj && pp.obj.ja && node.c && node.c.e""",
    """          if (/^(?:gap|gaps)$/.test(node.head || '') && pp.prep === 'between' && pp.obj && /隙間$/.test(ja1) && !/(?:^| )(?:tooth|teeth|wall|walls|door|doors|rock|rocks|stone|stones|tree|trees|building|buildings|board|boards|car|cars|seat|seats|finger|fingers|fence|fences|bar|bars|tile|tiles|brick|bricks|branch|branches|leaf|leaves|plank|planks|floor|floors|cloud|clouds|curtain|curtains)$/.test(pp.obj.head || '')) ja1 = ja1.replace(/隙間$/, '差');
          if (node.head === 'exposure' && pp.prep === 'to' && pp.obj && pp.obj.ja && node.c && node.c.e""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
