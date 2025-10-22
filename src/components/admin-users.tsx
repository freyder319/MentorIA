import { useState } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "./ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "./ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "./ui/dialog";
import { Brain, ArrowLeft, Search, Plus, Edit, Trash2, Shield, UserCog } from "lucide-react";

interface AdminUsersProps {
  onNavigate: (page: string) => void;
}

interface User {
  id: number;
  name: string;
  email: string;
  role: 'student' | 'teacher' | 'admin';
  status: 'active' | 'inactive';
  createdAt: string;
  lastAccess: string;
}

export function AdminUsers({ onNavigate }: AdminUsersProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [deleteDialog, setDeleteDialog] = useState<number | null>(null);
  const [editDialog, setEditDialog] = useState<User | null>(null);

  const [users, setUsers] = useState<User[]>([
    { id: 1, name: 'Prof. García', email: 'garcia@school.com', role: 'teacher', status: 'active', createdAt: '10 Ene 2025', lastAccess: '21 Oct 2025' },
    { id: 2, name: 'Prof. Rodríguez', email: 'rodriguez@school.com', role: 'teacher', status: 'active', createdAt: '15 Ene 2025', lastAccess: '21 Oct 2025' },
    { id: 3, name: 'Ana Martínez', email: 'ana.m@student.com', role: 'student', status: 'active', createdAt: '20 Ene 2025', lastAccess: '21 Oct 2025' },
    { id: 4, name: 'Carlos López', email: 'carlos.l@student.com', role: 'student', status: 'active', createdAt: '22 Ene 2025', lastAccess: '21 Oct 2025' },
    { id: 5, name: 'Admin López', email: 'admin.lopez@school.com', role: 'admin', status: 'active', createdAt: '05 Ene 2025', lastAccess: '21 Oct 2025' },
    { id: 6, name: 'María García', email: 'maria.g@student.com', role: 'student', status: 'active', createdAt: '25 Ene 2025', lastAccess: '20 Oct 2025' },
    { id: 7, name: 'Juan Pérez', email: 'juan.p@student.com', role: 'student', status: 'active', createdAt: '28 Ene 2025', lastAccess: '21 Oct 2025' },
    { id: 8, name: 'Laura Sánchez', email: 'laura.s@student.com', role: 'student', status: 'inactive', createdAt: '30 Ene 2025', lastAccess: '10 Oct 2025' },
  ]);

  const handleDelete = (id: number) => {
    setUsers(users.filter(u => u.id !== id));
    setDeleteDialog(null);
  };

  const handleEditSave = () => {
    if (editDialog) {
      setUsers(users.map(u => u.id === editDialog.id ? editDialog : u));
      setEditDialog(null);
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    const matchesStatus = filterStatus === 'all' || user.status === filterStatus;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-purple-100 text-purple-700';
      case 'teacher':
        return 'bg-green-100 text-green-700';
      case 'student':
        return 'bg-blue-100 text-blue-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin':
        return 'Administrador';
      case 'teacher':
        return 'Docente';
      case 'student':
        return 'Estudiante';
      default:
        return role;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => onNavigate('admin-dashboard')}
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" /> Volver
            </Button>
            <div className="flex items-center gap-2">
              <Brain className="w-6 h-6 text-purple-600" />
              <span className="text-purple-600">Gestión de usuarios y roles</span>
            </div>
          </div>
          <Button className="gap-2">
            <Plus className="w-4 h-4" /> Crear usuario
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Title */}
        <div className="mb-8">
          <h1 className="text-4xl mb-2 text-gray-900">Administración de usuarios</h1>
          <p className="text-xl text-gray-600">
            Control completo de roles, permisos y accesos del sistema
          </p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-5 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <Shield className="w-8 h-8 text-purple-600" />
            </div>
            <div className="text-3xl mb-1">{users.length}</div>
            <div className="text-sm text-gray-600">Usuarios totales</div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600">S</span>
              </div>
            </div>
            <div className="text-3xl mb-1">{users.filter(u => u.role === 'student').length}</div>
            <div className="text-sm text-gray-600">Estudiantes</div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600">D</span>
              </div>
            </div>
            <div className="text-3xl mb-1">{users.filter(u => u.role === 'teacher').length}</div>
            <div className="text-sm text-gray-600">Docentes</div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-purple-600">A</span>
              </div>
            </div>
            <div className="text-3xl mb-1">{users.filter(u => u.role === 'admin').length}</div>
            <div className="text-sm text-gray-600">Administradores</div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <UserCog className="w-8 h-8 text-green-600" />
            </div>
            <div className="text-3xl mb-1">{users.filter(u => u.status === 'active').length}</div>
            <div className="text-sm text-gray-600">Usuarios activos</div>
          </Card>
        </div>

        {/* Filters */}
        <Card className="p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Buscar por nombre o email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <Select value={filterRole} onValueChange={setFilterRole}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Filtrar por rol" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los roles</SelectItem>
                <SelectItem value="student">Estudiantes</SelectItem>
                <SelectItem value="teacher">Docentes</SelectItem>
                <SelectItem value="admin">Administradores</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Filtrar por estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                <SelectItem value="active">Activos</SelectItem>
                <SelectItem value="inactive">Inactivos</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </Card>

        {/* Users Table */}
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Usuario</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Rol</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Fecha de registro</TableHead>
                <TableHead>Último acceso</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                    No se encontraron usuarios
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm">
                          {user.name.charAt(0)}
                        </div>
                        <span>{user.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-600">{user.email}</TableCell>
                    <TableCell>
                      <Badge className={getRoleBadgeColor(user.role)}>
                        {getRoleLabel(user.role)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={
                          user.status === 'active'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-100 text-gray-700'
                        }
                      >
                        {user.status === 'active' ? 'Activo' : 'Inactivo'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-gray-600 text-sm">{user.createdAt}</TableCell>
                    <TableCell className="text-gray-600 text-sm">{user.lastAccess}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setEditDialog(user)}
                          className="gap-1"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setDeleteDialog(user.id)}
                          className="gap-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                          disabled={user.role === 'admin' && users.filter(u => u.role === 'admin').length <= 1}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </Card>

        {/* Permissions Info */}
        <div className="grid md:grid-cols-3 gap-6 mt-8">
          <Card className="p-6 bg-blue-50 border-blue-200">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white">
                S
              </div>
              <h3 className="text-blue-900">Estudiantes</h3>
            </div>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>✓ Acceso a actividades asignadas</li>
              <li>✓ Chat con asistente IA</li>
              <li>✓ Ver sus métricas personales</li>
              <li>✗ Crear actividades</li>
            </ul>
          </Card>

          <Card className="p-6 bg-green-50 border-green-200">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white">
                D
              </div>
              <h3 className="text-green-900">Docentes</h3>
            </div>
            <ul className="text-sm text-green-800 space-y-1">
              <li>✓ Crear y editar actividades</li>
              <li>✓ Ver métricas de sus grupos</li>
              <li>✓ Gestionar sus estudiantes</li>
              <li>✗ Acceder a panel global</li>
            </ul>
          </Card>

          <Card className="p-6 bg-purple-50 border-purple-200">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white">
                A
              </div>
              <h3 className="text-purple-900">Administradores</h3>
            </div>
            <ul className="text-sm text-purple-800 space-y-1">
              <li>✓ Acceso completo al sistema</li>
              <li>✓ Gestión de todos los usuarios</li>
              <li>✓ Configuración global</li>
              <li>✓ Ver estadísticas generales</li>
            </ul>
          </Card>
        </div>

        {/* Warning */}
        <Card className="p-6 mt-6 bg-yellow-50 border-yellow-200">
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-yellow-600 mt-0.5" />
            <div>
              <div className="text-yellow-900 mb-2">⚠️ Importante</div>
              <p className="text-sm text-yellow-800">
                Los cambios de roles y permisos se aplican inmediatamente. Asegúrate de tener al menos un administrador activo en el sistema.
                No puedes eliminar el último administrador.
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialog !== null} onOpenChange={() => setDeleteDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar eliminación</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que deseas eliminar este usuario? Esta acción no se puede deshacer.
              Se perderán todos los datos asociados a este usuario.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialog(null)}>
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={() => deleteDialog && handleDelete(deleteDialog)}
            >
              Eliminar usuario
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={editDialog !== null} onOpenChange={() => setEditDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar usuario</DialogTitle>
            <DialogDescription>
              Modifica la información, rol y permisos del usuario
            </DialogDescription>
          </DialogHeader>
          {editDialog && (
            <div className="space-y-4 py-4">
              <div>
                <label className="text-sm mb-2 block">Nombre</label>
                <Input
                  value={editDialog.name}
                  onChange={(e) => setEditDialog({ ...editDialog, name: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm mb-2 block">Email</label>
                <Input
                  value={editDialog.email}
                  onChange={(e) => setEditDialog({ ...editDialog, email: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm mb-2 block">Rol</label>
                <Select
                  value={editDialog.role}
                  onValueChange={(val: 'student' | 'teacher' | 'admin') => setEditDialog({ ...editDialog, role: val })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="student">Estudiante</SelectItem>
                    <SelectItem value="teacher">Docente</SelectItem>
                    <SelectItem value="admin">Administrador</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm mb-2 block">Estado</label>
                <Select
                  value={editDialog.status}
                  onValueChange={(val: 'active' | 'inactive') => setEditDialog({ ...editDialog, status: val })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Activo</SelectItem>
                    <SelectItem value="inactive">Inactivo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialog(null)}>
              Cancelar
            </Button>
            <Button onClick={handleEditSave}>
              Guardar cambios
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
