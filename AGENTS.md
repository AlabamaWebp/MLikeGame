# AGENTS.md

Инструкции для AI-агентов, работающих с прототипом Munchkin Browser Prototype.

## Общий принцип

Проект уже содержит рабочий прототип. Главная цель изменений - помогать дальнейшей разработке, не ломая существующие контракты и игровое поведение.

Не переписывайте проект с нуля и не мигрируйте его на Nx, Turborepo, workspace package manager или другой monorepo-инструмент без явного запроса человека.

## Структура

- `testGameF` - Angular frontend.
- `testGameB` - NestJS backend.
- `docs` - документация по логике и контрактам.

Frontend и backend - отдельные проекты со своими `package.json`, lock-файлами и git-репозиториями.

## Frontend

Ключевые файлы:

- `testGameF/src/app/services/websocket.service.ts` - HTTP и Socket.IO клиент, базовый URL backend.
- `testGameF/src/app/app.routes.ts` - маршруты экранов.
- `testGameF/src/app/components/nickname/` - ввод nickname и проверка через HTTP.
- `testGameF/src/app/components/home/` - экран комнат.
- `testGameF/src/app/components/lobby/` - экран лобби.
- `testGameF/src/app/components/munchkin/` - экран игры, получение `refreshGame`, отправка игровых действий.
- `testGameF/src/app/components/munchkin/card/` - отображение карт и действия с картой.
- `testGameF/src/app/components/munchkin/player/` - отображение игрока, экипировки и просьб о помощи.

Команды:

```bash
cd testGameF
npm install
npm run start
npm run build
npm run test
```

В Windows PowerShell при блокировке `npm.ps1` используйте `npm.cmd`, например `npm.cmd run build`.

В `testGameF/package.json` сейчас нет script `lint`.

## Backend

Ключевые файлы:

- `testGameB/src/main.ts` - NestJS bootstrap, HTTP порт `3000`.
- `testGameB/src/websocket/websocket.controller.ts` - Socket.IO gateway на порту `3001` и все входные события.
- `testGameB/src/http/nickname/nickname.controller.ts` - `POST /nickname`.
- `testGameB/src/websocket/data/data.service.ts` - подключенные клиенты.
- `testGameB/src/websocket/lobby/lobby.service.ts` - комнаты и лобби.
- `testGameB/src/websocket/munchkin/munchkin.service.ts` - активные игры.
- `testGameB/src/data/main.ts` - глобальный игрок и лобби.
- `testGameB/src/data/munchkin/mucnhkinGame.ts` - состояние партии.
- `testGameB/src/data/munchkin/player.ts` - игрок внутри партии.
- `testGameB/src/data/munchkin/gameHelpers/` - логика хода, боя, помощи, карт и рассылки состояния.
- `testGameB/src/data/munchkin/interfaces/` - backend-типы карт, поля и состояния игры.
- `testGameB/src/cards/Munchkin/` - карты и загрузка JSON-карт.

Команды:

```bash
cd testGameB
npm install
npm run start
npm run start:dev
npm run build
npm run test
npm run lint
```

В Windows PowerShell при блокировке `npm.ps1` используйте `npm.cmd`, например `npm.cmd run build`.

`npm run lint` использует `--fix`, поэтому может изменять файлы. Не запускайте его без готовности принять форматирующие/автофикс-изменения.

## Что запрещено без разрешения

Не менять без явного согласования:

- Названия HTTP маршрутов.
- Названия WebSocket событий.
- Форму DTO между frontend и backend.
- Значения строковых статусов экранов: `home`, `lobby`, `game`.
- Значения строковых статусов и типов игры: этапы хода, типы карт, слоты экипировки, пол игрока.
- Правила боя, наград, смывки, очередности ходов и условий победы.
- Способ хранения состояния игры.
- Структуру проекта на monorepo.
- Массовую перекодировку русских строк.

## Как вносить изменения

1. Сначала найдите backend-источник истины для поведения.
2. Проверьте, где frontend отправляет или принимает тот же контракт.
3. Если меняется контракт, меняйте frontend и backend синхронно и обновляйте `docs/API_CONTRACT.md`.
4. Для игровой логики добавляйте или обновляйте описание в `docs/GAME_LOGIC.md`.
5. Делайте минимальный diff и не трогайте несвязанные файлы.
6. Не удаляйте код, если нет уверенности, что он не используется.
7. Комментарии добавляйте только к сложной логике, не к очевидным присваиваниям.
8. Если видите архитектурную проблему, сначала опишите риск в отчете, а не исправляйте автоматически.

## Проверки

Перед финальным отчетом по возможности запустите релевантные проверки:

```bash
cd testGameF
npm run build
npm run test
```

```bash
cd testGameB
npm run build
npm run test
```

Backend lint:

```bash
cd testGameB
npm run lint
```

Помните, что backend lint может менять файлы из-за `--fix`.

## Формат отчета после работы

Отчет должен содержать:

1. Что было сделано.
2. Измененные файлы.
3. Какие проверки запускались и результат.
4. Изменялись ли контракты frontend/backend.
5. Риски и ограничения.
6. Что стоит улучшить следующим этапом.
