import { fatihahStudy } from './data';
import type { StudyData } from './types';
import { study4 } from './lessons/surah-4';
import { study7 } from './lessons/surah-7';
import { study18 } from './lessons/surah-18';
import { study22 } from './lessons/surah-22';
import { study23 } from './lessons/surah-23';
import { study25 } from './lessons/surah-25';
import { study29 } from './lessons/surah-29';
import { study32 } from './lessons/surah-32';
import { study36 } from './lessons/surah-36';
import { study55 } from './lessons/surah-55';
import { study56 } from './lessons/surah-56';
import { study85 } from './lessons/surah-85';
import { study86 } from './lessons/surah-86';
import { study87 } from './lessons/surah-87';
import { study88 } from './lessons/surah-88';
import { study89 } from './lessons/surah-89';
import { study90 } from './lessons/surah-90';
import { study91 } from './lessons/surah-91';
import { study92 } from './lessons/surah-92';
import { study93 } from './lessons/surah-93';
import { study94 } from './lessons/surah-94';
import { study95 } from './lessons/surah-95';
import { study96 } from './lessons/surah-96';
import { study97 } from './lessons/surah-97';
import { study98 } from './lessons/surah-98';
import { study99 } from './lessons/surah-99';
import { study100 } from './lessons/surah-100';
import { study101 } from './lessons/surah-101';
import { study102 } from './lessons/surah-102';
import { study103 } from './lessons/surah-103';
import { study104 } from './lessons/surah-104';
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
  study4,
  study7,
  study18,
  study22,
  study23,
  study25,
  study29,
  study32,
  study36,
  study55,
  study56,
  study85,
  study86,
  study87,
  study88,
  study89,
  study90,
  study91,
  study92,
  study93,
  study94,
  study95,
  study96,
  study97,
  study98,
  study99,
  study100,
  study101,
  study102,
  study103,
  study104,
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
