import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:dio/dio.dart';
import 'app/routes/app_router.dart';
import 'core/theme/app_theme.dart';
import 'core/network/api_client.dart';
import 'data/datasources/remote/scoring_remote_datasource.dart';
import 'presentation/blocs/auth_bloc.dart';
import 'presentation/blocs/scoring_bloc.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  final prefs = await SharedPreferences.getInstance();
  final apiClient = ApiClient(dio: Dio(), sharedPreferences: prefs);
  final scoringSocket = ScoringSocket();

  runApp(CricHeroesApp(apiClient: apiClient, prefs: prefs, scoringSocket: scoringSocket));
}

class CricHeroesApp extends StatelessWidget {
  final ApiClient apiClient;
  final SharedPreferences prefs;
  final ScoringSocket scoringSocket;

  const CricHeroesApp({super.key, required this.apiClient, required this.prefs, required this.scoringSocket});

  @override
  Widget build(BuildContext context) {
    return MultiBlocProvider(
      providers: [
        BlocProvider(create: (_) => AuthBloc(apiClient: apiClient, prefs: prefs)),
        BlocProvider(create: (_) => ScoringBloc(apiClient: apiClient, socket: scoringSocket)),
      ],
      child: MaterialApp.router(
        title: 'CricHeroes',
        debugShowCheckedModeBanner: false,
        theme: AppTheme.lightTheme,
        routerConfig: appRouter,
      ),
    );
  }
}
