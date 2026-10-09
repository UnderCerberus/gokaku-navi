import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()
old = "|離婚する|入学する|就職する|退職する)$/.test(cl.pred.plain());   // I heard that she got married"
new = "|離婚する|入学する|就職する|退職する|開発する|身につける|完成させる|設立する|解決する|達成する|獲得する|受賞する|取得する|出版する|盗む|捕まえる|逃げる|戻る|去る|訪れる|登る|描く|撮る|修理する|壊れる|倒れる|けがをする|消える|成功する|導入する|建設する|終える|閉鎖する|閉店する|招待する|紹介する|手に入れる|借りる|返す|払う|支払う|届く|届ける)$/.test(cl.pred.plain());   // I heard that she got married"
assert s.count(old) == 1
s = s.replace(old, new)
io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
