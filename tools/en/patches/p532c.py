import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# my relatives / my cousins / my uncle → 人（they / them を それら にしない）
rep("""'owner manager employee employer worker boss chef baker shopkeeper clerk soldier general lawyer professor coach player athlete runner swimmer individual individuals');""",
    """'owner manager employee employer worker boss chef baker shopkeeper clerk soldier general lawyer professor coach player athlete runner swimmer individual individuals ' +
    'relative relatives cousin cousins uncle aunt nephew niece grandchild grandchildren colleague colleagues coworker coworkers teammate teammates roommate roommates partner');""")

# When my relatives ate them at the party → それらを食べた（eat / drink / bake などの目的語の them は物。同じ節の主語の人を指さない）
rep("""|plant|plants|planted|harvest|harvests|harvested|collect|collects|collected|deliver|delivers|delivered)$/.test(T[i - 1].w) && !T.slice(0, Math.max(0,""",
    """|plant|plants|planted|harvest|harvests|harvested|collect|collects|collected|deliver|delivers|delivered|eat|eats|ate|eaten|drink|drinks|drank|bake|bakes|baked|fry|fries|fried|boil|boils|boiled|taste|tastes|tasted|wrapped|order|orders|ordered|serve|serves|served)$/.test(T[i - 1].w) && !T.slice(0, Math.max(0,""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
