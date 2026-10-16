import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# the gaps between reviews → 復習の間の間隔（between のあとが出来事・回の名詞なら時間の間隔。「復習の間の差」にしない）
rep("""          if (/^(?:gap|gaps)$/.test(node.head || '') && pp.prep === 'between' && pp.obj && /隙間$/.test(ja1) && !/(?:^| )(?:tooth|teeth""",
    """          if (/^(?:gap|gaps)$/.test(node.head || '') && pp.prep === 'between' && pp.obj && /隙間$/.test(ja1) && /^(?:review|reviews|session|sessions|class|classes|lesson|lessons|meal|meals|visit|visits|meeting|meetings|test|tests|exam|exams|practice|practices|breath|breaths|train|trains|bus|buses|flight|flights|game|games|episode|episodes|dose|doses|attempt|attempts|repetition|repetitions)$/.test(pp.obj.head || '')) ja1 = ja1.replace(/隙間$/, '間隔');
          if (/^(?:gap|gaps)$/.test(node.head || '') && pp.prep === 'between' && pp.obj && /隙間$/.test(ja1) && !/(?:^| )(?:tooth|teeth""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
