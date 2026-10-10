import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# Every time I see this picture → この絵を見る（知覚動詞 + this / that + 名詞にもなる原形は 限定詞 + 名詞。「これが思い描くのを見る」にしない）
rep("""      !(isW(tj, 'fit') && j + 1 < lim && T[j + 1].k === 'w' && /^(?:together|in|into)$/.test(T[j + 1].w))) && !haveCmp) {""",
    """      !(isW(tj, 'fit') && j + 1 < lim && T[j + 1].k === 'w' && /^(?:together|in|into)$/.test(T[j + 1].w))) && !haveCmp &&
      !(CAUS[L][2] === 'perception' && /^(?:this|that|these|those)$/.test(ob.pron || '') && j === i + 1 && !!nounC(tj))) {""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
