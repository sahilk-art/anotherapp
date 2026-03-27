import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:equatable/equatable.dart';
import '../../core/network/api_client.dart';
import '../../data/datasources/remote/scoring_remote_datasource.dart';

abstract class ScoringEvent extends Equatable {
  @override
  List<Object> get props => [];
}

class InitScoring extends ScoringEvent {
  final String matchId;
  InitScoring(this.matchId);
}

class RecordBall extends ScoringEvent {
  final Map<String, dynamic> ballData;
  RecordBall(this.ballData);
}

class UpdateScore extends ScoringEvent {
  final dynamic inningsData;
  UpdateScore(this.inningsData);
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

class ScoringBloc extends Bloc<ScoringEvent, ScoringState> {
  final ApiClient apiClient;
  final ScoringSocket socket;

  ScoringBloc({required this.apiClient, required this.socket}) : super(ScoringInitial()) {
    on<InitScoring>((event, emit) async {
      emit(ScoringLoading());
      socket.connect(event.matchId, (data) {
        add(UpdateScore(data));
      });
      final response = await apiClient.getMatchDetails(event.matchId);
      emit(ScoringActive(response.data));
    });

    on<RecordBall>((event, emit) {
      socket.recordBall(event.ballData);
    });

    on<UpdateScore>((event, emit) {
      emit(ScoringActive(event.inningsData));
    });
  }
}
