# FlavTam

Frontend + backend aplikace pro správu míst a kategorií.

## Technologie
- React
- Node.js
- Express.js

## Funkce aplikace
- CRUD kategorií
- CRUD míst
- Filtrování míst podle kategorií
- Detail místa
- Nahrávání obrázků

## Spuštění projektu

### Backend
```bash
cd server
npm install
npm start

Backend běží na:
http://localhost:8000

Frontend
cd client
npm install
npm start

Frontend běží typicky na:
http://localhost:3000

API Endpointy
Kategorie
POST /category/create
GET /category/list
GET /category/get/:id
POST /category/update
POST /category/delete
Místa
POST /place/create
GET /place/list
GET /place/get/:id
POST /place/update
POST /place/delete
