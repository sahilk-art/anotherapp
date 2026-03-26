import 'package:dartz/dartz.dart';
import '../../core/errors/failures.dart';
import '../entities/user.dart';

abstract class AuthRepository {
  Future<Either<Failure, User>> login(String phone, String otp);
  Future<Either<Failure, User>> register(String phone, String name, String email);
  Future<Either<Failure, void>> logout();
}
