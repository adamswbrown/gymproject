const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

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

  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });
  } catch (error: any) {
    // Network error (API server not reachable)
    const networkError = new Error(error?.message || 'Network error: API server not reachable');
    (networkError as any).status = 0;
    (networkError as any).isNetworkError = true;
    throw networkError;
  }

  const data: ApiResponse<T> = await response.json();

  if (!data.ok || data.error) {
    const error = new Error(data.error?.message || 'API request failed');
    (error as any).code = data.error?.code;
    (error as any).status = response.status;
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

  // Store token in both localStorage and cookie (for middleware)
  if (typeof window !== 'undefined') {
    localStorage.setItem('auth_token', data.accessToken);
    // Set cookie for middleware to read
    document.cookie = `auth_token=${data.accessToken}; path=/; max-age=86400; SameSite=Lax`;
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

// Public schedule (deprecated - use getSchedule for authenticated users)
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

// Authenticated schedule for members
export async function getSchedule(filters?: {
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
  return request<ScheduleResponse[]>(`/members/schedule${query ? `?${query}` : ''}`);
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

export async function getInstructorMySessions(): Promise<Session[]> {
  return request<Session[]>('/instructors/me/sessions');
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

export async function getAdminClassTypes(): Promise<ClassType[]> {
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

export async function getAdminSessions(): Promise<Session[]> {
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
    // Clear cookie as well
    document.cookie = 'auth_token=; path=/; max-age=0; SameSite=Lax';
  }
}

// Member Profile
export interface ProfileResponse {
  id: string;
  email: string;
  name?: string;
  phone?: string;
  smsVerified: boolean;
  dateOfBirth?: string;
  role: string;
  createdAt: string;
  updatedAt: string;
  memberProfile?: {
    gender?: string;
    addressStreet?: string;
    addressCity?: string;
    addressPostalCode?: string;
    addressCountry?: string;
    emergencyContactName?: string;
    emergencyContactPhone?: string;
    emergencyContactRelationship?: string;
  };
}

export interface UpdateProfileDto {
  name?: string;
  email?: string;
  phone?: string;
  dateOfBirth?: string;
  gender?: string;
  addressStreet?: string;
  addressCity?: string;
  addressPostalCode?: string;
  addressCountry?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  emergencyContactRelationship?: string;
}

export async function getProfile(): Promise<ProfileResponse> {
  return request<ProfileResponse>('/members/profile');
}

export async function updateProfile(data: UpdateProfileDto): Promise<ProfileResponse> {
  return request<ProfileResponse>('/members/profile', {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

export async function updatePassword(currentPassword: string, newPassword: string): Promise<{ message: string }> {
  return request<{ message: string }>('/members/profile/password', {
    method: 'PATCH',
    body: JSON.stringify({ currentPassword, newPassword }),
  });
}

export async function updateContact(data: {
  phone?: string;
  addressStreet?: string;
  addressCity?: string;
  addressPostalCode?: string;
  addressCountry?: string;
}): Promise<ProfileResponse> {
  return request<ProfileResponse>('/members/profile/contact', {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

export async function updateEmergencyContact(data: {
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  emergencyContactRelationship?: string;
}): Promise<ProfileResponse> {
  return request<ProfileResponse>('/members/profile/emergency-contact', {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

// Memberships
export interface MembershipResponse {
  id: string;
  userId: string;
  membershipType: string;
  status: string;
  startDate: string;
  endDate?: string;
  autoRenew: boolean;
  paymentMethod?: string;
  lastPaymentDate?: string;
  createdAt: string;
  updatedAt: string;
}

export async function getMemberships(): Promise<MembershipResponse[]> {
  return request<MembershipResponse[]>('/members/memberships');
}

export async function getMembershipDetails(id: string): Promise<MembershipResponse> {
  return request<MembershipResponse>(`/members/memberships/${id}`);
}

// Courses
export interface CourseResponse {
  id: string;
  name: string;
  description?: string;
  startDate: string;
  endDate: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  isRegistered?: boolean;
  registrationStatus?: string;
}

export interface CourseRegistrationResponse {
  id: string;
  userId: string;
  courseId: string;
  status: string;
  registeredAt: string;
  cancelledAt?: string;
  course: CourseResponse;
}

export async function getCourses(): Promise<CourseResponse[]> {
  return request<CourseResponse[]>('/members/courses');
}

export async function registerForCourse(courseId: string): Promise<CourseRegistrationResponse> {
  return request<CourseRegistrationResponse>(`/members/courses/${courseId}/register`, {
    method: 'POST',
  });
}

export async function unregisterFromCourse(courseId: string): Promise<CourseRegistrationResponse> {
  return request<CourseRegistrationResponse>(`/members/courses/${courseId}/register`, {
    method: 'DELETE',
  });
}

// Registrations
export interface RegistrationResponse {
  id: string;
  type: 'CLASS' | 'COURSE';
  sessionId?: string;
  courseId?: string;
  status: string;
  registeredAt: string;
  cancelledAt?: string;
  session?: {
    id: string;
    startsAt: string;
    endsAt: string;
    classType: {
      id: string;
      name: string;
    };
    instructor: {
      id: string;
      user: {
        name?: string;
      };
    };
    location: string;
  };
  course?: {
    id: string;
    name: string;
    startDate: string;
    endDate: string;
  };
}

export async function getAllRegistrations(): Promise<RegistrationResponse[]> {
  return request<RegistrationResponse[]>('/members/registrations');
}

export async function getUpcomingRegistrations(): Promise<RegistrationResponse[]> {
  return request<RegistrationResponse[]>('/members/registrations/upcoming');
}

export async function getClassRegistrations(): Promise<RegistrationResponse[]> {
  return request<RegistrationResponse[]>('/members/registrations/classes');
}

export async function getCourseRegistrations(): Promise<RegistrationResponse[]> {
  return request<RegistrationResponse[]>('/members/registrations/courses');
}

export async function exportCalendar(): Promise<Blob> {
  const response = await fetch(`${API_BASE_URL}/members/registrations/calendar-export`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${getToken()}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to export calendar');
  }

  return response.blob();
}

// Payments
export interface PaymentMethodResponse {
  id: string;
  type: string;
  last4?: string;
  expiryMonth?: number;
  expiryYear?: number;
  cardholderName?: string;
  isDefault: boolean;
  createdAt: string;
}

export interface PendingPaymentResponse {
  id: string;
  amount: number;
  currency: string;
  description: string;
  dueDate: string;
  status: string;
  createdAt: string;
}

export interface ReceiptResponse {
  id: string;
  amount: number;
  currency: string;
  description: string;
  paymentDate: string;
  paymentMethod?: string;
  transactionId?: string;
  createdAt: string;
}

export async function getPaymentMethods(): Promise<PaymentMethodResponse[]> {
  return request<PaymentMethodResponse[]>('/members/payments/methods');
}

export async function getPendingPayments(): Promise<PendingPaymentResponse[]> {
  return request<PendingPaymentResponse[]>('/members/payments/pending');
}

export async function getReceipts(): Promise<ReceiptResponse[]> {
  return request<ReceiptResponse[]>('/members/payments/receipts');
}

export async function addPaymentMethod(paymentMethodId: string): Promise<PaymentMethodResponse> {
  return request<PaymentMethodResponse>('/members/payments/methods', {
    method: 'POST',
    body: JSON.stringify({ paymentMethodId }),
  });
}

export async function removePaymentMethod(id: string): Promise<{ message: string }> {
  return request<{ message: string }>(`/members/payments/methods/${id}`, {
    method: 'DELETE',
  });
}

export async function processPayment(data: {
  amount: number;
  currency?: string;
  paymentMethodId?: string;
  description?: string;
}): Promise<{ clientSecret: string; paymentId: string }> {
  return request<{ clientSecret: string; paymentId: string }>('/members/payments/process', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

// Documents
export interface DocumentResponse {
  id: string;
  name: string;
  type: string;
  url: string;
  uploadedAt: string;
}

export async function getDocuments(): Promise<DocumentResponse[]> {
  return request<DocumentResponse[]>('/members/documents');
}

// Notifications
export interface NotificationSettings {
  id: string;
  userId: string;
  receiptsEmail: boolean;
  waitlistEmail: boolean;
  classNotificationsEmail: boolean;
  courseNotificationsEmail: boolean;
  createdAt: string;
  updatedAt: string;
}

export async function getNotificationSettings(): Promise<NotificationSettings> {
  return request<NotificationSettings>('/members/notifications/settings');
}

export async function updateNotificationSettings(data: {
  receiptsEmail?: boolean;
  waitlistEmail?: boolean;
  classNotificationsEmail?: boolean;
  courseNotificationsEmail?: boolean;
}): Promise<NotificationSettings> {
  return request<NotificationSettings>('/members/notifications/settings', {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

// Contact
export interface ContactInfo {
  email: string;
  phone: string;
  address: {
    street: string;
    line2: string;
    city: string;
    county: string;
    postalCode: string;
    country: string;
  };
}

export async function getContactInfo(): Promise<ContactInfo> {
  return request<ContactInfo>('/members/contact');
}

// Family Management
export interface FamilyMemberResponse {
  id: string;
  name?: string;
  email: string;
  relationshipType: string;
  isChild: boolean;
  user: {
    id: string;
    name?: string;
    email: string;
    dateOfBirth?: string;
  };
}

export interface FamilyManagerResponse {
  id: string;
  invitedEmail: string;
  invitedUserId?: string;
  status: string;
  createdAt: string;
  acceptedAt?: string;
  invitedUser?: {
    id: string;
    name?: string;
    email: string;
  };
}

export interface CreateChildDto {
  name: string;
  email: string;
  password: string;
  dateOfBirth?: string;
  gender?: string;
}

export async function getFamilyMembers(): Promise<{ children: FamilyMemberResponse[]; managers: FamilyManagerResponse[] }> {
  return request<{ children: FamilyMemberResponse[]; managers: FamilyManagerResponse[] }>('/members/family');
}

export async function createChild(data: CreateChildDto): Promise<FamilyMemberResponse> {
  return request<FamilyMemberResponse>('/members/family/children', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function removeChild(childId: string): Promise<{ message: string }> {
  return request<{ message: string }>(`/members/family/children/${childId}`, {
    method: 'DELETE',
  });
}

export async function inviteFamilyManager(email: string): Promise<FamilyManagerResponse> {
  return request<FamilyManagerResponse>('/members/family/managers/invite', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
}

export async function getFamilyManagers(): Promise<FamilyManagerResponse[]> {
  return request<FamilyManagerResponse[]>('/members/family/managers');
}

export async function removeFamilyManager(invitationId: string): Promise<{ message: string }> {
  return request<{ message: string }>(`/members/family/managers/${invitationId}`, {
    method: 'DELETE',
  });
}

export async function acceptFamilyManagerInvitation(token: string): Promise<{ message: string }> {
  return request<{ message: string }>(`/members/family/managers/accept/${token}`, {
    method: 'POST',
  });
}

// Admin Users
export interface AdminUserResponse {
  id: string;
  email: string;
  name?: string;
  role: 'ADMIN' | 'INSTRUCTOR' | 'MEMBER';
  phone?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserDto {
  email: string;
  password: string;
  name?: string;
  role: 'ADMIN' | 'INSTRUCTOR' | 'MEMBER';
}

export interface UpdateUserDto {
  email?: string;
  name?: string;
  role?: 'ADMIN' | 'INSTRUCTOR' | 'MEMBER';
}

export async function getAdminUsers(): Promise<AdminUserResponse[]> {
  return request<AdminUserResponse[]>('/admin/users');
}

export async function getAdminUserById(id: string): Promise<AdminUserResponse> {
  return request<AdminUserResponse>(`/admin/users/${id}`);
}

export async function createAdminUser(data: CreateUserDto): Promise<AdminUserResponse> {
  return request<AdminUserResponse>('/admin/users', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateAdminUser(id: string, data: UpdateUserDto): Promise<AdminUserResponse> {
  return request<AdminUserResponse>(`/admin/users/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

export async function deleteAdminUser(id: string): Promise<void> {
  return request<void>(`/admin/users/${id}`, {
    method: 'DELETE',
  });
}

// Store
export interface ProductResponse {
  id: string;
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItemResponse {
  id: string;
  productId: string;
  quantity: number;
  price: number;
  product: ProductResponse;
}

export interface OrderResponse {
  id: string;
  userId: string;
  totalAmount: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  orderItems: OrderItemResponse[];
}

export interface CreateOrderDto {
  items: Array<{
    productId: string;
    quantity: number;
  }>;
}

export async function getProducts(): Promise<ProductResponse[]> {
  return request<ProductResponse[]>('/store/products');
}

export async function getProductById(id: string): Promise<ProductResponse> {
  return request<ProductResponse>(`/store/products/${id}`);
}

export async function createOrder(data: CreateOrderDto): Promise<OrderResponse> {
  return request<OrderResponse>('/store/orders', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function createCheckoutForOrder(orderId: string): Promise<{ sessionId: string; clientSecret: string }> {
  return request<{ sessionId: string; clientSecret: string }>(`/store/orders/${orderId}/checkout`, {
    method: 'POST',
  });
}

export async function createCheckoutSession(data: {
  items: Array<{ name: string; amount: number; quantity: number }>;
  metadata?: Record<string, string>;
  successUrl?: string;
  cancelUrl?: string;
}): Promise<{ sessionId: string; clientSecret: string }> {
  return request<{ sessionId: string; clientSecret: string }>('/members/payments/checkout', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function getUserOrders(): Promise<OrderResponse[]> {
  return request<OrderResponse[]>('/store/orders');
}

export async function getOrderById(id: string): Promise<OrderResponse> {
  return request<OrderResponse>(`/store/orders/${id}`);
}

// Admin Products
export interface CreateProductDto {
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  active?: boolean;
}

export interface UpdateProductDto {
  name?: string;
  description?: string;
  price?: number;
  imageUrl?: string;
  active?: boolean;
}

export async function getAdminProducts(): Promise<ProductResponse[]> {
  return request<ProductResponse[]>('/admin/products');
}

export async function getAdminProductById(id: string): Promise<ProductResponse> {
  return request<ProductResponse>(`/admin/products/${id}`);
}

export async function createAdminProduct(data: CreateProductDto): Promise<ProductResponse> {
  return request<ProductResponse>('/admin/products', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateAdminProduct(id: string, data: UpdateProductDto): Promise<ProductResponse> {
  return request<ProductResponse>(`/admin/products/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

export async function deleteAdminProduct(id: string): Promise<void> {
  return request<void>(`/admin/products/${id}`, {
    method: 'DELETE',
  });
}

// Documents
export async function uploadDocument(file: File): Promise<DocumentResponse> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${API_BASE_URL}/members/documents`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${getToken()}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to upload document');
  }

  const result = await response.json();
  return result.data;
}

export async function deleteDocument(id: string): Promise<void> {
  return request<void>(`/members/documents/${id}`, {
    method: 'DELETE',
  });
}

