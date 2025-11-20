/*добавила файл с  функциями*/

const checkLength = (string = '', maxSymbols = 1) => string.length <= maxSymbols;

const isPalindrome = (string) => {
  string = string.replaceAll('', '').toLowerCase();
  let reversed = '';

  for (let i = string.length - 1; i >= 0; i--) {
    reversed += string[i];
  }

  return string === reversed;
};

checkLength();
isPalindrome();


