/**
 * Where "back" goes. One rule for the on-screen Back button, the Android back button/gesture and
 * (through the native stack) the iOS edge swipe, so they never disagree. Imports nothing from React
 * Native so tests/back-navigation.test.mjs can load it with Node; the hooks are in use-back.ts.
 */

/**
 * A pushed screen (topic, quiz) pops to the screen under it. Opened directly by a link, with nothing
 * under it, it returns to the home screen instead of closing the app.
 */
export function stackBackTarget(canGoBack: boolean): 'pop' | 'home' {
  return canGoBack ? 'pop' : 'home';
}

/**
 * Android back on the home screen's tabs: Practice Grammar and Settings return to Study (the first
 * tab, like a bottom navigation bar); on Study the system handles it. `null` = not handled.
 */
export function tabBackTarget<View extends string>(view: View, first: View): View | null {
  return view === first ? null : first;
}

/** The back arrow points against the reading direction: left in English, right in Urdu. */
export function backArrow(isUrdu: boolean): 'arrowLeft' | 'arrowRight' {
  return isUrdu ? 'arrowRight' : 'arrowLeft';
}
