import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# what did you have in mind / keep this in mind / take ~ into account（動詞 + 〜 + 語句の熟語も「A + 語句」の枠で引く。これまで索引に入っていなかった）
rep("""      } else if (ph[1] === 'oneself' && isVerb0 && (nph === 1 || (nph === 2 && last === '~'))) {""",
    """      } else if (nph === 1 && ph[1] === '~' && isVerb0 && toks.length >= 4 && !PH.test(toks[toks.length - 1]) && /〜/.test(ja)) {
        add(IDX.verb, w0, { lit: low.slice(2), ja: ja.replace('〜', 'A'), shape: 'Alit', it: it });
      } else if (ph[1] === 'oneself' && isVerb0 && (nph === 1 || (nph === 2 && last === '~'))) {""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
