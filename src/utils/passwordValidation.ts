export interface PasswordRequirement {
  id: string;
  text: string;
  isValid: boolean;
}

export const validatePassword = (password: string): PasswordRequirement[] => {
  return [
    {
      id: 'length',
      text: 'At least 8 characters',
      isValid: password.length >= 8
    },
    {
      id: 'uppercase',
      text: 'At least one uppercase letter',
      isValid: /[A-Z]/.test(password)
    },
    {
      id: 'lowercase',
      text: 'At least one lowercase letter',
      isValid: /[a-z]/.test(password)
    },
    {
      id: 'number',
      text: 'At least one number',
      isValid: /\d/.test(password)
    },
    {
      id: 'special',
      text: 'At least one special character (!@#$%^&*)',
      isValid: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    }
  ];
};

export const isPasswordValid = (password: string): boolean => {
  const requirements = validatePassword(password);
  return requirements.every(req => req.isValid);
};