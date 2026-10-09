import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# teach children who cannot afford private lessons → 個人授業を受ける余裕のない子どもに教える（人の普通名詞 + who は関係詞節）
rep("""    const relNotQ = /^(?:who|which|whom|whose)$/.test(tj.w || '') && !ob.pron && (!ob.an || /^(?:number|numbers|percentage|proportion|rate|share|amount|list|names|name|data|results)$/.test(ob.head || ''));""",
    """    const relNotQ = /^(?:who|which|whom|whose)$/.test(tj.w || '') && !ob.pron && (!ob.an || /^(?:number|numbers|percentage|proportion|rate|share|amount|list|names|name|data|results)$/.test(ob.head || '') || (/^(?:who|whose)$/.test(tj.w || '') && /^(?:teach|help|show|give|offer|send)$/.test(L) && !ob.proper && !!ob.head));   // teach children who cannot afford …（関係詞節）""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
