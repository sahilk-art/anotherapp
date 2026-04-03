import 'package:flutter/material.dart';

class PaymentScreen extends StatelessWidget {
  final double amount;
  const PaymentScreen({super.key, required this.amount});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Complete Payment')),
      body: Padding(
        padding: const EdgeInsets.all(24.0),
        child: Column(
          children: [
            const Text('Amount to Pay', style: TextStyle(color: Colors.grey)),
            Text('₹$amount', style: const TextStyle(fontSize: 36, fontWeight: FontWeight.bold)),
            const SizedBox(height: 40),
            ListTile(
              leading: const Icon(Icons.payment, color: Colors.blue),
              title: const Text('UPI / Cards / NetBanking'),
              subtitle: const Text('Secure payment via Razorpay'),
              trailing: const Icon(Icons.chevron_right),
              onTap: () {},
            ),
            const Spacer(),
            SizedBox(
              width: double.infinity,
              child: ElevatedButton(onPressed: () {}, child: const Text('PAY NOW')),
            )
          ],
        ),
      ),
    );
  }
}
