import 'package:flutter/material.dart';

class TeamDetailScreen extends StatelessWidget {
  const TeamDetailScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Team Profile')),
      body: Column(
        children: [
          const SizedBox(height: 20),
          const CircleAvatar(radius: 50, child: Icon(Icons.group, size: 50)),
          const SizedBox(height: 10),
          const Text('Team Name', style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
          const Text('Location: Mumbai'),
          const Divider(),
          const Padding(
            padding: EdgeInsets.all(16.0),
            child: Text('Members', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
          ),
          Expanded(
            child: ListView.builder(
              itemCount: 11,
              itemBuilder: (context, index) => ListTile(
                leading: const CircleAvatar(child: Icon(Icons.person)),
                title: Text('Player ${index + 1}'),
                subtitle: const Text('All-rounder'),
              ),
            ),
          )
        ],
      ),
    );
  }
}
