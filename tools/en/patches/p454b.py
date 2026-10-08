import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

rep("""      else past = true;                                                  // have done → した""",
    """      else if (/ている$/.test(p.plain()) && st.manner.concat(st.time, st.other).some((x) => /^(?:長い間|長年|何年も|ずっと|[0-9０-９]+年間|[0-9０-９]+か月間)$/.test(x))) { /* have known each other for a long time → 知っている（継続の期間つきの状態は現在） */ }
      else past = true;                                                  // have done → した""")

rep("""    const kitaP = vg.perfect && !vg.past && !vg.modal && !vg.passive && !vg.prog && !st.exp && !st.never && !neg && verbal(p) && !STATIVE[vg.lemma] && !/ている$/.test(p.plain()) && vg.lemma !== 'know' &&""",
    """    const kitaP = vg.perfect && !vg.past && !vg.modal && !vg.passive && !vg.prog && !st.exp && !st.never && !neg && verbal(p) && (!STATIVE[vg.lemma] || vg.lemma === 'believe') && !/ている$/.test(p.plain()) && vg.lemma !== 'know' &&""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
