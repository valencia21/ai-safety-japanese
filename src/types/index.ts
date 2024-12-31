import { Database } from './database.types'

// Extract the Row type from reading_overview table
export type ReadingOverview = Database['public']['Tables']['reading_overview']['Row']
export type SessionOverview = Database['public']['Tables']['session_overview']['Row']
export type ReadingDetails = Database['public']['Tables']['reading_details']['Row']

// Common enums
export type Format = Database['public']['Enums']['format']
export type Status = Database['public']['Enums']['status']
export type ProjectType = Database['public']['Enums']['project_type'] 