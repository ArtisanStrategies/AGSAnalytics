import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { UserCheck, Mail, Settings, Play, Target, TrendingUp, Clock, CheckCircle2 } from 'lucide-react';

interface ActivationFlowTemplateProps {
  onApply?: () => void;
  isApplied?: boolean;
}

const activationSteps = [
  {
    id: 'first_login',
    name: 'First Login',
    description: 'User logs in for the first time',
    events: ['first_login', 'login_success'],
    icon: UserCheck,
    color: 'bg-blue-500',
    timeframe: '0-1 hour'
  },
  {
    id: 'welcome_email',
    name: 'Welcome Email',
    description: 'User receives welcome communication',
    events: ['email_delivered', 'email_opened', 'email_clicked'],
    icon: Mail,
    color: 'bg-green-500',
    timeframe: '1-6 hours'
  },
  {
    id: 'profile_setup',
    name: 'Profile Setup',
    description: 'User completes profile/onboarding',
    events: ['profile_view', 'profile_updated', 'onboarding_started'],
    icon: Settings,
    color: 'bg-purple-500',
    timeframe: '1-24 hours'
  },
  {
    id: 'first_action',
    name: 'First Action',
    description: 'User performs first meaningful action',
    events: ['feature_used', 'content_created', 'interaction_started'],
    icon: Play,
    color: 'bg-orange-500',
    timeframe: '6-48 hours'
  },
  {
    id: 'engagement',
    name: 'Active Engagement',
    description: 'User shows sustained engagement',
    events: ['session_started', 'feature_discovered', 'goal_completed'],
    icon: Target,
    color: 'bg-indigo-500',
    timeframe: '24-72 hours'
  },
  {
    id: 'activation_complete',
    name: 'Full Activation',
    description: 'User reaches activation milestone',
    events: ['activation_complete', 'retention_day1', 'power_user_start'],
    icon: CheckCircle2,
    color: 'bg-green-600',
    timeframe: '72+ hours'
  }
];

const engagementMetrics = [
  { label: '1-hour activation', target: '30%', current: '25%', status: 'below' },
  { label: '24-hour activation', target: '60%', current: '55%', status: 'below' },
  { label: '7-day retention', target: '40%', current: '45%', status: 'above' },
  { label: 'Feature adoption', target: '50%', current: '48%', status: 'below' }
];

export const ActivationFlowTemplate: React.FC<ActivationFlowTemplateProps> = ({
  onApply,
  isApplied = false
}) => {
  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <UserCheck className="h-5 w-5 text-purple-600" />
              Activation Flow Template
            </CardTitle>
            <CardDescription>
              Track post-registration engagement and user activation milestones
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
          <h4 className="text-sm font-medium text-muted-foreground">ACTIVATION STEPS</h4>
          <div className="space-y-3">
            {activationSteps.map((step, index) => {
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
                        {step.timeframe}
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
            <p className="text-sm font-medium mb-2">Track activation events:</p>
            <pre className="text-xs bg-background p-3 rounded border overflow-x-auto">
{`// Track first login
track('first_login', {
  source: 'email_verification',
  user_type: 'new_user',
  timestamp: new Date().toISOString()
});

// Track onboarding progress
track('onboarding_started', {
  step: 'profile_setup',
  completion_rate: 0.3
});

// Track feature usage
track('feature_used', {
  feature: 'dashboard_view',
  context: 'first_session',
  time_spent: 120 // seconds
});

// Track activation milestone
track('activation_complete', {
  actions_completed: 5,
  time_to_activation: 3600, // seconds
  engagement_score: 85
});`}
            </pre>
          </div>
        </div>

        {/* Engagement Metrics */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-muted-foreground">ENGAGEMENT METRICS</h4>
          <div className="grid grid-cols-2 gap-3">
            {engagementMetrics.map((metric) => (
              <div key={metric.label} className="p-3 bg-muted rounded-lg border">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium">{metric.label}</span>
                  <Badge
                    variant={metric.status === 'above' ? 'default' : 'secondary'}
                    className="text-xs"
                  >
                    {metric.status === 'above' ? '✓' : '↓'}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold">{metric.current}</span>
                  <span className="text-sm text-muted-foreground">/ {metric.target}</span>
                </div>
                <div className="w-full bg-muted-foreground/20 rounded-full h-1.5 mt-2">
                  <div
                    className={`h-1.5 rounded-full ${
                      metric.status === 'above' ? 'bg-green-500' : 'bg-orange-500'
                    }`}
                    style={{
                      width: `${Math.min(parseFloat(metric.current) / parseFloat(metric.target.replace('%', '')) * 100, 100)}%`
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Retention Cohorts */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-muted-foreground">RETENTION COHORTS</h4>
          <div className="bg-muted p-4 rounded-lg">
            <div className="grid grid-cols-7 gap-2 text-xs">
              <div className="font-medium">Cohort</div>
              <div className="text-center font-medium">Day 1</div>
              <div className="text-center font-medium">Day 3</div>
              <div className="text-center font-medium">Day 7</div>
              <div className="text-center font-medium">Day 14</div>
              <div className="text-center font-medium">Day 30</div>
              <div className="text-center font-medium">Day 90</div>

              <div className="font-medium">New Users</div>
              <div className="text-center bg-green-100 text-green-800 p-1 rounded">85%</div>
              <div className="text-center bg-green-100 text-green-800 p-1 rounded">72%</div>
              <div className="text-center bg-yellow-100 text-yellow-800 p-1 rounded">58%</div>
              <div className="text-center bg-orange-100 text-orange-800 p-1 rounded">45%</div>
              <div className="text-center bg-red-100 text-red-800 p-1 rounded">32%</div>
              <div className="text-center bg-red-100 text-red-800 p-1 rounded">18%</div>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-muted-foreground">KEY METRICS</h4>
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="text-2xl font-bold text-blue-700 flex items-center gap-1">
                <Clock className="h-5 w-5" />
                4.2h
              </div>
              <div className="text-sm text-blue-600">Avg. time to first action</div>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
              <div className="text-2xl font-bold text-purple-700 flex items-center gap-1">
                <Target className="h-5 w-5" />
                67%
              </div>
              <div className="text-sm text-purple-600">Activation rate (24h)</div>
            </div>
            <div className="p-3 bg-green-50 rounded-lg border border-green-200">
              <div className="text-2xl font-bold text-green-700 flex items-center gap-1">
                <TrendingUp className="h-5 w-5" />
                3.8
              </div>
              <div className="text-sm text-green-600">Avg. features used</div>
            </div>
            <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
              <div className="text-2xl font-bold text-orange-700">45%</div>
              <div className="text-sm text-orange-600">Engaged user retention</div>
            </div>
          </div>
        </div>

        {/* Apply Button */}
        {!isApplied && (
          <div className="pt-4 border-t">
            <Button onClick={onApply} className="w-full">
              Apply Activation Template
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
