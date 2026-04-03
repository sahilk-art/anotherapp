import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../presentation/screens/splash_screen.dart';
import '../presentation/screens/onboarding_screen.dart';
import '../presentation/screens/login_screen.dart';
import '../presentation/screens/register_screen.dart';
import '../presentation/screens/main_screen.dart';
import '../presentation/screens/scoring_screen.dart';
import '../presentation/screens/match_detail_screen.dart';
import '../presentation/screens/create_match_screen.dart';
import '../presentation/screens/tournament_detail_screen.dart';
import '../presentation/screens/create_team_screen.dart';
import '../presentation/screens/create_tournament_screen.dart';
import '../presentation/screens/search_screen.dart';
import '../presentation/screens/notifications_screen.dart';
import '../presentation/screens/settings_screen.dart';
import '../presentation/screens/edit_profile_screen.dart';
import '../presentation/screens/fall_of_wicket_screen.dart';
import '../presentation/screens/select_bowler_screen.dart';
import '../presentation/screens/create_post_screen.dart';
import '../presentation/screens/payment_screen.dart';
import '../presentation/screens/subscription_screen.dart';
import '../presentation/screens/player_comparison_screen.dart';
import '../presentation/screens/go_live_screen.dart';
import '../presentation/screens/watch_live_screen.dart';
import '../presentation/screens/register_as_scorer_screen.dart';
import '../presentation/screens/find_scorer_screen.dart';
import '../presentation/screens/commentary_screen.dart';
import '../presentation/screens/highlights_screen.dart';
import '../presentation/screens/maintenance_screen.dart';

final appRouter = GoRouter(
  initialLocation: '/splash',
  routes: [
    GoRoute(path: '/splash', builder: (context, state) => const SplashScreen()),
    GoRoute(path: '/onboarding', builder: (context, state) => const OnboardingScreen()),
    GoRoute(path: '/login', builder: (context, state) => const LoginScreen()),
    GoRoute(path: '/register', builder: (context, state) => const RegisterScreen()),
    GoRoute(path: '/home', builder: (context, state) => const MainScreen()),
    GoRoute(path: '/search', builder: (context, state) => const SearchScreen()),
    GoRoute(path: '/notifications', builder: (context, state) => const NotificationsScreen()),
    GoRoute(path: '/settings', builder: (context, state) => const SettingsScreen()),
    GoRoute(path: '/profile/edit', builder: (context, state) => const EditProfileScreen()),
    GoRoute(path: '/compare', builder: (context, state) => const PlayerComparisonScreen()),
    GoRoute(path: '/payments', builder: (context, state) => const PaymentScreen(amount: 499)),
    GoRoute(path: '/subscriptions', builder: (context, state) => const SubscriptionScreen()),
    GoRoute(path: '/scoring/new', builder: (context, state) => const CreateMatchScreen()),
    GoRoute(path: '/scoring/:matchId', builder: (context, state) => ScoringScreen(matchId: state.pathParameters['matchId']!)),
    GoRoute(path: '/scoring/:matchId/wicket', builder: (context, state) => const FallOfWicketScreen()),
    GoRoute(path: '/scoring/:matchId/bowler', builder: (context, state) => const SelectBowlerScreen()),
    GoRoute(path: '/scoring/:matchId/live', builder: (context, state) => GoLiveScreen(matchId: state.pathParameters['matchId']!)),
    GoRoute(path: '/match/:id', builder: (context, state) => const MatchDetailScreen()),
    GoRoute(path: '/match/:id/watch', builder: (context, state) => WatchLiveScreen(matchId: state.pathParameters['id']!)),
    GoRoute(path: '/match/:id/commentary', builder: (context, state) => CommentaryScreen(matchId: state.pathParameters['id']!)),
    GoRoute(path: '/match/:id/highlights', builder: (context, state) => HighlightsScreen(matchId: state.pathParameters['id']!)),
    GoRoute(path: '/team/new', builder: (context, state) => const CreateTeamScreen()),
    GoRoute(path: '/tournament/new', builder: (context, state) => const CreateTournamentScreen()),
    GoRoute(path: '/tournament/:id', builder: (context, state) => const TournamentDetailScreen()),
    GoRoute(path: '/post/new', builder: (context, state) => const CreatePostScreen()),
    GoRoute(path: '/register-as-scorer', builder: (context, state) => const RegisterAsScorerScreen()),
    GoRoute(path: '/find-scorers', builder: (context, state) => const FindScorerScreen()),
    GoRoute(path: '/maintenance', builder: (context, state) => const MaintenanceScreen(message: '')),
  ],
);
