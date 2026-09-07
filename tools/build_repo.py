# -*- coding: utf-8 -*-
"""
Пересборка указателей репозитория для Cydia и Sileo.

Каналов два, и оба — «плоские» репозитории (`deb <адрес> ./`): такой
адрес Cydia принимает прямо в окошке «добавить источник», а раскладка
с `dists/` требует правки `sources.list` руками, чего от человека
ждать нельзя.

    /            стабильный канал: только выпуски
    /beta/       канал испытаний: отладочные сборки **и** выпуски

Второе важно: канал испытаний содержит и стабильные пакеты тоже.
Иначе человек, подписавшийся на испытания, застрял бы на отладочной
сборке навсегда — новый выпуск он бы попросту не увидел. А так работает
в обе стороны: APT ставит наибольшую версию из тех, что видит.

Порядок версий тут не наш, а Debian, и он ровно тот, что нужен:

    1.4  <  1.4-15+debug  <  1.5

То есть отладочная сборка новее одноимённого выпуска (после равного
номера у неё есть ревизия, а у выпуска нет), но старее следующего
выпуска. Ничего изобретать не пришлось.

Запуск из корня репозитория:

    python tools/build_repo.py

Скрипт сам разложит стабильные пакеты по обоим каналам, посчитает
подписи и перепишет `Packages`, `Packages.gz`, `Packages.bz2`
и `Release`.
"""

import bz2
import gzip
import hashlib
import io
import lzma
import os
import re
import shutil
import sys
import tarfile

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

ORIGIN = "Computershik73"
MAINTAINER = "computershik"

CHANNELS = [
    {
        "path": "",
        "label": "Computershik73",
        "suite": "stable",
        "description": "Проекты Computershik73 для iOS 5.1 и новее",
    },
    {
        "path": "beta",
        "label": "Computershik73 (испытания)",
        "suite": "beta",
        "description": "Проекты Computershik73 — отладочные сборки; тут же лежат и выпуски",
    },
]


def deb_control(path):
    """Поле за полем — управляющий файл из пакета.

    Пакет `.deb` — это архив `ar`: сначала `debian-binary`, затем
    `control.tar.*`, затем данные. Разбираем руками: `dpkg-deb`
    на этой машине нет, а нужен нам один-единственный файл.
    """
    with open(path, "rb") as handle:
        data = handle.read()

    if not data.startswith(b"!<arch>\n"):
        raise ValueError("%s — не пакет .deb" % path)

    at = 8

    while at < len(data):
        header = data[at:at + 60]

        if len(header) < 60:
            break

        name = header[0:16].decode("ascii").strip()
        size = int(header[48:58].decode("ascii").strip())
        body = data[at + 60:at + 60 + size]

        if name.startswith("control.tar"):
            archive = tarfile.open(fileobj=io.BytesIO(body))

            for member in archive.getmembers():
                if os.path.basename(member.name) == "control":
                    text = archive.extractfile(member).read()

                    return text.decode("utf-8").strip()

        # Члены архива выровнены по чётной границе.
        at += 60 + size + (size % 2)

    raise ValueError("%s — управляющий файл не найден" % path)


def digests(path):
    """Размер и три подписи — их ждёт APT в `Packages`."""
    md5 = hashlib.md5()
    sha1 = hashlib.sha1()
    sha256 = hashlib.sha256()
    size = 0

    with open(path, "rb") as handle:
        while True:
            chunk = handle.read(1 << 20)

            if not chunk:
                break

            size += len(chunk)

            md5.update(chunk)
            sha1.update(chunk)
            sha256.update(chunk)

    return size, md5.hexdigest(), sha1.hexdigest(), sha256.hexdigest()


def entry_for(deb_path, filename):
    """Одна запись `Packages` — управляющий файл плюс подписи."""
    control = deb_control(deb_path)
    size, md5, sha1, sha256 = digests(deb_path)

    lines = [line for line in control.split("\n") if line.strip()]

    lines.append("Filename: %s" % filename.replace(os.sep, "/"))
    lines.append("Size: %d" % size)
    lines.append("MD5sum: %s" % md5)
    lines.append("SHA1: %s" % sha1)
    lines.append("SHA256: %s" % sha256)

    return "\n".join(lines)


def debs_in(directory):
    if not os.path.isdir(directory):
        return []

    return sorted(name for name in os.listdir(directory) if name.endswith(".deb"))


def mirror_stable_into_beta():
    """Стабильные пакеты кладутся и в канал испытаний.

    Не ссылкой и не путём `../debs/`: старая APT в Cydia такие пути
    разбирает по-разному, а лишние два мегабайта на выпуск — цена,
    которую можно не считать. Зато каждый канал самодостаточен.
    """
    source = os.path.join(ROOT, "debs")
    target = os.path.join(ROOT, "beta", "debs")

    if not os.path.isdir(target):
        os.makedirs(target)

    copied = 0

    for name in debs_in(source):
        destination = os.path.join(target, name)

        if not os.path.exists(destination):
            shutil.copy2(os.path.join(source, name), destination)

            copied += 1

    return copied


def write_indexes(channel):
    """`Packages` во всех трёх видах и `Release` — для одного канала."""
    base = os.path.join(ROOT, channel["path"]) if channel["path"] else ROOT
    debs = os.path.join(base, "debs")

    entries = []

    for name in debs_in(debs):
        entries.append(entry_for(os.path.join(debs, name), "debs/" + name))

    body = ("\n\n".join(entries) + "\n") if entries else ""
    raw = body.encode("utf-8")

    with open(os.path.join(base, "Packages"), "wb") as handle:
        handle.write(raw)

    """
    Время в `gzip` обнуляем нарочно: иначе файл меняется при каждой
    пересборке, даже когда пакеты те же, и в git попадает мусор.
    """
    packed = io.BytesIO()

    with gzip.GzipFile(fileobj=packed, mode="wb", mtime=0) as gz:
        gz.write(raw)

    with open(os.path.join(base, "Packages.gz"), "wb") as handle:
        handle.write(packed.getvalue())

    with open(os.path.join(base, "Packages.bz2"), "wb") as handle:
        handle.write(bz2.compress(raw))

    release = [
        "Origin: %s" % ORIGIN,
        "Label: %s" % channel["label"],
        "Suite: %s" % channel["suite"],
        "Version: 1.0",
        "Codename: %s" % channel["suite"],
        "Architectures: iphoneos-arm",
        "Components: main",
        "Description: %s" % channel["description"],
    ]

    with open(os.path.join(base, "Release"), "wb") as handle:
        handle.write(("\n".join(release) + "\n").encode("utf-8"))

    return len(entries)


# --- Страницы -------------------------------------------------------------

# Ссылки автора — те же, что в самом приложении, в окне «О программе».
AUTHOR_LINKS = [
    ("link_4pda", "Страница на 4PDA",
     "https://4pda.to/forum/index.php?showuser=4458524"),
    ("link_tg", "Telegram-канал", "https://t.me/cmplog"),
    ("link_donate", "Поддержать финансово", "https://pay.cloudtips.ru/p/83821e32"),
]


def control_fields(text):
    """Управляющий файл — в словарь. Продолжения строк нам не нужны."""
    fields = {}

    for line in text.split("\n"):
        if not line.strip() or line.startswith((" ", "\t")):
            continue

        if ":" not in line:
            continue

        name, value = line.split(":", 1)

        fields[name.strip()] = value.strip()

    return fields


def version_key(version):
    """
    Порядок версий — как у Debian, насколько он нам нужен.

    Числа сравниваются числами, буквы — по алфавиту, тильда младше
    пустого места. Полного `dpkg --compare-versions` тут не надо: в
    источнике лежат версии одного вида, и нужно лишь понять, какая
    из них новее, чтобы показать её в сетке.
    """
    key = []

    for part in re.findall(r"\d+|[^\d]+", version):
        if part.isdigit():
            key.append((1, int(part), ""))
        elif part == "~":
            key.append((-1, 0, ""))
        else:
            key.append((0, 0, part))

    return key


def deb_members(path):
    """Члены архива `ar` — по имени."""
    with open(path, "rb") as handle:
        data = handle.read()

    members = {}
    at = 8

    while at + 60 <= len(data):
        header = data[at:at + 60]

        name = header[0:16].decode("ascii").strip().rstrip("/")
        size = int(header[48:58].decode("ascii").strip())

        members[name] = data[at + 60:at + 60 + size]

        at += 60 + size + (size % 2)

    return members


def deb_icon(path):
    """
    Значок приложения — прямо из пакета.

    Ищется самый крупный `Icon-<число>.png` внутри `.app`: он и так
    там лежит, потому что его показывает сам телефон. Ничего рисовать
    и класть рядом руками не нужно — сетка берёт то же, что и рабочий
    стол устройства.
    """
    members = deb_members(path)

    body = None

    for name in members:
        if not name.startswith("data.tar"):
            continue

        raw = members[name]

        if name.endswith(".lzma"):
            body = lzma.decompress(raw)
        elif name.endswith(".xz"):
            body = lzma.decompress(raw)
        elif name.endswith(".gz"):
            body = gzip.decompress(raw)
        elif name.endswith(".bz2"):
            body = bz2.decompress(raw)
        else:
            body = raw

        break

    if body is None:
        return None

    best = None
    best_size = -1

    archive = tarfile.open(fileobj=io.BytesIO(body))

    for member in archive.getmembers():
        found = re.search(r"/Icon-(\d+)\.png$", "/" + member.name)

        if not found:
            continue

        size = int(found.group(1))

        if size > best_size:
            best_size = size
            best = member

    if best is None:
        return None

    return archive.extractfile(best).read()


def human_size(size):
    """Размер человеку: килобайты до мегабайта, дальше мегабайты."""
    if size >= 1024 * 1024:
        return "%.1f MB" % (size / (1024.0 * 1024.0))

    return "%d KB" % (size / 1024.0)


def escape(text):
    return (text or "").replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")


def page(title_key, title, body, depth):
    """
    Общая обёртка страницы.

    `depth` — сколько шагов до корня источника: страницы приложений
    лежат глубже, а стиль и словарь у всех одни.
    """
    up = "../" * depth

    return (
        '<!DOCTYPE html>\n'
        '<html lang="ru">\n'
        '<head>\n'
        '<meta charset="utf-8">\n'
        '<meta name="viewport" content="width=device-width, initial-scale=1">\n'
        '<title>%s</title>\n'
        '<!--\n'
        '    Страница собрана `tools/build_repo.py` по содержимому источника.\n'
        '    Править её руками незачем: следующая пересборка перепишет.\n'
        '-->\n'
        '<link rel="stylesheet" href="%sstyle.css">\n'
        '</head>\n'
        '<body%s>\n'
        '<div class="wrap">\n\n'
        '%s\n'
        '<script src="%si18n.js"></script>\n'
        '</body>\n'
        '</html>\n'
    ) % (escape(title), up,
         (' data-i18n-title="%s"' % title_key) if title_key else "",
         body, up)


def language_row():
    names = [
        ("ru", "Русский"), ("en", "English"), ("es", "Español"),
        ("de", "Deutsch"), ("pt-br", "Português (BR)"), ("uk", "Українська"),
        ("be", "Беларуская"), ("kk", "Қазақша"), ("zh", "中文"), ("ja", "日本語"),
    ]

    rows = "\n".join(
        '    <a href="?lang=%s" data-lang="%s" class="lang">%s</a>' % (tag, tag, name)
        for tag, name in names
    )

    return '<div class="langs">\n%s\n</div>\n' % rows


def author_card():
    links = "\n".join(
        '        <li><a href="%s" data-i18n="%s">%s</a></li>' % (url, key, text)
        for key, text, url in AUTHOR_LINKS
    )

    return (
        '<div class="card">\n'
        '    <h2 data-i18n="author_h">Автор</h2>\n'
        '    <p class="note" data-i18n="author_note">Новости о сборках, вопросы '
        'и замечания — там же, где и всегда.</p>\n\n'
        '    <ul class="links">\n%s\n    </ul>\n'
        '</div>\n'
    ) % links


def collect(channel_base):
    """
    Что лежит в канале — по пакетам, а не по файлам.

    У одного пакета версий бывает несколько (в канале испытаний их
    и бывает), поэтому записи складываются в кучки по имени пакета
    и сортируются от новой к старой.
    """
    debs = os.path.join(channel_base, "debs")

    found = {}

    for name in debs_in(debs):
        path = os.path.join(debs, name)

        fields = control_fields(deb_control(path))

        package = fields.get("Package")

        if not package:
            continue

        size = os.path.getsize(path)

        entry = dict(fields)

        entry["_file"] = "debs/" + name
        entry["_size"] = size

        found.setdefault(package, []).append(entry)

    for package in found:
        found[package].sort(key=lambda item: version_key(item.get("Version", "")),
                            reverse=True)

    return found


def write_icons(channel_base, packages):
    """Значок каждого пакета — рядом со страницами, в `icons/`."""
    folder = os.path.join(channel_base, "icons")

    if not os.path.isdir(folder):
        os.makedirs(folder)

    kept = {}

    for package in packages:
        newest = packages[package][0]

        path = os.path.join(channel_base, newest["_file"].replace("/", os.sep))

        try:
            icon = deb_icon(path)
        except Exception:
            icon = None

        if not icon:
            continue

        target = os.path.join(folder, package + ".png")

        old = None

        if os.path.exists(target):
            with open(target, "rb") as handle:
                old = handle.read()

        if old != icon:
            with open(target, "wb") as handle:
                handle.write(icon)

        kept[package] = "icons/" + package + ".png"

    return kept


def grid_html(packages, icons):
    """Сетка значков: значок, название, номер выпуска."""
    if not packages:
        return ('<p class="note" data-i18n="apps_empty">Пока пусто: '
                'в этом канале ещё нет пакетов.</p>')

    cells = []

    for package in sorted(packages, key=lambda name: packages[name][0].get("Name", name)):
        newest = packages[package][0]

        title = newest.get("Name") or package
        icon = icons.get(package, "CydiaIcon.png")

        cells.append(
            '    <a class="app" href="apps/%s/">\n'
            '        <img src="%s" alt="">\n'
            '        <span class="name">%s</span>\n'
            '        <span class="ver">%s</span>\n'
            '    </a>' % (package, icon, escape(title), escape(newest.get("Version", "")))
        )

    return '<div class="grid">\n%s\n</div>' % "\n".join(cells)


def app_page_html(package, versions, icon, depth):
    """Страница одного приложения — как карточка пакета в Cydia."""
    newest = versions[0]

    title = newest.get("Name") or package

    facts = [
        ("app_version", "Версия", escape(newest.get("Version", ""))),
        ("app_size", "Размер", human_size(newest["_size"])),
        ("app_author", "Разработчик", escape(newest.get("Author")
                                             or newest.get("Maintainer", ""))),
        ("app_section", "Раздел", escape(newest.get("Section", ""))),
        ("app_depends", "Зависимости", escape(newest.get("Depends", "—"))),
        ("app_id", "Имя пакета", escape(package)),
    ]

    rows = "\n".join(
        '        <tr><th data-i18n="%s">%s</th><td>%s</td></tr>' % (key, name, value)
        for key, name, value in facts if value
    )

    olds = "\n".join(
        '        <li><a href="../../%s">%s</a> — %s</li>'
        % (item["_file"], escape(item.get("Version", "")), human_size(item["_size"]))
        for item in versions
    )

    body = (
        '<div class="app-head">\n'
        '    <img src="../../%s" alt="">\n'
        '    <div class="who">\n'
        '        <h1>%s</h1>\n'
        '        <div class="sub">%s</div>\n'
        '    </div>\n'
        '</div>\n\n'
        '<p>\n'
        '    <a class="btn" href="cydia://package/%s" data-i18n="app_open_cydia">'
        'Открыть в Cydia</a>\n'
        '    <a class="btn plain" href="sileo://package/%s" data-i18n="app_open_sileo">'
        'Открыть в Sileo</a>\n'
        '</p>\n\n'
        '<div class="card">\n'
        '    <h2 data-i18n="app_facts_h">Сведения</h2>\n'
        '    <table class="facts">\n%s\n    </table>\n'
        '</div>\n\n'
        '<div class="card">\n'
        '    <h2 data-i18n="app_versions_h">Версии в этом канале</h2>\n'
        '    <p class="note" data-i18n="app_versions_note">Ставить их вручную '
        'обычно не нужно — за этим и нужен источник.</p>\n'
        '    <ul class="olds">\n%s\n    </ul>\n'
        '</div>\n\n'
        '%s\n'
        '<p><a href="../../" data-i18n="app_back">Назад к источнику</a></p>\n\n'
        '%s\n'
        '</div>\n'
    ) % (icon, escape(title), escape(newest.get("Description", "")),
         package, package, rows, olds, author_card(), language_row())

    # Заголовок окна не переводится: в нём имя приложения, а его
    # переводить нечем и незачем.
    return page(None, "%s — %s" % (title, ORIGIN), body, depth)


def write_pages(channel, packages, icons):
    """Сетку — в страницу канала, а каждому пакету — свою страницу."""
    base = os.path.join(ROOT, channel["path"]) if channel["path"] else ROOT

    index = os.path.join(base, "index.html")

    if os.path.exists(index):
        with io.open(index, encoding="utf-8") as handle:
            text = handle.read()

        start = "<!-- apps:start -->"
        end = "<!-- apps:end -->"

        if start in text and end in text:
            head = text.split(start)[0]
            tail = text.split(end)[1]

            text = head + start + "\n" + grid_html(packages, icons) + "\n" + end + tail

            with io.open(index, "w", encoding="utf-8", newline="\n") as handle:
                handle.write(text)

    """
    Стиль и словарь лежат в корне источника, а не в канале, поэтому
    до них у канала испытаний на шаг дальше: `/beta/apps/<пакет>/`
    — это три ступени вверх, а не две. Считаем, а не пишем числом:
    ошибка здесь тихая — страница просто приезжает без оформления.
    """
    depth = 2 + len([part for part in channel["path"].split("/") if part])

    folder = os.path.join(base, "apps")

    # Ушедшие пакеты не оставляют за собой страниц.
    if os.path.isdir(folder):
        for name in os.listdir(folder):
            if name not in packages:
                shutil.rmtree(os.path.join(folder, name), ignore_errors=True)

    for package in packages:
        target = os.path.join(folder, package)

        if not os.path.isdir(target):
            os.makedirs(target)

        html = app_page_html(package, packages[package],
                             icons.get(package, "CydiaIcon.png"), depth)

        with io.open(os.path.join(target, "index.html"), "w",
                     encoding="utf-8", newline="\n") as handle:
            handle.write(html)

    return len(packages)


def main():
    copied = mirror_stable_into_beta()

    if copied:
        print("Выпусков перенесено в канал испытаний: %d" % copied)

    for channel in CHANNELS:
        count = write_indexes(channel)

        base = os.path.join(ROOT, channel["path"]) if channel["path"] else ROOT

        packages = collect(base)
        icons = write_icons(base, packages)

        shown = write_pages(channel, packages, icons)

        where = channel["path"] or "."

        print("%-6s пакетов: %d, приложений на странице: %d" % (where, count, shown))

    return 0


if __name__ == "__main__":
    sys.exit(main())
