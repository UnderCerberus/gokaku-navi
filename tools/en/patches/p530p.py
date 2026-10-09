import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# keep their students' attention through a screen → 画面を通して（through + 画面・電話・インターネットなどの媒体は手段の「を通して」。を通って にしない）
rep("""      case 'through':
""",
    """      case 'through':
        if (obj.head && !obj.pron && (MEDIA[obj.head] || /^(?:screen|screens|window|windows|letter|letters|email|emails|message|messages|book|books|story|stories|music|art|language|media|camera|cameras|lens|microscope|telescope|video|videos)$/.test(obj.head)) && !/^(?:window|windows)$/.test(obj.head || '')) return R(n + 'を通して', 'other', n + 'を通した');
""")

# ask questions in the chat → チャットで（オンライン・画面の文脈の chat は チャット）
rep("""    if (node && !node.pron && node.end >= 1 && isW(T[node.end - 1], 'strengths') && /力$/.test(node.ja || '')) node = Object.assign({}, node, { ja: node.ja.replace(/力$/, '長所') });""",
    """    if (node && !node.pron && node.end >= 1 && isW(T[node.end - 1], 'strengths') && /力$/.test(node.ja || '')) node = Object.assign({}, node, { ja: node.ja.replace(/力$/, '長所') });
    if (node && !node.pron && node.end >= 1 && isW(T[node.end - 1], 'chat') && /おしゃべり$/.test(node.ja || '') && T.some((x) => x.k === 'w' && /^(?:online|internet|screen|screens|computer|computers|app|apps|video|zoom|message|messages|type|typed|typing|classes|class|lessons)$/.test(x.w))) node = Object.assign({}, node, { ja: node.ja.replace(/おしゃべり$/, 'チャット') });""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
