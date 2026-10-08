import io
p = r'C:\Claude\gokaku-navi\js\data\dict-m-z.js'
s = io.open(p, encoding='utf-8').read()
old = "    ['treatment', '名', '扱い; 治療', 1],"
assert s.count(old) == 1
s = s.replace(old, "    ['treatment', '名', '治療; 扱い', 1],")
io.open(p, 'w', encoding='utf-8', newline='\n').write(s)

p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()
old = "    ja = ja.replace(/(リスク|危険|費用|コスト|ストレス|量|ごみ)を(減らす|下げる|抑える)ことがある/g, '$1を$2ことができる')"
assert s.count(old) == 1
s = s.replace(old, """    ja = ja.replace(/([^、。]{1,6})として辞職/g, '$1を辞任').replace(/新しい治療(?!法|を)/g, '新しい治療法').replace(/([^、。]{1,10}?)している状態にな/g, '$1するようにな').replace(/(減少|問題|汚染|危機|温暖化|事故|失敗|悪化|増加|衰退|不足)に貢献した/g, '$1の一因となった').replace(/(減少|問題|汚染|危機|温暖化|事故|失敗|悪化|増加|衰退|不足)に貢献する/g, '$1の一因となる').replace(/(対策|政策|計画|規則|制度)を実行し/g, '$1を実施し').replace(/から引っ越していっている/g, 'を離れている').replace(/から引っ越していった/g, 'を離れていった');   // resign as chairman → 議長を辞任する / contributed to the decline → 減少の一因となった / implemented strict measures → 対策を実施した / moving away from rural areas → 農村部を離れている
""" + old)
io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
