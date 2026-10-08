import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

rep("""          if (rL2 && rL2.ok) return Object.assign({}, rL2, { ja: LD2[q][1] + rL2.ja });
          break;
        }
      }
    }""",
    """          if (rL2 && rL2.ok) return Object.assign({}, rL2, { ja: LD2[q][1] + rL2.ja });
          break;
        }
      }
      // OK, but don't play games on it → いいですよ。でも、それでゲームをしてはいけません
      const okB = seq(0, ['all', 'right']) ? 2 : (T[0] && /^(?:ok|okay|sure|fine|yes|yeah|alright)$/.test(T[0].w || '') ? 1 : 0);
      if (okB && b > okB + 3 && isP(T[okB], ',') && isW(T[okB + 1], 'but') && !tokens.__okB) {
        const tOb = tokens.slice(okB + 2).map((x, k) => Object.assign({}, x, { i: k, first: k === 0, cap: k === 0 ? false : x.cap }));
        tOb.__okB = true;
        const rOb = translate1(tOb);
        reset(tokens);
        if (rOb && rOb.ok) return Object.assign({}, rOb, { ja: (/^(?:yes|yeah)$/.test(T[0].w || '') ? 'はい。でも、' : 'いいですよ。でも、') + rOb.ja });
      }
    }""")

rep("""'wet paint': 'ペンキ塗りたて', """,
    """'wet paint': 'ペンキ塗りたて', 'what for': '何のためですか', """)

rep("""    ja = ja.replace(/注意深くなる必要/g, '気をつける必要')""",
    """    ja = ja.replace(/科学の報告書/g, '理科のレポート').replace(/(宿題|レポート|課題|発表|プロジェクト)のために研究をする/g, '$1のために調べ物をする');   // science report → 理科のレポート / do some research for my homework → 宿題のために調べ物をする
    if (q && tokens[0] && tokens[0].w === 'do' && tokens[1] && tokens[1].w === 'you' && tokens[2] && tokens[2].w === 'want' && tokens[3] && tokens[3].w === 'to' && tokens.some((x, k) => x.w === 'with' && tokens[k + 1] && /^(?:me|us)$/.test(tokens[k + 1].w || ''))) ja = ja.replace(/^(?:あなたは)?(.+?)たいですか(。?)$/, '$1ませんか$2');   // Do you want to come with me? → 私と一緒に来ませんか
    ja = ja.replace(/注意深くなる必要/g, '気をつける必要')""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
