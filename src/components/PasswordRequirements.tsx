import { Check, X } from "lucide-react";
import { validatePassword, type PasswordRequirement } from "@/utils/passwordValidation";

interface PasswordRequirementsProps {
  password: string;
  showRequirements: boolean;
}

export const PasswordRequirements: React.FC<PasswordRequirementsProps> = ({
  password,
  showRequirements
}) => {
  const requirements = validatePassword(password);

  if (!showRequirements) return null;

  return (
    <div className="mt-2 p-3 bg-gray-50 rounded-md border">
      <p className="text-sm font-medium text-gray-700 mb-2">Password Requirements:</p>
      <div className="space-y-1">
        {requirements.map((req: PasswordRequirement) => (
          <div key={req.id} className="flex items-center gap-2">
            {req.isValid ? (
              <Check className="w-4 h-4 text-green-500" />
            ) : (
              <X className="w-4 h-4 text-red-500" />
            )}
            <span className={`text-sm ${req.isValid ? 'text-green-600' : 'text-red-600'}`}>
              {req.text}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};