import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:equatable/equatable.dart';
import '../../core/network/api_client.dart';
import '../../data/datasources/remote/scoring_remote_datasource.dart';

abstract class ScoringEvent extends Equatable {
  @override
  List<Object?> get props => [];
}

class InitScoring extends ScoringEvent {
  final String matchId;
  InitScoring(this.matchId);
  @override
  List<Object?> get props => [matchId];
}

class RecordBall extends ScoringEvent {
  final Map<String, dynamic> ballData;
  RecordBall(this.ballData);
  @override
  List<Object?> get props => [ballData];
}

class UndoBall extends ScoringEvent {
  final String matchId;
  UndoBall(this.matchId);
  @override
  List<Object?> get props => [matchId];
}

class UpdateScore extends ScoringEvent {
  final dynamic inningsData;
  UpdateScore(this.inningsData);
  @override
  List<Object?> get props => [inningsData];
}

abstract class ScoringState extends Equatable {
  @override
  List<Object?> get props => [];
}

class ScoringInitial extends ScoringState {}
class ScoringLoading extends ScoringState {}
class ScoringActive extends ScoringState {
  final dynamic innings;
  ScoringActive(this.innings);
  @override
  List<Object?> get props => [innings];
}

class ScoringError extends ScoringState {
  final String message;
  ScoringError(this.message);
  @override
  List<Object?> get props => [message];
}

class ScoringBloc extends Bloc<ScoringEvent, ScoringState> {
  final ApiClient apiClient;
  final ScoringSocket socket;

  ScoringBloc({required this.apiClient, required this.socket}) : super(ScoringInitial()) {
    on<InitScoring>((event, emit) async {
      emit(ScoringLoading());
      try {
        socket.connect(event.matchId, (data) {
          add(UpdateScore(data));
        });

        final response = await apiClient.getCurrentScoringState(event.matchId);
        if (response.success) {
          emit(ScoringActive(response.data));
        } else {
          emit(ScoringError(response.message));
        }
      } catch (e) {
        emit(ScoringError(e.toString()));
      }
    });

    on<RecordBall>((event, emit) {
      try {
        socket.recordBall(event.ballData);
      } catch (e) {
        emit(ScoringError('Failed to record ball: ${e.toString()}'));
      }
    });

    on<UndoBall>((event, emit) {
      try {
        socket.undoBall(event.matchId);
      } catch (e) {
        emit(ScoringError('Failed to undo ball: ${e.toString()}'));
      }
    });

    on<UpdateScore>((event, emit) {
      emit(ScoringActive(event.inningsData));
    });
  }

  @override
  Future<void> close() {
    socket.disconnect();
    return super.close();
  }
}
