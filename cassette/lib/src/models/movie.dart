import 'genre.dart';
export 'genre.dart';

import '../constants/endpoints.dart';


class Movie {
  int _id;
  String _title;
  String _overview;
  List<Genre> _genres;
  bool _adult;
  double _popularity;
  String _posterPath;
  String _backgroudPath;
  String _releaseDate;
  int? _runtime;
  String? _status;
  String? _tagline;



  Movie.all(this._id, this._title, this._overview, this._genres, this._adult, this._popularity, this._posterPath, this._backgroudPath, this._releaseDate, this._runtime, this._status, this._tagline);


  String getPosterPath() => _posterPath;

  String getBackgroundPath() => _backgroudPath;

  String getTitle() => _title;

  int? getRuntime() => _runtime;

  String getRealeaseDate() => _releaseDate;

  String getOverview() => _overview;

  List<Genre> getGenres() => _genres;
}