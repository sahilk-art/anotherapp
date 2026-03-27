import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:equatable/equatable.dart';
import '../../domain/entities/user.dart';
import '../../core/network/api_client.dart';
import 'package:shared_preferences/shared_preferences.dart';

abstract class AuthEvent extends Equatable {
  @override
  List<Object> get props => [];
}

class LoginRequested extends AuthEvent {
  final String phone;
  final String otp;
  LoginRequested(this.phone, this.otp);
}

class RegisterRequested extends AuthEvent {
  final Map<String, dynamic> data;
  RegisterRequested(this.data);
}

abstract class AuthState extends Equatable {
  @override
  List<Object> get props => [];
}

class AuthInitial extends AuthState {}
class AuthLoading extends AuthState {}
class AuthAuthenticated extends AuthState {
  final User user;
  AuthAuthenticated(this.user);
}
class AuthError extends AuthState {
  final String message;
  AuthError(this.message);
}

class AuthBloc extends Bloc<AuthEvent, AuthState> {
  final ApiClient apiClient;
  final SharedPreferences prefs;

  AuthBloc({required this.apiClient, required this.prefs}) : super(AuthInitial()) {
    on<LoginRequested>((event, emit) async {
      emit(AuthLoading());
      try {
        final response = await apiClient.login(event.phone, event.otp);
        await prefs.setString('accessToken', response.data['accessToken']);
        await prefs.setString('refreshToken', response.data['refreshToken']);
        final user = User(id: response.data['user']['id'], fullName: 'User', phone: event.phone);
        emit(AuthAuthenticated(user));
      } catch (e) {
        emit(AuthError(e.toString()));
      }
    });

    on<RegisterRequested>((event, emit) async {
      emit(AuthLoading());
      try {
        final response = await apiClient.register(event.data);
        await prefs.setString('accessToken', response.data['accessToken']);
        final user = User(id: response.data['user']['id'], fullName: event.data['fullName'], phone: event.data['phone']);
        emit(AuthAuthenticated(user));
      } catch (e) {
        emit(AuthError(e.toString()));
      }
    });
  }
}
