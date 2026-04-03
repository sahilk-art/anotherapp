import 'package:firebase_analytics/firebase_analytics.dart';

class AnalyticsService {
  final FirebaseAnalytics _analytics = FirebaseAnalytics.instance;

  Future<void> logMatchStarted(String matchId) async {
    await _analytics.logEvent(name: 'match_started', parameters: {'match_id': matchId});
  }

  Future<void> logBallRecorded(String matchId, int runs) async {
    await _analytics.logEvent(name: 'ball_recorded', parameters: {'match_id': matchId, 'runs': runs});
  }

  Future<void> logScreenView(String screenName) async {
    await _analytics.logEvent(name: 'screen_view', parameters: {'screen_name': screenName});
  }
}
