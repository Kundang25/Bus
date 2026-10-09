import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { buses, getmockpassangerDataData, routes ,state} from "@/lib/mockData";
import { QRCodeSVG } from "qrcode.react";
import { QrCode, Users, CheckCircle, XCircle, RefreshCw, User, MapPin, Calendar, CheckCircle2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { X } from "lucide-react";
import { v4 as uuidv4 } from 'uuid';
import { getBusesByState, getRoutesByState } from "@/lib/mockData";


// import axios from "axios";

import { Dialog, DialogContent, DialogTitle } from "@radix-ui/react-dialog";
import { DialogHeader } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Badge } from '@/components/ui/badge';
import { BridgeandReport } from "@/service";
import { decodeWithBase64, encodeWithBase64 } from "@/EncodeDecode";

const ConductorDashboard = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [selectedBus, setSelectedBus] = useState("");
  const [selectedRoute, setSelectedRoute] = useState("");
  const [selectedState, setselectedState] = useState("");
  const [qrGenerated, setQrGenerated] = useState(false);
  const [tripId, setTripId] = useState("");
  const [conductorId, setConductorId] = useState("");
  const [open, setOpen] = useState(false);
  const [history, setHistory] = useState(false);
  const [count, setcount] = useState(0);
  const [verificount, setVerificount] = useState(0);
  const [notverificount, setNotVerificount] = useState(0);
  const [currentPassenger, setCurrentPassenger] = useState({ name: "Ananya Rao", gender: "Female", age: 24, address: "Delhi" },);
  const [isValid, setIsValid] = useState(null);
  const [reportdata, setReportData] = useState([]);
  const [ticketOpen, setTicketOpen] = useState(false);
  const [filteredBuses, setFilteredBuses] = useState([]);
  const [filteredRoutes, setFilteredRoutes] = useState([]);
  const passenegerData = getmockpassangerDataData()

  const [counters, setCounters] = useState({
    totalScans: 0,
    verified: 0,
    notVerified: 0,
  });

  const selectedRouteObj = filteredRoutes.find(
    (r) => `${r.from} - ${r.to}` === selectedRoute,
  );


  const handleStateChange = (stateCode: string) => {
  setselectedState(stateCode);

  setFilteredBuses(getBusesByState(stateCode));
  setFilteredRoutes(getRoutesByState(stateCode));

  setSelectedBus("");
  setSelectedRoute("");
};

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "conductor") {
      navigate("/conductor");
    }
  }, [isAuthenticated, user, navigate]);


  // Simulate live updates when QR is active
  useEffect(() => {
    if (!qrGenerated) return;
    setOpen(true)

  }, [qrGenerated, passenegerData]);

  const handleGenerateQR = () => {
    if (!selectedBus) {
      toast.warning('Select the Bus Number')
    } else if (!selectedRoute) {
      toast.warning('Select the Bus Route')
    } else if (user.id != conductorId) {
      toast.warning('Enter Correct Conductor ID')
    } else if (!selectedState){
      toast.warning('Select the State')
    }
      else {
      const newTripId = `TRIP-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      setTripId(newTripId);
      setQrGenerated(true);
      setCounters({ totalScans: 0, verified: 0, notVerified: 0 });
    }
  };

  const handleNewTrip = () => {
    setQrGenerated(false);
    setSelectedBus("");
    setSelectedRoute("");
    setTripId("");
    setCounters({ totalScans: 0, verified: 0, notVerified: 0 });
  };


  const stateCodeToName: Record<string, string> = {
  KA: "Karnataka",
  MH: "Maharashtra",
  DL: "Delhi",
  };

  const DemoScan = () => {
  const data = passenegerData[count + 1];
  if (!data) return;

  let currentVerifi = verificount;
  let currentInvalid = notverificount;

  setcount(count + 1);

  const isPassengerValid =
    data.gender === "Female" &&
    data.address === stateCodeToName[selectedState];

  if (isPassengerValid) {
    setIsValid(true);
    currentVerifi += 1;
    setVerificount(currentVerifi);
  } else {
    setIsValid(false);
    currentInvalid += 1;
    setNotVerificount(currentInvalid);
  }

  setCounters({
    totalScans: currentVerifi + currentInvalid,
    verified: currentVerifi,
    notVerified: currentInvalid,
  });

  setCurrentPassenger(data);
  };

  const qrValue = JSON.stringify({
    tripId,
    State: selectedState,
    bus: selectedBus,
    route: selectedRoute,
    conductor: user?.id,
    // timestamp: Date.now(),
  });

  // Get verification URL for QR
  // const verificationUrl = `${window.location.origin}/verify/${tripId}`;


  const SendBridge = async (currentPassenger: { name: string; gender: string; age: number; address: string; }, isValid: any) => {
    console.log(currentPassenger)
    const uuid = uuidv4();
    const formData = new FormData();
    let tempJsonAll = {
      'ForumID': "e12dd3ca-8c2f-40c5-a9ca-ef3e6481d48f",
      'SessionID': "d1d8b8c2-d865-4181-b3c3-e5ea4c63289c",
      'UserName': "@cosmitude",
      'MACAddress': "Bridge-Web",
      'Time': 1769662995,
      'ScheduledDateTime': "now",
      'ScheduledBoolean': 0,
      'FlowID': "ShaktiYatra_Conductor",
      'EnableChat': 1,
      'FlowType': "Custom",
      'BridgeForward': 0,
      'TemplateID': "5b464a41-4e76-d491-b8b2-401d54ef74d9",
      'TextCount': 1,
      'ImageCount': 1,
      'InvoiceID': "",
      'DocumentCount': 1,
      'VideoCount': 1,
      'User': false,
      'ReplyBridgeID': "",
      'HiddenFlow': false,
      'BilledForum': "asdas2ad2sa5da5sda5d5",
      'TempBridgeId': uuid,
      'FlowName': "Conductor",
      'datetime': 1769662995,
      "ShaktiYatra_Conductor": {
        "ShaktiYatra_Conductor_Main-445d089f-58db-9553-bfd3-448b96769dfd_2": encodeWithBase64(currentPassenger.name),
        "ShaktiYatra_Conductor_Main-445d089f-58db-9553-bfd3-448b96769dfd_4": encodeWithBase64(currentPassenger.age),
        "ShaktiYatra_Conductor_Main-445d089f-58db-9553-bfd3-448b96769dfd_6": encodeWithBase64(currentPassenger.gender),
        "ShaktiYatra_Conductor_Main-445d089f-58db-9553-bfd3-448b96769dfd_8": encodeWithBase64(currentPassenger.address),
        "ShaktiYatra_Conductor_Main-445d089f-58db-9553-bfd3-448b96769dfd_10": encodeWithBase64(isValid),
      },
      'FID': "445d089f-58db-9553-bfd3-448b96769dfd",
      'ServerID': "362e2a0d-cc61-bd64-9826-15703212df82",
      'SentTo': "0"
    }
    formData.append('Data', JSON.stringify(tempJsonAll));
    const BridgeData = await BridgeandReport(formData, "saveForumBridges2");
    console.log('BridgeData', BridgeData);
  };
  const Report = async () => {
    let formData = new FormData();
      const nowEpoch = Math.floor(Date.now() / 1000); 

    let date = new Date();
    console.log(date)
    let jsonObject = {
      'SessionID': "d1d8b8c2-d865-4181-b3c3-e5ea4c63289c",
      'MACAddress': "Bridge-Web",
      "ReportName": "ShaktiYatra_Report_Conductor_Admin_445d089f-58db-9553-bfd3-448b96769dfd",
      "User": false,
      "ReportSchedule": "now",
      "ForumID": "e12dd3ca-8c2f-40c5-a9ca-ef3e6481d48f",
      "Label": "",
      "Operator": "!=",
      "Input": "",
      "StartDate": "1769625000",
      "EndDate": String(nowEpoch),
      "TimePeriod": "",
      "TimePeriodInput": "",
      "TempBridgeId": "1d655bc8-fa76-4e8c-a197-3205cef9da71",
      "Time": "1769671608",
      "SendGroupReport": "",
      "SpecificReport": "",
      "TemplateID": "5b464a41-4e76-d491-b8b2-401d54ef74d9",
      "FID": "445d089f-58db-9553-bfd3-448b96769dfd",
      'ServerID': "362e2a0d-cc61-bd64-9826-15703212df82",
      "UserMobileNumber": "All",
      "DownloadOnly": true
    }

    // formData.append('Data', JSON.stringify(jsonObject));
    // const reportData = await BridgeandReport(formData, "reportGeneration");
    // const flowData = "ShaktiYatra_Conductor_Main-445d089f-58db-9553-bfd3-448b96769dfd";
    // if (reportData['ErrorCode'] === 1042) {
    //   setHistory(true)
    //   let data = reportData['ErrorMessage']
    //   console.log('data', data);
    //   let flowid = data['FlowID']
    //   let alldata = data[flowid]
    //   let filteredData = [];
    //   console.log('alldata', alldata);
    //   console.log('reverse', alldata.reverse);
    //   let count = alldata.length;
    //   console.log(count)
    //   alldata.forEach((current) => {
    //     const data = {
    //       name: decodeWithBase64(current[flowData + '_2']),
    //       age: decodeWithBase64(current[flowData + '_4']),
    //       gender: decodeWithBase64(current[flowData + '_6']),
    //       address: decodeWithBase64(current[flowData + '_8']),
    //       verified: decodeWithBase64(current[flowData + '_10']),
    //     };

    //     filteredData.push(data);
    //   });
    //   setReportData(filteredData)
    //   console.log("filteredData", filteredData)
    // }

    formData.append("Data", JSON.stringify(jsonObject));
    const reportData = await BridgeandReport(formData, "reportGeneration");

    const flowData =
      "ShaktiYatra_Conductor_Main-445d089f-58db-9553-bfd3-448b96769dfd";

    if (reportData["ErrorCode"] === 1042) {
      setHistory(true);

      const data = reportData["ErrorMessage"];
      const flowid = data["FlowID"];
      const alldata = data[flowid];

      console.log("total entries:", alldata.length);

      const latest25 = alldata.slice(-25).reverse();

      const filteredData = latest25.map((current) => ({
        name: decodeWithBase64(current[flowData + "_2"]),
        age: decodeWithBase64(current[flowData + "_4"]),
        gender: decodeWithBase64(current[flowData + "_6"]),
        address: decodeWithBase64(current[flowData + "_8"]),
        verified: decodeWithBase64(current[flowData + "_10"]),
      }));

      setReportData(filteredData);

      console.log("latest 25 history:", filteredData);
    }


  };
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header showLogout title="Conductor Dashboard" />

      <main className="flex-1 p-4">
        <div className="container mx-auto max-w-4xl">
          {!qrGenerated ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <QrCode className="h-6 w-6" />
                  Generate Trip QR Code
                </CardTitle>
                <CardDescription>
                  Select bus and route to generate a QR code for passengers
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="state">State</Label>
                  <Select
                    value={selectedState}
                    onValueChange={handleStateChange}
                  >
                    <SelectTrigger id="state">
                      <SelectValue placeholder="Select State" />
                    </SelectTrigger>
                    <SelectContent>
                      {state.map((st) => (
                        <SelectItem key={st.id} value={st.id}>
                          {st.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="number">Bus Number</Label>
                    <Select
                      value={selectedBus}
                      onValueChange={setSelectedBus}
                      disabled={!selectedState}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Bus Number" />
                      </SelectTrigger>
                      <SelectContent>
                        {filteredBuses.map((bus) => (
                          <SelectItem key={bus.id} value={bus.number}>
                            {bus.number}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="route">Bus Route</Label>
                    <Select
                      value={selectedRoute}
                      onValueChange={setSelectedRoute}
                      disabled={!selectedState}
                    >
                      <SelectTrigger id="route">
                        <SelectValue placeholder="Select route" />
                      </SelectTrigger>
                      <SelectContent>
                        {filteredRoutes.map((route) => (
                          <SelectItem
                            key={route.id}
                            value={`${route.from} - ${route.to}`}
                          >
                            {route.from} - {route.to}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bus">Conductor ID</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="conductorId"
                        type="text"
                        placeholder="Enter Conductor ID"
                        value={conductorId}
                        onChange={(e) => setConductorId(e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                </div>

                <Button
                  onClick={handleGenerateQR}
                  disabled={!selectedBus || !selectedRoute || !conductorId}
                  className="w-full gap-2"
                  size="lg"
                >
                  <QrCode className="h-5 w-5" />
                  Generate QR Code
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {/* QR Code Display */}
              <Card>
                <CardHeader className="text-center">
                  <CardTitle>Trip QR Code</CardTitle>
                  <CardDescription>
                    Bus: {selectedBus} | {selectedRouteObj?.from} -{" "}
                    {selectedRouteObj?.to}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center">
                  <div className="rounded-lg bg-white p-4 shadow-md">
                    <QRCodeSVG
                      value={qrValue}
                      size={200}
                      level="H"
                      includeMargin
                    />
                  </div>
                  <p className="mt-4 text-center text-sm text-muted-foreground">
                    Passengers can scan this QR to verify eligibility
                  </p>
                </CardContent>
              </Card>

              {/* Live Counters */}
              <div className="grid gap-4 sm:grid-cols-3">
                <Card>
                  <CardContent className="flex flex-col items-center justify-center p-6">
                    <Users className="mb-2 h-8 w-8 text-primary" />
                    <p className="text-3xl font-bold">{counters.totalScans}</p>
                    <p className="text-sm text-muted-foreground">Total Scans</p>
                  </CardContent>
                </Card>

                <Card className="border-green-200 bg-green-50">
                  <CardContent className="flex flex-col items-center justify-center p-6">
                    <CheckCircle className="mb-2 h-8 w-8 text-green-600" />
                    <p className="text-3xl font-bold text-green-700">
                      {counters.verified}
                    </p>
                    <p className="text-sm text-green-600">Verified ✔️</p>
                  </CardContent>
                </Card>

                <Card className="border-red-200 bg-red-50">
                  <CardContent className="flex flex-col items-center justify-center p-6">
                    <XCircle className="mb-2 h-8 w-8 text-red-600" />
                    <p className="text-3xl font-bold text-red-700">
                      {counters.notVerified}
                    </p>
                    <p className="text-sm text-red-600">Not Verified ❌</p>
                  </CardContent>
                </Card>
              </div>
              <div>
                <p className="mt-4 text-center text-sm text-red-600">
                  Here this system is integrated with the Aadhaar platform for secure
                  passenger authentication.
                </p>
              </div>
              <div className="mt-5 flex justify-center gap-3">
                <Button
                  className="
            rounded-md
            border px-4 py-1.5
            text-sm font-medium
            hover:bg-gray-100
          "
                  onClick={handleNewTrip}
                >
                  <RefreshCw className="h-4 w-4" />
                  Start New Trip
                </Button>

                <Button
                  className="
            rounded-md
            border px-4 py-1.5
            text-sm font-medium
            hover:bg-gray-100
          "
                  onClick={() => {
                    DemoScan();
                    setOpen(true);
                  }}
                >
                  Demo Scan
                </Button>
                <Button
                  className="
            rounded-md
            border px-4 py-1.5
            text-sm font-medium
            hover:bg-gray-100
          "
                  onClick={() => {
                    Report();
                    setOpen(false);
                  }}
                >
                  History
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div
            className="relative w-[360px] max-w-[90%] max-h-[85vh] rounded-2xl bg-white p-6 shadow-2xl flex flex-col animate-in fade-in zoom-in-95"
            onClick={(e) => e.stopPropagation()}
          >
            {/* ❌ Close Button */}
            <button
              onClick={() => setOpen(false)}
              className="absolute right-4 top-4 rounded-full p-1.5 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
              aria-label="Close modal"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Title */}
            <h2 className="text-center text-lg font-semibold">
              Ticket Validation
            </h2>
            {/* Status Icon */}
            <div className="mt-4 flex justify-center">
              <div
                className={`flex h-20 w-20 items-center justify-center rounded-full ${
                  isValid ? "bg-green-100" : "bg-red-100"
                }`}
              >
                {isValid ? (
                  <CheckCircle2 className="h-12 w-12 text-green-600" />
                ) : (
                  <XCircle className="h-12 w-12 text-red-600" />
                )}
              </div>
            </div>

            {/* Status Badge */}
            <div className="mt-3 flex justify-center">
              <span
                className={`rounded-full px-4 py-1 text-sm font-semibold ${
                  isValid ? "bg-green-600 text-white" : "bg-red-600 text-white"
                }`}
              >
                {isValid ? "VALID TICKET" : "INVALID TICKET"}
              </span>
            </div>

            {/* Passenger Card */}
            <div className="mt-4 rounded-lg bg-gray-50 p-4 space-y-3">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-gray-300 flex items-center justify-center font-bold">
                  {currentPassenger.name.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold">{currentPassenger.name}</p>
                  <div className="flex gap-2 text-sm text-gray-600">
                    <span className="rounded bg-gray-200 px-2">
                      {currentPassenger.gender}
                    </span>
                    <span>Age: {currentPassenger.age}</span>
                  </div>
                </div>
              </div>

              <div className="border-t pt-2 space-y-2 text-sm text-gray-600">
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-blue-600 mt-0.5" />
                  <span>{currentPassenger.address}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-blue-600" />
                  <span>
                    {new Date().toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>
            </div>

            {/* Scheme Message */}
            {isValid && (
              <p className="mt-3 text-center text-sm font-medium text-green-600">
                ✓ Passenger eligible for free travel under Shakti scheme
              </p>
            )}

            {/* Buttons */}
            <div className="mt-5 flex justify-center gap-3">
              <button
                className="
            rounded-md
            border px-4 py-1.5
            text-sm font-medium
            hover:bg-gray-100
          "
                onClick={() => {
                  SendBridge(currentPassenger, isValid);
                  setOpen(false);
                  if (isValid) {
                    setTicketOpen(true); // ✅ generate ticket ONLY if valid
                  }
                }}
              >
                Ok
              </button>
            </div>
          </div>
        </div>
      )}
      {history && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          {/* Modal box */}
          <div
            className="relative w-full max-w-3xl rounded-xl bg-white p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()} // 🔒 prevent outside close
          >
            {/* Close button */}
            <button
              onClick={() => setHistory(false)}
              className="absolute right-4 top-4 rounded-full p-1 text-gray-500 hover:bg-gray-100"
            >
              <X size={20} />
            </button>

            {/* Header */}
            <h2 className="mb-4 text-xl font-semibold text-gray-800">
              Passenger Verification Status
            </h2>

            {/* Content */}
            <div className="max-h-[60vh] space-y-3 overflow-y-auto pr-2">
              {reportdata.map((item, index) => {
                const isVerified = item.verified === "true";

                return (
                  <div
                    key={index}
                    className="flex items-center justify-between rounded-lg border p-4 shadow-sm"
                  >
                    {/* Left info */}
                    <div>
                      <p className="font-semibold text-gray-800">{item.name}</p>
                      <p className="text-sm text-gray-500">
                        {item.age} yrs • {item.gender} • {item.address}
                      </p>
                    </div>

                    {/* Status */}
                    <div className="text-right">
                      <span
                        className={`inline-block rounded-full px-3 py-1 text-sm font-medium ${
                          isVerified
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {isVerified ? "Approved" : "Rejected"}
                      </span>

                      <p
                        className={`mt-1 text-xs ${
                          isVerified ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {isVerified
                          ? "Verified Successfully"
                          : "Verification Failed"}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Footer */}
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setHistory(false)}
                className="rounded-md bg-gray-800 px-5 py-2 text-sm text-white hover:bg-gray-900"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      {ticketOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div
            className="relative w-[360px] max-w-[90%] rounded-2xl bg-white shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-green-600 to-emerald-500 p-4 text-white">
              <h2 className="text-center text-lg font-bold">
                Free Travel Ticket
              </h2>
              <p className="text-center text-xs opacity-90">
                Shakti Scheme – Government of India
              </p>

              {/* Close */}
              <button
                onClick={() => setTicketOpen(false)}
                className="absolute right-3 top-3 rounded-full p-1 hover:bg-white/20"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Ticket Body */}
            <div className="p-4 space-y-4">
              {/* Passenger */}
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center font-bold text-green-700">
                  {currentPassenger.name.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold">{currentPassenger.name}</p>
                  <p className="text-xs text-gray-500">
                    {currentPassenger.gender} • Age {currentPassenger.age}
                  </p>
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-dashed"></div>

              {/* Details */}
              <div className="space-y-2 text-sm text-gray-700">
                <div className="flex justify-between">
                  <span className="text-gray-500">Address</span>
                  <span className="font-medium">
                    {currentPassenger.address}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-500">Issued On</span>
                  <span className="font-medium">
                    {new Date().toLocaleString("en-IN")}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-500">Ticket Type</span>
                  <span className="font-semibold text-green-600">
                    FREE PASS
                  </span>
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-dashed"></div>

              {/* QR Placeholder */}
              <div className="flex justify-center">
                <div className="h-28 w-28 rounded-lg border flex items-center justify-center text-xs text-gray-400">
                  QR CODE
                </div>
              </div>

              {/* Footer */}
              <p className="text-center text-xs text-gray-500">
                Valid for single journey only • Non-transferable
              </p>
            </div>

            {/* Bottom Action */}
            <div className="border-t p-3 flex justify-center">
              <button
                className="rounded-md bg-green-600 px-6 py-2 text-sm font-semibold text-white hover:bg-green-700"
                onClick={() => setTicketOpen(false)}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      <footer className="border-t bg-muted/50 p-4">
        <div className="container mx-auto text-center text-xs text-muted-foreground">
          <p>© 2026 Shakthi Scheme | Government of India</p>
        </div>
      </footer>
    </div>
  );
};

export default ConductorDashboard;


