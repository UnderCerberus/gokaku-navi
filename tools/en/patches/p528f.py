import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# That was the last thing I wanted to hear → 私が最も聞きたくなかったこと（the last thing I wanted + to V の不定詞まで読む。聞こえるために にしない）
rep("""          const vjLt = { want: '望ま', need: '必要とし', expect: '予想し' }[lemLt] + (pastLt ? 'なかった' : 'ない');
          return { ja: (sjLt.pron === 'i' ? '私' : sjLt.ja) + 'が最も' + vjLt + 'こと', end: vEnd, head: 'thing' };""",
    """          const vjLt = { want: '望ま', need: '必要とし', expect: '予想し' }[lemLt] + (pastLt ? 'なかった' : 'ない');
          if (isW(T[vEnd], 'to') && vEnd + 1 < lim && T[vEnd + 1].k === 'w' && !!vc(T[vEnd + 1], ['base'])) {
            const mLi = mark();
            const gLi = { type: 'np', rel: true, used: false, ante: 'thing' };
            const iLi = vpNonfin(vEnd + 1, lim, 'base', { gap: gLi });
            if (iLi && gLi.used && verbal(iLi.pred)) {
              const jLi = lemLt === 'want' ? '最も' + iLi.parts.join('') + (iLi.vg && iLi.vg.lemma === 'hear' ? '聞き' : (iLi.vg && iLi.vg.lemma === 'see' ? '見' : iLi.pred.form('stem'))) + (pastLt ? 'たくなかった' : 'たくない') : (lemLt === 'expect' ? vpJoin(iLi, 'dict') + 'とはまったく思っていなかった' : '最も' + vpJoin(iLi, 'dict') + '必要のなかった');
              return { ja: (sjLt.pron === 'i' ? '私' : sjLt.ja) + 'が' + jLi + 'こと', end: iLi.end, head: 'thing' };
            }
            fail(mLi);
          }
          return { ja: (sjLt.pron === 'i' ? '私' : sjLt.ja) + 'が最も' + vjLt + 'こと', end: vEnd, head: 'thing' };""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
