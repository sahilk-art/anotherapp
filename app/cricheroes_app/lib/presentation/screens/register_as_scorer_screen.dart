import 'package:flutter/material.dart';

class RegisterAsScorerScreen extends StatefulWidget {
  const RegisterAsScorerScreen({super.key});

  @override
  State<RegisterAsScorerScreen> createState() => _RegisterAsScorerScreenState();
}

class _RegisterAsScorerScreenState extends State<RegisterAsScorerScreen> {
  String _experience = 'BEGINNER';

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Register as Scorer')),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(24.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text('Experience Level', style: TextStyle(fontWeight: FontWeight.bold)),
            DropdownButtonFormField<String>(
              value: _experience,
              items: ['BEGINNER', 'INTERMEDIATE', 'EXPERT'].map((e) => DropdownMenuItem(value: e, child: Text(e))).toList(),
              onChanged: (v) => setState(() => _experience = v!),
            ),
            const SizedBox(height: 24),
            const Text('Per Match Fee (INR)', style: TextStyle(fontWeight: FontWeight.bold)),
            TextFormField(keyboardType: TextInputType.number, decoration: const InputDecoration(hintText: 'e.g. 500')),
            const SizedBox(height: 24),
            const Text('Availability', style: TextStyle(fontWeight: FontWeight.bold)),
            Wrap(
              spacing: 8,
              children: ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'].map((d) => FilterChip(label: Text(d), onSelected: (v) {}, selected: false)).toList(),
            ),
            const SizedBox(height: 40),
            SizedBox(
              width: double.infinity,
              child: ElevatedButton(onPressed: () => Navigator.pop(context), child: const Text('SUBMIT APPLICATION')),
            )
          ],
        ),
      ),
    );
  }
}
