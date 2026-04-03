import 'package:flutter/material.dart';

class SubscriptionScreen extends StatelessWidget {
  const SubscriptionScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('CricHeroes Pro')),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          _planCard('FREE', '₹0', ['Basic Scoring', 'Stats'], false),
          _planCard('PRO', '₹499/yr', ['Advanced Stats', 'No Ads', 'Reports'], true),
          _planCard('PREMIUM', '₹999/yr', ['Live Streaming', 'All Pro Features'], false),
        ],
      ),
    );
  }

  Widget _planCard(String title, String price, List<String> features, bool isPopular) {
    return Card(
      margin: const EdgeInsets.only(bottom: 16),
      child: Padding(
        padding: const EdgeInsets.all(24.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(title, style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
                if (isPopular) Container(padding: const EdgeInsets.all(4), color: Colors.orange, child: const Text('POPULAR', style: TextStyle(fontSize: 10, color: Colors.white))),
              ],
            ),
            Text(price, style: const TextStyle(fontSize: 24, color: Colors.blue)),
            const Divider(height: 32),
            ...features.map((f) => ListTile(dense: true, leading: const Icon(Icons.check, color: Colors.green), title: Text(f))),
            const SizedBox(height: 16),
            SizedBox(width: double.infinity, child: OutlinedButton(onPressed: () {}, child: const Text('CHOOSE PLAN'))),
          ],
        ),
      ),
    );
  }
}
