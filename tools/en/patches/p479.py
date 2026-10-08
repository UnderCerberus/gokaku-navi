import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# It had a similar impact on how information is shared（過去分詞の直前が be 動詞なら、その節の受け身。have A done にしない）
rep("""        if (vf === 'pp' && v2.vg && /^(?:name|call)$/.test(v2.vg.lemma)) { fail(m); continue; }      // a cat named Momo は使役ではない""",
    """        if (vf === 'pp' && v2.vg && /^(?:name|call)$/.test(v2.vg.lemma)) { fail(m); continue; }      // a cat named Momo は使役ではない
        if (vf === 'pp' && a2.end - 1 > i && T[a2.end - 1].k === 'w' && /^(?:is|are|was|were|be|been|being|am)$/.test(T[a2.end - 1].w)) { fail(m); continue; }   // had a similar impact on how information is shared は have A done ではない""")

# around 1440 → in around 1440（1440年ごろに）
rep(r"""      .replace(/\bin the same way (?:that|as) """,
    r"""      .replace(/(?<!\b(?:in|from|to|since|until|by|of|between|and|than) )\b(around|about|circa) (1[0-9]{3}|20[0-9]{2})\b(?=\s*(?:[.,;:!?)]|$|\s(?:and|when|after|before|by|in|on|at|but|so|or|while|until|AD|BC|A\.D\.|B\.C\.)\b))/g, 'in $1 $2')   // invented around 1440 → 1440年ごろに
      .replace(/\bin the same way (?:that|as) """)

# major は in が続くときだけ動詞（contributed to major social changes → 大きな社会変化）
rep("""  const vc = (t, forms) => (t && t.k === 'w' && !PRON[t.w] && DET[t.w] === undefined && """,
    """  const vc = (t, forms) => (t && t.k === 'w' && !PRON[t.w] && DET[t.w] === undefined && !(t.w === 'major' && !(T[t.i] === t && T[t.i + 1] && T[t.i + 1].w === 'in')) && """)

rep("""    ja = ja.replace(/ずっと([^、。]{1,12})と関連している/g, '$1と関連があるとされている');""",
    """    ja = ja.replace(/ずっと([^、。]{1,12})と関連している/g, '$1と関連があるとされている');
    ja = ja.replace(/約([0-9０-９]{4})年(に|には|から|まで)/g, '$1年ごろ$2');   // around 1440 → 1440年ごろに""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
