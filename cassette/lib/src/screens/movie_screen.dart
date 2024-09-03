import 'dart:async';

import 'package:flutter/material.dart';
import '../widgets/movie_widget.dart';
import '../../providers.dart';
import 'package:provider/provider.dart';
import '../services/service.dart';
import '../services/mappers/movies_mapper.dart';
import '../widgets/search_bar.dart';
import '../models/movie.dart';

class MovieScreen extends StatelessWidget {
  const MovieScreen({super.key});

  @override
  Widget build(BuildContext context) {
    var movieState = context.watch<MovieState>();

    var movies = movieState.movies;
    var query = movieState.query;
    var page = movieState.page;

    Future<List<Movie>> retrieveMovies(String searchTerm, String pageString) async {
      List<Movie> pageMovies = [];
      try {
        final response = await makeHttpRequest(url: 'https://api.themoviedb.org/3/search/movie?query=$searchTerm&include_adult=false&language=en-US&page=$pageString&api_key=ed908945c78e78d58bd946ed84305325');
        pageMovies = json2listMovie(response);

        if (page == 0) {
          movieState.setMaxPages(response['total_pages']);
        }
      } catch (error) {
        print('Error fetching movies: $error');
      }
      return pageMovies;
    }

    void getMovies(String searchTerm) async {
      movieState.setQuery(searchTerm);
      String filteredSearchTerm = searchTerm.replaceAll(" ", "+");
      List<Movie> pageMovies = await retrieveMovies(filteredSearchTerm, '1');

      if (page != 0) {
        for (int i = 2; i < page; i++){
            pageMovies.addAll( await retrieveMovies(filteredSearchTerm, i.toString()));
        }
        movieState.resetPage();
      } 

      movieState.setMovies(pageMovies);

    }

    if (movies != null) {
      return Column(
        children: [
          SizedBox(
            height: 5,
          ),
          Center(
            child: Row(
              children: [
                SearchBarWidget(
                  onPressed: getMovies,
                ),
              ],
            ),
          ),
          Center(
            child: Row(
              children: [
                Padding(
                  padding: const EdgeInsets.all(20),
                  child: Text('${movies.length} results for $query...'),
                ),
              ],
            ),
          ),
          Expanded(
            child: Center(
              child: Row(
                children: [
                  Expanded(
                    child: GridView.builder(
                      gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
                        crossAxisCount: 6,
                        crossAxisSpacing: 0,
                        mainAxisSpacing: 15,
                      ),
                      itemCount: movies.length,
                      itemBuilder: (context, index) {
                        return MovieWidget(movie: movies[index]);
                      },
                    ),
                  ),
                ],
              ),
            ),
          )
        ],
      );
    }

    return Column(
      mainAxisAlignment: MainAxisAlignment.start,
      children: [
        SizedBox(
          height: 5,
        ),
        Center(
          child: Row(
            children: [
              SearchBarWidget(
                onPressed: getMovies,
              ),
            ],
          ),
        ),
      ],
    );
  }
}
