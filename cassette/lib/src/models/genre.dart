class Genre {
  String? _name;
  int _id;


  Genre(this._name, this._id);

  Genre.withId(this._id);

  String? getName() => _name;

  int getId() => _id;

  void setName(String name) => _name = name;
}