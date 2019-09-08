const Team = require('../api/models/Team.model');
const Fixture = require('../api/models/Fixture.model');
const teams = require('./teams');

const allSavedTeams = [];

async function createTeams() {
  await Team.deleteMany().exec();
  await Fixture.deleteMany().exec();
  const addedTeams = await teams.reduce(async (acc, team) => {
    acc = await acc;
    try {
      team = await new Team(team);
      await team.save();
      allSavedTeams.push(team);
    } catch (err) {
      console.log(err);
    }
    acc[team._id] ? acc[team._id] : (acc[team._id] = team);
    return acc;
  }, {});
  return addedTeams;
}

async function createFixture(home_team, teams) {
  await [...teams].reduce(async (acc, away_team, index) => {
    acc = await acc;
    if (home_team.name === away_team.name) return acc;
    const possibleScore = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    let score;
    if (index < 10) {
      score = `${generateRandom(possibleScore)} - ${generateRandom(possibleScore)}`;
    }
    const formatedFixture = formatFixture(home_team, away_team, score, index);
    const save = await Fixture.create(formatedFixture);
    await save.save();
    console.log(save);
    return acc;
  }, {});
}

function formatFixture(home, away, score, index) {
  const time = ['12:00:00', '13:00:00', '14:00:00', '16:00:00', '18:00:00'];
  const randomTime = generateRandom(time);
  const date = handleDate(index);

  return {
    date: date,
    time: randomTime,
    home_team: home._id,
    away_team: away._id,
    stadium: home.stadium,
    status: score ? 'Completed' : 'Pending',
    home: home.name,
    away: away.name,
    result: score ? score : '-'
  };
}

function handleDate(index) {
  const increment = 604800000; // complete 7 days
  let startDate = new Date('09/08/2019').getTime(); // in seconds
  return new Date(startDate + increment * index).toLocaleDateString();
}

module.exports = async function generatorWithFixture() {
  await createTeams(teams);
  for (let index = 0; index < allSavedTeams.length; index++) {
    const team = allSavedTeams[index];
    await createFixture(team, allSavedTeams);
  }
};

function generateRandom(arr) {
  const random = Math.floor(Math.random() * Math.floor(arr.length));
  return arr[random];
}
