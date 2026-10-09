import io
# 辞書の語順: focus（動）は「集中する」先頭（focus on ~ → 〜に集中する、目的語なし → 集中する）、instrument は「楽器」先頭（play an instrument）
p = r'C:\Claude\gokaku-navi\js\data\dict-a-l.js'
s = io.open(p, encoding='utf-8').read()
for old, new in (("    ['focus', '動', '焦点を合わせる; 集中する', 1],", "    ['focus', '動', '集中する; 焦点を合わせる', 1],"),
                 ("    ['instrument', '名', '器具; 楽器', 2],", "    ['instrument', '名', '楽器; 器具', 2],")):
    assert s.count(old) == 1, old
    s = s.replace(old, new)
io.open(p, 'w', encoding='utf-8', newline='\n').write(s)

p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# Many lives were saved / lose their lives → 命（life の複数形 + save / lose / claim / cost / risk のある文）
rep("""    if (!cnt) return fail(m);
    for (let x = i; x < j - 1 && head; x++) {""",
    """    if (!cnt) return fail(m);
    if (head === 'life' && pl && /(?:生活|人生)$/.test(ja) && T.some((x) => x.k === 'w' && /^(?:save|saves|saved|saving|lose|loses|lost|losing|claim|claims|claimed|claiming|cost|costs|costing|risk|risks|risked|risking|endanger|endangers|endangered|threaten|threatens|threatened)$/.test(x.w))) ja = ja.replace(/(?:生活|人生)$/, '命');
    for (let x = i; x < j - 1 && head; x++) {""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
