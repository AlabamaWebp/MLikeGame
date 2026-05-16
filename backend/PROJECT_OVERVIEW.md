# Backend Project Overview

## Назначение

NestJS backend для браузерного прототипа Munchkin Browser Prototype. Backend хранит состояние игроков, комнат и партий в памяти процесса, принимает HTTP-запрос проверки nickname и обслуживает Socket.IO игровые события.

## Структура папок

- `src/main.ts` - bootstrap NestJS HTTP-приложения на порту `3000`.
- `src/http/nickname` - HTTP endpoint `POST /nickname`.
- `src/websocket/websocket.controller.ts` - Socket.IO gateway на порту `3001`.
- `src/websocket/data` - подключенные клиенты и восстановление позиции игрока.
- `src/websocket/lobby` - комнаты, вход, выход и готовность игроков.
- `src/websocket/munchkin` - регистрация активных игр.
- `src/data/main.ts` - глобальные игроки и лобби.
- `src/data/munchkin` - состояние партии, игроки, helper-логика хода, боя, карт и помощи.
- `src/data/munchkin/interfaces` - backend-модели карт, поля и игрового состояния.
- `src/cards/Munchkin` - описания карт и загрузка JSON-карт.

## Ключевые модули и сервисы

- `WebsocketModule` собирает gateway и сервисы websocket-слоя.
- `MyGateway` принимает Socket.IO события и делегирует работу в lobby/game сервисы.
- `DataService` хранит подключенных клиентов и восстанавливает экран игрока после переподключения.
- `LobbyService` управляет списком комнат и рассылает обновления лобби.
- `MunchkinService` хранит активные партии.
- `MunchkinGame`, `PlayerGame` и `gameHelpers` содержат игровую механику.
- `NicknameController` проверяет доступность nickname.

## Запуск

```bash
npm install
npm run start
```

Watch-режим:

```bash
npm run start:dev
```

На Windows PowerShell при блокировке `npm.ps1` используйте:

```bash
npm.cmd install
npm.cmd run start
```

Backend слушает:

- HTTP API: `http://localhost:3000`
- Socket.IO: `http://localhost:3001`

## Основные функции

- Проверка уникальности nickname.
- Подключение и переподключение socket-клиентов.
- Создание, удаление и список комнат.
- Вход/выход из лобби.
- Выбор пола и готовность игроков.
- Создание партии при готовности всех игроков.
- Рассылка персонального `refreshGame` каждому игроку.
- Ход, бой, помощь, смывка, использование, сброс и продажа карт.

## Решения после рефакторинга

- Контрактные DTO подключены из `../shared/src` через type-only импорты.
- Добавлен `NicknameDto` для HTTP body `POST /nickname`.
- `LobbyService` получил явную типизацию комнат и убран лишний `any`.
- `DataService` очищен от неиспользуемого кода и получил более понятные имена локальных переменных.
- В gateway убраны `@ts-ignore` в `roomOut`; доступ к лобби теперь явно сужается через проверку позиции.
- Игровая бизнес-логика не переписывалась, чтобы не изменить механику партии.

## Что улучшить позже

- Разделить `websocket.controller.ts` на зоны home/lobby/game или отдельные gateway handlers.
- Добавить class-validator/class-transformer для runtime-валидации DTO.
- Оформить `shared` как локальный npm-пакет для безопасного использования runtime-констант.
- Постепенно исправить mojibake-строки отдельной задачей.
- Добавить тесты для ключевых игровых сценариев и Socket.IO контрактов.
- Вынести состояние из памяти процесса в устойчивое хранилище, если проект пойдет дальше прототипа.

