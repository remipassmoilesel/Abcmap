const sinon = require('sinon');
const ResizeObserver = require('resize-observer-polyfill');

global.URL.createObjectURL = sinon.stub();
window.URL.createObjectURL = sinon.stub();

// FIXME: Remove after NodeJS upgrade
global.fetch = sinon.stub();
window.fetch = sinon.stub();

global.ResizeObserver = ResizeObserver;
window.ResizeObserver = ResizeObserver;
