import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()
old = "'wet paint': 'ペンキ塗りたて', "
assert s.count(old) == 1
s = s.replace(old, old + "'i have been fine': '元気にしていました', 'i have been good': '元気にしていました', 'i have been well': '元気にしていました', 'i have been great': 'とても元気にしていました', 'what are you up to': '何をしているの', 'what have you been up to': '最近どうしていたの', 'not much': '特に何も', 'not much really': '特に何もないよ', 'let me see': 'ええと', 'let me think': 'ちょっと考えさせて', 'what a surprise': 'これは驚いた', 'you look great': 'とても元気そうだね', 'you look nice': 'すてきだね', 'you look tired': '疲れているみたいだね', 'same as usual': 'いつもと同じです', 'same as always': 'いつもと同じです', 'nothing special': '特に何もないよ', 'so far so good': '今のところ順調です', 'it is up to you': 'あなた次第です', 'that sounds fun': '楽しそうだね', 'that sounds great': 'それはいいね', 'sounds fun': '楽しそうだね', ")
io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
