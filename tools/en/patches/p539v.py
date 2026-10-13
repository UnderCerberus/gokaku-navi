import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# One Saturday in July, I arrived … → 7月のある土曜日に / One day last summer → 去年の夏のある日に（文頭の「ある日」+ 時の句は「〜のある日に」。「ある土曜日7月に」にしない）
rep("""      lead += piece + (comma ? '、' : '');""",
    """      const mOd = /ある(?:日|朝|晩|夜|午後|夕方|土曜日|日曜日|月曜日|火曜日|水曜日|木曜日|金曜日|夏|冬|春|秋|週末)$/.exec(lead);
      if (mOd && /^[^、。]{1,8}に$/.test(piece) && /^(?:in|last|this|on|during)$/.test((T[a] || {}).w || '') && !/ある/.test(piece)) { lead = lead.slice(0, mOd.index) + piece.replace(/に$/, '') + 'の' + mOd[0] + 'に' + (comma ? '、' : ''); a = comma ? k + 1 : k; continue; }
      lead += piece + (comma ? '、' : '');""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
