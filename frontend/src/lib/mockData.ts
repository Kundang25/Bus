// Mock data for Shakthi Scheme Bus Ticket Verification System

export interface Bus {
  id: string;
  number: string;
  stateCode: string;

}

export interface Route {
  id: string;
  stateCode: string;
  name: string;
  from: string;
  to: string;
}

export interface StateTransport {
  id: string;
  name: string;
  buses: Bus[];
  routes: Route[];
}

export interface Conductor {
  id: string;
  name: string;
  pin: string;
}

export interface TripData {
  tripId: string;
  busNumber: string;
  route: string;
  conductorId: string;
  totalScans: number;
  verified: number;
  notVerified: number;
  date: string;
}
export interface PassangerData {
  name: string;
  age: number;
  gender: string;
  address: string
}
export interface State {
  id: string;
  name: string;
}

export interface AdminStats {
  totalBusesActive: number;
  totalQrScans: number;
  totalVerified: number;
  totalNotVerified: number;
}

// Mock buses
export const buses: Bus[] = [
  { id: "KA-1", number: "KA-01-F-1234", stateCode: "KA" },
  { id: "KA-2", number: "KA-01-F-5678", stateCode: "KA" },
  { id: "KA-3", number: "KA-01-F-9012", stateCode: "KA" },
  { id: "KA-4", number: "KA-02-F-3456", stateCode: "KA" },
  { id: "KA-5", number: "KA-02-F-7890", stateCode: "KA" },

  { id: "MH-1", number: "MH-01-F-1234", stateCode: "MH" },
  { id: "MH-2", number: "MH-01-F-5678", stateCode: "MH" },
  { id: "MH-3", number: "MH-01-F-9012", stateCode: "MH" },
  { id: "MH-4", number: "MH-02-F-3456", stateCode: "MH" },
  { id: "MH-5", number: "MH-02-F-7890", stateCode: "MH" },

  { id: "DL-1", number: "DL-01-F-1234", stateCode: "DL" },
  { id: "DL-2", number: "DL-01-F-5678", stateCode: "DL" },
  { id: "DL-3", number: "DL-01-F-9012", stateCode: "DL" },
  { id: "DL-4", number: "DL-02-F-3456", stateCode: "DL" },
  { id: "DL-5", number: "DL-02-F-7890", stateCode: "DL" },
];

export const routes: Route[] = [
  // Karnataka
  { id: "KA-R1", stateCode: "KA", name: "Route 1", from: "Majestic", to: "Whitefield" },
  { id: "KA-R2", stateCode: "KA", name: "Route 2", from: "Kempegowda Bus Station", to: "Electronic City" },
  { id: "KA-R3", stateCode: "KA", name: "Route 3", from: "Shivajinagar", to: "Banashankari" },
  { id: "KA-R4", stateCode: "KA", name: "Route 4", from: "Yeshwanthpur", to: "Marathahalli" },
  { id: "KA-R5", stateCode: "KA", name: "Route 5", from: "Jayanagar", to: "Hebbal" },

  // Maharashtra
  { id: "MH-R1", stateCode: "MH", name: "Route 1", from: "Andheri", to: "Borivali" },
  { id: "MH-R2", stateCode: "MH", name: "Route 2", from: "Dadar", to: "Kurla" },
  { id: "MH-R3", stateCode: "MH", name: "Route 3", from: "Pune Station", to: "Hinjewadi" },

  // Delhi
  { id: "DL-R1", stateCode: "DL", name: "Route 1", from: "Kashmere Gate", to: "Dwarka" },
  { id: "DL-R2", stateCode: "DL", name: "Route 2", from: "Rohini", to: "Karol Bagh" },
];


// Mock conductors
export const conductors: Conductor[] = [
  { id: "COND001", name: "Rajesh Kumar", pin: "1234" },
  { id: "COND002", name: "Suresh Babu", pin: "5678" },
  { id: "COND003", name: "Prakash Rao", pin: "9012" },
];

export const state: State[] = [
  {id:"KA", name: "Karnataka"},
  {id:"MH", name:"Maharashtra"},
  {id:"DL",name:"Delhi"},
];

export const getBusesByState = (stateCode: string): Bus[] =>
  buses.filter((bus) => bus.stateCode === stateCode);

export const getRoutesByState = (stateCode: string): Route[] =>
  routes.filter((route) => route.stateCode === stateCode);

export const stateTransportData: StateTransport[] = state.map((st) => ({
  id: st.id,
  name: st.name,
  buses: getBusesByState(st.id),
  routes: getRoutesByState(st.id),
}));



// Mock admin credentials
export const adminCredentials = {
  id: "ADMIN001",
  password: "admin123",
};

// Mock trip data for admin dashboard
export const mockTripData: TripData[] = [
  { tripId: "T001", busNumber: "KA-01-F-1234", route: "Majestic - Whitefield", conductorId: "COND001", totalScans: 45, verified: 38, notVerified: 7, date: "2026-01-28" },
  { tripId: "T002", busNumber: "KA-01-F-5678", route: "Kempegowda - Electronic City", conductorId: "COND002", totalScans: 62, verified: 55, notVerified: 7, date: "2026-01-28" },
  { tripId: "T003", busNumber: "KA-01-F-9012", route: "Shivajinagar - Banashankari", conductorId: "COND003", totalScans: 38, verified: 32, notVerified: 6, date: "2026-01-28" },
  { tripId: "T004", busNumber: "KA-02-F-3456", route: "Yeshwanthpur - Marathahalli", conductorId: "COND001", totalScans: 51, verified: 47, notVerified: 4, date: "2026-01-27" },
  { tripId: "T005", busNumber: "KA-02-F-7890", route: "Jayanagar - Hebbal", conductorId: "COND002", totalScans: 33, verified: 28, notVerified: 5, date: "2026-01-27" },
  { tripId: "T006", busNumber: "KA-01-F-1234", route: "Majestic - Whitefield", conductorId: "COND003", totalScans: 58, verified: 52, notVerified: 6, date: "2026-01-26" },
  { tripId: "T007", busNumber: "KA-01-F-5678", route: "Kempegowda - Electronic City", conductorId: "COND001", totalScans: 44, verified: 40, notVerified: 4, date: "2026-01-25" },
  { tripId: "T008", busNumber: "KA-01-F-9012", route: "Shivajinagar - Banashankari", conductorId: "COND002", totalScans: 29, verified: 25, notVerified: 4, date: "2026-01-24" },
];

export const mockpassangerData: PassangerData[] = [
  { name: "Vinay", gender: "Male", age: 31, address: "Karnataka" },
  { name: "Neha Verma", gender: "Female", age: 28, address: "Delhi" },
  { name: "Aishwarya Pawar", gender: "Female", age: 31, address: "Maharashtra" },
  { name: "Amit Joshi", gender: "Male", age: 35, address: "Maharashtra" },
  { name: "Shilpa Gowda", gender: "Female", age: 23, address: "Karnataka" },
  { name: "Ritika Gupta", gender: "Female", age: 30, address: "Delhi" },
   { name: "Vinay", gender: "Male", age: 31, address: "Karnataka" },
  { name: "Nitin Joshi", gender: "Male", age: 33, address: "Maharashtra" },
  { name: "Karthik R", gender: "Male", age: 26, address: "Karnataka" },
  { name: "Vikram Singh", gender: "Male", age: 39, address: "Delhi" },
  { name: "Meghana Patil", gender: "Female", age: 34, address: "Karnataka" },
  { name: "Pooja Deshmukh", gender: "Female", age: 27, address: "Maharashtra" },
  { name: "Arjun Malhotra", gender: "Male", age: 25, address: "Delhi" },
  { name: "Suresh Naik", gender: "Male", age: 41, address: "Karnataka" },
  { name: "Shraddha Patil", gender: "Female", age: 29, address: "Maharashtra" },
  { name: "Ananya Rao", gender: "Female", age: 24, address: "Karnataka" },
  { name: "Rohit Kulkarni", gender: "Male", age: 41, address: "Maharashtra" },
  { name: "Kiran Ahuja", gender: "Female", age: 36, address: "Delhi" },
  { name: "Deepika H", gender: "Female", age: 21, address: "Karnataka" },
  { name: "Swapnil Jadhav", gender: "Male", age: 37, address: "Maharashtra" },
  { name: "Nandini K", gender: "Female", age: 19, address: "Karnataka" },
  { name: "Saurabh Khanna", gender: "Male", age: 34, address: "Delhi" },
  { name: "Vinayak Deshpande", gender: "Male", age: 33, address: "Karnataka" },
  { name: "Komal Bhosale", gender: "Female", age: 26, address: "Maharashtra" },
  { name: "Pallavi Mehra", gender: "Female", age: 22, address: "Delhi" },
  { name: "Prakash Rao", gender: "Male", age: 38, address: "Karnataka" },
  { name: "Rohit Arora", gender: "Male", age: 41, address: "Delhi" },
  { name: "Sneha Kulkarni", gender: "Female", age: 28, address: "Karnataka" },
  { name: "Sanket More", gender: "Male", age: 22, address: "Maharashtra" },
  { name: "Ramesh Hegde", gender: "Male", age: 45, address: "Karnataka" },
  { name: "Neha Sharma", gender: "Female", age: 25, address: "Maharashtra" },
  { name: "Radhika S", gender: "Female", age: 32, address: "Karnataka" },
  { name: "Sowmya Prakash", gender: "Female", age: 38, address: "Karnataka" },
];

let passengerIndex = 0;

export const getmockpassangerDataData = () => {
  const passenger = mockpassangerData;
  return passenger;
};


// Helper function to get stats by date filter
export const getAdminStats = (filter: "today" | "weekly" | "monthly"): AdminStats => {
  const today = new Date("2026-01-28");
  let filteredData: TripData[] = [];

  if (filter === "today") {
    filteredData = mockTripData.filter(t => t.date === "2026-01-28");
  } else if (filter === "weekly") {
    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);
    filteredData = mockTripData.filter(t => new Date(t.date) >= weekAgo);
  } else {
    filteredData = mockTripData;
  }

  const uniqueBuses = new Set(filteredData.map(t => t.busNumber));

  return {
    totalBusesActive: uniqueBuses.size,
    totalQrScans: filteredData.reduce((acc, t) => acc + t.totalScans, 0),
    totalVerified: filteredData.reduce((acc, t) => acc + t.verified, 0),
    totalNotVerified: filteredData.reduce((acc, t) => acc + t.notVerified, 0),
  };
};

// Get chart data for bus-wise verification
export const getBusChartData = (filter: "today" | "weekly" | "monthly") => {
  const today = new Date("2026-01-28");
  let filteredData: TripData[] = [];

  if (filter === "today") {
    filteredData = mockTripData.filter(t => t.date === "2026-01-28");
  } else if (filter === "weekly") {
    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);
    filteredData = mockTripData.filter(t => new Date(t.date) >= weekAgo);
  } else {
    filteredData = mockTripData;
  }

  const busMap = new Map<string, { verified: number; notVerified: number }>();

  filteredData.forEach(t => {
    const current = busMap.get(t.busNumber) || { verified: 0, notVerified: 0 };
    busMap.set(t.busNumber, {
      verified: current.verified + t.verified,
      notVerified: current.notVerified + t.notVerified,
    });
  });

  return Array.from(busMap.entries()).map(([bus, data]) => ({
    bus: bus.split("-").slice(-1)[0],
    verified: data.verified,
    notVerified: data.notVerified,
  }));
};

// Get chart data for route-wise verification
export const getRouteChartData = (filter: "today" | "weekly" | "monthly") => {
  const today = new Date("2026-01-28");
  let filteredData: TripData[] = [];

  if (filter === "today") {
    filteredData = mockTripData.filter(t => t.date === "2026-01-28");
  } else if (filter === "weekly") {
    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);
    filteredData = mockTripData.filter(t => new Date(t.date) >= weekAgo);
  } else {
    filteredData = mockTripData;
  }

  const routeMap = new Map<string, number>();

  filteredData.forEach(t => {
    const current = routeMap.get(t.route) || 0;
    routeMap.set(t.route, current + t.verified);
  });

  return Array.from(routeMap.entries()).map(([route, verified]) => ({
    route: route.split(" - ")[0],
    verified,
  }));
};

// Get conductor performance data
export const getConductorPerformance = (filter: "today" | "weekly" | "monthly") => {
  const today = new Date("2026-01-28");
  let filteredData: TripData[] = [];

  if (filter === "today") {
    filteredData = mockTripData.filter(t => t.date === "2026-01-28");
  } else if (filter === "weekly") {
    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);
    filteredData = mockTripData.filter(t => new Date(t.date) >= weekAgo);
  } else {
    filteredData = mockTripData;
  }

  const conductorMap = new Map<string, { busNumber: string; totalScans: number; verified: number; notVerified: number }>();

  filteredData.forEach(t => {
    const current = conductorMap.get(t.conductorId) || { busNumber: t.busNumber, totalScans: 0, verified: 0, notVerified: 0 };
    conductorMap.set(t.conductorId, {
      busNumber: t.busNumber,
      totalScans: current.totalScans + t.totalScans,
      verified: current.verified + t.verified,
      notVerified: current.notVerified + t.notVerified,
    });
  });

  return Array.from(conductorMap.entries()).map(([conductorId, data]) => ({
    conductorId,
    ...data,
  }));
};

// Simulate Aadhaar verification (random success/failure)
export const simulateAadhaarVerification = (): Promise<boolean> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // 80% success rate for simulation
      resolve(Math.random() > 0.2);
    }, 2000);
  });
};
