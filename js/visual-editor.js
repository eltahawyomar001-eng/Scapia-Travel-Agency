/**
 * SCAPIA Visual Editor
 * A Webflow-like inline visual editor for the travel website
 * Allows direct on-page editing with live preview
 */

class VisualEditor {
  constructor() {
    this.isEditMode = false;
    this.selectedElement = null;
    this.pendingChanges = {};
    this.originalContent = {};
    this.sanityProjectId = 'klhue3lk';
    this.sanityDataset = 'production';
    this.sanityToken = null; // Will be set on login
    
    this.init();
  }

  init() {
    // Check if user wants to enter edit mode via URL param or localStorage
    const urlParams = new URLSearchParams(window.location.search);
    const hasEditParam = urlParams.get('edit') === 'true';
    const isLoggedIn = localStorage.getItem('scapia_editor_token');
    
    if (hasEditParam || isLoggedIn) {
      this.showLoginOrEditor();
    }
    
    // Add keyboard shortcut: Ctrl/Cmd + E to toggle edit mode
    document.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'e') {
        e.preventDefault();
        this.showLoginOrEditor();
      }
    });
  }

  showLoginOrEditor() {
    const token = localStorage.getItem('scapia_editor_token');
    if (token) {
      this.sanityToken = token;
      this.enableEditMode();
    } else {
      this.showLoginModal();
    }
  }

  // ==================== LOGIN MODAL ====================
  showLoginModal() {
    const modal = document.createElement('div');
    modal.id = 'visual-editor-login';
    modal.innerHTML = `
      <div class="ve-modal-overlay">
        <div class="ve-modal">
          <div class="ve-modal-header">
            <h2>🔐 Editor Login</h2>
            <p>Enter your Sanity API token to edit this page</p>
          </div>
          <div class="ve-modal-body">
            <div class="ve-form-group">
              <label>Sanity API Token</label>
              <input type="password" id="ve-token-input" placeholder="Enter your write token..." />
              <small>Get this from <a href="https://www.sanity.io/manage/project/${this.sanityProjectId}/api#tokens" target="_blank">Sanity Dashboard → API → Tokens</a></small>
            </div>
            <div class="ve-checkbox">
              <input type="checkbox" id="ve-remember" checked />
              <label for="ve-remember">Remember me on this device</label>
            </div>
          </div>
          <div class="ve-modal-footer">
            <button class="ve-btn ve-btn-secondary" id="ve-cancel-login">Cancel</button>
            <button class="ve-btn ve-btn-primary" id="ve-submit-login">Start Editing</button>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
    this.injectStyles();

    // Event listeners
    document.getElementById('ve-cancel-login').onclick = () => modal.remove();
    document.getElementById('ve-submit-login').onclick = () => this.handleLogin();
    document.getElementById('ve-token-input').onkeypress = (e) => {
      if (e.key === 'Enter') this.handleLogin();
    };
    document.getElementById('ve-token-input').focus();
  }

  async handleLogin() {
    const tokenInput = document.getElementById('ve-token-input');
    const remember = document.getElementById('ve-remember').checked;
    const token = tokenInput.value.trim();

    if (!token) {
      this.showToast('Please enter a token', 'error');
      return;
    }

    // Validate token by making a test request
    try {
      const response = await fetch(
        `https://${this.sanityProjectId}.api.sanity.io/v2024-01-01/data/query/${this.sanityDataset}?query=*[_id=="globalSettings"][0]{_id}`,
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      
      if (!response.ok) throw new Error('Invalid token');
      
      this.sanityToken = token;
      if (remember) {
        localStorage.setItem('scapia_editor_token', token);
      }
      
      document.getElementById('visual-editor-login').remove();
      this.enableEditMode();
    } catch (error) {
      this.showToast('Invalid token. Please check and try again.', 'error');
    }
  }

  // ==================== EDIT MODE ====================
  enableEditMode() {
    this.isEditMode = true;
    document.body.classList.add('ve-edit-mode');
    
    this.createEditorUI();
    this.makeElementsEditable();
    this.storeOriginalContent();
    
    this.showToast('✏️ Edit mode enabled! Click any text to edit.', 'success');
  }

  disableEditMode() {
    this.isEditMode = false;
    document.body.classList.remove('ve-edit-mode');
    
    // Remove all editable attributes
    document.querySelectorAll('[data-ve-editable]').forEach(el => {
      el.contentEditable = 'false';
      el.removeAttribute('data-ve-editable');
      el.classList.remove('ve-editable', 've-hover', 've-selected');
    });
    
    // Remove editor UI
    const toolbar = document.getElementById('ve-toolbar');
    const panel = document.getElementById('ve-side-panel');
    if (toolbar) toolbar.remove();
    if (panel) panel.remove();
  }

  createEditorUI() {
    // Create floating toolbar
    this.createToolbar();
    // Create side panel
    this.createSidePanel();
  }

  createToolbar() {
    const toolbar = document.createElement('div');
    toolbar.id = 've-toolbar';
    toolbar.innerHTML = `
      <div class="ve-toolbar-inner">
        <div class="ve-toolbar-group">
          <button class="ve-tool" data-action="bold" title="Bold (Ctrl+B)"><strong>B</strong></button>
          <button class="ve-tool" data-action="italic" title="Italic (Ctrl+I)"><em>I</em></button>
          <button class="ve-tool" data-action="underline" title="Underline (Ctrl+U)"><u>U</u></button>
        </div>
        <div class="ve-toolbar-divider"></div>
        <div class="ve-toolbar-group">
          <button class="ve-tool" data-action="link" title="Add Link">🔗</button>
          <button class="ve-tool" data-action="image" title="Change Image">🖼️</button>
        </div>
        <div class="ve-toolbar-divider"></div>
        <div class="ve-toolbar-group">
          <button class="ve-tool" data-action="undo" title="Undo (Ctrl+Z)">↩️</button>
          <button class="ve-tool" data-action="redo" title="Redo (Ctrl+Y)">↪️</button>
        </div>
      </div>
    `;
    toolbar.style.display = 'none';
    document.body.appendChild(toolbar);

    // Toolbar actions
    toolbar.querySelectorAll('.ve-tool').forEach(btn => {
      btn.onclick = (e) => {
        e.preventDefault();
        this.executeAction(btn.dataset.action);
      };
    });
  }

  createSidePanel() {
    const panel = document.createElement('div');
    panel.id = 've-side-panel';
    panel.innerHTML = `
      <div class="ve-panel-header">
        <span class="ve-logo">✏️ SCAPIA Editor</span>
        <button class="ve-panel-close" id="ve-close-panel">×</button>
      </div>
      <div class="ve-panel-content">
        <div class="ve-panel-section">
          <h3>📝 Changes</h3>
          <div id="ve-changes-list" class="ve-changes-list">
            <p class="ve-empty">No changes yet. Click on any text to edit.</p>
          </div>
        </div>
        <div class="ve-panel-section">
          <h3>⚡ Quick Actions</h3>
          <button class="ve-btn ve-btn-full" id="ve-preview-btn">👁️ Preview Changes</button>
          <button class="ve-btn ve-btn-full ve-btn-secondary" id="ve-discard-btn">🗑️ Discard All</button>
        </div>
      </div>
      <div class="ve-panel-footer">
        <button class="ve-btn ve-btn-secondary" id="ve-exit-btn">Exit Editor</button>
        <button class="ve-btn ve-btn-primary" id="ve-save-btn">💾 Publish Changes</button>
      </div>
    `;
    document.body.appendChild(panel);

    // Panel events
    document.getElementById('ve-close-panel').onclick = () => panel.classList.toggle('ve-collapsed');
    document.getElementById('ve-exit-btn').onclick = () => this.exitEditor();
    document.getElementById('ve-save-btn').onclick = () => this.saveAllChanges();
    document.getElementById('ve-discard-btn').onclick = () => this.discardAllChanges();
    document.getElementById('ve-preview-btn').onclick = () => this.previewChanges();
  }

  // ==================== EDITABLE ELEMENTS ====================
  makeElementsEditable() {
    // Find all text elements that should be editable
    const editableSelectors = [
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'p', 'span', 'a', 'li',
      '.hero__title', '.hero__desc', '.hero__subtitle',
      '.section__title', '.section__subtitle', '.section__desc',
      '.card__title', '.card__desc', '.card__text',
      '.service-card__title', '.trip-card__title', '.trip-card__price',
      '.stat__number', '.stat__label',
      '.btn', '.nav__link',
      '[data-content]'
    ];

    document.querySelectorAll(editableSelectors.join(', ')).forEach(el => {
      // Skip if inside editor UI
      if (el.closest('#ve-toolbar') || el.closest('#ve-side-panel') || el.closest('#visual-editor-login')) {
        return;
      }
      
      // Skip script/style tags
      if (['SCRIPT', 'STYLE', 'NOSCRIPT'].includes(el.tagName)) {
        return;
      }

      el.setAttribute('data-ve-editable', 'true');
      el.classList.add('ve-editable');
      
      // Hover effect
      el.addEventListener('mouseenter', () => {
        if (this.isEditMode && !el.classList.contains('ve-selected')) {
          el.classList.add('ve-hover');
        }
      });
      
      el.addEventListener('mouseleave', () => {
        el.classList.remove('ve-hover');
      });

      // Click to select and edit
      el.addEventListener('click', (e) => {
        if (!this.isEditMode) return;
        
        // Don't intercept links in non-edit mode
        if (el.tagName === 'A') {
          e.preventDefault();
        }
        
        e.stopPropagation();
        this.selectElement(el);
      });

      // Track changes on input
      el.addEventListener('input', () => {
        this.trackChange(el);
      });

      // Handle blur
      el.addEventListener('blur', () => {
        this.onElementBlur(el);
      });
    });

    // Make images clickable for replacement
    document.querySelectorAll('img, [style*="background-image"]').forEach(el => {
      if (el.closest('#ve-toolbar') || el.closest('#ve-side-panel')) return;
      
      el.classList.add('ve-image-editable');
      el.addEventListener('click', (e) => {
        if (!this.isEditMode) return;
        e.preventDefault();
        e.stopPropagation();
        this.showImageUploader(el);
      });
    });

    // Click outside to deselect
    document.addEventListener('click', (e) => {
      if (!this.isEditMode) return;
      if (!e.target.closest('[data-ve-editable]') && 
          !e.target.closest('#ve-toolbar') && 
          !e.target.closest('#ve-side-panel')) {
        this.deselectElement();
      }
    });
  }

  selectElement(el) {
    // Deselect previous
    if (this.selectedElement) {
      this.selectedElement.classList.remove('ve-selected');
      this.selectedElement.contentEditable = 'false';
    }

    // Select new
    this.selectedElement = el;
    el.classList.remove('ve-hover');
    el.classList.add('ve-selected');
    el.contentEditable = 'true';
    el.focus();

    // Position toolbar above element
    this.positionToolbar(el);
  }

  deselectElement() {
    if (this.selectedElement) {
      this.selectedElement.classList.remove('ve-selected');
      this.selectedElement.contentEditable = 'false';
      this.selectedElement = null;
    }
    document.getElementById('ve-toolbar').style.display = 'none';
  }

  positionToolbar(el) {
    const toolbar = document.getElementById('ve-toolbar');
    const rect = el.getBoundingClientRect();
    
    toolbar.style.display = 'flex';
    toolbar.style.top = `${window.scrollY + rect.top - 50}px`;
    toolbar.style.left = `${rect.left + (rect.width / 2) - (toolbar.offsetWidth / 2)}px`;
    
    // Keep toolbar in viewport
    const toolbarRect = toolbar.getBoundingClientRect();
    if (toolbarRect.left < 10) {
      toolbar.style.left = '10px';
    }
    if (toolbarRect.right > window.innerWidth - 10) {
      toolbar.style.left = `${window.innerWidth - toolbarRect.width - 10}px`;
    }
    if (toolbarRect.top < 10) {
      toolbar.style.top = `${window.scrollY + rect.bottom + 10}px`;
    }
  }

  // ==================== CHANGE TRACKING ====================
  storeOriginalContent() {
    document.querySelectorAll('[data-ve-editable]').forEach((el, index) => {
      const key = this.getElementKey(el);
      this.originalContent[key] = el.innerHTML;
    });
  }

  getElementKey(el) {
    // Create unique key based on element's position and attributes
    const selector = el.dataset.content || 
                     el.className.split(' ').filter(c => !c.startsWith('ve-')).join('.') ||
                     el.tagName.toLowerCase();
    const index = Array.from(document.querySelectorAll(selector)).indexOf(el);
    return `${selector}[${index}]`;
  }

  trackChange(el) {
    const key = this.getElementKey(el);
    const original = this.originalContent[key];
    const current = el.innerHTML;

    if (current !== original) {
      this.pendingChanges[key] = {
        element: el,
        original: original,
        current: current,
        selector: this.getElementSelector(el),
        label: this.getElementLabel(el)
      };
    } else {
      delete this.pendingChanges[key];
    }

    this.updateChangesList();
  }

  getElementSelector(el) {
    if (el.dataset.content) return `[data-content="${el.dataset.content}"]`;
    if (el.id) return `#${el.id}`;
    if (el.className) {
      const classes = el.className.split(' ').filter(c => !c.startsWith('ve-'));
      if (classes.length) return `.${classes[0]}`;
    }
    return el.tagName.toLowerCase();
  }

  getElementLabel(el) {
    const text = el.textContent.substring(0, 30);
    return text + (el.textContent.length > 30 ? '...' : '');
  }

  onElementBlur(el) {
    this.trackChange(el);
  }

  updateChangesList() {
    const list = document.getElementById('ve-changes-list');
    const changes = Object.values(this.pendingChanges);

    if (changes.length === 0) {
      list.innerHTML = '<p class="ve-empty">No changes yet. Click on any text to edit.</p>';
    } else {
      list.innerHTML = changes.map((change, i) => `
        <div class="ve-change-item">
          <span class="ve-change-label">${change.label}</span>
          <button class="ve-change-revert" data-key="${Object.keys(this.pendingChanges)[i]}" title="Revert">↩️</button>
        </div>
      `).join('');

      // Add revert handlers
      list.querySelectorAll('.ve-change-revert').forEach(btn => {
        btn.onclick = () => this.revertChange(btn.dataset.key);
      });
    }
  }

  revertChange(key) {
    const change = this.pendingChanges[key];
    if (change) {
      change.element.innerHTML = change.original;
      delete this.pendingChanges[key];
      this.updateChangesList();
      this.showToast('Change reverted', 'info');
    }
  }

  discardAllChanges() {
    if (Object.keys(this.pendingChanges).length === 0) {
      this.showToast('No changes to discard', 'info');
      return;
    }

    if (confirm('Discard all changes? This cannot be undone.')) {
      Object.values(this.pendingChanges).forEach(change => {
        change.element.innerHTML = change.original;
      });
      this.pendingChanges = {};
      this.updateChangesList();
      this.showToast('All changes discarded', 'info');
    }
  }

  // ==================== TOOLBAR ACTIONS ====================
  executeAction(action) {
    switch (action) {
      case 'bold':
        document.execCommand('bold', false);
        break;
      case 'italic':
        document.execCommand('italic', false);
        break;
      case 'underline':
        document.execCommand('underline', false);
        break;
      case 'link':
        const url = prompt('Enter URL:');
        if (url) document.execCommand('createLink', false, url);
        break;
      case 'image':
        if (this.selectedElement) {
          this.showImageUploader(this.selectedElement);
        }
        break;
      case 'undo':
        document.execCommand('undo', false);
        break;
      case 'redo':
        document.execCommand('redo', false);
        break;
    }
    
    if (this.selectedElement) {
      this.trackChange(this.selectedElement);
    }
  }

  // ==================== IMAGE HANDLING ====================
  showImageUploader(el) {
    const isImg = el.tagName === 'IMG';
    const currentSrc = isImg ? el.src : el.style.backgroundImage.replace(/url\(['"]?(.+?)['"]?\)/, '$1');

    const modal = document.createElement('div');
    modal.id = 've-image-modal';
    modal.innerHTML = `
      <div class="ve-modal-overlay">
        <div class="ve-modal">
          <div class="ve-modal-header">
            <h2>🖼️ Change Image</h2>
          </div>
          <div class="ve-modal-body">
            <div class="ve-image-preview">
              <img src="${currentSrc}" alt="Current image" />
            </div>
            <div class="ve-form-group">
              <label>Image URL</label>
              <input type="text" id="ve-image-url" value="${currentSrc}" placeholder="Enter image URL..." />
            </div>
            <div class="ve-form-group">
              <label>Or upload a file</label>
              <input type="file" id="ve-image-file" accept="image/*" />
            </div>
          </div>
          <div class="ve-modal-footer">
            <button class="ve-btn ve-btn-secondary" id="ve-image-cancel">Cancel</button>
            <button class="ve-btn ve-btn-primary" id="ve-image-save">Apply</button>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(modal);

    // Preview on URL change
    document.getElementById('ve-image-url').oninput = (e) => {
      modal.querySelector('.ve-image-preview img').src = e.target.value;
    };

    // File upload preview
    document.getElementById('ve-image-file').onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          document.getElementById('ve-image-url').value = e.target.result;
          modal.querySelector('.ve-image-preview img').src = e.target.result;
        };
        reader.readAsDataURL(file);
      }
    };

    document.getElementById('ve-image-cancel').onclick = () => modal.remove();
    document.getElementById('ve-image-save').onclick = () => {
      const newSrc = document.getElementById('ve-image-url').value;
      if (isImg) {
        el.src = newSrc;
      } else {
        el.style.backgroundImage = `url('${newSrc}')`;
      }
      this.trackChange(el);
      modal.remove();
      this.showToast('Image updated', 'success');
    };
  }

  // ==================== SAVE TO SANITY ====================
  async saveAllChanges() {
    const changes = Object.values(this.pendingChanges);
    
    if (changes.length === 0) {
      this.showToast('No changes to save', 'info');
      return;
    }

    const saveBtn = document.getElementById('ve-save-btn');
    saveBtn.disabled = true;
    saveBtn.innerHTML = '⏳ Saving...';

    try {
      // Group changes by page/document type
      const pageType = this.detectPageType();
      const documentId = this.getDocumentId(pageType);
      
      // Build mutations
      const mutations = this.buildMutations(changes, pageType);
      
      // Send to Sanity
      const response = await fetch(
        `https://${this.sanityProjectId}.api.sanity.io/v2024-01-01/data/mutate/${this.sanityDataset}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.sanityToken}`
          },
          body: JSON.stringify({ mutations })
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to save');
      }

      // Clear pending changes
      this.pendingChanges = {};
      this.storeOriginalContent(); // Update original content
      this.updateChangesList();
      
      this.showToast('✅ Changes published successfully!', 'success');
    } catch (error) {
      console.error('Save error:', error);
      this.showToast(`❌ Error: ${error.message}`, 'error');
    } finally {
      saveBtn.disabled = false;
      saveBtn.innerHTML = '💾 Publish Changes';
    }
  }

  detectPageType() {
    const path = window.location.pathname;
    if (path === '/' || path === '/index.html') return 'homepage';
    if (path.includes('about')) return 'aboutPage';
    if (path.includes('contact')) return 'contactPage';
    if (path.includes('trip-details')) return 'trip';
    if (path.includes('trips')) return 'tripsPage';
    return 'homepage';
  }

  getDocumentId(pageType) {
    if (pageType === 'trip') {
      // Get trip slug from URL
      const urlParams = new URLSearchParams(window.location.search);
      return urlParams.get('slug') || 'bali-paradise-escape';
    }
    return pageType;
  }

  buildMutations(changes, pageType) {
    // Map CSS selectors to Sanity field paths
    const fieldMappings = {
      homepage: {
        '.hero__title': 'hero.title',
        '.hero__desc': 'hero.description',
        '.services .section__title': 'services.title',
        '.services .section__desc': 'services.description',
        '.featured-trips .section__title': 'featuredTrips.title',
        '.gallery .section__title': 'gallery.title',
      },
      aboutPage: {
        '.hero__title': 'hero.title',
        '.hero__desc': 'hero.description',
        '.collective .section__title': 'collective.title',
        '.story .section__title': 'storyTimeline.title',
        '.team .section__title': 'team.title',
      },
      contactPage: {
        '.hero__title': 'hero.title',
        '.hero__desc': 'hero.description',
        '.faq .section__title': 'faq.title',
      },
      tripsPage: {
        '.hero__title': 'hero.title',
        '.hero__desc': 'hero.description',
        '.categories .section__title': 'categories.title',
      },
      globalSettings: {
        '.footer__desc': 'footer.description',
        '.cta__title': 'cta.title',
        '.cta__desc': 'cta.description',
      }
    };

    const documentId = this.getDocumentId(pageType);
    const mutations = [];
    const patchSet = {};

    changes.forEach(change => {
      const selector = change.selector;
      const mapping = fieldMappings[pageType]?.[selector] || fieldMappings.globalSettings?.[selector];
      
      if (mapping) {
        patchSet[mapping] = change.element.textContent.trim();
      }
    });

    if (Object.keys(patchSet).length > 0) {
      mutations.push({
        patch: {
          id: documentId,
          set: patchSet
        }
      });
    }

    return mutations;
  }

  previewChanges() {
    const changes = Object.values(this.pendingChanges);
    if (changes.length === 0) {
      this.showToast('No changes to preview', 'info');
      return;
    }

    // Highlight all changed elements
    changes.forEach(change => {
      change.element.classList.add('ve-preview-highlight');
      setTimeout(() => {
        change.element.classList.remove('ve-preview-highlight');
      }, 2000);
    });

    this.showToast(`${changes.length} change(s) highlighted`, 'info');
  }

  exitEditor() {
    if (Object.keys(this.pendingChanges).length > 0) {
      if (!confirm('You have unsaved changes. Exit anyway?')) {
        return;
      }
    }
    this.disableEditMode();
    this.showToast('Editor closed', 'info');
  }

  // ==================== UTILITIES ====================
  showToast(message, type = 'info') {
    // Remove existing toast
    const existing = document.querySelector('.ve-toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = `ve-toast ve-toast-${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);

    // Animate in
    setTimeout(() => toast.classList.add('ve-show'), 10);

    // Auto remove
    setTimeout(() => {
      toast.classList.remove('ve-show');
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }

  injectStyles() {
    if (document.getElementById('ve-styles')) return;
    
    const styles = document.createElement('style');
    styles.id = 've-styles';
    styles.textContent = `
      /* ==================== VISUAL EDITOR STYLES ==================== */
      
      /* Edit mode body */
      body.ve-edit-mode {
        padding-right: 320px;
      }

      /* Editable elements */
      .ve-editable {
        position: relative;
        transition: outline 0.2s, box-shadow 0.2s;
        cursor: text;
      }
      
      .ve-editable.ve-hover {
        outline: 2px dashed #3b82f6;
        outline-offset: 4px;
      }
      
      .ve-editable.ve-selected {
        outline: 2px solid #3b82f6;
        outline-offset: 4px;
        box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
      }

      .ve-image-editable {
        cursor: pointer;
        transition: outline 0.2s;
      }
      
      .ve-image-editable:hover {
        outline: 2px dashed #10b981;
        outline-offset: 4px;
      }

      .ve-preview-highlight {
        animation: ve-pulse 0.5s ease-in-out 3;
      }

      @keyframes ve-pulse {
        0%, 100% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.4); }
        50% { box-shadow: 0 0 0 10px rgba(59, 130, 246, 0); }
      }

      /* Floating Toolbar */
      #ve-toolbar {
        position: absolute;
        z-index: 10001;
        background: #1e293b;
        border-radius: 8px;
        padding: 6px;
        box-shadow: 0 10px 40px rgba(0,0,0,0.3);
        display: flex;
        gap: 4px;
      }

      .ve-toolbar-inner {
        display: flex;
        align-items: center;
        gap: 4px;
      }

      .ve-toolbar-group {
        display: flex;
        gap: 2px;
      }

      .ve-toolbar-divider {
        width: 1px;
        height: 24px;
        background: #475569;
        margin: 0 4px;
      }

      .ve-tool {
        width: 32px;
        height: 32px;
        border: none;
        background: transparent;
        color: #e2e8f0;
        border-radius: 4px;
        cursor: pointer;
        font-size: 14px;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: background 0.2s;
      }

      .ve-tool:hover {
        background: #334155;
      }

      /* Side Panel */
      #ve-side-panel {
        position: fixed;
        top: 0;
        right: 0;
        width: 300px;
        height: 100vh;
        background: #0f172a;
        color: #e2e8f0;
        z-index: 10000;
        display: flex;
        flex-direction: column;
        box-shadow: -4px 0 20px rgba(0,0,0,0.3);
        transition: transform 0.3s;
      }

      #ve-side-panel.ve-collapsed {
        transform: translateX(260px);
      }

      .ve-panel-header {
        padding: 16px;
        background: #1e293b;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid #334155;
      }

      .ve-logo {
        font-weight: 600;
        font-size: 16px;
      }

      .ve-panel-close {
        background: none;
        border: none;
        color: #94a3b8;
        font-size: 24px;
        cursor: pointer;
        padding: 0;
        line-height: 1;
      }

      .ve-panel-content {
        flex: 1;
        overflow-y: auto;
        padding: 16px;
      }

      .ve-panel-section {
        margin-bottom: 24px;
      }

      .ve-panel-section h3 {
        font-size: 14px;
        font-weight: 600;
        margin-bottom: 12px;
        color: #94a3b8;
      }

      .ve-changes-list {
        background: #1e293b;
        border-radius: 8px;
        padding: 8px;
        max-height: 200px;
        overflow-y: auto;
      }

      .ve-empty {
        color: #64748b;
        font-size: 13px;
        text-align: center;
        padding: 12px;
        margin: 0;
      }

      .ve-change-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 8px;
        background: #334155;
        border-radius: 4px;
        margin-bottom: 4px;
        font-size: 13px;
      }

      .ve-change-label {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        flex: 1;
      }

      .ve-change-revert {
        background: none;
        border: none;
        cursor: pointer;
        padding: 2px 6px;
        font-size: 14px;
      }

      .ve-panel-footer {
        padding: 16px;
        background: #1e293b;
        border-top: 1px solid #334155;
        display: flex;
        gap: 8px;
      }

      /* Buttons */
      .ve-btn {
        padding: 10px 16px;
        border: none;
        border-radius: 6px;
        font-size: 14px;
        font-weight: 500;
        cursor: pointer;
        transition: background 0.2s, transform 0.1s;
      }

      .ve-btn:active {
        transform: scale(0.98);
      }

      .ve-btn-primary {
        background: #3b82f6;
        color: white;
        flex: 1;
      }

      .ve-btn-primary:hover {
        background: #2563eb;
      }

      .ve-btn-secondary {
        background: #334155;
        color: #e2e8f0;
      }

      .ve-btn-secondary:hover {
        background: #475569;
      }

      .ve-btn-full {
        width: 100%;
        margin-bottom: 8px;
      }

      .ve-btn:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }

      /* Modal */
      .ve-modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0,0,0,0.7);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10002;
      }

      .ve-modal {
        background: #1e293b;
        border-radius: 12px;
        width: 90%;
        max-width: 440px;
        color: #e2e8f0;
        box-shadow: 0 20px 60px rgba(0,0,0,0.4);
      }

      .ve-modal-header {
        padding: 20px 24px;
        border-bottom: 1px solid #334155;
      }

      .ve-modal-header h2 {
        margin: 0 0 4px 0;
        font-size: 20px;
      }

      .ve-modal-header p {
        margin: 0;
        color: #94a3b8;
        font-size: 14px;
      }

      .ve-modal-body {
        padding: 24px;
      }

      .ve-modal-footer {
        padding: 16px 24px;
        background: #0f172a;
        border-radius: 0 0 12px 12px;
        display: flex;
        justify-content: flex-end;
        gap: 8px;
      }

      .ve-form-group {
        margin-bottom: 16px;
      }

      .ve-form-group label {
        display: block;
        margin-bottom: 6px;
        font-size: 14px;
        font-weight: 500;
      }

      .ve-form-group input {
        width: 100%;
        padding: 10px 12px;
        border: 1px solid #334155;
        border-radius: 6px;
        background: #0f172a;
        color: #e2e8f0;
        font-size: 14px;
        box-sizing: border-box;
      }

      .ve-form-group input:focus {
        outline: none;
        border-color: #3b82f6;
      }

      .ve-form-group small {
        display: block;
        margin-top: 6px;
        color: #64748b;
        font-size: 12px;
      }

      .ve-form-group small a {
        color: #3b82f6;
      }

      .ve-checkbox {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 14px;
      }

      .ve-checkbox input {
        width: 16px;
        height: 16px;
      }

      .ve-image-preview {
        background: #0f172a;
        border-radius: 8px;
        padding: 16px;
        margin-bottom: 16px;
        text-align: center;
      }

      .ve-image-preview img {
        max-width: 100%;
        max-height: 200px;
        border-radius: 4px;
      }

      /* Toast */
      .ve-toast {
        position: fixed;
        bottom: 24px;
        left: 50%;
        transform: translateX(-50%) translateY(100px);
        padding: 12px 24px;
        border-radius: 8px;
        font-size: 14px;
        font-weight: 500;
        z-index: 10003;
        transition: transform 0.3s;
        box-shadow: 0 4px 20px rgba(0,0,0,0.3);
      }

      .ve-toast.ve-show {
        transform: translateX(-50%) translateY(0);
      }

      .ve-toast-success {
        background: #10b981;
        color: white;
      }

      .ve-toast-error {
        background: #ef4444;
        color: white;
      }

      .ve-toast-info {
        background: #3b82f6;
        color: white;
      }

      /* Responsive */
      @media (max-width: 768px) {
        body.ve-edit-mode {
          padding-right: 0;
        }

        #ve-side-panel {
          width: 100%;
          height: auto;
          top: auto;
          bottom: 0;
          max-height: 60vh;
        }

        #ve-side-panel.ve-collapsed {
          transform: translateY(calc(100% - 50px));
        }
      }
    `;
    document.head.appendChild(styles);
  }
}

// Initialize visual editor
document.addEventListener('DOMContentLoaded', () => {
  window.visualEditor = new VisualEditor();
});

// Also init if DOM already loaded
if (document.readyState === 'complete' || document.readyState === 'interactive') {
  window.visualEditor = new VisualEditor();
}
