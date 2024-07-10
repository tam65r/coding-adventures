import 'package:dio/dio.dart';
import 'dart:convert';
import '../constants/endpoints.dart';


Future<Map<String, dynamic>> makeHttpRequest({required String url, String method = 'GET', Map<String, String>? headers, int statusCode = 200,  var body}) async {
  url += '?api_key=$TMDb_API_KEY';
  
  headers ??= {
    'Content-Type': 'application/json',
  };

  try {
    var dio = Dio();

    var response = await dio.request(
      url,
      options: Options(
        method: method,
        headers: headers,
      ),
    );

      if (response.statusCode == statusCode) {
        return response.data;  
    } else {
      throw Exception('Failed to load data: ${response.statusMessage}');
    }
  } catch (e) {
    print('An error has occured when trying to the an HTTP Request: $e');
    rethrow;
  }
} 