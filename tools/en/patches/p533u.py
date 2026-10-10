import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# a video editing app / a car manufacturing company → 動画編集アプリ・自動車製造会社（名詞 + する動詞の -ing + 道具・組織の名詞は複合名詞。分詞の後置修飾にしない）
rep("""    if (isW(t, 'lined') && isW(T[j + 1], 'with') && !node.pron && !o.noPart && j + 2 < e) {""",
    """    if (t.k === 'w' && !node.pron && !node.pl && !node.an && node.head && j + 1 < e && !!vc(t, ['ing']) && !adjC(t) && T[j + 1].k === 'w' && /^(?:app|apps|software|tool|tools|machine|machines|company|companies|industry|business|process|technique|techniques|skill|skills|class|classes|course|courses|program|programs|system|systems|plant|factory|center|room|team|department|method|methods|equipment|service|services|site|website|device|devices|lesson|lessons|club|contest|competition|program|machine|business)$/.test(T[j + 1].w) && (j + 2 >= e || T[j + 2].k !== 'w' || !nounC(T[j + 2]) || !!PREP[T[j + 2].w] || /^(?:last|next|this|every|yesterday|today|tomorrow|and|or|but)$/.test(T[j + 2].w))) {
      const vCp = vc(t, ['ing']);
      const coreCp = vCp && vCp.e ? verbSense(vCp.e, true).core : '';
      const n2Cp = nounC(T[j + 1]);
      if (/^[^をにがでと]+する$/.test(coreCp) && n2Cp && n2Cp.e) {
        pick(j, vCp.e); pick(j + 1, n2Cp.e);
        name('compound');
        return Object.assign({}, node, { ja: node.ja + coreCp.replace(/する$/, '') + en.jp.first(n2Cp.e.ja), end: j + 2, head: n2Cp.lemma, pl: /s$/.test(T[j + 1].w) && T[j + 1].w !== n2Cp.lemma });
      }
    }
    if (isW(t, 'lined') && isW(T[j + 1], 'with') && !node.pron && !o.noPart && j + 2 < e) {""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
