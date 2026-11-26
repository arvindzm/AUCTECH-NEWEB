#!/usr/bin/env python3
"""
One-off content migration tool (Phase 3).
Reads saved HTML snapshots of the ORIGINAL auctechitsolutions.in pages and emits
structured JSON into src/content/. Text is copied verbatim (whitespace-normalised);
nothing is rewritten or invented.

usage: python3 tools/extract_content.py <raw_html_dir> <out_dir>
"""
import sys, re, json, os, glob, bs4

RAW, OUT = sys.argv[1], sys.argv[2]
os.makedirs(os.path.join(OUT, 'pages'), exist_ok=True)

def tx(e):
    if e is None: return ''
    t = re.sub(r'\s+', ' ', e.get_text(' ', strip=True))
    t = re.sub(r'\s+([,.!?;:’\'])', r'\1', t)
    t = re.sub(r'([(“"])\s+', r'\1', t)
    return t.strip()

def title_parts(h):
    """return (plain, accent) for headings that contain a highlighted <span>"""
    if h is None: return ('', '')
    sp = h.find('span')
    return (tx(h), tx(sp) if sp else '')

def meta(s):
    m = {'title': (s.title.get_text(strip=True) if s.title else '')}
    for x in s.find_all('meta'):
        k = x.get('name') or x.get('property')
        if k in ('description', 'keywords', 'og:title', 'og:description', 'og:url', 'og:image'):
            m[k] = x.get('content') or ''
    c = s.find('link', rel='canonical')
    m['canonical'] = c.get('href') if c else ''
    return m

def role(sec):
    for c in sec.get('class') or []:
        for r in ['intro', 'stats', 'why', 'power', 'services', 'process', 'cta', 'faq']:
            if re.search(r'(^|-)' + r + r'(-|$)', c): return r
    return None

def desc_of(sec):
    p = sec.find('p', class_=re.compile('desc'))
    return tx(p) if p else ''

def label_of(sec):
    l = sec.find(class_=re.compile(r'(label|eyebrow)'))
    return tx(l) if l else ''

def cards(sec, skip_h2=True):
    out = []
    for hd in sec.find_all(['h3', 'h4']):
        node = hd
        # climb to the largest ancestor that still holds only this heading
        while node.parent and node.parent is not sec and len(node.parent.find_all(['h3', 'h4'])) == 1:
            node = node.parent
        p = node.find('p')
        out.append({'title': tx(hd), 'text': tx(p) if p else ''})
    return out

def img_of(sec):
    i = sec.find('img')
    return {'src': i.get('src'), 'alt': i.get('alt') or ''} if i else None

def jsonld(s):
    out = []
    for sc in s.find_all('script', type='application/ld+json'):
        try: out.append(json.loads(sc.string))
        except Exception: pass
    return out

def parse_service_like(path):
    s = bs4.BeautifulSoup(open(path, encoding='utf-8', errors='ignore').read(), 'html.parser')
    d = {'meta': meta(s), 'jsonLd': [j for j in jsonld(s) if j.get('@type') != 'LocalBusiness']}
    for t in s(['script', 'style', 'noscript']): t.decompose()
    h = s.find('section', class_='premium-hero')
    if h:
        h1 = h.find('h1')
        d['hero'] = {'eyebrow': label_of(h), 'h1': tx(h1), 'accent': title_parts(h1)[1], 'sub': tx(h.find('p')),
                     'breadcrumb': tx(h.find('li', class_='active'))}
    for sec in s.body.find_all('section'):
        r = role(sec)
        if not r: continue
        if r == 'intro':
            h2 = sec.find('h2')
            d['intro'] = {'label': label_of(sec), 'h2': tx(h2), 'accent': title_parts(h2)[1],
                          'paras': [tx(p) for p in sec.find_all('p')], 'image': img_of(sec),
                          'cta': ({'label': tx(a), 'href': a.get('href')} if (a := sec.find('a', class_=re.compile('btn'))) else None)}
        elif r == 'stats':
            vals = []
            for n in sec.find_all(class_=re.compile(r'(stat-num|stat-number)')):
                lab = n.find_next(class_=re.compile('stat-label'))
                vals.append({'value': tx(n), 'label': tx(lab)})
            d['stats'] = vals
        elif r in ('why', 'services', 'process'):
            h2 = sec.find('h2')
            d[r] = {'label': label_of(sec), 'h2': tx(h2), 'accent': title_parts(h2)[1], 'desc': desc_of(sec),
                    'items': [c for c in cards(sec)]}
        elif r == 'power':
            h2 = sec.find('h2')
            d['power'] = {'label': label_of(sec), 'h2': tx(h2), 'accent': title_parts(h2)[1],
                          'items': cards(sec), 'image': img_of(sec)}
        elif r == 'cta':
            btn = sec.find('a')
            d['cta'] = {'h2': tx(sec.find('h2')), 'text': tx(sec.find('p')),
                        'primary': {'label': tx(btn), 'href': btn.get('href')} if btn else None}
        elif r == 'faq':
            h2 = sec.find('h2')
            items = []
            for q in sec.find_all(class_=re.compile(r'(faq-q|accordion-header)$|faq-q\b|accordion-header\b')):
                a = q.find_next(class_=re.compile(r'(faq-a|accordion-body)\b'))
                items.append({'q': tx(q), 'a': tx(a)})
            d['faq'] = {'h2': tx(h2), 'accent': title_parts(h2)[1], 'desc': desc_of(sec), 'items': items}
    return d

OUT_PAGES = {}
for f in sorted(glob.glob(os.path.join(RAW, '*.html'))):
    name = os.path.basename(f)[:-5]
    if name.startswith('blog_') or name in ('home',): continue
    if name.endswith('.php') and (name.startswith('3d-walkthrough-in-') or name.startswith('best-') or
                                  name.startswith('branding-') or name.startswith('3d-architectural')):
        d = parse_service_like(f)
        d['slug'] = name
        json.dump(d, open(os.path.join(OUT, 'pages', name[:-4] + '.json'), 'w'), indent=1, ensure_ascii=False)
        OUT_PAGES[name] = d

print('service/city pages:', len(OUT_PAGES))
# sanity report
for n, d in OUT_PAGES.items():
    miss = [k for k in ['hero', 'intro', 'stats', 'services', 'process', 'cta', 'faq'] if not d.get(k)]
    if d.get('faq') and len(d['faq']['items']) == 0: miss.append('faq-items-empty')
    if miss: print('MISSING', n, miss)
