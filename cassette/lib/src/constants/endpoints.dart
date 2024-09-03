const TMDb_API_KEY = 'ed908945c78e78d58bd946ed84305325';

const TMDb_BEARER = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJlZDkwODk0NWM3OGU3OGQ1OGJkOTQ2ZWQ4NDMwNTMyNSIsIm5iZiI6MTcyMDUxOTEwMC41ODQ3NDEsInN1YiI6IjY2OGQwNTliMjA1MzM3NjQ4OTRhZWM5ZSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.XTNYa1sAlPL_0ahsJtnj6dRvKw3kwrQGhTBZWvyPXHM';

const TMDb_BASE_URL = 'https://api.themoviedb.org/3';

const TMDb_MOVIE_DETAILS_URL = '$TMDb_BASE_URL/movie/';

const TMDb_IMAGE_URL = 'http://image.tmdb.org/t/p/';

const TMDb_IMAGE_URL_SECURE = 'https://image.tmdb.org/t/p/';

const TMDb_SEARCH_MOVIE = '$TMDb_BASE_URL/search/movie';

enum BackdropSizes {
  w300,
  w780,
  w1280,
  original,
}

const BACKDROP_SIZES = {'w300', 'w780', 'w1280', 'original'};

String backdropSizeString(BackdropSizes size) {
  switch (size) {
    case BackdropSizes.w300:
      return BACKDROP_SIZES.elementAt(0);
    case BackdropSizes.w780:
      return BACKDROP_SIZES.elementAt(1);
    case BackdropSizes.w1280:
      return BACKDROP_SIZES.elementAt(2);
    default:
      return BACKDROP_SIZES.elementAt(3);
  }
}

String retrieveImageUrl(
    {required String imageId,
    BackdropSizes size = BackdropSizes.original,
    bool secure = true}) {

  if (secure) return TMDb_IMAGE_URL_SECURE + backdropSizeString(size) + imageId;

  return TMDb_IMAGE_URL + backdropSizeString(size) + imageId;
}

String getSearchMovieUrl({required String query, String? page = '1', String? language = 'en-US', bool? adult = false}) {
  return '$TMDb_SEARCH_MOVIE?query=$query&include_adult=${adult.toString()}&language=$language&page=$page';
}
