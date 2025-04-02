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
  payment_method_id?: string; // Añadimos el ID del método de pago
}

export interface DepositConfirmResponse {
  success: boolean;
  message?: string;
  deposit_id?: string;
}

export interface Deposit {
  id: string;
  user: number;
  amount: number;
  status: 'pending' | 'approved' | 'rejected';
  reference: string;
  unique_code: string;
  created_at: string;
  updated_at?: string;
}

// Admin specific fields 
export interface AdminDeposit extends Deposit {
  paymentMethod: string;
  payment_method_id?: string;
  user_email?: string;
  user_full_name?: string;
  admin_notes?: string;
  approved_by?: number;
  rejected_by?: number;
}

export interface DepositApproveRequest {
  deposit_id: string;
  admin_notes?: string;
}

export interface DepositApproveResponse {
  success: boolean;
  message?: string;
}
