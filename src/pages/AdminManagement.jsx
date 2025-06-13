import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Badge } from '../components/ui/badge';
import { Alert, AlertDescription } from '../components/ui/alert';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';
import { adminService, userService } from '../services/api';
import {
  UserPlus,
  Shield,
  Search,
  RefreshCw,
  Loader2,
  UserCheck,
  AlertCircle,
  Eye,
  EyeOff,
  Calendar as CalendarIcon // Renamed to avoid conflict with Calendar component
} from 'lucide-react';

const AdminManagement = () => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [newAdmin, setNewAdmin] = useState({
    userName: '',
    email: '',
    password: '',
    confirmPassword: '', // Added for verification
    role: '', // Added for role selection
    name: '',
    lastName: '',
    identification: '',
    birthDate: '', // Added
    phone: '',
    homeAddress: '',
    country: '',
    city: '',
    photo: '' // Added
  });

  const fetchAdmins = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Obtener todos los usuarios y filtrar por rol ADMIN y SUBADMIN
      const response = await userService.getAll();
      const allUsers = response.data || [];
      
      // Filtrar solo administradores
      const adminUsers = allUsers.filter(user => 
        user.role === 'ROLE_ADMIN' || user.role === 'ROLE_SUBADMIN'
      );
      
      setAdmins(adminUsers);
    } catch (err) {
      console.error('Error fetching admins:', err);
      setError('Error al cargar la lista de administradores');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAdmin(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpiar errores cuando el usuario empiece a escribir
    if (submitError) {
      setSubmitError(null);
    }
  };

  const handleRoleChange = (value) => {
    setNewAdmin(prev => ({
      ...prev,
      role: value
    }));
    if (submitError) {
      setSubmitError(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    // Basic validation
    if (newAdmin.password !== newAdmin.confirmPassword) {
      setSubmitError('Las contraseñas no coinciden.');
      setIsSubmitting(false);
      return;
    }

    if (!newAdmin.role) {
      setSubmitError('Por favor, selecciona un rol.');
      setIsSubmitting(false);
      return;
    }

    try {
      const adminData = {
        userName: newAdmin.userName,
        email: newAdmin.email,
        password: newAdmin.password,
        role: newAdmin.role,
        name: newAdmin.name,
        lastName: newAdmin.lastName,
        identification: newAdmin.identification,
        birthDate: newAdmin.birthDate || null, // Send null if empty
        phone: newAdmin.phone || null,
        homeAddress: newAdmin.homeAddress || null,
        country: newAdmin.country || null,
        city: newAdmin.city || null,
        photo: newAdmin.photo || null // Send null if empty
      };

      await adminService.register(adminData);
      
      setSubmitSuccess(true);
      setNewAdmin({
        userName: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: '',
        name: '',
        lastName: '',
        identification: '',
        birthDate: '',
        phone: '',
        homeAddress: '',
        country: '',
        city: '',
        photo: ''
      });
      
      // Recargar la lista de administradores
      await fetchAdmins();
      
      // Cerrar el diálogo después de un breve delay
      setTimeout(() => {
        setIsDialogOpen(false);
        setSubmitSuccess(false);
      }, 2000);
      
    } catch (err) {
      console.error('Error registering admin:', err);
      setSubmitError(err.response?.data?.message || 'Error al registrar administrador');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredAdmins = admins.filter(admin =>
    admin.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    admin.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    admin.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    admin.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRoleBadgeVariant = (role) => {
    switch (role) {
      case 'ROLE_ADMIN':
        return 'default';
      case 'ROLE_SUBADMIN':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const getStateBadgeVariant = (state) => {
    switch (state) {
      case 'Active':
        return 'default';
      case 'Inactive':
        return 'secondary';
      case 'Blocked':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Administradores</h1>
          <p className="text-gray-600 mt-1">
            Administra los usuarios con permisos administrativos del sistema
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            onClick={fetchAdmins} 
            variant="outline" 
            disabled={loading}
            className="gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Actualizar
          </Button>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <UserPlus className="w-4 h-4" />
                Nuevo Administrador
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-blue-600" />
                  Registrar Nuevo Administrador
                </DialogTitle>
                <DialogDescription>
                  Completa los datos para crear un nuevo usuario administrador
                </DialogDescription>
              </DialogHeader>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Success Alert */}
                {submitSuccess && (
                  <Alert className="border-green-200 bg-green-50">
                    <UserCheck className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-800">
                      Administrador registrado exitosamente
                    </AlertDescription>
                  </Alert>
                )}

                {/* Error Alert */}
                {submitError && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{submitError}</AlertDescription>
                  </Alert>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Username */}
                  <div className="space-y-2">
                    <Label htmlFor="userName">Nombre de Usuario *</Label>
                    <Input
                      id="userName"
                      name="userName"
                      value={newAdmin.userName}
                      onChange={handleInputChange}
                      placeholder="Ej: admin_juan"
                      required
                      disabled={isSubmitting}
                    />
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={newAdmin.email}
                      onChange={handleInputChange}
                      placeholder="admin@eventhub.com"
                      required
                      disabled={isSubmitting}
                    />
                  </div>

                  {/* Password */}
                  <div className="space-y-2">
                    <Label htmlFor="password">Contraseña *</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        value={newAdmin.password}
                        onChange={handleInputChange}
                        placeholder="Contraseña segura"
                        required
                        disabled={isSubmitting}
                        className="pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        disabled={isSubmitting}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirmar Contraseña *</Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={newAdmin.confirmPassword}
                        onChange={handleInputChange}
                        placeholder="Repite la contraseña"
                        required
                        disabled={isSubmitting}
                        className="pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        disabled={isSubmitting}
                      >
                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Role Selection */}
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="role">Rol *</Label>
                    <Select value={newAdmin.role} onValueChange={handleRoleChange} disabled={isSubmitting}>
                      <SelectTrigger id="role">
                        <SelectValue placeholder="Selecciona un rol" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ROLE_ADMIN">Administrador</SelectItem>
                        <SelectItem value="ROLE_SUBADMIN">Subadministrador</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Name */}
                  <div className="space-y-2">
                    <Label htmlFor="name">Nombre *</Label>
                    <Input
                      id="name"
                      name="name"
                      value={newAdmin.name}
                      onChange={handleInputChange}
                      placeholder="Juan"
                      required
                      disabled={isSubmitting}
                    />
                  </div>

                  {/* Last Name */}
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Apellido *</Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      value={newAdmin.lastName}
                      onChange={handleInputChange}
                      placeholder="Pérez"
                      required
                      disabled={isSubmitting}
                    />
                  </div>

                  {/* Identification */}
                  <div className="space-y-2">
                    <Label htmlFor="identification">Identificación</Label>
                    <Input
                      id="identification"
                      name="identification"
                      value={newAdmin.identification}
                      onChange={handleInputChange}
                      placeholder="12345678"
                      disabled={isSubmitting}
                    />
                  </div>

                  {/* Birth Date */}
                  <div className="space-y-2">
                    <Label htmlFor="birthDate">Fecha de Nacimiento</Label>
                    <Input
                      id="birthDate"
                      name="birthDate"
                      type="date"
                      value={newAdmin.birthDate}
                      onChange={handleInputChange}
                      disabled={isSubmitting}
                    />
                  </div>

                  {/* Phone */}
                  <div className="space-y-2">
                    <Label htmlFor="phone">Teléfono</Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={newAdmin.phone}
                      onChange={handleInputChange}
                      placeholder="+1234567890"
                      disabled={isSubmitting}
                    />
                  </div>

                  {/* Address */}
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="homeAddress">Dirección</Label>
                    <Input
                      id="homeAddress"
                      name="homeAddress"
                      value={newAdmin.homeAddress}
                      onChange={handleInputChange}
                      placeholder="Calle 123, Ciudad"
                      disabled={isSubmitting}
                    />
                  </div>

                  {/* Country */}
                  <div className="space-y-2">
                    <Label htmlFor="country">País</Label>
                    <Input
                      id="country"
                      name="country"
                      value={newAdmin.country}
                      onChange={handleInputChange}
                      placeholder="Colombia"
                      disabled={isSubmitting}
                    />
                  </div>

                  {/* City */}
                  <div className="space-y-2">
                    <Label htmlFor="city">Ciudad</Label>
                    <Input
                      id="city"
                      name="city"
                      value={newAdmin.city}
                      onChange={handleInputChange}
                      placeholder="Bogotá"
                      disabled={isSubmitting}
                    />
                  </div>

                  {/* Photo URL */}
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="photo">URL de la Foto</Label>
                    <Input
                      id="photo"
                      name="photo"
                      type="url"
                      value={newAdmin.photo}
                      onChange={handleInputChange}
                      placeholder="https://ejemplo.com/mi-foto.jpg"
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={( ) => setIsDialogOpen(false)}
                    disabled={isSubmitting}
                  >
                    Cancelar
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Registrando...
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-4 h-4" />
                        Registrar Administrador
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Buscar administradores por nombre, usuario o email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Admins List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-blue-600" />
            Lista de Administradores
          </CardTitle>
          <CardDescription>
            {filteredAdmins.length} administrador(es) encontrado(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
                <p className="text-gray-600">Cargando administradores...</p>
              </div>
            </div>
          ) : error ? (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : filteredAdmins.length === 0 ? (
            <div className="text-center py-12">
              <Shield className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No se encontraron administradores
              </h3>
              <p className="text-gray-600 mb-4">
                {searchTerm ? 'No hay administradores que coincidan con tu búsqueda.' : 'No hay administradores registrados en el sistema.'}
              </p>
              {!searchTerm && (
                <Button onClick={() => setIsDialogOpen(true)} className="gap-2">
                  <UserPlus className="w-4 h-4" />
                  Registrar Primer Administrador
                </Button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Usuario</TableHead>
                    <TableHead>Nombre Completo</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Rol</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Teléfono</TableHead>
                    <TableHead>País</TableHead>
                    <TableHead>Ciudad</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAdmins.map((admin) => (
                    <TableRow key={admin.id}>
                      <TableCell className="font-medium">{admin.userName}</TableCell>
                      <TableCell>{admin.name} {admin.lastName}</TableCell>
                      <TableCell>{admin.email}</TableCell>
                      <TableCell>
                        <Badge variant={getRoleBadgeVariant(admin.role?.nombreRol || admin.role)}>
                          {admin.role?.nombreRol || admin.role}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStateBadgeVariant(admin.state?.nameState || admin.state)}>
                          {admin.state?.nameState || admin.state}
                        </Badge>
                      </TableCell>
                      <TableCell>{admin.phone || '-'}</TableCell>
                      <TableCell>{admin.country || '-'}</TableCell>
                      <TableCell>{admin.city || '-'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminManagement;