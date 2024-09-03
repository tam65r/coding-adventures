import 'package:dio/dio.dart';
import '../constants/endpoints.dart';


Future<Map<String, dynamic>> makeHttpRequest({required String url, String method = 'GET', int statusCode = 200,  var body}) async {
  //url += '?api_key=$TMDb_API_KEY';
  print(url);
  var headers = {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer $TMDb_BASE_URL'
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