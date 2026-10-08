import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

rep("""|dinosaur|dinosaurs|fossil|fossils|volcano|volcanoes|earthquake|earthquakes)$/.test(oh)) sense = { particle: 'を', core: '研究する', tr: true };""",
    """|dinosaur|dinosaurs|fossil|fossils|volcano|volcanoes|earthquake|earthquakes|octopus|octopuses|whale|whales|dolphin|dolphins|monkey|monkeys|ape|apes|chimpanzee|chimpanzees|elephant|elephants|ant|ants|frog|frogs|snake|snakes|shark|sharks|bat|bats|wolf|wolves|bear|bears|penguin|penguins|coral|corals|glacier|glaciers|soil|sleep|dreams|memory|intelligence|emotions|twins|patients|crows|crow|parrots|mice|rats)$/.test(oh)) sense = { particle: 'を', core: '研究する', tr: true };""")

# can solve puzzles, open jars, and even escape → 解いたり、開けたり、逃げたりさえできる（and のあとの副詞 even / also）
rep("""      else if (T[x].k === 'w' && /^(?:and|or)$/.test(T[x].w) && vb(x + 1)) {""",
    """      else if (T[x].k === 'w' && /^(?:and|or)$/.test(T[x].w) && T[x + 1] && T[x + 1].k === 'w' && /^(?:even|also|then)$/.test(T[x + 1].w) && vb(x + 2)) { cuts.push([isP(T[x - 1], ',') ? x - 1 : x, x + 1]); conj = T[x].w; break; }
      else if (T[x].k === 'w' && /^(?:and|or)$/.test(T[x].w) && vb(x + 1)) {""")

rep("""    ja = ja.replace(/世紀の最中に/g, '世紀半ばに').replace(/世紀の終わりに/g, '世紀末に');""",
    """    ja = ja.replace(/世紀の最中に/g, '世紀半ばに').replace(/世紀の終わりに/g, '世紀末に');
    ja = ja.replace(/それらの([^、。]{1,6})で知られている/g, 'その$1で知られている').replace(/(ことが)彼らが/g, '$1').replace(/^((?:研究者|科学者|専門家|医者|多くの研究者|多くの科学者)は.+)といいと思う(。?)$/, '$1ことを期待している$2');   // Octopuses are known for their intelligence → その知能で知られている / Researchers hope that … → …ことを期待している
    if (tokens.some((x) => x.w === 'located')) ja = ja.replace(/(そのうちの(?:ほとんど|多く|大部分|一部)は)(?:それらの|彼らの)?([^、。]+?)である(。?)$/, '$1$2にある$3');   // most of which are located in their arms → そのうちのほとんどは腕にある""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
