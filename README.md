# Соня и [Имя] — сайт-воспоминание с Firebase

Готовый статический сайт для GitHub Pages: все данные (кроме файлов фото) хранятся в Firebase Firestore и синхронизируются между устройствами.

## Что внутри

- `index.html` — главная (hero, случайное воспоминание, ближайшее событие)
- `travels.html` — страны
- `country.html?id=<docId>` — отдельная страна с галереей Polaroid и lightbox
- `dates.html` — важные даты
- `wall.html` — стена мыслей в realtime
- `capsule.html` — секретная капсула по паролю
- `map.html` — карта стран на Leaflet
- `mood.html` — график настроения (Chart.js + Firestore)
- `assets/js/firebase-config.js` — место для вашего Firebase-конфига

## Быстрый запуск

1. Скопируйте репозиторий.
2. Создайте проект Firebase.
3. Включите Firestore Database.
4. Вставьте конфиг в `assets/js/firebase-config.js`.
5. Запушьте на GitHub Pages.

## Подробная настройка Firebase

### 1) Создание проекта

- Откройте [Firebase Console](https://console.firebase.google.com/)
- Нажмите **Create project**
- Добавьте Web App (иконка `</>`)

### 2) Включить Firestore

- В левом меню: **Build → Firestore Database**
- Нажмите **Create database**
- Для старта можно **Test mode** (потом ужесточить правила)

### 3) Получить конфиг

В Project Settings → General → Your Apps → SDK setup and configuration, скопируйте объект `firebaseConfig` и вставьте в:

- `assets/js/firebase-config.js`

### 4) Создать коллекции

Создайте коллекции и документы:

#### `countries`

```json
{
  "name": "Италия",
  "year": 2023,
  "coverImage": "assets/images/italy/cover.jpg",
  "images": ["assets/images/italy/1.jpg", "assets/images/italy/2.jpg"],
  "story": "Наша первая поездка к морю.",
  "lat": 41.9028,
  "lng": 12.4964
}
```

#### `dates`

```json
{
  "title": "Годовщина",
  "date": "2027-02-14",
  "type": "future"
}
```

#### `messages`

```json
{
  "name": "Соня",
  "text": "Люблю тебя!",
  "timestamp": "(Firestore timestamp)"
}
```

#### `memories`

```json
{
  "photo": "assets/images/france/1.jpg",
  "text": "Наш вечер в Париже"
}
```

#### `mood` (опционально)

```json
{
  "score": 5,
  "timestamp": "(Firestore timestamp)"
}
```

#### `settings` (опционально)

Документ `relationship`:

```json
{
  "startDate": "2022-02-14"
}
```

## Как добавлять контент

### Новая страна

1. Загрузите фото в `assets/images/название_страны/`
2. Добавьте документ в `countries`.
3. Укажите `coverImage`, массив `images`, `lat`/`lng`.

### Новое воспоминание

Добавьте документ в коллекцию `memories` через консоль Firebase.

### Новая важная дата

Добавьте документ в `dates` с полем `date` в формате `YYYY-MM-DD`.

## Деплой на GitHub Pages

1. Залейте проект в GitHub репозиторий.
2. Откройте Settings → Pages.
3. Source: Deploy from branch (обычно `main`, папка `/root`).
4. Подождите публикации и откройте ссылку.

## Примечание по безопасности

Для демо можно открытые правила Firestore, но для реального сайта лучше добавить Firebase Auth и ограничения по пользователям.
