import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# It is easier to learn if you practice every day → 毎日練習すれば（learn / change / improve / explain などの後の if は条件。「練習するかどうか学ぶ」にしない）
rep("""    if (WHV[L] && (WH[T[iw].w] || T[iw].w === 'whether' || T[iw].w === 'if') && !(T[iw].w === 'what' &&""",
    """    if (WHV[L] && (WH[T[iw].w] || T[iw].w === 'whether' || T[iw].w === 'if') && !(T[iw].w === 'if' && !/^(?:know|wonder|ask|tell|see|check|decide|doubt|find|remember|forget|care|mind|determine|test|inquire|show|understand|matter|depend|confirm|guess|say|predict|discover|notice|consider|recall|question|judge|verify|investigate|examine)$/.test(L)) && !(T[iw].w === 'what' &&""")

# 文の後ろの if 節の切り出しも同じ（We will learn if we study hard → 一生懸命勉強すれば学ぶだろう）
rep("""WHV[vc(pv, ['base', '3sg', 'past', 'pp', 'ing']).lemma] && !(T[j].w === 'when' && !""",
    """WHV[vc(pv, ['base', '3sg', 'past', 'pp', 'ing']).lemma] && !(T[j].w === 'if' && !/^(?:know|wonder|ask|tell|see|check|decide|doubt|find|remember|forget|care|mind|determine|test|inquire|show|understand|matter|depend|confirm|guess|say|predict|discover|notice|consider|recall|question|judge|verify|investigate|examine)$/.test(vc(pv, ['base', '3sg', 'past', 'pp', 'ing']).lemma)) && !(T[j].w === 'when' && !""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
