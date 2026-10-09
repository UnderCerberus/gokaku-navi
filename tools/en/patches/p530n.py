import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# offering recorded lessons for review → 復習のために録画された授業を提供しながら（recorded + 授業・講義は 録画された。教訓 にしない）
rep("""  const ADJN = COLL([
    'sharp|decline declines increase increases rise rises drop drops fall falls growth reduction reductions change changes|急激な',""",
    """  const ADJN = COLL([
    'recorded|lesson lessons class classes lecture lectures video videos program programs|録画された',
    'sharp|decline declines increase increases rise rises drop drops fall falls growth reduction reductions change changes|急激な',""")
rep("""      if (/^lessons?$/.test(oh) && /^(?:teach|learn|draw|offer|provide|hold|contain|carry)$/.test(L) && /授業$/.test(objs[0].ja) && (oh === 'lesson' || L !== 'teach')) objs[0] = Object.assign({}, objs[0], { ja: objs[0].ja.replace(/授業$/, '教訓') });""",
    """      if (/^lessons?$/.test(oh) && /^(?:teach|learn|draw|offer|provide|hold|contain|carry)$/.test(L) && /授業$/.test(objs[0].ja) && !/(?:録画された|オンラインの|個人の|無料の|特別な)授業$/.test(objs[0].ja) && (oh === 'lesson' || L !== 'teach')) objs[0] = Object.assign({}, objs[0], { ja: objs[0].ja.replace(/授業$/, '教訓') });""")

# which is more than many of them actually get → それは彼らの多くが実際にとる量より多い（be + more than + 目的語の欠けた節）
rep("""    // be left（残っている）: how much of the book is left / Only two days are left""",
    """    if (isW(T[i], 'more') && isW(T[i + 1], 'than') && i + 3 < lim && T[i + 2].k === 'w' && (PRON[T[i + 2].w] || DET[T[i + 2].w] !== undefined || /^(?:many|most|some|few|all)$/.test(T[i + 2].w))) {
      const mMt2 = mark();
      const gMt = { type: 'np', rel: true, used: false };
      const cMt = clause(i + 2, lim, { gap: gMt, sub: true });
      if (cMt && gMt.used) return fin(P(cMt.out({ part: 'が', form: 'attr' }) + '量より多い', 'i'), lim, 'SVC');
      fail(mMt2);
    }
    // be left（残っている）: how much of the book is left / Only two days are left""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
