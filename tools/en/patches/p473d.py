import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

rep("""      if (kNb > 0 && seq(kNb + 1, ['nothing', 'but']) && kNb + 3 < b) {
        const mNb = mark();
        const sNb = np(0, kNb, { noRel: true });
        const oNb = sNb && sNb.end === kNb ? np(kNb + 3, b, {}) : null;""",
    """      const kNb3 = kNb > 0 ? (seq(kNb + 1, ['nothing', 'but']) ? kNb + 3 : (seq(kNb + 1, ['no', 'more', 'than']) ? kNb + 4 : -1)) : -1;   // He is no more than a puppet → 操り人形にすぎない
      if (kNb3 > 0 && kNb3 < b) {
        const mNb = mark();
        const sNb = np(0, kNb, { noRel: true });
        const oNb = sNb && sNb.end === kNb ? np(kNb3, b, {}) : null;""")

rep("""      const MNb = { man: '男', person: '人', woman: '女性', guy: '人', type: 'タイプの人', boy: '少年', girl: '少女' };""",
    """      // He did nothing but complain. → 彼は文句を言ってばかりいた
      const kDn = T.findIndex((x, q) => q >= 1 && q <= 5 && /^(?:do|does|did)$/.test(x.w || '') && seq(q + 1, ['nothing', 'but']) && !!vc(T[q + 3], ['base']));
      if (kDn > 0) {
        const mDn = mark();
        const sDn = np(0, kDn, { noRel: true });
        const vDn = sDn && sDn.end === kDn ? vpNonfin(kDn + 3, b, 'base', {}) : null;
        if (vDn && vDn.end === b && verbal(vDn.pred)) { name('idiom'); return { ok: true, ja: sDn.ja + 'は' + vpJoin(vDn, 'te').replace(/^不平を言って$/, '文句を言って') + 'ばかり' + (T[kDn].w === 'did' ? 'いた' : 'いる') + '。', sp: 'SVO', names: NAMES.slice(), sel: selMap(), unknown: UNK.slice(), idioms: USED.slice() }; }
        fail(mDn);
      }
      const MNb = { man: '男', person: '人', woman: '女性', guy: '人', type: 'タイプの人', boy: '少年', girl: '少女' };""")

rep("""    ja = ja.replace(/知識の隙間/g, '知識の空白')""",
    """    ja = ja.replace(/([0-9０-９][0-9０-９,，.万億千百]*[^、。をがはにの\\s]{0,4}も)を(?=持|払|使|稼|集|貯|寄付|借)/g, '$1').replace(/おかしい(話|物語|映画|冗談)/g, 'おもしろい$1');   // has no less than 1,000 yen → 1000円も持っている / a funny story → おもしろい話
    ja = ja.replace(/知識の隙間/g, '知識の空白')""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
