import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()
old = "ja: cPl.out({ part: 'が', form: 'attr' }).replace(/だ$/, 'である') + 'ことをお知らせできてうれしく思います。'"
assert s.count(old) == 1
s = s.replace(old, "ja: cPl.out({ part: 'が', form: 'attr' }).replace(/だろう$/, '').replace(/だ$/, 'である').replace(/(店|レストラン|カフェ|ホテル|図書館|博物館)が([^、。]*?)開く$/, '$1が$2開店する') + 'ことをお知らせできてうれしく思います。'")
io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
