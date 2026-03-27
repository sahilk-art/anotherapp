import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('CricHeroes'),
        actions: [
          IconButton(icon: const Icon(Icons.search), onPressed: () {}),
          IconButton(icon: const Icon(Icons.notifications_none), onPressed: () {}),
        ],
      ),
      body: SingleChildScrollView(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            _buildLiveMatches(),
            _buildQuickActions(context),
            _buildRecentMatches(),
          ],
        ),
      ),
    );
  }

  Widget _buildLiveMatches() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Padding(
          padding: EdgeInsets.all(16.0),
          child: Text('Live Matches', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
        ),
        SizedBox(
          height: 180,
          child: ListView.builder(
            scrollDirection: Axis.horizontal,
            padding: const EdgeInsets.symmetric(horizontal: 8),
            itemCount: 3,
            itemBuilder: (context, index) => _matchCard(),
          ),
        ),
      ],
    );
  }

  Widget _matchCard() {
    return Container(
      width: 300,
      margin: const EdgeInsets.symmetric(horizontal: 8),
      child: Card(
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const Text('Live', style: TextStyle(color: Colors.red, fontWeight: FontWeight.bold)),
                  Text('T20 - ${DateTime.now().day} Oct', style: const TextStyle(color: Colors.grey)),
                ],
              ),
              const Spacer(),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceAround,
                children: [
                  _teamScore('IND', '125/4'),
                  const Text('vs', style: TextStyle(color: Colors.grey)),
                  _teamScore('AUS', 'yet to bat'),
                ],
              ),
              const Spacer(),
              const Text('IND: 14.2 overs', style: TextStyle(fontSize: 12)),
            ],
          ),
        ),
      ),
    );
  }

  Widget _teamScore(String name, String score) {
    return Column(
      children: [
        const CircleAvatar(radius: 20),
        const SizedBox(height: 8),
        Text(name, style: const TextStyle(fontWeight: FontWeight.bold)),
        Text(score, style: const TextStyle(fontSize: 12)),
      ],
    );
  }

  Widget _buildQuickActions(BuildContext context) {
    return GridView.count(
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      crossAxisCount: 4,
      padding: const EdgeInsets.all(16),
      children: [
        _actionIcon(Icons.add_circle_outline, 'Start Match', () => context.push('/scoring/new')),
        _actionIcon(Icons.group_add_outlined, 'Create Team', () {}),
        _actionIcon(Icons.emoji_events_outlined, 'Tournament', () {}),
        _actionIcon(Icons.person_add_alt, 'Join Team', () {}),
      ],
    );
  }

  Widget _actionIcon(IconData icon, String label, VoidCallback onTap) {
    return InkWell(
      onTap: onTap,
      child: Column(
        children: [
          CircleAvatar(backgroundColor: Colors.blue[50], child: Icon(icon, color: Colors.blue)),
          const SizedBox(height: 8),
          Text(label, style: const TextStyle(fontSize: 10), textAlign: TextAlign.center),
        ],
      ),
    );
  }

  Widget _buildRecentMatches() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Padding(
          padding: EdgeInsets.all(16.0),
          child: Text('My Recent Matches', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
        ),
        ListView.builder(
          shrinkWrap: true,
          physics: const NeverScrollableScrollPhysics(),
          itemCount: 5,
          itemBuilder: (context, index) => ListTile(
            leading: const CircleAvatar(),
            title: const Text('India vs Australia'),
            subtitle: const Text('India won by 15 runs'),
            trailing: const Text('24 Oct', style: TextStyle(fontSize: 12)),
          ),
        ),
      ],
    );
  }
}
