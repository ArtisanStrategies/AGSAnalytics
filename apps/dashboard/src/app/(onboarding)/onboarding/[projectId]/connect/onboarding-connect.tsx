'use client';

import { ButtonContainer } from '@/components/button-container';
import CopyInput from '@/components/forms/copy-input';
import { LinkButton } from '@/components/ui/button';
import { useClientSecret } from '@/hooks/useClientSecret';
import { TemplatesManager } from '@/components/templates';
import { LockIcon, Sparkles } from 'lucide-react';

import type { IServiceProjectWithClients } from '@openpanel/db';

import OnboardingLayout, {
  OnboardingDescription,
} from '../../../onboarding-layout';
import ConnectApp from './connect-app';
import ConnectBackend from './connect-backend';
import ConnectWeb from './connect-web';

type Props = {
  project: IServiceProjectWithClients;
};

const Connect = ({ project }: Props) => {
  const client = project.clients[0];
  const [secret] = useClientSecret();

  if (!client) {
    return <div>Hmm, something fishy is going on. Please reload the page.</div>;
  }

  return (
    <OnboardingLayout
      title="Setup your data sources"
      description={
        <OnboardingDescription>
          Let&apos;s connect your data sources to OpenPanel
        </OnboardingDescription>
      }
    >
      <div className="flex flex-col gap-4 rounded-xl border p-4 md:p-6">
        <div className="flex items-center gap-2 text-2xl capitalize">
          <LockIcon />
          Credentials
        </div>
        <CopyInput label="Client ID" value={client.id} />
        <CopyInput label="Secret" value={secret} />
      </div>
      {project.types.map((type) => {
        const Component = {
          website: ConnectWeb,
          app: ConnectApp,
          backend: ConnectBackend,
        }[type];

        return <Component key={type} client={{ ...client, secret }} />;
      })}

      {/* AGS Analytics Templates */}
      <div className="flex flex-col gap-4 rounded-xl border p-4 md:p-6 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <div className="flex items-center gap-2 text-2xl capitalize">
          <Sparkles className="text-yellow-500" />
          AGS Analytics Templates
        </div>
        <p className="text-muted-foreground">
          Choose pre-configured templates to automatically set up tracking for common user flows.
          These templates include events, funnels, and metrics tailored for SaaS analytics.
        </p>
        <TemplatesManager
          onTemplateApplied={(templateType) => {
            console.log(`Template applied: ${templateType}`);
            // TODO: Implement template application logic
          }}
        />
      </div>

      <ButtonContainer>
        <div />
        <LinkButton
          href={`/onboarding/${project.id}/verify`}
          size="lg"
          className="min-w-28 self-start"
        >
          Next
        </LinkButton>
      </ButtonContainer>
    </OnboardingLayout>
  );
};

export default Connect;
