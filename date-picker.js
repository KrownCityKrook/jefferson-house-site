/* LastRound — Shared date picker (MM/DD/YYYY display, YYYY-MM-DD storage)

   Native <input type="date"> renders its calendar in the browser/OS locale, so
   US users on a non-US system see DD/MM/YYYY. This module wraps every
   <input type="date"> with flatpickr so the visible value is always MM/DD/YYYY
   while the underlying value stays ISO (YYYY-MM-DD) for the backend.

   Opt out per-input with `data-no-fp` if you need the raw native picker. */

(function() {
  if (window.__lrDatePickerLoaded) return;
  window.__lrDatePickerLoaded = true;

  var CSS_URL = 'https://cdn.jsdelivr.net/npm/flatpickr/dist/flatpickr.min.css';
  var JS_URL  = 'https://cdn.jsdelivr.net/npm/flatpickr';

  function loadCSS(href) {
    if (document.querySelector('link[href="' + href + '"]')) return;
    var link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    document.head.appendChild(link);
  }

  function loadJS(src) {
    return new Promise(function(resolve, reject) {
      if (window.flatpickr) return resolve();
      var existing = document.querySelector('script[data-lr-flatpickr]');
      if (existing) {
        var poll = setInterval(function() {
          if (window.flatpickr) { clearInterval(poll); resolve(); }
        }, 50);
        setTimeout(function() { clearInterval(poll); reject(new Error('flatpickr load timeout')); }, 8000);
        return;
      }
      var s = document.createElement('script');
      s.src = src;
      s.async = true;
      s.setAttribute('data-lr-flatpickr', '1');
      s.onload = function() { resolve(); };
      s.onerror = function() { reject(new Error('flatpickr load failed')); };
      document.head.appendChild(s);
    });
  }

  function bindOne(input) {
    if (input.__lrFp) return;
    if (input.getAttribute('data-no-fp') != null) return;
    input.__lrFp = true;
    try {
      window.flatpickr(input, {
        dateFormat: 'Y-m-d',
        altInput: true,
        altFormat: 'm/d/Y',
        allowInput: true,
        // Re-fire 'input' on the original element so existing oninput="..." handlers run.
        // flatpickr only dispatches 'change' by default; pages wiring oninput on date inputs
        // (very common pattern in this codebase) would otherwise stop updating on date pick.
        onChange: function(selectedDates, dateStr, instance) {
          try { instance.input.dispatchEvent(new Event('input', { bubbles: true })); } catch (e) {}
        }
      });
    } catch (e) {
      input.__lrFp = false;
      console.warn('[date-picker] init failed for', input, e);
    }
  }

  function bindAll(root) {
    var scope = root && root.querySelectorAll ? root : document;
    var inputs = scope.querySelectorAll('input[type="date"]');
    for (var i = 0; i < inputs.length; i++) bindOne(inputs[i]);
  }

  function watch() {
    if (!window.MutationObserver) return;
    var obs = new MutationObserver(function(mutations) {
      for (var i = 0; i < mutations.length; i++) {
        var m = mutations[i];
        if (!m.addedNodes) continue;
        for (var j = 0; j < m.addedNodes.length; j++) {
          var n = m.addedNodes[j];
          if (n.nodeType !== 1) continue;
          if (n.matches && n.matches('input[type="date"]')) bindOne(n);
          if (n.querySelectorAll) bindAll(n);
        }
      }
    });
    obs.observe(document.body, { childList: true, subtree: true });
  }

  function start() {
    loadCSS(CSS_URL);
    loadJS(JS_URL).then(function() {
      bindAll(document);
      watch();
    }).catch(function(e) {
      console.warn('[date-picker]', e.message, '— native date inputs will fall back to browser locale.');
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();
