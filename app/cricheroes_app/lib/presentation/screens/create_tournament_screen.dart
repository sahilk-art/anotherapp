import 'package:flutter/material.dart';

class CreateTournamentScreen extends StatefulWidget {
  const CreateTournamentScreen({super.key});

  @override
  State<CreateTournamentScreen> createState() => _CreateTournamentScreenState();
}

class _CreateTournamentScreenState extends State<CreateTournamentScreen> {
  int _currentStep = 0;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Organize Tournament')),
      body: Stepper(
        currentStep: _currentStep,
        onStepContinue: () {
          if (_currentStep < 2) setState(() => _currentStep++);
        },
        onStepCancel: () {
          if (_currentStep > 0) setState(() => _currentStep--);
        },
        steps: [
          Step(
            title: const Text('Basic Info'),
            content: Column(
              children: [
                TextFormField(decoration: const InputDecoration(labelText: 'Tournament Name')),
                const SizedBox(height: 16),
                TextFormField(decoration: const InputDecoration(labelText: 'Short Name')),
                const SizedBox(height: 16),
                DropdownButtonFormField(
                  decoration: const InputDecoration(labelText: 'Format'),
                  items: ['League', 'Knockout', 'League + Knockout'].map((e) => DropdownMenuItem(value: e, child: Text(e))).toList(),
                  onChanged: (v) {},
                ),
              ],
            ),
          ),
          Step(
            title: const Text('Match Settings'),
            content: Column(
              children: [
                TextFormField(decoration: const InputDecoration(labelText: 'Total Overs')),
                const SizedBox(height: 16),
                TextFormField(decoration: const InputDecoration(labelText: 'Overs per Bowler')),
                const SizedBox(height: 16),
                DropdownButtonFormField(
                  decoration: const InputDecoration(labelText: 'Ball Type'),
                  items: ['Leather', 'Tennis', 'Other'].map((e) => DropdownMenuItem(value: e, child: Text(e))).toList(),
                  onChanged: (v) {},
                ),
              ],
            ),
          ),
          Step(
            title: const Text('Venue & Dates'),
            content: Column(
              children: [
                TextFormField(decoration: const InputDecoration(labelText: 'City')),
                const SizedBox(height: 16),
                TextFormField(decoration: const InputDecoration(labelText: 'Start Date')),
                const SizedBox(height: 16),
                TextFormField(decoration: const InputDecoration(labelText: 'Entry Fee')),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
