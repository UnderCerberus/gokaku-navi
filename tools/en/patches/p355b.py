import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# I'm dying to go there → そこに行きたくてたまらない / I'm dying for a cup of coffee → コーヒーがほしくてたまらない
rep("""    ja = ja.replace(/中国の万里の長城/g, '万里の長城');""",
    """    ja = ja.replace(/中国の万里の長城/g, '万里の長城');
    if (tokens.some((x) => x.w === 'dying')) {
      ja = ja.replace(/([^、。]*?)([一-龠ァ-ヶー]+する|[一-龠][ぁ-ん]{0,2}(?:る|う|く|ぐ|す|つ|ぬ|ぶ|む))ために死んで(いる|いた)/, (m0, a0, v0, t0) => { try { const pD = P(v0); return verbal(pD) ? a0 + pD.form('stem') + 'たくてたまらな' + (t0 === 'いる' ? 'い' : 'かった') : m0; } catch (eD) { return m0; } });
      ja = ja.replace(/([^、。]+?)のために死んで(いる|いた)/, (m0, a0, t0) => a0.replace(/^(私|彼|彼女|私たち|彼ら)は/, '$1は') + 'がほしくてたまらな' + (t0 === 'いる' ? 'い' : 'かった'));
    }""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
