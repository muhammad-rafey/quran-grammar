import { PracticeScreen } from '@/screens/practice-grammar';

const fatihah = { kind: 'fatihah' } as const;

/** Practice Grammar → Quick practice (the Al-Fatihah question set). */
export default function QuickPracticeRoute() {
  return <PracticeScreen active={fatihah} />;
}
