import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# One reason why … is that … → 〜理由の1つは、…からだ（「1つののは」にしない）/ The main reason … → 主な理由は
rep("""        rR.subjOverride = sj.ja.replace(/理由$/, 'の');""",
    """        rR.subjOverride = /1つの理由$/.test(sj.ja) ? sj.ja.replace(/(もう)?1つの理由$/, (m0, a0) => '理由の' + (a0 ? 'もう' : '') + '1つ') : (/(?:主な|最大の|大きな|重要な|本当の|一番の)理由$/.test(sj.ja) ? sj.ja : sj.ja.replace(/理由$/, 'の'));""")

# spread by A and later by B（受け身の動作主の by 句のあとの and + 副詞 + 前置詞句）
rep("""PREP[T[j + 2].w] && !(isW(T[j + 2], 'to') && T[j + 3] && T[j + 3].k === 'w' && vc(T[j + 3], ['base'])) && (st.other.length || st.time.length)) {""",
    """PREP[T[j + 2].w] && !(isW(T[j + 2], 'to') && T[j + 3] && T[j + 3].k === 'w' && vc(T[j + 3], ['base'])) && (st.other.length || st.time.length || (st.agent && isW(T[j + 2], 'by')))) {""")

# without being taught grammar rules → 文法の規則を教えられることなく（without + being + 過去分詞）
rep("""    if (key === 'within' && !idi && j + 3 < lim) {""",
    """    if (key === 'without' && !idi && isW(T[j], 'being') && j + 1 < lim && T[j + 1].k === 'w' && !!vc(T[j + 1], ['pp'])) {
      const mWb = mark();
      const vWb = vpNonfin(j + 1, lim, 'pp', {});
      if (vWb && vWb.vg && vWb.vg.e) return { ja: vWb.parts.join('') + P(verbSense(vWb.vg.e, true).core).aux('pass').plain() + 'ことなく', kind: 'other', end: vWb.end, prep: 'without' };
      fail(mWb);
    }
    // from across Japan / from all over the country → 日本各地から
    if (key === 'from' && !idi && isW(T[j], 'across') && j + 1 < lim) {
      const mFa = mark();
      const nFa = np(j + 1, lim, { noRel: true, noCoord: true });
      if (nFa) return { ja: (nFa.det === 'the' && /^(?:country|nation)$/.test(nFa.head || '') ? '全国' : (nFa.det === 'the' && /^(?:world|globe)$/.test(nFa.head || '') ? '世界中' : nFa.ja + '各地')) + 'から', adn: (nFa.det === 'the' && /^(?:country|nation)$/.test(nFa.head || '') ? '全国' : (nFa.det === 'the' && /^(?:world|globe)$/.test(nFa.head || '') ? '世界中' : nFa.ja + '各地')) + 'からの', kind: 'other', end: nFa.end, prep: 'from' };
      fail(mFa);
    }
    if (key === 'within' && !idi && j + 3 < lim) {""")

# the first woman in her family to go to university → 大学に行った最初の女性（最初の・唯一の + 名詞の不定詞は空所なしを先に）
rep("""      const inf0 = noGap2 ? vpNonfin(j + 1, e, 'base', {}) : null;
      if (noGap2 && !(inf0 && verbal(inf0.pred))) fail(m);""",
    """      const firstN = /^(?:最初の|最後の|唯一の|[0-9]+番目の)/.test(node.ja || '') || /(?:^|の)(?:最初の|最後の|唯一の)[^の]{1,6}$/.test(node.ja || '');
      const inf0 = noGap2 || firstN ? vpNonfin(j + 1, e, 'base', {}) : null;
      if (noGap2 && !(inf0 && verbal(inf0.pred))) fail(m);""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
