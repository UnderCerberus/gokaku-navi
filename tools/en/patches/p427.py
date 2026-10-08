import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# Many crops could be affected / It could be destroyed → 影響を受けるかもしれない・破壊されるかもしれない（被害の動詞の could + be + 過去分詞は可能性）
rep("""    if (vg.passive && !vg.coord && /^(?:can|could)$/.test(vg.modal || '') && !vg.perfect && verbal(p) && !/(?:見える|聞こえる|分かる)$/.test(p.plain()) && !subjv && !st.passiveKeep && !(agentThing && sj && !anim) &&""",
    """    const couldHarm = vg.modal === 'could' && /^(?:affect|destroy|damage|harm|hurt|kill|injure|threaten|flood|ruin|delay|cancel|replace|reduce|wash|blow|steal|attack|infect|pollute|contaminate|waste|ban|delete|remove|lose|break|close|change|disrupt|endanger|cut|lost)$/.test(vg.lemma) && !T.some((x) => x.k === 'w' && /^(?:yesterday|ago|then|last|was|were|had|did|easily|quickly)$/.test(x.w));
    if (vg.passive && !vg.coord && /^(?:can|could)$/.test(vg.modal || '') && !couldHarm && !vg.perfect && verbal(p) && !/(?:見える|聞こえる|分かる)$/.test(p.plain()) && !subjv && !st.passiveKeep && !(agentThing && sj && !anim) &&""")

rep("""    ja = ja.replace(/夜の空/g, '夜空');""",
    """    ja = ja.replace(/夜の空/g, '夜空');
    ja = ja.replace(/影響され(る|た|て|ている|ていた|ない|なかった|やすい|ずに)/g, '影響を受け$1').replace(/によって影響を受け/g, 'の影響を受け');   // be affected → 影響を受ける / affected by the weather → 天気の影響を受ける""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
