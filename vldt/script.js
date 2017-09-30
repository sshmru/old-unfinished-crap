$(function() {
    $('form[vForm]').vldt('vForm', 2);
    $('input[name=imie], input[name=nazwisko]').vldt('vRexp', '^[A-ZĄĆĘŁŃÓŚŹŻ][a-ząćęłóńśźż]*$' );
    $('input[name=email]').vldt('vMail').css('background', '#DDD');
    $('input[name=telefon]').vldt('vRexp', '^[0-9]{1,3}$' );
    $('input[name=haslo]').vldt('vPass', 3);
    $('input[name=kod]').vldt('vHint',  kody, $('input[name=miasto]') );
});
