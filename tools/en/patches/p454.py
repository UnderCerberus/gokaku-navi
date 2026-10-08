import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()
old = "    const kitaP = vg.perfect && !vg.past && !vg.modal && !vg.passive && !vg.prog && !st.exp && !st.never && !neg && verbal(p) && !STATIVE[vg.lemma] &&"
assert s.count(old) == 1
s = s.replace(old, "    const kitaP = vg.perfect && !vg.past && !vg.modal && !vg.passive && !vg.prog && !st.exp && !st.never && !neg && verbal(p) && !STATIVE[vg.lemma] && !/ている$/.test(p.plain()) && vg.lemma !== 'know' &&")
old2 = "    ja = ja.replace(/誰かより(?!も)/g, '誰よりも')"
assert s.count(old2) == 1
s = s.replace(old2, "    ja = ja.replace(/お互い(長い間|何年も|ずっと)?知っている/g, (m0, a0) => (a0 || '') + '知り合いだ');   // We have known each other for a long time → 長い間知り合いだ\n" + old2)
io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
