"""Genera index.html a partir de los .md de esta carpeta y del guion del video.

Uso (desde cualquier carpeta):  python documentacion/defensa-EP2/generar-html.py
No necesita librerías externas: convierte solo lo que usan estos documentos
(títulos, párrafos, listas, tablas, bloques de código, citas, negrita, código
en línea y enlaces).
"""

import html
import re
from pathlib import Path

CARPETA = Path(__file__).resolve().parent
FUENTES = sorted(CARPETA.glob("0*.md")) + [CARPETA.parent / "guion-video-EP2.md"]


def en_linea(texto):
    """Negrita, código en línea y enlaces, escapando el resto."""
    # El código en línea se guarda aparte para que la negrita pueda envolverlo.
    codigos = []

    def guardar(m):
        codigos.append(f"<code>{html.escape(m.group(1))}</code>")
        return f"\x00{len(codigos) - 1}\x00"

    t = re.sub(r"`([^`]+)`", guardar, texto)
    t = html.escape(t, quote=False)
    t = re.sub(r"\*\*(.+?)\*\*", r"<strong>\1</strong>", t)
    t = re.sub(r"(?<![\w*])\*(?!\s)(.+?)(?<!\s)\*(?!\w)", r"<em>\1</em>", t)
    t = re.sub(r"\[([^\]]+)\]\(([^)]+)\)", r'<a href="\2">\1</a>', t)
    t = re.sub(r"(?<![\"'>=])(https?://[^\s<)]+)", r'<a href="\1">\1</a>', t)
    return re.sub(r"\x00(\d+)\x00", lambda m: codigos[int(m.group(1))], t)


def celdas(linea):
    linea = linea.strip().strip("|")
    # Separa por | que no esté dentro de `código`.
    partes, actual, en_codigo = [], "", False
    for c in linea:
        if c == "`":
            en_codigo = not en_codigo
        if c == "|" and not en_codigo:
            partes.append(actual)
            actual = ""
        else:
            actual += c
    partes.append(actual)
    return [p.strip() for p in partes]


def convertir(md, prefijo):
    lineas = md.splitlines()
    out, i, titulos = [], 0, []
    while i < len(lineas):
        l = lineas[i]
        if l.startswith("```"):
            i += 1
            bloque = []
            while i < len(lineas) and not lineas[i].startswith("```"):
                bloque.append(lineas[i])
                i += 1
            out.append(f"<pre><code>{html.escape(chr(10).join(bloque))}</code></pre>")
            i += 1
            continue
        m = re.match(r"^(#{1,4})\s+(.*)", l)
        if m:
            nivel = len(m.group(1))
            ident = f"{prefijo}-{len(titulos)}"
            titulos.append((nivel, m.group(2), ident))
            out.append(f'<h{nivel + 1} id="{ident}">{en_linea(m.group(2))}</h{nivel + 1}>')
            i += 1
            continue
        if re.match(r"^-{3,}\s*$", l):
            out.append("<hr>")
            i += 1
            continue
        if l.startswith("|") and i + 1 < len(lineas) and re.match(r"^\|[\s:|-]+\|?\s*$", lineas[i + 1]):
            cabecera = celdas(l)
            i += 2
            filas = []
            while i < len(lineas) and lineas[i].startswith("|"):
                filas.append(celdas(lineas[i]))
                i += 1
            t = "<div class='tabla'><table><thead><tr>"
            t += "".join(f"<th>{en_linea(c)}</th>" for c in cabecera) + "</tr></thead><tbody>"
            for f in filas:
                t += "<tr>" + "".join(f"<td>{en_linea(c)}</td>" for c in f) + "</tr>"
            out.append(t + "</tbody></table></div>")
            continue
        if l.startswith(">"):
            bloque = []
            while i < len(lineas) and lineas[i].startswith(">"):
                bloque.append(lineas[i].lstrip(">").strip())
                i += 1
            out.append(f"<blockquote>{en_linea(' '.join(bloque))}</blockquote>")
            continue
        m = re.match(r"^(\s*)([-*]|\d+\.)\s+(.*)", l)
        if m:
            ordenada = m.group(2)[0].isdigit()
            items = []
            while i < len(lineas):
                m2 = re.match(r"^(\s*)([-*]|\d+\.)\s+(.*)", lineas[i])
                if m2:
                    sub = len(m2.group(1)) >= 2
                    items.append([sub, m2.group(3)])
                elif lineas[i].startswith("  ") and lineas[i].strip() and items:
                    items[-1][1] += " " + lineas[i].strip()
                else:
                    break
                i += 1
            etiqueta = "ol" if ordenada else "ul"
            t, abierta = f"<{etiqueta}>", False
            for sub, texto in items:
                texto = re.sub(r"^\[ \]\s*", "☐ ", texto)
                if sub and not abierta:
                    t = t[: -len("</li>")] + "<ul>" if t.endswith("</li>") else t + "<ul>"
                    abierta = True
                elif not sub and abierta:
                    t += "</ul></li>"
                    abierta = False
                t += f"<li>{en_linea(texto)}</li>"
            if abierta:
                t += "</ul></li>"
            out.append(t + f"</{etiqueta}>")
            continue
        if not l.strip():
            i += 1
            continue
        parrafo = [l.strip()]
        i += 1
        while i < len(lineas) and lineas[i].strip() and not re.match(r"^(#|\||>|```|\s*([-*]|\d+\.)\s)", lineas[i]):
            parrafo.append(lineas[i].strip())
            i += 1
        out.append(f"<p>{en_linea(' '.join(parrafo))}</p>")
    return "\n".join(out), titulos


secciones, indice = [], []
for n, ruta in enumerate(FUENTES):
    cuerpo, titulos = convertir(ruta.read_text(encoding="utf-8"), f"s{n}")
    secciones.append(f'<section class="doc">{cuerpo}<p class="fuente">Fuente: {ruta.name}</p></section>')
    principal = next((t for t in titulos if t[0] == 1), None)
    if principal:
        subs = "".join(
            f'<li><a href="#{ident}">{en_linea(texto)}</a></li>' for nivel, texto, ident in titulos if nivel == 2
        )
        indice.append(f'<li><a class="doc-enlace" href="#{principal[2]}">{en_linea(principal[1])}</a><ul>{subs}</ul></li>')

PLANTILLA = """<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Defensa EP2 · Sonido Vivo</title>
<style>
:root {
  --laca: #1a1714; --tinta: #5c5247; --marfil-50: #fbf7ee; --marfil-100: #f5efe0;
  --marfil-200: #ede4d0; --marfil-300: #d9cfbc; --laton-500: #c9a227; --laton-800: #7a5a16;
  --cobre: #9a5424; --patina: #356b5e;
}
* { box-sizing: border-box; }
html { scroll-behavior: smooth; scroll-padding-top: 16px; }
body { margin: 0; background: var(--marfil-100); color: var(--laca);
  font: 16px/1.6 "Work Sans", system-ui, -apple-system, "Segoe UI", sans-serif; }
.marco { display: grid; grid-template-columns: 19rem minmax(0, 1fr); min-height: 100vh; }
nav { position: sticky; top: 0; height: 100vh; overflow-y: auto; padding: 24px 20px;
  background: var(--laca); color: var(--marfil-100); }
nav .marca { font: 400 26px/1.1 "DM Serif Display", Georgia, serif; color: var(--laton-500); margin: 0 0 4px; }
nav .sub { margin: 0 0 20px; font-size: 13px; color: #cfc6b4; }
nav ul { list-style: none; margin: 0; padding: 0; }
nav ul ul { margin: 4px 0 12px 10px; border-left: 1px solid #3b352e; }
nav a { display: block; padding: 3px 10px; color: #e9e1cf; text-decoration: none; font-size: 14px; border-radius: 6px; }
nav a:hover { background: #2c2722; color: var(--laton-500); }
nav .doc-enlace { font-weight: 600; color: var(--marfil-50); margin-top: 8px; }
nav ul ul a { font-size: 13px; color: #cfc6b4; }
main { padding: 40px clamp(16px, 4vw, 56px) 80px; max-width: 72rem; }
.doc { background: var(--marfil-50); border: 1px solid var(--marfil-300); border-radius: 18px;
  padding: 28px clamp(16px, 3vw, 40px); margin-bottom: 32px; }
h2 { font: 400 36px/1.15 "DM Serif Display", Georgia, serif; margin: 0 0 12px; }
h3 { font-size: 22px; margin: 32px 0 8px; padding-top: 8px; border-top: 1px solid var(--marfil-300); }
h4 { font-size: 17px; margin: 22px 0 6px; color: var(--laton-800); }
h5 { font-size: 15px; margin: 16px 0 4px; }
p, li { max-width: 75ch; }
a { color: var(--laton-800); }
code { font: 0.88em/1.4 ui-monospace, "Cascadia Code", Consolas, monospace; background: var(--marfil-200);
  padding: 1px 5px; border-radius: 5px; font-variant-ligatures: none; }
pre { background: var(--laca); color: var(--marfil-100); padding: 14px 16px; border-radius: 12px; overflow-x: auto; }
pre code { background: none; padding: 0; color: inherit; }
blockquote { margin: 16px 0; padding: 10px 16px; background: #f7efd6; border-radius: 10px;
  border: 1px solid #e6d39a; }
hr { border: 0; border-top: 1px solid var(--marfil-300); margin: 28px 0; }
.tabla { overflow-x: auto; margin: 12px 0 18px; border: 1px solid var(--marfil-300); border-radius: 12px; }
table { border-collapse: collapse; width: 100%; font-size: 14.5px; }
th { background: var(--marfil-200); text-align: left; font-size: 13px; color: var(--tinta); }
th, td { padding: 8px 12px; vertical-align: top; border-top: 1px solid var(--marfil-300); }
thead th { border-top: 0; }
tbody tr:hover { background: var(--marfil-100); }
strong { color: #000; }
.fuente { margin-top: 24px; font-size: 12px; color: var(--tinta); }
::selection { background: var(--laton-500); color: var(--laca); }
@media (max-width: 860px) {
  .marco { grid-template-columns: 1fr; }
  nav { position: static; height: auto; }
}
@media print {
  nav { display: none; } .marco { display: block; } .doc { break-inside: auto; border: 0; }
  body { background: #fff; }
}
</style>
</head>
<body>
<div class="marco">
<nav aria-label="Índice">
  <p class="marca">Sonido Vivo</p>
  <p class="sub">Guía técnica · Defensa EP2 · DSY1104 005D</p>
  <ul>__INDICE__</ul>
</nav>
<main>__SECCIONES__</main>
</div>
</body>
</html>
"""

import sys

if len(sys.argv) == 3:
    # Modo documento suelto, para imprimir a PDF:  generar-html.py entrada.md salida.html
    cuerpo, _ = convertir(Path(sys.argv[1]).read_text(encoding="utf-8"), "d")
    salida = PLANTILLA.replace('<div class="marco">', '<div class="marco solo">').replace(
        "__INDICE__", ""
    ).replace("__SECCIONES__", f'<section class="doc">{cuerpo}</section>')
    salida = salida.replace(
        "</style>",
        ".solo { display: block; } .solo nav { display: none; } .solo main { max-width: none; padding: 0; }"
        " .solo .doc { border: 0; padding: 0; background: #fff; } body { background: #fff; }"
        " @page { size: A4; margin: 16mm 14mm; } table { font-size: 12px; } th, td { padding: 5px 8px; }"
        " h2 { font-size: 28px; } h3 { break-after: avoid; } tr { break-inside: avoid; }"
        " td:first-child { white-space: nowrap; }</style>",
    )
    Path(sys.argv[2]).write_text(salida, encoding="utf-8")
    print(f"{Path(sys.argv[2]).name} generado")
else:
    salida = PLANTILLA.replace("__INDICE__", "".join(indice)).replace("__SECCIONES__", "\n".join(secciones))
    (CARPETA / "index.html").write_text(salida, encoding="utf-8")
    print(f"index.html generado con {len(FUENTES)} documentos")
