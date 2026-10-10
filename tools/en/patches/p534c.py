import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# phones are more likely to distract students than to help them / more likely to learn by doing than by listening（比較の than + to 不定詞・前置詞句 → 助けるよりも・聞くことによってよりも）
rep("""        if (elT || (nTn && nTn.end === lim)) { useIdiom(it.it); name('idiom'); name('comparative'); return fin(core, lim, 'SVC', [(elT || nTn.ja) + 'より']); }
        fail(mTn);""",
    """        if (elT || (nTn && nTn.end === lim)) { useIdiom(it.it); name('idiom'); name('comparative'); return fin(core, lim, 'SVC', [(elT || nTn.ja) + 'より']); }
        fail(mTn);
        if (isW(T[end + 1], 'to') && end + 2 < lim && !!vc(T[end + 2], ['base'])) {
          const vT2 = vpNonfin(end + 2, lim, 'base', { subj: sj });
          if (vT2 && vT2.end === lim) { useIdiom(it.it); name('idiom'); name('comparative'); return fin(core, lim, 'SVC', [vpJoin(vT2, 'dict') + 'よりも']); }
          fail(mTn);
        }
        if (T[end + 1].k === 'w' && !!PREP[T[end + 1].w] && end + 2 < lim) {
          const pT2 = parsePP(end + 1, lim, {});
          if (pT2 && pT2.end === lim) { useIdiom(it.it); name('idiom'); name('comparative'); return fin(core, lim, 'SVC', [pT2.ja + 'よりも']); }
          fail(mTn);
        }""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
