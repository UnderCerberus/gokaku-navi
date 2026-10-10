import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# phones give students instant access to dictionaries → 学生に…へのすぐのアクセスを与える（give + 複数名詞 + access / chance / time … は二重目的語。複合名詞にしない）
rep("""      if (cnt > 0 && pl && /^(?:information|advice|food|water|money|help|permission|news|instructions|directions|homework|tips|support|energy|shelter|protection|warmth|attention|nectar|milk)$/.test(t.w || '')""",
    """      if (cnt > 0 && pl && /^(?:information|advice|food|water|money|help|permission|news|instructions|directions|homework|tips|support|energy|shelter|protection|warmth|attention|nectar|milk|access|instant|easy|free|time|chance|chances|opportunity|opportunities|feedback|freedom|choices|confidence|hope|courage)$/.test(t.w || '')""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
