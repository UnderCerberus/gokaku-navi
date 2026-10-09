import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# a myth that has been repeated so often that many people believe it → あまりに頻繁に繰り返されてきたため多くの人々が信じている俗説（関係詞節の中の so … that は ため。it は先行詞なので省く）
rep("""          st.soThat = (x) => 'ので、' + cs.out({ omit: om, polite: !!(x && x.polite) });""",
    """          st.soThat = (x) => (x && x.form === 'attr' ? 'ため' + cs.out({ omit: om, part: 'が', form: 'attr' }).replace(/それを/, '') : 'ので、' + cs.out({ omit: om, polite: !!(x && x.polite) }));""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
