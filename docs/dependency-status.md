# Dependency checks — 2026-10-23

The Node API's production dependency audit reported zero advisories during initial setup. The web runtime dependencies are React and the icon library; no Expo or Metro code is shipped in the web/API Docker image.

The Expo SDK 57 dependency tree still reports upstream advisories in `braces` (Metro/tooling), `node-forge` (Expo tooling), and the `query-string` / `decode-uri-component` chain used by Expo Router navigation. The decoder issue cannot be safely solved by overriding it to its patched ESM-only major version under a CommonJS caller. The other two had no patched versions available at verification time. These remain follow-up work before a production mobile release; a successful bundle does not resolve dependency advisories.

Do not run `npm audit fix --force`: the suggested resolutions include incompatible Expo/React Native downgrades. Use SDK-compatible updates and rerun native checks.

- [braces advisory](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm)
- [node-forge advisory](https://github.com/advisories/GHSA-86w9-cpqp-85rv)
- [decoder advisory](https://github.com/advisories/GHSA-vcc3-ghjq-m6fr)

Recheck with `npm audit` and `npm audit --workspace=@quran-grammar/api --omit=dev` when dependencies change.
