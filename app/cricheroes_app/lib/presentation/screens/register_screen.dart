import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

class RegisterScreen extends StatefulWidget {
  const RegisterScreen({super.key});

  @override
  State<RegisterScreen> createState() => _RegisterScreenState();
}

class _RegisterScreenState extends State<RegisterScreen> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Create Profile')),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(24.0),
        child: Column(
          children: [
            const CircleAvatar(radius: 50, child: Icon(Icons.person_add, size: 50)),
            const SizedBox(height: 32),
            TextFormField(decoration: const InputDecoration(labelText: 'Full Name*')),
            const SizedBox(height: 16),
            TextFormField(decoration: const InputDecoration(labelText: 'Email')),
            const SizedBox(height: 16),
            const Text('Gender', style: TextStyle(fontWeight: FontWeight.bold)),
            Row(
              children: [
                ChoiceChip(label: const Text('Male'), selected: true, onSelected: (v) {}),
                const SizedBox(width: 8),
                ChoiceChip(label: const Text('Female'), selected: false, onSelected: (v) {}),
              ],
            ),
            const SizedBox(height: 16),
            const Text('Player Type', style: TextStyle(fontWeight: FontWeight.bold)),
            Wrap(
              spacing: 8,
              children: ['Batsman', 'Bowler', 'All-rounder', 'Wicket Keeper'].map((e) => ChoiceChip(label: Text(e), selected: false, onSelected: (v) {})).toList(),
            ),
            const SizedBox(height: 32),
            SizedBox(
              width: double.infinity,
              child: ElevatedButton(onPressed: () => context.go('/home'), child: const Text('REGISTER')),
            ),
          ],
        ),
      ),
    );
  }
}
