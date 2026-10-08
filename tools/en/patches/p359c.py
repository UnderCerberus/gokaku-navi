import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# p359b を戻す（だけ を手がかりにする後段の規則が多い）
rep("""        if (obj.num && !obj.year && !obj.clock && !obj.time && (obj.unit || obj.num.pct || (obj.head && MUNIT[obj.head]))) return R(n, 'other', n + 'の');   // rose by 10 percent → 10%上がった（だけ にすると「〜しか」に聞こえる）""",
    """        if (obj.num && !obj.year && !obj.clock && !obj.time && (obj.unit || obj.num.pct || (obj.head && MUNIT[obj.head]))) return R(n + 'だけ', 'other');   // rose by 10 percent / wrong by ten kilometers → 〜だけ""")

# 上がった・下がった・増えた・減った の前の「だけ」は落とす（1.2度上がった / 10%増えた）
rep("""    ja = ja.replace(/中国の万里の長城/g, '万里の長城');""",
    """    ja = ja.replace(/中国の万里の長城/g, '万里の長城');
    ja = ja.replace(/([0-9０-９.]+(?:度|%|パーセント|円|ドル|センチ|センチメートル|メートル|キロ|キログラム|グラム|人|倍))だけ(上が|下が|増え|減っ|減る|増える|上昇|低下|増加|減少|伸び|縮)/g, '$1$2');   // The average temperature has gone up by 1.2 degrees → 1.2度上がった""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
