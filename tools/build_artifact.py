#!/usr/bin/env python3
"""Genera build/presentacion.html: el mismo deck en un único archivo
autocontenido (CSS, JS y fuentes embebidos, sin html/head/body) para
publicarlo como Artifact. index.html sigue siendo la fuente de verdad.

    python3 tools/build_artifact.py
"""

import base64
import pathlib
import re

RAIZ = pathlib.Path(__file__).resolve().parent.parent
SALIDA = RAIZ / "build" / "presentacion.html"


def incrustar_fuentes(css: str) -> str:
    def reemplazo(m):
        ruta = RAIZ / m.group(1)
        datos = base64.b64encode(ruta.read_bytes()).decode()
        return 'url("data:font/woff2;base64,%s")' % datos

    return re.sub(r'url\("([^"]+\.woff2)"\)', reemplazo, css)


def main() -> None:
    html = (RAIZ / "index.html").read_text(encoding="utf-8")
    css = incrustar_fuentes((RAIZ / "styles.css").read_text(encoding="utf-8"))
    datos = (RAIZ / "data" / "series.js").read_text(encoding="utf-8")
    app = (RAIZ / "app.js").read_text(encoding="utf-8")

    cuerpo = html.split("<body>", 1)[1].split("</body>", 1)[0]
    cuerpo = re.sub(r'\s*<script src="[^"]+"></script>', "", cuerpo)

    titulo = re.search(r"<title>(.*?)</title>", html, re.S).group(1)

    SALIDA.parent.mkdir(exist_ok=True)
    SALIDA.write_text(
        "<title>%s</title>\n<style>\n%s\n</style>\n%s\n<script>\n%s\n%s\n</script>\n"
        % (titulo, css, cuerpo.strip(), datos, app),
        encoding="utf-8",
    )
    print("%s (%.0f KB)" % (SALIDA, SALIDA.stat().st_size / 1024))


if __name__ == "__main__":
    main()
