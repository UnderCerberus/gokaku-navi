import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# Many species display complex behaviors（複数形と同じ形の名詞 species / sheep などのあとの原形 + 名詞句は動詞。複合名詞にしない）
rep("""      // the students walk to school / students use the bus（複数名詞のあとの原形 + 限定詞・前置詞は動詞。複合名詞にしない）
""", """      if (cnt > 0 && /^(?:species|series|deer|sheep|fish|aircraft|offspring|cattle|police|crew|staff)$/.test(head || '') && !!vc(t, ['base']) && j + 1 < lim && T[j + 1].k === 'w' && (DET[T[j + 1].w] !== undefined || (!!adjC(T[j + 1]) && !nounC(T[j + 1])) || (PRON[T[j + 1].w] && !PRON[T[j + 1].w].sub) || (j + 2 < lim && !!adjC(T[j + 1]) && T[j + 2].k === 'w' && !!nounC(T[j + 2])))) break;   // Many species display complex behaviors → 多くの種が複雑な行動を示す
      // the students walk to school / students use the bus（複数名詞のあとの原形 + 限定詞・前置詞は動詞。複合名詞にしない）
""")

# Elephants were standing near the river → 立っていた（動物の主語は「置いてある」にしない）
rep("""    if (vg.lemma === 'stand' && /^立つ$/.test(p.plain()) && sj && !anim && !(sj.pron && PRON[sj.pron] && PRON[sj.pron].an) && !/^(?:building|buildings""",
    """    if (vg.lemma === 'stand' && /^立つ$/.test(p.plain()) && sj && !anim && !(sj.pron && PRON[sj.pron] && PRON[sj.pron].an) && !/^(?:匹|頭|羽)$/.test(COUNTER[sj.head || ''] || COUNTER[(sj.head || '').replace(/s$/, '')] || COUNTER[(sj.head || '').replace(/es$/, '')] || '') && !/^(?:animal|animals|bird|birds|elephant|elephants|giraffe|giraffes|deer|horse|horses|cow|cows|bear|bears|monkey|monkeys|penguin|penguins|dog|dogs|cat|cats)$/.test(sj.head || '') && !/^(?:building|buildings""")

# The bird was heard singing → 鳥が鳴いているのが聞こえた（heard は「聞かれた」にしない）
rep("""            const passOb = /か$/.test(vOb) ? vOb + 'れ' : vOb + 'され';""",
    """            const passOb = T[kOb].w === 'heard' ? '聞こえ' : (/か$/.test(vOb) ? vOb + 'れ' : vOb + 'され');""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
