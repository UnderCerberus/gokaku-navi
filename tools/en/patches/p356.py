import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

rep("""    ja = ja.replace(/中国の万里の長城/g, '万里の長城');""",
    """    ja = ja.replace(/中国の万里の長城/g, '万里の長城');
    ja = ja.replace(/(電話|ベル|チャイム|ドアベル|アラーム|目覚まし時計|目覚まし|サイレン)は鳴(った|る|っていた|っている)/g, '$1が鳴$2');   // The phone rang → 電話が鳴った
    ja = ja.replace(/かつて([0-9０-９]+)(年|か月|週間|日|時間)ごとに/g, '$1$2に1度').replace(/ずっと([0-9０-９]+(?:年|か月|週間|日|時間)(?:以上)?)の間、/g, '$1ずっと').replace(/(?:その|それの)ために([0-9０-９,，.万千百]+(?:円|ドル|ユーロ|ポンド))を(支払|払)/g, 'それに$1を$2');   // once every four years → 4年に1度 / for over twenty years → 20年以上ずっと / paid 3,000 yen for it → それに3000円を払った""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
