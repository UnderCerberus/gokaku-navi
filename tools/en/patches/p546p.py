import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# That made me think carefully before pressing the button → 私にボタンを押す前に注意深く考えさせた
# （使役 make / let の目的語は、中の動詞句に「を」があるときや考える・思う・感じるなどの動詞なら「に」。「私をボタンを押す前に」にしない）
rep("""        const cp = (L === 'make' || L === 'let') && v3.sp === 'SV' ? 'を' : CAUS[L][0];""",
    """        const cp = (L === 'make' || L === 'let') && v3.sp === 'SV' && !(v3.parts || []).some((x) => /を/.test(x)) && !(v3.pred && /^(?:考える|思う|感じる|気づく|理解する|想像する|疑問に思う)$/.test(v3.pred.plain())) ? 'を' : CAUS[L][0];""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
