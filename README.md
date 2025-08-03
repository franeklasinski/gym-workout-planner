# Gym Workout Planner

Kompleksowa aplikacja webowa do planowania i śledzenia treningów siłowniowych z kalendarzem, checklistą i monitoringiem postępów.

![Gym Workout Planner](https://img.shields.io/badge/Status-Active-success)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)

## Funkcje

### Planowanie Treningów
- **Dodawanie ćwiczeń** z podziałem na partie mięśniowe
- **Serie, powtórzenia i ciężary** - pełna kontrola nad treningiem
- **Automatyczne grupowanie** ćwiczeń według partii mięśniowych
- **Szacowany czas treningu** na podstawie liczby ćwiczeń

### Plan Tygodniowy & Kalendarz
- **Interaktywny kalendarz** z wizualizacją treningów
- **Przeciągnij i upuść** - łatwe przypisywanie treningów do dni
- **Oznaczanie ukończonych treningów** - śledzenie postępów
- **Historia treningów** - przegląd wykonanych sesji

### System Checklisty
- **Dzienne zadania** - nawyki treningowe do odznaczania
- **Własne zadania** - dodawanie personalnych celów
- **Automatyczne resetowanie** - świeże listy każdego dnia
- **Motywacyjne emoji** - wizualne nagrody za postępy

### Statystyki & Monitoring Ciała
- **Kalkulator BMI** z kategoryzacją zdrowotną
- **Śledzenie wagi** z interaktywnymi wykresami
- **Cele wagowe** z paskiem postępu
- **Historia pomiarów** - długoterminowe śledzenie zmian
- **Statystyki treningów** - analiza aktywności

### Nowoczesny Design
- **Responsywny interfejs** - działa na wszystkich urządzeniach
- **Dynamiczne tła** - różne obrazy dla każdej zakładki
- **Glassmorphism** - nowoczesne efekty wizualne
- **Animacje** - płynne przejścia i hover efekty

<img width="1469" height="922" alt="Zrzut ekranu 2025-08-3 o 11 00 09" src="https://github.com/user-attachments/assets/40941df9-bc2c-4fd7-994e-05e1aabc4832" />

<img width="1470" height="598" alt="Zrzut ekranu 2025-08-3 o 11 00 35" src="https://github.com/user-attachments/assets/aa685e98-d2c1-45b6-ae65-a23451679585" />

<img width="1470" height="866" alt="Zrzut ekranu 2025-08-3 o 11 00 54" src="https://github.com/user-attachments/assets/84c19c44-8140-4a7b-b535-4646f5c92da2" />

<img width="1470" height="872" alt="Zrzut ekranu 2025-08-3 o 11 01 08" src="https://github.com/user-attachments/assets/b9c01260-34e9-4287-8fae-92e31c408e81" />

<img width="1470" height="864" alt="Zrzut ekranu 2025-08-3 o 11 01 21" src="https://github.com/user-attachments/assets/e6d1f4c9-108f-4d04-86c0-91f1fec4b764" />

<img width="1470" height="705" alt="Zrzut ekranu 2025-08-3 o 11 01 43" src="https://github.com/user-attachments/assets/c24c8034-1ede-4f84-be7c-e0d2accb4525" />

<img width="1470" height="870" alt="Zrzut ekranu 2025-08-3 o 11 01 51" src="https://github.com/user-attachments/assets/1a9235b6-8b57-45e6-bcf4-0a2417dea750" />

<img width="1470" height="647" alt="Zrzut ekranu 2025-08-3 o 11 01 57" src="https://github.com/user-attachments/assets/ba75ff5a-1ed2-4792-b27b-849acb212651" />

## Instalacja i Uruchomienie

### Wymagania
- Python 3.x (do serwera lokalnego)
- Nowoczesna przeglądarka internetowa

### Szybki Start

1. **Sklonuj repozytorium**
```bash
git clone https://github.com/frneklasinski/gym-workout-planner.git
cd gym-workout-planner
```

2. **Uruchom serwer lokalny**
```bash
python -m http.server 8080
```

3. **Otwórz w przeglądarce**
```
http://localhost:8080
```


## Struktura Projektu

```
gym-workout-planner/
├── index.html          # Główna struktura aplikacji
├── style.css           # Stylowanie i responsywność
├── script.js           # Logika aplikacji i funkcjonalności
├── simple-tabs.js      # System zakładek
├── images/             # Grafiki tła
│   ├── gym-workout.jpg
│   ├── gym-calendar.jpg
│   └── gym-stats.jpg
└── README.md          # Dokumentacja
```

## Przechowywanie Danych

Aplikacja wykorzystuje **localStorage** przeglądarki do przechowywania:
- Treningów i ćwiczeń
- Planów tygodniowych
- Pomiarów ciała i celów
- Ustawień użytkownika

*Dane są przechowywane lokalnie - nie są wysyłane na żaden serwer.*

## Planowane Funkcje

- [ ] Export danych do PDF/CSV
- [ ] Więcej typów wykresów statystycznych
- [ ] Biblioteka gotowych planów treningowych
- [ ] Timer odpoczynku między seriami
- [ ] Prognozy i rekomendacje AI
- [ ] Synchronizacja z aplikacjami fitness

## Technologie

- **Frontend**: HTML5, CSS3, JavaScript ES6
- **Styling**: CSS Grid, Flexbox, Glassmorphism
- **Dane**: localStorage API
- **Wykresy**: Canvas API
- **Serwer**: Python HTTP Server (development)

## Kontakt

- **Autor**: Franciszek Łasiński 
- **Email**: fralas000@pbs.edu.pl
- **GitHub**: https://github.com/franeklasinski

---

<div align="center">

**⭐ Jeśli podoba Ci się ten projekt, zostaw gwiazdkę! ⭐**

*Zbudowane z 💪 dla społeczności fitness*

*Projekt zrobiony z pomocą Github Copilot*

</div>
