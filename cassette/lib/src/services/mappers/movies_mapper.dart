import '../../models/movie.dart';

Movie json2movie(Map<String, dynamic> json) {

  bool adult = json['adult'];
  String backgroudPath = json['backdrop_path'] ?? ' ';
  String posterPath = json['poster_path'] ?? ' ';
  String overview = json['overview'];
  List<Genre> genres = [];
  List<dynamic> jsonGenres = [];

  if (json['genres'] != null) {
    jsonGenres = json['genres'];
    for (var genre in jsonGenres) {
      genres.add(Genre(genre['name'], genre['id']));
    } 
  } else if (json['genre_ids'] != null) {
    jsonGenres = json['genre_ids'];
    for (var genre in jsonGenres) {
      genres.add(Genre(' ', genre));
    } 
  }

  int id = json['id'];
  String title = json['original_title'];
  double popularity = json['popularity'];
  String releaseDate = json['release_date'];
  int runtime = json['runtime'] ?? 0;
  String status = json['status'] ?? 'Unknown';
  String tagline = json['tagline'] ?? ' ';


  return Movie.all(id, title, overview, genres, adult, popularity, posterPath, backgroudPath, releaseDate, runtime, status, tagline);
}

List<Movie> json2listMovie(Map<String, dynamic> json) {
  List<Movie> movies = [];
  List<dynamic> jsonMovies = json['results'];

  for (var movie in jsonMovies) {
    movies.add(json2movie(movie));
  }

  return movies;
}