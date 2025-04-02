// Types for deposit system

export interface DepositRequest {
  amount: number;
}

export interface DepositResponse {
  success: boolean;
  message?: string;
  unique_code: string;
  instructions: string;
  amount: number;
  created_at: string;
  expires_at?: string;
  admin_notes?: string;
  reference?: string;
  deposit_id?: string;
  status?: 'pending' | 'approved' | 'rejected';
  user_email?: string;
  user_full_name?: string;
  user_id?: number;
}

export interface DepositConfirmRequest {
  unique_code: string;
  reference: string;
  payment_method_id?: string; // ID del método de pago
  payment_method?: string;    // Nombre del método de pago
}

export interface DepositConfirmResponse {
  success: boolean;
  message?: string;
  deposit_id?: string;
}

export interface PaymentMethodDetails {
  id: string;
  payment_method: string;
  details: Record<string, string>;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserDetails {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  is_email_verified: boolean;
  phone_number?: string | null;
  is_staff: boolean;
  is_seller: boolean;
  uuid: string;
  date_joined: string;
}

export interface Deposit {
  id: string;
  user: UserDetails | number;
  amount: number;
  unique_code: string;
  reference: string;
  status: 'pending' | 'approved' | 'rejected';
  status_display?: string;
  created_at: string;
  updated_at: string;
  approved_by?: number | null;
  admin_notes?: string | null;
  payment_method: string;
  payment_method_details?: PaymentMethodDetails;
}

// Admin specific fields 
export interface AdminDeposit extends Omit<Deposit, 'user'> {
  user: UserDetails;
}

export interface DepositApproveRequest {
  deposit_id: string;
  admin_notes?: string;
}

export interface DepositApproveResponse {
  success: boolean;
  message?: string;
}
