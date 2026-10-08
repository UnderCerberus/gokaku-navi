import io, re
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# 語を差し替えるときは解析のキャッシュ（an）を捨てる（前の規則が only などを解析済みだと wish が副詞のままになる）
rep("""      const ifTok = T[0].w === 'if' ? [Object.assign({}, tokens[0], { w: 'i', raw: 'I', cap: true, first: true }), Object.assign({}, tokens[1], { w: 'wish', raw: 'wish', cap: false, first: false })] : [Object.assign({}, tokens[0], { w: 'if', raw: 'If', cap: true, first: true })];""",
    """      const ifTok = T[0].w === 'if' ? [Object.assign({}, tokens[0], { w: 'i', s: 'I', raw: 'I', cap: true, first: true, an: undefined }), Object.assign({}, tokens[1], { w: 'wish', s: 'wish', raw: 'wish', cap: false, first: false, an: undefined })] : [Object.assign({}, tokens[0], { w: 'if', s: 'If', raw: 'If', cap: true, first: true, an: undefined })];""")

rep("""        const tRm = tokens.slice(0, kRm).concat([Object.assign({}, tokens[kRm], { w: wRm, s: wRm, raw: wRm }), Object.assign({}, tokens[kRm], { w: 'still', s: 'still', raw: 'still' })])""",
    """        const tRm = tokens.slice(0, kRm).concat([Object.assign({}, tokens[kRm], { w: wRm, s: wRm, raw: wRm, an: undefined }), Object.assign({}, tokens[kRm], { w: 'still', s: 'still', raw: 'still', an: undefined })])""")

rep("""Object.assign({}, tokens[kRf + 1], { w: pastRf ? 'felt' : 'feel', s: pastRf ? 'felt' : 'feel', raw: pastRf ? 'felt' : 'feel' })""",
    """Object.assign({}, tokens[kRf + 1], { w: pastRf ? 'felt' : 'feel', s: pastRf ? 'felt' : 'feel', raw: pastRf ? 'felt' : 'feel', an: undefined })""")

rep("""        tNm[b - 1] = Object.assign({}, tNm[b - 1], { w: 'zqpetname', s: WNAME[tlN.w] || KATA_N[tlN.w], cap: true });""",
    """        tNm[b - 1] = Object.assign({}, tNm[b - 1], { w: 'zqpetname', s: WNAME[tlN.w] || KATA_N[tlN.w], cap: true, an: undefined });""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
