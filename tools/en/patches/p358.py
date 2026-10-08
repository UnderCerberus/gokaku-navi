import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# Date: Saturday, July 20 → 日時：7月20日（土） / Time: 10 a.m. to 4 p.m. → 時間：午前10時から午後4時まで（掲示の見出し語 + コロン）
rep("""    if (ci > 0) {
      const left = colonSide(body.slice(0, ci), false);""",
    """    if (ci === 1 && body[0].k === 'w') {
      const LABEL_JA = { date: '日時', dates: '日程', time: '時間', times: '時間', place: '場所', location: '場所', venue: '会場', price: '料金', prices: '料金', admission: '入場料', fee: '料金', fees: '料金', cost: '費用', contact: '連絡先', address: '住所', phone: '電話', tel: '電話', email: 'メール', deadline: '締め切り', theme: 'テーマ', topic: 'テーマ', note: '注意', notes: '注意', schedule: '予定', organizer: '主催', capacity: '定員', age: '対象年齢', ages: '対象年齢', who: '対象', when: '日時', where: '場所', hours: '営業時間', prize: '賞品', prizes: '賞品', access: 'アクセス', participants: '参加者', requirements: '条件', menu: 'メニュー', closed: '休業日', details: '詳細', warning: '警告', caution: '注意', notice: 'お知らせ', subject: '件名', from: '差出人', to: '宛先', period: '期間', duration: '期間', target: '対象', level: 'レベル', size: 'サイズ', color: '色', colour: '色', weight: '重さ', ingredients: '材料', directions: '作り方', title: 'タイトル', author: '著者', name: '名前' };
      const lbJa = LABEL_JA[body[0].w];
      if (lbJa) {
        const rTx = body.slice(ci + 1);
        let rL = colonSide(rTx.concat(endP), true);
        if (!rL && rTx.length && (rTx[0].k === 'num' || NUMW[rTx[0].w] !== undefined) && rTx.some((x) => isW(x, 'to'))) {
          const tFr = tokenize('from ' + rTx.map((x) => x.s || x.w).join(' ') + '.');
          const rFr = tFr && tFr.length ? colonSide(tFr, true) : null;
          if (rFr) rL = Object.assign({}, rFr, { ja: rFr.ja.replace(/(?:に|で)$/, '') });
        }
        if (rL) { absorb(acc, rL); acc.names.push('colon'); return fin(null, lbJa + '：' + rL.ja.replace(/。$/, '').replace(/(?:です|だ)$/, '')); }
        reset(tokens);
      }
    }
    if (ci > 0) {
      const left = colonSide(body.slice(0, ci), false);""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
