const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json()); // ✅ This line allows Express to parse JSON request bodies

const logos = [
    { id: 1, name: "Adidas", image: "https://cdn.britannica.com/94/193794-050-0FB7060D/Adidas-logo.jpg" },
    { id: 2, name: "Nike", image: "https://static.vecteezy.com/system/resources/thumbnails/020/336/375/small/nike-logo-nike-icon-free-free-vector.jpg" },
    { id: 3, name: "Apple", image: "https://substackcdn.com/image/fetch/f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F8ed3d547-94ff-48e1-9f20-8c14a7030a02_2000x2000.jpeg" },
    { id: 4, name: "Google", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/800px-Google_%22G%22_logo.svg.png" },
    { id: 5, name: "Microsoft", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Microsoft_logo.svg/1200px-Microsoft_logo.svg.png" },
    { id: 6, name: "Coca-Cola", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/Coca-Cola_logo.svg/800px-Coca-Cola_logo.svg.png" },
    { id: 7, name: "Pepsi", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/Pepsi_logo.svg/800px-Pepsi_logo.svg.png" },
    { id: 8, name: "Facebook", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/Facebook_f_logo_%282019%29.svg/768px-Facebook_f_logo_%282019%29.svg.png" },
    { id: 9, name: "Twitter", image: "https://upload.wikimedia.org/wikipedia/en/thumb/6/60/Twitter_Logo_as_of_2021.svg/768px-Twitter_Logo_as_of_2021.svg.png" },
    { id: 10, name: "Instagram", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Instagram_icon.png/1024px-Instagram_icon.png" },
    { id: 11, name: "Amazon", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Amazon_logo.svg/1024px-Amazon_logo.svg.png" },
    { id: 12, name: "YouTube", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/75/YouTube_social_white_squircle_%282017%29.svg/1200px-YouTube_social_white_squircle_%282017%29.svg.png" },
    { id: 13, name: "IBM",         image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/IBM_logo.svg/1200px-IBM_logo.svg.png" },
    { id: 14, name: "Intel",       image: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c9/Intel-logo.svg/1024px-Intel-logo.svg.png" },
    { id: 15, name: "Samsung",     image: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Samsung_Logo.svg/1200px-Samsung_Logo.svg.png" },
    { id: 16, name: "Toyota",      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9d/Toyota_logo.svg/1024px-Toyota_logo.svg.png" },
    { id: 17, name: "Honda",       image: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Honda-logo.svg/1024px-Honda-logo.svg.png" },
    { id: 18, name: "BMW",         image: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/BMW.svg/1024px-BMW.svg.png" },
    { id: 19, name: "Mercedes‑Benz", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/Mercedes-Logo.svg/1024px-Mercedes-Logo.svg.png" },
    { id: 20, name: "Sony",        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Sony_Logo.svg/1024px-Sony_Logo.svg.png" },
    { id: 21, name: "LG",          image: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/LG_logo_%282015%29.svg/1024px-LG_logo_%282015%29.svg.png" },
    { id: 22, name: "Panasonic",   image: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/Panasonic_logo.svg/1024px-Panasonic_logo.svg.png" },
    { id: 23, name: "Disney",      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Walt_Disney_Logo.svg/1024px-Walt_Disney_Logo.svg.png" },
    { id: 24, name: "Starbucks",   image: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/35/Starbucks_Corporation_Logo_2011.svg/1024px-Starbucks_Corporation_Logo_2011.svg.png" },
    { id: 25, name: "McDonald's",  image: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/McDonald%27s_Golden_Arches.svg/1024px-McDonald%27s_Golden_Arches.svg.png" },
    { id: 26, name: "Burger King", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Burger_King_2020_logo.svg/1024px-Burger_King_2020_logo.svg.png" },
    { id: 27, name: "Subway",      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a3/Subway_2016_logo.svg/1024px-Subway_2016_logo.svg.png" },
    { id: 28, name: "Shell",       image: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7f/Logo_Shell.svg/1024px-Logo_Shell.svg.png" },
    { id: 29, name: "Chevron",     image: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Chevron_logo.svg/1024px-Chevron_logo.svg.png" },
    { id: 30, name: "ExxonMobil",  image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Exxon_Mobil_Logo.svg/1024px-Exxon_Mobil_Logo.svg.png" },
    { id: 31, name: "FedEx",       image: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/FedEx_Express.svg/1024px-FedEx_Express.svg.png" },
    { id: 32, name: "UPS",         image: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/UPS_Logo_Shield_2017.svg/1024px-UPS_Logo_Shield_2017.svg.png" }
  ];
  
  
  
  
  
  
app.get('/api/logos', (req, res) => {
  res.json(logos);
});

const db = new sqlite3.Database("leaderboard.db", (err) => {
    if(err){
        console.error(err.message);
    }else{
        console.log("Connected to sqlite database");
        db.run("CREATE TABLE IF NOT EXISTS leaderboard (id INTEGER PRIMARY KEY, username VARCHAR(20), time INTEGER, score INTEGER, totalQuestions INTEGER)");
    }
});

app.post('/api/leaderboard', (req, res) => {
    const {username, time, score, totalQuestions} = req.body
    db.run(
        "INSERT INTO leaderboard (username, time, score, totalQuestions) VALUES (?, ?, ?, ?)",
        [username, time, score, totalQuestions],
        function (err) {
          if (err) {
            res.status(500).json({ error: err.message });
            return;
          }
          res.json({ message: "Leaderboard updated!", id: this.lastID });
        }
      );    
});

app.get('/api/leaderboard', (req, res) => {
    db.all("SELECT * FROM leaderboard ORDER BY score DESC", [], (err, rows) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json(rows);
    });
  });

  app.get('/api/leaderboard/:name', (req, res) => {
    db.all(`SELECT * FROM leaderboard WHERE username =  '${req.params.name}' ORDER BY score DESC`, [], (err, rows) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json(rows);
    });
  });
  
app.listen(5000, () => console.log('Server running on port 5000'));
