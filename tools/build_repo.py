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
import os
import shutil
import sys
import tarfile

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

ORIGIN = "Troubadour"
MAINTAINER = "computershik"

CHANNELS = [
    {
        "path": "",
        "label": "Troubadour",
        "suite": "stable",
        "description": "Troubadour — клиент YouTube для iOS 5.1 и новее",
    },
    {
        "path": "beta",
        "label": "Troubadour (испытания)",
        "suite": "beta",
        "description": "Troubadour — отладочные сборки; тут же лежат и выпуски",
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


def main():
    copied = mirror_stable_into_beta()

    if copied:
        print("Выпусков перенесено в канал испытаний: %d" % copied)

    for channel in CHANNELS:
        count = write_indexes(channel)

        where = channel["path"] or "."

        print("%-6s пакетов: %d" % (where, count))

    return 0


if __name__ == "__main__":
    sys.exit(main())
