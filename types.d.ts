export type RootStackParamList = {
  Index: undefined
  Login: undefined
  Dashboard: undefined
  Conectate: undefined
  ConsultarSaldo: undefined
  DirectorioServicios: undefined
  Invitacion: undefined
  Noticias: undefined
  PromocionesDescuentos: undefined
  Recargas: undefined
  ReporteCiudadano: undefined
}

// src/types.ts
// src/types.ts
export interface Plan {
  cv_plan: number
  imagen_movil1: string
  nombre_comercial: string
  datos: string
  vigencia: string
  monto: number
  ticket: string
}

// types.ts
export type Comentario = {
  ComentarioID: number
  UsuarioID: number
  NombreUsuario: string
  Comentario: string
  FechaComentario: string
}
