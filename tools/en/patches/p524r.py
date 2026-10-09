import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# This topic is not easy to talk about → この話題について話すのは / He is not easy to work with → 彼と働くのは
# 関係詞・tough の空所が前置詞の目的語なら、その助詞を空所に記録する（tough の否定形で主語につける）
rep("""        if (o.gap.rel) return { ja: '', adn: '', end: j, kind: 'other', prep: key, obj: null };
        const r0 = ppJa(key, o.gap.node, o);""",
    """        if (o.gap.rel) { o.gap.part = ({ to: 'に', with: 'と', about: 'について', on: 'に', in: 'に', at: 'を', for: 'を', from: 'から', into: 'に' })[key] || ''; return { ja: '', adn: '', end: j, kind: 'other', prep: key, obj: null }; }
        const r0 = ppJa(key, o.gap.node, o);""")
rep("""        const ja = obj.ja ? (obj.bare ? jaT.replace(/〜を/, obj.ja) : jaT).replace('〜', obj.ja) : it.ja.replace(/〜(?:を|に|が|と|の)?/, '');   // 何でも（bare）は「を」を付けない""",
    """        if (!obj.ja && o.gap && o.gap.rel) o.gap.part = (/〜(について|に対して|として|から|まで|より|を|に|が|と|の|で)/.exec(it.ja) || [])[1] || '';
        const ja = obj.ja ? (obj.bare ? jaT.replace(/〜を/, obj.ja) : jaT).replace('〜', obj.ja) : it.ja.replace(/〜(?:について|に対して|として|を|に|が|と|の)?/, '');   // 何でも（bare）は「を」を付けない""")
rep("""            if (TOUGH[a.lemma] && verbal(pv) && vg.neg && gap.used) { const spTg = inf3.vg && inf3.vg.e ? verbSense(inf3.vg.e, true).particle : ''; st.subjWo = /^(?:に|と|から)$/.test(spTg || '') ? spTg : 'を'; }""",
    """            if (TOUGH[a.lemma] && verbal(pv) && vg.neg && gap.used) { const spTg = gap.part !== undefined ? gap.part : (inf3.vg && inf3.vg.e ? verbSense(inf3.vg.e, true).particle : ''); st.subjWo = /^(?:に|と|から|について)$/.test(spTg || '') ? spTg : 'を'; }""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
