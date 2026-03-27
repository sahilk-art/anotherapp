import 'package:flutter/material.dart';

class SettingsScreen extends StatelessWidget {
  const SettingsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Settings')),
      body: ListView(
        children: [
          const _SettingsHeader('Account'),
          ListTile(leading: const Icon(Icons.person), title: const Text('Edit Profile'), onTap: () {}),
          ListTile(leading: const Icon(Icons.notifications), title: const Text('Notifications'), trailing: Switch(value: true, onChanged: (v) {}), onTap: () {}),
          const _SettingsHeader('App Settings'),
          ListTile(leading: const Icon(Icons.dark_mode), title: const Text('Dark Mode'), trailing: Switch(value: false, onChanged: (v) {}), onTap: () {}),
          ListTile(leading: const Icon(Icons.language), title: const Text('Language'), trailing: const Text('English'), onTap: () {}),
          const _SettingsHeader('Support'),
          ListTile(leading: const Icon(Icons.help), title: const Text('Help & Support'), onTap: () {}),
          ListTile(leading: const Icon(Icons.info), title: const Text('About App'), onTap: () {}),
          const Divider(),
          ListTile(leading: const Icon(Icons.logout, color: Colors.red), title: const Text('Logout', style: TextStyle(color: Colors.red)), onTap: () {}),
        ],
      ),
    );
  }
}

class _SettingsHeader extends StatelessWidget {
  final String title;
  const _SettingsHeader(this.title);
  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.fromLTRB(16, 24, 16, 8),
      child: Text(title, style: TextStyle(color: Colors.blue[800], fontWeight: FontWeight.bold, fontSize: 12)),
    );
  }
}
