import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# 既存の置換（内蔵長文の 1 文）を「練習だけが」にも合うようにする（that 節・関係詞節の「〜だけ」の主語に が を付けたため）
rep("""人は時間を得るが、練習だけゆっくりと維持できる(?:何か|もの|こと)が消える/""",
    """人は時間を得るが、練習だけが?ゆっくりと維持できる(?:何か|もの|こと)が消える/""")

# how to use technology wisely → 科学技術の賢い使い方（how to + 目的語 + 自分で のときだけ「〜する方法」。様態の副詞は従来どおり）
rep("""      else if (t.w === 'how' && wh.end === j + 1 && (inf.parts || []).length > 1 && inf.parts.some((x) => /を$/.test(x)) && !/を$/.test(inf.parts[inf.parts.length - 1]) && verbal(inf.pred)) s =""",
    """      else if (t.w === 'how' && wh.end === j + 1 && (inf.parts || []).length > 1 && inf.parts.some((x) => /を$/.test(x)) && /^(?:自分で|自分自身で|1人で|ひとりで)$/.test(inf.parts[inf.parts.length - 1]) && verbal(inf.pred)) s =""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
