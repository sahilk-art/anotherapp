import 'package:flutter/material.dart';
import 'dart:math' as math;

class WagonWheelPainter extends CustomPainter {
  final List<dynamic> shots;
  WagonWheelPainter(this.shots);

  @override
  void paint(Canvas canvas, Size size) {
    final center = Offset(size.width / 2, size.height / 2);
    final radius = size.width / 2;

    // Background field
    final fieldPaint = Paint()
      ..color = const Color(0xFF2E7D32)
      ..style = PaintingStyle.fill;
    canvas.drawCircle(center, radius, fieldPaint);

    // Boundary line
    final boundaryPaint = Paint()
      ..color = Colors.white
      ..style = PaintingStyle.stroke
      ..strokeWidth = 2.0;
    canvas.drawCircle(center, radius - 5, boundaryPaint);

    // Pitch
    final pitchPaint = Paint()..color = const Color(0xFFFFCC80);
    canvas.drawRect(Rect.fromCenter(center: center, width: 15, height: 50), pitchPaint);

    // Shots
    for (var shot in shots) {
      final double angle = ((shot['shotAngle'] ?? 0).toDouble() - 90) * (math.pi / 180);
      final double distance = (shot['shotDistance'] ?? 100).toDouble() * (radius / 100);
      final int runs = shot['runs'] ?? 0;

      final endPoint = Offset(
        center.dx + distance * math.cos(angle),
        center.dy + distance * math.sin(angle),
      );

      final shotPaint = Paint()
        ..color = _getShotColor(runs)
        ..strokeWidth = 2.5
        ..strokeCap = StrokeCap.round;

      canvas.drawLine(center, endPoint, shotPaint);

      // Draw a small dot at the end
      canvas.drawCircle(endPoint, 3, shotPaint);
    }
  }

  Color _getShotColor(int runs) {
    if (runs >= 6) return Colors.redAccent;
    if (runs >= 4) return Colors.orangeAccent;
    if (runs >= 1) return Colors.blueAccent;
    return Colors.white70;
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => true;
}
