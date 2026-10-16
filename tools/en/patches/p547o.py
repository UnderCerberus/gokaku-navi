import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# Just a few meters before the finish line, my foot slipped → ゴールのほんの数メートル手前で / ten meters from the station → 駅から10メートル離れたところで
# （距離 + before / after / from + 名詞句は場所の副詞句。「ゴールの前のいくつかのメートル、つまり」にしない）
rep("""        if ((n1.unit || n1.quant) && isW(nx, 'away') && /(?:メートル|マイル|キロ|フィート|インチ|センチ)/.test(n1.ja)) { st.other.push(n1.ja + '離れて'); return n1.end + 1; }""",
    """        if ((n1.unit || n1.quant) && isW(nx, 'away') && /(?:メートル|マイル|キロ|フィート|インチ|センチ)/.test(n1.ja)) { st.other.push(n1.ja + '離れて'); return n1.end + 1; }
        if (nx && /^(?:before|after|from)$/.test(nx.w || '') && /(?:メートル|マイル|キロ|フィート|ヤード|[0-9０-９数]歩)$/.test(n1.ja) && n1.end + 1 < lim) {
          const mDb = mark();
          const nDb = np(n1.end + 1, lim, { noRel: true });
          if (nDb && !nDb.pron) {
            let preDb = '';
            if (st.manner.length && st.manner[st.manner.length - 1] === 'ちょうど') { st.manner.pop(); preDb = 'ほんの'; }
            st.other.push(nDb.ja + (nx.w === 'from' ? 'から' : 'の') + preDb + n1.ja.replace(/^いくつかの/, '数') + (nx.w === 'before' ? '手前で' : (nx.w === 'after' ? '先で' : '離れたところで')));
            return nDb.end;
          }
          fail(mDb);
        }""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
