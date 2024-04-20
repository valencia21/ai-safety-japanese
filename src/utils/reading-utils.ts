import { supabase } from "../supabase-client";

export const fetchReadings = async () => {
  console.log("fetchReadings");
  const { data, error } = await supabase.from("reading_overview").select("*");
  if (error) {
    console.error("Error fetching readings:", error);
    throw error;
  }
  console.log("data", data);
  return data;
};

export const fetchSessions = async () => {
  console.log("fetchSessions");
  const { data, error } = await supabase.from("session_overview").select("*");
  if (error) {
    console.error("Error fetching sessions:", error);
    throw error;
  }
  console.log("session data", data);
  return data;
};

export const groupReadingsBySession = (readings: any[]) => {
  return readings.reduce((acc, reading) => {
    const sessionNumber = reading.session_number || 1;
    if (sessionNumber) {
      if (!acc[sessionNumber]) {
        acc[sessionNumber] = {
          requiredReadings: [],
          recommendedReadings: [],
        };
      }
      if (reading.required_reading === true) {
        acc[sessionNumber].requiredReadings.push(reading);
      } else {
        acc[sessionNumber].recommendedReadings.push(reading);
      }
    }
    return acc;
  }, {} as { [key: number]: { requiredReadings: any[]; recommendedReadings: any[] } });
};
