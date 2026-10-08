import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

rep("""    ja = ja.replace(/注意深くなる必要/g, '気をつける必要')""",
    """    {
      const wTs = tokens.filter((x) => x.k === 'w');
      if (wTs.length > 2 && wTs[wTs.length - 1].w === 'too' && !/^(?:much|many)$/.test(wTs[wTs.length - 2].w || '') && !/(?:も|もまた)/.test(ja.slice(0, 6))) ja = ja.replace(/^(私|彼|彼女|私たち|彼ら|あなた|僕)は/, '$1も');   // I want to go there too → 私もそこに行きたい（不定詞の中の too が落ちていた）
    }
    ja = ja.replace(/^あなたの(週末|休み|旅行|夏休み|冬休み|春休み|一日|テスト|試験|誕生日|休暇|休日|連休)は(どう|いかが)/, '$1は$2');   // How was your weekend? → 週末はどうでしたか
    ja = ja.replace(/注意深くなる必要/g, '気をつける必要')""")

rep("""  const NAME_JA = dic({""",
    """  const NAME_JA = dic({ takao: '高尾', tsukuba: '筑波', rokko: '六甲', zao: '蔵王', aso: '阿蘇', bandai: '磐梯', kurama: '鞍馬', asama: '浅間', tateyama: '立山', ontake: '御嶽', """)

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
