const DOCS = [
  { id: 'overview', file: 'README.md', group: 'ref', label: '冲刺总览', short: 'OA 结构与四天策略', description: '先确认考什么、不考什么，以及四天后的通过标准。', keywords: ['OA', '结构', '计划', 'trade-off'] },
  { id: 'day1', file: 'day1-networking.md', group: 'day', day: 1, label: '网络与 VPC', short: '请求路径与网络边界', description: 'DNS、HTTP/HTTPS、CIDR、VPC、Subnet、Route、IGW、NAT、SG/NACL、ALB/NLB。', keywords: ['VPC', 'Subnet', 'DNS', 'NAT', 'ALB', 'NLB', 'Security Group'] },
  { id: 'day2', file: 'day2-cloud-data.md', group: 'day', day: 2, label: '计算、存储与数据库', short: '高可用与数据选择', description: 'EC2、Auto Scaling、Multi-AZ、S3/EBS/EFS、RDS、DynamoDB、Cache、RTO/RPO。', keywords: ['EC2', 'S3', 'RDS', 'DynamoDB', 'RTO', 'RPO', 'Auto Scaling'] },
  { id: 'day3', file: 'day3-scenarios.md', group: 'day', day: 3, label: 'Technical Simulation', short: '把知识变成判断', description: '场景拆解、风险识别、架构选择、可靠性与成本 trade-off。', keywords: ['Technical Simulation', 'Reliability', 'Security', 'Performance', 'Cost'] },
  { id: 'day4', file: 'day4-lp-mock.md', group: 'day', day: 4, label: 'LP + Full Mock', short: '经验题与工作风格', description: 'Leadership Principles、Technical Experience、完整 40+10+10 分钟模拟。', keywords: ['Leadership Principles', 'Technical Experience', 'Work Style', 'STAR'] },
  { id: 'quick', file: 'quick-reference.md', group: 'ref', label: '考前速查', short: '最后 20 分钟复习', description: '服务选择、常见陷阱、关键词与一页式架构判断。', keywords: ['速查', 'service', 'cheatsheet'] },
  { id: 'practice', file: 'practice.md', group: 'ref', label: '24 道场景练习', short: '原创训练题', description: '练习目标识别、风险排除、服务选择与 trade-off。', keywords: ['practice', '场景题', '练习'] },
];

const TOPICS = [
  ['VPC / Network', 'VPC、Subnet、Route、IGW、NAT、SG/NACL', 'day1'],
  ['High Availability', 'ALB、Auto Scaling、Multi-AZ、容灾', 'day2'],
  ['Storage', 'S3 vs EBS vs EFS：对象、块、文件', 'day2'],
  ['Database', 'RDS / DynamoDB / Cache 的选择逻辑', 'day2'],
  ['Simulation', 'Goal → Constraint → Risk → Choice → Trade-off', 'day3'],
  ['Leadership', 'Customer Obsession、Ownership、Dive Deep…', 'day4'],
];

const state = {
  contents: new Map(),
  activeId: null,
  completed: new Set(JSON.parse(localStorage.getItem('amazon-sa-oa-completed') || '[]')),
};

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

function escapeHtml(value = '') {
  return value.replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
}

function inlineMarkdown(text) {
  let out = escapeHtml(text);
  out = out.replace(/`([^`]+)`/g, '<code>$1</code>');
  out = out.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  out = out.replace(/\*([^*]+)\*/g, '<em>$1</em>');
  out = out.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, label, href) => {
    const external = /^https?:\/\//.test(href);
    const safeHref = external ? href : `#${href.replace('.md','').replace('README','overview').replace('day1-networking','day1').replace('day2-cloud-data','day2').replace('day3-scenarios','day3').replace('day4-lp-mock','day4').replace('quick-reference','quick')}`;
    return `<a href="${escapeHtml(safeHref)}" ${external ? 'target="_blank" rel="noreferrer"' : ''}>${label}</a>`;
  });
  return out;
}

function slugify(text) {
  return text.toLowerCase().trim().replace(/[`*_]/g,'').replace(/[^\w\u4e00-\u9fff]+/g,'-').replace(/^-|-$/g,'');
}

function markdownToHtml(md) {
  const lines = md.replace(/\r/g, '').split('\n');
  const out = [];
  let i = 0;
  let inCode = false;
  let code = [];
  let listType = null;
  let listItems = [];
  let paragraph = [];

  const flushParagraph = () => {
    if (!paragraph.length) return;
    out.push(`<p>${inlineMarkdown(paragraph.join(' '))}</p>`);
    paragraph = [];
  };
  const flushList = () => {
    if (!listItems.length) return;
    out.push(`<${listType}>${listItems.map(x => `<li>${inlineMarkdown(x)}</li>`).join('')}</${listType}>`);
    listItems = []; listType = null;
  };

  while (i < lines.length) {
    const line = lines[i];
    if (line.startsWith('```')) {
      flushParagraph(); flushList();
      if (!inCode) { inCode = true; code = []; }
      else { out.push(`<pre><code>${escapeHtml(code.join('\n'))}</code></pre>`); inCode = false; }
      i++; continue;
    }
    if (inCode) { code.push(line); i++; continue; }
    if (!line.trim()) { flushParagraph(); flushList(); i++; continue; }

    if (/^\|.+\|\s*$/.test(line) && i + 1 < lines.length && /^\|?\s*:?-+/.test(lines[i + 1])) {
      flushParagraph(); flushList();
      const rows = [];
      const parseRow = row => row.trim().replace(/^\||\|$/g,'').split('|').map(x => x.trim());
      const head = parseRow(line); i += 2;
      while (i < lines.length && /^\|.+\|\s*$/.test(lines[i])) { rows.push(parseRow(lines[i])); i++; }
      out.push(`<div class="table-wrap"><table><thead><tr>${head.map(c=>`<th>${inlineMarkdown(c)}</th>`).join('')}</tr></thead><tbody>${rows.map(r=>`<tr>${r.map(c=>`<td>${inlineMarkdown(c)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`);
      continue;
    }

    const heading = line.match(/^(#{1,4})\s+(.+)$/);
    if (heading) {
      flushParagraph(); flushList();
      const level = heading[1].length;
      const text = heading[2];
      out.push(`<h${level} id="${slugify(text)}">${inlineMarkdown(text)}</h${level}>`);
      i++; continue;
    }
    if (/^>\s?/.test(line)) { flushParagraph(); flushList(); out.push(`<blockquote>${inlineMarkdown(line.replace(/^>\s?/,''))}</blockquote>`); i++; continue; }
    if (/^---+$/.test(line.trim())) { flushParagraph(); flushList(); out.push('<hr>'); i++; continue; }
    const ul = line.match(/^\s*[-*]\s+(.+)$/);
    const ol = line.match(/^\s*\d+[.)]\s+(.+)$/);
    if (ul || ol) {
      flushParagraph();
      const nextType = ul ? 'ul' : 'ol';
      if (listType && listType !== nextType) flushList();
      listType = nextType; listItems.push((ul || ol)[1]); i++; continue;
    }
    paragraph.push(line.trim()); i++;
  }
  flushParagraph(); flushList();
  if (inCode) out.push(`<pre><code>${escapeHtml(code.join('\n'))}</code></pre>`);
  return out.join('\n');
}

async function loadDocs() {
  await Promise.all(DOCS.map(async doc => {
    const res = await fetch(`./content/amazon-sa-oa/${doc.file}`, { cache: 'no-store' });
    if (!res.ok) throw new Error(`Failed to load ${doc.file}`);
    state.contents.set(doc.id, await res.text());
  }));
}

function renderNav() {
  const make = doc => `<button class="nav-item ${state.activeId === doc.id ? 'active' : ''}" data-open-doc="${doc.id}"><span class="nav-dot">${doc.day || '•'}</span><span class="nav-copy"><strong>${doc.label}</strong><small>${doc.short}</small></span></button>`;
  $('#dayNav').innerHTML = DOCS.filter(d => d.group === 'day').map(make).join('');
  $('#refNav').innerHTML = DOCS.filter(d => d.group === 'ref').map(make).join('');
}

function updateProgress() {
  const trackable = DOCS.filter(d => d.id !== 'overview');
  const done = trackable.filter(d => state.completed.has(d.id)).length;
  const percent = Math.round(done / trackable.length * 100);
  $('#sidebarProgressText').textContent = `${done} / ${trackable.length}`;
  $('#sidebarProgressBar').style.width = `${percent}%`;
  const home = $('#homeProgressText');
  if (home) home.textContent = `${done} / ${trackable.length} 完成`;
}

function renderHome() {
  state.activeId = null;
  renderNav();
  const tpl = $('#homeTemplate').content.cloneNode(true);
  $('#view').replaceChildren(tpl);
  $('#dayCards').innerHTML = DOCS.filter(d => d.group === 'day').map(doc => `
    <article class="day-card" data-open-doc="${doc.id}" data-number="${doc.day}">
      <div class="day-meta"><span class="day-index">DAY ${doc.day}</span><span class="done-badge">${state.completed.has(doc.id) ? '✓ 已完成' : '约 4–6 h'}</span></div>
      <h3>${doc.label}</h3><p>${doc.description}</p>
    </article>`).join('');
  $('#topicGrid').innerHTML = TOPICS.map(([title,desc,id]) => `<button class="topic-chip" data-open-doc="${id}"><b>${title}</b><span>${desc}</span></button>`).join('');
  updateProgress();
  history.replaceState(null, '', location.pathname + location.search);
  window.scrollTo({ top: 0 });
}

function stripTitle(md) {
  return md.replace(/^#\s+.+\n+/, '');
}

function renderDoc(id, push = true) {
  const doc = DOCS.find(d => d.id === id);
  const md = state.contents.get(id);
  if (!doc || !md) return renderHome();
  state.activeId = id; renderNav();
  const html = markdownToHtml(stripTitle(md));
  const idx = DOCS.findIndex(d => d.id === id);
  const prev = DOCS[idx - 1], next = DOCS[idx + 1];
  $('#view').innerHTML = `
    <section class="doc-shell">
      <article class="doc-main">
        <header class="doc-header">
          <div class="doc-header-row">
            <div><span class="eyebrow">${doc.day ? `DAY ${doc.day}` : 'REFERENCE'}</span><h1>${doc.label}</h1><p>${doc.description}</p></div>
            ${id !== 'overview' ? `<button class="complete-button ${state.completed.has(id) ? 'done' : ''}" data-toggle-complete="${id}">${state.completed.has(id) ? '✓ 已完成' : '标记完成'}</button>` : ''}
          </div>
        </header>
        <div class="markdown-body">${html}</div>
        <div class="doc-pagination">
          <span>${prev ? `<button class="page-link" data-open-doc="${prev.id}">← ${prev.label}</button>` : ''}</span>
          <span>${next ? `<button class="page-link" data-open-doc="${next.id}">${next.label} →</button>` : ''}</span>
        </div>
      </article>
      <aside class="doc-rail">
        <div class="rail-card"><h4>本页目录</h4><div id="toc" class="toc-list"></div></div>
        <div class="rail-card"><h4>考试原则</h4><div style="font-size:11px;line-height:1.55;color:#5b6470">先识别客户目标，再排除明显风险；优先简单、托管、可扩展方案，最后检查 Reliability / Security / Performance / Cost。</div></div>
      </aside>
    </section>`;
  buildToc(); updateProgress();
  if (push) history.pushState({ id }, '', `#${id}`);
  window.scrollTo({ top: 0 });
}

function buildToc() {
  const headings = $$('.markdown-body h2, .markdown-body h3');
  const toc = $('#toc');
  if (!toc) return;
  toc.innerHTML = headings.slice(0, 12).map(h => `<button class="toc-link" data-anchor="${h.id}">${h.tagName === 'H3' ? '↳ ' : ''}${h.textContent}</button>`).join('') || '<span style="font-size:11px;color:#7a828c">本页无二级标题</span>';
}

function toggleComplete(id) {
  state.completed.has(id) ? state.completed.delete(id) : state.completed.add(id);
  localStorage.setItem('amazon-sa-oa-completed', JSON.stringify([...state.completed]));
  renderDoc(id, false);
}

function plainText(md) {
  return md.replace(/```[\s\S]*?```/g,' ').replace(/\[[^\]]+\]\([^)]+\)/g,' ').replace(/[#>*`_|-]/g,' ').replace(/\s+/g,' ').trim();
}

function doSearch(query) {
  const panel = $('#searchPanel');
  const q = query.trim().toLowerCase();
  if (!q) { panel.hidden = true; panel.innerHTML = ''; return; }
  const results = DOCS.map(doc => {
    const text = `${doc.label} ${doc.description} ${doc.keywords.join(' ')} ${plainText(state.contents.get(doc.id) || '')}`;
    const lower = text.toLowerCase(); const pos = lower.indexOf(q);
    if (pos < 0) return null;
    const start = Math.max(0, pos - 45); const snippet = text.slice(start, start + 120);
    return { doc, snippet: `${start ? '…' : ''}${snippet}${start + 120 < text.length ? '…' : ''}` };
  }).filter(Boolean).slice(0, 8);
  panel.hidden = false;
  panel.innerHTML = results.length ? results.map(({doc,snippet}) => `<button class="search-item" data-open-doc="${doc.id}"><strong>${doc.label}</strong><p>${escapeHtml(snippet)}</p></button>`).join('') : '<div class="search-empty">没有匹配内容，换一个关键词试试。</div>';
}

function routeFromHash() {
  const id = location.hash.replace('#','');
  if (DOCS.some(d => d.id === id)) renderDoc(id, false); else renderHome();
}

document.addEventListener('click', e => {
  const open = e.target.closest('[data-open-doc]');
  if (open) { $('#searchPanel').hidden = true; $('#sidebar').classList.remove('open'); renderDoc(open.dataset.openDoc); return; }
  if (e.target.closest('[data-home]')) { $('#sidebar').classList.remove('open'); renderHome(); return; }
  const complete = e.target.closest('[data-toggle-complete]');
  if (complete) { toggleComplete(complete.dataset.toggleComplete); return; }
  const anchor = e.target.closest('[data-anchor]');
  if (anchor) document.getElementById(anchor.dataset.anchor)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  if (!e.target.closest('.global-search-wrap')) $('#searchPanel').hidden = true;
});

$('#globalSearch').addEventListener('input', e => doSearch(e.target.value));
$('#globalSearch').addEventListener('keydown', e => { if (e.key === 'Escape') { e.target.value = ''; doSearch(''); e.target.blur(); } });
$('#menuButton').addEventListener('click', () => $('#sidebar').classList.toggle('open'));
document.addEventListener('keydown', e => {
  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); $('#globalSearch').focus(); }
});
window.addEventListener('popstate', routeFromHash);

loadDocs().then(() => { renderNav(); routeFromHash(); updateProgress(); }).catch(err => {
  console.error(err);
  $('#view').innerHTML = '<div class="empty-state"><h2>知识库加载失败</h2><p>请确认 GitHub Pages artifact 已包含 content/amazon-sa-oa 下的 Markdown 文件。</p></div>';
});
