import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# show users words they are likely to forget → 利用者に彼らが忘れそうな語を見せる / showed the children pictures of animals → 子どもたちに動物の絵を見せた
# （2 つ目的語をとる動詞の 1 つ目が人の複数名詞なら、次の名詞と複合語にしない。「利用者の語」「子どもの絵」にしない）
rep("""        if (n && /^(?:i|he|she|we|they)$/.test(n.pron || '') && !n.coord && T[n.end] && T[n.end].k === 'w' && (!!BE[T[n.end].w] || !!MODAL[T[n.end].w] || !!vc(T[n.end], ['3sg', 'past']))) { fail(m1); break; }
        if (n) { objs.push(n); j = n.end; continue; }""",
    """        if (n && objs.length === 0 && !vg.passive && /^(?:give|send|show|teach|tell|buy|bring|offer|lend|hand|pass|pay|promise|read|cook|find|get|leave|owe|sell|serve|write)$/.test(vg.lemma)) {
          const kPo = T[j] && T[j].k === 'w' && DET[T[j].w] !== undefined && !PRON[T[j].w] ? j + 1 : j;
          if (kPo + 1 < n.end && T[kPo].k === 'w' && /^(?:users|students|children|kids|people|customers|visitors|readers|viewers|players|members|workers|employees|guests|tourists|patients|parents|friends|learners|teachers|passengers|fans|listeners|audiences|participants|volunteers|clients|buyers|consumers|residents|citizens|voters|athletes|animals|birds)$/.test(T[kPo].w) &&
            T[kPo + 1].k === 'w' && !!nounC(T[kPo + 1]) && !PREP[T[kPo + 1].w] && !BE[T[kPo + 1].w] && !MODAL[T[kPo + 1].w]) {
            const mPo = mark();
            const n1Po = np(j, kPo + 1, {});
            if (n1Po && n1Po.end === kPo + 1) n = n1Po; else fail(mPo);
          }
        }
        if (n && /^(?:i|he|she|we|they)$/.test(n.pron || '') && !n.coord && T[n.end] && T[n.end].k === 'w' && (!!BE[T[n.end].w] || !!MODAL[T[n.end].w] || !!vc(T[n.end], ['3sg', 'past']))) { fail(m1); break; }
        if (n) { objs.push(n); j = n.end; continue; }""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
