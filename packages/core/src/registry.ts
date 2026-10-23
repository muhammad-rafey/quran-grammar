import { fatihahStudy } from './data';
import type { StudyData } from './types';
import { study105 } from './lessons/surah-105';
import { study106 } from './lessons/surah-106';
import { study107 } from './lessons/surah-107';
import { study108 } from './lessons/surah-108';
import { study109 } from './lessons/surah-109';
import { study110 } from './lessons/surah-110';
import { study111 } from './lessons/surah-111';
import { study112 } from './lessons/surah-112';
import { study113 } from './lessons/surah-113';
import { study114 } from './lessons/surah-114';

/** Complete locally bundled study editions. */
export const studies: readonly StudyData[] = [
  fatihahStudy,
  study105,
  study106,
  study107,
  study108,
  study109,
  study110,
  study111,
  study112,
  study113,
  study114,
];
export function getStudy(surahNumber: number): StudyData | undefined {
  return studies.find((study) => study.surah.number === surahNumber);
}
