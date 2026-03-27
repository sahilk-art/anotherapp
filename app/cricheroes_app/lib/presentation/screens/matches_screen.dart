import 'package:flutter/material.dart';

class MatchesScreen extends StatelessWidget {
  const MatchesScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return DefaultTabController(
      length: 4,
      child: Scaffold(
        appBar: AppBar(
          title: const Text('Matches'),
          bottom: const TabBar(
            isScrollable: true,
            tabs: [
              Tab(text: 'Live'),
              Tab(text: 'My Matches'),
              Tab(text: 'Recent'),
              Tab(text: 'Upcoming'),
            ],
          ),
        ),
        body: TabBarView(
          children: [
            _buildLiveTab(),
            _buildMyMatchesTab(),
            _buildRecentTab(),
            _buildUpcomingTab(),
          ],
        ),
      ),
    );
  }

  Widget _buildLiveTab() {
    return ListView.builder(
      padding: const EdgeInsets.all(8),
      itemCount: 5,
      itemBuilder: (context, index) => _liveMatchCard(),
    );
  }

  Widget _liveMatchCard() {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            const Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text('T20 League', style: TextStyle(fontSize: 12, color: Colors.grey)),
                Row(
                  children: [
                    Icon(Icons.circle, size: 8, color: Colors.red),
                    SizedBox(width: 4),
                    Text('LIVE', style: TextStyle(color: Colors.red, fontWeight: FontWeight.bold, fontSize: 12)),
                  ],
                ),
              ],
            ),
            const SizedBox(height: 16),
            Row(
              children: [
                const CircleAvatar(radius: 15),
                const SizedBox(width: 10),
                const Text('Team India', style: TextStyle(fontWeight: FontWeight.bold)),
                const Spacer(),
                const Text('125/4 (14.2)', style: TextStyle(fontWeight: FontWeight.bold)),
              ],
            ),
            const SizedBox(height: 8),
            Row(
              children: [
                const CircleAvatar(radius: 15),
                const SizedBox(width: 10),
                const Text('Australia', style: TextStyle(fontWeight: FontWeight.bold)),
                const Spacer(),
                const Text('Yet to bat', style: TextStyle(color: Colors.grey)),
              ],
            ),
            const Divider(height: 32),
            const Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text('Virat: 45*(32)', style: TextStyle(fontSize: 12)),
                Text('Bumrah: 2/18 (3.2)', style: TextStyle(fontSize: 12)),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildMyMatchesTab() => const Center(child: Text('My Match History'));
  Widget _buildRecentTab() => const Center(child: Text('Recently Completed Matches'));
  Widget _buildUpcomingTab() => const Center(child: Text('Scheduled Future Matches'));
}
