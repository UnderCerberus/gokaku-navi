import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# more and more companies have started to allow … → 認め始めた会社がますます増えている
rep("""      return s + (locF ? locF[1] + 'では、' : '') + cl.parts.join('') + (pastF && !cl.prog ? cl.pred.form('past') : cl.pred.plain())""",
    """      return s + (locF ? locF[1] + 'では、' : '') + cl.parts.join('') + ((pastF || (cl.perfect && /始める$/.test(cl.pred.plain()))) && !cl.prog ? cl.pred.form('past') : cl.pred.plain())""")

rep("""    ja = ja.replace(/注意深くなる必要/g, '気をつける必要')""",
    """    ja = ja.replace(/していずに/g, 'せずに').replace(/(親|両親|親たち|父親|母親)が(?:彼らの|自分の)(子ども|子供)/g, '$1が$2');   // without being nervous → 緊張せずに / allows parents to spend more time with their children → 親が子どもたちと
    ja = ja.replace(/注意深くなる必要/g, '気をつける必要')""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
