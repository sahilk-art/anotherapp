import 'package:flutter/material.dart';

class FindScorerScreen extends StatelessWidget {
  const FindScorerScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Find Scorers')),
      body: ListView.builder(
        itemCount: 5,
        itemBuilder: (context, index) => Card(
          margin: const EdgeInsets.all(8),
          child: ListTile(
            leading: const CircleAvatar(child: Icon(Icons.person)),
            title: Text('Scorer Name $index'),
            subtitle: const Text('Experience: Expert • Fee: ₹500'),
            trailing: ElevatedButton(onPressed: () {}, child: const Text('HIRE')),
          ),
        ),
      ),
    );
  }
}
