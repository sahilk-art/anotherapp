import 'package:flutter/material.dart';
import 'dart:math' as math;

class WagonWheelPainter extends CustomPainter {
  final List<dynamic> shots;
  WagonWheelPainter(this.shots);

  @override
  void paint(Canvas canvas, Size size) {
    final center = Offset(size.width / 2, size.height / 2);
    final radius = size.width / 2;

    // Draw field boundary
    final paint = Paint()
      ..color = Colors.green[800]!
      ..style = PaintingStyle.fill;
    canvas.drawCircle(center, radius, paint);

    // Draw pitch
    final pitchPaint = Paint()..color = Colors.orange[200]!;
    canvas.drawRect(Rect.fromCenter(center: center, width: 20, height: 60), pitchPaint);

    // Draw shots
    for (var shot in shots) {
      final angle = (shot['shotAngle'] ?? 0) * (math.pi / 180);
      final distance = (shot['shotDistance'] ?? radius) * (radius / 100);
      final runs = shot['runs'] ?? 0;

      final endPoint = Offset(
        center.dx + distance * math.cos(angle - math.pi / 2),
        center.dy + distance * math.sin(angle - math.pi / 2),
      );

      final shotPaint = Paint()
        ..color = _getShotColor(runs)
        ..strokeWidth = 2;

      canvas.drawLine(center, endPoint, shotPaint);
    }
  }

  Color _getShotColor(int runs) {
    if (runs >= 6) return Colors.red;
    if (runs >= 4) return Colors.orange;
    if (runs >= 3) return Colors.blue;
    return Colors.white;
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => true;
}
