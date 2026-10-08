import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()
old = ".replace(/([^、。]+?)を研究するために一緒に働いた/g, '協力して$1を研究した').replace(/([^、。]+?)する最初の(女性|男性|日本人|人|アジア人)になった/g, '$2として初めて$1した');"
assert s.count(old) == 1
s = s.replace(old, ".replace(/([^、。がは]+?)を研究するために一緒に働いた/g, '協力して$1を研究した').replace(/([^、。がは]+?)する最初の(女性|男性|日本人|人|アジア人)になった/g, '$2として初めて$1した');")
io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
