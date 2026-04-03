import 'package:flutter/material.dart';
import 'dart:math' as math;

class TossCoinWidget extends StatefulWidget {
  final String teamAName;
  final String teamBName;
  final String? teamALogo;
  final String? teamBLogo;
  final Function(String winner) onCompleted;

  const TossCoinWidget({
    super.key,
    required this.teamAName,
    required this.teamBName,
    this.teamALogo,
    this.teamBLogo,
    required this.onCompleted,
  });

  @override
  State<TossCoinWidget> createState() => _TossCoinWidgetState();
}

class _TossCoinWidgetState extends State<TossCoinWidget> with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _animation;
  bool _isFlipping = false;
  String? _winner;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      duration: const Duration(milliseconds: 2000),
      vsync: this,
    );
    _animation = Tween<double>(begin: 0, end: 10 * math.pi).animate(
      CurvedAnimation(parent: _controller, curve: Curves.easeInOutCubic),
    );
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  void _flipCoin() {
    if (_isFlipping) return;

    setState(() {
      _isFlipping = true;
      _winner = null;
    });

    _controller.forward(from: 0).then((_) {
      setState(() {
        _isFlipping = false;
        _winner = math.Random().nextBool() ? widget.teamAName : widget.teamBName;
      });
      widget.onCompleted(_winner!);
    });
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceEvenly,
          children: [
            _teamInfo(widget.teamAName, widget.teamALogo, 'HEADS'),
            const Text('VS', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 20)),
            _teamInfo(widget.teamBName, widget.teamBLogo, 'TAILS'),
          ],
        ),
        const SizedBox(height: 40),
        AnimatedBuilder(
          animation: _animation,
          builder: (context, child) {
            return Transform(
              transform: Matrix4.identity()
                ..setEntry(3, 2, 0.001)
                ..rotateX(_animation.value),
              alignment: Alignment.center,
              child: _buildCoin(),
            );
          },
        ),
        const SizedBox(height: 40),
        if (!_isFlipping && _winner == null)
          ElevatedButton(
            onPressed: _flipCoin,
            style: ElevatedButton.styleFrom(
              backgroundColor: Colors.blue[900],
              foregroundColor: Colors.white,
              padding: const EdgeInsets.symmetric(horizontal: 40, vertical: 16),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(30)),
            ),
            child: const Text('FLIP COIN', style: TextStyle(fontWeight: FontWeight.bold)),
          ),
        if (_winner != null)
          Column(
            children: [
              Text(
                'Winner: $_winner',
                style: const TextStyle(fontSize: 24, fontWeight: FontWeight.bold, color: Colors.green),
              ),
              const SizedBox(height: 16),
              const Text('What did they choose?', style: TextStyle(fontSize: 16)),
              const SizedBox(height: 12),
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  _choiceBtn('BAT'),
                  const SizedBox(width: 16),
                  _choiceBtn('BOWL'),
                ],
              ),
            ],
          ),
      ],
    );
  }

  Widget _teamInfo(String name, String? logo, String side) {
    return Column(
      children: [
        CircleAvatar(
          radius: 30,
          backgroundColor: Colors.grey[200],
          backgroundImage: logo != null ? NetworkImage(logo) : null,
          child: logo == null ? const Icon(Icons.group) : null,
        ),
        const SizedBox(height: 8),
        Text(name, style: const TextStyle(fontWeight: FontWeight.bold)),
        Text(side, style: TextStyle(color: Colors.grey[600], fontSize: 12)),
      ],
    );
  }

  Widget _buildCoin() {
    return Container(
      width: 100,
      height: 100,
      decoration: BoxDecoration(
        shape: BoxShape.circle,
        gradient: LinearGradient(
          colors: [Colors.yellow[700]!, Colors.yellow[400]!, Colors.yellow[800]!],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        boxShadow: [
          BoxShadow(color: Colors.black.withOpacity(0.3), blurRadius: 10, offset: const Offset(0, 5)),
        ],
        border: Border.all(color: Colors.yellow[900]!, width: 4),
      ),
      child: const Center(
        child: Icon(Icons.sports_cricket, size: 50, color: Colors.brown),
      ),
    );
  }

  Widget _choiceBtn(String label) {
    return OutlinedButton(
      onPressed: () {},
      style: OutlinedButton.styleFrom(
        foregroundColor: Colors.blue[900],
        side: BorderSide(color: Colors.blue[900]!),
        padding: const EdgeInsets.symmetric(horizontal: 30, vertical: 12),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
      ),
      child: Text(label, style: const TextStyle(fontWeight: FontWeight.bold)),
    );
  }
}
