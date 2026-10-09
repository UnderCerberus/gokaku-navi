import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# unless we change the way we use it → 私たちがその使い方を変えなければ（外の節と同じ主語の代名詞は the way の節の中で繰り返さない。目的語 1 つの動詞は「〜の〇〇方」）
rep("""      if (cw) return fin(cw.out({ part: 'が', form: 'attr' }), 'rel-adv');
      fail(m);
    }
    // 接触節（関係代名詞の省略）: the book I bought""",
    """      const outerW = (() => { for (let x = j - 3; x >= Math.max(0, j - 7); x--) { if (T[x].k !== 'w') return null; if (PRON[T[x].w] && PRON[T[x].w].sub) return T[x].w; } return null; })();
      const sameW = !!cw && !!cw.subj && !!cw.subj.pron && cw.subj.pron === outerW;
      const WAYO = { '使う': '使い方', '扱う': '扱い方', '作る': '作り方', '見る': '見方', '育てる': '育て方', '教える': '教え方', '学ぶ': '学び方', '書く': '書き方', '読む': '読み方', '解く': '解き方', '料理する': '料理の仕方', '準備する': '準備の仕方' };
      if (cw && cw.pred && (cw.parts || []).length === 1 && /を$/.test(cw.parts[0]) && WAYO[cw.pred.s] && !cw.neg && !cw.modal && cw.subj && (sameW || /^(?:we|you|they|people)$/.test(cw.subj.pron || ''))) { name('rel-adv'); return Object.assign({}, node, { ja: cw.parts[0].replace(/を$/, 'の').replace(/^それの/, 'その').replace(/^それらの/, 'それらの') + WAYO[cw.pred.s], end: e, rel: true }); }   // the way we use it → その使い方
      if (cw && sameW) return fin(cw.out({ part: 'が', form: 'attr', omit: cw.subj.pron }), 'rel-adv');
      if (cw) return fin(cw.out({ part: 'が', form: 'attr' }), 'rel-adv');
      fail(m);
    }
    // 接触節（関係代名詞の省略）: the book I bought""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
