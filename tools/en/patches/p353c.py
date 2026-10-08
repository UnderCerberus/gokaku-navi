import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()
old = "'wet paint': 'ペンキ塗りたて', "
assert s.count(old) == 1
s = s.replace(old, old + "'thanks for your help': '手伝ってくれてありがとう', 'thank you for your help': '手伝ってくれてありがとう', 'thank you very much for your help': '手伝ってくれて本当にありがとう', 'thank you so much for your help': '手伝ってくれて本当にありがとう', 'thanks a lot for your help': '手伝ってくれて本当にありがとう', 'thanks for the help': '手伝ってくれてありがとう', ")
io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
