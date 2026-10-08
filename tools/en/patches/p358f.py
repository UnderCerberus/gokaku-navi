import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

rep("""    if (tokens.some((x) => /^(?:festival|festivals|fair|event|party|carnival|celebration)$/.test(x.w || ''))) ja = ja.replace(""",
    """    if (tokens.some((x) => /^(?:festival|festivals|fair|event|party|carnival|celebration|stand|stands|stall|stalls|booth|booths|prizes|rides)$/.test(x.w || ''))) ja = ja.replace(""")

# You are not allowed to swim here → ここで泳いではいけない
rep("""    ja = ja.replace(/^([^、。]+?)は許されていない(?=。|$)/, '$1は禁止されている')""",
    """    ja = ja.replace(/^((?:あなた|あなたたち)は)?([^、。]*?)([一-龠ァ-ヶー]+する|[一-龠][ぁ-ん]{0,2}(?:る|う|く|ぐ|す|つ|ぬ|ぶ|む))ことは禁止されている(?=。|$)/, (m0, s0, a0, v0) => { try { const pN = P(v0); return verbal(pN) ? a0 + pN.form('te') + 'はいけない' : m0; } catch (eN) { return m0; } });   // You are not allowed to swim here → ここで泳いではいけない
    ja = ja.replace(/^([^、。]+?)は許されていない(?=。|$)/, '$1は禁止されている')""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
