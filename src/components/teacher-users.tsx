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
import { Brain, ArrowLeft, Search, Plus, Edit, Trash2, UserCheck, AlertCircle } from "lucide-react";

interface TeacherUsersProps {
  onNavigate: (page: string) => void;
}

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  group: string;
  status: 'active' | 'inactive';
  lastAccess: string;
}

export function TeacherUsers({ onNavigate }: TeacherUsersProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterGroup, setFilterGroup] = useState('all');
  const [deleteDialog, setDeleteDialog] = useState<number | null>(null);
  const [editDialog, setEditDialog] = useState<User | null>(null);

  const [users, setUsers] = useState<User[]>([
    { id: 1, name: 'Ana Martínez', email: 'ana.martinez@email.com', role: 'student', group: 'Grupo C', status: 'active', lastAccess: '21 Oct 2025' },
    { id: 2, name: 'Carlos López', email: 'carlos.lopez@email.com', role: 'student', group: 'Grupo A', status: 'active', lastAccess: '21 Oct 2025' },
    { id: 3, name: 'María García', email: 'maria.garcia@email.com', role: 'student', group: 'Grupo C', status: 'active', lastAccess: '20 Oct 2025' },
    { id: 4, name: 'Juan Pérez', email: 'juan.perez@email.com', role: 'student', group: 'Grupo B', status: 'active', lastAccess: '21 Oct 2025' },
    { id: 5, name: 'Laura Sánchez', email: 'laura.sanchez@email.com', role: 'student', group: 'Grupo A', status: 'active', lastAccess: '19 Oct 2025' },
    { id: 6, name: 'Pedro Ramírez', email: 'pedro.ramirez@email.com', role: 'student', group: 'Grupo B', status: 'inactive', lastAccess: '15 Oct 2025' },
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
    const matchesGroup = filterGroup === 'all' || user.group === filterGroup;
    return matchesSearch && matchesRole && matchesGroup;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => onNavigate('teacher-dashboard')}
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" /> Volver
            </Button>
            <div className="flex items-center gap-2">
              <Brain className="w-6 h-6 text-green-600" />
              <span className="text-green-600">Gestión de usuarios</span>
            </div>
          </div>
          <Button className="gap-2">
            <Plus className="w-4 h-4" /> Agregar estudiante
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Title and Stats */}
        <div className="mb-8">
          <h1 className="text-4xl mb-2 text-gray-900">Gestión de estudiantes</h1>
          <p className="text-xl text-gray-600">
            Administra permisos, grupos y accesos de tus estudiantes
          </p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <UserCheck className="w-8 h-8 text-blue-600" />
            </div>
            <div className="text-3xl mb-1">{users.filter(u => u.status === 'active').length}</div>
            <div className="text-sm text-gray-600">Usuarios activos</div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <AlertCircle className="w-8 h-8 text-orange-600" />
            </div>
            <div className="text-3xl mb-1">{users.filter(u => u.status === 'inactive').length}</div>
            <div className="text-sm text-gray-600">Usuarios inactivos</div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                A
              </div>
            </div>
            <div className="text-3xl mb-1">{users.filter(u => u.group === 'Grupo A').length}</div>
            <div className="text-sm text-gray-600">Grupo A - Matutino</div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-purple-600">
                B
              </div>
            </div>
            <div className="text-3xl mb-1">{users.filter(u => u.group === 'Grupo B').length}</div>
            <div className="text-sm text-gray-600">Grupo B - Vespertino</div>
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
              </SelectContent>
            </Select>

            <Select value={filterGroup} onValueChange={setFilterGroup}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Filtrar por grupo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los grupos</SelectItem>
                <SelectItem value="Grupo A">Grupo A - Matutino</SelectItem>
                <SelectItem value="Grupo B">Grupo B - Vespertino</SelectItem>
                <SelectItem value="Grupo C">Grupo C - Online</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </Card>

        {/* Users Table */}
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Rol</TableHead>
                <TableHead>Grupo</TableHead>
                <TableHead>Estado</TableHead>
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
                    <TableCell>{user.name}</TableCell>
                    <TableCell className="text-gray-600">{user.email}</TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {user.role === 'student' ? 'Estudiante' : 'Docente'}
                      </Badge>
                    </TableCell>
                    <TableCell>{user.group}</TableCell>
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

        {/* Info Card */}
        <Card className="p-6 mt-8 bg-blue-50 border-blue-200">
          <div className="flex items-start gap-3">
            <Brain className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <div className="text-blue-900 mb-2">💡 Gestión de permisos</div>
              <p className="text-sm text-blue-800">
                Puedes editar el grupo de cada estudiante, cambiar su estado (activo/inactivo) o eliminar usuarios.
                Los cambios se aplicarán inmediatamente y afectarán el acceso a las actividades asignadas.
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
              Se perderán todos los datos y progreso del estudiante.
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
              Modifica la información y permisos del usuario
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
                <label className="text-sm mb-2 block">Grupo</label>
                <Select
                  value={editDialog.group}
                  onValueChange={(val) => setEditDialog({ ...editDialog, group: val })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Grupo A">Grupo A - Matutino</SelectItem>
                    <SelectItem value="Grupo B">Grupo B - Vespertino</SelectItem>
                    <SelectItem value="Grupo C">Grupo C - Online</SelectItem>
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
