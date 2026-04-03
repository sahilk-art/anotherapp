import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Venue } from './schemas/venue.schema';

@Injectable()
export class VenueService {
  constructor(@InjectModel(Venue.name) private venueModel: Model<Venue>) {}

  async create(data: any) { return new this.venueModel(data).save(); }
  async findAll() { return this.venueModel.find().exec(); }
  async findOne(id: string) { return this.venueModel.findById(id).exec(); }
  async search(q: string) { return this.venueModel.find({ name: new RegExp(q, 'i') }).exec(); }
}
