import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# planting trees is not as simple as it might seem → 思われるほど簡単ではない（as + 形容詞 + as it seems / looks / sounds。ように思われる にしない）
rep("""          fail(m6);
          const cl6 = sentence(k + 3, lim, { sub: true });                   // as ~ as he looks""",
    """          fail(m6);
          {
            let kSm = k + 3;
            if (T[kSm] && /^(?:it|they|this|that)$/.test(T[kSm].w || '')) kSm++;
            if (kSm > k + 3 && T[kSm] && /^(?:might|may|could|would)$/.test(T[kSm].w || '')) kSm++;
            const vSm = T[kSm] ? T[kSm].w || '' : '';
            if (kSm > k + 3 && /^(?:seem|seems|seemed|look|looks|looked|sound|sounds|sounded|appear|appears|appeared)$/.test(vSm) && kSm + 1 === lim) {
              name('as-as');
              const jSm = /^seem/.test(vSm) || /^appear/.test(vSm) ? '思われる' : (/^look/.test(vSm) ? '見かけ' : '聞こえる');
              return fin(f3.pred, lim, 'SVC', [jSm + (vg.neg || T.slice(0, k).some((x) => x.k === 'w' && x.w === 'not') ? 'ほど' : 'のと同じくらい')]);
            }
          }
          const cl6 = sentence(k + 3, lim, { sub: true });                   // as ~ as he looks""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
