import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../models/movie.dart';

class MovieState extends ChangeNotifier {
  List<Movie>? movies;
  Movie? movie;

  void setMovies(List<Movie> movies) {
    this.movies = movies;
    notifyListeners();
  }

  void setMovie(Movie movie) {
    this.movie = movie;
    notifyListeners();
  }
}