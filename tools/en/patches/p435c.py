import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# in the early 17th century → at the beginning of the 17th century（17世紀の初めに）
rep(""".replace(/\\b(Sen|Minamoto|Fujiwara|Ono|Taira|Abe|Ki|Sugawara) no (Rikyu|Yoritomo|Yoshitsune|Michinaga|Komachi|Kiyomori|Seimei|Tsurayuki|Michizane)\\b/g, '$1no$2')""",
    """.replace(/\\b(Sen|Minamoto|Fujiwara|Ono|Taira|Abe|Ki|Sugawara) no (Rikyu|Yoritomo|Yoshitsune|Michinaga|Komachi|Kiyomori|Seimei|Tsurayuki|Michizane)\\b/g, '$1no$2').replace(/\\b([Ii]n|[Dd]uring) the early (\\d+(?:st|nd|rd|th)|[a-z]+(?:st|nd|rd|th)) century\\b/g, 'at the beginning of the $2 century').replace(/\\b([Ii]n|[Dd]uring) the late (\\d+(?:st|nd|rd|th)|[a-z]+(?:st|nd|rd|th)) century\\b/g, 'at the end of the $2 century').replace(/\\b([Ii]n|[Dd]uring) the mid-?(?:dle )?(\\d+(?:st|nd|rd|th)|[a-z]+(?:st|nd|rd|th)) century\\b/g, 'in the middle of the $2 century')""")

rep("""    ja = ja.replace(/まだ練習されている/g, '今でも行われている')""",
    """    ja = ja.replace(/世紀の最中に/g, '世紀半ばに').replace(/世紀の終わりに/g, '世紀末に');   // in the middle of the 20th century → 20世紀半ばに / at the end of the 19th century → 19世紀末に
    ja = ja.replace(/まだ練習されている/g, '今でも行われている')""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
