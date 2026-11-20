'use strict';

// Preserve links from the former homepage and sign-in flow.
if (location.hash === '#builder') {
  location.replace('/builder' + location.search);
}
