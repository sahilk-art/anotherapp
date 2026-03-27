import 'package:flutter/material.dart';

class CreateMatchScreen extends StatefulWidget {
  const CreateMatchScreen({super.key});

  @override
  State<CreateMatchScreen> createState() => _CreateMatchScreenState();
}

class _CreateMatchScreenState extends State<CreateMatchScreen> {
  int _currentStep = 0;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Start a Match')),
      body: Stepper(
        type: StepperType.horizontal,
        currentStep: _currentStep,
        onStepContinue: () {
          if (_currentStep < 3) setState(() => _currentStep++);
        },
        onStepCancel: () {
          if (_currentStep > 0) setState(() => _currentStep--);
        },
        steps: [
          Step(
            title: const Text('Format'),
            content: _buildFormatStep(),
            isActive: _currentStep >= 0,
          ),
          Step(
            title: const Text('Teams'),
            content: _buildTeamsStep(),
            isActive: _currentStep >= 1,
          ),
          Step(
            title: const Text('Rules'),
            content: _buildRulesStep(),
            isActive: _currentStep >= 2,
          ),
          Step(
            title: const Text('Toss'),
            content: _buildTossStep(),
            isActive: _currentStep >= 3,
          ),
        ],
      ),
    );
  }

  Widget _buildFormatStep() {
    return Column(
      children: [
        DropdownButtonFormField(
          decoration: const InputDecoration(labelText: 'Match Type'),
          items: ['T20', 'ODI', 'Test', 'T10', 'Custom'].map((e) => DropdownMenuItem(value: e, child: Text(e))).toList(),
          onChanged: (v) {},
        ),
        const SizedBox(height: 16),
        TextFormField(decoration: const InputDecoration(labelText: 'Total Overs')),
        const SizedBox(height: 16),
        TextFormField(decoration: const InputDecoration(labelText: 'Players per Side')),
      ],
    );
  }

  Widget _buildTeamsStep() {
    return Column(
      children: [
        _selectTeamTile('Team A'),
        const SizedBox(height: 16),
        const Text('VS', style: TextStyle(fontWeight: FontWeight.bold)),
        const SizedBox(height: 16),
        _selectTeamTile('Team B'),
      ],
    );
  }

  Widget _selectTeamTile(String label) {
    return ListTile(
      leading: const CircleAvatar(child: Icon(Icons.group)),
      title: Text(label),
      subtitle: const Text('Tap to select team'),
      trailing: const Icon(Icons.search),
      shape: RoundedRectangleBorder(side: BorderSide(color: Colors.grey[300]!), borderRadius: BorderRadius.circular(8)),
      onTap: () {},
    );
  }

  Widget _buildRulesStep() {
    return Column(
      children: [
        SwitchListTile(title: const Text('Free Hit on No Ball'), value: true, onChanged: (v) {}),
        SwitchListTile(title: const Text('Leg Bye Enabled'), value: true, onChanged: (v) {}),
        SwitchListTile(title: const Text('Bye Enabled'), value: true, onChanged: (v) {}),
      ],
    );
  }

  Widget _buildTossStep() {
    return Column(
      children: [
        const Text('Who won the toss?'),
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceAround,
          children: [
            ChoiceChip(label: const Text('Team A'), selected: true, onSelected: (v) {}),
            ChoiceChip(label: const Text('Team B'), selected: false, onSelected: (v) {}),
          ],
        ),
        const SizedBox(height: 24),
        const Text('Winner chose to?'),
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceAround,
          children: [
            ChoiceChip(label: const Text('BAT'), selected: true, onSelected: (v) {}),
            ChoiceChip(label: const Text('BOWL'), selected: false, onSelected: (v) {}),
          ],
        ),
      ],
    );
  }
}
