import 'package:flutter/material.dart';
import '../models/movie.dart';
import '../constants/endpoints.dart';

class MovieWidget extends StatelessWidget {
  final Movie movie;

  const MovieWidget({
    super.key,
    required this.movie,
  });

  @override
  Widget build(BuildContext context) {


    //if (movie.getPosterPath() == ' ') {
    //  return Image(
    //    image: AssetImage('assets/dragon.png'),
    //  );
    //}

    return Image(
      image: NetworkImage(retrieveImageUrl(
          imageId: movie.getPosterPath(), size: BackdropSizes.w300)),
    );
  }
}
