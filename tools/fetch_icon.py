# -*- coding: utf-8 -*-
"""
Значок источника — аватарка владельца с GitHub.

Cydia и Sileo берут значок одним и тем же путём: файл `CydiaIcon.png`
в корне источника. Ссылку туда подставить нельзя — это именно файл,
и лежать он должен рядом с указателями, поэтому аватарка сюда
переписывается, а не подключается.

Обновляется это само, раз в сутки, из `.github/workflows/icon.yml`.
Сменили аватарку на GitHub — назавтра её увидят и в Cydia.

Запуск из корня репозитория:

    python tools/fetch_icon.py [владелец]

Без имени берётся владелец из адреса `origin`.
"""

import io
import os
import re
import subprocess
import sys
import urllib.request

from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# Больше незачем: Cydia рисует значок в шестьдесят точек, Sileo — вдвое
# крупнее на экране с двойной плотностью.
SIZE = 256

# Значок кладётся в оба канала: у каждого он свой файл, а источник для
# человека — один и тот же.
TARGETS = ["CydiaIcon.png", os.path.join("beta", "CydiaIcon.png")]


def owner_from_git():
    """Владелец из адреса `origin` — чтобы имя не задавать дважды."""
    try:
        url = subprocess.check_output(
            ["git", "-C", ROOT, "remote", "get-url", "origin"],
            stderr=subprocess.DEVNULL,
        ).decode("utf-8", "replace").strip()
    except Exception:
        return None

    found = re.search(r"github\.com[:/]([^/]+)/", url)

    return found.group(1) if found else None


def main():
    owner = sys.argv[1] if len(sys.argv) > 1 else owner_from_git()

    if not owner:
        print("не понял, чья аватарка нужна: укажите владельца доводом")

        return 1

    # `github.com/<имя>.png` всегда ведёт на нынешнюю аватарку, какой бы
    # она ни стала: постоянного адреса у самой картинки нет.
    source = "https://github.com/%s.png?size=%d" % (owner, SIZE)

    request = urllib.request.Request(source, headers={"User-Agent": "troubadour-repo"})

    with urllib.request.urlopen(request, timeout=60) as answer:
        raw = answer.read()

    # Приходит она чаще всего JPEG, а нужен PNG — имя файла тут не совет,
    # а условие: Cydia читает именно PNG.
    picture = Image.open(io.BytesIO(raw)).convert("RGBA")

    if picture.size != (SIZE, SIZE):
        picture = picture.resize((SIZE, SIZE), Image.LANCZOS)

    kept = io.BytesIO()

    picture.save(kept, format="PNG", optimize=True)

    data = kept.getvalue()

    changed = []

    for name in TARGETS:
        path = os.path.join(ROOT, name)

        old = None

        if os.path.exists(path):
            with open(path, "rb") as file:
                old = file.read()

        if old == data:
            continue

        with open(path, "wb") as file:
            file.write(data)

        changed.append(name)

    print("аватарка %s: %s" % (
        owner,
        ("обновлена — " + ", ".join(changed)) if changed else "не менялась",
    ))

    return 0


if __name__ == "__main__":
    sys.exit(main())
