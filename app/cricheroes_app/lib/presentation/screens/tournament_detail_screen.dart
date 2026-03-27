import 'package:flutter/material.dart';

class TournamentDetailScreen extends StatelessWidget {
  const TournamentDetailScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return DefaultTabController(
      length: 5,
      child: Scaffold(
        appBar: AppBar(
          title: const Text('Corporate League 2024'),
          bottom: const TabBar(
            isScrollable: true,
            tabs: [
              Tab(text: 'Matches'),
              Tab(text: 'Points Table'),
              Tab(text: 'Teams'),
              Tab(text: 'Leaderboard'),
              Tab(text: 'Info'),
            ],
          ),
        ),
        body: TabBarView(
          children: [
            _buildMatchesTab(),
            _buildPointsTableTab(),
            _buildTeamsTab(),
            _buildLeaderboardTab(),
            _buildInfoTab(),
          ],
        ),
      ),
    );
  }

  Widget _buildMatchesTab() {
    return ListView.builder(
      padding: const EdgeInsets.all(16),
      itemCount: 5,
      itemBuilder: (context, index) => Card(
        child: ListTile(
          title: const Text('Team A vs Team B'),
          subtitle: const Text('25 Oct, 10:00 AM - Wankhede Stadium'),
          trailing: const Icon(Icons.chevron_right),
        ),
      ),
    );
  }

  Widget _buildPointsTableTab() {
    return SingleChildScrollView(
      scrollDirection: Axis.horizontal,
      child: DataTable(
        columns: const [
          DataColumn(label: Text('#')),
          DataColumn(label: Text('Team')),
          DataColumn(label: Text('P')),
          DataColumn(label: Text('W')),
          DataColumn(label: Text('L')),
          DataColumn(label: Text('Pts')),
          DataColumn(label: Text('NRR')),
        ],
        rows: List.generate(5, (i) => DataRow(cells: [
          DataCell(Text('${i+1}')),
          const DataCell(Text('Team Name')),
          const DataCell(Text('5')),
          const DataCell(Text('4')),
          const DataCell(Text('1')),
          const DataCell(Text('8')),
          const DataCell(Text('+1.234')),
        ])),
      ),
    );
  }

  Widget _buildTeamsTab() {
    return GridView.builder(
      padding: const EdgeInsets.all(16),
      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(crossAxisCount: 3, mainAxisSpacing: 16, crossAxisSpacing: 16),
      itemCount: 8,
      itemBuilder: (context, index) => Column(
        children: [
          const CircleAvatar(radius: 30),
          const SizedBox(height: 8),
          Text('Team ${index+1}', style: const TextStyle(fontSize: 12), textAlign: TextAlign.center),
        ],
      ),
    );
  }

  Widget _buildLeaderboardTab() => const Center(child: Text('Tournament Stats'));
  Widget _buildInfoTab() => const Padding(
    padding: EdgeInsets.all(24.0),
    child: Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text('About Tournament', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
        SizedBox(height: 8),
        Text('This is a corporate league organized for all software companies in Mumbai.', style: TextStyle(color: Colors.grey)),
        SizedBox(height: 24),
        Text('Organizer', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
        ListTile(leading: CircleAvatar(), title: Text('John Doe'), subtitle: Text('Contact: +91 9876543210')),
      ],
    ),
  );
}
