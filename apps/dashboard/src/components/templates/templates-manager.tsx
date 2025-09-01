import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  RegistrationFlowTemplate,
  PaymentFlowTemplate,
  ActivationFlowTemplate
} from './index';
import {
  Users,
  CreditCard,
  UserCheck,
  CheckCircle,
  Sparkles,
  AlertCircle
} from 'lucide-react';

interface TemplatesManagerProps {
  onTemplateApplied?: (templateType: string) => void;
  appliedTemplates?: string[];
}

const templateConfigs = [
  {
    id: 'registration',
    name: 'Registration Flow',
    description: 'Track user sign-up and onboarding funnel',
    icon: Users,
    color: 'text-blue-600',
    component: RegistrationFlowTemplate
  },
  {
    id: 'payment',
    name: 'Payment Flow',
    description: 'Monitor checkout and payment success rates',
    icon: CreditCard,
    color: 'text-green-600',
    component: PaymentFlowTemplate
  },
  {
    id: 'activation',
    name: 'Activation Flow',
    description: 'Measure post-signup engagement and retention',
    icon: UserCheck,
    color: 'text-purple-600',
    component: ActivationFlowTemplate
  }
];

export const TemplatesManager: React.FC<TemplatesManagerProps> = ({
  onTemplateApplied,
  appliedTemplates = []
}) => {
  const [activeTemplate, setActiveTemplate] = useState<string>('registration');
  const [appliedCount, setAppliedCount] = useState(appliedTemplates.length);

  const handleTemplateApply = (templateType: string) => {
    setAppliedCount(prev => prev + 1);
    onTemplateApplied?.(templateType);
  };

  const ActiveTemplateComponent = templateConfigs.find(t => t.id === activeTemplate)?.component;

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-2">
          <Sparkles className="h-6 w-6 text-yellow-500" />
          <h1 className="text-3xl font-bold">AGS Analytics Templates</h1>
        </div>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Pre-configured analytics templates for self-serve flows.
          Choose templates to automatically set up tracking for registration, payments, and user activation.
        </p>

        {/* Progress Badge */}
        <div className="flex items-center justify-center gap-4">
          <Badge variant="outline" className="px-3 py-1">
            {appliedCount} of {templateConfigs.length} Applied
          </Badge>
          {appliedCount === templateConfigs.length && (
            <Badge className="px-3 py-1 bg-green-100 text-green-800">
              <CheckCircle className="h-4 w-4 mr-1" />
              All Templates Applied
            </Badge>
          )}
        </div>
      </div>

      {/* Success Alert */}
      {appliedCount > 0 && appliedCount < templateConfigs.length && (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            Great! You've applied {appliedCount} template{appliedCount > 1 ? 's' : ''}.
            Continue with the remaining templates to get comprehensive analytics coverage.
          </AlertDescription>
        </Alert>
      )}

      {appliedCount === templateConfigs.length && (
        <Alert className="border-blue-200 bg-blue-50">
          <Sparkles className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800">
            Perfect! All templates are now applied. Your analytics setup is complete and ready to track user flows.
          </AlertDescription>
        </Alert>
      )}

      {/* Template Selector */}
      <Tabs value={activeTemplate} onValueChange={setActiveTemplate} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          {templateConfigs.map((template) => {
            const Icon = template.icon;
            const isApplied = appliedTemplates.includes(template.id);
            return (
              <TabsTrigger
                key={template.id}
                value={template.id}
                className="flex items-center gap-2 relative"
              >
                <Icon className={`h-4 w-4 ${template.color}`} />
                <span className="hidden sm:inline">{template.name}</span>
                {isApplied && (
                  <CheckCircle className="h-3 w-3 text-green-600 absolute -top-1 -right-1" />
                )}
              </TabsTrigger>
            );
          })}
        </TabsList>

        {/* Template Content */}
        {templateConfigs.map((template) => {
          const TemplateComponent = template.component;
          const isApplied = appliedTemplates.includes(template.id);

          return (
            <TabsContent key={template.id} value={template.id} className="mt-6">
              <TemplateComponent
                onApply={() => handleTemplateApply(template.id)}
                isApplied={isApplied}
              />
            </TabsContent>
          );
        })}
      </Tabs>

      {/* Quick Actions */}
      <Card className="border-dashed">
        <CardHeader>
          <CardTitle className="text-lg">Quick Actions</CardTitle>
          <CardDescription>
            Additional setup steps to complete your analytics implementation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
              <AlertCircle className="h-5 w-5 text-orange-500" />
              <span className="text-sm font-medium">Configure Webhooks</span>
              <span className="text-xs text-muted-foreground text-center">
                Set up Stripe webhooks for payment tracking
              </span>
            </Button>

            <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
              <Users className="h-5 w-5 text-blue-500" />
              <span className="text-sm font-medium">Test Events</span>
              <span className="text-xs text-muted-foreground text-center">
                Send test events to verify tracking
              </span>
            </Button>

            <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span className="text-sm font-medium">View Dashboard</span>
              <span className="text-xs text-muted-foreground text-center">
                Check your analytics dashboard
              </span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
