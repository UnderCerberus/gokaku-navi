import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# she had never been so proud in her life → 人生でこれほど誇りに思ったことはなかった / I have never been so happy → これほどうれしかったことはない
# （never の文の so + 形容詞は「これほど」。「一度もとてもうれしかったことがない」にしない）
rep("""    if (t.w === 'so') return 'とても';
    const nx = T[k + 1];""",
    """    if (t.w === 'so') return T.slice(0, k).some((x) => isW(x, 'never')) ? 'これほど' : 'とても';
    const nx = T[k + 1];""")

# never been so proud in her life → 人生で（in + 人生は「〜で」。there 構文以外で「自分の人生に」にしない）
rep("""        if (obj.year || time) return R(n + 'に', 'time', n + 'の');""",
    """        if (obj.year || time) return R(n + 'に', 'time', n + 'の');
        if (obj.head && /^(?:life|lives)$/.test(obj.head) && !obj.pron && !T.some((x) => isW(x, 'there'))) return R(n + 'で', 'other', n + 'の');""")

# For the first time in my life, … → 生まれて初めて、（人生で、 になっても同じ）
rep(""".replace(/^初めて(?:私の)?人生では、/, '生まれて初めて、')""",
    """.replace(/^初めて(?:私の)?人生では?、/, '生まれて初めて、')""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
