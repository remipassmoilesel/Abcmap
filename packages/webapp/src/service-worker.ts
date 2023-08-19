/**
 * Copyright © 2023 Rémi Pace.
 * This file is part of Abc-Map.
 *
 * Abc-Map is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of
 * the License, or (at your option) any later version.
 *
 * Abc-Map is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General
 * Public License along with Abc-Map. If not, see <https://www.gnu.org/licenses/>.
 */

/// <reference lib="webworker" />
/* eslint-disable no-restricted-globals */

import { clientsClaim } from 'workbox-core';
import { ExpirationPlugin } from 'workbox-expiration';
import { precacheAndRoute, createHandlerBoundToURL } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { CacheableResponsePlugin } from 'workbox-cacheable-response';
import { CacheFirst } from 'workbox-strategies';
import { VERSION } from './version';

// See https://developers.google.com/web/tools/workbox/modules
const instantiatedAt = new Date().toISOString();
log('Worker version ' + VERSION.hash + ' (instantiated at ' + instantiatedAt + ', built at ' + VERSION.date + ')');

declare const self: ServiceWorkerGlobalScope;

clientsClaim();

// Precache all the assets generated by your build process.
// Their URLs are injected into the manifest variable below.
// This variable must be present somewhere in your service worker file,
// even if you decide not to use precaching. See https://cra.link/PWA
precacheAndRoute(self.__WB_MANIFEST);

// Set up App Shell-style routing, so that all navigation requests
// are fulfilled with your index.html shell. Learn more at
// https://developers.google.com/web/fundamentals/architecture/app-shell
const fileExtensionRegexp = new RegExp('/[^/?]+\\.[^/]+$');
registerRoute(
  // Return false to exempt requests from being fulfilled by index.html.
  ({ request, url }: { request: Request; url: URL }) => {
    // If this isn't a navigation, skip.
    if (request.mode !== 'navigate') {
      return false;
    }

    // Static documentation is not handled here
    if (url.pathname.startsWith('/documentation')) {
      return false;
    }

    // FIXME: is it necessary ?
    // If this is a URL that starts with /_, skip.
    if (url.pathname.startsWith('/_')) {
      return false;
    }

    // If this looks like a URL for a resource, because it contains
    // a file extension, skip.
    if (url.pathname.match(fileExtensionRegexp)) {
      return false;
    }

    // Return true to signal that we want to use the handler.
    return true;
  },
  createHandlerBoundToURL('/index.html')
);

// This allows the web app to trigger skipWaiting via
// registration.waiting.postMessage({type: 'SKIP_WAITING'})
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting().catch((err) => logError('skipWaiting error: ', err));
  }
});

const maxAgeSeconds = 30 * 24 * 60 * 60; // 30 Days

// Cache datastore searches
registerRoute(
  ({ request }) => request.url.includes('/api/datastore/search'),
  new CacheFirst({
    cacheName: 'datastore-searches',
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
      new ExpirationPlugin({
        maxEntries: 1000,
        maxAgeSeconds,
      }),
    ],
  })
);

// Cache datastore lists
registerRoute(
  ({ request }) => request.url.includes('/api/datastore/list'),
  new CacheFirst({
    cacheName: 'datastore-lists',
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
      new ExpirationPlugin({
        maxEntries: 1000,
        maxAgeSeconds,
      }),
    ],
  })
);

// Cache Nominatim searches
registerRoute(
  ({ request }) => request.url.indexOf('nominatim.openstreetmap.org') !== -1,
  new CacheFirst({
    cacheName: 'search-requests',
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
      new ExpirationPlugin({
        maxEntries: 500,
        maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
      }),
    ],
  })
);

function log(message: any, data?: any) {
  // eslint-disable-next-line no-console
  console.log(message, data);
}

function logError(message: any, data?: any) {
  // eslint-disable-next-line no-console
  console.error(message, data);
}
