import 'package:flutter/material.dart';
import '../../providers.dart';
import 'package:provider/provider.dart';
import '../services/service.dart';
import '../services/mappers/movies_mapper.dart';
import '../constants/endpoints.dart';

class MovieDetailScreen extends StatelessWidget {
  const MovieDetailScreen({super.key});

  @override
  Widget build(BuildContext context) {
    var movieState = context.watch<MovieState>();

    var movie = movieState.movie;

    if (movie != null) {
      return Column(
        children: [
          Column(
            children: [
              Row(
                children: [
                  Image(
                    image: NetworkImage(retrieveImageUrl(
                        imageId: movie.getPosterPath(),
                        size: BackdropSizes.w300)),
                  ),
                ],
              ),
              Row(
                children: [
                  Card(
                    child: Text(
                      movie.getTitle(),
                    ),
                  ),
                ],
              )
            ],
          ),
          Column(
            children: [
              Row(
                children: [
                  Text(
                    movie.getOverview(),
                  ),
                ],
              )
            ],
          ),
        ],
      );
    } else {
      return Center(
        child: Column(
          children: [
            ElevatedButton(
              onPressed: () {
                makeHttpRequest(
                        url:
                            '${TMDb_MOVIE_DETAILS_URL}68726?api_key=$TMDb_API_KEY')
                    .then((response) {
                  movieState.setMovie(json2movie(response));
                }).catchError((error) {
                  print('Error: $error');
                });
              },
              child: Text('Get Movie'),
            ),
          ],
        ),
      );
    }
  }
}
