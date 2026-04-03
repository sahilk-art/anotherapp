import 'package:flutter/material.dart';

class CommentaryScreen extends StatelessWidget {
  final String matchId;
  const CommentaryScreen({super.key, required this.matchId});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Commentary')),
      body: ListView.builder(
        padding: const EdgeInsets.all(16),
        itemCount: 20,
        itemBuilder: (context, index) => _commentaryTile(index),
      ),
    );
  }

  Widget _commentaryTile(int index) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 16.0),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text('${(20 - (index/6).floor())}.${index % 6}', style: const TextStyle(fontWeight: FontWeight.bold)),
          const SizedBox(width: 16),
          const Expanded(child: Text('FOUR! Batsman drives beautifully through the covers for a boundary! What a shot.')),
          const SizedBox(width: 8),
          Container(
            padding: const EdgeInsets.all(8),
            decoration: const BoxDecoration(color: Colors.green, shape: BoxShape.circle),
            child: const Text('4', style: TextStyle(color: Colors.white, fontSize: 10, fontWeight: FontWeight.bold)),
          )
        ],
      ),
    );
  }
}
