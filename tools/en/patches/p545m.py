import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# pictures that my grandfather had taken → 祖父が撮った写真 / Each picture I take → 私が撮るそれぞれの写真 / the medicine I took → 私が飲んだ薬
# （関係詞の穴が take の目的語で、先行詞が写真・動画なら「撮る」、薬なら「飲む」。名詞の「絵」も「写真」に）
rep("""      else if (L === 'take' && /^(?:bus|buses|train|trains|taxi|taxis|subway|plane|flight|ferry)$/.test(gaA)) sense = { particle: 'に', core: '乗る', tr: true };""",
    """      else if (L === 'take' && /^(?:bus|buses|train|trains|taxi|taxis|subway|plane|flight|ferry)$/.test(gaA)) sense = { particle: 'に', core: '乗る', tr: true };
      else if (L === 'take' && /^(?:picture|pictures|photo|photos|photograph|photographs|shot|shots|video|videos|selfie|selfies|snapshot|snapshots)$/.test(gaA)) sense = { particle: 'を', core: '撮る', tr: true };
      else if (L === 'take' && /^(?:medicine|medicines|pill|pills|tablet|tablets|vitamin|vitamins|drug|drugs)$/.test(gaA)) sense = { particle: 'を', core: '飲む', tr: true };""")
rep("""    const fin = (str, nm) => { name(nm); if (everSup && /^relative/.test(nm || '')) str = str.replace(/([たか]|ん)だことが(?:ある|あった)$/, '$1だ').replace(/たことが(?:ある|あった)$/, 'た').replace(/今までに/, '今まで') + '中で'; return Object.assign({}, node, { ja: (/^まさに/.test(headJa) ? 'まさに' + str + headJa.replace(/^まさに/, '') : str + (everSup && /^relative/.test(nm || '') ? supHead : headJa)),""",
    """    const fin = (str, nm) => { name(nm); if (everSup && /^relative/.test(nm || '')) str = str.replace(/([たか]|ん)だことが(?:ある|あった)$/, '$1だ').replace(/たことが(?:ある|あった)$/, 'た').replace(/今までに/, '今まで') + '中で'; const hJa = /^(?:picture|pictures)$/.test(node.head || '') && /撮(?:る|った|っていた|っている|ってきた)$/.test(str) ? headJa.replace(/絵$/, '写真') : headJa; return Object.assign({}, node, { ja: (/^まさに/.test(hJa) ? 'まさに' + str + hJa.replace(/^まさに/, '') : str + (everSup && /^relative/.test(nm || '') ? supHead : hJa)),""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
