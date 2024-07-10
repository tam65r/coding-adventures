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
    final theme = Theme.of(context);
    final style = theme.textTheme.displayMedium!.copyWith(
      color: theme.colorScheme.onPrimary,
    );
    return Card(
      color: theme.colorScheme.primary,
      child: Column(
        children: [
          Image(
              image: NetworkImage(retrieveImageUrl(
                  imageId: movie.getPosterPath(), size: BackdropSizes.w300))),

          Text(
            movie.getTitle(),
            style: style,
          ),
        ],
      ),
    );
  }
}
