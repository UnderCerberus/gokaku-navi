import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# she moved to the capital at eighteen → 18歳で / He left home at sixteen → 16歳で（13 以上の数は時刻でなく年齢）
rep("""        if (obj.num && !obj.head && !obj.unit && Number.isInteger(obj.num.val) && obj.num.val >= 2 && obj.num.val <= 120 && !obj.det && T.some((x) => x.k === 'w' && /^(?:vote|votes""",
    """        if (obj.num && !obj.head && !obj.unit && Number.isInteger(obj.num.val) && obj.num.val >= 13 && obj.num.val <= 120 && !obj.det && T[obj.end - 1] && T[obj.end - 1].k === 'w' && !/^[0-9]/.test(T[obj.end - 1].w || '') && T.some((x) => x.k === 'w' && /^(?:move|moves|moved|moving|left|leave|start|started|begin|began|quit|emigrate|emigrated|immigrate|immigrated|came|went|founded|invented|discovered|traveled|travelled|started|entered|joined|got|had)$/.test(x.w)) && !T.some((x) => x.k === 'w' && /^(?:o'clock|am|pm|a\\.m\\.|p\\.m\\.|morning|evening|night|tonight|tomorrow|today)$/.test(x.w))) return R(obj.num.val + '歳で', 'time', obj.num.val + '歳の');   // moved to the capital at eighteen → 18歳で
        if (obj.num && !obj.head && !obj.unit && Number.isInteger(obj.num.val) && obj.num.val >= 2 && obj.num.val <= 120 && !obj.det && T.some((x) => x.k === 'w' && /^(?:vote|votes""")
# had been coal mining for more than a century → 1世紀以上の間（期間の for 句を物の名詞にかけない）
rep("""      // those inside a car / those in need（〜の人々）
""",
    """      if (isW(t, 'for') && !node.pron && node.head && !/^(?:trip|trips|stay|visit|vacation|holiday|holidays|break|delay|journey|course|period|program|programme|contract|ban|leave|absence|sentence|war|drought|walk|run|flight|ride|drive|class|lesson|lessons|meeting|session|shift|plan|plans|record|job|work|treatment|training|rest|silence|wait|warranty|guarantee|subscription|membership|rental|loan|lease)$/.test(node.head) && j + 2 < lim && (NUMW[(T[j + 1] || {}).w] !== undefined || (T[j + 1] || {}).k === 'num' || /^(?:more|over|about|nearly|almost|several|many|a|an|decades|centuries|years|months|hours|weeks|days)$/.test((T[j + 1] || {}).w || '')) && T.slice(j + 1, Math.min(lim, j + 6)).some((x) => x.k === 'w' && !!DURUNIT[(x.w || '').replace(/s$/, '')])) break;   // coal mining for more than a century（期間は述語にかける）
      // those inside a car / those in need（〜の人々）
""")

# she moved to the capital → 首都に引っ越した（移動した にしない）
rep("""st.other.some((x) => /(?:都市|町|家|国|村|アパート|場所|東京|大阪|京都|ニューヨーク|ロンドン|パリ|地方|田舎|海岸|近所|通り)に$/.test(x))) p = P('引っ越す', 'v5');""",
    """st.other.some((x) => /(?:都市|町|家|国|村|アパート|場所|東京|大阪|京都|ニューヨーク|ロンドン|パリ|地方|田舎|海岸|近所|通り|首都|郊外|地域|市|街|都会|故郷|寮|マンション)に$/.test(x))) p = P('引っ越す', 'v5');""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
