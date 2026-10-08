import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# about 32 million tourists visited Japan → 約3200万人の観光客が
rep("""/^(?:約|およそ|ほぼ)?(?:多くの|たくさんの|大勢の|何人もの|数人の|[0-9０-９]+(?:人|匹|頭|羽)の)/.test(sj.ja)""",
    """/^(?:約|およそ|ほぼ)?(?:多くの|たくさんの|大勢の|何人もの|数人の|[0-9０-９]+(?:万|億|千)?(?:人|匹|頭|羽)の)/.test(sj.ja)""")

rep("""    ja = ja.replace(/世界の(多くの|一部の|さまざまな|ほかの|他の|あらゆる)部分/g, '世界の$1地域');""",
    """    ja = ja.replace(/世界の(多くの|一部の|さまざまな|ほかの|他の|あらゆる)部分/g, '世界の$1地域');
    ja = ja.replace(/^((?:[^、。]{0,12}、)?(?:この|その)?(?:グラフ|表|図|地図|調査|研究|データ|結果)は.+)を示す(。?)$/, '$1を示している$2').replace(/([0-9０-９]+)倍(?:多かった|大きかった)/g, '$1倍だった').replace(/([0-9０-９]+)倍(?:多い|大きい)(?=。|$)/g, '$1倍だ');   // The graph shows … → 示している / almost four times larger → ほぼ4倍だった
    if (!tokens.some((x) => /^(?:mountain|mountains|mt|summit|top|hill|climber|climbers)$/.test(x.w || ''))) ja = ja.replace(/(?:自分の|その|彼らの)?頂上に達/g, 'ピークに達');   // Sales reached their peak in July → 7月にピークに達した""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
