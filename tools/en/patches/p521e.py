import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# tend to be better at switching between tasks than those who speak only one → 1つしか話さない人々より…がより得意だ
#（比較の be 熟語 + 目的語 + than + 関係詞節つきの名詞句・省略節）
rep("""      if (core) { useIdiom(it.it); name('idiom'); return fin(core, it.shape === 'do' || it.shape === 'doing' ? end : tail(end, lim, st, o, vg)); }
    }""",
    """      if (core && end + 1 < lim && isW(T[end], 'than') && (degP || /^be (?:better|worse) /.test((it.it && it.it.phrase) || ''))) {
        const mTn = mark();
        const elT = thanEllipsis(end + 1, lim, sj);
        const nTn = elT ? null : np(end + 1, lim, {});
        if (elT || (nTn && nTn.end === lim)) { useIdiom(it.it); name('idiom'); name('comparative'); return fin(core, lim, 'SVC', [(elT || nTn.ja) + 'より']); }
        fail(mTn);
      }
      if (core) { useIdiom(it.it); name('idiom'); return fin(core, it.shape === 'do' || it.shape === 'doing' ? end : tail(end, lim, st, o, vg)); }
    }""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
