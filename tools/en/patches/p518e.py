import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# He can hardly speak his own language correctly, let alone a foreign one → …話せない。まして外国語はなおさらだ
rep("""    {
      const kAc = T.findIndex((x, q) => q > 2 && q < b - 2 && isP(x, ',') && seq(q + 1, ['according', 'to']));""",
    """    {
      const kLa = T.findIndex((x, q) => q > 2 && q < b - 2 && isP(x, ',') && seq(q + 1, ['let', 'alone']));
      if (kLa > 0 && !tokens.__laSplit) {
        const mLa = mark();
        const nLa = isW(T[kLa + 3], 'to') || (T[kLa + 3] && T[kLa + 3].k === 'w' && !!vc(T[kLa + 3], ['base']) && !nounC(T[kLa + 3])) ? null : np(kLa + 3, b, { noRel: true });
        const vLa = nLa ? null : vpNonfin(kLa + 3, b, 'base', {});
        if ((nLa && nLa.end === b) || (vLa && vLa.end === b)) {
          const endLa = Object.assign({}, tokens[b] || tokens[b - 1], { s: '.', w: '.', k: 'p' });
          const tLa = tokens.slice(0, kLa).concat([endLa]);
          tLa.__laSplit = true;
          const jLa = nLa ? (nLa.pron === 'one' || /^(?:外国の|外国)もの$/.test(nLa.ja) ? nLa.ja.replace(/^外国のもの$/, '外国語') : nLa.ja) : vpJoin(vLa, 'dict') + 'こと';
          const rLa = translate1(tLa);
          reset(tokens);
          if (rLa && rLa.ok) return Object.assign({}, rLa, { ja: rLa.ja.replace(/。$/, '') + '。まして' + jLa + 'はなおさらだ。' });
        } else fail(mLa);
      }
    }
    {
      const kAc = T.findIndex((x, q) => q > 2 && q < b - 2 && isP(x, ',') && seq(q + 1, ['according', 'to']));""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
