import 'package:flutter/material.dart';
import 'package:url_launcher/url_launcher.dart';

class ForceUpdateScreen extends StatelessWidget {
  final String updateUrl;
  const ForceUpdateScreen({super.key, required this.updateUrl});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Center(
        child: Padding(
          padding: const EdgeInsets.all(32.0),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const Icon(Icons.system_update_alt, size: 100, color: Colors.blue),
              const SizedBox(height: 24),
              const Text('Update Required', style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold)),
              const SizedBox(height: 16),
              const Text("A new version of CricHeroes is available with important updates.", textAlign: TextAlign.center, style: TextStyle(color: Colors.grey)),
              const SizedBox(height: 40),
              SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  onPressed: () async {
                    if (await canLaunchUrl(Uri.parse(updateUrl))) await launchUrl(Uri.parse(updateUrl));
                  },
                  child: const Text('UPDATE NOW'),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
