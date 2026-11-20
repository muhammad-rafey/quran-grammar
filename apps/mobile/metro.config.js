// Expo's defaults already configure this npm-workspaces monorepo (watch folders,
// node_modules lookup). The only addition: bundle the SQLite content database
// (assets/db/quran-grammar.db) as an asset so expo-sqlite can import it.
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);
if (!config.resolver.assetExts.includes('db')) config.resolver.assetExts.push('db');

module.exports = config;
