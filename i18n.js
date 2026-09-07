/*
 * Язык страницы — по языку устройства.
 *
 * Разметка приезжает по-русски и остаётся читаемой сама по себе: если
 * JavaScript выключен или не сработал, человек видит русский текст, а не
 * пустые места. Всё остальное — подмена надписей по ключу `data-i18n`.
 *
 * Писано так, чтобы поняла Safari из iOS 5: ни `const`, ни стрелок,
 * ни `classList`, ни `forEach` по списку узлов, ни `JSON`. Обход идёт
 * через `getElementsByTagName('*')` — он есть везде, где вообще есть DOM.
 */
(function () {
    var STRINGS = {

'ru': {
    'title_index': 'Источник Computershik73 для Cydia и Sileo',
    'intro1': 'Приложения от Computershik для iOS.',
    'intro2': 'Каналов два. Стабильный — то, чем можно пользоваться. Канал испытаний — сборки по мере правок: они пишут подробный журнал и меняются часто.',
    'stable_h': 'Стабильный',
    'stable_note': 'Только выпуски. Обновления приходят редко.',
    'beta_h': 'Испытания',
    'beta_note': 'Отладочные сборки, а вместе с ними и выпуски. Подписавшись сюда, выпуск вы тоже увидите — как только его номер станет старше.',
    'btn_cydia': 'Добавить в Cydia',
    'btn_sileo': 'Добавить в Sileo',
    'switch_h': 'Как перейти с одного канала на другой',
    'switch_p1': 'Достаточно добавить нужный источник и убрать ненужный. Пакет один и тот же, поэтому переход выглядит обычным обновлением — ни удалять, ни переустанавливать ничего не надо.',
    'switch_p2': 'Если добавлены оба, ставиться будет то, что новее, — как правило, отладочная сборка.',
    'author_h': 'Автор',
    'author_note': 'Новости о сборках, вопросы и замечания — там же, где и всегда.',
    'link_4pda': 'Страница на 4PDA',
    'link_tg': 'Telegram-канал',
    'link_donate': 'Поддержать финансово',
    'footer': 'Сборки для <code>iphoneos-arm</code>, нижняя граница — iOS 5.1.',
    'title_beta': 'Испытания — источник Computershik73',
    'h1_beta': 'Computershik73 — испытания',
    'sub_beta': 'Отладочные сборки моих проектов',
    'intro_beta': 'Это канал испытаний общего источника моих проектов для iOS. Сборки здесь выходят по мере правок, пишут подробный журнал и меняются часто. Выпуски лежат тут же, так что второй источник добавлять незачем.',
    'addr_h': 'Адрес',
    'beta_back': 'Нужны только выпуски — возьмите <a href="../">стабильный канал</a>.',
    'beta_page': 'Открыть страницу канала испытаний',
    'apps_h': 'Приложения',
    'apps_empty': 'Пока пусто: в этом канале ещё нет пакетов.',
    'app_open_cydia': 'Открыть в Cydia',
    'app_open_sileo': 'Открыть в Sileo',
    'app_facts_h': 'Сведения',
    'app_version': 'Версия',
    'app_size': 'Размер',
    'app_author': 'Разработчик',
    'app_section': 'Раздел',
    'app_depends': 'Зависимости',
    'app_id': 'Имя пакета',
    'app_versions_h': 'Версии в этом канале',
    'app_versions_note': 'Ставить их вручную обычно не нужно — за этим и нужен источник.',
    'app_back': 'Назад к источнику'
},

'en': {
    'title_index': 'Computershik73 source for Cydia and Sileo',
    'intro1': 'Apps by Computershik for iOS.',
    'intro2': 'There are two channels. Stable is the one to install and use. Testing carries builds made as fixes land: they write a detailed log and change often.',
    'stable_h': 'Stable',
    'stable_note': 'Releases only. Updates come rarely.',
    'beta_h': 'Testing',
    'beta_note': 'Debug builds, and the releases along with them. Subscribe here and you will get a release as well, as soon as its number is higher.',
    'btn_cydia': 'Add to Cydia',
    'btn_sileo': 'Add to Sileo',
    'switch_h': 'Switching between channels',
    'switch_p1': 'Just add the source you want and remove the other one. The package is the same, so the switch looks like an ordinary update — nothing to uninstall or reinstall.',
    'switch_p2': 'If both are added, whichever is newer gets installed — usually the debug build.',
    'author_h': 'Author',
    'author_note': 'News about the builds, questions and remarks — in the usual places.',
    'link_4pda': 'Profile on 4PDA',
    'link_tg': 'Telegram channel',
    'link_donate': 'Support financially',
    'footer': 'Builds for <code>iphoneos-arm</code>; the floor is iOS 5.1.',
    'title_beta': 'Testing — Computershik73 source',
    'h1_beta': 'Computershik73 — testing',
    'sub_beta': 'Debug builds of my projects',
    'intro_beta': 'This is the testing channel of my shared source for iOS projects. Builds here come out as fixes land, write a detailed log and change often. Releases live here as well, so a second source is not needed.',
    'addr_h': 'Address',
    'beta_back': 'Want releases only? Take the <a href="../">stable channel</a>.',
    'beta_page': 'Open the testing channel page',
    'apps_h': 'Apps',
    'apps_empty': 'Empty for now: this channel has no packages yet.',
    'app_open_cydia': 'Open in Cydia',
    'app_open_sileo': 'Open in Sileo',
    'app_facts_h': 'Details',
    'app_version': 'Version',
    'app_size': 'Size',
    'app_author': 'Developer',
    'app_section': 'Section',
    'app_depends': 'Requires',
    'app_id': 'Package name',
    'app_versions_h': 'Versions in this channel',
    'app_versions_note': 'You normally do not need to install these by hand — that is what the source is for.',
    'app_back': 'Back to the source'
},

'es': {
    'title_index': 'Repositorio de Computershik73 para Cydia y Sileo',
    'intro1': 'Aplicaciones de Computershik para iOS.',
    'intro2': 'Hay dos canales. El estable es el que se instala y se usa. El de pruebas trae compilaciones según se hacen los cambios: guardan un registro detallado y cambian a menudo.',
    'stable_h': 'Estable',
    'stable_note': 'Solo versiones finales. Se actualiza pocas veces.',
    'beta_h': 'Pruebas',
    'beta_note': 'Compilaciones de depuración y también las versiones finales. Si te suscribes aquí, verás igualmente la versión final en cuanto su número sea mayor.',
    'btn_cydia': 'Añadir a Cydia',
    'btn_sileo': 'Añadir a Sileo',
    'switch_h': 'Cómo cambiar de un canal a otro',
    'switch_p1': 'Basta con añadir el repositorio que quieras y quitar el otro. El paquete es el mismo, así que el cambio es una actualización normal: no hay que desinstalar ni reinstalar nada.',
    'switch_p2': 'Si están añadidos los dos, se instalará el más nuevo, que suele ser la compilación de depuración.',
    'author_h': 'Autor',
    'author_note': 'Novedades sobre las compilaciones, preguntas y comentarios: en los sitios de siempre.',
    'link_4pda': 'Perfil en 4PDA',
    'link_tg': 'Canal de Telegram',
    'link_donate': 'Apoyar económicamente',
    'footer': 'Compilaciones para <code>iphoneos-arm</code>; el mínimo es iOS 5.1.',
    'title_beta': 'Pruebas — repositorio de Computershik73',
    'h1_beta': 'Computershik73 — pruebas',
    'sub_beta': 'Compilaciones de depuración de mis proyectos',
    'intro_beta': 'Este es el canal de pruebas de mi repositorio común de proyectos para iOS. Las compilaciones salen según se hacen los cambios, guardan un registro detallado y cambian a menudo. Las versiones finales están aquí también, así que no hace falta añadir otro repositorio.',
    'addr_h': 'Dirección',
    'beta_back': 'Si solo quieres versiones finales, usa el <a href="../">canal estable</a>.',
    'beta_page': 'Abrir la página del canal de pruebas',
    'apps_h': 'Aplicaciones',
    'apps_empty': 'Por ahora vacío: este canal aún no tiene paquetes.',
    'app_open_cydia': 'Abrir en Cydia',
    'app_open_sileo': 'Abrir en Sileo',
    'app_facts_h': 'Detalles',
    'app_version': 'Versión',
    'app_size': 'Tamaño',
    'app_author': 'Desarrollador',
    'app_section': 'Sección',
    'app_depends': 'Requisitos',
    'app_id': 'Nombre del paquete',
    'app_versions_h': 'Versiones en este canal',
    'app_versions_note': 'Normalmente no hace falta instalarlas a mano: para eso está el repositorio.',
    'app_back': 'Volver al repositorio'
},

'de': {
    'title_index': 'Quelle von Computershik73 für Cydia und Sileo',
    'intro1': 'Programme von Computershik für iOS.',
    'intro2': 'Es gibt zwei Kanäle. Der stabile ist zum Benutzen. Der Testkanal bringt Builds, sobald etwas geändert wurde: Sie schreiben ein ausführliches Protokoll und wechseln häufig.',
    'stable_h': 'Stabil',
    'stable_note': 'Nur Veröffentlichungen. Updates kommen selten.',
    'beta_h': 'Tests',
    'beta_note': 'Debug-Builds und die Veröffentlichungen gleich mit. Wer hier abonniert, bekommt auch eine Veröffentlichung – sobald ihre Nummer höher ist.',
    'btn_cydia': 'Zu Cydia hinzufügen',
    'btn_sileo': 'Zu Sileo hinzufügen',
    'switch_h': 'Wie man den Kanal wechselt',
    'switch_p1': 'Einfach die gewünschte Quelle hinzufügen und die andere entfernen. Das Paket ist dasselbe, der Wechsel sieht also wie ein normales Update aus – nichts muss deinstalliert oder neu installiert werden.',
    'switch_p2': 'Sind beide eingetragen, wird das Neuere installiert – meist der Debug-Build.',
    'author_h': 'Autor',
    'author_note': 'Neues zu den Builds, Fragen und Anmerkungen – wie immer an denselben Stellen.',
    'link_4pda': 'Profil bei 4PDA',
    'link_tg': 'Telegram-Kanal',
    'link_donate': 'Finanziell unterstützen',
    'footer': 'Builds für <code>iphoneos-arm</code>, Untergrenze ist iOS 5.1.',
    'title_beta': 'Tests – Quelle von Computershik73',
    'h1_beta': 'Computershik73 – Tests',
    'sub_beta': 'Debug-Builds meiner Projekte',
    'intro_beta': 'Das ist der Testkanal meiner gemeinsamen Quelle für iOS-Projekte. Die Builds erscheinen, sobald etwas geändert wurde, schreiben ein ausführliches Protokoll und wechseln häufig. Veröffentlichungen liegen ebenfalls hier, eine zweite Quelle braucht es also nicht.',
    'addr_h': 'Adresse',
    'beta_back': 'Nur Veröffentlichungen gewünscht? Dann den <a href="../">stabilen Kanal</a> nehmen.',
    'beta_page': 'Seite des Testkanals öffnen',
    'apps_h': 'Programme',
    'apps_empty': 'Noch leer: In diesem Kanal liegen bisher keine Pakete.',
    'app_open_cydia': 'In Cydia öffnen',
    'app_open_sileo': 'In Sileo öffnen',
    'app_facts_h': 'Angaben',
    'app_version': 'Version',
    'app_size': 'Größe',
    'app_author': 'Entwickler',
    'app_section': 'Bereich',
    'app_depends': 'Voraussetzungen',
    'app_id': 'Paketname',
    'app_versions_h': 'Versionen in diesem Kanal',
    'app_versions_note': 'Von Hand installieren muss man sie normalerweise nicht – dafür gibt es die Quelle.',
    'app_back': 'Zurück zur Quelle'
},

'pt-br': {
    'title_index': 'Repositório do Computershik73 para Cydia e Sileo',
    'intro1': 'Aplicativos de Computershik para iOS.',
    'intro2': 'São dois canais. O estável é o que se instala e usa. O de testes traz versões conforme as correções saem: elas gravam um registro detalhado e mudam com frequência.',
    'stable_h': 'Estável',
    'stable_note': 'Apenas versões finais. As atualizações são raras.',
    'beta_h': 'Testes',
    'beta_note': 'Versões de depuração e, junto com elas, as finais. Assinando aqui, você também recebe a versão final assim que o número dela for maior.',
    'btn_cydia': 'Adicionar ao Cydia',
    'btn_sileo': 'Adicionar ao Sileo',
    'switch_h': 'Como trocar de canal',
    'switch_p1': 'Basta adicionar o repositório desejado e remover o outro. O pacote é o mesmo, então a troca é uma atualização comum: não é preciso desinstalar nem reinstalar nada.',
    'switch_p2': 'Se os dois estiverem adicionados, será instalado o mais novo — normalmente a versão de depuração.',
    'author_h': 'Autor',
    'author_note': 'Novidades sobre as versões, dúvidas e comentários: nos lugares de sempre.',
    'link_4pda': 'Perfil no 4PDA',
    'link_tg': 'Canal no Telegram',
    'link_donate': 'Apoiar financeiramente',
    'footer': 'Versões para <code>iphoneos-arm</code>; o mínimo é iOS 5.1.',
    'title_beta': 'Testes — repositório do Computershik73',
    'h1_beta': 'Computershik73 — testes',
    'sub_beta': 'Versões de depuração dos meus projetos',
    'intro_beta': 'Este é o canal de testes do meu repositório comum de projetos para iOS. As versões saem conforme as correções, gravam um registro detalhado e mudam com frequência. As versões finais também ficam aqui, então não é preciso outro repositório.',
    'addr_h': 'Endereço',
    'beta_back': 'Se quiser apenas versões finais, use o <a href="../">canal estável</a>.',
    'beta_page': 'Abrir a página do canal de testes',
    'apps_h': 'Aplicativos',
    'apps_empty': 'Por enquanto vazio: este canal ainda não tem pacotes.',
    'app_open_cydia': 'Abrir no Cydia',
    'app_open_sileo': 'Abrir no Sileo',
    'app_facts_h': 'Detalhes',
    'app_version': 'Versão',
    'app_size': 'Tamanho',
    'app_author': 'Desenvolvedor',
    'app_section': 'Seção',
    'app_depends': 'Requisitos',
    'app_id': 'Nome do pacote',
    'app_versions_h': 'Versões neste canal',
    'app_versions_note': 'Normalmente não é preciso instalar à mão: é para isso que serve o repositório.',
    'app_back': 'Voltar ao repositório'
},

'uk': {
    'title_index': 'Джерело Computershik73 для Cydia і Sileo',
    'intro1': 'Програми від Computershik для iOS.',
    'intro2': 'Каналів два. Стабільний — те, чим можна користуватися. Канал випробувань — збірки в міру виправлень: вони пишуть докладний журнал і змінюються часто.',
    'stable_h': 'Стабільний',
    'stable_note': 'Лише випуски. Оновлення приходять рідко.',
    'beta_h': 'Випробування',
    'beta_note': 'Зневаджувальні збірки, а разом із ними й випуски. Підписавшись сюди, випуск ви теж отримаєте — щойно його номер стане більшим.',
    'btn_cydia': 'Додати в Cydia',
    'btn_sileo': 'Додати в Sileo',
    'switch_h': 'Як перейти з одного каналу на інший',
    'switch_p1': 'Досить додати потрібне джерело й прибрати непотрібне. Пакунок той самий, тож перехід виглядає звичайним оновленням — ні видаляти, ні перевстановлювати нічого не треба.',
    'switch_p2': 'Якщо додано обидва, встановлюватиметься новіше — зазвичай зневаджувальна збірка.',
    'author_h': 'Автор',
    'author_note': 'Новини про збірки, запитання та зауваження — там само, де й завжди.',
    'link_4pda': 'Сторінка на 4PDA',
    'link_tg': 'Telegram-канал',
    'link_donate': 'Підтримати фінансово',
    'footer': 'Збірки для <code>iphoneos-arm</code>, нижня межа — iOS 5.1.',
    'title_beta': 'Випробування — джерело Computershik73',
    'h1_beta': 'Computershik73 — випробування',
    'sub_beta': 'Зневаджувальні збірки моїх проєктів',
    'intro_beta': 'Це канал випробувань спільного джерела моїх проєктів для iOS. Збірки тут виходять у міру виправлень, пишуть докладний журнал і змінюються часто. Випуски лежать тут само, тож друге джерело додавати ні до чого.',
    'addr_h': 'Адреса',
    'beta_back': 'Потрібні лише випуски — візьміть <a href="../">стабільний канал</a>.',
    'beta_page': 'Відкрити сторінку каналу випробувань',
    'apps_h': 'Програми',
    'apps_empty': 'Поки порожньо: у цьому каналі ще немає пакунків.',
    'app_open_cydia': 'Відкрити в Cydia',
    'app_open_sileo': 'Відкрити в Sileo',
    'app_facts_h': 'Відомості',
    'app_version': 'Версія',
    'app_size': 'Розмір',
    'app_author': 'Розробник',
    'app_section': 'Розділ',
    'app_depends': 'Залежності',
    'app_id': 'Ім’я пакунка',
    'app_versions_h': 'Версії в цьому каналі',
    'app_versions_note': 'Встановлювати їх вручну зазвичай не потрібно — для цього й є джерело.',
    'app_back': 'Назад до джерела'
},

'be': {
    'title_index': 'Крыніца Computershik73 для Cydia і Sileo',
    'intro1': 'Праграмы ад Computershik для iOS.',
    'intro2': 'Каналаў два. Стабільны — тое, чым можна карыстацца. Канал выпрабаванняў — зборкі па меры правак: яны пішуць падрабязны журнал і мяняюцца часта.',
    'stable_h': 'Стабільны',
    'stable_note': 'Толькі выпускі. Абнаўленні прыходзяць рэдка.',
    'beta_h': 'Выпрабаванні',
    'beta_note': 'Адладачныя зборкі, а разам з імі і выпускі. Падпісаўшыся сюды, выпуск вы таксама атрымаеце — як толькі яго нумар стане большым.',
    'btn_cydia': 'Дадаць у Cydia',
    'btn_sileo': 'Дадаць у Sileo',
    'switch_h': 'Як перайсці з аднаго канала на іншы',
    'switch_p1': 'Дастаткова дадаць патрэбную крыніцу і прыбраць непатрэбную. Пакет той самы, таму пераход выглядае звычайным абнаўленнем — ні выдаляць, ні пераўсталёўваць нічога не трэба.',
    'switch_p2': 'Калі дададзены абодва, ставіцца будзе тое, што навейшае, — звычайна адладачная зборка.',
    'author_h': 'Аўтар',
    'author_note': 'Навіны пра зборкі, пытанні і заўвагі — там жа, дзе і заўсёды.',
    'link_4pda': 'Старонка на 4PDA',
    'link_tg': 'Telegram-канал',
    'link_donate': 'Падтрымаць фінансава',
    'footer': 'Зборкі для <code>iphoneos-arm</code>, ніжняя мяжа — iOS 5.1.',
    'title_beta': 'Выпрабаванні — крыніца Computershik73',
    'h1_beta': 'Computershik73 — выпрабаванні',
    'sub_beta': 'Адладачныя зборкі маіх праектаў',
    'intro_beta': 'Гэта канал выпрабаванняў агульнай крыніцы маіх праектаў для iOS. Зборкі тут выходзяць па меры правак, пішуць падрабязны журнал і мяняюцца часта. Выпускі ляжаць тут жа, таму другую крыніцу дадаваць няма патрэбы.',
    'addr_h': 'Адрас',
    'beta_back': 'Патрэбны толькі выпускі — вазьміце <a href="../">стабільны канал</a>.',
    'beta_page': 'Адкрыць старонку канала выпрабаванняў',
    'apps_h': 'Праграмы',
    'apps_empty': 'Пакуль пуста: у гэтым канале яшчэ няма пакетаў.',
    'app_open_cydia': 'Адкрыць у Cydia',
    'app_open_sileo': 'Адкрыць у Sileo',
    'app_facts_h': 'Звесткі',
    'app_version': 'Версія',
    'app_size': 'Памер',
    'app_author': 'Распрацоўнік',
    'app_section': 'Раздзел',
    'app_depends': 'Залежнасці',
    'app_id': 'Імя пакета',
    'app_versions_h': 'Версіі ў гэтым канале',
    'app_versions_note': 'Ставіць іх уручную звычайна не трэба — для гэтага і ёсць крыніца.',
    'app_back': 'Назад да крыніцы'
},

'kk': {
    'title_index': 'Cydia мен Sileo үшін Computershik73 дереккөзі',
    'intro1': 'iOS үшін Computershik қолданбалары.',
    'intro2': 'Арна екеу. Тұрақтысы — күнделікті қолдануға арналған. Сынақ арнасы — түзетулер шыққан сайын жиналатын нұсқалар: олар егжей-тегжейлі журнал жазады және жиі жаңарады.',
    'stable_h': 'Тұрақты',
    'stable_note': 'Тек шыққан нұсқалар. Жаңартулар сирек келеді.',
    'beta_h': 'Сынақ',
    'beta_note': 'Жөндеу нұсқалары, солармен бірге шыққан нұсқалар да. Мұнда жазылсаңыз, нөмірі жоғарылағанда шыққан нұсқаны да аласыз.',
    'btn_cydia': 'Cydia-ға қосу',
    'btn_sileo': 'Sileo-ға қосу',
    'switch_h': 'Бір арнадан екіншісіне қалай көшуге болады',
    'switch_p1': 'Керекті дереккөзді қосып, керексізін алып тастасаңыз болды. Дестенің өзі сол күйінде, сондықтан ауысу кәдімгі жаңарту сияқты өтеді — ештеңені жоюдың да, қайта орнатудың да қажеті жоқ.',
    'switch_p2': 'Екеуі де қосылса, жаңасы орнатылады — әдетте бұл жөндеу нұсқасы.',
    'author_h': 'Автор',
    'author_note': 'Жинақтар туралы жаңалықтар, сұрақтар мен ескертпелер — әдеттегі жерлерде.',
    'link_4pda': '4PDA-дағы бет',
    'link_tg': 'Telegram арнасы',
    'link_donate': 'Қаржылай қолдау',
    'footer': '<code>iphoneos-arm</code> үшін жиналған, ең төменгі шегі — iOS 5.1.',
    'title_beta': 'Сынақ — Computershik73 дереккөзі',
    'h1_beta': 'Computershik73 — сынақ',
    'sub_beta': 'Жобаларымның жөндеу нұсқалары',
    'intro_beta': 'Бұл — iOS жобаларымның ортақ дереккөзінің сынақ арнасы. Мұндағы нұсқалар түзетулерге қарай шығады, егжей-тегжейлі журнал жазады және жиі жаңарады. Шыққан нұсқалар да осында, сондықтан екінші дереккөздің қажеті жоқ.',
    'addr_h': 'Мекенжай',
    'beta_back': 'Тек шыққан нұсқалар керек болса — <a href="../">тұрақты арнаны</a> алыңыз.',
    'beta_page': 'Сынақ арнасының бетін ашу',
    'apps_h': 'Қолданбалар',
    'apps_empty': 'Әзірге бос: бұл арнада әлі десте жоқ.',
    'app_open_cydia': 'Cydia-да ашу',
    'app_open_sileo': 'Sileo-да ашу',
    'app_facts_h': 'Мәліметтер',
    'app_version': 'Нұсқа',
    'app_size': 'Өлшемі',
    'app_author': 'Әзірлеуші',
    'app_section': 'Бөлім',
    'app_depends': 'Тәуелділіктер',
    'app_id': 'Дестенің аты',
    'app_versions_h': 'Осы арнадағы нұсқалар',
    'app_versions_note': 'Оларды қолмен орнатудың әдетте қажеті жоқ — дереккөз сол үшін керек.',
    'app_back': 'Дереккөзге оралу'
},

'zh': {
    'title_index': 'Computershik73 的 Cydia 与 Sileo 软件源',
    'intro1': 'Computershik 的 iOS 应用。',
    'intro2': '共有两个通道。稳定通道用于日常使用；测试通道随着修改不断发布，会记录详细日志，更新频繁。',
    'stable_h': '稳定通道',
    'stable_note': '只有正式版本，更新不频繁。',
    'beta_h': '测试通道',
    'beta_note': '包含调试版本，正式版本也在其中。订阅这里后，只要正式版本号更高，同样会收到。',
    'btn_cydia': '添加到 Cydia',
    'btn_sileo': '添加到 Sileo',
    'switch_h': '如何在两个通道之间切换',
    'switch_p1': '只需添加所需的源、移除不需要的即可。软件包是同一个，切换就是一次普通更新，无需卸载或重装。',
    'switch_p2': '如果两个都添加，则安装较新的那个，通常是调试版本。',
    'author_h': '作者',
    'author_note': '版本消息、提问和意见，仍在老地方。',
    'link_4pda': '4PDA 主页',
    'link_tg': 'Telegram 频道',
    'link_donate': '资助支持',
    'footer': '面向 <code>iphoneos-arm</code>，最低系统为 iOS 5.1。',
    'title_beta': '测试通道 — Computershik73 软件源',
    'h1_beta': 'Computershik73 — 测试通道',
    'sub_beta': '我的项目的调试版本',
    'intro_beta': '这是我 iOS 项目统一软件源的测试通道。这里的版本随修改发布，会记录详细日志，更新频繁。正式版本同样放在这里，无需再添加别的源。',
    'addr_h': '地址',
    'beta_back': '只需要正式版本，请选择<a href="../">稳定通道</a>。',
    'beta_page': '打开测试通道页面',
    'apps_h': '应用',
    'apps_empty': '目前为空：该通道还没有软件包。',
    'app_open_cydia': '在 Cydia 中打开',
    'app_open_sileo': '在 Sileo 中打开',
    'app_facts_h': '详细信息',
    'app_version': '版本',
    'app_size': '大小',
    'app_author': '开发者',
    'app_section': '分类',
    'app_depends': '依赖',
    'app_id': '软件包名',
    'app_versions_h': '该通道中的版本',
    'app_versions_note': '通常不必手动安装，软件源就是做这件事的。',
    'app_back': '返回软件源'
},

'ja': {
    'title_index': 'Computershik73 のリポジトリ（Cydia / Sileo）',
    'intro1': 'Computershik の iOS 向けアプリ。',
    'intro2': 'チャンネルは二つあります。安定版はふだん使うためのもの。試験版は修正のたびに出るビルドで、詳しいログを書き、頻繁に変わります。',
    'stable_h': '安定版',
    'stable_note': 'リリース版のみ。更新はまれです。',
    'beta_h': '試験版',
    'beta_note': 'デバッグ版に加えて、リリース版もここに置かれます。ここを登録しておけば、番号が上がった時点でリリース版も届きます。',
    'btn_cydia': 'Cydia に追加',
    'btn_sileo': 'Sileo に追加',
    'switch_h': 'チャンネルの切り替え方',
    'switch_p1': '必要な配布元を追加し、いらない方を外すだけです。パッケージは同じなので、切り替えはふつうの更新として進みます。削除も入れ直しも要りません。',
    'switch_p2': '両方を登録している場合は新しい方が入ります。ふつうはデバッグ版です。',
    'author_h': '作者',
    'author_note': 'ビルドの知らせ、質問や指摘は、いつもの場所へ。',
    'link_4pda': '4PDA のページ',
    'link_tg': 'Telegram チャンネル',
    'link_donate': '寄付で支援',
    'footer': '<code>iphoneos-arm</code> 向け。下限は iOS 5.1 です。',
    'title_beta': '試験版 — Computershik73 のリポジトリ',
    'h1_beta': 'Computershik73 — 試験版',
    'sub_beta': '私のプロジェクトのデバッグ版',
    'intro_beta': 'ここは私の iOS プロジェクト共通リポジトリの試験チャンネルです。修正のたびにビルドが出て、詳しいログを書き、頻繁に変わります。リリース版も同じ場所にあるので、別のリポジトリを足す必要はありません。',
    'addr_h': 'アドレス',
    'beta_back': 'リリース版だけでよければ<a href="../">安定版チャンネル</a>をどうぞ。',
    'beta_page': '試験版チャンネルのページを開く',
    'apps_h': 'アプリ',
    'apps_empty': '今は空です。このチャンネルにはまだパッケージがありません。',
    'app_open_cydia': 'Cydia で開く',
    'app_open_sileo': 'Sileo で開く',
    'app_facts_h': '詳細',
    'app_version': 'バージョン',
    'app_size': 'サイズ',
    'app_author': '開発者',
    'app_section': '分類',
    'app_depends': '必要条件',
    'app_id': 'パッケージ名',
    'app_versions_h': 'このチャンネルのバージョン',
    'app_versions_note': '手で入れる必要はふつうありません。そのためのリポジトリです。',
    'app_back': 'リポジトリに戻る'
}

    };

    /**
     * Метка языка к тому, что у нас есть.
     *
     * Португальский сводится к бразильскому: другого здесь нет, а
     * показать человеку родной язык всё же лучше, чем чужой. Китайский
     * — упрощённый, независимо от области.
     */
    function pick(tag) {
        if (!tag) {
            return null;
        }

        tag = tag.toLowerCase().replace('_', '-');

        if (STRINGS[tag]) {
            return tag;
        }

        var primary = tag.split('-')[0];

        if (primary === 'pt') {
            return 'pt-br';
        }

        return STRINGS[primary] ? primary : null;
    }

    /** Язык устройства: сперва список предпочтений, затем одиночная метка. */
    function fromDevice() {
        var list = navigator.languages;

        if (list && list.length) {
            for (var i = 0; i < list.length; i++) {
                var hit = pick(list[i]);

                if (hit) {
                    return hit;
                }
            }
        }

        return pick(navigator.language ||
                    navigator.userLanguage ||
                    navigator.browserLanguage);
    }

    /** Выбор человека — он старше языка устройства. */
    function stored() {
        try {
            return pick(window.localStorage.getItem('lang'));
        } catch (e) {
            // Приватный просмотр запрещает хранилище — тогда просто нечего помнить.
            return null;
        }
    }

    function remember(lang) {
        try {
            window.localStorage.setItem('lang', lang);
        } catch (e) {
        }
    }

    /** Метка из адреса — `?lang=en`; нужна, чтобы дать ссылку на язык. */
    function fromAddress() {
        var found = window.location.search.match(/[?&]lang=([\w-]+)/);

        return found ? pick(found[1]) : null;
    }

    function apply(lang) {
        var dict = STRINGS[lang];

        if (!dict) {
            return;
        }

        var nodes = document.getElementsByTagName('*');

        for (var i = 0; i < nodes.length; i++) {
            var node = nodes[i];

            if (!node.getAttribute) {
                continue;
            }

            var key = node.getAttribute('data-i18n');

            if (key && dict[key]) {
                node.innerHTML = dict[key];
            }

            var chosen = node.getAttribute('data-lang');

            if (chosen) {
                node.className = (chosen === lang) ? 'lang here' : 'lang';
            }
        }

        var titleKey = document.body.getAttribute('data-i18n-title');

        if (titleKey && dict[titleKey]) {
            document.title = dict[titleKey];
        }

        document.documentElement.lang = lang;
    }

    /** Переключатель внизу страницы: нажали — сменили и запомнили. */
    function listen() {
        var nodes = document.getElementsByTagName('a');

        for (var i = 0; i < nodes.length; i++) {
            var node = nodes[i];

            if (!node.getAttribute || !node.getAttribute('data-lang')) {
                continue;
            }

            node.onclick = function () {
                var lang = this.getAttribute('data-lang');

                remember(lang);
                apply(lang);

                return false;
            };
        }
    }

    apply(fromAddress() || stored() || fromDevice() || 'ru');

    listen();
})();
