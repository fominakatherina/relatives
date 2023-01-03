async function startServer() {
  const express = require("express");
  const fs = require("fs");
  const app = express();
  const VK = require("./vk");
  const { usersSelect, getTables } = require("./db");
  const token = JSON.parse(fs.readFileSync("token.json")).token;

  app.use(express.static(`${__dirname}/public`));

  app.get("/get-saved-groups", async (req, res) => {
    const groups = await getTables();
    res.send(groups);
  });

  app.get("/get-group-members", async (req, res) => {
    const group = req.query.group;
    const members = await usersSelect(group);
    res.send(members);
  });

  app.get("/get-group-info", async (req, res) => {
    const group = req.query.group;
    const vk = new VK(token);
    const groupInfo = await vk.getGroupInfo(group);
    res.send(groupInfo);
  });

  app.listen(8080, () => {
    console.log("Сервер запущен по адресу:");
    console.log("\x1b[36m%s\x1b[0m", "http://localhost:8080");
  });
}

startServer();
