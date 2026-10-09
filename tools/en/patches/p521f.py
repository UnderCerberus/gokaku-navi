import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# …, so if you plan to visit, make sure you check the opening hours in advance → 訪れるつもりなら、必ず前もって…確かめるようにしてください
#（文の途中の命令文 make sure (that) S V。文頭だけの規則を命令文の読みにも）
rep("""    if (e - 1 > j && isW(T[e - 1], 'please')) { please = true; e--; if (isP(T[e - 1], ',')) e--; }
    // Please come and visit Japan someday""",
    """    if (e - 1 > j && isW(T[e - 1], 'please')) { please = true; e--; if (isP(T[e - 1], ',')) e--; }
    if (!neg && !lets && seq(j, ['make', 'sure']) && j + 3 < e && !isW(T[j + 2], 'to') && !isW(T[j + 2], 'of')) {
      const mMs = mark();
      const cMs = sentence(j + (isW(T[j + 2], 'that') ? 3 : 2), e, { sub: true });
      if (cMs && cMs.pred && verbal(cMs.pred)) {
        name('imperative'); name('idiom');
        const omMs = cMs.subj && cMs.subj.pron === 'you' ? 'you' : null;
        const sMs = lead + '必ず' + cMs.out({ form: 'attr', past: false, omit: omMs, part: 'が' }).replace(/だろう$/, '') + 'ようにしてください';
        return { out: () => sMs, sp: 'SV', imp: true, end: b };
      }
      fail(mMs);
    }
    // Please come and visit Japan someday""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
