import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# require too much space to be grown indoors → スペースを必要としすぎる（量の語・必要の動詞と一緒の space は「宇宙」ではなく「スペース」）
rep("""    if (nom.head === 'space' && /^(?:little|much|enough|more|no|some|less)$/.test(detW) && /宇宙$/.test(ja)) ja = ja.replace(/宇宙$/, 'スペース');""",
    """    if (nom.head === 'space' && (/^(?:little|much|enough|more|no|some|less)$/.test(detW) || T.slice(Math.max(0, i - 3), i).some((x) => /^(?:much|enough|more|little|less|require|requires|required|need|needs|needed|take|takes|took|plenty|lots|save|saves|saved|lack|lacks)$/.test(x.w || ''))) && /宇宙$/.test(ja)) ja = ja.replace(/宇宙$/, 'スペース');""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
