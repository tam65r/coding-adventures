import 'package:flutter/material.dart';

class SearchBarWidget extends StatelessWidget {
  final TextEditingController _controller = TextEditingController();
  final Function(String query) onPressed;

  SearchBarWidget({
    super.key,
    required this.onPressed,
  });

  void _clearTextField() {
    _controller.clear();
  }

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: 500,
      child: TextField(
        controller: _controller,
        autofocus: true,
        decoration: InputDecoration(
          border: OutlineInputBorder(borderRadius: BorderRadius.all(Radius.circular(24.0)),),
          hintText: 'Movie name ...',
          prefixIcon: Icon(Icons.search),
          suffixIcon: _controller.text.isNotEmpty
              ? IconButton(
                  icon: Icon(Icons.clear),
                  onPressed: _clearTextField,
                )
              : null,
        ),
        onChanged: (text) {
         
        },
        onSubmitted: (text) {
          onPressed(text);
        },
      ),
    );
  }
}