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
      else if (L === 'receive' && /(?:^| )(?:criticism|praise|attention|support|help|treatment|training|education|award|awards|prize|prizes|complaint|complaints|feedback|care|recognition|approval)$/.test(oh)) sense = { particle: 'を', core: '受ける', tr: true };   // received a lot of criticism → 多くの批判を受けた""")

rep("""    ja = ja.replace(/注意深くなる必要/g, '気をつける必要')""",
    """    if (!tokens.some((x, q) => /^(?:struggle|struggles|struggled|struggling)$/.test(x.w || '') && tokens[q + 1] && /^(?:to|with|against)$/.test(tokens[q + 1].w || ''))) ja = ja.replace(/もがいて(いる|いた)/g, '苦しんで$1');   // Many farmers are struggling → 苦しんでいる
    ja = ja.replace(/地震の後に回復で/g, '地震後の復興で').replace(/(災害|地震|津波|台風|洪水)の後の回復/g, '$1後の復興').replace(/(ワクチン|薬|治療法|問題|計画|プロジェクト|新製品)で働いて(いる|いた)/g, '$1に取り組んで$2').replace(/たくさんの批判を受け取/g, '多くの批判を受け');   // played a key role in the recovery after the earthquake → 地震後の復興で / working on a vaccine → ワクチンに取り組んでいる
    ja = ja.replace(/注意深くなる必要/g, '気をつける必要')""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
