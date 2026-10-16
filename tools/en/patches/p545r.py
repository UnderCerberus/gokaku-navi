import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# more than half of them were too dark or out of focus → 暗すぎるか、ピントが合っていなかった / The room was too dark and cold → 暗すぎて、寒かった
# （be + too + 形容詞 and / or + 補語は、右の補語も be の補語として読んで並べる）
rep("""      if (fT.stem !== null && (fT.kind === 'i' || fT.kind === 'na')) {
        pick(j + 1, aT.e);
        name('too');
        const rT = fin(P((o.tooDeg || '') + fT.stem + 'すぎる', 'v1'), tail(forT ? forT.end : j + 2, lim, st, o, vg), 'SVC', forT ? [forT.ja + 'には'] : []);""",
    """      if (fT.stem !== null && (fT.kind === 'i' || fT.kind === 'na') && !forT && j + 3 < lim && (isW(T[j + 2], 'and') || isW(T[j + 2], 'or')) && !vg.neg) {
        const mCj = mark();
        const vg2 = Object.assign({}, vg, { past: false, perfect: false, modal: null });
        const r2 = parseBe(vg2, j + 3, lim, Object.assign({}, o, { tooDeg: undefined }));
        if (r2 && r2.pred && r2.end === lim && !r2.neg) {
          pick(j + 1, aT.e);
          name('too');
          const p1 = P((o.tooDeg || '') + fT.stem + 'すぎる', 'v1');
          const leftCj = T[j + 2].w === 'or' ? p1.plain() + 'か、' : p1.form('te') + '、';
          return fin(P(leftCj + (r2.parts || []).join('') + r2.pred.plain(), r2.pred.cls), lim, 'SVC', []);
        }
        fail(mCj);
      }
      if (fT.stem !== null && (fT.kind === 'i' || fT.kind === 'na')) {
        pick(j + 1, aT.e);
        name('too');
        const rT = fin(P((o.tooDeg || '') + fT.stem + 'すぎる', 'v1'), tail(forT ? forT.end : j + 2, lim, st, o, vg), 'SVC', forT ? [forT.ja + 'には'] : []);""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
