import 'package:url_launcher/url_launcher.dart';
import 'package:add_2_calendar/add_2_calendar.dart';
import 'package:flutter_contacts/flutter_contacts.dart';
import 'package:share_plus/share_plus.dart';

class ExternalServiceUtils {
  static Future<void> shareOnWhatsApp(String message) async {
    final encodedMessage = Uri.encodeComponent(message);
    final url = Uri.parse('https://wa.me/?text=$encodedMessage');
    if (await canLaunchUrl(url)) {
      await launchUrl(url);
    }
  }

  static Future<void> shareMatchScore({
    required String teamA,
    required String teamB,
    required String scoreA,
    required String scoreB,
    required String result,
    required String matchId,
  }) async {
    final message = "🏏 *$teamA vs $teamB*\n\n"
        "*$teamA:* $scoreA\n"
        "*$teamB:* $scoreB\n\n"
        "*$result*\n\n"
        "📊 Full Scorecard: https://cricheroes.com/match/$matchId\n\n"
        "Scored on CricHeroes App";
    await shareOnWhatsApp(message);
  }

  static Future<void> addToCalendar({
    required String title,
    required String venue,
    required DateTime startTime,
    required String matchId,
  }) async {
    final Event event = Event(
      title: title,
      description: 'Match on CricHeroes. Open: cricheroes://match/$matchId',
      location: venue,
      startDate: startTime,
      endDate: startTime.add(const Duration(hours: 4)),
      allDay: false,
    );
    await Add2Calendar.addEvent2Cal(event);
  }

  static Future<List<Contact>> getContacts() async {
    if (await FlutterContacts.requestPermission()) {
      return await FlutterContacts.getContacts(withProperties: true, withPhoto: true);
    }
    return [];
  }

  static Future<void> inviteViaSms(String phone, String name) async {
    final message = "Hey $name! Join my cricket team on CricHeroes! 🏏\n"
        "Download here: https://cricheroes.com/download";
    final url = Uri.parse('sms:$phone?body=${Uri.encodeComponent(message)}');
    if (await canLaunchUrl(url)) {
      await launchUrl(url);
    }
  }
}
