const TMDb_API_KEY = '';

const TMDb_BASE_URL = 'https://api.themoviedb.org/3';

const TMDb_MOVIE_DETAILS_URL = '$TMDb_BASE_URL/movie/';

const TMDb_IMAGE_URL = 'http://image.tmdb.org/t/p/';

const TMDb_IMAGE_URL_SECURE = 'https://image.tmdb.org/t/p/';

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
