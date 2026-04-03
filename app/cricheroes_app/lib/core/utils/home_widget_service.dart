import 'package:home_widget/home_widget.dart';
import 'package:path_provider/path_provider.dart';

class HomeWidgetService {
  static const String appGroupId = 'group.com.cricheroes.clone';
  static const String widgetName = 'LiveMatchWidget';
  static const String androidWidgetName = 'LiveMatchWidgetProvider';

  static Future<void> updateWidget({
    required String matchTitle,
    required String scoreA,
    required String scoreB,
    required String status,
  }) async {
    try {
      await HomeWidget.saveWidgetData<String>('matchTitle', matchTitle);
      await HomeWidget.saveWidgetData<String>('scoreA', scoreA);
      await HomeWidget.saveWidgetData<String>('scoreB', scoreB);
      await HomeWidget.saveWidgetData<String>('status', status);

      await HomeWidget.updateWidget(
        name: androidWidgetName,
        iOSName: widgetName,
      );
    } catch (e) {
      debugPrint('Error updating home widget: $e');
    }
  }

  static Future<void> initialize() async {
    await HomeWidget.setAppGroupId(appGroupId);
  }
}

void debugPrint(String s) {}
