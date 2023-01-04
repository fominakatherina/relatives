const VK = require("./vk");
const fs = require("fs");
const { usersInsert, createTable, dropTable, cutTable } = require("./db");

async function saveMembers(groupId, members) {
  for (let i = 0; i < members.length; i++) {
    let member = members[i];
    await usersInsert(groupId, member);
  }
}

async function getMembers(groupId, offset = 0) {
  const token = JSON.parse(fs.readFileSync("token.json")).token;

  const vk = new VK(token);
  let membersBunch;
  try {
    membersBunch = await vk.getMembers(groupId, 0);
  } catch (e) {
    console.log(`Неизвестная ошибка, проверьте интернет соединение`);
    return;
  }

  if (membersBunch.error) {
    console.log("Неверный токен, обновите токен командой node token");
    return;
  }

  if (offset != 0) {
    await cutTable(groupId, offset);
  } else {
    await dropTable(groupId);
    await createTable(groupId);
  }

  let currentOffset = +offset;
  const totalCount = membersBunch.response.count;

  console.log(`Начало загрузки с отступом ${offset}`);

  while (membersBunch.response.items.length != 0) {
    try {
      membersBunch = await vk.getMembers(groupId, currentOffset);

      if (membersBunch.error) {
        console.log(
          `Ошибка загрузки, для продолжения загрузки пропишите коману: node get-users ${groupId} ${currentOffset}`
        );
        return;
      }

      membersBunch.response.items.forEach((member) => {
        member.first_name = member.first_name.replaceAll("'", "");
        member.last_name = member.last_name.replaceAll("'", "");
      });

      await saveMembers(groupId, membersBunch.response.items);

      currentOffset += membersBunch.response.items.length;
      console.log(`Загружено: ${currentOffset} / ${totalCount}`);
    } catch (e) {
      console.log(
        `Неизвестная ошибка, для продолжения загрузки пропишите коману: node get-users ${groupId} ${currentOffset}`
      );
      return;
    }
  }

  console.log("Готово");
}

if (process.argv[2]) {
  if (process.argv[3]) {
    getMembers(process.argv[2], process.argv[3]);
  } else {
    getMembers(process.argv[2]);
  }
} else {
  console.log("Укажите id группы");
  process.exit();
}
