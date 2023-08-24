import { Schema, model } from 'mongoose';

const ChannelSchema = new Schema({
  notify: { type: Boolean, default: true },
  method: { type: String, default: 'UmmAlQura' },
  cid: { unique: true, type: Number, require: true },
  city: {
    lat: { type: Number, default: 21.42251 },
    long: { type: Number, default: 39.826168 },
    name: { type: String, default: 'مكة المكرمة' },
    timeZone: { type: String, default: 'Asia/Riyadh' },
  },
});

const Channel = model('Channel', ChannelSchema);

export default Channel;
