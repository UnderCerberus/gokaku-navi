import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

rep("""        const vgI = b - 1;
        if (BE[T[vgI].w]) {
          const sj = np(a + 2, vgI, { pp: true });
          if (sj && sj.end === vgI) { name('exclamation'); return { out: () => sj.ja + 'はなんと' + exJa, sp: 'SVC' }; }
        }
      }
      return fail(m);""",
    """        const vgI = b - 1;
        if (BE[T[vgI].w]) {
          const sj = np(a + 2, vgI, { pp: true });
          if (sj && sj.end === vgI) { name('exclamation'); return { out: () => sj.ja + 'はなんと' + exJa, sp: 'SVC' }; }
        }
      }
      // How fast he runs! / How well she sings! → 彼はなんと速く走るのだろう（how + 副詞 + 主語 + 動詞）
      const avX = T[a + 1] && T[a + 1].k === 'w' && /^(?:fast|hard|well|high|early|late|quickly|slowly|beautifully|loudly|quietly|carefully|easily|much|far|long)$/.test(T[a + 1].w) ? (advC(T[a + 1]) || null) : null;
      if (avX && a + 3 < b + 1) {
        const mX = mark();
        const clX = clause(a + 2, b, {});
        if (clX && clX.subj && clX.pred && verbal(clX.pred)) {
          name('exclamation');
          const advJ = ({ fast: '速く', hard: '一生懸命に', well: '上手に', high: '高く', early: '早く', late: '遅く', much: 'たくさん', far: '遠くまで', long: '長く' })[T[a + 1].w] || avX.ja;
          return { out: () => clX.subj.ja + 'は' + 'なんと' + advJ + (clX.parts || []).join('') + (clX.past ? clX.pred.form('past') : clX.pred.plain()) + 'のだろう', sp: 'SV' };
        }
        fail(mX);
      }
      return fail(m);""")

rep("""    ja = ja.replace(/誰かより(?!も)/g, '誰よりも')""",
    """    ja = ja.replace(/^(?:今日は)?美しい日(だね|だ|ですね|です)(?=。|$)/, (m0, a0) => 'いい天気' + a0);   // It's a beautiful day, isn't it? → いい天気だね
    ja = ja.replace(/誰かより(?!も)/g, '誰よりも')""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
