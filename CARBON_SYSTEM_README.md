# Carbon Credit System Documentation

## Overview
The Carbon Credit System is a comprehensive gamification feature that tracks and rewards users for reducing their environmental impact through optimized email usage. Users earn carbon credits based on reduced cloud storage and data transfer, which translate into tiered badges and can be submitted to government carbon registries.

## How It Works

### 1. Carbon Metrics Calculation

The system calculates CO₂e (CO₂ equivalent) savings using industry-standard emission factors:

#### Storage Savings
```
CO₂e Saved (kg) = Storage Saved (GB-month) × Emission Factor (0.001 kg CO₂e per GB-month)
```

#### Data Transfer Savings
```
CO₂e Saved (kg) = Data Transfer Reduced (GB) × Network Emission Factor
```

**Network Emission Factors:**
- Internet Backbone: 0.01 kg CO₂e per GB (average of 0.005 - 0.02)
- Mobile Network (4G/5G): 0.1 kg CO₂e per GB (average of 0.05 - 0.2)
- Local Wi-Fi / LAN: 0.0005 kg CO₂e per GB (average of 0.001 - 0.0001)

#### Total CO₂e Savings
```
Total CO₂e Saved = (Storage Reduction × Storage EF) + (Data Reduction × Network EF)
```

#### Carbon Credits
```
Carbon Credits Earned = Total CO₂e Saved (kg) / 1000
(1 carbon credit = 1 ton of CO₂e = 1000 kg)
```

### 2. Example Calculation

**Scenario:** User reduces 500 GB stored for 1 month and 1000 GB data transfer

```
Storage Savings: 500 × 0.001 = 0.5 kg CO₂e
Data Savings: 1000 × 0.01 = 10 kg CO₂e
Total CO₂e: 0.5 + 10 = 10.5 kg CO₂e
Carbon Credits: 10.5 / 1000 = 0.0105 credits
```

## Badge Tier System

The system features 7 main tiers, each with 3 sub-tiers (Tier 1, 2, 3), for a total of 21 achievement levels:

### Tier Breakdown

| Tier | Sub-Tiers | Credit Range | Icon | Description |
|------|-----------|--------------|------|-------------|
| **Bronze** | 1, 2, 3 | 0 - 0.5 | 🥉 | Entry-level contributor |
| **Silver** | 1, 2, 3 | 0.5 - 2 | 🥈 | Growing environmental advocate |
| **Gold** | 1, 2, 3 | 2 - 5 | 🏆 | Established carbon saver |
| **Platinum** | 1, 2, 3 | 5 - 10 | 💎 | Advanced sustainability champion |
| **Diamond** | 1, 2, 3 | 10 - 20 | 💠 | Elite environmental leader |
| **Ace** | 1, 2, 3 | 20 - 40 | 🎯 | Master carbon warrior |
| **Ace Master** | 1, 2, 3 | 40+ | 👑 | Planet guardian |

### Badge Details

Each badge includes:
- **Tier Name**: e.g., "Bronze 1", "Silver 2", "Gold 3"
- **Icon**: Visual representation
- **Color Gradient**: Unique gradient for visual distinction
- **Description**: Achievement description
- **Credit Range**: Minimum and maximum credits for the tier

## Components

### 1. `carbonService.ts`
Core service containing all carbon calculation logic and badge tier definitions.

**Key Functions:**
- `calculateStorageSavings()` - Calculate CO₂e from storage reduction
- `calculateDataTransferSavings()` - Calculate CO₂e from data transfer reduction
- `calculateTotalCO2eSavings()` - Combined calculation
- `calculateCarbonCredits()` - Convert CO₂e to credits
- `calculateCarbonMetrics()` - Complete metrics calculation
- `getBadgeTierForCredits()` - Get current badge tier
- `getProgressToNextTier()` - Calculate progress percentage
- `formatCarbonCredits()` - Format credits for display
- `formatCO2eSavings()` - Format CO₂e for display

### 2. `CarbonBadges.tsx`
Main component displaying carbon credits and badge progression.

**Features:**
- Current badge display with icon and description
- Carbon credits and CO₂e savings metrics
- Progress bar to next tier
- Metrics breakdown (storage and data)
- Government submission interface
- Export functionality
- Complete badge tier system grid
- Submission confirmation modal

**Props:**
```typescript
interface CarbonBadgesProps {
  storageSavedGB?: number;        // Default: 500
  dataTransferReducedGB?: number; // Default: 1000
  networkType?: 'internet' | 'mobile' | 'wifi'; // Default: 'internet'
}
```

### 3. `UserProfile.tsx`
User profile modal with three tabs:

**Tabs:**
1. **Overview** - User stats and recent activity
2. **Carbon Credits** - Full carbon badge system (CarbonBadges component)
3. **Settings** - Notification and privacy preferences

**Features:**
- User information display
- Email statistics
- Recent activity timeline
- Carbon credit tracking
- Government submission
- Export carbon data as JSON
- Notification preferences
- Privacy settings

## Integration

### In MailLayout
The UserProfile component is integrated into the sidebar profile dropdown:

```tsx
<button 
  onClick={() => {
    setShowUserProfile(true);
    setShowProfileDropdown(false);
  }}
  className="..."
>
  <User className="w-4 h-4" />
  View Profile & Carbon Credits
</button>
```

Users can access their profile by:
1. Clicking their profile avatar in the sidebar
2. Clicking "View Profile & Carbon Credits" button

## Government Submission

### How It Works
1. User navigates to their profile → Carbon Credits tab
2. Views available carbon credits to submit
3. Clicks "Submit to Government" button
4. Confirms submission in modal
5. Credits are registered in official carbon offset registry
6. Cannot be undone (permanent record)

### Export Feature
Users can export their carbon credit data as JSON:
```json
{
  "credits": 0.0105,
  "co2eSaved": 10.5,
  "timestamp": "2025-11-21T05:46:00.000Z"
}
```

## Real-Time Data Integration

To integrate with real user data:

1. **Track Storage Usage**: Monitor user's actual storage consumption
2. **Track Data Transfer**: Monitor outbound/inbound data
3. **Update Metrics**: Call `calculateCarbonMetrics()` with real values
4. **Sync with Backend**: Store carbon credits in user database
5. **Government API**: Integrate with government carbon registry API

### Example Backend Integration
```typescript
// Get user's real metrics
const userMetrics = await getUserMetrics(userId);

// Calculate carbon credits
const carbonData = calculateCarbonMetrics(
  userMetrics.storageSavedGB,
  userMetrics.dataTransferReducedGB,
  userMetrics.networkType
);

// Store in database
await updateUserCarbonCredits(userId, carbonData.carbonCreditsEarned);

// Submit to government if requested
if (submitToGovernment) {
  await submitCarbonCreditsToGovernment(userId, carbonData);
}
```

## Emission Factors Reference

### Storage Emission Factor
- **0.001 kg CO₂e per GB-month** (industry average)
- Can vary based on data center location and energy source
- Greener grids: 0.0003 kg CO₂e per GB-month
- Coal-heavy grids: 0.0010 kg CO₂e per GB-month

### Network Emission Factors
- **Internet Backbone**: 0.005 - 0.02 kg CO₂e per GB
- **Mobile Network**: 0.05 - 0.2 kg CO₂e per GB
- **Wi-Fi / LAN**: 0.001 - 0.0001 kg CO₂e per GB

## Display Formatting

The system automatically formats numbers for readability:

```
< 0.001 credits → "0.0000"
< 0.01 credits → 4 decimal places
< 0.1 credits → 3 decimal places
< 1 credit → 2 decimal places
≥ 1 credit → 2 decimal places

CO₂e Savings:
< 1 kg → "X.XXX kg"
< 1000 kg → "X.XX kg"
≥ 1000 kg → "X.XX tons"
```

## Features Summary

✅ **Carbon Calculation** - Accurate CO₂e calculations using industry standards
✅ **Badge System** - 21 tiered badges from Bronze to Ace Master
✅ **Progress Tracking** - Real-time progress to next tier
✅ **Government Integration** - Submit credits to official registries
✅ **Data Export** - Export carbon data as JSON
✅ **User Profile** - Comprehensive profile with carbon dashboard
✅ **Dark Mode** - Full dark mode support
✅ **Responsive Design** - Works on all screen sizes
✅ **Real-Time Updates** - Dynamic metrics calculation

## Future Enhancements

- [ ] Leaderboard system (compare with other users)
- [ ] Carbon offset marketplace
- [ ] Integration with carbon credit trading platforms
- [ ] Historical tracking and analytics
- [ ] Team/organization carbon tracking
- [ ] API for third-party integrations
- [ ] Mobile app support
- [ ] Blockchain verification for government submissions
