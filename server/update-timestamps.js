// server/update-timestamps.js
// This script updates all email timestamps to today's date with current time
const { run, all } = require('./db');

console.log('Updating email timestamps to today...');

try {
  // Get all emails
  const emails = all(`SELECT id, created_at FROM emails`);
  
  if (emails.length === 0) {
    console.log('No emails found to update.');
    process.exit(0);
  }

  console.log(`Found ${emails.length} emails. Updating timestamps...`);

  // Update each email with today's date but keep the time component
  emails.forEach((email, index) => {
    // Parse the old timestamp to get the time
    const oldDate = new Date(email.created_at);
    const hours = String(oldDate.getHours()).padStart(2, '0');
    const minutes = String(oldDate.getMinutes()).padStart(2, '0');
    const seconds = String(oldDate.getSeconds()).padStart(2, '0');
    
    // Create new timestamp with today's date but original time
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    
    const newTimestamp = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    
    run(`UPDATE emails SET created_at = @timestamp WHERE id = @id`, {
      timestamp: newTimestamp,
      id: email.id
    });
    
    console.log(`[${index + 1}/${emails.length}] Updated: ${newTimestamp}`);
  });

  console.log('✅ All email timestamps updated successfully!');
  process.exit(0);
} catch (error) {
  console.error('❌ Error updating timestamps:', error);
  process.exit(1);
}
