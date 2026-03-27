import 'package:flutter/material.dart';

class CreateTeamScreen extends StatelessWidget {
  const CreateTeamScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Create a Team')),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(24.0),
        child: Column(
          children: [
            const Center(
              child: Stack(
                children: [
                  CircleAvatar(radius: 60, child: Icon(Icons.group, size: 60)),
                  Positioned(bottom: 0, right: 0, child: CircleAvatar(radius: 20, backgroundColor: Colors.blue, child: Icon(Icons.camera_alt, color: Colors.white, size: 18))),
                ],
              ),
            ),
            const SizedBox(height: 32),
            TextFormField(decoration: const InputDecoration(labelText: 'Team Name')),
            const SizedBox(height: 16),
            TextFormField(decoration: const InputDecoration(labelText: 'Short Name (Max 5 chars)')),
            const SizedBox(height: 16),
            TextFormField(decoration: const InputDecoration(labelText: 'City')),
            const SizedBox(height: 16),
            TextFormField(decoration: const InputDecoration(labelText: 'Description'), maxLines: 3),
            const SizedBox(height: 32),
            SizedBox(
              width: double.infinity,
              child: ElevatedButton(onPressed: () {}, child: const Text('CREATE TEAM')),
            ),
          ],
        ),
      ),
    );
  }
}
