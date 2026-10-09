import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# snap diff の見直し: win a prize（受賞した・賞を取った）/ do research（調べ物をする）/ raise awareness of（〜への意識）は既存の規則のほうがよい
rep("""    'do|research experiment experiments survey surveys|を|行う', 'do|harm damage|を|与える',""",
    """    'do|experiment experiments survey surveys|を|行う', 'do|harm damage|を|与える',""")
rep("""    'raise|awareness|を|高める', 'raise|child children kid kids family families|を|育てる',""",
    """    'raise|child children kid kids family families|を|育てる',""")
rep("""    'win|award awards prize prizes medal medals|を|獲得する',""",
    """    'win|medal medals|を|獲得する',""")
rep("""'perform|task tasks|を|こなす',""", """'perform|task tasks|を|行う',""")

# 受け身で表を引く動詞を限る（Habits are formed → 形成される / damage is done → 出る / were published in a journal → 掲載された は既存のまま）
rep("""    if (vg.passive && !objs.length && o.subj && VOBJ[L] && !(o.subj.pron && /^(?:i|you|he|she|we|they|me|him|her|us|them)$/.test(o.subj.pron))) {""",
    """    if (vg.passive && !objs.length && o.subj && VOBJ[L] && /^(?:present|conduct|launch|implement|enforce|pass|perform|produce|build|raise|set|meet|address|tackle|overcome|break|pose|take|save|keep|miss|seize)$/.test(L) && !(o.subj.pron && /^(?:i|you|he|she|we|they|me|him|her|us|them)$/.test(o.subj.pron))) {""")

# p507e の制限: suggest / show + that 節の中の after・before を節内で読むのは、後ろが名詞（after meals）のときだけ。代名詞・限定詞（before it reaches）なら従来どおり従属節に分ける
rep("""(KNOWV[vc(T[a + q - 1], ['base', '3sg', 'past']).lemma] && /^(?:after|before|until|since|when|while|if)$/.test(T[j].w))))) continue;""",
    """(KNOWV[vc(T[a + q - 1], ['base', '3sg', 'past']).lemma] && /^(?:after|before|until|since)$/.test(T[j].w) && T[j + 1] && T[j + 1].k === 'w' && !PRON[T[j + 1].w] && DET[T[j + 1].w] === undefined && !!nounC(T[j + 1]))))) continue;""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
