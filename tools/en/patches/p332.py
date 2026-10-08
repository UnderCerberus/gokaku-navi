import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# Because I want to travel abroad. → 海外へ旅行したいからだ（理由を答える because 節だけの文）
rep("""    // Hi, Ken. → こんにちは、ケン""",
    """    // Because I want to travel abroad. → 海外へ旅行したいからだ / Because of the rain. → 雨のためだ（理由を答える because だけの文）
    if (isW(T[0], 'because') && b >= 3) {
      if (isW(T[1], 'of') && b >= 3) {
        const nBo = np(2, b, {});
        if (nBo && nBo.end === b) return { ok: true, ja: nBo.ja + 'のためだ。', sp: '', names: ['because'], sel: selMap(), unknown: UNK.slice(), idioms: USED.slice() };
        reset(tokens);
      } else {
        const scBc = sentence(1, b, { sub: true });
        if (scBc) {
          const omBc = scBc.subj && /^(?:i|we|it)$/.test(scBc.subj.pron || '') ? scBc.subj.pron : null;
          return { ok: true, ja: scBc.out({ part: 'が', omit: omBc }).replace(/(?:だろう|つもりだ)$/, '') + 'からだ。', sp: '', names: ['because'], sel: selMap(), unknown: UNK.slice(), idioms: USED.slice() };
        }
        reset(tokens);
      }
    }
    // Hi, Ken. → こんにちは、ケン""")

rep("""    ja = ja.replace(/誰か([^、。]{1,16}?)人を持って(いる|いた)/, '$1人が$2')""",
    """    ja = ja.replace(/何時に(毎朝|毎晩|毎日|毎週|ふだん|たいてい)/, '$1何時に').replace(/何人の(兄弟|姉妹|子ども|友達|きょうだい|いとこ|ペット)を持っていますか/, '$1は何人いますか').replace(/^これは(私の)?(友達|親友|兄|弟|姉|妹|父|母|先生|クラスメート|いとこ)だ、([^、。]+?)(?=。|$)/, 'こちらは$1$2の$3だ');   // What time do you get up every morning? / How many brothers do you have? / This is my friend, Ken.
    ja = ja.replace(/誰か([^、。]{1,16}?)人を持って(いる|いた)/, '$1人が$2')""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
