import { CalculationMethod, Coordinates, PrayerTimes } from 'adhan';
import moment from 'moment-timezone';

const getMethod = (method) => {
  switch (method) {
    case 'MuslimWorldLeague':
      return CalculationMethod.MuslimWorldLeague();
    case 'Egyptian':
      return CalculationMethod.Egyptian();
    case 'Karachi':
      return CalculationMethod.Karachi();
    case 'UmmAlQura':
      return CalculationMethod.UmmAlQura();
    case 'Dubai':
      return CalculationMethod.Dubai();
    case 'Qatar':
      return CalculationMethod.Qatar();
    case 'Kuwait':
      return CalculationMethod.Kuwait();
    case 'Singapore':
      return CalculationMethod.Singapore();
    case 'Turkey':
      return CalculationMethod.Turkey();
    case 'Tehran':
      return CalculationMethod.Tehran();
    case 'NorthAmerica':
      return CalculationMethod.NorthAmerica();
    default:
      return CalculationMethod.Other();
  }
};

export const dateToTimeZone = (date, tz, language) => {
  moment.locale(language);
  return moment(date).tz(tz).format('h:mm A');
};
export default (lat, long, method) => {
  const coordinates = new Coordinates(lat, long);
  const params = getMethod(method);
  const date = new Date();
  return new PrayerTimes(coordinates, date, params);
};
