import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
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

  void _recordBall(int runs, {String? extraType, bool isWicket = false, String? wicketType}) {
    context.read<ScoringBloc>().add(RecordBall({
      'matchId': widget.matchId,
      'runs': runs,
      if (extraType != null) 'extraType': extraType,
      'isWicket': isWicket,
      if (wicketType != null) 'wicketType': wicketType,
    }));
  }

  void _undoBall() {
    context.read<ScoringBloc>().add(UndoBall(widget.matchId));
  }

  @override
  Widget build(BuildContext context) {
    return BlocConsumer<ScoringBloc, ScoringState>(
      listener: (context, state) {
        if (state is ScoringError) {
          ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(state.message), backgroundColor: Colors.red));
        }
      },
      builder: (context, state) {
        if (state is ScoringLoading) return const Scaffold(body: Center(child: CircularProgressIndicator()));
        if (state is ScoringActive) {
          final innings = state.innings;
          return Scaffold(
            backgroundColor: Colors.grey[100],
            appBar: AppBar(
              title: const Text('Live Scoring', style: TextStyle(fontWeight: FontWeight.bold)),
              backgroundColor: Colors.blue[900],
              foregroundColor: Colors.white,
              actions: [
                IconButton(icon: const Icon(Icons.undo), onPressed: _undoBall, tooltip: 'Undo last ball'),
                IconButton(icon: const Icon(Icons.more_vert), onPressed: () {}),
              ],
            ),
            body: Column(
              children: [
                _buildScoreHeader(innings),
                _buildMatchInfo(innings),
                _buildBatsmenSection(innings),
                _buildBowlerSection(innings),
                const Divider(height: 1),
                _buildScoringControls(),
              ],
            ),
          );
        }
        return Scaffold(
          appBar: AppBar(),
          body: const Center(child: Text('Failed to load scoring state. Please try again.')),
        );
      },
    );
  }

  Widget _buildScoreHeader(dynamic innings) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 24),
      decoration: BoxDecoration(
        color: Colors.blue[900],
        borderRadius: const BorderRadius.only(bottomLeft: Radius.circular(24), bottomRight: Radius.circular(24)),
      ),
      child: Column(
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            crossAxisAlignment: CrossAxisAlignment.end,
            children: [
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text('${innings['battingTeamName'] ?? 'Batting Team'}', style: const TextStyle(color: Colors.white70, fontSize: 16)),
                  const SizedBox(height: 4),
                  Row(
                    crossAxisAlignment: CrossAxisAlignment.baseline,
                    textBaseline: TextBaseline.alphabetic,
                    children: [
                      Text('${innings['totalRuns']}', style: const TextStyle(color: Colors.white, fontSize: 44, fontWeight: FontWeight.bold)),
                      Text(' / ${innings['totalWickets']}', style: const TextStyle(color: Colors.white70, fontSize: 24)),
                    ],
                  ),
                ],
              ),
              Column(
                crossAxisAlignment: CrossAxisAlignment.end,
                children: [
                  const Text('OVERS', style: TextStyle(color: Colors.white70, fontSize: 14)),
                  Text('${innings['totalOvers']}', style: const TextStyle(color: Colors.white, fontSize: 28, fontWeight: FontWeight.w500)),
                  Text('CRR: ${innings['runRate']?.toStringAsFixed(2) ?? '0.00'}', style: const TextStyle(color: Colors.white70, fontSize: 14)),
                ],
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildMatchInfo(dynamic innings) {
    if (innings['target'] == null) return const SizedBox.shrink();
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.symmetric(vertical: 8),
      color: Colors.yellow[100],
      child: Center(
        child: Text(
          'Target: ${innings['target']} | Need ${innings['target'] - innings['totalRuns']} runs in ${innings['ballsRemaining']} balls',
          style: TextStyle(color: Colors.brown[900], fontWeight: FontWeight.bold, fontSize: 13),
        ),
      ),
    );
  }

  Widget _buildBatsmenSection(dynamic innings) {
    final striker = innings['currentBatsmen']?['striker'];
    final nonStriker = innings['currentBatsmen']?['nonStriker'];

    return Padding(
      padding: const EdgeInsets.all(16.0),
      child: Card(
        elevation: 0,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12), side: BorderSide(color: Colors.grey[300]!)),
        child: Column(
          children: [
            _batsmanRow(striker?['name'] ?? 'Select Striker', striker?['runs'] ?? 0, striker?['balls'] ?? 0, true),
            const Divider(height: 1),
            _batsmanRow(nonStriker?['name'] ?? 'Select Non-Striker', nonStriker?['runs'] ?? 0, nonStriker?['balls'] ?? 0, false),
          ],
        ),
      ),
    );
  }

  Widget _batsmanRow(String name, int runs, int balls, bool isStriker) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
      child: Row(
        children: [
          Icon(Icons.sports_cricket, color: isStriker ? Colors.green : Colors.grey[400], size: 20),
          const SizedBox(width: 8),
          Expanded(child: Text(name + (isStriker ? '*' : ''), style: TextStyle(fontWeight: isStriker ? FontWeight.bold : FontWeight.normal, fontSize: 16))),
          Text('$runs', style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
          Text(' ($balls)', style: TextStyle(color: Colors.grey[600], fontSize: 14)),
        ],
      ),
    );
  }

  Widget _buildBowlerSection(dynamic innings) {
    final bowler = innings['currentBowler'];
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16.0),
      child: Card(
        elevation: 0,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12), side: BorderSide(color: Colors.grey[300]!)),
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
          child: Row(
            children: [
              const Icon(Icons.sports_baseball, color: Colors.red, size: 20),
              const SizedBox(width: 8),
              Expanded(child: Text(bowler?['name'] ?? 'Select Bowler', style: const TextStyle(fontSize: 16))),
              Text('${bowler?['wickets'] ?? 0} - ${bowler?['runs'] ?? 0}', style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
              Text(' (${bowler?['overs'] ?? '0.0'})', style: TextStyle(color: Colors.grey[600], fontSize: 14)),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildScoringControls() {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: const BoxDecoration(
        color: Colors.white,
        boxShadow: [BoxShadow(color: Colors.black12, blurRadius: 10, offset: Offset(0, -2))],
      ),
      child: Column(
        children: [
          Row(
            children: [
              _actionBtn('WIDE', () => _recordBall(0, extraType: 'WIDE'), Colors.orange[50]!, Colors.orange[900]!),
              const SizedBox(width: 8),
              _actionBtn('NO BALL', () => _recordBall(0, extraType: 'NO_BALL'), Colors.red[50]!, Colors.red[900]!),
              const SizedBox(width: 8),
              _actionBtn('BYE', () => _recordBall(0, extraType: 'BYE'), Colors.blue[50]!, Colors.blue[900]!),
              const SizedBox(width: 8),
              _actionBtn('LEG BYE', () => _recordBall(0, extraType: 'LEG_BYE'), Colors.blue[50]!, Colors.blue[900]!),
            ],
          ),
          const SizedBox(height: 16),
          GridView.count(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            crossAxisCount: 4,
            mainAxisSpacing: 12,
            crossAxisSpacing: 12,
            children: [
              ...[0, 1, 2, 3, 4, 5, 6].map((r) => _runBtn(r)),
              _wicketBtn(),
            ],
          ),
        ],
      ),
    );
  }

  Widget _actionBtn(String label, VoidCallback onTap, Color bg, Color text) {
    return Expanded(
      child: ElevatedButton(
        onPressed: onTap,
        style: ElevatedButton.styleFrom(
          backgroundColor: bg,
          foregroundColor: text,
          elevation: 0,
          padding: const EdgeInsets.symmetric(vertical: 12),
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
        ),
        child: Text(label, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 12)),
      ),
    );
  }

  Widget _runBtn(int runs) {
    return InkWell(
      onTap: () => _recordBall(runs),
      child: Container(
        decoration: BoxDecoration(
          color: Colors.blue[900],
          shape: BoxShape.circle,
          boxShadow: [BoxShadow(color: Colors.blue.withOpacity(0.3), blurRadius: 4, offset: const Offset(0, 2))],
        ),
        child: Center(child: Text('$runs', style: const TextStyle(color: Colors.white, fontSize: 20, fontWeight: FontWeight.bold))),
      ),
    );
  }

  Widget _wicketBtn() {
    return InkWell(
      onTap: () => _recordBall(0, isWicket: true, wicketType: 'BOWLED'), // Simplified for this example
      child: Container(
        decoration: BoxDecoration(
          color: Colors.red[700],
          shape: BoxShape.circle,
          boxShadow: [BoxShadow(color: Colors.red.withOpacity(0.3), blurRadius: 4, offset: const Offset(0, 2))],
        ),
        child: const Center(child: Text('W', style: TextStyle(color: Colors.white, fontSize: 20, fontWeight: FontWeight.bold))),
      ),
    );
  }
}
