import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# Max who never barked at anyone → 誰にもほえなかった / He did not bark at anyone → 誰にもほえなかった（否定の文の前置詞 + anyone / anything → 誰にも・何にも。「誰かに」にしない）
rep("""      if (pp) {
        // cut the cake into four pieces / sort the trash into three groups / turn water into ice（変化・分割の結果の into → 〜に）""",
    """      if (pp) {
        if (pp.obj && pp.obj.any && /^(?:誰も|何も)$/.test(pp.obj.any) && (st.neg || st.vgNeg || st.vgNever || st.vgHardly) && pp.obj.ja && pp.ja.indexOf(pp.obj.ja) === 0 && /^(?:に|と|から|で|へ|について|に対して)$/.test(pp.ja.slice(pp.obj.ja.length))) pp.ja = pp.obj.any.replace(/も$/, '') + pp.ja.slice(pp.obj.ja.length) + 'も';
        // cut the cake into four pieces / sort the trash into three groups / turn water into ice（変化・分割の結果の into → 〜に）""")

# She never talks to anyone → 決して誰とも話さない（never の文の目的語の any 語も 誰も・何も）
rep("""    if (n.any && (st.neg || st.vgNeg || st.vgHardly) && /^(?:誰も|何も)$/.test(n.any) && /^(?:に|と|から|で)$/.test(particle || '')) return n.any.replace(/も$/, particle + 'も');   // tell anyone → 誰にも
    if (n.any && (st.neg || st.vgNeg || st.vgHardly)) return (n.infS ? n.infS + 'ものを' : '') + n.any;""",
    """    if (n.any && (st.neg || st.vgNeg || st.vgHardly || st.vgNever) && /^(?:誰も|何も)$/.test(n.any) && /^(?:に|と|から|で)$/.test(particle || '')) return n.any.replace(/も$/, particle + 'も');   // tell anyone → 誰にも
    if (n.any && (st.neg || st.vgNeg || st.vgHardly || st.vgNever)) return (n.infS ? n.infS + 'ものを' : '') + n.any;""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
