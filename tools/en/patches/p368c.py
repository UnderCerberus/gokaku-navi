import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

rep("""joule: 'ジュール', volt: 'ボルト', watt: 'ワット', point: 'ポイント' });""",
    """joule: 'ジュール', volt: 'ボルト', watt: 'ワット', point: 'ポイント', ml: 'mL', cc: 'cc', cm: 'cm', mm: 'mm', km: 'km', kg: 'kg' });""")

rep("""    ja = ja.replace(/中国の万里の長城/g, '万里の長城');""",
    """    ja = ja.replace(/中国の万里の長城/g, '万里の長城');
    ja = ja.replace(/(水|お湯|油|アルコール|酢|牛乳)で(簡単に|すぐに|よく)?溶け/g, '$1に$2溶け').replace(/に(簡単に|すぐに|よく)溶け/g, 'に$1溶け');   // Salt dissolves easily in water → 塩は水に簡単に溶ける""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
