import 'package:flutter/material.dart';
import '../models/movie.dart';

class MovieState extends ChangeNotifier {
  List<Movie>? movies;
  Movie? movie;
  String? query;
  int page = 0;

  void setMovies(List<Movie> movies) {
    this.movies = movies;
    notifyListeners();
  }

  void setMovie(Movie movie) {
    this.movie = movie;
    notifyListeners();
  }

  void setQuery(String query) {
    this.query = query;
    notifyListeners();
  }

  void setMaxPages(int page) {
      this.page = page;
      notifyListeners();
  }

  void resetPage() {
    page = 0;
    notifyListeners();
  }
}