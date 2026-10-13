import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# every language reflects a unique way of understanding the world → 世界を理解する独自の方法（unique + 方法・文化・性格などは「独自の・独特の」。「唯一の」にしない）
rep("""  const ADJN = COLL([
    'busy|road roads""",
    """  const ADJN = COLL([
    'unique|way ways culture cultures style styles character characteristic characteristics feature features perspective perspectives view views approach approaches personality personalities identity history tradition traditions taste flavor flavors flavour sound sounds language languages design designs voice voices beauty atmosphere charm system systems pattern patterns shape shapes appearance|独自の',
    'busy|road roads""")

rep("""    if (nom.head === 'way' && !nom.pl && /道$/.test(ja) && /(?:一番いい|最も良い|最もよい|より良い|簡単な|唯一の|良い|よい|別の|""",
    """    if (nom.head === 'way' && !nom.pl && /道$/.test(ja) && /(?:一番いい|最も良い|最もよい|より良い|簡単な|唯一の|独自の|独特の|良い|よい|別の|""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
