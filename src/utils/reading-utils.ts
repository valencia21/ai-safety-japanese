import { supabase, initializeProject } from "../supabase-client";
import { currentProject } from '../config/project';

export const fetchReadings = async () => {
  console.log("Attempting to fetch readings for project:", currentProject.id);
  
  try {
    await initializeProject();
    
    const { data, error } = await supabase
      .from("reading_overview")
      .select("*")
      .eq('project_id', currentProject.id)
      .order('order', { ascending: true })
      .throwOnError();

    if (error) {
      console.error("Supabase error:", error);
      throw error;
    }

    console.log("Successfully fetched readings:", data);
    return data;
  } catch (err: any) {
    console.error("Detailed error:", {
      name: err?.name,
      message: err?.message,
      details: err?.details,
      hint: err?.hint,
      code: err?.code
    });
    throw err;
  }
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
