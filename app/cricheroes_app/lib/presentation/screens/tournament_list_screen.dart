import 'package:flutter/material.dart';

class TournamentListScreen extends StatelessWidget {
  const TournamentListScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Tournaments')),
      body: ListView.builder(
        itemCount: 5,
        itemBuilder: (context, index) => ListTile(
          title: Text('Tournament ${index + 1}'),
          subtitle: const Text('Ongoing'),
          onTap: () {},
        ),
      ),
    );
  }
}
