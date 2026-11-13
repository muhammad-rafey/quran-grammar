# Edition 3 — Al-Hajj and Al-Waqi‘ah

The owner requested complete Urdu study lessons for Al-Hajj (22) and Al-Waqi‘ah (56)
on 2026-11-13. The source inventory covers 174 ayahs and 1,653 words in 53 chunks. Scholarly review
is tracked in `review-status.json`.

The shared authoring guide defines the lesson fields. Quran.com provides the Uthmani
word strings, translations and tafsir references. Quranic Arabic Corpus 0.4 and its
i‘rab pages supply morphology and syntax. The source caches and raw runner logs stay
local. The library provenance report lists the Edition 2 entries reused for this
expansion. The new entries cover 65 verb lookup keys and 79 root families.
Occurrence overrides document where the vocalized text or syntax differs from the
raw Corpus tags.

Run from the repository root with the local QAC files in `content-pipeline/qac/`:

```sh
work="$PWD/content-pipeline/edition-3"
python3 -I content-pipeline/scripts/fetch_sources.py "$work"
python3 -I content-pipeline/scripts/prepare.py "$work" "$work"
python3 -I content-pipeline/scripts/build_packets.py "$work"
python3 -I content-pipeline/scripts/assemble.py "$work" "$PWD" --draft
```
