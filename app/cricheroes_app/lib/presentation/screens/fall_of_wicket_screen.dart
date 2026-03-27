import 'package:flutter/material.dart';

class FallOfWicketScreen extends StatelessWidget {
  const FallOfWicketScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('How was the batsman out?')),
      body: GridView.count(
        padding: const EdgeInsets.all(16),
        crossAxisCount: 2,
        mainAxisSpacing: 16,
        crossAxisSpacing: 16,
        childAspectRatio: 2.5,
        children: [
          _wicketTypeBtn('BOWLED'),
          _wicketTypeBtn('CAUGHT'),
          _wicketTypeBtn('LBW'),
          _wicketTypeBtn('RUN OUT'),
          _wicketTypeBtn('STUMPED'),
          _wicketTypeBtn('HIT WICKET'),
          _wicketTypeBtn('C & B'),
          _wicketTypeBtn('RETIRED'),
        ],
      ),
    );
  }

  Widget _wicketTypeBtn(String label) {
    return ElevatedButton(
      onPressed: () {},
      style: ElevatedButton.styleFrom(backgroundColor: Colors.white, foregroundColor: Colors.black),
      child: Text(label, style: const TextStyle(fontWeight: FontWeight.bold)),
    );
  }
}
