import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# I was deeply moved that a stranger had … → 〜て深く感動した（moved / touched も感情の形容詞 + that 節）
rep("""const EMO = set('glad happy sad sorry surprised pleased excited disappointed shocked delighted proud angry relieved amazed impressed embarrassed upset thrilled');""",
    """const EMO = set('glad happy sad sorry surprised pleased excited disappointed shocked delighted proud angry relieved amazed impressed embarrassed upset thrilled moved touched');""")

# during its first few summers → 最初のいくつかの夏の間に（限定詞 + first / last / next + few + 名詞。few を「ほとんど〜ない」にしない）
rep("""    if (/^(?:far|much|many)$/.test(t.w) && isW(T[i + 1], 'more') && i + 2 < lim""",
    """    if (/^(?:the|its|his|her|their|my|our|your)$/.test(t.w) && T[i + 1] && /^(?:first|last|next)$/.test(T[i + 1].w || '') && isW(T[i + 2], 'few') && i + 3 < lim && T[i + 3].k === 'w' && !!nounC(T[i + 3]) && !DURUNIT[(nounC(T[i + 3]) || {}).lemma]) {
      const mFf = mark();
      const nFf = np1(i + 3, lim, Object.assign({}, o, { noRel: true }));
      if (nFf && !nFf.pron) return Object.assign({}, nFf, { ja: (t.w === 'the' ? '' : DET[t.w] || '') + ({ first: '最初の', last: '最後の', next: '次の' })[T[i + 1].w] + 'いくつかの' + nFf.ja, pl: true });
      fail(mFf);
    }
    if (/^(?:far|much|many)$/.test(t.w) && isW(T[i + 1], 'more') && i + 2 < lim""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
