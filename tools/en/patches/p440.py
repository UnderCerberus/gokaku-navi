import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# 都合のいい時間: what time would be convenient for you → 何時が都合がいいか（間接疑問）/ 何時がご都合がよろしいですか（直接疑問）
rep("""  function whClause(j, lim) {
    const t = T[j];
    if (!t || j >= lim || t.k !== 'w') return null;
    const m = mark();""",
    """  // what time / when / which day + (would / will) be + convenient / good (+ for X) の位置と訳
  function convWh(j, lim) {
    const WHC = { 'what time': '何時', 'when': 'いつ', 'which day': '何曜日', 'what day': '何曜日', 'which date': '何日', 'what date': '何日' };
    let k = j, key = '';
    if (isW(T[j], 'when')) { key = 'when'; k = j + 1; }
    else if (T[j] && T[j + 1] && WHC[T[j].w + ' ' + T[j + 1].w]) { key = T[j].w + ' ' + T[j + 1].w; k = j + 2; }
    if (!key) return null;
    if (isW(T[k], 'would') || isW(T[k], 'will')) k++;
    if (!(isW(T[k], 'be') || isW(T[k], 'is'))) return null;
    k++;
    if (!(T[k] && /^(?:convenient|good|best|ok|okay|fine)$/.test(T[k].w || ''))) return null;
    k++;
    if (isW(T[k], 'for') && T[k + 1] && T[k + 1].k === 'w' && PRON[T[k + 1].w]) k += 2;
    if (k > lim) return null;
    return { wh: WHC[key], end: k };
  }
  function whClause(j, lim) {
    const t = T[j];
    if (!t || j >= lim || t.k !== 'w') return null;
    const m = mark();
    { const cw0 = convWh(j, lim); if (cw0 && cw0.end === lim) { name('indirect-q'); return { str: cw0.wh + 'が都合がいいか', end: lim }; } }   // Could you let me know what time would be convenient for you? → 何時が都合がいいか""")

rep("""    // 頻度だけの答え: Every fifteen minutes.""",
    """    { const cw1 = q && b >= 4 ? convWh(0, b) : null; if (cw1 && cw1.end === b) return { ok: true, ja: cw1.wh + 'がご都合がよろしいですか。', sp: '', names: ['question'], sel: selMap(), unknown: UNK.slice(), idioms: USED.slice() }; }   // What time would be convenient for you? → 何時がご都合がよろしいですか
    // 頻度だけの答え: Every fifteen minutes.""")

rep("""    ja = ja.replace(/(?:ミスター)?氏と([^、。]{1,8}?)さん/g, '$1夫妻')""",
    """    ja = ja.replace(/早い返事/g, '早速のお返事').replace(/べきである何か(?=が|を)/g, 'べきもの').replace(/(次の|来週の)?([月火水木金土日])曜日に(?:私たちの)?(会議|打ち合わせ|面接|授業|試合|約束)の/g, (m0, a0, b0, c0) => (a0 || '') + b0 + '曜日の' + c0 + 'の');   // Thank you for your quick reply → 早速のお返事 / anything I should prepare → 準備するべきもの / the details of our meeting next Tuesday → 次の火曜日の会議の詳細
    ja = ja.replace(/(?:ミスター)?氏と([^、。]{1,8}?)さん/g, '$1夫妻')""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
