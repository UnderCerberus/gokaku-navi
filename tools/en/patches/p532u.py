import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# the task is still waiting for us → 仕事はまだ私たちを待っている（wait / remain などは進行形。My hobby is reading books の「〜ことだ」にしない）
rep("""    if (vg.prog && !vg.passive && !vg.perfect && sj && !anim && /^(?:hobby|hobbies|job|dream|dreams|goal|aim|duty|task|habit|purpose|role|pleasure|mission)$/.test(sj.head || '') && verbal(p)) {""",
    """    if (vg.prog && !vg.passive && !vg.perfect && sj && !anim && /^(?:hobby|hobbies|job|dream|dreams|goal|aim|duty|task|habit|purpose|role|pleasure|mission)$/.test(sj.head || '') && verbal(p) && !/^(?:wait|remain|sit|lie|stand|grow|get|become|pile|increase|go)$/.test(vg.lemma)) {""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
