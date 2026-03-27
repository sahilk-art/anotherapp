import 'package:flutter/material.dart';

class ChatScreen extends StatelessWidget {
  final String conversationId;
  const ChatScreen({super.key, required this.conversationId});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Team Chat')),
      body: Column(
        children: [
          Expanded(
            child: ListView.builder(
              reverse: true,
              itemCount: 20,
              itemBuilder: (context, index) => _chatBubble(index % 2 == 0),
            ),
          ),
          _chatInput(),
        ],
      ),
    );
  }

  Widget _chatBubble(bool isMe) {
    return Align(
      alignment: isMe ? Alignment.centerRight : Alignment.centerLeft,
      child: Container(
        margin: const EdgeInsets.all(8),
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
        decoration: BoxDecoration(
          color: isMe ? Colors.blue : Colors.grey[200],
          borderRadius: BorderRadius.circular(20),
        ),
        child: Text('Hello world!', style: TextStyle(color: isMe ? Colors.white : Colors.black)),
      ),
    );
  }

  Widget _chatInput() {
    return Container(
      padding: const EdgeInsets.all(8),
      decoration: BoxDecoration(color: Colors.white, border: Border(top: BorderSide(color: Colors.grey[300]!))),
      child: Row(
        children: [
          IconButton(icon: const Icon(Icons.add), onPressed: () {}),
          const Expanded(child: TextField(decoration: InputDecoration(hintText: 'Type a message...', border: InputBorder.none))),
          IconButton(icon: const Icon(Icons.send, color: Colors.blue), onPressed: () {}),
        ],
      ),
    );
  }
}
