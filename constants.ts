import servicesData from '@/content/services.json'
import projectsData from '@/content/projects.json'
import clientsData from '@/content/clients.json'
import type { Service, Project, Client } from '@/types'

export const SERVICES_DATA = servicesData as Service[]
export const PROJECTS_DATA = projectsData as Project[]
export const CLIENTS_DATA = clientsData as Client[]
