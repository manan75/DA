import type { WeatherCache } from '../types';

const generateDailyForecast = (startDate: Date, days: number) => {
  return Array.from({ length: days }, (_, i) => {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);
    const tempMax = 30 + Math.sin(i / 3) * 5 + Math.random() * 2;
    const tempMin = 25 + Math.cos(i / 3) * 3 + Math.random() * 2;
    const totalPrecipMm = Math.max(0, Math.random() * 20 - 10);
    return {
      date: date.toISOString().split('T')[0],
      tempMax: parseFloat(tempMax.toFixed(1)),
      tempMin: parseFloat(tempMin.toFixed(1)),
      totalPrecipMm: parseFloat(totalPrecipMm.toFixed(1)),
      maxPrecipMmHr: parseFloat((totalPrecipMm * Math.random() * 0.8).toFixed(1)),
      maxWindMs: parseFloat((10 + Math.random() * 10).toFixed(1)),
      maxGustMs: parseFloat((15 + Math.random() * 15).toFixed(1)),
      predominantWindDeg: Math.floor(Math.random() * 360),
      predominantWindCardinal: ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'][Math.floor(Math.random() * 8)],
    };
  });
};

const generateThreats = (forecasts: ReturnType<typeof generateDailyForecast>) => {
    const threats = [];
    if (Math.random() > 0.5) {
        const riskyDay = forecasts[Math.floor(Math.random() * 8) + 2];
        threats.push({
            date: riskyDay.date,
            type: "Gale-force Winds",
            severity: "High" as const,
            detail: `Max sustained wind ${riskyDay.maxWindMs} m/s`
        });
    }
    if (Math.random() > 0.6) {
        const rainyDay = forecasts.find(f => f.totalPrecipMm > 15) || forecasts[Math.floor(Math.random() * 8) + 4];
        threats.push({
            date: rainyDay.date,
            type: "Heavy Rainfall",
            severity: "Medium" as const,
            detail: `Total precipitation of ${rainyDay.totalPrecipMm} mm expected.`
        });
    }
    return threats;
}

export const mockWeatherCache: WeatherCache = {
  "Mumbai": {
    name: "Mumbai",
    coords: [19.0760, 72.8777],
    daily: generateDailyForecast(new Date(), 16),
    localThreats: generateThreats(generateDailyForecast(new Date(), 16)),
    ai: {
      enabled: true,
      model: "gemini-2.0-flash",
      summary: "Expect intermittent heavy showers and strong southwesterly winds over the next week. Conditions may impact port operations on days with peak gusts.",
      structured: {
        overview: "The forecast indicates a typical monsoon pattern with moderate to heavy rainfall. Wind speeds will be elevated, posing a risk to small vessels.",
        key_days: [{ date: new Date(new Date().setDate(new Date().getDate() + 3)).toISOString().split('T')[0], reason: "Peak wind gusts and intense rainfall predicted." }],
        advisories: ["Advise small craft to remain in port.", "Monitor for localized flooding in low-lying areas."]
      }
    }
  },
  "Gujarat (Porbandar)": {
    name: "Gujarat (Porbandar)",
    coords: [21.6417, 69.6293],
    daily: generateDailyForecast(new Date(), 16),
    localThreats: generateThreats(generateDailyForecast(new Date(), 16)),
    ai: {
      enabled: true,
      model: "gemini-2.0-flash",
      summary: "Generally clear conditions with moderate winds. Low risk of significant weather events. Ideal for most maritime activities.",
      structured: {
        overview: "A stable weather pattern is expected. Temperatures will remain high, and precipitation is unlikely.",
        key_days: [],
        advisories: ["Standard precautions for sun exposure are advised."]
      }
    }
  },
  "Kolkata": {
    name: "Kolkata",
    coords: [22.5726, 88.3639],
    daily: generateDailyForecast(new Date(), 16),
    localThreats: generateThreats(generateDailyForecast(new Date(), 16)),
    ai: {
      enabled: true,
      model: "gemini-2.0-flash",
      summary: "High probability of thunderstorms and heavy downpours in the latter half of the forecast period. Riverine and coastal areas should be on alert.",
      structured: {
        overview: "The initial part of the forecast is calm, but a low-pressure system is expected to bring severe weather later.",
        key_days: [{ date: new Date(new Date().setDate(new Date().getDate() + 9)).toISOString().split('T')[0], reason: "Formation of a cyclonic circulation bringing heavy rain." }],
        advisories: ["Ensure drainage systems are clear.", "Secure all loose equipment at ports and jetties."]
      }
    }
  },
    "Kanyakumari": {
    name: "Kanyakumari",
    coords: [8.0883, 77.5385],
    daily: generateDailyForecast(new Date(), 16),
    localThreats: generateThreats(generateDailyForecast(new Date(), 16)),
    ai: {
      enabled: true,
      model: "gemini-2.0-flash",
      summary: "Strong winds and high waves are expected throughout the forecast period due to convergence of seas. Caution is advised for all marine activities.",
      structured: {
        overview: "Consistent strong winds from the southwest will create choppy sea conditions. Precipitation will be sporadic.",
        key_days: [],
        advisories: ["Fishing operations should be conducted with extreme caution.", "Tourist boat services may be suspended."]
      }
    }
  },
   "Chennai": {
    name: "Chennai",
    coords: [13.0827, 80.2707],
    daily: generateDailyForecast(new Date(), 16),
    localThreats: [],
     ai: {
      enabled: true,
      model: "gemini-2.0-flash",
      summary: "Hot and humid conditions with a low chance of rain. Winds will be moderate, originating from the southeast.",
      structured: {
        overview: "The weather is expected to be stable with no significant threats. Temperatures will be the main concern.",
        key_days: [],
        advisories: ["Stay hydrated.", "Plan outdoor work during cooler parts of the day."]
      }
    }
  },
   "Visakhapatnam": {
    name: "Visakhapatnam",
    coords: [17.6868, 83.2185],
    daily: generateDailyForecast(new Date(), 16),
    localThreats: generateThreats(generateDailyForecast(new Date(), 16)),
     ai: {
      enabled: true,
      model: "gemini-2.0-flash",
      summary: "A developing weather system in the Bay of Bengal may bring heavy rain and strong winds towards the end of the forecast period. Monitor updates closely.",
      structured: {
        overview: "Calm conditions for the next few days, followed by a period of high alert as a potential storm system approaches.",
        key_days: [{ date: new Date(new Date().setDate(new Date().getDate() + 12)).toISOString().split('T')[0], reason: "Potential for a deep depression to form, leading to severe weather." }],
        advisories: ["Prepare for potential port closure.", "Review emergency preparedness plans."]
      }
    }
  },
};