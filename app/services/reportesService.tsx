import { API_URL } from '@env'
import connectSocket from './SocketIOComponent'
// Tipo para un reporte
export type Report = {
  titulo: string
  descripcion: string
  foto: string
  fecha_reporte: string
  estatus: string
  dependencia: string
}

// Variable para rastrear si ya estamos esperando una nueva actualización
let fetchReportesTimeout: NodeJS.Timeout | null = null

export const fetchReportes = async (
  idPartido: number,
  setReportes: React.Dispatch<React.SetStateAction<Report[]>>,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
) => {
  // Cancelar cualquier solicitud anterior pendiente
  if (fetchReportesTimeout) {
    clearTimeout(fetchReportesTimeout)
  }

  try {
    const response = await fetch(`${API_URL}api/reportes/partido/${idPartido}`)
    if (!response.ok) {
      throw new Error('Error al obtener los reportes')
    }

    const data: Report[] = await response.json()

    setReportes((prevReportes) => {
      // Filtrar reportes nuevos que no están en la lista
      const nuevosReportes = data.filter(
        (nuevoReporte) =>
          !prevReportes.some(
            (reporteExistente) =>
              reporteExistente.titulo === nuevoReporte.titulo &&
              reporteExistente.fecha_reporte === nuevoReporte.fecha_reporte
          )
      )

      // Si hay reportes nuevos, actualizamos inmediatamente sin esperar
      if (nuevosReportes.length > 0) {
        return [...nuevosReportes, ...prevReportes].sort(
          (a, b) =>
            new Date(b.fecha_reporte).getTime() -
            new Date(a.fecha_reporte).getTime()
        )
      }

      return prevReportes
    })
  } catch (error) {
    console.error('Error al cargar reportes:', error)
  } finally {
    setLoading(false)
  }

  // Configurar un debounce de 5 segundos para la siguiente actualización
  fetchReportesTimeout = setTimeout(
    () => fetchReportes(idPartido, setReportes, setLoading),
    5000
  )
}
// Escuchar eventos en tiempo real
export const listenForNewReports = (
  idPartido: number,
  setReportes: React.Dispatch<React.SetStateAction<Report[]>>
) => {
  const socket = connectSocket()

  socket.on(`nuevo_reporte_${idPartido}`, (nuevoReporte: Report) => {
    console.log('📩 Nuevo reporte recibido:', nuevoReporte)
    setReportes((prevReportes) => [nuevoReporte, ...prevReportes])
  })
}
