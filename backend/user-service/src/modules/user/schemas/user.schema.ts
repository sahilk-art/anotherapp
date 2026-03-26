import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { UserRole, Gender, BattingStyle, BowlingStyle, PlayerType } from '../../../../shared/enums';

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ required: true, unique: true, index: true })
  phone: string;

  @Prop({ unique: true, sparse: true, index: true })
  email: string;

  @Prop()
  password?: string;

  @Prop({ required: true })
  fullName: string;

  @Prop()
  displayName: string;

  @Prop()
  avatar?: string;

  @Prop()
  coverPhoto?: string;

  @Prop()
  dateOfBirth?: Date;

  @Prop({ type: String, enum: Gender })
  gender?: Gender;

  @Prop({ maxlength: 500 })
  bio?: string;

  @Prop({ type: String, enum: UserRole, default: UserRole.PLAYER })
  role: UserRole;

  @Prop({ type: String, enum: BattingStyle })
  battingStyle?: BattingStyle;

  @Prop({ type: String, enum: BowlingStyle })
  bowlingStyle?: BowlingStyle;

  @Prop({ type: String, enum: PlayerType })
  playerType?: PlayerType;

  @Prop({ type: Object })
  location: {
    city: string;
    state: string;
    country: string;
    coordinates: { type: string; coordinates: number[] };
  };

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Team' }] })
  teams: Types.ObjectId[];

  @Prop({ default: 0 })
  followersCount: number;

  @Prop({ default: 0 })
  followingCount: number;

  @Prop({ default: 0 })
  matchesPlayed: number;

  @Prop({ default: false })
  isVerified: boolean;

  @Prop({ default: false })
  isProfileComplete: boolean;

  @Prop({ default: true })
  isActive: boolean;

  @Prop()
  lastActiveAt?: Date;

  @Prop({ type: [String] })
  fcmTokens: string[];

  @Prop({ type: Object, default: { language: 'en', pushNotifications: true, matchReminders: true, privateProfile: false } })
  settings: {
    language: string;
    pushNotifications: boolean;
    matchReminders: boolean;
    privateProfile: boolean;
  };

  @Prop({ type: Object })
  socialLinks: {
    instagram: string;
    twitter: string;
    youtube: string;
  };
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.index({ 'location.coordinates': '2dsphere' });
UserSchema.index({ fullName: 'text', displayName: 'text' });
