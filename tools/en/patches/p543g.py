import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# the line … is not as clear as it once seemed → かつて思われていたほど明らかではない（as + 形容詞 + as it once / at first seemed）
rep("""            if (kSm > k + 3 && T[kSm] && /^(?:might|may|could|would)$/.test(T[kSm].w || '')) kSm++;
            const vSm = T[kSm] ? T[kSm].w || '' : '';""",
    """            if (kSm > k + 3 && T[kSm] && /^(?:might|may|could|would)$/.test(T[kSm].w || '')) kSm++;
            const onceSm = kSm > k + 3 && T[kSm] && /^(?:once|first|initially|originally)$/.test(T[kSm].w || '') ? T[kSm].w : '';
            if (onceSm) kSm++;
            const vSm = T[kSm] ? T[kSm].w || '' : '';""")
rep("""              const jSm = /^seem/.test(vSm) || /^appear/.test(vSm) ? '思われる' : (/^look/.test(vSm) ? '見かけ' : '聞こえる');""",
    """              const jSm = onceSm ? (onceSm === 'once' ? 'かつて' : '最初に') + (/^look/.test(vSm) ? '見えていた' : '思われていた') : (/^seem/.test(vSm) || /^appear/.test(vSm) ? '思われる' : (/^look/.test(vSm) ? '見かけ' : '聞こえる'));""")

rep("""          if (n3 && !(n3.end < lim && verbStart(n3.end))) {
            name('as-as');""",
    """          if (n3 && !(n3.end < lim && verbStart(n3.end)) && !(n3.pron && /^(?:once|first|initially|originally)$/.test((T[n3.end] || {}).w || ''))) {
            name('as-as');""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
