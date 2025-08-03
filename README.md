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
