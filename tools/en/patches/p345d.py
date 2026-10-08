import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# I had curry for lunch → 昼食にカレーを食べた / Let's have pizza → ピザを食べましょう（have + 食べ物 = 食べる）
rep("""      else if (L === 'have' && !vg.passive && (vg.imp || vg.past || vg.modal || vg.nonfin || vg.semi || (o.subj && /^(?:let|we)$/.test(o.subj.pron || ''))) && /(?:^| )(?:coffee|tea|juice|milk|water|beer|wine|soda|drink|drinks|cocoa|cola|soup)$/.test(oh)""",
    """      else if (L === 'have' && !vg.passive && !vg.perfect && objs.length === 1 && !objs[0].an && (vg.imp || vg.past || vg.modal || vg.nonfin || vg.semi || (o.subj && /^(?:let|we)$/.test(o.subj.pron || '')) || T.slice(objs[0].end, lim).some((x, q) => isW(x, 'for') && T[objs[0].end + q + 1] && /^(?:breakfast|lunch|dinner|supper|dessert|snack)$/.test(T[objs[0].end + q + 1].w || '')) || T.some((x) => /^(?:usually|often|always|sometimes|every|never)$/.test(x.w || ''))) &&
        /(?:^| )(?:curry|rice|bread|toast|sandwich|sandwiches|hamburger|hamburgers|burger|burgers|pizza|pizzas|pasta|spaghetti|noodles|ramen|udon|soba|sushi|tempura|sashimi|onigiri|salad|salads|steak|steaks|chicken|beef|pork|fish|meat|egg|eggs|cake|cakes|cookie|cookies|cream|dessert|desserts|fruit|fruits|apple|apples|banana|bananas|orange|oranges|strawberry|strawberries|grapes|melon|watermelon|peach|peaches|cereal|yogurt|yoghurt|cheese|chocolate|chocolates|candy|snack|snacks|chips|fries|hotdog|taco|tacos|omelet|omelette|pancake|pancakes|waffle|waffles|doughnut|doughnuts|donut|donuts|pie|pies|stew|dumplings|gyoza|takoyaki|okonomiyaki|bento|seafood|vegetables|salmon|tuna|shrimp|tofu|natto|porridge|oatmeal|pudding|muffin|muffins|bagel|bagels|croissant|scone|scones|biscuit|biscuits|popcorn|sausage|sausages|bacon|ham|crepe|crepes|parfait|sundae|dinner|lunch|breakfast|meal|meals|food|dish|dishes|leftovers|barbecue|bbq)$/.test(oh) &&
        !T.slice(objs[0].end, lim).some((x, q) => /^(?:in|on)$/.test(x.w || '') && T.slice(objs[0].end + q + 1, Math.min(lim, objs[0].end + q + 4)).some((y) => /^(?:bag|bags|pocket|pockets|hand|hands|fridge|refrigerator|box|basket|backpack|desk|table|plate)$/.test(y.w || '')))) sense = { particle: 'を', core: '食べる', tr: true };
      else if (L === 'have' && !vg.passive && (vg.imp || vg.past || vg.modal || vg.nonfin || vg.semi || (o.subj && /^(?:let|we)$/.test(o.subj.pron || ''))) && /(?:^| )(?:coffee|tea|juice|milk|water|beer|wine|soda|drink|drinks|cocoa|cola|soup)$/.test(oh)""")

# 朝食のためにカレーを食べた → 朝食にカレーを食べた
rep("""    ja = ja.replace(/(朝食|昼食|夕食)のために([^、。]{1,10}?)を(作|料理|用意|準備)/g, '$1に$2を$3')""",
    """    ja = ja.replace(/(朝食|昼食|夕食|夜食|おやつ|デザート)のために([^、。]{1,16}?)を(食べ|飲)/g, '$1に$2を$3');
    ja = ja.replace(/(朝食|昼食|夕食)のために([^、。]{1,10}?)を(作|料理|用意|準備)/g, '$1に$2を$3')""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
