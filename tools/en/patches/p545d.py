import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# strengthen the memory each time it is recalled → 思い出されるたびに（each time / every time / whenever の受け身の現在は出来事。「思い出されているたびに」にしない）
rep("""      case 'every time': case 'each time': case 'whenever': return key === 'whenever' && /できる$/.test(S('attr', false)) ? S('attr', false) + 'ときはいつでも、' : S('attr', false) + 'たびに、';""",
    """      case 'every time': case 'each time': case 'whenever': {
        const sEv = S('attr', false);
        const sEv2 = sc.passive && !sc.prog && !sc.perfect && /(?:れ|られ)ている$/.test(sEv) ? sEv.replace(/ている$/, 'る') : sEv;
        return key === 'whenever' && /できる$/.test(sEv2) ? sEv2 + 'ときはいつでも、' : sEv2 + 'たびに、';
      }""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
