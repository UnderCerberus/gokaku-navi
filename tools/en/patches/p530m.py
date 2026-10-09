import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# 重要なと判断される → 重要だと判断される（既存の置換を 判断 / 分かる にも効くように直す）
rep(""")な(とは限らない|と(?:思|言|考|信|感|みな)|ということ)', 'g'), '$1だ$2')""",
    """)な(とは限らない|と(?:思|言|考|信|感|みな|判断|分か)|ということ)', 'g'), '$1だ$2')""")

# hold most classes in person while offering recorded lessons → 録画した授業を提供しながら（文中の while / when + -ing は節に区切らず、述語の後ろの句として読む）
rep("""    if (t.w === 'while' && j > 0 && T[j - 1].k === 'w' && /^(?:a|little|short|long|good|great)$/.test(T[j - 1].w)) return null;   // It took a while（名詞の while）""",
    """    if (t.w === 'while' && j > 0 && T[j - 1].k === 'w' && /^(?:a|little|short|long|good|great)$/.test(T[j - 1].w)) return null;   // It took a while（名詞の while）
    if (/^(?:while|when)$/.test(t.w) && j > 1 && T[j + 1] && T[j + 1].k === 'w' && !!vc(T[j + 1], ['ing']) && !nounC(T[j + 1]) && !isP(T[j - 1], ',') && !T.slice(j + 2, b).some((x) => x.k === 'w' && (!!BE[x.w] || !!MODAL[x.w] || (!!vc(x, ['3sg', 'past']) && !nounC(x))))) return null;   // hold classes in person while offering recorded lessons""")

# Memories that are judged important are strengthened, while others are allowed to fade → ほかの記憶は（others は主節の主語の名詞を受ける。他の人たち にしない）
rep("""        // A short waggle sends …, while a long one sends … → 短い揺れは…に送るのに対して、長いものは…（対比の while）""",
    """        if (/^(?:while|whereas)$/.test(s2.key) && sc4.subj && sc4.subj.pron === 'others' && mn4.subj && !mn4.subj.pron && !mn4.subj.an && mn4.subj.head && !isW(T[a], 'some')) {
          let hOt = '';
          for (let x = a; x < j; x++) { const cO = T[x].k === 'w' ? nounC(T[x]) : null; if (cO && cO.lemma === mn4.subj.head && cO.e) { hOt = en.jp.first(cO.e.ja); break; } }
          if (hOt) { const nodeOt2 = Object.assign({}, mn4); nodeOt2.out = (z) => mn4.out(Object.assign({}, z || {}, { form: 'attr' })) + 'のに対して、' + sc4.out({}).replace(/^他の人たち/, 'ほかの' + hOt); return wrap(nodeOt2); }
        }
        // A short waggle sends …, while a long one sends … → 短い揺れは…に送るのに対して、長いものは…（対比の while）""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
