### Uzyte technologie

- node.js z dodatkami:
 - express.js
 - stylus - preprocesor css
 - jade - silnik szablonow
 - mongodb - sterownik bazy danych
- mongodb

### Jak odpalic

potrzeba zainstalowanego node.js i bazy mongodb na defaultowych ustawieniach
konsola do repozytorium i wpisujemy

```console
npm install //instaluje dodatki node
node app.js //startuje aplikacje
```

aplikacja dostępna na `http://localhost:3000/`

### Plan

1. node hostuje aplikację w postaci strony - gra w przeglądarce
2. silnik inicjalizuje grę, pobierając dane z bazy - baza to moze i przesada dla malej aplikacji ale myślmy przyszłościowo
3. gra toczy się na serwerze - nie udostępniamy logiki gry wścibskim userom
 - gracz uzywajac interfejsu wysyła zapytania ajaxowe do serwera
 - serwer przetwarza stan partii w oparciu o ruchy gracza i logikę gry - logikę można wymieniać, zmieniajac zasady gry
 - zmiany stanu wracają odpowiedziami ajax do gracza, updatując lokalny stan gry a na jego podstawie, interfejs 
1. w fazie roboczej przyda się interfejs bazy danych pozwalający wprowadzać nowe karty

### Co czym

- node routuje i przesyła zapytania
- ekrany gry w postaci szablonów jade opisanych stylusem
- komunikacja z baza natywnym sterownikiem mongodb
- po stronie klienta, zapytania i manipulacja widokiem przez jquery

### Co gdzie

- app.js - core aplikacji, zawiera ustawienia i routuje zapytania
- game.js - plik stanu i logiki gry(logikę warto by umieścić osobno)
- mydb.js - interfejs modyfikacji bazy danych
- szablony interfejsu w katalogu /views, ich skrypty i wygląd w katalogu /public

### Co już jest

1. interfejs bazy - możesz rozwijać aplikacje każąc babci wprowadzać dane kart
1. routing zapytań do funkcji odpowiedzi
1. generowanie szablonów na podstawie stanu gry
1. połączenie logiki aplikacji do bazy danych(podawanie kart użytkownikowi)
1. podstawy/przykłady funkcji logiki gry(start, oddaj turę, ..)
1. niektóre funkcje interfejsu aplikacji(przenoszenie kart na wolne pola)

### Do zrobienia
 w większości mrówcza praca, oparta o zmienianie obecnych już funkcji

- rozbudować interfejs i jego funkcje
- zaimplementować logikę gry
- wprowadzić dane kart(i listę funkcji przez poszczególne karty wywoływane)
- dodać opcje(niech sie user pobawi ustawieniami)
- wykończyć graficznie(ui jest poglądowe)
- wprowadzić mechanizm sesji(osobna gra dla każdego usera)

### Rozbudowa(ewentualna)

- zapisywanie stanu gry(potrzeba identyfikacji użytkowników - logowania)
- wersje multiplayer(najlepiej przejść z komunikacji ajax na websocket by )
