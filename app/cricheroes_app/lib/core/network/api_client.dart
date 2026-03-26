import 'package:dio/dio.dart';
import 'package:shared_preferences/shared_preferences.dart';

class ApiClient {
  final Dio dio;
  final SharedPreferences sharedPreferences;

  ApiClient({required this.dio, required this.sharedPreferences}) {
    dio.options.baseUrl = 'http://10.0.2.2:3000/api/v1'; // Android emulator localhost
    dio.interceptors.add(InterceptorsWrapper(
      onRequest: (options, handler) {
        final token = sharedPreferences.getString('accessToken');
        if (token != null) {
          options.headers['Authorization'] = 'Bearer $token';
        }
        return handler.next(options);
      },
      onError: (DioException e, handler) async {
        if (e.response?.statusCode == 401) {
          // Token expired, attempt refresh
          final refreshToken = sharedPreferences.getString('refreshToken');
          if (refreshToken != null) {
            try {
              final response = await dio.post('/auth/refresh-token', data: {'refreshToken': refreshToken});
              final newToken = response.data['accessToken'];
              await sharedPreferences.setString('accessToken', newToken);

              // Retry the original request
              options.headers['Authorization'] = 'Bearer $newToken';
              final responseRetry = await dio.fetch(options);
              return handler.resolve(responseRetry);
            } catch (err) {
              // Refresh failed, logout
            }
          }
        }
        return handler.next(e);
      },
    ));
  }

  // Auth endpoints
  Future<Response> login(String phone, String otp) => dio.post('/auth/login', data: {'phone': phone, 'otp': otp});
  Future<Response> register(Map<String, dynamic> data) => dio.post('/auth/register', data: data);

  // User endpoints
  Future<Response> getUserProfile(String id) => dio.get('/users/$id');
  Future<Response> updateProfile(Map<String, dynamic> data) => dio.put('/users/profile', data: data);

  // Match endpoints
  Future<Response> getLiveMatches() => dio.get('/matches/live');
  Future<Response> getMatchDetails(String id) => dio.get('/matches/$id');

  // Team endpoints
  Future<Response> getMyTeams() => dio.get('/teams/my-teams');

  // Tournament endpoints
  Future<Response> getAllTournaments() => dio.get('/tournaments');

  // Feed endpoints
  Future<Response> getFeed() => dio.get('/feed');
}
