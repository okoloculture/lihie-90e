/**
 * Приём ответов формы «Лихие 90-е» в Google-таблицу + счётчик проголосовавших.
 *
 * Установка:
 *  1. Открой Google-таблицу → Расширения → Apps Script.
 *  2. Вставь весь этот код, сохрани.
 *  3. Развернуть → Новое развёртывание → тип «Веб-приложение».
 *       - Запуск от имени: Я
 *       - У кого есть доступ: Все (Anyone)
 *  4. Скопируй URL вида .../exec и вставь его в n.html (window.RSVP_ENDPOINT).
 *  После правок кода — каждый раз Развернуть → Управление развёртываниями → карандаш → Новая версия.
 */

const SHEET_NAME = 'Ответы';

function getSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow(['Время', 'Имя', 'Статус', 'Во сколько', 'Компания', 'С кем', 'Хит', 'Пожелание']);
  }
  return sheet;
}

function countRows(sheet) {
  return Math.max(0, sheet.getLastRow() - 1); // минус строка заголовка
}

function json(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function doGet(e) {
  const sheet = getSheet();
  return json({ count: countRows(sheet) });
}

function doPost(e) {
  const sheet = getSheet();
  let d = {};
  try {
    d = JSON.parse(e.postData.contents);
  } catch (err) {
    // тело пришло не JSON — просто пишем пустую строку
  }
  sheet.appendRow([
    new Date(),
    d.name || '',
    d.status || '',
    d.lateTime || '',
    d.company || '',
    d.guest || '',
    d.song || '',
    d.wish || '',
  ]);
  return json({ count: countRows(sheet) });
}
