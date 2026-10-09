import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# I would rather stay at home and read a book than go out → 外出するよりむしろ家にいて本を読みたい（rather の後ろの動詞の並列）
rep("""      const v1 = vpNonfin(x + 2, th > 0 ? th : b, 'base', { subj: sjR });
      const v2 = v1 && th > 0 ? vpNonfin(th + 1, b, 'base', { subj: sjR }) : null;""",
    """      let v1 = vpNonfin(x + 2, th > 0 ? th : b, 'base', { subj: sjR });
      if (!(v1 && v1.end === (th > 0 ? th : b)) && th > 0) {
        const kAr = T.findIndex((q, y) => y > x + 3 && y < th - 1 && isW(q, 'and') && T[y + 1].k === 'w' && !!vc(T[y + 1], ['base']));
        const vAr = kAr > 0 ? vpNonfin(x + 2, kAr, 'base', { subj: sjR }) : null;
        const vBr = vAr && vAr.end === kAr ? vpNonfin(kAr + 1, th, 'base', { subj: sjR }) : null;
        if (vBr && vBr.end === th && verbal(vAr.pred)) v1 = Object.assign({}, vBr, { parts: [vAr.parts.join('') + vAr.pred.form('te')].concat(vBr.parts) });   // stay at home and read a book → 家にいて本を読み
      }
      const v2 = v1 && th > 0 ? vpNonfin(th + 1, b, 'base', { subj: sjR }) : null;""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
