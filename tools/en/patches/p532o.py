import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# This takes time / something that took too much time → これには時間がかかる・時間がかかりすぎるもの（物を指す代名詞の主語 + take + 時間。「時間を取る」にしない）
rep("""      else if (L === 'take' && objs.length === 1 && o.subj && (o.subj.gerund || (!o.subj.an && !o.subj.pron)) && /(?:時間|努力|忍耐|練習|お金|勇気|手間)""",
    """      else if (L === 'take' && objs.length === 1 && o.subj && (o.subj.gerund || (!o.subj.an && (!o.subj.pron || /^(?:this|that|something|everything|anything|which)$/.test(o.subj.pron)))) && /(?:時間|努力|忍耐|練習|お金|勇気|手間)""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
