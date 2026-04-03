import 'package:firebase_messaging/firebase_messaging.dart';
import '../../core/network/api_client.dart';

class NotificationService {
  final FirebaseMessaging _fcm = FirebaseMessaging.instance;
  final ApiClient apiClient;

  NotificationService({required this.apiClient});

  Future<void> init() async {
    NotificationSettings settings = await _fcm.requestPermission();

    if (settings.authorizationStatus == AuthorizationStatus.authorized) {
      String? token = await _fcm.getToken();
      if (token != null) {
        await apiClient.dio.put('/users/fcm-token', data: {'fcmToken': token});
      }
    }

    FirebaseMessaging.onMessage.listen((RemoteMessage message) {
      print("Foreground message: ${message.notification?.title}");
    });

    FirebaseMessaging.onMessageOpenedApp.listen((RemoteMessage message) {
      print("Notification tapped: ${message.data['matchId']}");
    });
  }

  Future<void> subscribeToMatch(String matchId) async {
    await _fcm.subscribeToTopic('match_$matchId');
  }
}
