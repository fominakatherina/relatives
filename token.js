const fs = require("fs");

console.log("Для получения токена перейдите по ссылке: ");
console.log(
  "\x1b[36m%s\x1b[0m",
  "https://oauth.vk.com/authorize?client_id=51514376&display=page&scope=groups&response_type=token&v=5.131"
);
console.log("Разрешите доступ приложению");

const readline = require("readline").createInterface({
  input: process.stdin,
  output: process.stdout,
});

readline.question(
  "После разрешения доступа произойдет перенаправление на страницу с токеном, токен хранится в адресной строке, скопируйте ссылку из адресной строки и вставьте сюда: ",
  (url) => {
    if (url.split("#")[1]) {
      let token = url.split("#")[1];
      token = token.split("&");
      token = token.find((part) => part.includes("token"));
      token = token.split("=")[1];
      console.clear();
      console.log("Токен успешно сохранен");

      fs.writeFileSync("token.json", JSON.stringify({ token }));

      readline.close();
    } else {
      console.log("Неверный формат токена");
      readline.close();
    }
  }
);
