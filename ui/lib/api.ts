const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export interface ApiResponse<T> {
  ok: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
}

export interface AuthResponse {
  accessToken: string;
  user: {
    id: string;
    email: string;
    name?: string;
    role: 'ADMIN' | 'INSTRUCTOR' | 'MEMBER';
  };
}

export interface UserResponse {
  id: string;
  email: string;
  name?: string;
  role: 'ADMIN' | 'INSTRUCTOR' | 'MEMBER';
  createdAt: string;
  updatedAt: string;
}

export interface ScheduleResponse {
  id: string;
  startsAt: string;
  endsAt: string;
  classType: {
    id: string;
    name: string;
  };
  instructor: {
    id: string;
    name?: string;
  };
  capacity: number;
  confirmedCount: number;
  remainingCapacity: number;
  registrationOpen: boolean;
  registrationCloseReason?: string;
}

export interface BookingResponse {
  id: string;
  sessionId: string;
  userId: string;
  status: 'CONFIRMED' | 'CANCELLED' | 'NO_SHOW';
  bookedAt: string;
  cancelledAt?: string;
  session?: {
    id: string;
    startsAt: string;
    endsAt: string;
    capacity: number;
    location: string;
    classType?: {
      id: string;
      name: string;
      durationMinutes: number;
      cancellationCutoffHours?: number;
    };
    instructor?: {
      id: string;
      user: {
        name?: string;
      };
    };
  };
}

// Helper: Get auth token from localStorage
function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('auth_token');
}

// Helper: Make request with auth header
async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data: ApiResponse<T> = await response.json();

  if (!data.ok || data.error) {
    const error = new Error(data.error?.message || 'API request failed');
    (error as any).code = data.error?.code;
    (error as any).details = data.error?.details;
    throw error;
  }

  if (!data.data) {
    throw new Error('No data in response');
  }

  return data.data;
}

// Auth endpoints
export async function login(email: string, password: string): Promise<AuthResponse> {
  const data = await request<AuthResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });

  // Store token
  if (typeof window !== 'undefined') {
    localStorage.setItem('auth_token', data.accessToken);
  }

  return data;
}

export async function register(
  email: string,
  password: string,
  name?: string
): Promise<AuthResponse> {
  const data = await request<AuthResponse>('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ email, password, name }),
  });

  // Store token
  if (typeof window !== 'undefined') {
    localStorage.setItem('auth_token', data.accessToken);
  }

  return data;
}

export async function getMe(): Promise<UserResponse> {
  return request<UserResponse>('/auth/me');
}

// Public schedule
export async function getPublicSchedule(filters?: {
  from?: string;
  to?: string;
  classTypeId?: string;
  instructorId?: string;
}): Promise<ScheduleResponse[]> {
  const params = new URLSearchParams();
  if (filters?.from) params.append('from', filters.from);
  if (filters?.to) params.append('to', filters.to);
  if (filters?.classTypeId) params.append('classTypeId', filters.classTypeId);
  if (filters?.instructorId) params.append('instructorId', filters.instructorId);

  const query = params.toString();
  return request<ScheduleResponse[]>(`/public/schedule${query ? `?${query}` : ''}`);
}

// Bookings
export async function getMyBookings(): Promise<BookingResponse[]> {
  return request<BookingResponse[]>('/bookings');
}

export async function createBooking(sessionId: string): Promise<BookingResponse> {
  return request<BookingResponse>('/bookings', {
    method: 'POST',
    body: JSON.stringify({ sessionId }),
  });
}

export async function cancelBooking(bookingId: string): Promise<BookingResponse> {
  return request<BookingResponse>(`/bookings/${bookingId}`, {
    method: 'DELETE',
  });
}

// Instructor roster
export interface RosterResponse {
  session: {
    id: string;
    startsAt: string;
    endsAt: string;
    classType: {
      name: string;
    };
  };
  members: {
    id: string;
    name: string;
  }[];
}

export async function getSessionRoster(sessionId: string): Promise<RosterResponse> {
  return request<RosterResponse>(`/instructors/sessions/${sessionId}/roster`);
}

// Admin class types
export interface ClassType {
  id: string;
  name: string;
  description?: string;
  durationMinutes: number;
  defaultCapacity: number;
  cancellationCutoffHours?: number;
  active: boolean;
}

export interface CreateClassTypeDto {
  name: string;
  description?: string;
  durationMinutes: number;
  defaultCapacity: number;
  cancellationCutoffHours?: number;
  active: boolean;
}

export interface UpdateClassTypeDto {
  name?: string;
  description?: string;
  durationMinutes?: number;
  defaultCapacity?: number;
  cancellationCutoffHours?: number;
  active?: boolean;
}

export async function getClassTypes(): Promise<ClassType[]> {
  return request<ClassType[]>('/admin/class-types');
}

export async function createClassType(data: CreateClassTypeDto): Promise<ClassType> {
  return request<ClassType>('/admin/class-types', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateClassType(id: string, data: UpdateClassTypeDto): Promise<ClassType> {
  return request<ClassType>(`/admin/class-types/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

export async function deleteClassType(id: string): Promise<void> {
  return request<void>(`/admin/class-types/${id}`, {
    method: 'DELETE',
  });
}

// Admin instructors
export interface Instructor {
  id: string;
  userId: string;
  user: {
    id: string;
    name?: string;
    email: string;
  };
}

export interface AdminInstructor {
  id: string;
  name: string;
  email: string;
  bio?: string;
  active: boolean;
}

export interface CreateInstructorDto {
  name: string;
  email: string;
  bio?: string;
  active: boolean;
}

export interface UpdateInstructorDto {
  name?: string;
  email?: string;
  bio?: string;
  active?: boolean;
}

export async function getInstructors(): Promise<Instructor[]> {
  return request<Instructor[]>('/admin/instructors');
}

export async function getAdminInstructors(): Promise<AdminInstructor[]> {
  return request<AdminInstructor[]>('/admin/instructors');
}

export async function createInstructor(data: CreateInstructorDto): Promise<AdminInstructor> {
  return request<AdminInstructor>('/admin/instructors', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateInstructor(id: string, data: UpdateInstructorDto): Promise<AdminInstructor> {
  return request<AdminInstructor>(`/admin/instructors/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

export async function deleteInstructor(id: string): Promise<void> {
  return request<void>(`/admin/instructors/${id}`, {
    method: 'DELETE',
  });
}

// Admin sessions
export interface Session {
  id: string;
  classTypeId: string;
  instructorId: string;
  startsAt: string;
  endsAt: string;
  capacity: number;
  location: string;
  status: 'SCHEDULED' | 'CANCELLED';
  registrationOpens?: string;
  registrationCloses?: string;
  classType?: {
    id: string;
    name: string;
  };
  instructor?: {
    id: string;
    user: {
      name?: string;
    };
  };
}

export interface CreateSessionDto {
  classTypeId: string;
  instructorId: string;
  startsAt: string;
  endsAt: string;
  capacity: number;
  location: string;
  status: 'SCHEDULED' | 'CANCELLED';
  registrationOpens?: string;
  registrationCloses?: string;
}

export interface UpdateSessionDto {
  classTypeId?: string;
  instructorId?: string;
  startsAt?: string;
  endsAt?: string;
  capacity?: number;
  location?: string;
  status?: 'SCHEDULED' | 'CANCELLED';
  registrationOpens?: string;
  registrationCloses?: string;
}

export async function getSessions(): Promise<Session[]> {
  return request<Session[]>('/admin/sessions');
}

export async function createSession(data: CreateSessionDto): Promise<Session> {
  return request<Session>('/admin/sessions', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateSession(id: string, data: UpdateSessionDto): Promise<Session> {
  return request<Session>(`/admin/sessions/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

export async function deleteSession(id: string): Promise<void> {
  return request<void>(`/admin/sessions/${id}`, {
    method: 'DELETE',
  });
}

// Logout helper
export function logout(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('auth_token');
  }
}

