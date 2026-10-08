import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()
def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)
rep("""        else if (vg.lemma === 'be' && !vg.passive && !verbal(p) && !neg && (!sj || (!anim && (!sj.pron || !(PRON[sj.pron] && PRON[sj.pron].an))))) p = P(p.plain() + 'こともある', 'aru');""",
    """        else if (vg.lemma === 'be' && !vg.passive && !verbal(p) && !neg && (!sj || (!anim && (!sj.pron || !(PRON[sj.pron] && PRON[sj.pron].an))))) p = P(p.plain() + 'こともある', 'aru');
        // They can be dangerous / People can be cruel（人の主語でも、性質の形容詞なら可能性。You can be happy は なれる）
        else if (vg.lemma === 'be' && !vg.passive && !verbal(p) && !neg && sj && !/^(?:i|you|we)$/.test(sj.pron || '') && T[vg.end] && !!adjC(T[vg.end]) && /^(?:dangerous|harmful|risky|expensive|difficult|hard|annoying|rude|selfish|noisy|boring|wrong|cruel|unpredictable|aggressive|violent|careless|lazy|strict|tough|mean|stubborn|moody|funny|scary|cold|unkind|dishonest|jealous|shy|quiet|loud|sensitive|emotional|demanding|difficult|confusing|misleading|addictive|stressful|lonely|tiring|unfair|unreliable|inaccurate)$/.test(adjC(T[vg.end]).lemma)) p = P(p.plain() + 'こともある', 'aru');""")
io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
