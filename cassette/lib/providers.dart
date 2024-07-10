import 'package:provider/provider.dart';

import 'src/providers/movies_provider.dart';
export 'src/providers/movies_provider.dart';

class Providers {
  Providers._();  static final providers= [
        ChangeNotifierProvider<MovieState>(
          create: (_) => MovieState(),
          ),
      ].toList();
}
