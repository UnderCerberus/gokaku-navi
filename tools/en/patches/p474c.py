import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

rep("""    ja = ja.replace(/知識の隙間/g, '知識の空白')""",
    """    ja = ja.replace(/^(.+?)以来、([0-9０-９]+(?:年|か月|日|週間|時間|分))は過ぎている。$/, '$1から$2がたった。');   // Ten years have passed since he died → 彼が死んでから10年がたった
    ja = ja.replace(/ベッドに(ずっと)?病気だった/g, '$1病気で寝ていた').replace(/ベッドに(ずっと)?病気だ/g, '$1病気で寝ている');   // has been sick in bed → ずっと病気で寝ている
    if (tokens.some((x, k) => x.w === 'being' && tokens[k + 1] && tokens[k + 1].w === 'done')) ja = ja.replace(/されている/, '行われている');   // The work is being done now → 仕事は今行われている
    ja = ja.replace(/知識の隙間/g, '知識の空白')""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
