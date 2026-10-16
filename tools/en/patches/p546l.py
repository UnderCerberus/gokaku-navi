import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# it reaches stores while it is still fresh → まだ新鮮なうちに店に届く / while you are still young → まだ若いうちに
# （while + still + 形容詞・名詞の状態は「〜うちに」。「新鮮で、…間に」にしない）
rep("""        return S('attr', false) + '間に、';
      case 'before':""",
    """        if (sc.pred && !verbal(sc.pred) && !sc.neg && /まだ/.test(S('attr', false))) return S('attr', false) + 'うちに、';
        return S('attr', false) + '間に、';
      case 'before':""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
