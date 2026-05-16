# Game Logic

Документ описывает текущую реализацию прототипа. Он не является спецификацией полного "Манчкина", а фиксирует то, что сейчас видно в коде.

## Основные сущности

### PlayerGlobal

Файл: `testGameB/src/data/main.ts`

Глобальный игрок, привязанный к Socket.IO подключению и nickname.

Поля и поведение:

- `socket` - текущее подключение игрока.
- `name` - nickname.
- `position` - текущее место игрока: `home`, `Lobby` или `MunchkinGame`.
- `out()` - выход из лобби или отметка отключения из игры.
- `getPositionStr()` - строковый статус для frontend: `home`, `lobby`, `game`.

### Lobby

Файл: `testGameB/src/data/main.ts`

Комната ожидания перед стартом партии.

Содержит:

- название комнаты;
- создателя;
- максимальное число игроков;
- список игроков лобби;
- выбранный пол игрока;
- готовность игрока.

Когда все игроки готовы и количество игроков равно `maxPlayers`, лобби создает `MunchkinGame`.

### PlayerGame

Файл: `testGameB/src/data/munchkin/player.ts`

Игрок внутри партии.

Содержит:

- уровень;
- пол;
- очередь игрока;
- карты в руке;
- экипированные сокровища;
- расы и классы;
- монеты от продажи карт;
- силу для боя;
- состояние смывки.

Основные действия:

- `useCard()` - использовать карту из руки.
- `useCardMesto()` - положить класс/расу в конкретный слот.
- `sbrosCard()` - сбросить карту из руки на этапе завершения хода.
- `sbrosEquip()` - сбросить экипировку.
- `sellCard()` - продать карту за монеты и возможные уровни.
- `changeLvl()` - изменить уровень и проверить победу.

### MunchkinGame

Файл: `testGameB/src/data/munchkin/mucnhkinGame.ts`

Состояние одной партии.

Содержит:

- имя игры;
- список игроков;
- текущего игрока;
- очередь хода;
- колоды дверей и сокровищ;
- сброс дверей и сокровищ;
- этап хода `step`;
- поле игры;
- helper-классы для действий, карт, боя, помощи и рассылки состояния.

Этапы хода сейчас заданы числом:

- `0` - перед открытием двери.
- `1` - после не-монстра, можно чистить нычки или сыграть монстра из руки.
- `2` - бой.
- `3` - после боя или чистки, можно завершить ход при допустимом числе карт.

### Cards

Основные классы:

- `DoorCard` - дверь: класс, раса, проклятие, монстр, бафф монстра.
- `TreasureCard` - сокровище: надеваемое, используемое или боевое.
- `AbstractCard` - общие данные карты.

Файлы:

- `testGameB/src/data/munchkin/interfaces/AbstractCard.ts`
- `testGameB/src/data/munchkin/interfaces/DoorCard.ts`
- `testGameB/src/data/munchkin/interfaces/TreasureCard.ts`
- `testGameB/src/cards/Munchkin/json/cards.ts`
- `testGameB/src/cards/Munchkin/json/*.json`
- `testGameB/src/cards/Munchkin/doors/*.ts`
- `testGameB/src/cards/Munchkin/treasures/*.ts`

Сейчас активная загрузка колод идет через `CARDS` из JSON-файлов в `src/cards/Munchkin/json/cards.ts`.

### GameField и Fight

Файл: `testGameB/src/data/munchkin/interfaces/Game.ts`

`GameField` содержит открытые карты и текущий бой.

`Fight` содержит:

- основного игрока боя;
- второго игрока, если он помогает;
- монстров;
- боевые карты сторон;
- множество игроков, которые пасанули;
- силу стороны игроков;
- силу стороны монстров;
- сокровища и уровни за победу;
- состояние смывки.

## Игровой цикл

### 1. Nickname

Frontend отправляет `POST /nickname` с `{ nickname }`.

Backend проверяет, нет ли активного клиента с таким именем.

Код:

- `testGameF/src/app/components/nickname/nickname.component.ts`
- `testGameF/src/app/services/websocket.service.ts`
- `testGameB/src/http/nickname/nickname.controller.ts`

### 2. Socket.IO подключение

После успешной проверки nickname frontend открывает Socket.IO подключение к `http://localhost:3001` и передает nickname в header `name`.

Backend декодирует имя, создает `PlayerGlobal` или восстанавливает старого игрока по nickname.

Код:

- `testGameF/src/app/services/websocket.service.ts`
- `testGameB/src/websocket/data/data.service.ts`

### 3. Home и комнаты

Игрок видит список лобби, может создать комнату, удалить свою пустую комнату или войти в комнату.

Код:

- `testGameF/src/app/components/home/home.component.ts`
- `testGameB/src/websocket/websocket.controller.ts`
- `testGameB/src/websocket/lobby/lobby.service.ts`
- `testGameB/src/data/main.ts`

### 4. Lobby

Игрок выбирает пол и готовность. Когда все игроки готовы и комната заполнена, создается `MunchkinGame`, игроки переводятся в состояние игры, лобби удаляется.

Код:

- `testGameF/src/app/components/lobby/lobby.component.ts`
- `testGameB/src/websocket/websocket.controller.ts`
- `testGameB/src/websocket/lobby/lobby.service.ts`
- `testGameB/src/websocket/munchkin/munchkin.service.ts`

### 5. Старт партии

При создании игры:

- игроки перемешиваются;
- назначается текущий игрок;
- колоды дверей и сокровищ перемешиваются;
- картам назначаются id;
- каждый игрок получает 4 двери и 4 сокровища.

Код:

- `testGameB/src/data/munchkin/mucnhkinGame.ts`
- `testGameB/src/data/munchkin/functions.ts`

### 6. Ход игрока

Текущий игрок может взять дверь.

Если дверь - монстр:

- начинается бой;
- `step` становится `2`.

Если дверь не монстр:

- карта открывается на поле;
- если это не проклятие, карта добавляется в руку;
- `step` становится `1`.

На `step = 1` игрок может взять закрытую дверь и перейти к `step = 3`.

Код:

- `testGameB/src/data/munchkin/gameHelpers/actionHelper.ts`
- `testGameB/src/data/munchkin/gameHelpers/cardHelper.ts`

### 7. Использование карт

Игрок может использовать карты из руки. Доступность определяется `can_use()` у `DoorCard` и `TreasureCard`.

Примеры текущих правил:

- Класс/раса - только вне боя и только текущим игроком.
- Монстр из руки - только на `step = 1` и только текущим игроком.
- Надеваемое сокровище - только вне боя и текущим игроком.
- Боевое сокровище - только во время боя.

Код:

- `testGameB/src/data/munchkin/player.ts`
- `testGameB/src/data/munchkin/interfaces/DoorCard.ts`
- `testGameB/src/data/munchkin/interfaces/TreasureCard.ts`

### 8. Бой

Бой создается через `FightHelper.startFight()`.

Игроки могут:

- пасовать;
- делать бросок смывки;
- просить другого игрока о помощи за часть сокровищ;
- использовать боевые карты.

Когда все игроки пасанули, `FightHelper.endFight()` завершает бой.

Если игроки победили:

- основной игрок получает закрытые сокровища;
- основной игрок получает уровни;
- помощник, если был, тоже получает сокровища по текущей реализации.

Если победили монстры:

- применяются наказания монстров, если они заданы.

После боя монстры уходят в сброс, бой удаляется, игра переходит на `step = 3`.

Код:

- `testGameB/src/data/munchkin/gameHelpers/fightHelper.ts`
- `testGameB/src/data/munchkin/gameHelpers/helpFightHelper.ts`

### 9. Завершение хода

Игрок может завершить ход только если он текущий игрок и количество карт в руке не превышает максимум.

При завершении:

- монеты игрока сбрасываются в `0`;
- очередь переходит к следующему игроку;
- `step` сбрасывается в `0`;
- всем игрокам отправляется обновленное состояние.

Код:

- `testGameB/src/data/munchkin/gameHelpers/actionHelper.ts`

## Что уже реализовано

- Проверка nickname через HTTP.
- Socket.IO подключение и восстановление игрока по nickname.
- Список комнат.
- Создание и удаление пустой комнаты создателем.
- Вход и выход из лобби.
- Выбор пола и готовности.
- Автостарт игры при заполненном готовом лобби.
- In-memory партия.
- Колоды дверей и сокровищ из JSON.
- Раздача стартовых карт.
- Основные этапы хода.
- Открытие двери.
- Чистка нычек.
- Надевание сокровищ.
- Классы и расы.
- Продажа карт за уровни.
- Бой с монстром.
- Пас и завершение боя после паса всех игроков.
- Смывка.
- Просьба о помощи в бою.
- Лог игры.
- Персонализированный `refreshGame` для каждого игрока.

## Заглушки и прототипные места

- Нет постоянного хранения состояния.
- Нет полноценной авторизации, nickname является идентификатором игрока.
- Контракты не вынесены в shared package и вручную дублируются на frontend.
- Много строковых значений не вынесено в enum/const.
- Часть русских строк в исходниках отображается как mojibake.
- Некоторые карточные эффекты и наказания отсутствуют или частично реализованы.
- Комментарии в `todo` backend указывают на планы: система проверки условий, сохранение игры, хранение действий карт в JSON, переписывание классов карт.
- В `testGameB/src/cards/Munchkin/doors` и `treasures` есть TS-описания карт, но активная сборка колоды сейчас идет из JSON через `CARDS`.
- В `testGameB/src/data/munchkin/player.ts` есть `useCardOnPlayer()` с комментарием, что метод не использовался.
- `MunchkinService` объявляет `WeakSet<MunchkinGame>`, но инициализирует `new Set()`. Это не ломает текущий TypeScript build до проверки, но выглядит как место для отдельного исправления.
- `toHome` фильтрует игроков через `game.players.filter(...)`, но результат не присваивает. Это похоже на потенциальный баг выхода из игры и требует отдельного анализа.
