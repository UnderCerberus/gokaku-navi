import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# for at least an hour → 少なくとも1時間
rep("""    // about ten / nearly 100 / over 50（数をぼかす語）
""", """    // for at least an hour / at most ten minutes → 少なくとも1時間 / 多くても10分
    if ((seq(i, ['at', 'least']) || seq(i, ['at', 'most'])) && i + 2 < lim && !o.noApprox) {
      const nx2 = T[i + 2];
      if (nx2.k === 'num' || NUMW[nx2.w] !== undefined || ((nx2.w === 'a' || nx2.w === 'an') && T[i + 3] && T[i + 3].k === 'w' && !!UNIT[T[i + 3].w])) {
        const mAl = mark();
        const inn2 = np1(i + 2, lim, Object.assign({}, o, { noApprox: true, noTimePh: true }));
        if (inn2 && (inn2.num || nx2.k === 'num' || inn2.dur)) return Object.assign({}, inn2, { ja: (T[i + 1].w === 'least' ? '少なくとも' : '多くても') + inn2.ja });
        fail(mAl);
      }
    }
    // about ten / nearly 100 / over 50（数をぼかす語）
""")

# the remaining two days / an additional three hours / an estimated 500 people / the recommended seven hours
rep("""    // two more games / three more days → あと2試合・あと3日
""", """    // the remaining two days / an additional three hours / an estimated 500 people / the recommended seven hours → 残りの2日間・さらに3時間・推定500人・推奨される7時間
    const AJN = { remaining: ['残りの', '残りの'], additional: ['追加の', 'さらに'], extra: ['追加の', 'さらに'], further: ['さらに', 'さらに'], estimated: ['推定', '推定'], recommended: ['推奨される', '推奨される'], required: ['必要な', '必要な'], average: ['平均', '平均'], whole: ['まる', 'まる'], entire: ['まる', 'まる'], full: ['まる', 'まる'], previous: ['それまでの', 'それまでの'], following: ['その後の', 'その後の'], final: ['最後の', '最後の'], mere: ['わずか', 'わずか'], whopping: ['なんと', 'なんと'], staggering: ['実に', '実に'], record: ['過去最高の', '過去最高の'] };
    if (/^(?:the|an|a)$/.test(t.w || '') && T[i + 1] && AJN[T[i + 1].w] && T[i + 2] && (T[i + 2].k === 'num' || (NUMW[T[i + 2].w] !== undefined && NUMW[T[i + 2].w] > 0)) && i + 3 < lim && T[i + 3].k === 'w' && !!nounC(T[i + 3])) {
      const mAj = mark();
      const nAj = nominal(i + 3, lim, true);
      if (nAj && nAj.c) {
        const vAj = T[i + 2].k === 'num' ? Number(String(T[i + 2].w).replace(/,/g, '')) : NUMW[T[i + 2].w];
        const uAj = UNIT[nAj.c.lemma];
        const durAj = !!(uAj && DURUNIT[nAj.c.lemma]);
        const preAj = AJN[T[i + 1].w][uAj ? 1 : 0];
        const peopleAj = /^(?:people|persons)$/.test(nAj.head || '');
        const jaAj = preAj + (uAj ? vAj + uAj + (durAj && !/間$/.test(uAj) ? '間' : '') : (peopleAj ? vAj + '人' : counter({ val: vAj, ja: String(vAj) }, nAj.c) + nAj.ja));
        return postMod({ ja: jaAj, end: nAj.end, head: nAj.head, pl: true, an: nAj.an || peopleAj, dur: durAj, num: { val: vAj, ja: String(vAj) } }, lim, o);
      }
      fail(mAj);
    }
    // two more games / three more days → あと2試合・あと3日
""")

rep("""'for half an hour': '30分間', """,
    """'for half an hour': '30分間', 'over time': '時間とともに', """)

rep("""    ja = ja.replace(/一方で、また/g, '一方で、');""",
    """    ja = ja.replace(/一方で、また/g, '一方で、');
    ja = ja.replace(/(?:両方の)?(?:物理的|身体的)(?:で|な|と)心の健康/g, '心身の健康').replace(/これらのような/g, 'このような');   // both physical and mental health → 心身の健康 / changes like these → このような変化
    ja = ja.replace(/睡眠の([0-9０-９.]+時間)(未満|以上)?を得(る|た|ている)/g, '$1$2の睡眠をと$3').replace(/1泊([0-9０-９.]+時間)(未満|以上)?を得(る|た|ている)/g, (m0, h0, l0, v0) => '一晩に' + h0 + (l0 || '') + (l0 === '未満' ? 'しか' + ({ 'る': '眠らない', 'た': '眠らなかった', 'ている': '眠っていない' })[v0] : ({ 'る': '眠る', 'た': '眠った', 'ている': '眠っている' })[v0]));   // get less than seven hours of sleep → 7時間未満の睡眠をとる
    ja = ja.replace(/ずっと([^、。]{1,12})と関連している/g, '$1と関連があるとされている');   // Lack of sleep has been linked to obesity → 睡眠不足は肥満と関連があるとされている
    if (tokens.some((x) => x.w === 'difference')) ja = ja.replace(/(大きい|大きな|重要な|著しい|かなりの|本当の)変化をもたらす/g, '大きな違いを生む').replace(/(大きい|大きな|重要な|著しい|かなりの)変化をもたらした/g, '大きな違いを生んだ');   // make a big difference → 大きな違いを生む
    ja = ja.replace(/^物は(時間とともに)?良くなる/, '状況は$1良くなる');   // Things will get better over time → 状況は時間とともに良くなるだろう""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
