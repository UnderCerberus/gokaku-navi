import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

rep("""    // 文全体が決まり文句の熟語（It depends. / Take your time.）
""",
    """    // 頻度だけの答え: Every fifteen minutes. → 15分ごとです / Every Sunday. → 毎週日曜日です / Twice a week. → 週に2回です
    {
      const fqF = (ja) => ({ ok: true, ja: ja + 'です。', sp: '', names: ['fixed'], sel: selMap(), unknown: UNK.slice(), idioms: USED.slice() });
      const UNF = { minutes: '分', hours: '時間', days: '日', weeks: '週間', months: 'か月', years: '年', seconds: '秒' };
      const PERF = { day: '1日に', week: '週に', month: '月に', year: '年に', hour: '1時間に', minute: '1分間に' };
      if (b === 3 && isW(T[0], 'every') && (T[1].k === 'num' || NUMW[T[1].w] !== undefined) && UNF[T[2].w]) return fqF((T[1].k === 'num' ? String(T[1].s || T[1].w) : String(NUMW[T[1].w])) + UNF[T[2].w] + 'ごと');
      if (b === 2 && isW(T[0], 'every') && /^(?:monday|tuesday|wednesday|thursday|friday|saturday|sunday)$/.test(T[1].w || '')) return fqF('毎週' + ({ monday: '月', tuesday: '火', wednesday: '水', thursday: '木', friday: '金', saturday: '土', sunday: '日' })[T[1].w] + '曜日');
      if (b === 3 && /^(?:once|twice)$/.test(T[0].w || '') && /^(?:a|an|per|every)$/.test(T[1].w || '') && PERF[T[2].w]) return fqF(PERF[T[2].w] + (T[0].w === 'once' ? '1' : '2') + '回');
    }
    // 文全体が決まり文句の熟語（It depends. / Take your time.）
""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
