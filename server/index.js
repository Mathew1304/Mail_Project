// server/index.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const crypto = require('crypto');
const http = require('http');

const { run, all, get } = require('./db');
const p2pServer = require('./p2p');

const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(bodyParser.json());

// Initialize P2P server
p2pServer.initialize(server);

// Helper to coerce booleans
const toBoolInt = v => (v ? 1 : 0);

// --- Users ---
app.post('/api/users', (req, res) => {
  const { id = crypto.randomUUID(), email, full_name, password_hash } = req.body;
  try {
    run(
      `INSERT OR REPLACE INTO users (id, email, full_name, password_hash, created_at)
       VALUES (@id,@email,@full_name,@password_hash, datetime('now'))`,
      { id, email, full_name, password_hash }
    );
    res.json({ success: true, id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: String(err) });
  }
});

app.get('/api/users/:id', (req, res) => {
  try {
    const user = get(`SELECT * FROM users WHERE id = @id`, { id: req.params.id });
    res.json(user || null);
  } catch (err) {
    res.status(500).json({ success: false, error: String(err) });
  }
});

app.get('/api/users/email/:email', (req, res) => {
  try {
    const user = get(`SELECT * FROM users WHERE email = @email`, { email: req.params.email });
    res.json(user || null);
  } catch (err) {
    res.status(500).json({ success: false, error: String(err) });
  }
});

// --- Folders ---
app.post('/api/folders', (req, res) => {
  const { id = crypto.randomUUID(), user_id, name } = req.body;
  try {
    run(
      `INSERT OR REPLACE INTO folders (id, user_id, name, created_at)
       VALUES (@id,@user_id,@name, datetime('now'))`,
      { id, user_id, name }
    );
    res.json({ success: true, id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: String(err) });
  }
});

app.get('/api/folders/:userId', (req, res) => {
  try {
    const rows = all(`SELECT * FROM folders WHERE user_id = @userId ORDER BY name COLLATE NOCASE`, { userId: req.params.userId });
    res.json(rows);
  } catch (err) {
    res.status(500).json({ success: false, error: String(err) });
  }
});

// --- Emails ---
app.post('/api/emails', (req, res) => {
  const payload = req.body;
  const id = payload.id || crypto.randomUUID();
  try {
    run(
      `INSERT OR REPLACE INTO emails (id, user_id, folder_id, from_email, from_name, to_emails, cc_emails, bcc_emails, subject, body, is_read, is_starred, is_draft, has_attachments, created_at, sent_at, labels)
       VALUES (@id,@user_id,@folder_id,@from_email,@from_name,@to_emails,@cc_emails,@bcc_emails,@subject,@body,@is_read,@is_starred,@is_draft,@has_attachments, datetime('now'), @sent_at, @labels)`,
      {
        id,
        user_id: payload.user_id,
        folder_id: payload.folder_id || null,
        from_email: payload.from_email,
        from_name: payload.from_name || null,
        to_emails: JSON.stringify(payload.to_emails || []),
        cc_emails: JSON.stringify(payload.cc_emails || []),
        bcc_emails: JSON.stringify(payload.bcc_emails || []),
        subject: payload.subject || null,
        body: payload.body || null,
        is_read: toBoolInt(payload.is_read),
        is_starred: toBoolInt(payload.is_starred),
        is_draft: toBoolInt(payload.is_draft),
        has_attachments: toBoolInt(payload.has_attachments),
        sent_at: payload.sent_at || null,
        labels: JSON.stringify(payload.labels || [])
      }
    );
    res.json({ success: true, id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: String(err) });
  }
});

app.get('/api/emails/:userId', (req, res) => {
  const userId = req.params.userId;
  const folder = req.query.folder; // optional ?folder=folderId
  try {
    let rows;
    if (folder) {
      rows = all(`SELECT * FROM emails WHERE user_id = @userId AND folder_id = @folder ORDER BY datetime(created_at) DESC`, { userId, folder });
    } else {
      rows = all(`SELECT * FROM emails WHERE user_id = @userId ORDER BY datetime(created_at) DESC`, { userId });
    }
    // parse JSON fields
    const parsed = rows.map(r => ({
      ...r,
      to_emails: JSON.parse(r.to_emails || '[]'),
      cc_emails: JSON.parse(r.cc_emails || '[]'),
      bcc_emails: JSON.parse(r.bcc_emails || '[]'),
      labels: JSON.parse(r.labels || '[]'),
      is_read: Boolean(r.is_read),
      is_starred: Boolean(r.is_starred),
      is_draft: Boolean(r.is_draft),
      has_attachments: Boolean(r.has_attachments)
    }));
    res.json(parsed);
  } catch (err) {
    res.status(500).json({ success: false, error: String(err) });
  }
});

app.get('/api/email/:id', (req, res) => {
  try {
    const r = get(`SELECT * FROM emails WHERE id = @id`, { id: req.params.id });
    if (!r) return res.json(null);
    res.json({
      ...r,
      to_emails: JSON.parse(r.to_emails || '[]'),
      cc_emails: JSON.parse(r.cc_emails || '[]'),
      bcc_emails: JSON.parse(r.bcc_emails || '[]'),
      labels: JSON.parse(r.labels || '[]'),
      is_read: Boolean(r.is_read),
      is_starred: Boolean(r.is_starred),
      is_draft: Boolean(r.is_draft),
      has_attachments: Boolean(r.has_attachments)
    });
  } catch (err) {
    res.status(500).json({ success: false, error: String(err) });
  }
});

app.put('/api/email/:id', (req, res) => {
  const id = req.params.id;
  const updates = req.body;
  try {
    // Get the current email to preserve fields not being updated
    const current = get(`SELECT * FROM emails WHERE id = @id`, { id });
    if (!current) {
      return res.status(404).json({ success: false, error: 'Email not found' });
    }

    // Only update fields that are explicitly provided
    const updateFields = [];
    const params = { id };

    if ('folder_id' in updates) {
      updateFields.push('folder_id = @folder_id');
      params.folder_id = updates.folder_id || null;
    }
    if ('is_read' in updates) {
      updateFields.push('is_read = @is_read');
      params.is_read = toBoolInt(updates.is_read);
    }
    if ('is_starred' in updates) {
      updateFields.push('is_starred = @is_starred');
      params.is_starred = toBoolInt(updates.is_starred);
    }
    if ('is_draft' in updates) {
      updateFields.push('is_draft = @is_draft');
      params.is_draft = toBoolInt(updates.is_draft);
    }

    if (updateFields.length === 0) {
      return res.json({ success: true });
    }

    const sql = `UPDATE emails SET ${updateFields.join(', ')} WHERE id = @id`;
    run(sql, params);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: String(err) });
  }
});

// delete email
app.delete('/api/email/:id', (req, res) => {
  try {
    run(`DELETE FROM emails WHERE id = @id`, { id: req.params.id });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: String(err) });
  }
});

// Start server
const PORT = +process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Email backend listening on http://localhost:${PORT}`);
  console.log(`P2P WebSocket available at ws://localhost:${PORT}/api/p2p`);
});
