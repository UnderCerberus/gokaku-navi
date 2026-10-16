import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# a German researcher named Hermann Ebbinghaus decided to … → ヘルマン・エビングハウス（Hermann Ebbinghaus）という名前の…研究者（辞書にない大文字の語が続く名前は全部を名前にする）
rep("""      const nmN = np1(j + 1, e, { noPost: true, noRel: true });
      if (nmN && (nmN.end >= e || T[nmN.end].k === 'p' ||""",
    """      let nmN = np1(j + 1, e, { noPost: true, noRel: true }) || (!A(T[j + 1]).length ? { ja: T[j + 1].s, end: j + 2, proper: true } : null);
      while (nmN && nmN.end < e && T[nmN.end].k === 'w' && T[nmN.end].cap && !A(T[nmN.end]).length) nmN = Object.assign({}, nmN, { ja: nmN.ja + '・' + T[nmN.end].s, end: nmN.end + 1 });
      if (nmN && (nmN.end >= e || T[nmN.end].k === 'p' ||""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
