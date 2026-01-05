import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Printer } from "lucide-react";
import { format } from "date-fns";

const EmployeeTable = ({ employees, onEdit, onDelete, onToggleStatus }) => {
  const handlePrintSingle = (employee) => {
    const printWindow = window.open("", "", "width=600,height=400");
    printWindow.document.write(`
      <html>
        <head>
          <title>Employee Details - ${employee.fullName}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 40px; }
            .header { text-align: center; margin-bottom: 30px; }
            .avatar { width: 100px; height: 100px; border-radius: 50%; margin: 0 auto 20px; display: block; object-fit: cover; }
            .info { margin: 10px 0; }
            .label { font-weight: bold; color: #666; }
          </style>
        </head>
        <body>
          <div class="header">
            ${employee.profileImage ? `<img src="${employee.profileImage}" class="avatar" />` : ''}
            <h1>${employee.fullName}</h1>
            <p>Employee ID: ${employee.id}</p>
          </div>
          <div class="info"><span class="label">Gender:</span> ${employee.gender}</div>
          <div class="info"><span class="label">Date of Birth:</span> ${format(new Date(employee.dob), "PP")}</div>
          <div class="info"><span class="label">State:</span> ${employee.state}</div>
          <div class="info"><span class="label">Status:</span> ${employee.isActive ? "Active" : "Inactive"}</div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  if (employees.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>
        <p className="text-lg font-medium">No employees found</p>
        <p className="text-sm">Add your first employee or adjust filters</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">ID</TableHead>
            <TableHead>Profile</TableHead>
            <TableHead>Full Name</TableHead>
            <TableHead>Gender</TableHead>
            <TableHead>DOB</TableHead>
            <TableHead>State</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {employees.map((employee) => (
            <TableRow key={employee.id}>
              <TableCell className="font-mono text-xs">{employee.id}</TableCell>
              <TableCell>
                <Avatar className="w-10 h-10">
                  <AvatarImage src={employee.profileImage} alt={employee.fullName} />
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {employee.fullName.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
              </TableCell>
              <TableCell className="font-medium">{employee.fullName}</TableCell>
              <TableCell>{employee.gender}</TableCell>
              <TableCell>{format(new Date(employee.dob), "PP")}</TableCell>
              <TableCell>{employee.state}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={employee.isActive}
                    onCheckedChange={() => onToggleStatus(employee.id)}
                  />
                  <Badge variant={employee.isActive ? "default" : "secondary"}>
                    {employee.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center justify-end gap-1">
                  <Button variant="ghost" size="icon" onClick={() => onEdit(employee)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => onDelete(employee)}>
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handlePrintSingle(employee)}>
                    <Printer className="w-4 h-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default EmployeeTable;
