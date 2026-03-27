import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';
import '../blocs/scoring_bloc.dart';

class ScoringScreen extends StatefulWidget {
  final String matchId;
  const ScoringScreen({super.key, required this.matchId});

  @override
  State<ScoringScreen> createState() => _ScoringScreenState();
}

class _ScoringScreenState extends State<ScoringScreen> {
  @override
  void initState() {
    super.initState();
    context.read<ScoringBloc>().add(InitScoring(widget.matchId));
  }

  void _recordBall(int runs, {String extraType = 'NONE', bool isWicket = false}) {
    context.read<ScoringBloc>().add(RecordBall({
      'matchId': widget.matchId,
      'runs': runs,
      'extraType': extraType,
      'isWicket': isWicket,
    }));
  }

  @override
  Widget build(BuildContext context) {
    return BlocBuilder<ScoringBloc, ScoringState>(
      builder: (context, state) {
        if (state is ScoringLoading) return const Scaffold(body: Center(child: CircularProgressIndicator()));
        if (state is ScoringActive) {
          final innings = state.innings;
          return Scaffold(
            appBar: AppBar(title: const Text('Live Scoring')),
            body: Column(
              children: [
                _buildScoreHeader(innings),
                _buildScoringGrid(),
              ],
            ),
          );
        }
        return const Scaffold(body: Center(child: Text('Something went wrong')));
      },
    );
  }

  Widget _buildScoreHeader(dynamic innings) {
    return Container(
      padding: const EdgeInsets.all(16),
      color: Colors.blue[900],
      child: Column(
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text('${innings['totalRuns']}/${innings['totalWickets']}', style: const TextStyle(color: Colors.white, fontSize: 24)),
              Text('Overs: ${innings['totalOvers']}', style: const TextStyle(color: Colors.white)),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildScoringGrid() {
    return Expanded(
      child: GridView.count(
        crossAxisCount: 3,
        padding: const EdgeInsets.all(16),
        children: [
          ...[0, 1, 2, 3, 4, 6].map((r) => _scoreBtn(r.toString(), () => _recordBall(r))),
          _scoreBtn('WICKET', () => _recordBall(0, isWicket: true), color: Colors.red),
          _scoreBtn('WIDE', () => _recordBall(0, extraType: 'WIDE'), color: Colors.orange),
          _scoreBtn('NO BALL', () => _recordBall(0, extraType: 'NO_BALL'), color: Colors.orange),
        ],
      ),
    );
  }

  Widget _scoreBtn(String label, VoidCallback onTap, {Color color = Colors.blue}) {
    return Card(
      color: color,
      child: InkWell(
        onTap: onTap,
        child: Center(child: Text(label, style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold))),
      ),
    );
  }
}
