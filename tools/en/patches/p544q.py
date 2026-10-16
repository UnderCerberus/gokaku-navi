import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# show users words they are likely to forget → 利用者に彼らが忘れそうな語を見せる
# （tell / show + 人の複数名詞 + 名詞 + 主語の代名詞 … は that 節ではなく、2 つの目的語 + 接触節。p544o の分け方に回す）
rep("""    if (TELLV[L] && !relNotQ && (isW(tj, 'that') || WH[tj.w]""",
    """    const kSv = T[i] && T[i].k === 'w' && DET[T[i].w] !== undefined && !PRON[T[i].w] ? i + 1 : i;
    const svooPl = !isW(tj, 'that') && !WH[tj.w] && kSv + 1 < j && T[kSv].k === 'w' && /^(?:users|students|children|kids|people|customers|visitors|readers|viewers|players|members|workers|employees|guests|tourists|patients|parents|friends|learners|teachers|passengers|fans|listeners|audiences|participants|volunteers|clients|buyers|consumers|residents|citizens|voters|athletes)$/.test(T[kSv].w) && T[kSv + 1].k === 'w' && !!nounC(T[kSv + 1]) && !PREP[T[kSv + 1].w];
    if (TELLV[L] && !relNotQ && !svooPl && (isW(tj, 'that') || WH[tj.w]""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
