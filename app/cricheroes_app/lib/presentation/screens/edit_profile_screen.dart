import 'package:flutter/material.dart';

class EditProfileScreen extends StatefulWidget {
  const EditProfileScreen({super.key});

  @override
  State<EditProfileScreen> createState() => _EditProfileScreenState();
}

class _EditProfileScreenState extends State<EditProfileScreen> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Edit Profile'), actions: [TextButton(onPressed: () {}, child: const Text('SAVE', style: TextStyle(color: Colors.white)))]),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(24.0),
        child: Column(
          children: [
            const CircleAvatar(radius: 50, child: Icon(Icons.camera_alt)),
            const SizedBox(height: 24),
            TextFormField(initialValue: 'John Doe', decoration: const InputDecoration(labelText: 'Full Name')),
            const SizedBox(height: 16),
            TextFormField(initialValue: 'john@example.com', decoration: const InputDecoration(labelText: 'Email')),
            const SizedBox(height: 16),
            DropdownButtonFormField(
              decoration: const InputDecoration(labelText: 'Batting Style'),
              items: ['Right Hand', 'Left Hand'].map((e) => DropdownMenuItem(value: e, child: Text(e))).toList(),
              onChanged: (v) {},
            ),
            const SizedBox(height: 16),
            TextFormField(initialValue: 'Mumbai, Maharashtra', decoration: const InputDecoration(labelText: 'Location')),
            const SizedBox(height: 16),
            TextFormField(decoration: const InputDecoration(labelText: 'Bio'), maxLines: 3),
          ],
        ),
      ),
    );
  }
}
