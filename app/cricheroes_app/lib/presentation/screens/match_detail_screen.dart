import 'package:flutter/material.dart';

class MatchDetailScreen extends StatelessWidget {
  const MatchDetailScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Match Details')),
      body: Column(
        children: [
          const MatchHeader(),
          const TabBar(
            tabs: [
              Tab(text: 'Scorecard'),
              Tab(text: 'Commentary'),
              Tab(text: 'Info'),
            ],
          ),
          const Expanded(
            child: TabBarView(
              children: [
                Center(child: Text('Detailed Scorecard')),
                Center(child: Text('Live Commentary')),
                Center(child: Text('Match Info')),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class MatchHeader extends StatelessWidget {
  const MatchHeader({super.key});
  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(16),
      color: Colors.grey[200],
      child: const Column(
        children: [
          Text('T20 Match', style: TextStyle(color: Colors.grey)),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceAround,
            children: [
              Column(children: [CircleAvatar(radius: 30), Text('Team A')]),
              Text('VS', style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold)),
              Column(children: [CircleAvatar(radius: 30), Text('Team B')]),
            ],
          ),
          SizedBox(height: 10),
          Text('Team A won the toss and elected to bat'),
        ],
      ),
    );
  }
}
