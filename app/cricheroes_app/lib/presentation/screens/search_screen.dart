import 'package:flutter/material.dart';

class SearchScreen extends StatelessWidget {
  const SearchScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const TextField(
          autofocus: true,
          style: TextStyle(color: Colors.white),
          decoration: InputDecoration(
            hintText: 'Search Players, Teams, Tournaments...',
            hintStyle: TextStyle(color: Colors.white70),
            border: InputBorder.none,
          ),
        ),
      ),
      body: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Padding(
            padding: EdgeInsets.all(16.0),
            child: Text('Recent Searches', style: TextStyle(fontWeight: FontWeight.bold, color: Colors.grey)),
          ),
          Wrap(
            spacing: 8,
            padding: const EdgeInsets.symmetric(horizontal: 16),
            children: ['Virat Kohli', 'Mumbai Indians', 'Corporate Cup'].map((e) => ActionChip(label: Text(e), onPressed: () {})).toList(),
          ),
          const Divider(height: 32),
          const Expanded(
            child: Center(child: Text('Start typing to see results', style: TextStyle(color: Colors.grey))),
          ),
        ],
      ),
    );
  }
}
