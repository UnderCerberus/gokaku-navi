import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

rep("""      else if (L === 'introduce' && /(?:^| )(?:system|systems|meeting|meetings|policy|policies|rule|rules|technology|technologies|program|programs|measure|measures|service|services|plan|plans|tax|taxes|law|laws|method|methods|device|devices|machine|machines|uniform|uniforms|fee|fees)$/.test(oh))""",
    """      else if (L === 'introduce' && /(?:^| )(?:system|systems|meeting|meetings|policy|policies|rule|rules|technology|technologies|program|programs|measure|measures|service|services|plan|plans|tax|taxes|law|laws|method|methods|device|devices|machine|machines|uniform|uniforms|fee|fees|charge|charges|ban|bans|limit|limits)$/.test(oh))""")

rep("""    ja = ja.replace(/知識の隙間/g, '知識の空白')""",
    """    ja = ja.replace(/より少ない人々が([^、。]+?)ように/g, '$1人が減るように').replace(/公共交通機関の(?:制度|システム)/g, '公共交通機関');   // so that fewer people need to drive → 運転する必要がある人が減るように
    ja = ja.replace(/知識の隙間/g, '知識の空白')""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
