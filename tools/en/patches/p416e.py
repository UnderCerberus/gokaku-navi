import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

rep("""'wet paint': 'ペンキ塗りたて', """,
    """'wet paint': 'ペンキ塗りたて', 'for how many people': '何名様ですか', 'for how many': '何名様ですか', 'how many in your party': '何名様ですか', 'what time would you like': '何時がよろしいですか', 'when would you like': 'いつがよろしいですか', 'what would you like': '何になさいますか', 'that is fine': 'それで大丈夫です', 'that is fine with me': '私はそれでかまいません', 'that would be fine': 'それで大丈夫です', 'that will be fine': 'それで大丈夫です', """)

# It's Tanaka. → 田中です（名前だけの答え）
rep("""    // 文全体が決まり文句の熟語（It depends. / Take your time.）
""",
    """    if (b >= 3 && b <= 5 && isW(T[0], 'it') && isW(T[1], 'is') && T.slice(2, b).every((x) => x.k === 'w' && x.cap)) {
      const nIt = np(2, b, { noRel: true });
      if (nIt && nIt.end === b && nIt.proper && !/[A-Za-z]/.test(nIt.ja)) return { ok: true, ja: nIt.ja + 'です。', sp: '', names: ['fixed'], sel: selMap(), unknown: UNK.slice(), idioms: USED.slice() };   // It's Tanaka. → 田中です
      reset(tokens);
    }
    // How about eight? → 8時はどうですか（数だけの how about は時刻）
    if (b === 3 && isW(T[0], 'how') && isW(T[1], 'about') && T[2].k === 'w' && NUMW[T[2].w] >= 1 && NUMW[T[2].w] <= 12) return { ok: true, ja: NUMW[T[2].w] + '時はどうですか。', sp: '', names: ['fixed'], sel: selMap(), unknown: UNK.slice(), idioms: USED.slice() };
    // 文全体が決まり文句の熟語（It depends. / Take your time.）
""")

rep("""    ja = ja.replace(/注意深くなる必要/g, '気をつける必要')""",
    """    ja = ja.replace(/(今夜|今日|明日|今週末|土曜日|日曜日)?(夕食|昼食|ランチ|ディナー)のために予約(し|す)/g, (m0, a0, b0, c0) => (a0 ? a0 + 'の' : '') + b0 + 'の予約を' + c0).replace(/^((?:[^、。]{0,12}?、)?)私は(今夜|今日|明日|今週末)の(夕食|昼食|ランチ|ディナー)の予約を/, '$1$2の$3の予約を').replace(/^([0-9０-９]+人)をお願いします/, '$1でお願いします').replace(/(?:約|およそ)([0-9０-９]+時(?:半|[0-9０-９]+分)?)(?!間)/g, '$1ごろ').replace(/私たちは([0-9０-９]+時)に予約でいっぱい/, '$1は予約でいっぱい');   // I'd like to make a reservation for dinner tonight → 今夜の夕食の予約をしたい / Around seven o'clock → 7時ごろです / we're fully booked at seven → 7時は予約でいっぱいだ
    ja = ja.replace(/注意深くなる必要/g, '気をつける必要')""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
