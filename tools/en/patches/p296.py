import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# The website is down right now → ウェブサイトは今ダウンしている
rep("""    // He was ten minutes late → 彼は10分遅刻した / The train is five minutes late → 電車は5分遅れている""",
    """    // The website is down right now → ウェブサイトは今ダウンしている
    if (vg.lemma === 'be' && !vg.passive && isW(T[i], 'down') && sj && /(?:^| )(?:website|websites|site|server|servers|system|network|internet|app|service|wifi|wi-fi|computer|computers)$/.test(sj.head || '') && (i + 1 === lim || !(T[i + 1].k === 'w' && (DET[T[i + 1].w] !== undefined || nounC(T[i + 1])) && !isW(T[i + 1], 'right')))) {
      let eDn = i + 1;
      if (seq(eDn, ['right', 'now'])) { st.time.push('今'); eDn += 2; }
      name('svc');
      return fin(vg.past ? P('ダウンしていた', 'v1') : P('ダウンしている', 'v1'), eDn < lim ? tail(eDn, lim, st, o, vg) : eDn, 'SV', []);
    }
    // He was ten minutes late → 彼は10分遅刻した / The train is five minutes late → 電車は5分遅れている""")

# My computer froze again → コンピューターがまたフリーズした
rep("""    if (L === 'work' && !objs.length && !vg.passive && o.subj && !o.subj.an""",
    """    if (L === 'freeze' && !objs.length && !vg.passive && o.subj && /(?:^| )(?:computer|computers|pc|laptop|phone|smartphone|screen|app|system|game|tablet|program|software|browser)$/.test(plainSubj(o.subj).head || '')) sense = { particle: '', core: 'フリーズする', tr: false };   // My computer froze again → また フリーズした
    if (L === 'work' && !objs.length && !vg.passive && o.subj && !o.subj.an""")

rep("""    ja = ja.replace(/誰か([^、。]{1,16}?)人を持って(いる|いた)/, '$1人が$2')""",
    """    ja = ja.replace(/(データ|ファイル|写真|コンピューター|パソコン|スマートフォン|電話)を支援(する|した|しなさい|して|しよう)/g, '$1をバックアップ$2');   // back up your data → データをバックアップする
    ja = ja.replace(/([0-9０-９]+(?:万|千|百)?)の([^、。のをがは]{1,8}?)以上を持って(いる|いた)/, (m0, n0, h0, e0) => n0 + '人以上の' + h0 + 'が' + e0);   // She has over ten thousand followers → 1万人以上のフォロワーがいる
    ja = ja.replace(/誰か([^、。]{1,16}?)人を持って(いる|いた)/, '$1人が$2')""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
