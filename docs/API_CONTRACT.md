# API Contract

Этот документ фиксирует текущий контракт между `testGameF` и `testGameB`.

Не меняйте названия событий, маршрутов, shape payload/response или строковые статусы без синхронного изменения frontend и backend.

## Base URLs

Frontend использует базу из `testGameF/src/app/services/websocket.service.ts`:

```ts
url = "http://localhost"
```

Итоговые адреса:

- HTTP API: `http://localhost:3000`
- Socket.IO: `http://localhost:3001`

Backend:

- HTTP порт `3000` задается в `testGameB/src/main.ts`.
- Socket.IO gateway порт `3001` задается в `testGameB/src/websocket/websocket.controller.ts`.

## HTTP

### POST /nickname

Проверяет доступность nickname.

Frontend:

- `testGameF/src/app/services/websocket.service.ts`
- `testGameF/src/app/components/nickname/nickname.component.ts`

Backend:

- `testGameB/src/http/nickname/nickname.controller.ts`

Request body:

```json
{
  "nickname": "PlayerName"
}
```

Response:

```json
true
```

или

```json
false
```

Текущая логика backend возвращает `true`, если нет активного клиента с таким nickname.

## Socket.IO connection

Frontend подключается к `http://localhost:3001` и передает nickname в extra header `name`.

Frontend код:

```ts
io(this.url + ':3001', {
  extraHeaders: { "name": new TextEncoder().encode(name).toString() }
})
```

Backend декодирует header `name` в `DataService.connectClient()`.

Если игрок уже известен, backend обновляет socket и отправляет событие `goTo` с текущей позицией.

## Server to client events

### goTo

Назначение: навигация frontend на экран.

Payload:

```ts
"home" | "lobby" | "game"
```

Frontend:

- `testGameF/src/app/services/websocket.service.ts`

Backend emit:

- `testGameB/src/websocket/data/data.service.ts`
- `testGameB/src/websocket/websocket.controller.ts`

### refreshRooms

Назначение: обновить список комнат на экране home.

Payload:

```ts
Array<{
  name: string;
  creator: boolean;
  players: string[];
  maxPlayers: number;
  canIn: boolean;
}>
```

Frontend:

- `testGameF/src/app/components/home/home.component.ts`

Backend emit:

- `getLobbys`
- `refreshHomeFromAll()`

### statusCreate

Назначение: сообщить ошибку создания комнаты.

Payload:

```ts
string
```

Frontend показывает `alert(e)`.

### statusDelete

Назначение: сообщить ошибку удаления комнаты.

Payload:

```ts
string
```

Frontend показывает `alert(e)`.

### statusRoomIn

Назначение: результат входа в комнату.

Payload:

```ts
true | string
```

Если `true`, frontend переходит в `lobby`; иначе показывает `alert(e)`.

Важно: backend сейчас при успешном входе может отправить `statusRoomIn` два раза: сначала `true`, затем результат `tmp`. Это зафиксированное поведение прототипа, менять без проверки не стоит.

### statusLobby

Назначение: обновить состояние текущего лобби.

Payload:

```ts
{
  name: string;
  creator: boolean;
  players: Array<{
    nickname: string;
    sex: string;
    ready: boolean;
    you: boolean;
  }>;
  maxPlayers: number;
}
```

`sex` сейчас должен совпадать с backend-строками пола, которые в исходниках отображаются как mojibake.

### allReady

Назначение: лобби готово, игра создана.

Payload: отсутствует.

Frontend переходит на маршрут `game`.

### statusPlayer

Назначение: сообщить текущую позицию игрока.

Payload:

```ts
"home" | "lobby" | "game"
```

### refreshGame

Назначение: отправить персонализированное состояние партии конкретному игроку.

Payload:

```ts
false | {
  queue: string;
  step: 0 | 1 | 2 | 3;
  field: GameField;
  is_fight: boolean;
  sbros: {
    doors?: CardData;
    treasures?: CardData;
  };
  cards: {
    doors: number;
    treasures: number;
  };
  players: PlayerStats[];
  you: PlayerStats;
  you_hodish: boolean;
  pas: boolean;
  smivka: boolean;
  rasses_mesto: boolean;
  classes_mesto: boolean;
  help_ask?: {
    pl: PlayerStats;
    gold: number;
  };
  is_help: boolean;
  end: boolean;
}
```

Frontend-типы для этого payload находятся в `testGameF/src/app/components/munchkin/munchkin.component.ts`.

Backend-тип находится в `testGameB/src/data/munchkin/gameHelpers/playerHelper.ts`.

Обратите внимание: frontend и backend типы похожи, но не являются общими и могут расходиться.

### allLog

Назначение: отправить полный лог игры.

Payload:

```ts
string[]
```

### plusLog

Назначение: отправить одну новую строку лога.

Payload:

```ts
string
```

### condition

Назначение: показать временное уведомление/условие игроку.

Payload:

```ts
string
```

Используется, например, при невозможности надеть карту из-за условия.

### error

Назначение: сообщить ошибку использования карты.

Payload:

```ts
string
```

В backend есть emit `error`, но frontend сейчас явно не подписывается на него в игровом компоненте.

### notice

Назначение: сообщить уведомление игроку.

Payload:

```ts
string
```

В backend есть emit `notice` при отказе в помощи, но frontend сейчас явно не подписывается на него.

## Client to server events

### getAllPlayers

Payload: отсутствует.

Response/return: список подключенных клиентов для отладки.

```ts
Array<{
  name: string;
  position: unknown;
  id: string;
}>
```

### getLobbys

Payload: отсутствует.

Backend отправляет `refreshRooms`.

### createLobby

Payload:

```ts
{
  name: string;
  max: number;
}
```

Frontend создает имя комнаты как строку вида `Комната <nickname>` в текущей кодировке исходника.

### deleteLobby

Payload:

```ts
string
```

Строка - имя комнаты.

### roomIn

Payload:

```ts
string
```

Строка - имя комнаты.

### roomOut

Payload: отсутствует.

Игрок выходит из лобби в `home`.

### statusLobby

Payload: отсутствует.

Backend отправляет `statusLobby` для текущего лобби игрока.

### setSex

Payload:

```ts
string
```

Допустимые значения должны совпадать с backend union для пола. В исходниках эти строки сейчас отображаются как mojibake, поэтому менять их без синхронной проверки нельзя.

### statusPlayer

Payload: отсутствует.

Backend отправляет `statusPlayer`.

### setReady

Payload:

```ts
boolean
```

Если все игроки готовы и лобби заполнено, backend создает игру и отправляет `allReady` участникам.

### refreshGame

Payload: отсутствует.

Backend отправляет `refreshGame` или `false`, если игрок не в игре.

### allLog

Payload: отсутствует.

Backend отправляет `allLog` или `refreshGame: false`, если игрок не в игре.

### endHod

Payload: отсутствует.

Завершить ход текущего игрока, если количество карт допустимо.

### useCard

Payload:

```ts
number
```

Число - `id` карты в руке игрока.

### useCardMesto

Payload:

```ts
{
  id_card: number;
  mesto: "first" | "second" | "bonus";
}
```

Используется для выбора слота класса/расы.

### getDoorCardByPlayer

Payload: отсутствует.

Текущий игрок берет дверь. Поведение зависит от `step`.

### pas

Payload: отсутствует.

Игрок пасует в бою.

### smivka

Payload: отсутствует.

Игрок делает бросок смывки.

### helpAsk

Payload:

```ts
{
  to: string;
  gold: number;
}
```

Основной игрок боя просит другого игрока помочь за указанное количество сокровищ.

### helpAnswer

Payload:

```ts
boolean
```

Ответ игрока на просьбу о помощи.

### sbrosCard

Payload:

```ts
number
```

Сбросить карту из руки на этапе завершения хода.

### sbrosEquip

Payload:

```ts
number
```

Сбросить экипированную карту.

### sellCard

Payload:

```ts
number
```

Продать карту из руки по `abstractData.cost`.

### toHome

Payload: отсутствует.

Выход из игры на экран home.

## Дублирование типов и потенциальные расхождения

Найденные места ручного дублирования:

- `refreshRooms` описан в `testGameF/src/app/components/home/home.component.ts`, backend shape создается в `Lobby.homeGetRoom()`.
- `statusLobby` описан в `testGameF/src/app/components/lobby/lobby.component.ts`, backend shape создается в `Lobby.lobbyGetRoom()`.
- `refreshGame` описан в `testGameF/src/app/components/munchkin/munchkin.component.ts`, backend shape создается в `PlayerHelper.getMainForPlayer()`.
- Карточные типы описаны на frontend в `card.component.ts` и на backend в `interfaces/`.
- `cardMestoEvent` описан и на frontend, и на backend.

Потенциальные несоответствия:

- В frontend `playerData.t_field.arm` указан как `[]`, а backend возвращает массив `ITreasure[]`.
- В backend `MunchkinOutput.sbros.doors` и `treasures` могут быть `undefined`, потому что берется последний элемент сброса через `.at(-1)?.getData()`, а frontend типизирует их как обязательные `AbstractCard`.
- Backend `ITreasure` использует поле `strongest`, а frontend `AbstractCard` допускает `strong` и отдельные card interfaces используют `strongest`. Это лучше унифицировать отдельной задачей.
- Backend может emit-ить `error` и `notice`, но frontend сейчас не подписан на эти события в игровом экране.

## Магические строки, которые нельзя ломать без синхронного изменения

Маршруты frontend и статусы backend:

- `start`
- `home`
- `lobby`
- `game`

Основные Socket.IO события:

- `goTo`
- `refreshRooms`
- `statusCreate`
- `statusDelete`
- `statusRoomIn`
- `statusLobby`
- `allReady`
- `statusPlayer`
- `refreshGame`
- `allLog`
- `plusLog`
- `condition`
- `getLobbys`
- `createLobby`
- `deleteLobby`
- `roomIn`
- `roomOut`
- `setSex`
- `setReady`
- `endHod`
- `useCard`
- `useCardMesto`
- `getDoorCardByPlayer`
- `pas`
- `smivka`
- `helpAsk`
- `helpAnswer`
- `sbrosCard`
- `sbrosEquip`
- `sellCard`
- `toHome`

Игровые строковые значения:

- Пол игрока.
- Типы карт.
- Типы сокровищ.
- Слоты экипировки.
- Слоты класса/расы: `first`, `second`, `bonus`.

Часть игровых строк в коде отображается как mojibake. Несмотря на нечитаемость, они являются текущими сравниваемыми значениями и частью поведения прототипа.
