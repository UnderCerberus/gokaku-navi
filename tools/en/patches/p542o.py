import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# Someday I would like to show visitors around Japan → いつか、日本を案内したい（コンマのない文頭の someday / eventually / recently なども文頭の副詞）
rep("""      if (t.k === 'w' && /^(?:perhaps|maybe|probably|certainly|surely|fortunately|unfortunately|actually|suddenly|finally|clearly|obviously|hopefully|luckily|sadly|interestingly|naturally|apparently|definitely|honestly|then|now)$/.test(t.w)""",
    """      if (t.k === 'w' && /^(?:perhaps|maybe|probably|certainly|surely|fortunately|unfortunately|actually|suddenly|finally|clearly|obviously|hopefully|luckily|sadly|interestingly|naturally|apparently|definitely|honestly|then|now|someday|eventually|recently|lately|nowadays|afterwards|later)$/.test(t.w)""")

# guide foreign tourists around the old castle → 外国人観光客に古い城を案内する（guide A around B は show A around B と同じ）
# I hope to continue working … until I graduate, and someday I would like to … → 卒業するまで…働き続けたいと思い、いつか…したい（, and + 副詞 + 主語の代名詞も外側の並列で切る）
rep("""        // …until Daichi had finished, and then, to my surprise, he smiled（, and + 主語・then）""",
    """        if (isP(T[x], ',') && isW(T[x + 1], 'and') && T[x + 2] && T[x + 2].k === 'w' && /^(?:someday|later|now|eventually|finally|soon|today|recently|also|still|afterwards|sometimes|usually|often|one)$/.test(T[x + 2].w) && T[x + 3] && T[x + 3].k === 'w' && ((PRON[T[x + 3].w] && PRON[T[x + 3].w].sub) || (T[x + 2].w === 'one' && isW(T[x + 3], 'day')))) return true;
        // …until Daichi had finished, and then, to my surprise, he smiled（, and + 主語・then）""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
