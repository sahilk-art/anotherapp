import 'package:flutter/material.dart';

class TournamentBracketWidget extends StatelessWidget {
  final List<BracketRound> rounds;

  const TournamentBracketWidget({super.key, required this.rounds});

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      scrollDirection: Axis.horizontal,
      child: InteractiveViewer(
        maxScale: 2.0,
        minScale: 0.5,
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: rounds.map((round) => _buildRound(round)).toList(),
          ),
        ),
      ),
    );
  }

  Widget _buildRound(BracketRound round) {
    return Container(
      width: 250,
      margin: const EdgeInsets.symmetric(horizontal: 20),
      child: Column(
        children: [
          Padding(
            padding: const EdgeInsets.only(bottom: 16.0),
            child: Text(
              round.name,
              style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 18),
            ),
          ),
          ...round.matches.map((match) => _buildMatchBox(match)).toList(),
        ],
      ),
    );
  }

  Widget _buildMatchBox(BracketMatch match) {
    return Container(
      margin: const EdgeInsets.symmetric(vertical: 24),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(8),
        boxShadow: [
          BoxShadow(color: Colors.black.withOpacity(0.05), blurRadius: 10, offset: const Offset(0, 4)),
        ],
        border: Border.all(color: Colors.grey[200]!),
      ),
      child: Column(
        children: [
          _teamInMatch(match.teamA, match.scoreA, match.winnerId == match.teamAId),
          const Divider(height: 1),
          _teamInMatch(match.teamB, match.scoreB, match.winnerId == match.teamBId),
        ],
      ),
    );
  }

  Widget _teamInMatch(String name, String? score, bool isWinner) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 12),
      decoration: BoxDecoration(
        color: isWinner ? Colors.green[50] : Colors.transparent,
        borderRadius: const BorderRadius.all(Radius.circular(8)),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Expanded(
            child: Text(
              name,
              style: TextStyle(
                fontWeight: isWinner ? FontWeight.bold : FontWeight.normal,
                color: isWinner ? Colors.green[900] : Colors.black87,
              ),
              overflow: TextOverflow.ellipsis,
            ),
          ),
          if (score != null)
            Text(
              score,
              style: TextStyle(
                fontWeight: isWinner ? FontWeight.bold : FontWeight.normal,
                fontSize: 12,
              ),
            ),
        ],
      ),
    );
  }
}

class BracketRound {
  final String name;
  final List<BracketMatch> matches;
  BracketRound({required this.name, required this.matches});
}

class BracketMatch {
  final String teamA;
  final String teamB;
  final String teamAId;
  final String teamBId;
  final String? scoreA;
  final String? scoreB;
  final String? winnerId;

  BracketMatch({
    required this.teamA,
    required this.teamB,
    required this.teamAId,
    required this.teamBId,
    this.scoreA,
    this.scoreB,
    this.winnerId,
  });
}
