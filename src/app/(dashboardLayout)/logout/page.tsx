'use client';

import { LogoutPopup } from '@/components/dashboard/LogoutPopup';

export default function Page() {
  return <LogoutPopup isOpen={true} onClose={() => {}} onConfirm={() => {}} />;
}
