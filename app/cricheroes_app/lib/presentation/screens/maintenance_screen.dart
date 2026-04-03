import 'package:flutter/material.dart';

class MaintenanceScreen extends StatelessWidget {
  final String message;
  const MaintenanceScreen({super.key, required this.message});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Center(
        child: Padding(
          padding: const EdgeInsets.all(32.0),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const Icon(Icons.build_circle_outlined, size: 100, color: Colors.blue),
              const SizedBox(height: 24),
              const Text('Under Maintenance', style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold)),
              const SizedBox(height: 16),
              Text(message.isEmpty ? "We're upgrading our servers. Please check back later." : message, textAlign: TextAlign.center, style: const TextStyle(color: Colors.grey)),
            ],
          ),
        ),
      ),
    );
  }
}
