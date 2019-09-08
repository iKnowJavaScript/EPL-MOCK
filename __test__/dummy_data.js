exports.users = {
  user1: {
    name: 'Victor',
    email: 'remymartins@yahoo.com',
    password: '22222222',
    favoriteTeam: 'Arsenal'
  },
  user2: {
    name: 'Chika Iwobi',
    email: 'chika@yahoo.com',
    password: '22222222',
    favoriteTeam: 'Chelsea'
  },
  fakeUser: {
    name: 'Dauda Seyi',
    email: 'cyahoo.com',
    password: '22222222',
    favoriteTeam: 'Chelsea'
  },
  admin: {
    name: 'Admin One',
    email: 'admin01@yahoo.com',
    password: '22222222',
    favoriteTeam: 'Arsenal',
    isAdmin: true
  }
};

exports.teams = {
  team1: {
    name: 'Arsenal',
    coach: 'Unai Emery',
    stadium: 'Emirate Stadium',
    address: 'Emirate Stadium',
    stadiumCapacity: `2233`,
    founded: '1886'
  },
  team2: {
    name: 'Chelsea',
    coach: 'Frank Lampard',
    stadium: 'Stanford Bridge',
    founded: '1896',
    address: `Fulham Road SW6 1HS London`,
    stadiumCapacity: '41841'
  }
};

exports.makeFixture = function(home, away) {
  return {
    date: new Date().toLocaleDateString(),
    time: new Date().toLocaleTimeString(),
    home_team: home._id,
    away_team: away._id,
    stadium: 'San SIro',
    status: 'Pending',
    home: home.name,
    away: away.name
  };
};
