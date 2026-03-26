import 'package:flutter/material.dart';

class LeaderboardScreen extends StatelessWidget {
  const LeaderboardScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return DefaultTabController(
      length: 3,
      child: Scaffold(
        appBar: AppBar(
          title: const Text('Leaderboard'),
          bottom: const TabBar(
            tabs: [
              Tab(text: 'Batting'),
              Tab(text: 'Bowling'),
              Tab(text: 'Fielding'),
            ],
          ),
        ),
        body: const TabBarView(
          children: [
            Center(child: Text('Batting Leaders')),
            Center(child: Text('Bowling Leaders')),
            Center(child: Text('Fielding Leaders')),
          ],
        ),
      ),
    );
  }
}
