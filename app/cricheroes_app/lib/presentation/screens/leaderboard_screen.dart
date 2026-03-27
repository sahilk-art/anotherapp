import 'package:flutter/material.dart';

class LeaderboardScreen extends StatelessWidget {
  const LeaderboardScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return DefaultTabController(
      length: 4,
      child: Scaffold(
        appBar: AppBar(
          title: const Text('Leaderboard'),
          bottom: const TabBar(
            isScrollable: true,
            tabs: [
              Tab(text: 'Batting'),
              Tab(text: 'Bowling'),
              Tab(text: 'Fielding'),
              Tab(text: 'MVP'),
            ],
          ),
        ),
        body: TabBarView(
          children: [
            _buildLeaderboardList('Runs'),
            _buildLeaderboardList('Wickets'),
            _buildLeaderboardList('Catches'),
            _buildLeaderboardList('Points'),
          ],
        ),
      ),
    );
  }

  Widget _buildLeaderboardList(String unit) {
    return Column(
      children: [
        _buildPodium(),
        Expanded(
          child: ListView.builder(
            itemCount: 10,
            itemBuilder: (context, index) => ListTile(
              leading: Text('${index + 1}', style: const TextStyle(fontWeight: FontWeight.bold)),
              title: const Text('Player Name'),
              subtitle: const Text('Team Name'),
              trailing: Text('${100 - index * 5} $unit', style: const TextStyle(color: Colors.blue, fontWeight: FontWeight.bold)),
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildPodium() {
    return Container(
      padding: const EdgeInsets.all(24),
      height: 200,
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceEvenly,
        crossAxisAlignment: CrossAxisAlignment.end,
        children: [
          _podiumItem('Player 2', '2nd', 120),
          _podiumItem('Player 1', '1st', 150),
          _podiumItem('Player 3', '3rd', 100),
        ],
      ),
    );
  }

  Widget _podiumItem(String name, String rank, double height) {
    return Column(
      mainAxisAlignment: MainAxisAlignment.end,
      children: [
        const CircleAvatar(radius: 25),
        const SizedBox(height: 8),
        Text(name, style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold)),
        Container(
          width: 60,
          height: height,
          decoration: BoxDecoration(
            color: Colors.blue[100],
            borderRadius: const BorderRadius.vertical(top: Radius.circular(8)),
          ),
          child: Center(child: Text(rank, style: const TextStyle(fontWeight: FontWeight.bold))),
        ),
      ],
    );
  }
}
