import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# report lower levels of stress than those who do not → そうでない人々よりストレスの低い水準を報告する（比較級 + 名詞 + of + 名詞 + than も目的語の比較）
rep("""    const objCmp = isW(t, 'than') && j >= 2 && T[j - 1].k === 'w' && !!nounC(T[j - 1]) && (() => { for (let q = j - 2; q >= Math.max(0, j - 4); q--) { if (T[q].k !== 'w') return false; if (/^(?:better|worse|more|less|bigger|larger|smaller|higher|lower|greater)$/.test(T[q].w)) return true; if (!nounC(T[q]) && !adjC(T[q])) return false; } return false; })();""",
    """    const objCmp = isW(t, 'than') && j >= 2 && T[j - 1].k === 'w' && !!nounC(T[j - 1]) && (() => { for (let q = j - 2; q >= Math.max(0, j - 6); q--) { if (T[q].k !== 'w') return false; if (/^(?:better|worse|more|less|bigger|larger|smaller|higher|lower|greater)$/.test(T[q].w)) return true; if (isW(T[q], 'of') && q < j - 1) continue; if (!nounC(T[q]) && !adjC(T[q])) return false; } return false; })();""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
