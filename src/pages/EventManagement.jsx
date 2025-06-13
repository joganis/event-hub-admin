// import React, { useState, useEffect } from 'react';
// import {
//   Card, CardContent, CardDescription, CardHeader, CardTitle
// } from '../components/ui/card';
// import { Button } from '../components/ui/button';
// import { Input } from '../components/ui/input';
// import { Badge } from '../components/ui/badge';
// import { Alert, AlertDescription } from '../components/ui/alert';
// import {
//   Select, SelectContent, SelectItem, SelectTrigger, SelectValue
// } from '../components/ui/select';
// import {
//   Table, TableBody, TableCell, TableHead, TableHeader, TableRow
// } from '../components/ui/table';
// import {
//   DropdownMenu, DropdownMenuContent, DropdownMenuItem,
//   DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger
// } from '../components/ui/dropdown-menu';
// import { eventService } from '../services/api';
// import { EVENT_STATES } from '../constants/api';
// import {
//   Calendar, Search, RefreshCw, Loader2, AlertCircle, MoreHorizontal,
//   Lock, Unlock, Edit, Eye, BarChart3
// } from 'lucide-react';

// const EventManagement = () => {
//   const [events, setEvents]         = useState([]);
//   const [loading, setLoading]       = useState(true);
//   const [error, setError]           = useState(null);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [statusFilter, setStatusFilter] = useState('all');
//   const [blockFilter, setBlockFilter]   = useState('all');
//   const [actionLoading, setActionLoading] = useState({});

//   const fetchEvents = async () => {
//     try {
//       setLoading(true);
//       setError(null);
//       const res = await eventService.getAll();
//       // res.content para paginación, res para lista simple
//       setEvents(res?.content ?? res ?? []);
//     } catch (e) {
//       console.error(e);
//       setError('Error al cargar la lista de eventos');
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => { fetchEvents(); }, []);

//   /* ---------- helpers ---------- */
//   const normalizeStatus = (evt) =>
//     typeof evt.status === 'string' ? evt.status : evt.status?.nameState;

//   const getStatusBadgeVariant = (status) => {
//     switch (status) {
//       case 'Active':     return 'default';
//       case 'Inactive':   return 'secondary';
//       case 'Cancelled':  return 'destructive';
//       case 'Completed':  return 'outline';
//       default:           return 'secondary';
//     }
//   };
//   const getBlockBadgeVariant = (b) => (b ? 'destructive' : 'default');

//   const formatDate = (iso) =>
//     iso
//       ? new Date(iso).toLocaleString('es-ES', {
//           year: 'numeric', month: 'short', day: 'numeric',
//           hour: '2-digit', minute: '2-digit'
//         })
//       : '-';

//   /* ---------- acciones ---------- */
//   const handleToggleBlock = async (id) => {
//     try {
//       setActionLoading((p) => ({ ...p, [id]: 'toggle' }));
//       const upd = await eventService.toggleBlock(id);
//       setEvents((p) => p.map((e) => (e.id === id ? upd : e)));
//     } catch (e) {
//       console.error(e);
//       setError('Error al cambiar el estado de bloqueo');
//     } finally {
//       setActionLoading((p) => ({ ...p, [id]: null }));
//     }
//   };

//   const handleChangeStatus = async (id, newStatus) => {
//     try {
//       setActionLoading((p) => ({ ...p, [id]: 'status' }));
//       const upd = await eventService.changeStatus(id, newStatus);
//       setEvents((p) => p.map((e) => (e.id === id ? upd : e)));
//     } catch (e) {
//       console.error(e);
//       setError('Error al cambiar el estado del evento');
//     } finally {
//       setActionLoading((p) => ({ ...p, [id]: null }));
//     }
//   };

//   /* ---------- filtros ---------- */
//   const filteredEvents = events.filter((evt) => {
//     const text = searchTerm.toLowerCase();
//     const location = evt.location?.address?.toLowerCase() ?? '';
//     const matchesSearch =
//       evt.title?.toLowerCase().includes(text) ||
//       evt.description?.toLowerCase().includes(text) ||
//       location.includes(text);

//     const statusVal = normalizeStatus(evt);
//     const matchesStatus = statusFilter === 'all' || statusVal === statusFilter;

//     const matchesBlock =
//       blockFilter === 'all' ||
//       (blockFilter === 'blocked' && evt.bloqueado) ||
//       (blockFilter === 'unblocked' && !evt.bloqueado);

//     return matchesSearch && matchesStatus && matchesBlock;
//   });

//   /* ---------- render ---------- */
//   return (
//     <div className="space-y-6">
//       {/* ENCABEZADO */}
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="text-3xl font-bold">Gestión de Eventos</h1>
//           <p className="text-gray-600">Administra eventos y controla el acceso</p>
//         </div>
//         <Button
//           onClick={fetchEvents}
//           variant="outline"
//           disabled={loading}
//           className="gap-2"
//         >
//           <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
//           Actualizar
//         </Button>
//       </div>

//       {/* FILTROS */}
//       <Card>
//         <CardContent className="pt-6">
//           <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//             {/* búsqueda */}
//             <div className="relative md:col-span-2">
//               <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
//               <Input
//                 placeholder="Buscar por título, descripción o ubicación"
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="pl-10"
//               />
//             </div>

//             {/* estado */}
//             <Select value={statusFilter} onValueChange={setStatusFilter}>
//               <SelectTrigger><SelectValue placeholder="Estado" /></SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="all">Todos</SelectItem>
//                 <SelectItem value="Active">Activo</SelectItem>
//                 <SelectItem value="Inactive">Inactivo</SelectItem>
//                 <SelectItem value="Cancelled">Cancelado</SelectItem>
//                 <SelectItem value="Completed">Completado</SelectItem>
//               </SelectContent>
//             </Select>

//             {/* bloqueo */}
//             <Select value={blockFilter} onValueChange={setBlockFilter}>
//               <SelectTrigger><SelectValue placeholder="Bloqueo" /></SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="all">Todos</SelectItem>
//                 <SelectItem value="unblocked">No bloqueados</SelectItem>
//                 <SelectItem value="blocked">Bloqueados</SelectItem>
//               </SelectContent>
//             </Select>
//           </div>
//         </CardContent>
//       </Card>

//       {/* LISTADO */}
//       <Card>
//         <CardHeader>
//           <CardTitle className="flex items-center gap-2">
//             <Calendar className="w-5 h-5 text-blue-600" />
//             Lista de Eventos
//           </CardTitle>
//           <CardDescription>{filteredEvents.length} evento(s)</CardDescription>
//         </CardHeader>
//         <CardContent>
//           {loading ? (
//             <div className="flex justify-center py-12">
//               <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
//             </div>
//           ) : error ? (
//             <Alert variant="destructive">
//               <AlertCircle className="h-4 w-4" />
//               <AlertDescription>{error}</AlertDescription>
//             </Alert>
//           ) : filteredEvents.length === 0 ? (
//             <p className="text-center py-12">No se encontraron eventos.</p>
//           ) : (
//             <div className="overflow-x-auto">
//               <Table>
//                 <TableHeader>
//                   <TableRow>
//                     <TableHead>Evento</TableHead>
//                     <TableHead>Fecha</TableHead>
//                     <TableHead>Ubicación</TableHead>
//                     <TableHead>Estado</TableHead>
//                     <TableHead>Bloqueo</TableHead>
//                     <TableHead>Capacidad</TableHead>
//                     <TableHead className="text-right">Acciones</TableHead>
//                   </TableRow>
//                 </TableHeader>
//                 <TableBody>
//                   {filteredEvents.map((evt) => {
//                     const statusVal = normalizeStatus(evt);
//                     return (
//                       <TableRow key={evt.id}>
//                         {/* Evento */}
//                         <TableCell>
//                           <div className="font-medium">{evt.title || 'Sin título'}</div>
//                           <div className="text-sm text-gray-600 line-clamp-1">
//                             {evt.description || 'Sin descripción'}
//                           </div>
//                         </TableCell>

//                         {/* Fechas */}
//                         <TableCell>
//                           <div>{formatDate(evt.start)}</div>
//                           {evt.end && (
//                             <div className="text-gray-600">
//                               hasta {formatDate(evt.end)}
//                             </div>
//                           )}
//                         </TableCell>

//                         {/* Ubicación */}
//                         <TableCell>{evt.location?.address ?? '-'}</TableCell>

//                         {/* Estado */}
//                         <TableCell>
//                           <Badge variant={getStatusBadgeVariant(statusVal)}>
//                             {statusVal ?? 'Sin estado'}
//                           </Badge>
//                         </TableCell>

//                         {/* Bloqueo */}
//                         <TableCell>
//                           <Badge variant={getBlockBadgeVariant(evt.bloqueado)}>
//                             {evt.bloqueado ? 'Bloqueado' : 'Disponible'}
//                           </Badge>
//                         </TableCell>

//                         {/* Capacidad */}
//                         <TableCell>
//                           {evt.maxAttendees
//                             ? `${evt.currentAttendees ?? 0}/${evt.maxAttendees}`
//                             : '-'}
//                         </TableCell>

//                         {/* Acciones */}
//                         <TableCell className="text-right">
//                           <DropdownMenu>
//                             <DropdownMenuTrigger asChild>
//                               <Button
//                                 variant="ghost"
//                                 className="h-8 w-8 p-0"
//                                 disabled={!!actionLoading[evt.id]}
//                               >
//                                 {actionLoading[evt.id] ? (
//                                   <Loader2 className="h-4 w-4 animate-spin" />
//                                 ) : (
//                                   <MoreHorizontal className="h-4 w-4" />
//                                 )}
//                               </Button>
//                             </DropdownMenuTrigger>
//                             <DropdownMenuContent align="end">
//                               <DropdownMenuLabel>Acciones</DropdownMenuLabel>
//                               <DropdownMenuSeparator />

//                               <DropdownMenuItem onClick={() => console.log('Ver', evt.id)}>
//                                 <Eye className="mr-2 h-4 w-4" />
//                                 Ver detalles
//                               </DropdownMenuItem>

//                               <DropdownMenuSeparator />

//                               <DropdownMenuItem
//                                 onClick={() => handleToggleBlock(evt.id)}
//                                 disabled={!!actionLoading[evt.id]}
//                               >
//                                 {evt.bloqueado ? (
//                                   <>
//                                     <Unlock className="mr-2 h-4 w-4" /> Desbloquear
//                                   </>
//                                 ) : (
//                                   <>
//                                     <Lock className="mr-2 h-4 w-4" /> Bloquear
//                                   </>
//                                 )}
//                               </DropdownMenuItem>

//                               <DropdownMenuSeparator />
//                               <DropdownMenuLabel>Cambiar Estado</DropdownMenuLabel>
//                               {Object.values(EVENT_STATES).map((s) => (
//                                 <DropdownMenuItem
//                                   key={s}
//                                   onClick={() => handleChangeStatus(evt.id, s)}
//                                   disabled={!!actionLoading[evt.id] || s === statusVal}
//                                 >
//                                   <Edit className="mr-2 h-4 w-4" />
//                                   {s}
//                                 </DropdownMenuItem>
//                               ))}
//                             </DropdownMenuContent>
//                           </DropdownMenu>
//                         </TableCell>
//                       </TableRow>
//                     );
//                   })}
//                 </TableBody>
//               </Table>
//             </div>
//           )}
//         </CardContent>
//       </Card>

//       {/* ESTADÍSTICAS RÁPIDAS */}
//       {!loading && events.length > 0 && (
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//           {/* total */}
//           <Card><CardContent className="pt-6">
//             <div className="flex items-center gap-2">
//               <Calendar className="w-4 h-4 text-blue-600" />
//               <div>
//                 <p className="text-sm">Total Eventos</p>
//                 <p className="text-2xl font-bold">{events.length}</p>
//               </div>
//             </div>
//           </CardContent></Card>

//           {/* activos */}
//           <Card><CardContent className="pt-6">
//             <div className="flex items-center gap-2">
//               <BarChart3 className="w-4 h-4 text-green-600" />
//               <div>
//                 <p className="text-sm">Activos</p>
//                 <p className="text-2xl font-bold">
//                   {events.filter((e) => normalizeStatus(e) === 'Active').length}
//                 </p>
//               </div>
//             </div>
//           </CardContent></Card>

//           {/* bloqueados */}
//           <Card><CardContent className="pt-6">
//             <div className="flex items-center gap-2">
//               <Lock className="w-4 h-4 text-red-600" />
//               <div>
//                 <p className="text-sm">Bloqueados</p>
//                 <p className="text-2xl font-bold">
//                   {events.filter((e) => e.bloqueado).length}
//                 </p>
//               </div>
//             </div>
//           </CardContent></Card>

//           {/* disponibles */}
//           <Card><CardContent className="pt-6">
//             <div className="flex items-center gap-2">
//               <Unlock className="w-4 h-4 text-orange-600" />
//               <div>
//                 <p className="text-sm">Disponibles</p>
//                 <p className="text-2xl font-bold">
//                   {events.filter((e) => !e.bloqueado).length}
//                 </p>
//               </div>
//             </div>
//           </CardContent></Card>
//         </div>
//       )}
//     </div>
//   );
// };

// export default EventManagement;
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Alert, AlertDescription } from '../components/ui/alert';
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../components/ui/dropdown-menu';
import { eventService } from '../services/api';
import { EVENT_STATES } from '../constants/api';
import {
  Calendar,
  Search,
  RefreshCw,
  Loader2,
  AlertCircle,
  MoreHorizontal,
  Lock,
  Unlock,
  Edit,
  Eye,
  BarChart3,
  Filter
} from 'lucide-react';

const EventManagement = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [blockFilter, setBlockFilter] = useState('all');
  const [actionLoading, setActionLoading] = useState({});

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await eventService.getAll();
      // La respuesta de la API contiene los eventos en la propiedad 'content'
      setEvents(response.content || []); 
    } catch (err) {
      console.error('Error fetching events:', err);
      setError('Error al cargar la lista de eventos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleToggleBlock = async (eventId) => {
    try {
      setActionLoading(prev => ({ ...prev, [eventId]: 'toggle' }));
      
      const updatedEvent = await eventService.toggleBlock(eventId);
      
      // Actualizar el evento en la lista
      setEvents(prev => prev.map(event => 
        event.id === eventId ? updatedEvent : event
      ));
      
    } catch (err) {
      console.error('Error toggling event block:', err);
      setError('Error al cambiar el estado de bloqueo del evento');
    } finally {
      setActionLoading(prev => ({ ...prev, [eventId]: null }));
    }
  };

  const handleChangeStatus = async (eventId, newStatus) => {
    try {
      setActionLoading(prev => ({ ...prev, [eventId]: 'status' }));
      
      const updatedEvent = await eventService.changeStatus(eventId, newStatus);
      
      // Actualizar el evento en la lista
      setEvents(prev => prev.map(event => 
        event.id === eventId ? updatedEvent : event
      ));
      
    } catch (err) {
      console.error('Error changing event status:', err);
      setError('Error al cambiar el estado del evento');
    } finally {
      setActionLoading(prev => ({ ...prev, [eventId]: null }));
    }
  };

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.location?.address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.location?.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.location?.country?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || event.status?.nameState === statusFilter;
    
    const matchesBlock = blockFilter === 'all' || 
                        (blockFilter === 'blocked' && event.bloqueado) ||
                        (blockFilter === 'unblocked' && !event.bloqueado);
    
    return matchesSearch && matchesStatus && matchesBlock;
  });

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case 'Active':
        return 'default';
      case 'Inactive':
        return 'secondary';
      case 'Cancelled':
        return 'destructive';
      case 'Completed':
        return 'outline';
      default:
        return 'secondary';
    }
  };

  const getBlockBadgeVariant = (blocked) => {
    return blocked ? 'destructive' : 'default';
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    try {
      return new Date(dateString).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Eventos</h1>
          <p className="text-gray-600 mt-1">
            Administra eventos, cambia estados y controla el acceso
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            onClick={fetchEvents} 
            variant="outline" 
            disabled={loading}
            className="gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Actualizar
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative md:col-span-2">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Buscar eventos por título, descripción o ubicación..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Status Filter */}
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filtrar por estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                {Object.values(EVENT_STATES).map(status => (
                  <SelectItem key={status} value={status}>{status}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Block Filter */}
            <Select value={blockFilter} onValueChange={setBlockFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filtrar por bloqueo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="unblocked">No bloqueados</SelectItem>
                <SelectItem value="blocked">Bloqueados</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Events List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-600" />
            Lista de Eventos
          </CardTitle>
          <CardDescription>
            {filteredEvents.length} evento(s) encontrado(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
                <p className="text-gray-600">Cargando eventos...</p>
              </div>
            </div>
          ) : error ? (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : filteredEvents.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No se encontraron eventos
              </h3>
              <p className="text-gray-600">
                {searchTerm || statusFilter !== 'all' || blockFilter !== 'all' 
                  ? 'No hay eventos que coincidan con los filtros aplicados.' 
                  : 'No hay eventos registrados en el sistema.'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Evento</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Ubicación</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Bloqueo</TableHead>
                    <TableHead>Capacidad</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEvents.map((event) => (
                    <TableRow key={event.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{event.title || 'Sin título'}</div>
                          <div className="text-sm text-gray-600 truncate max-w-xs">
                            {event.description || 'Sin descripción'}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>{formatDate(event.startDate)}</div>
                          {event.endDate && (
                            <div className="text-gray-600">
                              hasta {formatDate(event.endDate)}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {event.location?.address || event.location?.city || event.location?.country || '-'}
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadgeVariant(event.status?.nameState)}>
                          {event.status?.nameState || 'Sin estado'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getBlockBadgeVariant(event.bloqueado)}>
                          {event.bloqueado ? 'Bloqueado' : 'Disponible'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {event.maxCapacity ? `${event.currentAttendees || 0}/${event.maxCapacity}` : '-'}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button 
                              variant="ghost" 
                              className="h-8 w-8 p-0"
                              disabled={actionLoading[event.id]}
                            >
                              {actionLoading[event.id] ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <MoreHorizontal className="h-4 w-4" />
                              )}
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            
                            <DropdownMenuItem onClick={() => console.log('Ver detalles', event.id)}>
                              <Eye className="mr-2 h-4 w-4" />
                              Ver detalles
                            </DropdownMenuItem>
                            
                            <DropdownMenuSeparator />
                            
                            <DropdownMenuItem 
                              onClick={() => handleToggleBlock(event.id)}
                              disabled={actionLoading[event.id]}
                            >
                              {event.bloqueado ? (
                                <>
                                  <Unlock className="mr-2 h-4 w-4" />
                                  Desbloquear
                                </>
                              ) : (
                                <>
                                  <Lock className="mr-2 h-4 w-4" />
                                  Bloquear
                                </>
                              )}
                            </DropdownMenuItem>
                            
                            <DropdownMenuSeparator />
                            
                            <DropdownMenuLabel>Cambiar Estado</DropdownMenuLabel>
                            {Object.values(EVENT_STATES).map(status => (
                              <DropdownMenuItem 
                                key={status}
                                onClick={() => handleChangeStatus(event.id, status)}
                                disabled={actionLoading[event.id] || event.status?.nameState === status}
                              >
                                <Edit className="mr-2 h-4 w-4" />
                                {status}
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Stats */}
      {!loading && events.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-blue-600" />
                <div>
                  <p className="text-sm font-medium">Total Eventos</p>
                  <p className="text-2xl font-bold">{events.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-green-600" />
                <div>
                  <p className="text-sm font-medium">Activos</p>
                  <p className="text-2xl font-bold">
                    {events.filter(e => e.status?.nameState === 'Active').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-red-600" />
                <div>
                  <p className="text-sm font-medium">Bloqueados</p>
                  <p className="text-2xl font-bold">
                    {events.filter(e => e.bloqueado).length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <Unlock className="w-4 h-4 text-orange-600" />
                <div>
                  <p className="text-sm font-medium">Disponibles</p>
                  <p className="text-2xl font-bold">
                    {events.filter(e => !e.bloqueado).length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default EventManagement;
