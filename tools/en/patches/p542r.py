import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# cities have far fewer trees and green spaces than rural areas → 農村部よりはるかに少ない（than が後ろにあれば much / far + 比較級の規則は使わない。「農村部はるかに少ない」にしない）
rep("""&& !T.slice(kMm + 1, Math.min(lim, kMm + 6)).some((x) => isW(x, 'than'))) {""",
    """&& !T.slice(kMm + 1, lim).some((x) => isW(x, 'than'))) {""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
