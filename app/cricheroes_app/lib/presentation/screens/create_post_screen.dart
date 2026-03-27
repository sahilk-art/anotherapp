import 'package:flutter/material.dart';

class CreatePostScreen extends StatelessWidget {
  const CreatePostScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Create Post'), actions: [TextButton(onPressed: () {}, child: const Text('POST', style: TextStyle(color: Colors.white)))]),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          children: [
            const TextField(
              decoration: InputDecoration(hintText: "What's happening in your cricket world?", border: InputBorder.none),
              maxLines: null,
            ),
            const Spacer(),
            Row(
              children: [
                IconButton(icon: const Icon(Icons.image, color: Colors.green), onPressed: () {}),
                IconButton(icon: const Icon(Icons.videocam, color: Colors.red), onPressed: () {}),
                IconButton(icon: const Icon(Icons.poll, color: Colors.blue), onPressed: () {}),
                IconButton(icon: const Icon(Icons.alternate_email, color: Colors.orange), onPressed: () {}),
              ],
            )
          ],
        ),
      ),
    );
  }
}
