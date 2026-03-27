import 'package:flutter/material.dart';
import 'package:share_plus/share_plus.dart';

class ScorecardShareService {
  static void shareSummary(dynamic match) {
    final text = '🏏 Match Result: ${match.teamA} vs ${match.teamB}\n'
        'Score: ${match.scoreA} vs ${match.scoreB}\n'
        'Result: ${match.result}\n'
        'Check full scorecard on CricHeroes app!';
    Share.share(text);
  }

  // RepaintBoundary approach would go here in a UI widget
}
