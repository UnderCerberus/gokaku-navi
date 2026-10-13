import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# I no longer trust anyone → もはや誰も信頼しない（no longer の文の any 語も否定の 誰も・何も。「誰かを信頼しない」にしない）
rep("""vgHardly: !!(vg && vg.advs && vg.advs.some((x) => /^(?:hardly|scarcely)$/.test(x.w))),""",
    """vgHardly: !!(vg && vg.advs && vg.advs.some((x) => /^(?:hardly|scarcely|nolonger)$/.test(x.w))),""")

# He doesn't depend on anyone → 誰にも頼っていない / She never talks to anyone → 決して誰とも話さない / I didn't look for anything → 何も探さなかった
# （否定の文の熟語の目的語の anyone / anything は 誰も・何も + 熟語の助詞。「誰かに頼っていない」「何かを探さなかった」にしない）
rep("""        const ja = obj.ja ? (obj.bare ? jaT.replace(/〜を/, obj.ja) : jaT).replace('〜', obj.ja) : it.ja.replace(/〜(?:について|に対して|として|を|に|が|と|の)?/, '');   // 何でも（bare）は「を」を付けない""",
    """        if (obj.ja && !obj.bare && !obj.infS && obj.any && /^(?:誰も|何も)$/.test(obj.any) && !isW(T[obj.end], 'in') && (st.neg || st.vgNeg || st.vgNever || st.vgHardly)) jaT = obj.any === '誰も' && /〜の言うことを/.test(jaT) ? jaT.replace('〜の言うことを', '誰の言うことも') : jaT.replace(/〜(について|から|を|に|と|で)/, (m0, pt) => pt === 'を' ? obj.any : obj.any.replace(/も$/, pt + 'も'));   // He didn't listen to anyone → 誰の言うことも聞かなかった
        const ja = obj.ja ? (obj.bare ? jaT.replace(/〜を/, obj.ja) : jaT).replace('〜', obj.ja) : it.ja.replace(/〜(?:について|に対して|として|を|に|が|と|の)?/, '');   // 何でも（bare）は「を」を付けない""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
