const fns = require("date-fns");
const axios = require("./axiosConfig.js");
const { app, port } = require("./expressConfig.js");

//Main Route
app.get("/", function (req, res) {
  res.send({
    main: "Albion Middleware API",
    routes: [
      "/name/:id",
      "/id/:id",
      "/id/:id/kills",
      "/id/:id/deaths",
      "/event/:id",
    ],
  });
});

//Get Players By Name
app.get("/name/:name", async function (req, res) {
  try {
    const response = await axios.get(`search?q=${req.params.name}`);
    res.send(
      response.data.players.map((player) => {
        return {
          id: player.Id,
          name: player.Name,
          guild: player.GuildName,
          alliance: player.AllianceName,
          pvpFame: player.KillFame,
          ratio: player.FameRatio,
        };
      })
    );
  } catch (error) {
    console.log(error);
  }
});

//Get Player By Id
app.get("/id/:id", async function (req, res) {
  try {
    const response = await axios.get(`players/${req.params.id}`);
    res.send({
      id: response.data.Id,
      name: response.data.Name,
      guild: response.data.GuildName,
      alliance: response.data.AllianceName,
      pvpFame: response.data.KillFame,
      ratio: response.data.FameRatio,
      pveFame: response.data.LifetimeStatistics.PvE,
      gatheringFame: response.data.LifetimeStatistics.Gathering,
    });
  } catch (error) {
    res.sendStatus(error.response.status);
  }
});

//Get Player Kills By Id
app.get("/id/:id/kills", async function (req, res) {
  try {
    const response = await axios.get(`players/${req.params.id}/kills`);
    res.send(
      response.data.map((kill) => {
        return {
          eventId: kill.EventId,
          victmin: kill.Victim.Name,
          killFame: kill.TotalVictimKillFame,
          timestamp: fns.format(fns.parseISO(kill.TimeStamp), "dd/MMM/yyyy"),
        };
      })
    );
  } catch (error) {
    console.log(error);
  }
});

//Get Player Deaths By Id
app.get("/id/:id/deaths", async function (req, res) {
  try {
    const response = await axios.get(`players/${req.params.id}/deaths`);
    res.send(
      response.data.map((death) => {
        return {
          eventId: death.EventId,
          killer: death.Killer.Name,
          killFame: death.TotalVictimKillFame,
          timestamp: fns.format(fns.parseISO(death.TimeStamp), "dd/MMM/yyyy"),
        };
      })
    );
  } catch (error) {
    console.log(error);
  }
});

//Get Kill Details By Id
app.get("/event/:event", async function (req, res) {
  try {
    const response = await axios.get(`events/${req.params.event}/`);
    res.send({
      killerName: response.data.Killer.Name,
      killerEquipment: response.data.Killer.Equipment,
      killerIp: response.data.Killer.AverageItemPower,
      victimName: response.data.Victim.Name,
      victimEquipment: response.data.Victim.Equipment,
      victimIp: response.data.Victim.AverageItemPower,
      killFame: response.data.TotalVictimKillFame,
      timestamp: fns.format(
        fns.parseISO(response.data.TimeStamp),
        "dd/MMM/yyyy"
      ),
    });
  } catch (error) {
    console.log(error);
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
