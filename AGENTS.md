# AGENTS.md

Инструкции для AI-агентов, работающих с прототипом Munchkin Browser Prototype.

## Общий принцип

Проект уже содержит рабочий прототип. Главная цель изменений - помогать дальнейшей разработке, не ломая существующие контракты и игровое поведение.

Проект объединен в один git-репозиторий, но без Nx, Turborepo, npm workspaces или другого monorepo-инструмента. Не переписывайте проект с нуля и не мигрируйте его на такие инструменты без явного запроса человека.

## Структура

- `frontend` - Angular frontend.
- `backend` - NestJS backend.
- `shared` - планируемая папка для общих TypeScript-типов, констант и чистых helper-функций, которые можно безопасно использовать и во frontend, и в backend.
- `docs` - документация по логике и контрактам.

Frontend и backend остаются отдельными npm-проектами со своими `package.json` и lock-файлами. Git-репозиторий теперь один, в корне проекта. Папки вроде `frontend/.git1` и `backend/.git1`, если они есть, не считать активными репозиториями.

В корне сейчас нет общего `package.json`, общего lock-файла и общего script-runner. Команды запускаются из `frontend` или `backend`.

## Frontend

Ключевые файлы:

- `frontend/src/app/services/websocket.service.ts` - HTTP и Socket.IO клиент, базовый URL backend.
- `frontend/src/app/app.routes.ts` - маршруты экранов.
- `frontend/src/app/components/nickname/` - ввод nickname и проверка через HTTP.
- `frontend/src/app/components/home/` - экран комнат.
- `frontend/src/app/components/lobby/` - экран лобби.
- `frontend/src/app/components/munchkin/` - экран игры, получение `refreshGame`, отправка игровых действий.
- `frontend/src/app/components/munchkin/card/` - отображение карт и действия с картой.
- `frontend/src/app/components/munchkin/player/` - отображение игрока, экипировки и просьб о помощи.

Команды:

```bash
cd frontend
npm install
npm run start
npm run build
npm run test
```

В Windows PowerShell при блокировке `npm.ps1` используйте `npm.cmd`, например `npm.cmd run build`.

В `frontend/package.json` сейчас нет script `lint`.

## Backend

Ключевые файлы:

- `backend/src/main.ts` - NestJS bootstrap, HTTP порт `3000`.
- `backend/src/websocket/websocket.controller.ts` - Socket.IO gateway на порту `3001` и все входные события.
- `backend/src/http/nickname/nickname.controller.ts` - `POST /nickname`.
- `backend/src/websocket/data/data.service.ts` - подключенные клиенты.
- `backend/src/websocket/lobby/lobby.service.ts` - комнаты и лобби.
- `backend/src/websocket/munchkin/munchkin.service.ts` - активные игры.
- `backend/src/data/main.ts` - глобальный игрок и лобби.
- `backend/src/data/munchkin/mucnhkinGame.ts` - состояние партии.
- `backend/src/data/munchkin/player.ts` - игрок внутри партии.
- `backend/src/data/munchkin/gameHelpers/` - логика хода, боя, помощи, карт и рассылки состояния.
- `backend/src/data/munchkin/interfaces/` - backend-типы карт, поля и состояния игры.
- `backend/src/cards/Munchkin/` - карты и загрузка JSON-карт.

Команды:

```bash
cd backend
npm install
npm run start
npm run start:dev
npm run build
npm run test
npm run lint
```

В Windows PowerShell при блокировке `npm.ps1` используйте `npm.cmd`, например `npm.cmd run build`.

`npm run lint` использует `--fix`, поэтому может изменять файлы. Не запускайте его без готовности принять форматирующие/автофикс-изменения.

## Shared

Цель папки `shared` - убрать ручное дублирование безопасных общих частей между frontend и backend, не меняя сетевые контракты и игровое поведение.

Что можно выносить в `shared`:

- DTO и TypeScript-типы payload между HTTP/WebSocket frontend и backend.
- Строковые константы событий Socket.IO и HTTP routes.
- Строковые union-типы статусов экранов и игры.
- Чистые функции без доступа к Angular, NestJS, DOM, Socket.IO, файловой системе и in-memory состоянию backend.

Что не выносить в `shared` без отдельного решения:

- Angular components/services, NestJS services/controllers/gateways.
- Игровую логику, которая мутирует состояние партии или зависит от backend-классов.
- Загрузку карт из файлов, работу с JSON-колодами и любые runtime-зависимости backend.
- Код с зависимостями от browser-only или node-only API.

Рекомендуемая структура:

```text
shared/
├── src/
│   ├── contracts/       # DTO, HTTP/WebSocket payload types
│   ├── constants/       # event names, route names, stable statuses
│   ├── game/            # общие enum/union-типы предметной области
│   └── index.ts         # публичный экспорт
└── tsconfig.json        # компиляция только shared TypeScript
```

Правила выноса общего кода:

1. Сначала найдите дублирование в backend и frontend и убедитесь, что значения действительно описывают один контракт.
2. Начинайте с типов и констант, а не с игровой логики.
3. Переносите по одному небольшому контракту за раз: например, сначала Socket.IO event names, затем DTO `refreshGame`, затем статусы экранов.
4. После переноса обновите импорты в обоих проектах и убедитесь, что итоговый JS не тащит backend-код во frontend bundle.
5. Если меняется shape DTO или название события, обновите `docs/API_CONTRACT.md`.
6. Если перенос затрагивает правила игры, обновите `docs/GAME_LOGIC.md`.
7. После каждого шага запускайте `npm run build` в затронутом проекте, а при общих типах - в обоих проектах.

Подключение `shared` без monorepo-инструмента:

- Для первого шага можно выносить только типы и подключать их через `import type`. Такие импорты стираются при сборке и не создают runtime-зависимость.
- Для общих runtime-констант и функций предпочтительнее оформить `shared` как маленький локальный npm-пакет с `package.json`, `tsconfig.json`, сборкой в `shared/dist` и зависимостью `"@mlikegame/shared": "file:../shared"` в `frontend/package.json` и `backend/package.json`.
- Не полагайтесь только на TypeScript `paths` для runtime-кода backend: `nest build` не обязан переписывать alias в JS, и Node может не найти `@shared/*` после сборки.
- Если все-таки используете `paths`, сначала проверьте `npm run build` и реальный запуск backend после сборки.

Пример alias для type-only этапа:

```json
{
  "compilerOptions": {
    "paths": {
      "@shared/*": ["../shared/src/*"]
    }
  }
}
```

Для frontend путь задается относительно `frontend/tsconfig.json`; для backend - относительно `backend/tsconfig.json`.

## Что запрещено без разрешения

Не менять без явного согласования:

- Названия HTTP маршрутов.
- Названия WebSocket событий.
- Форму DTO между frontend и backend.
- Значения строковых статусов экранов: `home`, `lobby`, `game`.
- Значения строковых статусов и типов игры: этапы хода, типы карт, слоты экипировки, пол игрока.
- Правила боя, наград, смывки, очередности ходов и условий победы.
- Способ хранения состояния игры.
- Миграцию проекта на Nx, Turborepo, npm workspaces, pnpm workspaces или другой monorepo-инструмент.
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
9. Если выносите общий код в `shared`, делайте это маленькими шагами и проверяйте сборку frontend и backend после каждого значимого шага.

## Проверки

Перед финальным отчетом по возможности запустите релевантные проверки:

```bash
cd frontend
npm run build
npm run test
```

```bash
cd backend
npm run build
npm run test
```

Backend lint:

```bash
cd backend
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
