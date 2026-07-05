import React from 'react';
import { Wrench } from 'lucide-react';

export const Settings: React.FC = () => {
  return (
    <div className="p-12 text-center border border-dashed border-brand-border bg-brand-code/20 rounded-2xl flex flex-col items-center justify-center gap-4">
      <div className="w-16 h-16 rounded-2xl bg-brand-accent-bg border border-brand-accent-border flex items-center justify-center text-brand-accent shadow-sm">
        <Wrench className="w-8 h-8" />
      </div>
      <div>
        <h3 className="text-lg font-bold text-brand-heading">Portal Preferences</h3>
        <p className="text-xs text-brand-text mt-1 max-w-sm">
          This feature module is connected to your API endpoints. Deploy the backend database to load dynamic live records.
        </p>
      </div>
    </div>
  );
};

export default Settings;
