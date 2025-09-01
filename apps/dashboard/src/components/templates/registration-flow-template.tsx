import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle, Users, Mail, Lock, UserCheck } from 'lucide-react';

interface RegistrationFlowTemplateProps {
  onApply?: () => void;
  isApplied?: boolean;
}

const registrationSteps = [
  {
    id: 'landing',
    name: 'Landing Page',
    description: 'User arrives on registration page',
    events: ['page_view', 'reg_start'],
    icon: Users,
    color: 'bg-blue-500'
  },
  {
    id: 'email_input',
    name: 'Email Input',
    description: 'User enters email address',
    events: ['email_input', 'email_validation'],
    icon: Mail,
    color: 'bg-green-500'
  },
  {
    id: 'password_setup',
    name: 'Password Setup',
    description: 'User creates password',
    events: ['password_input', 'password_validation'],
    icon: Lock,
    color: 'bg-yellow-500'
  },
  {
    id: 'email_verify',
    name: 'Email Verification',
    description: 'User verifies email',
    events: ['email_sent', 'email_verified', 'reg_complete'],
    icon: CheckCircle,
    color: 'bg-purple-500'
  },
  {
    id: 'activation',
    name: 'First Login',
    description: 'User logs in for first time',
    events: ['first_login', 'activation_complete'],
    icon: UserCheck,
    color: 'bg-indigo-500'
  }
];

export const RegistrationFlowTemplate: React.FC<RegistrationFlowTemplateProps> = ({
  onApply,
  isApplied = false
}) => {
  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-600" />
              Registration Flow Template
            </CardTitle>
            <CardDescription>
              Pre-configured funnel for tracking user registration and activation
            </CardDescription>
          </div>
          <Badge variant={isApplied ? "default" : "secondary"}>
            {isApplied ? "Applied" : "Template"}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Flow Steps */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-muted-foreground">FLOW STEPS</h4>
          <div className="space-y-3">
            {registrationSteps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={step.id} className="flex items-start gap-3 p-3 rounded-lg border bg-muted/20">
                  <div className={`p-2 rounded-full ${step.color} text-white`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h5 className="font-medium text-sm">{step.name}</h5>
                      <Badge variant="outline" className="text-xs">
                        Step {index + 1}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {step.description}
                    </p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {step.events.map((event) => (
                        <Badge key={event} variant="secondary" className="text-xs">
                          {event}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* SDK Integration */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-muted-foreground">SDK INTEGRATION</h4>
          <div className="bg-muted p-4 rounded-lg">
            <p className="text-sm font-medium mb-2">Add to your registration form:</p>
            <pre className="text-xs bg-background p-3 rounded border overflow-x-auto">
{`// Track registration start
track('reg_start', {
  step: 'landing',
  source: document.referrer,
  userAgent: navigator.userAgent
});

// Track email input
track('email_input', {
  step: 'email',
  hasValue: email.length > 0
});

// Track form submission
track('reg_complete', {
  step: 'registration',
  method: 'email',
  timestamp: new Date().toISOString()
});`}
            </pre>
          </div>
        </div>

        {/* Metrics */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-muted-foreground">KEY METRICS</h4>
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-green-50 rounded-lg border border-green-200">
              <div className="text-2xl font-bold text-green-700">Conversion Rate</div>
              <div className="text-sm text-green-600">Landing → Complete</div>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="text-2xl font-bold text-blue-700">Drop-off Rate</div>
              <div className="text-sm text-blue-600">Per step analysis</div>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
              <div className="text-2xl font-bold text-purple-700">Time to Complete</div>
              <div className="text-sm text-purple-600">Average duration</div>
            </div>
            <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
              <div className="text-2xl font-bold text-orange-700">Activation Rate</div>
              <div className="text-sm text-orange-600">First login within 24h</div>
            </div>
          </div>
        </div>

        {/* Apply Button */}
        {!isApplied && (
          <div className="pt-4 border-t">
            <Button onClick={onApply} className="w-full">
              Apply Registration Template
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
