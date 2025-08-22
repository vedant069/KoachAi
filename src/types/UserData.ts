export interface UserData {
  id: string;
  fullName: string;
  phoneNumber: string;
  email: string;
  userType: 'Parent' | 'Student' | 'Guardian' | '';
  reason: string;
  preferredDate: string;
  signupTimestamp: string;
}