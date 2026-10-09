import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# Don't tell anyone about this → これについて誰にも話してはいけません（否定の命令文の目的語の any も否定の形）
rep("""    const vp = vpNonfin(j, e, 'base', { imp: true });""",
    """    const vp = vpNonfin(j, e, 'base', { imp: true, negCtx: neg });""")
rep("""nonfin: true, imp: !!(o && o.imp), negCtx: neg };""",
    """nonfin: true, imp: !!(o && o.imp), negCtx: neg || !!(o && o.negCtx) };""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
