import io, re
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# 語注の辞書選択（sel）は元の語の番号 oi で記録する。書き換え（呼びかけ・P.S. など）で i を振り直しても語注がずれない
rep("""  const pick = (i, e) => { if (e && T[i]) SEL.push([T[i].i, e]); };""",
    """  const pick = (i, e) => { if (e && T[i] && T[i].oi !== undefined) SEL.push([T[i].oi, e]); };   // 書き換えで作った語（oi なし）は記録しない""")

rep("""  function translate(tokens) {
    if (!en.analyze || !en.jp || !tokens || !tokens.length) return null;
""", """  function translate(tokens) {
    if (!en.analyze || !en.jp || !tokens || !tokens.length) return null;
    tokens.forEach((t) => { if (t && t.oi === undefined) t.oi = t.i; });   // 元の語の番号（語注の対応づけ用）
""")

rep("""  function chunks(tokens) {
    if (!en.analyze || !en.jp || !tokens || !tokens.length) return { ja: '', sel: {} };
""", """  function chunks(tokens) {
    if (!en.analyze || !en.jp || !tokens || !tokens.length) return { ja: '', sel: {} };
    tokens.forEach((t) => { if (t && t.oi === undefined) t.oi = t.i; });
""")

# 語を差し替えたトークンは元の語の番号を持たない（remain → are の語注に still の意味が付かないように）
n0 = s.count('an: undefined')
s = s.replace('an: undefined', 'an: undefined, oi: undefined')
print('an-undefined', n0)

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
