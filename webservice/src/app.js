const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');

require('dotenv').config();

const middlewares = require('./middlewares');
const api = require('./api');

const app = express();

app.use(morgan('dev'));
app.use(helmet());
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json([]);
});

app.get('/movies', (req, res) => {
  const querystring = require('querystring');
  const axios = require('axios');
  
  // due to time constraint, I am just going to put these here instead of in an environment variable for now
  const url = 'https://api.themoviedb.org/3/movie/550';
  const apiKey = '47eca5504579b4d2baca4adfdfee4d7c';
  const parameters = querystring.stringify({
    api_key: apiKey,
    query: req.query.search,
    include_adult: false,
  });
  const poster_path = 'https://image.tmdb.org/t/p/w500';

  // use axios to send out our query
  axios
    .get(url+'?'+parameters)
    .then(json => {
      let movies = [];
      for(let movie of json.data.results) {
        movies.push({
          movie_id: movie.id, 
          title: movie.title, 
          poster_image_url: poster_path + movie.poster_path,
          popularity_summary: `${movie.vote_average} out of ${movie.vote_count}`
        });
      }
      res.send(movies);
    })
    .catch(err => {
      res.send(err);
    });
});


app.use('/api/v1', api);

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

module.exports = app;
