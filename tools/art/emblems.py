"""Knight Web Studio artwork: the crest, the chess pieces and the hero shards.

Everything is hand-placed vector geometry, returned as SVG strings. The site
has no build step, so tools/art/build.py writes these into the HTML between
<!-- art:NAME --> markers; run it again after changing anything here.

Colours are fixed (see PALETTE) rather than themed: the crest is an emblem and
looks the same on the dark and light themes, like a printed badge would.

Every function takes a `uid` so two copies on one page never share an id
(clip paths and gradients are looked up by id).
"""

# ---------------------------------------------------------------- palette
PALETTE = {
    '--t1': '#c9d4ff', '--t2': '#a5b8ff', '--t3': '#6d8bff',   # lit facets
    '--t4': '#4f6ef7', '--t5': '#3348b8',                      # shaded facets
    '--ink': '#080b14', '--accent': '#46e0c0',
    '--rim': '#3348b8', '--rim2': '#a5b8ff',
    '--field1': '#17203a', '--field2': '#0b1020', '--ribbon': '#141c3f', '--ribbon2': '#0b1020',
    '--steel1': '#dfe6fb', '--steel2': '#a9b6d6', '--steel3': '#7d8bb0',
}
STYLE = ';'.join(f'{k}:{v}' for k, v in PALETTE.items())

SHIELD = 'M60 6C75 12 92 15 104 16V56C104 86 84 104 60 114C36 104 16 86 16 56V16C28 15 45 12 60 6Z'
INNER = 'M60 14C73 19 88 22 97 23V56C97 81 80 97 60 106C40 97 23 81 23 56V23C32 22 47 19 60 14Z'


def _pts(pts):
    return ' '.join(f'{x},{y}' for x, y in pts)


# ---------------------------------------------------------------- the horse
# A chess knight's head in profile, facing left, cut into facets. 100-unit box;
# the neck runs past the bottom so whatever frames it can crop it.
_P = dict(ET=(54, 4), EB=(61, 15), EF=(46, 12), F=(37, 15), FF=(24, 27), N=(13, 41),
          MF=(8, 49), MB=(12, 56), CH=(23, 58), J=(42, 54), TH=(38, 63), NF=(31, 80),
          BL=(26, 112), BR=(78, 112), BM=(53, 112), NB=(72, 80), EY=(35, 29), C=(50, 37),
          MM=(24, 46), MI1=(63, 24), MI2=(65, 43), MI3=(63, 63))
_MANE = [(61, 15), (67, 16), (72, 22), (69, 26), (77, 32), (73, 36), (79, 44), (74, 48),
         (79, 57), (73, 61), (76, 70), (72, 80)]
_TONE = dict(L='var(--t1)', ML='var(--t2)', M='var(--t3)', MD='var(--t4)', D='var(--t5)')
_FACETS = [
    (['ET', 'EB', 'EF'], 'ML'), (['ET', 'EF', (50, 9)], 'L'), (['F', 'EF', 'EB', 'MI1', 'EY'], 'M'),
    (['F', 'FF', 'EY'], 'L'), (['FF', 'N', 'MM', 'EY'], 'ML'), (['N', 'MF', 'MB', 'CH', 'MM'], 'L'),
    (['EY', 'MM', 'C'], 'M'), (['EY', 'C', 'MI1'], 'MD'), (['MM', 'CH', 'J', 'C'], 'MD'),
    (['C', 'J', 'TH', 'MI3', 'MI2'], 'M'), (['C', 'MI2', 'MI1'], 'MD'),
    (['TH', 'NF', 'BL', 'BM', 'MI3'], 'M'), (['MI3', 'BM', 'BR', 'NB'], 'MD'),
    (_MANE + ['MI3', 'MI2', 'MI1'], 'D'),
]


def horse():
    out = []
    for i, (pts, tone) in enumerate(_FACETS):
        xy = [_P[p] if isinstance(p, str) else p for p in pts]
        # each facet starts a little way off, so the head can assemble itself
        dx, dy = ((i * 37) % 11 - 5) * 1.6, ((i * 53) % 9 - 4) * 1.6
        out.append(f'<polygon class="facet" style="--i:{i};--dx:{dx:.1f}px;--dy:{dy:.1f}px" '
                   f'fill="{_TONE[tone]}" points="{_pts(xy)}"/>')
    out.append('<path class="eye" d="M30 27Q35 24 40 27Q35 30 30 27Z" fill="var(--ink)"/>')
    out.append('<path d="M12 46L16 45" stroke="var(--ink)" stroke-width="1.6" stroke-linecap="round"/>')
    return ''.join(out)


# ---------------------------------------------------------------- shield parts
_RIVETS = [(24, 20), (42, 15.5), (60, 11), (78, 15.5), (96, 20), (100, 44), (20, 44),
           (94, 76), (26, 76), (79, 97), (41, 97)]


def _defs(uid):
    return (f'<defs>'
            f'<linearGradient id="{uid}-fld" x1="0" y1="0" x2="0" y2="1">'
            f'<stop offset="0" stop-color="var(--field1)"/><stop offset="1" stop-color="var(--field2)"/></linearGradient>'
            f'<radialGradient id="{uid}-glow" cx=".5" cy=".42" r=".5">'
            f'<stop offset="0" stop-color="#6d8bff" stop-opacity=".35"/><stop offset="1" stop-color="#6d8bff" stop-opacity="0"/></radialGradient>'
            f'<linearGradient id="{uid}-gl" x1="0" x2="1"><stop offset="0" stop-color="#fff" stop-opacity="0"/>'
            f'<stop offset=".5" stop-color="#fff" stop-opacity=".5"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>'
            f'<clipPath id="{uid}-in"><path d="{INNER}"/></clipPath>'
            f'<clipPath id="{uid}-out"><path d="{SHIELD}"/></clipPath>'
            f'</defs>')


def _shield(uid, art, detail=True):
    s = [f'<g class="a-rim"><path d="{SHIELD}" fill="var(--rim)"/>',
         f'<path d="{SHIELD}" fill="none" stroke="var(--rim2)" stroke-opacity=".55" stroke-width="1.2"/>',
         f'<path class="a-field" d="{INNER}" fill="url(#{uid}-fld)"/></g>',
         f'<g clip-path="url(#{uid}-in)"><circle class="a-field" cx="60" cy="50" r="42" fill="url(#{uid}-glow)"/>{art}</g>',
         f'<path class="a-line" pathLength="1" d="{INNER}" fill="none" stroke="var(--accent)" stroke-opacity=".9" stroke-width="1"/>']
    if detail:
        s += [f'<circle class="rivet" style="--i:{i}" cx="{x}" cy="{y}" r="1.6" fill="var(--rim2)" fill-opacity=".85"/>'
              for i, (x, y) in enumerate(_RIVETS)]
        s.append(f'<g clip-path="url(#{uid}-out)"><g transform="rotate(20 60 60)">'
                 f'<rect class="a-glint" x="-60" y="-30" width="16" height="180" fill="url(#{uid}-gl)"/></g></g>')
    return ''.join(s)


_HORSE_IN_SHIELD = '<g transform="translate(22 22) scale(.86)" stroke-linejoin="round">{}</g>'


def charger(uid, cls='crest', label=None, detail=True):
    """The Charger shield: the studio's mark."""
    a11y = f'role="img" aria-label="{label}"' if label else 'aria-hidden="true"'
    return (f'<svg class="{cls}" viewBox="0 0 120 120" {a11y} style="{STYLE}">'
            f'{_defs(uid)}{_shield(uid, _HORSE_IN_SHIELD.format(horse()), detail)}</svg>')


def _sword():
    return ('<path d="M-3 40V-92L0-100L3-92V40Z" fill="var(--steel1)" stroke="var(--steel3)" stroke-width=".6"/>'
            '<path d="M0-100L3-92V40H0Z" fill="var(--steel2)"/>'
            '<path d="M0-90V34" stroke="var(--steel3)" stroke-width=".8"/>'
            '<rect x="-13" y="40" width="26" height="4.2" rx="2.1" fill="var(--rim)"/>'
            '<rect x="-2.2" y="44.2" width="4.4" height="10" fill="var(--t5)"/>'
            '<circle cy="57.5" r="3.6" fill="var(--rim)"/><circle cy="57.5" r="1.4" fill="var(--accent)"/>')


def _ribbon(uid, text):
    return (f'<path d="M14 128L24 120L22 136Z" fill="var(--ribbon2)"/><path d="M146 128L136 120L138 136Z" fill="var(--ribbon2)"/>'
            f'<path d="M4 124H26L22 132L26 140H4L10 132Z" fill="var(--ribbon)"/>'
            f'<path d="M156 124H134L138 132L134 140H156L150 132Z" fill="var(--ribbon)"/>'
            f'<path d="M22 118Q80 132 138 118V134Q80 148 22 134Z" fill="var(--ribbon)"/>'
            f'<path d="M22 118Q80 132 138 118M22 134Q80 148 138 134" fill="none" stroke="var(--accent)" stroke-width=".8"/>'
            f'<path id="{uid}-rbt" d="M28 130.5Q80 144 132 130.5" fill="none"/>'
            f'<text font-family="Bricolage, Manrope, system-ui, sans-serif" font-weight="700" font-size="7.4" '
            f'letter-spacing="1.2" fill="#eef2fb" text-anchor="middle">'
            f'<textPath href="#{uid}-rbt" startOffset="50%">{text}</textPath></text>')


def full_crest(uid, cls='crest-full', label='Knight Web Studio crest', text='KNIGHT WEB STUDIO'):
    """The Charger shield with crossed swords and a name ribbon, for large spots."""
    a11y = f'role="img" aria-label="{label}"' if label else 'aria-hidden="true"'
    return (f'<svg class="{cls}" viewBox="0 0 160 164" {a11y} style="{STYLE}">{_defs(uid)}'
            f'<g transform="translate(80 84) rotate(-40)"><g class="a-sw a-sw-l">{_sword()}</g></g>'
            f'<g transform="translate(80 84) rotate(40)"><g class="a-sw a-sw-r">{_sword()}</g></g>'
            f'<g transform="translate(20 6)"><g class="a-drop">{_shield(uid, _HORSE_IN_SHIELD.format(horse()))}</g></g>'
            f'<g transform="translate(0 16)"><g class="a-ribbon">{_ribbon(uid, text)}</g></g></svg>')


def favicon_mark():
    """Simplified for 16-48px: rim, field and a two-tone horse, no rivets or glint."""
    uid = 'fav'
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" style="{STYLE}">{_defs(uid)}'
            f'<path d="{SHIELD}" fill="var(--rim)"/><path d="{INNER}" fill="url(#{uid}-fld)"/>'
            f'<g clip-path="url(#{uid}-in)">{_HORSE_IN_SHIELD.format(horse())}</g>'
            f'<path d="{INNER}" fill="none" stroke="var(--accent)" stroke-width="2.4"/></svg>')


# ---------------------------------------------------------------- chess pieces
# Symmetric about x=50 in a 100-unit box; sections run bottom to top so they
# can stack up one after another. Left half lit, right half in shade.
_BASE = ['M20 94H80V88C80 84 76 81 72 81H28C24 81 20 84 20 88Z',
         'M28 81H72L67 74H33Z']
PIECES = {
    'pawn': _BASE + [
        'M36 74C38 64 42 56 43 49H57C58 56 62 64 64 74Z',
        'M37 49H63C63 45 59 43 50 43C41 43 37 45 37 49Z',
        'M50 16C58 16 64 22 64 30C64 37 58 43 50 43C42 43 36 37 36 30C36 22 42 16 50 16Z'],
    'rook': _BASE + [
        'M34 74L37 40H63L66 74Z',
        'M31 40H69L66 34H34Z',
        'M30 34V16H38V22H45V16H55V22H62V16H70V34Z'],
    'bishop': _BASE + [
        'M35 74C38 64 42 56 43 50H57C58 56 62 64 65 74Z',
        'M36 50H64C64 46 59 44 50 44C41 44 36 46 36 50Z',
        'M50 12C58 20 64 29 64 36C64 41 58 44 50 44C42 44 36 41 36 36C36 29 42 20 50 12Z',
        'M50 5C53 5 55 7 55 10C55 13 53 14 50 14C47 14 45 13 45 10C45 7 47 5 50 5Z'],
    'queen': _BASE + [
        'M34 74C37 63 41 54 42 46H58C59 54 63 63 66 74Z',
        'M35 46H65C65 42 59 40 50 40C41 40 35 42 35 46Z',
        'M33 40L28 18L39 30L44 12L50 28L56 12L61 30L72 18L67 40Z',
        'M28 7.5a3.5 3.5 0 1 0 .01 0ZM44 1.5a3.5 3.5 0 1 0 .01 0ZM56 1.5a3.5 3.5 0 1 0 .01 0ZM72 7.5a3.5 3.5 0 1 0 .01 0Z'],
    'king': _BASE + [
        'M34 74C37 63 41 54 42 46H58C59 54 63 63 66 74Z',
        'M35 46H65C65 42 59 40 50 40C41 40 35 42 35 46Z',
        'M34 40C33 30 38 24 50 24C62 24 67 30 66 40Z'],
}
# Small details drawn on top of the finished piece
_DETAIL = {
    'rook': '<path d="M48.2 50H51.8V62H48.2Z" fill="var(--ink)" fill-opacity=".7"/>',
    'bishop': '<path d="M53 22L45 33" stroke="var(--ink)" stroke-width="2.4" stroke-linecap="round"/>',
    'king': '<path d="M47 2H53V8H59V14H53V24H47V14H41V8H47Z" fill="var(--accent)"/>',
    'queen': '<circle cx="50" cy="35" r="2.2" fill="var(--accent)"/>',
    'pawn': '',
}
_LIT, _SHADE = ['var(--t2)', 'var(--t3)'], ['var(--t4)', 'var(--t5)']


def piece(name, uid, label=None):
    a11y = f'role="img" aria-label="{label}"' if label else 'aria-hidden="true"'
    out = [f'<svg class="piece piece-{name}" viewBox="0 0 100 100" {a11y} style="{STYLE}">',
           f'<defs><clipPath id="{uid}-r"><rect x="50" y="0" width="50" height="100"/></clipPath></defs>']
    if name == 'knight':
        # the crest's horse, standing on the same plinth as the other pieces
        sections = _BASE
        for i, d in enumerate(sections):
            out.append(f'<g class="sect" style="--i:{i}"><path d="{d}" fill="{_LIT[i % 2]}"/>'
                       f'<path d="{d}" fill="{_SHADE[i % 2]}" clip-path="url(#{uid}-r)"/></g>')
        out.append(f'<clipPath id="{uid}-neck"><rect x="0" y="0" width="100" height="75"/></clipPath>'
                   f'<g class="sect" style="--i:2" clip-path="url(#{uid}-neck)">'
                   f'<g transform="translate(19 8) scale(.66)" stroke-linejoin="round">{horse()}</g></g>')
    else:
        for i, d in enumerate(PIECES[name]):
            out.append(f'<g class="sect" style="--i:{i}"><path d="{d}" fill="{_LIT[i % 2]}"/>'
                       f'<path d="{d}" fill="{_SHADE[i % 2]}" clip-path="url(#{uid}-r)"/></g>')
        n = len(PIECES[name])
        out.append(f'<g class="sect" style="--i:{n}">{_DETAIL[name]}</g>')
    out.append('</svg>')
    return ''.join(out)


# ---------------------------------------------------------------- hero shards
# Loose facets drifting behind a hero: the crest's cut-gem language, spread out.
_SHARDS = [   # small, and kept to the outer edges so they never sit behind text
    ((3, 12), (8, 5), (10, 14), 'var(--t3)', .20, 0), ((88, 8), (95, 13), (90, 19), 'var(--t2)', .18, 1),
    ((93, 52), (98, 60), (91, 62), 'var(--t4)', .20, 2), ((2, 74), (7, 70), (6, 80), 'var(--t2)', .16, 3),
    ((80, 86), (86, 82), (85, 92), 'var(--t3)', .16, 4), ((96, 30), (99, 36), (94, 35), 'var(--accent)', .16, 5),
    ((6, 40), (9, 46), (4, 47), 'var(--accent)', .14, 6), ((72, 4), (77, 8), (71, 10), 'var(--t4)', .16, 7),
]


def shards():
    polys = ''.join(f'<polygon class="shard" style="--i:{i}" fill="{c}" fill-opacity="{o}" points="{_pts([a, b, d])}"/>'
                    for a, b, d, c, o, i in _SHARDS)
    return (f'<svg class="shards" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true" '
            f'style="{STYLE}">{polys}</svg>')
