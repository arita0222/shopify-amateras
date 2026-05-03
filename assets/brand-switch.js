(function () {
  'use strict';

  var STORAGE_KEY = 'selectedBrand';
  var DEFAULT_BRAND = 'wabi';

  function getCurrentBrand() {
    try {
      return localStorage.getItem(STORAGE_KEY) || DEFAULT_BRAND;
    } catch (e) {
      return DEFAULT_BRAND;
    }
  }

  function setBrand(brand) {
    try {
      localStorage.setItem(STORAGE_KEY, brand);
    } catch (e) {}
    document.documentElement.setAttribute('data-brand', brand);
    updateButtons(brand);
    filterProducts(brand);
  }

  function updateButtons(brand) {
    document.querySelectorAll('[data-brand-btn]').forEach(function (btn) {
      btn.setAttribute('aria-pressed', btn.dataset.brandBtn === brand ? 'true' : 'false');
    });
  }

  function filterProducts(brand) {
    document.querySelectorAll('[data-brand-tag]').forEach(function (item) {
      var tag = item.dataset.brandTag;
      var wrapper = item.closest('.resource-list__item');
      if (!wrapper) return;
      if (tag === '' || tag === brand) {
        wrapper.setAttribute('data-brand-hidden', 'false');
        wrapper.style.display = '';
      } else {
        wrapper.setAttribute('data-brand-hidden', 'true');
        wrapper.style.display = 'none';
      }
    });
  }

  function handleBrandSwitch(e) {
    var btn = e.target.closest('[data-brand-btn]');
    if (!btn) return;

    var targetBrand = btn.dataset.brandBtn;
    var redirectUrl = btn.dataset.brandRedirect;
    var isTop = document.documentElement.classList.contains('template-index') ||
                document.body.classList.contains('template-index');

    if (isTop) {
      setBrand(targetBrand);
    } else {
      try { localStorage.setItem(STORAGE_KEY, targetBrand); } catch (e) {}
      window.location.href = redirectUrl || '/';
    }
  }

  document.addEventListener('click', handleBrandSwitch);

  // 初期化
  document.addEventListener('DOMContentLoaded', function () {
    var brand = getCurrentBrand();
    document.documentElement.setAttribute('data-brand', brand);
    updateButtons(brand);
    filterProducts(brand);
  });
})();


// brand-switch-barをpageheader内の先頭に移動（Symmetryのsticky機構に乗せる）
function moveSwitchBarToHeader() {
  var bar = document.getElementById('brand-switch-bar');
  if (!bar) return;
  var pageheader = document.getElementById('pageheader');
  if (!pageheader) return;
  if (bar.parentElement === pageheader) return;
  pageheader.insertBefore(bar, pageheader.firstChild);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', moveSwitchBarToHeader);
} else {
  moveSwitchBarToHeader();
}
window.addEventListener('load', moveSwitchBarToHeader);
