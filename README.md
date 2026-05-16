# Munchkin Browser Prototype

Проект - прототип браузерной игры в стиле "Манчкин".

В репозитории две отдельные части без monorepo-инструмента:

- `testGameF` - Angular frontend.
- `testGameB` - NestJS backend с HTTP endpoint и Socket.IO gateway.

Backend хранит текущее состояние игры в памяти процесса. После перезапуска сервера лобби, подключенные игроки и игровые партии теряются.

## Структура проекта

```text
.
├── testGameF/              # Angular 17 frontend
│   ├── src/app/components/ # Экраны и UI-компоненты
│   ├── src/app/services/   # WebSocket/HTTP сервисы клиента
│   ├── src/assets/         # Статика frontend
│   └── package.json        # Скрипты Angular проекта
├── testGameB/              # NestJS backend
│   ├── src/http/           # HTTP контроллеры
│   ├── src/websocket/      # Socket.IO gateway и сервисы подключений/лобби/игр
│   ├── src/data/           # Модель игры и игровая логика
│   ├── src/cards/          # Описания и загрузка карт
│   └── package.json        # Скрипты NestJS проекта
├── docs/GAME_LOGIC.md      # Карта игровой логики
├── docs/API_CONTRACT.md    # HTTP и WebSocket контракты
└── AGENTS.md               # Инструкции для AI-агентов
```

## Технологии

Frontend:

- Angular 17.
- Angular Material/CDK.
- RxJS.
- Socket.IO Client.
- Angular SSR scaffold присутствует, но основной сценарий разработки - `ng serve`.

Backend:

- NestJS 10.
- `@nestjs/websockets` + Socket.IO.
- In-memory состояние через сервисы NestJS.
- Jest для тестов.

## Запуск frontend

```bash
cd testGameF
npm install
npm run start
```

На Windows PowerShell может блокировать `npm.ps1` политикой Execution Policy. В таком случае используйте те же команды через `npm.cmd`, например `npm.cmd install` и `npm.cmd run start`.

По умолчанию Angular dev server открывается на `http://localhost:4200/`.

Frontend ожидает backend на:

- HTTP: `http://localhost:3000`
- Socket.IO: `http://localhost:3001`

Эти адреса заданы в `testGameF/src/app/services/websocket.service.ts`.

## Запуск backend

```bash
cd testGameB
npm install
npm run start
```

Если PowerShell блокирует `npm.ps1`, используйте `npm.cmd install` и `npm.cmd run start`.

Backend слушает:

- HTTP API на порту `3000`.
- Socket.IO gateway на порту `3001`.

Для watch-режима backend:

```bash
cd testGameB
npm run start:dev
```

## Запуск обоих проектов одновременно

В корне проекта сейчас нет общего `package.json`, `concurrently`, Docker Compose или другого общего скрипта запуска.

Запускайте frontend и backend в двух терминалах:

```bash
cd testGameB
npm run start
```

```bash
cd testGameF
npm run start
```

## Где смотреть основную игровую логику

Backend является источником истины для игрового состояния.

Ключевые места:

- `testGameB/src/websocket/websocket.controller.ts` - Socket.IO события и входные точки действий игрока.
- `testGameB/src/websocket/data/data.service.ts` - подключенные клиенты и восстановление позиции игрока по nickname.
- `testGameB/src/websocket/lobby/lobby.service.ts` - список комнат, вход/выход, готовность игроков.
- `testGameB/src/websocket/munchkin/munchkin.service.ts` - регистрация активных игр.
- `testGameB/src/data/main.ts` - `Lobby`, `PlayerGlobal`, подготовка игроков к партии.
- `testGameB/src/data/munchkin/mucnhkinGame.ts` - состояние одной партии.
- `testGameB/src/data/munchkin/player.ts` - состояние игрока, использование/сброс/продажа карт.
- `testGameB/src/data/munchkin/gameHelpers/actionHelper.ts` - ход и этапы хода.
- `testGameB/src/data/munchkin/gameHelpers/fightHelper.ts` - бой, пас, смывка, награды и наказания.
- `testGameB/src/data/munchkin/gameHelpers/helpFightHelper.ts` - просьбы о помощи в бою.
- `testGameB/src/data/munchkin/gameHelpers/cardHelper.ts` - колоды, сброс, выдача карт.
- `testGameB/src/data/munchkin/gameHelpers/playerHelper.ts` - DTO состояния игры для каждого игрока и игровой лог.
- `testGameB/src/cards/Munchkin/json/cards.ts` - загрузка карт из JSON.

Frontend получает готовые состояния и отправляет действия:

- `testGameF/src/app/services/websocket.service.ts` - HTTP/Socket.IO клиент.
- `testGameF/src/app/components/nickname/` - ввод nickname.
- `testGameF/src/app/components/home/` - список комнат.
- `testGameF/src/app/components/lobby/` - лобби, пол, готовность.
- `testGameF/src/app/components/munchkin/` - игровой экран.
- `testGameF/src/app/components/munchkin/card/` - UI карты.
- `testGameF/src/app/components/munchkin/player/` - UI игрока.

## Документация

- `docs/GAME_LOGIC.md` описывает сущности, цикл игры и текущие прототипные ограничения.
- `docs/API_CONTRACT.md` описывает HTTP endpoint и Socket.IO события между frontend и backend.
- `AGENTS.md` описывает правила безопасной работы AI-агентов с проектом.

## Известные зоны риска

- Часть русских строк в исходниках выглядит как mojibake из-за кодировки. Не исправляйте массово без отдельной задачи и проверки контрактов.
- Типы DTO дублируются между frontend и backend вручную.
- WebSocket-события, статусы экранов и типы карт заданы магическими строками.
- Backend хранит состояние в памяти, без БД и восстановления после рестарта.
- В корне проекта нет общего git-репозитория; `testGameF` и `testGameB` имеют отдельные `.git` папки.
