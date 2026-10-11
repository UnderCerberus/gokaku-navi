import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# keeping the volume of music down → 音楽の音量を抑える（volume of + 音の名詞は「音量」）
rep("""    space: { shelf: '場所', room: '場所', desk: '場所', table: '場所', floor: '場所', bag: '場所', box: '場所' },""",
    """    space: { shelf: '場所', room: '場所', desk: '場所', table: '場所', floor: '場所', bag: '場所', box: '場所' }, volume: { music: '音量', sound: '音量', sounds: '音量', tv: '音量', television: '音量', radio: '音量', voice: '音量', voices: '音量', speaker: '音量', speakers: '音量', stereo: '音量', headphones: '音量', song: '音量', songs: '音量' },""")
rep("""        if (node.head === 'speaker' && inner.head && (LANGS[inner.head] || inner.head === 'language')) node = Object.assign({}, node, { ja: node.ja.replace(/話す人(たち)?$/, '話者$1') });""",
    """        if (node.head === 'speaker' && inner.head && (LANGS[inner.head] || inner.head === 'language')) node = Object.assign({}, node, { ja: node.ja.replace(/話す人(たち)?$/, '話者$1') });
        if (node.head === 'volume' && inner.head && CTX_N.volume[inner.head] && /(?:^|[^音])量$/.test(node.ja)) node = Object.assign({}, node, { ja: node.ja.replace(/量$/, '音量') });""")

# He kept his head down → 頭を下げたままにした（体の部分の keep ~ down は「抑える」にしない）
rep("""        r = done(vg, P(jaSp.replace('〜', a.ja)), st, tail(a.end + 1, lim, st, o, vg), 'SVO', o, [], { noStative: true });""",
    """        const jaSp2 = it.it && /^keep (?:down ~|~ down)$/.test(it.it.phrase) && /^(?:head|heads|eyes|eye|hand|hands|arm|arms|chin|face|faces)$/.test(a.head || '') ? '〜を下げたままにする' : jaSp;
        r = done(vg, P(jaSp2.replace('〜', a.ja)), st, tail(a.end + 1, lim, st, o, vg), 'SVO', o, [], { noStative: true });""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
