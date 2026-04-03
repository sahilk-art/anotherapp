import 'package:flutter/material.dart';

class HighlightsScreen extends StatelessWidget {
  final String matchId;
  const HighlightsScreen({super.key, required this.matchId});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Match Highlights')),
      body: ListView.builder(
        padding: const EdgeInsets.all(16),
        itemCount: 5,
        itemBuilder: (context, index) => _highlightCard(index),
      ),
    );
  }

  Widget _highlightCard(int index) {
    return Card(
      margin: const EdgeInsets.only(bottom: 16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(height: 150, color: Colors.grey[300], child: const Center(child: Icon(Icons.play_circle_fill, size: 48, color: Colors.white))),
          Padding(
            padding: const EdgeInsets.all(16.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Text('WICKET!', style: TextStyle(color: Colors.red, fontWeight: FontWeight.bold)),
                    Container(padding: const EdgeInsets.all(4), decoration: BoxDecoration(color: Colors.red[50], borderRadius: BorderRadius.circular(4)), child: const Text('Importance: 8', style: TextStyle(fontSize: 10, color: Colors.red))),
                  ],
                ),
                const SizedBox(height: 8),
                const Text('Virat Kohli clean bowled by Pat Cummins! A major turning point in the match.'),
              ],
            ),
          )
        ],
      ),
    );
  }
}
