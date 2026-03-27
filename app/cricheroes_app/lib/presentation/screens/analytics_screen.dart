import 'package:flutter/material.dart';

class AnalyticsScreen extends StatelessWidget {
  const AnalyticsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Match Analytics')),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            _buildChartSection('Wagon Wheel', Icons.adjust),
            _buildChartSection('Manhattan Chart', Icons.bar_chart),
            _buildChartSection('Worm Chart', Icons.show_chart),
            _buildChartSection('Run Rate comparison', Icons.timeline),
          ],
        ),
      ),
    );
  }

  Widget _buildChartSection(String title, IconData icon) {
    return Card(
      margin: const EdgeInsets.only(bottom: 16),
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          children: [
            Row(
              children: [
                Icon(icon, color: Colors.blue),
                const SizedBox(width: 8),
                Text(title, style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
                const Spacer(),
                const Icon(Icons.fullscreen, color: Colors.grey),
              ],
            ),
            const SizedBox(height: 16),
            Container(
              height: 200,
              width: double.infinity,
              color: Colors.grey[100],
              child: const Center(child: Text('Chart Visualization Placeholder', style: TextStyle(color: Colors.grey))),
            ),
          ],
        ),
      ),
    );
  }
}
