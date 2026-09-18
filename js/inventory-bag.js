/**
 * 3D Dimensional Bag & Spatial Inventory Controller
 * Shaik Mohammed Ashraf // 3D Cyber Portfolio
 */

(function () {
  const ITEMS = [
    { id: 'item-1', number: '01', code: 'ID_CORE', label: 'Neural Identity', icon: '👤' },
    { id: 'item-2', number: '02', code: 'RADAR_DATA', label: 'Live Telemetry', icon: '📊' },
    { id: 'item-3', number: '03', code: 'GALAXY_ORB', label: 'Skill Matrix', icon: '🌌' },
    { id: 'item-4', number: '04', code: 'FLAGSHIP_CHIP', label: 'SmartCare App', icon: '🏥' },
    { id: 'item-5', number: '05', code: 'NEURAL_DNA', label: 'Mindset & DNA', icon: '🧠' },
    { id: 'item-6', number: '06', code: 'CHRONO_LEDGER', label: 'Academic Ledger', icon: '🎓' },
    { id: 'item-7', number: '07', code: 'UPLINK_COMMS', label: 'Comms Uplink', icon: '📡' }
  ];

  class InventoryBagManager {
    constructor() {
      this.activeItem = 'item-1';
      this.isOverview = false;
      this.stage = document.getElementById('spatial-stage');
      this.dock = document.getElementById('bag-dock');
      this.overviewScreen = document.getElementById('bag-overview-screen');
      this.statusBadge = document.getElementById('active-relic-status');
      this.init();
    }

    init() {
      this.setupDockListeners();
      this.setupControls();
      this.setupKeyboardShortcuts();
      this.pickItem('item-1', false);
    }

    setupDockListeners() {
      const slots = document.querySelectorAll('.bag-slot-btn');
      slots.forEach((btn) => {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          const targetId = btn.getAttribute('data-item-id');
          if (targetId) {
            this.pickItem(targetId);
          }
        });
      });

      const navLinks = document.querySelectorAll('.nav-link[data-item-target]');
      navLinks.forEach((link) => {
        link.addEventListener('click', (e) => {
          e.preventDefault();
          const targetId = link.getAttribute('data-item-target');
          if (targetId) {
            this.pickItem(targetId);
          }
        });
      });
    }

    setupControls() {
      const packBtns = document.querySelectorAll('[data-action="pack-to-bag"]');
      packBtns.forEach((btn) => {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          this.packToBag();
        });
      });

      const bagOverviewBtn = document.getElementById('btn-bag-overview');
      if (bagOverviewBtn) {
        bagOverviewBtn.addEventListener('click', (e) => {
          e.preventDefault();
          this.toggleOverview();
        });
      }

      const nextBtn = document.getElementById('btn-next-relic');
      if (nextBtn) {
        nextBtn.addEventListener('click', () => this.nextItem());
      }
      const prevBtn = document.getElementById('btn-prev-relic');
      if (prevBtn) {
        prevBtn.addEventListener('click', () => this.prevItem());
      }
    }

    setupKeyboardShortcuts() {
      window.addEventListener('keydown', (e) => {
        if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) return;
        const modal = document.getElementById('terminal-modal');
        if (modal && modal.classList.contains('open')) return;

        const num = parseInt(e.key);
        if (!isNaN(num) && num >= 1 && num <= 7) {
          e.preventDefault();
          this.pickItem('item-' + num);
        } else if (e.key === 'Escape') {
          e.preventDefault();
          this.packToBag();
        } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
          e.preventDefault();
          this.nextItem();
        } else if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
          e.preventDefault();
          this.prevItem();
        } else if (e.key === 'b' || e.key === 'B') {
          e.preventDefault();
          this.toggleOverview();
        }
      });
    }

    pickItem(itemId, playSound = true) {
      const found = ITEMS.find((it) => it.id === itemId);
      if (!found) return;

      this.activeItem = itemId;
      this.isOverview = false;

      if (playSound && window.cyberAudio && typeof window.cyberAudio.playItemPick === 'function') {
        window.cyberAudio.playItemPick();
      }

      if (this.overviewScreen) {
        this.overviewScreen.classList.remove('active');
      }

      if (this.stage) {
        this.stage.classList.remove('stage-packed');
      }

      const cards = document.querySelectorAll('.relic-item-container');
      cards.forEach((card) => {
        if (card.id === itemId) {
          card.classList.add('relic-active');
          card.classList.remove('relic-stashed');
          const scrollInner = card.querySelector('.relic-scroll-body');
          if (scrollInner) scrollInner.scrollTop = 0;
        } else {
          card.classList.remove('relic-active');
          card.classList.add('relic-stashed');
        }
      });

      const slots = document.querySelectorAll('.bag-slot-btn');
      slots.forEach((slot) => {
        if (slot.getAttribute('data-item-id') === itemId) {
          slot.classList.add('active');
        } else {
          slot.classList.remove('active');
        }
      });

      const navLinks = document.querySelectorAll('.nav-link[data-item-target]');
      navLinks.forEach((link) => {
        if (link.getAttribute('data-item-target') === itemId) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      });

      if (this.statusBadge) {
        this.statusBadge.innerHTML = '<span class="status-dot" style="background:#00f5ff;box-shadow:0 0 8px #00f5ff;"></span><span>RELIC [' + found.number + ']: <strong>' + found.label.toUpperCase() + '</strong> [EXTRACTED]</span>';
      }

      if (typeof window.setThreeBagState === 'function') {
        window.setThreeBagState('picked', itemId);
      }
    }

    packToBag() {
      this.isOverview = true;

      if (window.cyberAudio && typeof window.cyberAudio.playItemPack === 'function') {
        window.cyberAudio.playItemPack();
      }

      const cards = document.querySelectorAll('.relic-item-container');
      cards.forEach((card) => {
        card.classList.remove('relic-active');
        card.classList.add('relic-stashed');
      });

      if (this.overviewScreen) {
        this.overviewScreen.classList.add('active');
      }

      if (this.stage) {
        this.stage.classList.add('stage-packed');
      }

      if (this.statusBadge) {
        this.statusBadge.innerHTML = '<span class="status-dot" style="background:#a855f7;box-shadow:0 0 8px #a855f7;"></span><span>CYBER-VAULT // <strong>7 DIMENSIONAL RELICS STORED</strong></span>';
      }

      const slots = document.querySelectorAll('.bag-slot-btn');
      slots.forEach((slot) => slot.classList.remove('active'));

      if (typeof window.setThreeBagState === 'function') {
        window.setThreeBagState('overview', null);
      }
    }

    toggleOverview() {
      if (this.isOverview) {
        this.pickItem(this.activeItem || 'item-1');
      } else {
        this.packToBag();
      }
    }

    nextItem() {
      const currentIndex = ITEMS.findIndex((it) => it.id === this.activeItem);
      const nextIndex = (currentIndex + 1) % ITEMS.length;
      this.pickItem(ITEMS[nextIndex].id);
    }

    prevItem() {
      const currentIndex = ITEMS.findIndex((it) => it.id === this.activeItem);
      const prevIndex = (currentIndex - 1 + ITEMS.length) % ITEMS.length;
      this.pickItem(ITEMS[prevIndex].id);
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    window.inventoryBag = new InventoryBagManager();
  });
})();
