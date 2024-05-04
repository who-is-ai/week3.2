const addGameController = async (req, res) => {
    // Читаем список игр из файла
    const games = await readData("./data/games.json");
    if (!games) {
        res.status(400);
        res.send({
        status: "error",
        message: "Нет игр в базе данных. Добавьте игру.",
        });
        return;
    }
    req.games = games;
    // Проверяем, есть ли уже в списке игра с таким же названием
    req.isNew = !Boolean(req.games.find(item => item.title === req.body.title));
    // Если игра, которую хотим добавить, новая (её не было в списке)
    if (req.isNew) {
        // Добавляем объект с данными о новой игре
        const inArray = req.games.map(item => Number(item.id));
        let maximalId;
        if (inArray.length > 0) {
          maximalId = Math.max(...inArray);
        } else {
          maximalId = 0;
        }
        req.updatedObject = {
          id: maximalId + 1,
          title: req.body.title,
          image: req.body.image,
          link: req.body.link,
          description: req.body.description
        };
        // Добавляем данные о новой игре в список с другими играми
        req.games = [...req.games, req.updatedObject];
    } else {
        res.status(400);
        res.send({ status: "error", message: "Игра с таким именем уже есть." });
        return
    }
    // Записываем обновлённый список игр в файл
    await writeData("./data/games.json", req.games);
    // В качестве ответа отправляем объект с двумя полями
    res.send({
        games: req.games, // Обновлённый список со всеми играми
        updated: req.updatedObject // Новая добавленная игра
    });
} 

const sendAllGames = (req, res) => {
  res.send(req.games);
};

const sendUpdatedGames = (req, res) => {
  res.send({
    games: req.games,
    updated: req.updatedObject
  });
};

module.exports = { sendAllGames, sendUpdatedGames };
