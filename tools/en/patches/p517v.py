import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# could not remember where she had put her keys → どこに鍵を置いたか思い出せなかった（can / could + remember + 疑問詞節は 思い出す）
rep(""" && inanW ? P('示す', 'v5') : (/^(?:realize|realise)$/.test(L) ? P('分かる', 'v5') : P(sn2.core)))));""",
    """ && inanW ? P('示す', 'v5') : (/^(?:realize|realise)$/.test(L) ? P('分かる', 'v5') : (L === 'remember' && /^(?:can|could)$/.test(vg.modal || '') ? P('思い出す', 'v5') : P(sn2.core))))));""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
