import 'package:flutter/material.dart';

class PlayerComparisonScreen extends StatelessWidget {
  const PlayerComparisonScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Player Comparison')),
      body: Column(
        children: [
          _buildCompareHeader(),
          Expanded(
            child: ListView(
              children: [
                _compareStat('Matches', '145', '132', 145/145, 132/145),
                _compareStat('Runs', '3,456', '2,890', 3456/3456, 2890/3456),
                _compareStat('Average', '45.2', '52.1', 45.2/52.1, 52.1/52.1),
                _compareStat('Strike Rate', '135.5', '128.3', 135.5/135.5, 128.3/135.5),
                _compareStat('Wickets', '12', '8', 12/12, 8/12),
              ],
            ),
          )
        ],
      ),
    );
  }

  Widget _buildCompareHeader() {
    return Container(
      padding: const EdgeInsets.all(24),
      color: Colors.blue[50],
      child: const Row(
        mainAxisAlignment: MainAxisAlignment.spaceAround,
        children: [
          Column(children: [CircleAvatar(radius: 35), SizedBox(height: 8), Text('Virat Kohli', style: TextStyle(fontWeight: FontWeight.bold))]),
          Text('VS', style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold, color: Colors.grey)),
          Column(children: [CircleAvatar(radius: 35), SizedBox(height: 8), Text('Rohit Sharma', style: TextStyle(fontWeight: FontWeight.bold))]),
        ],
      ),
    );
  }

  Widget _compareStat(String label, String v1, String v2, double p1, double p2) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
      child: Column(
        children: [
          Text(label, style: const TextStyle(color: Colors.grey, fontSize: 12)),
          const SizedBox(height: 8),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [Text(v1, style: const TextStyle(fontWeight: FontWeight.bold)), Text(v2, style: const TextStyle(fontWeight: FontWeight.bold))],
          ),
          const SizedBox(height: 8),
          Row(
            children: [
              Expanded(child: LinearProgressIndicator(value: p1, backgroundColor: Colors.grey[200], color: Colors.blue)),
              const SizedBox(width: 8),
              Expanded(child: RotatedBox(quarterTurns: 2, child: LinearProgressIndicator(value: p2, backgroundColor: Colors.grey[200], color: Colors.orange))),
            ],
          ),
        ],
      ),
    );
  }
}
