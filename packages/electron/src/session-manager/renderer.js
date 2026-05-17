const { ipcRenderer } = require('electron');
const Store = require('electron-store');
const path = require('path');

let allSessions = [];
let filteredSessions = [];
let selectedSession = null;
let filterWorkspace = null;

// Initialize
async function init() {
  // Apply theme
  const theme = await ipcRenderer.invoke('get-theme');
  applyTheme(theme);
  
  // Load sessions
  await loadSessions();
  
  // Set up search
  const searchInput = document.getElementById('searchInput');
  searchInput.addEventListener('input', (e) => {
    filterSessions(e.target.value);
  });

  // Listen for theme changes
  ipcRenderer.on('theme-change', (event, theme) => {
    applyTheme(theme);
  });

  // Listen for workspace filter
  ipcRenderer.on('filter-workspace', (event, workspacePath) => {
    filterWorkspace = workspacePath;
    applyWorkspaceFilter();
    updateWorkspaceFilterBadge();
  });
}

// Apply theme
function applyTheme(theme) {
  // Guard: avoid redundant re-apply
  if (document.body.dataset.theme === theme) return;
  document.body.dataset.theme = theme;
  document.body.className = '';
  // crystal-dark uses dark theme styles
  if (theme === 'dark' || theme === 'crystal-dark') {
    document.body.classList.add('dark');
  }
}

// Load all sessions
async function loadSessions() {
  try {
    allSessions = await ipcRenderer.invoke('session-manager:get-all-sessions');
    applyWorkspaceFilter();
  } catch (error) {
    console.error('Failed to load sessions:', error);
    showError('加载会话失败');
  }
}

// Apply workspace filter
function applyWorkspaceFilter() {
  if (filterWorkspace) {
    filteredSessions = allSessions.filter(session => 
      session.workspacePath === filterWorkspace
    );
  } else {
    filteredSessions = [...allSessions];
  }
  renderSessionsList();
  updateStats();
}

// Filter sessions based on search query
function filterSessions(query) {
  // Start with workspace-filtered sessions
  let baseList = filterWorkspace 
    ? allSessions.filter(s => s.workspacePath === filterWorkspace)
    : allSessions;
    
  if (!query) {
    filteredSessions = [...baseList];
  } else {
    const lowerQuery = query.toLowerCase();
    filteredSessions = baseList.filter(session => {
      // Search in title (first message or id)
      const title = getSessionTitle(session).toLowerCase();
      if (title.includes(lowerQuery)) return true;
      
      // Search in workspace name
      const workspaceName = getWorkspaceName(session.workspacePath);
      if (workspaceName.toLowerCase().includes(lowerQuery)) return true;
      
      // Search in messages
      if (session.messages) {
        return session.messages.some(msg => 
          msg.content && msg.content.toLowerCase().includes(lowerQuery)
        );
      }
      
      return false;
    });
  }
  
  renderSessionsList();
  updateStats();
}

// Render sessions list in sidebar
function renderSessionsList() {
  const container = document.getElementById('sessionsList');
  
  if (filteredSessions.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <p>未找到会话</p>
      </div>
    `;
    return;
  }
  
  container.innerHTML = filteredSessions.map(session => {
    const title = getSessionTitle(session);
    const workspaceName = getWorkspaceName(session.workspacePath);
    const date = formatDate(session.createdAt);
    const messageCount = session.messages ? session.messages.length : 0;
    const isSelected = selectedSession && selectedSession.id === session.id;
    const provider = session.provider || 'claude-code';
    const providerLabel = provider === 'claude' ? 'SDK' : 'Code';
    
    return `
      <div class="session-item ${isSelected ? 'selected' : ''}" data-session-id="${session.id}">
        <div class="session-item-title">${escapeHtml(title)}</div>
        <div class="session-item-meta">
          <span class="session-item-provider provider-${provider}">${providerLabel}</span>
          <span>•</span>
          <span class="session-item-workspace">${escapeHtml(workspaceName)}</span>
          <span>•</span>
          <span>${messageCount} 条消息</span>
          <span>•</span>
          <span>${date}</span>
        </div>
      </div>
    `;
  }).join('');
  
  // Add click handlers
  container.querySelectorAll('.session-item').forEach(item => {
    item.addEventListener('click', () => {
      const sessionId = item.dataset.sessionId;
      const session = filteredSessions.find(s => s.id === sessionId);
      if (session) {
        selectSession(session);
      }
    });
  });
}

// Select and display a session
function selectSession(session) {
  selectedSession = session;
  
  // Update selected state in list
  document.querySelectorAll('.session-item').forEach(item => {
    item.classList.remove('selected');
    if (item.dataset.sessionId === session.id) {
      item.classList.add('selected');
    }
  });
  
  // Render session content
  renderSessionContent(session);
}

// Render session content in right panel
function renderSessionContent(session) {
  const contentArea = document.getElementById('contentArea');
  
  const title = getSessionTitle(session);
  const workspaceName = getWorkspaceName(session.workspacePath);
  const date = formatDate(session.createdAt);
  const messageCount = session.messages ? session.messages.length : 0;
  const provider = session.provider || 'claude-code';
  const providerLabel = provider === 'claude' ? 'Claude SDK' : 'Claude Code';
  
  let messagesHtml = '';
  if (session.messages && session.messages.length > 0) {
    messagesHtml = session.messages.map(msg => {
      const roleClass = msg.role === 'user' ? 'user' : 'assistant';
      const roleLabel = msg.role === 'user' ? '你' : 'Claude';
      const content = formatMessageContent(msg.content || '');
      
      return `
        <div class="message">
          <div class="message-role ${roleClass}">${roleLabel}</div>
          <div class="message-content">${content}</div>
        </div>
      `;
    }).join('');
  } else {
    messagesHtml = '<div class="empty-state"><p>此会话没有消息</p></div>';
  }
  
  contentArea.innerHTML = `
    <div class="content-header">
      <div class="content-title">${escapeHtml(title)}</div>
      <div class="content-meta">
        <span class="provider-badge provider-${provider}">${providerLabel}</span>
        <span>•</span>
        <span>${escapeHtml(workspaceName)}</span>
        <span>•</span>
        <span>${messageCount} 条消息</span>
        <span>•</span>
        <span>${date}</span>
      </div>
    </div>
    <div class="content-actions">
      <button class="btn btn-primary" onclick="openSession('${session.id}', ${session.workspacePath ? `'${escapeHtml(session.workspacePath)}'` : 'null'})">
        打开会话
      </button>
      <button class="btn" onclick="exportSession('${session.id}')">
        导出
      </button>
      <button class="btn btn-danger" onclick="deleteSession('${session.id}', ${session.workspacePath ? `'${escapeHtml(session.workspacePath)}'` : 'null'})">
        删除
      </button>
    </div>
    <div class="messages-container">
      ${messagesHtml}
    </div>
  `;
}

// Open session in main app
async function openSession(sessionId, workspacePath) {
  try {
    const actualPath = workspacePath === 'null' ? null : workspacePath;
    await ipcRenderer.invoke('session-manager:open-session', sessionId, actualPath);
    window.close();
  } catch (error) {
    console.error('Failed to open session:', error);
    showError('打开会话失败');
  }
}

// Export session to file
async function exportSession(sessionId) {
  const session = allSessions.find(s => s.id === sessionId);
  if (!session) return;
  
  try {
    const result = await ipcRenderer.invoke('session-manager:export-session', session);
    if (result.success) {
      showSuccess(`会话已导出到 ${result.filePath}`);
    }
  } catch (error) {
    console.error('Failed to export session:', error);
    showError('导出会话失败');
  }
}

// Delete session
async function deleteSession(sessionId, workspacePath) {
  if (!confirm('确定要删除此会话吗？此操作不可撤销。')) {
    return;
  }
  
  try {
    const actualPath = workspacePath === 'null' ? null : workspacePath;
    await ipcRenderer.invoke('claude:deleteSession', sessionId, actualPath);
    
    // Reload sessions
    await loadSessions();
    
    // Clear content if deleted session was selected
    if (selectedSession && selectedSession.id === sessionId) {
      selectedSession = null;
      document.getElementById('contentArea').innerHTML = `
        <div class="empty-state">
          <h2>选择一个会话</h2>
          <p>从列表中选择一个会话以查看消息</p>
        </div>
      `;
    }
    
    showSuccess('会话已删除');
  } catch (error) {
    console.error('Failed to delete session:', error);
    showError('删除会话失败');
  }
}

// Update session count
function updateStats() {
  const count = filteredSessions.length;
  const total = filterWorkspace
    ? allSessions.filter(s => s.workspacePath === filterWorkspace).length
    : allSessions.length;

  let text;
  if (filterWorkspace) {
    const workspaceName = getWorkspaceName(filterWorkspace);
    text = count === total 
      ? `${workspaceName} 中的 ${count} 个会话`
      : `${workspaceName} 中的 ${count}/${total} 个会话`;
  } else {
    text = count === total 
      ? `${count} 个会话（所有工作区）`
      : `${count}/${total} 个会话`;
  }
  document.getElementById('sessionCount').textContent = text;
}

// Helper functions
function getSessionTitle(session) {
  if (session.messages && session.messages.length > 0) {
    const firstUserMessage = session.messages.find(m => m.role === 'user');
    if (firstUserMessage && firstUserMessage.content) {
      // Take first line or first 100 chars
      const lines = firstUserMessage.content.split('\n');
      const firstLine = lines[0].trim();
      return firstLine.length > 100 ? firstLine.substring(0, 100) + '...' : firstLine;
    }
  }
  return `会话 ${session.id.substring(0, 8)}`;
}

function getWorkspaceName(workspacePath) {
  if (!workspacePath) return '无工作区';
  return path.basename(workspacePath);
}

function formatDate(timestamp) {
  if (!timestamp) return '未知';
  const date = new Date(timestamp);
  const now = new Date();
  const diff = now - date;
  
  if (diff < 3600000) {
    const mins = Math.floor(diff / 60000);
    return mins <= 1 ? '刚刚' : `${mins} 分钟前`;
  }
  
  if (diff < 86400000) {
    const hours = Math.floor(diff / 3600000);
    return `${hours} 小时前`;
  }
  
  if (diff < 604800000) {
    const days = Math.floor(diff / 86400000);
    return `${days} 天前`;
  }
  
  return date.toLocaleDateString('zh-CN');
}

function formatMessageContent(content) {
  // Basic markdown to HTML conversion
  let html = escapeHtml(content);
  
  // Code blocks
  html = html.replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>');
  
  // Inline code
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>');
  
  // Bold
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  
  // Italic
  html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
  
  // Line breaks
  html = html.replace(/\n/g, '<br>');
  
  return html;
}

function escapeHtml(text) {
  if (!text) return '';
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function showError(message) {
  // Could implement a toast notification here
  console.error(message);
}

function showSuccess(message) {
  // Could implement a toast notification here
  console.log(message);
}

function updateWorkspaceFilterBadge() {
  const badge = document.getElementById('workspaceFilter');
  if (filterWorkspace) {
    const workspaceName = getWorkspaceName(filterWorkspace);
    badge.textContent = `工作区: ${workspaceName}`;
    badge.style.display = 'inline-block';
  } else {
    badge.style.display = 'none';
  }
}

// Make functions available globally for onclick handlers
window.openSession = openSession;
window.exportSession = exportSession;
window.deleteSession = deleteSession;

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', init);
