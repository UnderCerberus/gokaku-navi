import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# Feeling tired after the long journey, we decided … → 疲れを感じたので、（状態・心理の動詞の分詞構文は理由）
rep("""          const pre = isInf || inOrder ? vpJoin(v, 'dict') + (niwa ? 'には、' : 'ために、')
            : (pform === 'ing' ? (isW(t0, 'having') && v.past ?""",
    """          const reasonIng = pform === 'ing' && !isW(t0, 'having') && v.vg && /^(?:feel|be|know|want|need|realize|realise|believe|hope|fear|wish|understand|worry|lack|expect|think|own|belong)$/.test(v.vg.lemma || '');
          const pre = isInf || inOrder ? vpJoin(v, 'dict') + (niwa ? 'には、' : 'ために、')
            : reasonIng ? v.parts.join('') + (mn3.past ? (v.neg ? v.pred.aux('neg') : v.pred).form('past') : noDouble(v.neg ? v.pred.aux('neg') : v.pred).plain()) + 'ので、'   // Feeling tired, … → 疲れていると感じたので
            : (pform === 'ing' ? (isW(t0, 'having') && v.past ?""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
