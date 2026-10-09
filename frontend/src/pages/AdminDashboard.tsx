import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  getAdminStats,
  getBusChartData,
  getRouteChartData,
  getConductorPerformance,
} from "@/lib/mockData";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Bus, QrCode, CheckCircle, XCircle, Download, Calendar } from "lucide-react";

type DateFilter = "today" | "weekly" | "monthly";

const AdminDashboard = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [dateFilter, setDateFilter] = useState<DateFilter>("today");

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "admin") {
      navigate("/admin");
    }
  }, [isAuthenticated, user, navigate]);

  const stats = getAdminStats(dateFilter);
  const busChartData = getBusChartData(dateFilter);
  const routeChartData = getRouteChartData(dateFilter);
  const conductorData = getConductorPerformance(dateFilter);

  const handleExport = () => {
    // Placeholder for export functionality
    alert("Export functionality coming soon!");
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header showLogout title="Admin Dashboard" />
      
      <main className="flex-1 p-4">
        <div className="container mx-auto max-w-7xl">
          {/* Date Filter */}
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm font-medium">Filter by:</span>
              <div className="flex gap-2">
                {(["today", "weekly", "monthly"] as DateFilter[]).map((filter) => (
                  <Button
                    key={filter}
                    variant={dateFilter === filter ? "default" : "outline"}
                    size="sm"
                    onClick={() => setDateFilter(filter)}
                    className="capitalize"
                  >
                    {filter}
                  </Button>
                ))}
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={handleExport} className="gap-2">
              <Download className="h-4 w-4" />
              Export
            </Button>
          </div>

          {/* Summary Cards */}
          <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardContent className="flex items-center gap-4 p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <Bus className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.totalBusesActive}</p>
                  <p className="text-sm text-muted-foreground">Buses Active</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="flex items-center gap-4 p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                  <QrCode className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.totalQrScans}</p>
                  <p className="text-sm text-muted-foreground">Total QR Scans</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="flex items-center gap-4 p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-green-700">{stats.totalVerified}</p>
                  <p className="text-sm text-green-600">Verified ✔️</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="flex items-center gap-4 p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                  <XCircle className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-red-700">{stats.totalNotVerified}</p>
                  <p className="text-sm text-red-600">Not Verified ❌</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts */}
          <div className="mb-6 grid gap-6 lg:grid-cols-2">
            {/* Bus-wise Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Bus-wise Verification</CardTitle>
                <CardDescription>Verified vs Not Verified by Bus Number</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={busChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="bus" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="verified" name="Verified" fill="#16a34a" />
                    <Bar dataKey="notVerified" name="Not Verified" fill="#dc2626" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Route-wise Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Route-wise Verification</CardTitle>
                <CardDescription>Verified passengers by route</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={routeChartData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="route" type="category" width={80} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="verified" name="Verified" fill="#2563eb" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Conductor Performance Table */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Conductor Performance</CardTitle>
              <CardDescription>Detailed breakdown by conductor</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Conductor ID</TableHead>
                      <TableHead>Bus Number</TableHead>
                      <TableHead className="text-center">Total Scans</TableHead>
                      <TableHead className="text-center">Verified ✔️</TableHead>
                      <TableHead className="text-center">Not Verified ❌</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {conductorData.map((conductor) => (
                      <TableRow key={conductor.conductorId}>
                        <TableCell className="font-medium">{conductor.conductorId}</TableCell>
                        <TableCell>{conductor.busNumber}</TableCell>
                        <TableCell className="text-center">{conductor.totalScans}</TableCell>
                        <TableCell className="text-center text-green-600 font-medium">
                          {conductor.verified}
                        </TableCell>
                        <TableCell className="text-center text-red-600 font-medium">
                          {conductor.notVerified}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <footer className="border-t bg-muted/50 p-4">
        <div className="container mx-auto text-center text-xs text-muted-foreground">
          <p>© 2026 Shakthi Scheme | Government of India</p>
        </div>
      </footer>
    </div>
  );
};

export default AdminDashboard;
