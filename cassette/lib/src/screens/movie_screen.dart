import 'package:flutter/material.dart';
import '../widgets/movie_widget.dart';
import '../../providers.dart';
import 'package:provider/provider.dart';
import '../services/service.dart';
import '../services/mappers/movies_mapper.dart';
import '../constants/endpoints.dart';

class MovieScreen extends StatelessWidget {
  const MovieScreen({super.key});

  @override
  Widget build(BuildContext context) {
    var movieState = context.watch<MovieState>();
    var movie = movieState.movie;

    if (movie == null) {
       return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text('No Movie'),
            ElevatedButton(onPressed: 
              () {
                makeHttpRequest(url: '${TMDb_MOVIE_DETAILS_URL}68726').then((response) {
                    movieState.setMovie(json2movie(response));
                  }).catchError((error) {
                    print('Error: $error');
                  });
              }
            , child: Text('Get Movie'),)
          ],
        ),
    );
    }

    return Column(
      children: [
        MovieWidget(movie: movie,),
      ],
    );
  }
}

