# Frontend Project Overview

## Назначение

Angular frontend для браузерного прототипа Munchkin Browser Prototype. Приложение отвечает за ввод nickname, список комнат, лобби и игровой экран. Backend остается источником истины для состояния игры.

## Структура папок

- `src/app/components/nickname` - ввод nickname и HTTP-проверка доступности имени.
- `src/app/components/home` - список комнат, создание, удаление и вход в комнату.
- `src/app/components/lobby` - игроки в комнате, выбор пола, готовность к старту.
- `src/app/components/munchkin` - основной игровой экран.
- `src/app/components/munchkin/card` - отображение карты и действия с ней.
- `src/app/components/munchkin/player` - отображение игрока, экипировки и просьб о помощи.
- `src/app/components/munchkin/dialogs` - диалоги помощи в бою.
- `src/app/services/websocket.service.ts` - единая точка HTTP и Socket.IO взаимодействия с backend.
- `src/app/styles` - общие SCSS-стили.

## Ключевые компоненты и сервисы

- `WebsocketService` держит подключение Socket.IO, подписки на события и HTTP-запрос `POST /nickname`.
- `NicknameComponent` сохраняет nickname в `localStorage`, проверяет его на backend и открывает socket-подключение.
- `HomeComponent` получает `refreshRooms`, отправляет `createLobby`, `deleteLobby`, `roomIn`.
- `LobbyComponent` получает `statusLobby`, отправляет `setReady`, `setSex`, `roomOut`.
- `MunchkinComponent` получает `refreshGame`, игровые логи и отправляет основные игровые действия.
- `CardComponent` и `PlayerComponent` отвечают за локальную UI-логику карт, экипировки и помощи.

## Запуск

```bash
npm install
npm run start
```

На Windows PowerShell при блокировке `npm.ps1` используйте:

```bash
npm.cmd install
npm.cmd run start
```

По умолчанию frontend запускается на `http://localhost:4200/` и ожидает backend:

- HTTP: `http://localhost:3000`
- Socket.IO: `http://localhost:3001`

## Основные функции

- Проверка nickname.
- Создание, удаление и просмотр комнат.
- Вход и выход из лобби.
- Выбор пола и готовность игрока.
- Переход в игру после готовности всех игроков.
- Отображение состояния игры, игроков, карт, боя и логов.
- Использование, сброс, продажа карт и запрос помощи в бою.

## Решения после рефакторинга

- Контрактные DTO и часть строковых статусов вынесены в `../shared/src`.
- `WebsocketService` получил типизацию входящих и исходящих Socket.IO payload.
- Локальные дубли интерфейсов комнат, лобби, карт и игрового состояния заменены на shared-типы.
- Компоненты очищены от части `any`, отладочных `console.log`, неиспользуемых импортов и тестового кода.
- Runtime-импорты shared-констант в backend пока не используются, чтобы не вводить риск с alias после сборки.

## Что улучшить позже

- Оформить `shared` как локальный npm-пакет и использовать общие runtime-константы событий.
- Постепенно исправить mojibake-строки отдельной задачей с проверкой контрактов.
- Разбить большой `MunchkinComponent` на контейнер состояния и более мелкие presentational-компоненты.
- Добавить guard для экранов, требующих socket-подключения.
- Покрыть критичные user-flow тестами.

