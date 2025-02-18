const express = require("express");
const bodyParser = require('body-parser');
const axios = require("axios");

/* INITIALIZE DATABASE */

//...

/* INITIALIZE SERVER */
const app = express();
const route = express.Router();
const port = process.env.PORT || 5001;


app.use(bodyParser.json()); // to parse the JSON in requests 
app.use(bodyParser.urlencoded({ extended: false })); // to parse URLs
app.use('/v1', route); // add the routes we make

app.listen(port, () => {    
  console.log(`Server listening on port ${port}`);
});

/* ACCESS DATABASE */

// ...

/* DATABASE ROUTES */

// ...

/* OLD ROUTES */
// static GET
route.get('/simple-get', (req, res) => {
  res.send("here");
});

// dynamic GET (response is based on data in request)
route.get('/dynamic-get', (req, res) => {
  res.send(req.body.inputString);
});

// external API
route.get('/pokemon/:name', async (req, res) => {
  const pokemonName = req.params.name.toLowerCase(); // we extract data from the request

  try {
    const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);
    
    // store data from the API response
    const pokemonData = {
      name: response.data.name,
      id: response.data.id,
      height: response.data.height,
      weight: response.data.weight,
    };

    res.json(pokemonData);
  } catch (error) {
    res.status(404).send({ error: "Pokémon not found!" });
  }
});

