import 'package:flutter/material.dart';

class WatchLiveScreen extends StatelessWidget {
  final String matchId;
  const WatchLiveScreen({super.key, required this.matchId});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.black,
      appBar: AppBar(backgroundColor: Colors.transparent, title: const Text('Live Stream')),
      body: Column(
        children: [
          AspectRatio(
            aspectRatio: 16 / 9,
            child: Container(color: Colors.grey[900], child: const Center(child: Icon(Icons.play_circle_fill, size: 64, color: Colors.white))),
          ),
          const Expanded(
            child: Padding(
              padding: EdgeInsets.all(16.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text('Live Chat', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
                  Divider(color: Colors.white24),
                  Spacer(),
                  TextField(
                    style: TextStyle(color: Colors.white),
                    decoration: InputDecoration(hintText: 'Say something...', hintStyle: TextStyle(color: Colors.white54), border: InputBorder.none),
                  ),
                ],
              ),
            ),
          )
        ],
      ),
    );
  }
}
