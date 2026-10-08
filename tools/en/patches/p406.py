import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()
old = "    ja = ja.replace(/注意深くなる必要/g, '気をつける必要')"
assert s.count(old) == 1
s = s.replace(old, """    ja = ja.replace(/(騒音|音|におい|煙)について([^、。]{1,10}?)から不平を言/g, '$2からの$1について苦情を言').replace(/のに役立つことを目指す/g, 'のを手助けすることを目指している').replace(/([^、。はが]{1,8}?)に([^、。]{3,20}?後で)昇進/, '$2、$1に昇進').replace(/(?:彼らの|それらの)声で/g, '声で').replace(/(家|照明|テレビ|エアコン|機器|ロボット)を支配/g, '$1を操作').replace(/([^、。はが]{1,8}?)で([^、。]{1,12}?)ではなく(支払|払)/, '$2ではなく$1で$3').replace(/支払うことのほうを好む/g, '支払うほうを好む');   // complained about the noise from the construction site → 建設現場からの騒音について苦情を言った / prefer to pay in cash rather than by credit card → クレジットカードではなく現金で支払うほうを好む
""" + old)
io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
