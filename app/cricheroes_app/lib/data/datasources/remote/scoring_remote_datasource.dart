import 'package:socket_io_client/socket_io_client.dart' as IO;

class ScoringSocket {
  late IO.Socket socket;
  final String baseUrl = 'http://10.0.2.2:3005';

  void connect(String matchId, Function(dynamic) onScoreUpdate) {
    socket = IO.io(baseUrl, IO.OptionBuilder()
      .setTransports(['websocket'])
      .disableAutoConnect()
      .build());

    socket.connect();

    socket.onConnect((_) {
      print('Connected to scoring socket');
      socket.emit('join-match', {'matchId': matchId});
    });

    socket.on('score-update', (data) {
      onScoreUpdate(data);
    });

    socket.onDisconnect((_) => print('Disconnected from scoring socket'));
  }

  void recordBall(Map<String, dynamic> data) {
    socket.emit('record-ball', data);
  }

  void disconnect() {
    socket.disconnect();
  }
}
