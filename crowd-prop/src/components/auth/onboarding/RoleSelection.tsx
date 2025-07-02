'use client';

import { UserRole } from '@/app/interfaces/user';

interface RoleSelectionProps {
  selectedRole: UserRole | null;
  onRoleSelect: (role: UserRole) => void;
  onNext: () => void;
}

export default function RoleSelection({ selectedRole, onRoleSelect, onNext }: RoleSelectionProps) {
  const roles = [
    {
      id: 'ADVERTISER' as UserRole,
      title: 'Business / Advertiser',
      description: 'I want to promote my business or products',
      icon: '🏢',
      features: [
        'Create marketing campaigns',
        'Connect with influencers',
        'Track campaign performance',
        'Manage promotional budgets'
      ]
    },
    {
      id: 'PROMOTER' as UserRole,
      title: 'Creator / Promoter',
      description: 'I want to earn money by promoting brands',
      icon: '📱',
      features: [
        'Apply to campaigns',
        'Showcase your work',
        'Earn from promotions',
        'Build your portfolio'
      ]
    }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          How do you plan to use CrowdProp?
        </h2>
        <p className="text-gray-600">
          Choose the option that best describes your goals
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {roles.map((role) => (
          <button
            key={role.id}
            onClick={() => onRoleSelect(role.id)}
            className={`p-6 border-2 rounded-xl text-left transition-all duration-200 hover:shadow-lg ${
              selectedRole === role.id
                ? 'border-blue-500 bg-blue-50 shadow-md'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex items-start space-x-4">
              <div className="text-3xl">{role.icon}</div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  {role.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  {role.description}
                </p>
                <ul className="space-y-1">
                  {role.features.map((feature, index) => (
                    <li key={index} className="flex items-center text-sm text-gray-500">
                      <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </button>
        ))}
      </div>

      <div className="flex justify-end">
        <button
          onClick={onNext}
          disabled={!selectedRole}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
