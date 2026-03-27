import 'package:flutter/material.dart';

class SelectBowlerScreen extends StatelessWidget {
  const SelectBowlerScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Select Bowler')),
      body: ListView.builder(
        itemCount: 5,
        itemBuilder: (context, index) => ListTile(
          leading: const CircleAvatar(child: Icon(Icons.person)),
          title: Text('Bowler ${index + 1}'),
          subtitle: const Text('Overs: 2.0  Runs: 15  Wickets: 1'),
          trailing: index == 0 ? const Text('Previous', style: TextStyle(color: Colors.grey)) : null,
          enabled: index != 0,
          onTap: () => Navigator.pop(context),
        ),
      ),
    );
  }
}
