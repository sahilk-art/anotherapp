import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Venue extends Document {
  @Prop({ required: true }) name: string;
  @Prop() address: string;
  @Prop({ required: true }) city: string;
  @Prop() state: string;
  @Prop({ default: 'India' }) country: string;
  @Prop({ type: { type: String, enum: ['Point'], default: 'Point' }, coordinates: [Number] }) coordinates: { type: string; coordinates: number[] };
  @Prop({ type: [String] }) photos: string[];
  @Prop({ type: [String] }) facilities: string[];
  @Prop({ type: [String] }) pitchType: string[];
  @Prop({ type: Object }) boundarySize: { straight: number; square: number };
  @Prop() capacity: number;
  @Prop() pricePerHour: number;
  @Prop({ default: 0 }) rating: number;
  @Prop({ default: true }) isActive: boolean;
}

export const VenueSchema = SchemaFactory.createForClass(Venue);
VenueSchema.index({ coordinates: '2dsphere' });
VenueSchema.index({ name: 'text' });
