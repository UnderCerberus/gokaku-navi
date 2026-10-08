import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

rep("""      ja = ja.replace(/([^、。]+?)のために死んで(いる|いた)/, (m0, a0, t0) => a0.replace(/^(私|彼|彼女|私たち|彼ら)は/, '$1は') + 'がほしくてたまらな' + (t0 === 'いる' ? 'い' : 'かった'));
    }""",
    """      ja = ja.replace(/([^、。]+?)のために死んで(いる|いた)/, (m0, a0, t0) => a0.replace(/^(私|彼|彼女|私たち|彼ら)は/, '$1は') + 'がほしくてたまらな' + (t0 === 'いる' ? 'い' : 'かった'));
      ja = ja.replace(/^((?:その|この)?(?:植物|花|木|草|葉|植木|サンゴ|森)(?:たち)?(?:は|が)[^、。]{0,8}?)死んで(いる|いた)/, '$1枯れかけて$2').replace(/死んで(いる|いた)(?=。|$)/, '死にかけて$1');   // The plant is dying → 植物は枯れかけている
    }""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
