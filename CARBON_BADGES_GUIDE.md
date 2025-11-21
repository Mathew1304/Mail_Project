# Carbon Badges Visual Guide

## Badge Tier Progression

```
┌─────────────────────────────────────────────────────────────────┐
│                    CARBON CREDIT JOURNEY                        │
└─────────────────────────────────────────────────────────────────┘

🥉 BRONZE TIER (0 - 0.5 credits)
├─ Bronze 1: 0.00 - 0.15 credits    [Just started your carbon journey]
├─ Bronze 2: 0.15 - 0.30 credits    [Building your carbon savings]
└─ Bronze 3: 0.30 - 0.50 credits    [Bronze mastery achieved]

🥈 SILVER TIER (0.5 - 2 credits)
├─ Silver 1: 0.50 - 0.90 credits    [Silver contributor]
├─ Silver 2: 0.90 - 1.40 credits    [Silver specialist]
└─ Silver 3: 1.40 - 2.00 credits    [Silver master]

🏆 GOLD TIER (2 - 5 credits)
├─ Gold 1: 2.00 - 2.80 credits      [Gold tier contributor]
├─ Gold 2: 2.80 - 3.80 credits      [Gold specialist]
└─ Gold 3: 3.80 - 5.00 credits      [Gold master]

💎 PLATINUM TIER (5 - 10 credits)
├─ Platinum 1: 5.00 - 6.50 credits  [Platinum pioneer]
├─ Platinum 2: 6.50 - 8.00 credits  [Platinum specialist]
└─ Platinum 3: 8.00 - 10.00 credits [Platinum master]

💠 DIAMOND TIER (10 - 20 credits)
├─ Diamond 1: 10.00 - 13.00 credits [Diamond contributor]
├─ Diamond 2: 13.00 - 16.00 credits [Diamond specialist]
└─ Diamond 3: 16.00 - 20.00 credits [Diamond master]

🎯 ACE TIER (20 - 40 credits)
├─ Ace 1: 20.00 - 26.00 credits     [Ace champion]
├─ Ace 2: 26.00 - 33.00 credits     [Ace master]
└─ Ace 3: 33.00 - 40.00 credits     [Ace legend]

👑 ACE MASTER TIER (40+ credits)
├─ Ace Master 1: 40 - 60 credits    [Environmental Champion]
├─ Ace Master 2: 60 - 100 credits   [Carbon Warrior]
└─ Ace Master 3: 100+ credits       [Planet Guardian]
```

## How to Earn Carbon Credits

### Example Scenarios

#### Scenario 1: Light User
```
Storage Saved: 100 GB-month
Data Transfer Reduced: 200 GB
Network Type: Internet

Calculation:
Storage: 100 × 0.001 = 0.1 kg CO₂e
Data: 200 × 0.01 = 2 kg CO₂e
Total: 2.1 kg CO₂e
Credits: 2.1 / 1000 = 0.0021 credits

Badge: Bronze 1 ⭐
```

#### Scenario 2: Regular User
```
Storage Saved: 500 GB-month
Data Transfer Reduced: 1000 GB
Network Type: Internet

Calculation:
Storage: 500 × 0.001 = 0.5 kg CO₂e
Data: 1000 × 0.01 = 10 kg CO₂e
Total: 10.5 kg CO₂e
Credits: 10.5 / 1000 = 0.0105 credits

Badge: Silver 1 ⭐
```

#### Scenario 3: Power User
```
Storage Saved: 2000 GB-month
Data Transfer Reduced: 5000 GB
Network Type: Internet

Calculation:
Storage: 2000 × 0.001 = 2 kg CO₂e
Data: 5000 × 0.01 = 50 kg CO₂e
Total: 52 kg CO₂e
Credits: 52 / 1000 = 0.052 credits

Badge: Silver 2 ⭐
```

#### Scenario 4: Environmental Champion
```
Storage Saved: 10000 GB-month
Data Transfer Reduced: 50000 GB
Network Type: Internet

Calculation:
Storage: 10000 × 0.001 = 10 kg CO₂e
Data: 50000 × 0.01 = 500 kg CO₂e
Total: 510 kg CO₂e
Credits: 510 / 1000 = 0.51 credits

Badge: Silver 3 ⭐
```

## Network Type Impact

### Same Data Transfer, Different Networks

**Reducing 1000 GB data transfer:**

```
Internet Backbone:
1000 × 0.01 = 10 kg CO₂e = 0.01 credits

Mobile Network (4G/5G):
1000 × 0.1 = 100 kg CO₂e = 0.1 credits

Wi-Fi / LAN:
1000 × 0.0005 = 0.5 kg CO₂e = 0.0005 credits
```

**Note:** Mobile networks have higher emission factors due to energy-intensive infrastructure.

## Government Submission Process

```
┌─────────────────────────────────────────┐
│  User Profile → Carbon Credits Tab      │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│  View Current Carbon Credits            │
│  Available: 0.0105 credits              │
│  Already Submitted: 0.0000 credits      │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│  Click "Submit to Government"           │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│  Confirmation Modal                     │
│  ✓ Action is permanent                  │
│  ✓ Credits registered officially        │
│  [Cancel] [Confirm Submission]          │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│  ✅ Successfully Submitted!              │
│  Credits now in government registry     │
│  Available: 0.0000 credits              │
│  Already Submitted: 0.0105 credits      │
└─────────────────────────────────────────┘
```

## Data Export Format

```json
{
  "credits": 0.0105,
  "co2eSaved": 10.5,
  "timestamp": "2025-11-21T05:46:00.000Z"
}
```

**File naming:** `carbon-credits-{timestamp}.json`

## Progress Visualization

### Current Badge: Silver 1
```
Progress to Next Tier (Silver 2)

Current Credits: 0.75
Next Tier Starts: 0.90

Progress Bar:
[████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░] 83%

Credits Needed: 0.15 more
```

## Color Scheme

| Tier | Gradient | Hex Colors |
|------|----------|-----------|
| Bronze | amber-600 to amber-700 | #b45309 → #92400e |
| Silver | gray-300 to gray-500 | #d1d5db → #6b7280 |
| Gold | yellow-400 to amber-600 | #facc15 → #b45309 |
| Platinum | cyan-300 to blue-500 | #06b6d4 → #3b82f6 |
| Diamond | blue-300 to indigo-600 | #93c5fd → #4f46e5 |
| Ace | purple-400 to indigo-700 | #c084fc → #3730a3 |
| Ace Master | red-500 to red-700 | #ef4444 → #b91c1c |

## Tips to Earn More Credits

1. **Reduce Email Attachments**
   - Smaller emails = less data transfer
   - Use cloud links instead of attachments

2. **Archive Old Emails**
   - Reduces storage footprint
   - Frees up space

3. **Use Compression**
   - Compress files before sending
   - Reduces data transfer

4. **Optimize Images**
   - Resize images before attaching
   - Use efficient formats (WebP, etc.)

5. **Schedule Emails**
   - Batch send during off-peak hours
   - Reduces server load

6. **Use P2P Distribution**
   - Peer-to-peer reduces central server load
   - More efficient data distribution

## Leaderboard Potential

Future feature to compare with other users:

```
🥇 1st Place: Alice (2.45 credits) - Platinum 2
🥈 2nd Place: Bob (1.89 credits) - Silver 3
🥉 3rd Place: Carol (1.23 credits) - Silver 2
   4th Place: David (0.95 credits) - Silver 1
   5th Place: Eve (0.67 credits) - Bronze 3
```

## FAQ

**Q: Can I lose credits?**
A: No, credits only increase as you save more CO₂e.

**Q: What happens when I submit to government?**
A: Credits are permanently recorded in the official carbon registry and cannot be resubmitted.

**Q: Can I export my data?**
A: Yes, click the Export button to download your carbon data as JSON.

**Q: How often are credits updated?**
A: Credits are calculated in real-time based on your current storage and data usage.

**Q: What's the difference between CO₂e and credits?**
A: CO₂e (kg) is the actual environmental impact. Credits are CO₂e converted to tons (1 credit = 1 ton = 1000 kg).

**Q: Can I trade my credits?**
A: Currently, credits are for tracking and government submission. Future versions may include trading.
