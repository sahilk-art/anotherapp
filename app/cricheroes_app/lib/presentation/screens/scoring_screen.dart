import 'package:flutter/material.dart';

class ScoringScreen extends StatelessWidget {
  const ScoringScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Scoring')),
      body: Column(
        children: [
          const ScoreboardHeader(),
          const CurrentOverDisplay(),
          const BatsmanBowlerInfo(),
          const Spacer(),
          const ScoringButtons(),
        ],
      ),
    );
  }
}

class ScoreboardHeader extends StatelessWidget {
  const ScoreboardHeader({super.key});
  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(16),
      color: Colors.blue[900],
      child: const Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text('India', style: TextStyle(color: Colors.white, fontSize: 24)),
          Text('120/4 (15.2)', style: TextStyle(color: Colors.white, fontSize: 24)),
        ],
      ),
    );
  }
}

class CurrentOverDisplay extends StatelessWidget {
  const CurrentOverDisplay({super.key});
  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(vertical: 8),
      child: const Text('Over: 1 0 4 0 6 1'),
    );
  }
}

class BatsmanBowlerInfo extends StatelessWidget {
  const BatsmanBowlerInfo({super.key});
  @override
  Widget build(BuildContext context) {
    return const Padding(
      padding: EdgeInsets.all(16.0),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceAround,
        children: [
          Column(children: [Text('Virat Kohli*'), Text('45 (32)')]),
          Column(children: [Text('Jasprit Bumrah'), Text('2/18 (3.2)')]),
        ],
      ),
    );
  }
}

class ScoringButtons extends StatelessWidget {
  const ScoringButtons({super.key});
  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(16.0),
      child: Wrap(
        spacing: 8,
        runSpacing: 8,
        children: [
          for (var i = 0; i <= 6; i++)
            ElevatedButton(onPressed: () {}, child: Text('$i')),
          ElevatedButton(onPressed: () {}, child: const Text('W')),
          ElevatedButton(onPressed: () {}, child: const Text('Wd')),
          ElevatedButton(onPressed: () {}, child: const Text('Nb')),
        ],
      ),
    );
  }
}
