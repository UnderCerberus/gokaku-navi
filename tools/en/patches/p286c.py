import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

rep("""spoon: '杯' });   // two pieces of information""", """spoon: '杯', can: '缶', carton: 'パック', loaf: '斤', jar: '瓶', pack: 'パック', packet: '袋', plate: '皿' });   // two pieces of information""")
rep("""tooth: '本', horn: '本', tail: '本', wing: '枚',""", """tooth: '本', horn: '本', tail: '本', wing: '枚', letter: '通', email: '通', postcard: '枚', song: '曲', movie: '本', umbrella: '本', can: '缶',""")

# a piece of cake → 1切れのケーキ / a piece of paper → 1枚の紙
rep("""      if (inner0) return { ja: mJa0 + 'の' + inner0.ja, end: inner0.end,""",
    """      const pcU0 = nom.c.lemma === 'piece' && inner0 ? (/^(?:cake|pizza|pie|bread|toast|cheese|meat|watermelon|melon|steak|ham|cheesecake|chocolate cake|apple pie)$/.test(inner0.head || '') ? '切れ' : (/^(?:paper)$/.test(inner0.head || '') ? '枚' : '')) : '';   // two pieces of cake → 2切れのケーキ
      if (inner0) return { ja: (pcU0 ? mJa0.replace(/つ$/, pcU0) : mJa0) + 'の' + inner0.ja, end: inner0.end,""")

# two of his books → 彼の本のうち2冊
rep("""        const yr = num.val >= 1000 && num.val <= 2100 && !num.pct && T[num.end - 1].k === 'num' && !num.ord;
        // three leave just two points""",
    """        if (!num.pct && !num.ord && !det && Number.isInteger(num.val) && num.val >= 2 && num.val <= 20 && isW(T[num.end], 'of') && num.end + 1 < lim && T[num.end + 1].k === 'w' && /^(?:the|his|her|my|your|our|their|these|those)$/.test(T[num.end + 1].w)) {   // two of his books → 彼の本のうち2冊
          const mPt = mark();
          const inPt = np1(num.end + 1, lim, o);
          if (inPt && !inPt.pron && inPt.pl && inPt.head && !inPt.time && !inPt.coord) {
            const unitPt = COUNTER[inPt.head] ? COUNTER[inPt.head] : (inPt.an ? '人' : 'つ');
            return { ja: inPt.ja + 'のうち' + num.val + unitPt, end: inPt.end, num: num, pl: true, an: !!inPt.an, head: inPt.head };
          }
          fail(mPt);
        }
        const yr = num.val >= 1000 && num.val <= 2100 && !num.pct && T[num.end - 1].k === 'num' && !num.ord;
        // three leave just two points""")

old = ".replace(/(^|[はがにで]|[^0-9０-９]、)((?:もう)?[0-9０-９]+(?:、[0-9０-９]+)?(?:杯|本|枚|切れ|箱|袋|缶|瓶|皿|冊|足|台))の([^、。をのがはにでとも「」]{1,10})を/g, '$1$3を$2')"
new = ".replace(/(^|[はがにで]|[^0-9０-９]、|毎日|毎朝|毎晩|毎週|毎月)((?:もう)?[0-9０-９]+(?:、[0-9０-９]+)?(?:杯|本|枚|切れ|箱|袋|缶|瓶|皿|冊|足|台|通|曲|斤|パック))の([^、。をのがはにでとも「」]{1,10})(を|が必要)/g, (m0, a0, q0, n0, p0) => a0 + n0 + p0.charAt(0) + q0 + p0.slice(1))"
rep(old, new)

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
