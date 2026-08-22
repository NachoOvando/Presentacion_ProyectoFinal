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

MIME = {".woff2": "font/woff2", ".jpg": "image/jpeg", ".jpeg": "image/jpeg",
        ".png": "image/png", ".svg": "image/svg+xml"}


def data_uri(ruta_relativa: str) -> str:
    ruta = RAIZ / ruta_relativa
    ext = ruta.suffix.lower()
    datos = base64.b64encode(ruta.read_bytes()).decode()
    return "data:%s;base64,%s" % (MIME[ext], datos)


def incrustar_fuentes(css: str) -> str:
    def reemplazo(m):
        return 'url("%s")' % data_uri(m.group(1))

    return re.sub(r'url\("([^"]+\.woff2)"\)', reemplazo, css)


def incrustar_imagenes(cuerpo: str) -> str:
    def reemplazo(m):
        ruta = RAIZ / m.group(1)
        if not ruta.exists():
            return m.group(0)  # ejemplo dentro de un comentario, no un asset real
        return 'src="%s"' % data_uri(m.group(1))

    return re.sub(r'src="(assets/[^"]+\.(?:jpg|jpeg|png))"', reemplazo, cuerpo)


def main() -> None:
    html = (RAIZ / "index.html").read_text(encoding="utf-8")
    css = incrustar_fuentes((RAIZ / "styles.css").read_text(encoding="utf-8"))
    datos = (RAIZ / "data" / "series.js").read_text(encoding="utf-8")
    app = (RAIZ / "app.js").read_text(encoding="utf-8")

    cuerpo = html.split("<body>", 1)[1].split("</body>", 1)[0]
    cuerpo = re.sub(r'\s*<script src="[^"]+"></script>', "", cuerpo)
    cuerpo = incrustar_imagenes(cuerpo)

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
