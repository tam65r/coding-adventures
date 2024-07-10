import '../../models/movie.dart';

Movie json2movie(Map<String, dynamic> json) {

  bool adult = json['adult'];
  String backgroudPath = json['backdrop_path'];
  String posterPath = json['poster_path'];
  String overview = json['overview'];

  List<dynamic> jsonGenres = json['genres'];
  List<Genre> genres = [];

  for (var genre in jsonGenres) {
    genres.add(Genre(genre['name'], genre['id']));
  } 

  int id = json['id'];
  String title = json['original_title'];
  double popularity = json['popularity'];
  String releaseDate = json['release_date'];
  int runtime = json['runtime'];
  String status = json['status'];
  String tagline = json['tagline'];


  return Movie.all(id, title, overview, genres, adult, popularity, posterPath, backgroudPath, releaseDate, runtime, status, tagline);
}