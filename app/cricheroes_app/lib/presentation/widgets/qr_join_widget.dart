import 'package:flutter/material.dart';
import 'package:qr_flutter/qr_flutter.dart';
import 'package:mobile_scanner/mobile_scanner.dart';

class QRJoinWidget extends StatelessWidget {
  final String teamName;
  final String inviteCode;

  const QRJoinWidget({
    super.key,
    required this.teamName,
    required this.inviteCode,
  });

  @override
  Widget build(BuildContext context) {
    final inviteLink = 'cricheroes://invite/team/$inviteCode';

    return Center(
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          const Text(
            'Scan to Join Team',
            style: TextStyle(fontSize: 22, fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 8),
          Text(
            teamName,
            style: TextStyle(fontSize: 16, color: Colors.grey[600]),
          ),
          const SizedBox(height: 30),
          Container(
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(20),
              boxShadow: [
                BoxShadow(color: Colors.black.withOpacity(0.1), blurRadius: 20, offset: const Offset(0, 10)),
              ],
            ),
            child: QrImageView(
              data: inviteLink,
              version: QrVersions.auto,
              size: 200.0,
            ),
          ),
          const SizedBox(height: 30),
          Text(
            'Invite Code: $inviteCode',
            style: const TextStyle(fontSize: 18, fontWeight: FontWeight.w500, letterSpacing: 2),
          ),
          const SizedBox(height: 40),
          ElevatedButton.icon(
            onPressed: () => _openScanner(context),
            icon: const Icon(Icons.qr_code_scanner),
            label: const Text('SCAN QR CODE'),
            style: ElevatedButton.styleFrom(
              backgroundColor: Colors.blue[900],
              foregroundColor: Colors.white,
              padding: const EdgeInsets.symmetric(horizontal: 40, vertical: 16),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(30)),
            ),
          ),
        ],
      ),
    );
  }

  void _openScanner(BuildContext context) {
    Navigator.of(context).push(
      MaterialPageRoute(
        builder: (context) => const QRScannerScreen(),
      ),
    );
  }
}

class QRScannerScreen extends StatefulWidget {
  const QRScannerScreen({super.key});

  @override
  State<QRScannerScreen> createState() => _QRScannerScreenState();
}

class _QRScannerScreenState extends State<QRScannerScreen> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Scan QR Code')),
      body: MobileScanner(
        onDetect: (capture) {
          final List<Barcode> barcodes = capture.barcodes;
          for (const barcode in barcodes) {
            debugPrint('Barcode found! ${barcode.rawValue}');
            if (barcode.rawValue != null) {
              Navigator.of(context).pop();
              _handleInviteLink(context, barcode.rawValue!);
              break;
            }
          }
        },
      ),
    );
  }

  void _handleInviteLink(BuildContext context, String link) {
    // Process deep link and show join confirmation
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text('Processing: $link')),
    );
  }
}
