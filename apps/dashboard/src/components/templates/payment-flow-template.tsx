import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CreditCard, ShoppingCart, Shield, CheckCircle, AlertCircle, DollarSign } from 'lucide-react';

interface PaymentFlowTemplateProps {
  onApply?: () => void;
  isApplied?: boolean;
}

const paymentSteps = [
  {
    id: 'cart_view',
    name: 'Cart/View Pricing',
    description: 'User views products/pricing',
    events: ['page_view', 'cart_view', 'pricing_view'],
    icon: ShoppingCart,
    color: 'bg-blue-500'
  },
  {
    id: 'checkout_start',
    name: 'Checkout Start',
    description: 'User initiates checkout',
    events: ['checkout_start', 'checkout.session.created'],
    icon: CreditCard,
    color: 'bg-green-500'
  },
  {
    id: 'payment_method',
    name: 'Payment Method',
    description: 'User selects payment method',
    events: ['payment_method_selected', 'payment_intent.created'],
    icon: Shield,
    color: 'bg-yellow-500'
  },
  {
    id: 'payment_processing',
    name: 'Processing Payment',
    description: 'Payment being processed',
    events: ['payment_intent.processing', 'payment_processing'],
    icon: DollarSign,
    color: 'bg-orange-500'
  },
  {
    id: 'payment_success',
    name: 'Payment Success',
    description: 'Payment completed successfully',
    events: ['checkout.session.completed', 'payment_intent.succeeded', 'payment_success'],
    icon: CheckCircle,
    color: 'bg-green-600'
  },
  {
    id: 'payment_failed',
    name: 'Payment Failed',
    description: 'Payment failed or declined',
    events: ['checkout.session.expired', 'payment_intent.payment_failed', 'payment_failed'],
    icon: AlertCircle,
    color: 'bg-red-500'
  }
];

const failureReasons = [
  'card_declined',
  'insufficient_funds',
  'expired_card',
  'incorrect_cvc',
  'processing_error',
  'fraud_detected'
];

export const PaymentFlowTemplate: React.FC<PaymentFlowTemplateProps> = ({
  onApply,
  isApplied = false
}) => {
  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-green-600" />
              Payment Flow Template
            </CardTitle>
            <CardDescription>
              Pre-configured funnel for tracking payment conversions and failures
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
            {paymentSteps.map((step, index) => {
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

        {/* Stripe Integration */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-muted-foreground">STRIPE WEBHOOK INTEGRATION</h4>
          <div className="bg-muted p-4 rounded-lg">
            <p className="text-sm font-medium mb-2">Configure Stripe webhooks to automatically track:</p>
            <div className="space-y-2">
              <div className="text-xs bg-background p-2 rounded border">
                <code>checkout.session.completed</code> → Payment success
              </div>
              <div className="text-xs bg-background p-2 rounded border">
                <code>payment_intent.payment_failed</code> → Payment failure with reason
              </div>
              <div className="text-xs bg-background p-2 rounded border">
                <code>checkout.session.expired</code> → Abandoned checkout
              </div>
            </div>
          </div>
        </div>

        {/* Failure Analysis */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-muted-foreground">FAILURE ANALYSIS</h4>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <h5 className="text-sm font-medium">Common Failure Reasons:</h5>
              <div className="space-y-1">
                {failureReasons.map((reason) => (
                  <Badge key={reason} variant="destructive" className="text-xs mr-1 mb-1">
                    {reason.replace('_', ' ')}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <h5 className="text-sm font-medium">Recovery Actions:</h5>
              <ul className="text-xs space-y-1 text-muted-foreground">
                <li>• Retry payment flow</li>
                <li>• Alternative payment methods</li>
                <li>• Customer support contact</li>
                <li>• Discount offers</li>
              </ul>
            </div>
          </div>
        </div>

        {/* SDK Integration */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-muted-foreground">CUSTOM SDK INTEGRATION</h4>
          <div className="bg-muted p-4 rounded-lg">
            <p className="text-sm font-medium mb-2">Add to your payment flow:</p>
            <pre className="text-xs bg-background p-3 rounded border overflow-x-auto">
{`// Track checkout start
track('checkout_start', {
  amount: 99.99,
  currency: 'USD',
  items: ['premium_plan'],
  source: 'pricing_page'
});

// Track payment method selection
track('payment_method_selected', {
  method: 'card',
  provider: 'stripe'
});

// Track custom payment events
track('payment_processing', {
  amount: 99.99,
  currency: 'USD',
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
              <div className="text-2xl font-bold text-green-700">Success Rate</div>
              <div className="text-sm text-green-600">Payment completion rate</div>
            </div>
            <div className="p-3 bg-red-50 rounded-lg border border-red-200">
              <div className="text-2xl font-bold text-red-700">Failure Rate</div>
              <div className="text-sm text-red-600">By failure reason</div>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="text-2xl font-bold text-blue-700">Avg. Order Value</div>
              <div className="text-sm text-blue-600">Revenue per transaction</div>
            </div>
            <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
              <div className="text-2xl font-bold text-orange-700">Checkout Abandonment</div>
              <div className="text-sm text-orange-600">Cart → Checkout drop-off</div>
            </div>
          </div>
        </div>

        {/* Apply Button */}
        {!isApplied && (
          <div className="pt-4 border-t">
            <Button onClick={onApply} className="w-full">
              Apply Payment Template
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
