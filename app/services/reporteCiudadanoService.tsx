import { API_URL } from '@env'

// Tipos para las respuestas
export interface Report {
  titulo: string
  descripcion: string
  foto: string
  fecha_reporte: string
  estatus: string
  dependencia: string
}

export interface Dependencia {
  id_dependencia: number
  nombre: string
}

// Función para obtener reportes por partido
export const fetchReportesPorPartido = async (
  idPartido: number
): Promise<Report[]> => {
  try {
    const response = await fetch(`${API_URL}api/reportes/partido/${idPartido}`)
    if (!response.ok) throw new Error('Error al obtener reportes')
    return await response.json()
  } catch (error) {
    console.error('Error al obtener reportes:', error)
    return [] // Retorna un array vacío en caso de error
  }
}

// Función para obtener dependencias
export const fetchDependencias = async (): Promise<Dependencia[]> => {
  try {
    const response = await fetch(`${API_URL}api/reportes/dependencias`)
    if (!response.ok) throw new Error('Error al obtener dependencias')
    return await response.json()
  } catch (error) {
    console.error('Error fetching dependencias:', error)
    return [] // Retorna un array vacío en caso de error
  }
}

// Función para filtrar reportes
export const filterReports = (
  reports: Report[],
  selectedDependencia: string,
  status: string,
  startDate: string,
  endDate: string
): Report[] => {
  return reports.filter((report) => {
    const matchesDependencia =
      selectedDependencia === '' || report.dependencia === selectedDependencia
    const matchesStatus = status === '' || report.estatus === status
    const matchesDate =
      (startDate === '' ||
        new Date(report.fecha_reporte) >= new Date(startDate)) &&
      (endDate === '' || new Date(report.fecha_reporte) <= new Date(endDate))

    return matchesDependencia && matchesStatus && matchesDate
  })
}
