import 'package:connectivity_plus/connectivity_plus.dart';
import 'package:dio/dio.dart';
import 'package:hive/hive.dart';
import '../../core/network/api_client.dart';

enum SyncStatus { pending, syncing, synced, failed }

class SyncManager {
  final ApiClient apiClient;
  final Box syncBox;

  SyncManager(this.apiClient, this.syncBox) {
    Connectivity().onConnectivityChanged.listen((result) {
      if (result != ConnectivityResult.none) {
        processQueue();
      }
    });
  }

  Future<void> addToQueue(String endpoint, String method, Map<String, dynamic> payload) async {
    final id = DateTime.now().millisecondsSinceEpoch.toString();
    await syncBox.put(id, {
      'endpoint': endpoint,
      'method': method,
      'payload': payload,
      'status': 'PENDING',
      'createdAt': DateTime.now().toIso8601String(),
    });
    processQueue();
  }

  Future<void> processQueue() async {
    final connectivity = await Connectivity().checkConnectivity();
    if (connectivity == ConnectivityResult.none) return;

    final keys = syncBox.keys.toList();
    for (var key in keys) {
      final item = syncBox.get(key);
      if (item['status'] == 'SYNCED') continue;

      try {
        await _syncItem(item);
        await syncBox.put(key, {...item, 'status': 'SYNCED'});
      } catch (e) {
        print('Sync failed for $key: $e');
      }
    }
  }

  Future<void> _syncItem(dynamic item) async {
    final method = item['method'];
    final endpoint = item['endpoint'];
    final payload = item['payload'];

    if (method == 'POST') {
      await apiClient.dio.post(endpoint, data: payload);
    } else if (method == 'PUT') {
      await apiClient.dio.put(endpoint, data: payload);
    }
  }
}
