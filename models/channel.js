import { Schema, model } from 'mongoose';

const ChannelSchema = new Schema({
  method: { type: String },
  cid: { unique: true, type: Number, require: true },
  city: {
    lat: { type: Number },
    long: { type: Number },
    name: { type: String },
    timeZone: { type: String },
  },
});

const Channel = model('Channel', ChannelSchema);

export default Channel;
