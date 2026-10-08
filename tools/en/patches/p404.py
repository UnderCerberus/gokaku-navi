import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

rep("""      else if (L === 'skip' && /(?:^| )(?:breakfast|lunch|dinner|meal|meals|supper)$/.test(oh)) sense = { particle: 'を', core: '抜く', tr: true };""",
    """      else if (L === 'skip' && /(?:^| )(?:breakfast|lunch|dinner|meal|meals|supper)$/.test(oh)) sense = { particle: 'を', core: '抜く', tr: true };
      else if (L === 'introduce' && /(?:^| )(?:rule|rules|system|systems|law|laws|tax|taxes|policy|policies|technology|technologies|program|programs|measure|measures|service|services|plan|plans|method|methods)$/.test(oh)) sense = { particle: 'を', core: '導入する', tr: true };   // introduce a new rule → 新しい規則を導入する""")

rep("""    ja = ja.replace(/注意深くなる必要/g, '気をつける必要')""",
    """    if (tokens.some((x, q) => x.w === 'well' && tokens[q - 1] && /ing$/.test(tokens[q - 1].w || ''))) ja = ja.replace(/^([^、。]{1,10}?ことは)([^、。]+?と)よく言われている/, 'よく$1$2言われている');   // It is said that sleeping well improves memory → よく眠ることは記憶力を高めると言われている
    ja = ja.replace(/(規則|ルール|制度|法律|税|政策|システム|技術|サービス)は([^、。]{0,12}?)紹介され/g, '$1は$2導入され').replace(/のその(?=[^、。]{0,4}(?:大きい|大規模な|コレクション|歴史|美しさ|形|色))/g, 'の').replace(/大きいコレクション/g, '大規模なコレクション');   // The new rule will be introduced → 導入される / its large collection of paintings → 絵画の大規模なコレクション
    if (tokens.some((x, q) => x.w === 'city' && tokens[q - 1] && tokens[q - 1].w === 'the') && tokens.some((x) => /^(?:decided|decide|decides|plans|plan|planned|built|build|builds|announced|announces|government|council|mayor|official|officials|budget)$/.test(x.w || ''))) ja = ja.replace(/^都市は/, '市は');   // The city decided to build → 市は
    ja = ja.replace(/注意深くなる必要/g, '気をつける必要')""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
