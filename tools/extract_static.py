#!/usr/bin/env python3
"""Extract FAQ library, portfolio items, team, and page meta for core pages from original HTML snapshots."""
import sys, re, json, os, bs4
sys.path.insert(0, os.path.dirname(__file__))
RAW, OUT = sys.argv[1], sys.argv[2]
def load(n): return bs4.BeautifulSoup(open(os.path.join(RAW, n + '.html'), encoding='utf-8', errors='ignore').read(), 'html.parser')
def tx(e):
    if e is None: return ''
    t = re.sub(r'\s+', ' ', e.get_text(' ', strip=True)); t = re.sub(r'\s+([,.!?;:])', r'\1', t); return t.strip()
def meta(s):
    m = {'title': s.title.get_text(strip=True) if s.title else ''}
    for x in s.find_all('meta'):
        k = x.get('name') or x.get('property')
        if k in ('description', 'keywords', 'og:title', 'og:description', 'og:url', 'og:image'): m[k] = x.get('content') or ''
    c = s.find('link', rel='canonical'); m['canonical'] = c.get('href') if c else ''
    return m
metas = {}
for n in ['home', 'about.php', 'service.php', 'portfolio.php', 'blog.php', 'faq.php', 'our-team.php', 'contact.php', 'career.php']:
    metas[n] = meta(load(n))
json.dump(metas, open(os.path.join(OUT, 'core-meta.json'), 'w'), indent=1, ensure_ascii=False)

# FAQ library
s = load('faq.php')
cats = [{'id': b.get('data-filter') or b.get('data-cat'), 'label': tx(b)} for b in s.find_all('button') if b.get('data-filter') or b.get('data-cat')]
items = []
for it in s.find_all(class_='faq-item'):
    q = tx(it.find(class_='faq-question'))
    inner = it.find(class_='faq-answer-inner') or it.find(class_='faq-answer')
    b = inner.find(class_='faq-cat-badge')
    if b: b.decompose()
    items.append({'category': it.get('data-cat'), 'q': q, 'a': tx(inner)})
json.dump({'categories': cats, 'items': items}, open(os.path.join(OUT, 'faq-library.json'), 'w'), indent=1, ensure_ascii=False)
print('faq', len(items), cats)

# Portfolio
s = load('portfolio.php')
filters = [{'id': b.get('data-cat'), 'label': re.sub(r'\s*\d+$', '', tx(b))} for b in s.find_all('button') if b.get('data-cat')]
port = []
for el in s.find_all(attrs={'data-cat': True}):
    if el.name == 'button': continue
    img = el.find('img')
    if img: port.append({'category': el.get('data-cat'), 'src': img.get('src'), 'alt': img.get('alt') or ''})
json.dump({'filters': filters, 'items': port}, open(os.path.join(OUT, 'portfolio.json'), 'w'), indent=1, ensure_ascii=False)
print('portfolio', len(port))

# Team
s = load('our-team.php')
team = []
for item in s.find_all(class_='single-item'):
    h = item.find('h4')
    if not h: continue
    name = tx(h)
    role = h.find_next_sibling('span')
    img = item.find('img')
    team.append({'name': name, 'role': tx(role) if role else '', 'image': img.get('src') if img else None})
json.dump(team, open(os.path.join(OUT, 'team.json'), 'w'), indent=1, ensure_ascii=False)
print('team', team)
