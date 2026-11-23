#!/usr/bin/env python3
"""Revisa los enlaces de los artículos recomendados de Comentarios IA (datos.json → ia.recomendados).

Uso: python3 revisar_enlaces.py
Para cada recomendado informa:
  OK        el artículo abre y su título original (`to`) aparece en la página
  REVISAR   abre, pero no se encontró el título (puede haber cambiado o tener muro de pago)
  ROTO      error 404/410, o el enlace redirige a la portada del medio
  SIN DATO  no se pudo comprobar (bloqueo 403, tiempo agotado, error de red): volver a probar otro día
Sale con código 1 si hay algún ROTO.
"""
import html, json, re, sys, unicodedata, urllib.error, urllib.parse, urllib.request

UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130 Safari/537.36'

def norm(s):
    s = unicodedata.normalize('NFKD', html.unescape(s or '')).encode('ascii', 'ignore').decode().lower()
    return re.sub(r'[^a-z0-9]+', ' ', s).strip()

def revisar(url, titulo):
    req = urllib.request.Request(url, headers={'User-Agent': UA, 'Accept-Language': 'es'})
    try:
        with urllib.request.urlopen(req, timeout=25) as r:
            final, body = r.geturl(), r.read(3_000_000).decode('utf-8', 'replace')
    except urllib.error.HTTPError as e:
        return ('ROTO' if e.code in (404, 410) else 'SIN DATO'), f'HTTP {e.code}'
    except Exception as e:
        return 'SIN DATO', type(e).__name__
    path = urllib.parse.urlparse(final).path.strip('/')
    if not path:
        return 'ROTO', f'redirige a la portada ({final})'
    t = norm(titulo)
    if t and t[:60] in norm(body):
        return 'OK', ''
    return 'REVISAR', 'no se encontró el título original en la página'

def main():
    d = json.load(open('datos.json', encoding='utf-8'))
    try:
        a = json.load(open('archivo.json', encoding='utf-8'))
    except Exception:
        a = []
    by = {n['id']: n for n in d.get('noticias', []) + (a if isinstance(a, list) else a.get('noticias', []))}
    roto = False
    for r in (d.get('ia') or {}).get('recomendados', []):
        n = by.get(r['id'])
        if not n or not n.get('url'):
            print(f"ROTO      {r['id']}: el id no existe en datos.json ni en archivo.json"); roto = True; continue
        est, det = revisar(n['url'], r.get('to', ''))
        roto |= est == 'ROTO'
        print(f"{est:<9} {r['id']}: {n['medio']}{' · ' + det if det else ''}")
    sys.exit(1 if roto else 0)

if __name__ == '__main__':
    main()
