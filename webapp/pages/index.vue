<template>
  <div class="movies">
    <form @submit.prevent="searchMovies">
      <label for="search">Search:</label>
      <input type="text" id="search" v-model="search">
      <button type="submit">Search</button>
    </form>
    <div v-if="movies.length">
      <h2>Results:</h2>
      <ul>
        <li v-for="movie in movies" :key="movie.id" class="movie">
          <div class="image"><img v-bind:src="movie.poster_image_url"></div>
          <div class="title">{{ movie.title }}</div>
          <div class="popularity">{{ movie.popularity_summary }}</div>
        </li>
      </ul>
    </div>
    <div v-else>
      <h2></h2>
      <ul>
        <li v-for="i in 10" class="movie placeholder"></li>
      </ul>
    </div>
</div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      search: '',
      movies: [],
    };
  },
  methods: {
    async searchMovies() {
      try {
        const response = await axios.get('http://localhost:5000/movies', {
          params: {
            search: this.search,
          },
        });
        console.log(response);
        this.movies = response.data.results;
      } catch (error) {
        console.error(error);
        this.movies = [];
      }
    },
  },
};
</script>
