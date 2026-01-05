import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { Users, UserCheck, UserX, LogOut, Plus, Search, Printer } from "lucide-react";
import EmployeeTable from "@/components/EmployeeTable";
import EmployeeForm from "@/components/EmployeeForm";
import DeleteConfirmDialog from "@/components/DeleteConfirmDialog";
import { getEmployees, saveEmployees, generateId, INDIAN_STATES } from "@/lib/employeeUtils";

const Dashboard = () => {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [genderFilter, setGenderFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [deleteEmployee, setDeleteEmployee] = useState(null);
  const printRef = useRef();

  useEffect(() => {
    const isAuth = localStorage.getItem("isAuthenticated");
    if (!isAuth) {
      navigate("/");
      return;
    }
    setEmployees(getEmployees());
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("user");
    navigate("/");
  };

  const handleAddEmployee = (data) => {
    const newEmployee = {
      ...data,
      id: generateId(employees),
    };
    const updated = [...employees, newEmployee];
    setEmployees(updated);
    saveEmployees(updated);
    setIsFormOpen(false);
    toast({ title: "Success", description: "Employee added successfully!" });
  };

  const handleEditEmployee = (data) => {
    const updated = employees.map((emp) =>
      emp.id === editingEmployee.id ? { ...data, id: emp.id } : emp
    );
    setEmployees(updated);
    saveEmployees(updated);
    setEditingEmployee(null);
    setIsFormOpen(false);
    toast({ title: "Success", description: "Employee updated successfully!" });
  };

  const handleDeleteEmployee = () => {
    const updated = employees.filter((emp) => emp.id !== deleteEmployee.id);
    setEmployees(updated);
    saveEmployees(updated);
    setDeleteEmployee(null);
    toast({ title: "Deleted", description: "Employee removed successfully." });
  };

  const handleToggleStatus = (id) => {
    const updated = employees.map((emp) =>
      emp.id === id ? { ...emp, isActive: !emp.isActive } : emp
    );
    setEmployees(updated);
    saveEmployees(updated);
  };

  const handlePrint = () => {
    const printContent = document.getElementById("print-area");
    const printWindow = window.open("", "", "width=900,height=600");
    printWindow.document.write(`
      <html>
        <head>
          <title>Employee List</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            table { width: 100%; border-collapse: collapse; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f4f4f4; }
            img { width: 40px; height: 40px; border-radius: 50%; object-fit: cover; }
          </style>
        </head>
        <body>
          <h1>Employee List</h1>
          ${printContent.innerHTML}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  const filteredEmployees = employees.filter((emp) => {
    const matchesSearch = emp.fullName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGender = genderFilter === "all" || emp.gender === genderFilter;
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && emp.isActive) ||
      (statusFilter === "inactive" && !emp.isActive);
    return matchesSearch && matchesGender && matchesStatus;
  });

  const totalEmployees = employees.length;
  const activeEmployees = employees.filter((e) => e.isActive).length;
  const inactiveEmployees = totalEmployees - activeEmployees;

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <header className="bg-background border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
              <Users className="w-5 h-5 text-primary-foreground" />
            </div>
            <h1 className="text-xl font-bold">Employee Dashboard</h1>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Employees
              </CardTitle>
              <Users className="w-5 h-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{totalEmployees}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Active
              </CardTitle>
              <UserCheck className="w-5 h-5 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{activeEmployees}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Inactive
              </CardTitle>
              <UserX className="w-5 h-5 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-500">{inactiveEmployees}</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters & Actions */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-wrap gap-3 items-center">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                <Input
                  placeholder="Search by name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-[200px]"
                />
              </div>
              <Select value={genderFilter} onValueChange={setGenderFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Genders</SelectItem>
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" onClick={handlePrint}>
                <Printer className="w-4 h-4 mr-2" />
                Print
              </Button>
              <Button onClick={() => { setEditingEmployee(null); setIsFormOpen(true); }}>
                <Plus className="w-4 h-4 mr-2" />
                Add Employee
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Employee Table */}
        <Card>
          <CardContent className="p-0">
            <div id="print-area">
              <EmployeeTable
                employees={filteredEmployees}
                onEdit={(emp) => { setEditingEmployee(emp); setIsFormOpen(true); }}
                onDelete={(emp) => setDeleteEmployee(emp)}
                onToggleStatus={handleToggleStatus}
              />
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Form Dialog */}
      <EmployeeForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        onSubmit={editingEmployee ? handleEditEmployee : handleAddEmployee}
        initialData={editingEmployee}
      />

      {/* Delete Confirmation */}
      <DeleteConfirmDialog
        open={!!deleteEmployee}
        onOpenChange={() => setDeleteEmployee(null)}
        onConfirm={handleDeleteEmployee}
        employeeName={deleteEmployee?.fullName}
      />
    </div>
  );
};

export default Dashboard;
