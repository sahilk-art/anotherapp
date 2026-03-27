import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

class ConversationsListScreen extends StatelessWidget {
  const ConversationsListScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Chats')),
      body: ListView.separated(
        itemCount: 10,
        separatorBuilder: (context, index) => const Divider(height: 1),
        itemBuilder: (context, index) => ListTile(
          leading: const CircleAvatar(child: Icon(Icons.group)),
          title: Text('Team Chat $index'),
          subtitle: const Text('Last message content...'),
          trailing: const Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Text('10:30 AM', style: TextStyle(fontSize: 10)),
              SizedBox(height: 4),
              CircleAvatar(radius: 8, backgroundColor: Colors.blue, child: Text('2', style: TextStyle(fontSize: 8, color: Colors.white))),
            ],
          ),
          onTap: () => context.push('/chat/$index'),
        ),
      ),
    );
  }
}
