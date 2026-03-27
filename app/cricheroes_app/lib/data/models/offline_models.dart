import 'package:hive_flutter/hive_flutter.dart';

class OfflineMatch {
  final String localId;
  final String? serverId;
  final Map<String, dynamic> matchData;
  final bool isSynced;

  OfflineMatch({required this.localId, this.serverId, required this.matchData, this.isSynced = false});
}

class OfflineBall {
  final String localId;
  final String matchLocalId;
  final Map<String, dynamic> ballData;
  final int sequence;
  final bool isSynced;

  OfflineBall({required this.localId, required this.matchLocalId, required this.ballData, required this.sequence, this.isSynced = false});
}

class SyncItem {
  final String id;
  final String endpoint;
  final String method;
  final Map<String, dynamic> payload;
  final String status;

  SyncItem({required this.id, required this.endpoint, required this.method, required this.payload, required this.status});
}
