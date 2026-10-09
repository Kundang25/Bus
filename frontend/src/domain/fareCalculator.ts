import { BusStop, FareCalculation, FareCategory, Route } from './types';

export const calculateFare = (
  route: Route,
  fromStop: BusStop,
  toStop: BusStop,
  passengerCount: number = 3,
  category: FareCategory = 'adult'
): FareCalculation => {
  const safeCount = Math.max(1, Math.min(10, passengerCount));
  
  // Calculate stages traveled
  const stagesTraveled = Math.abs(toStop.stageNumber - fromStop.stageNumber);
  
  // Base fare rules
  let baseUnit = route.baseFare;
  if (stagesTraveled > 2) {
    const additionalStages = stagesTraveled - 2;
    baseUnit += additionalStages * (route.farePerStage / 2);
  }

  // Apply Category Discounts
  let unitFare = baseUnit;
  if (category === 'women_free') {
    unitFare = 0;
  } else if (category === 'child' || category === 'student') {
    unitFare = Math.ceil((baseUnit * 0.5) / 5) * 5;
  } else if (category === 'senior') {
    unitFare = Math.ceil((baseUnit * 0.75) / 5) * 5;
  } else {
    unitFare = Math.ceil(baseUnit / 5) * 5;
  }

  if (category !== 'women_free' && unitFare < 5) {
    unitFare = 5;
  }

  const subtotal = baseUnit * safeCount;
  const totalFare = unitFare * safeCount;
  const discount = subtotal - totalFare;

  return {
    fromStop,
    toStop,
    stagesTraveled,
    category,
    unitFare,
    passengerCount: safeCount,
    subtotal,
    discount,
    totalFare
  };
};

export const calculateCashChange = (totalFare: number, cashTendered: number) => {
  if (cashTendered < totalFare) {
    return {
      isValid: false,
      shortage: totalFare - cashTendered,
      changeDue: 0
    };
  }
  return {
    isValid: true,
    shortage: 0,
    changeDue: cashTendered - totalFare
  };
};
