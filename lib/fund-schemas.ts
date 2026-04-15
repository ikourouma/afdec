import { z } from "zod";

export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export const grantApplicationSchema = z.object({
  // Step 1: Institutional Profile
  business_name: z.string().min(2, "Business name is required"),
  business_registration_no: z.string().min(2, "Registration number is required"),
  country: z.string().min(2, "Country is required"),
  sector: z.string().min(2, "Sector is required"),
  years_in_operation: z.number().min(0),
  employee_count: z.number().min(0),
  annual_revenue_band: z.string().min(1, "Revenue band is required"),
  
  // Contact
  contact_name: z.string().min(2, "Contact name is required"),
  contact_title: z.string().min(2, "Contact title is required"),
  contact_email: z.string().email("Invalid email address"),
  contact_phone: z.string().min(5, "Contact phone is required"),

  // Step 2: Capital Logic
  project_id: z.string().uuid("Please select a project"),
  project_title: z.string().min(5, "Project title is required"),
  project_description: z.string().min(50, "Detailed description is required (min 50 chars)"),
  requested_amount_usd: z.number().min(1000, "Minimum request is $1,000"),
  impact_statement: z.string().min(50, "Impact statement is required (min 50 chars)"),
  implementation_plan: z.string().min(50, "Implementation plan is required"),
  timeline_months: z.number().min(1).max(60),

  // Step 3: Documents (URLs stored after upload)
  business_plan_url: z.string().min(1, "Business Plan is required"),
  registration_doc_url: z.string().min(1, "Registration Document is required"),
  financial_statements_url: z.string().min(1, "Financial Statements are required"),
});

export type GrantApplicationInput = z.infer<typeof grantApplicationSchema>;

export const donorInterestSchema = z.object({
  inquiry_type: z.enum(['donor_individual', 'donor_institutional', 'program_partner', 'matching_funds']),
  full_name: z.string().min(2, "Full name is required"),
  organization: z.string().optional(), 
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  country: z.string().optional(),
  preferred_project_id: z.string().uuid().nullable().optional(),
  contribution_type: z.string().optional(),
  estimated_contribution_usd: z.coerce.number().optional(),
  message: z.string().min(10, "Please provide detailed interest (min 10 chars)"),
});

export type DonorInterestInput = z.infer<typeof donorInterestSchema>;
