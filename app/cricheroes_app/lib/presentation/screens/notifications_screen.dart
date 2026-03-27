import 'package:flutter/material.dart';

class NotificationsScreen extends StatelessWidget {
  const NotificationsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Notifications')),
      body: ListView.separated(
        itemCount: 10,
        separatorBuilder: (context, index) => const Divider(height: 1),
        itemBuilder: (context, index) => ListTile(
          leading: const CircleAvatar(child: Icon(Icons.notifications)),
          title: Text('Notification Title $index'),
          subtitle: const Text('This is the notification body text showing relevant info.'),
          trailing: const Text('2h ago', style: TextStyle(fontSize: 10, color: Colors.grey)),
          onTap: () {},
        ),
      ),
    );
  }
}
