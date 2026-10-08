import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

rep("""'for half an hour': '30分間', 'at first sight': '一目で', """,
    """'for half an hour': '30分間', 'at first sight': '一目で', 'slowly but steadily': 'ゆっくりだが着実に', 'slowly but surely': 'ゆっくりだが着実に', 'before dark': '暗くなる前に', 'after dark': '暗くなってから', """)

rep("""    ja = ja.replace(/家まで急(いだ|ぐ)/, (m0, a0) => '急いで家に帰' + (a0 === 'いだ' ? 'った' : 'る'));""",
    """    ja = ja.replace(/家まで急(いだ|ぐ)/, (m0, a0) => '急いで家に帰' + (a0 === 'いだ' ? 'った' : 'る'));
    ja = ja.replace(/に手が届こうと/g, 'に手を伸ばそうと').replace(/助けのために叫/g, '助けを求めて叫').replace(/誰も(彼|彼女|私|私たち|彼ら)が聞こえなかった/, '誰にも$1の声が聞こえなかった').replace(/オオカミを泣いた/g, '「オオカミが来た」とうそをついた');   // tried to reach the grapes / shouted for help / no one heard him / the boy who cried wolf
    if (tokens.filter((x) => x.k === 'w').slice(-1).map((x) => x.w)[0] === 'inside') ja = ja.replace(/中の([^、。]{1,10}?)を見つけ/, '中に$1を見つけ');   // found a small key inside → 中に小さい鍵を見つけた
    ja = ja.replace(/音が([^、。]{1,10}?)から来(た|る)/, (m0, a0, b0) => '音が' + a0 + 'から聞こえて' + (b0 === 'た' ? 'きた' : 'くる')).replace(/空の中に(飛|舞)/g, '空へ$1');   // a strange sound came from the forest → 森から聞こえてきた / flew away into the sky → 空へ飛び去った
    ja = ja.replace(/([^、。]{1,10}?)のためにあちこち探し求めた/, 'あちこち$1を探した').replace(/失われた(指輪|鍵|財布|かばん|時計|帽子|傘|手袋|カメラ)/g, 'なくした$1').replace(/失われた(犬|猫|子ども|子供)/g, '迷子の$1');   // They searched everywhere for the lost ring → あちこちなくした指輪を探した""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
