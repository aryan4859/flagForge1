# Dynamic Flag System - Architecture Overview

## Visual Architecture

The complete architecture diagram is available in `dynamic-flag-architecture.svg`

## System Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                        👤 USER LAYER                             │
│                                                                   │
│    CTF Player  →  [Start Challenge]  →  [Submit Flag]           │
└────────────┬──────────────────┬──────────────────────────────────┘
             │                  │
             │ ① Request Flag   │ ⑤ Submit Flag
             ↓                  ↓
┌─────────────────────────────────────────────────────────────────┐
│                       🔌 API LAYER                               │
│                                                                   │
│  POST /api/problems/dynamic-flag  │  POST /api/problems/[id]    │
│  (Generate Flag)                   │  (Validate Flag)            │
└────────────┬──────────────────────────────┬─────────────────────┘
             │                               │
             │ ② Generate                    │ ⑥ Validate
             ↓                               ↓
┌─────────────────────────────────────────────────────────────────┐
│                  ⚙️ BUSINESS LOGIC LAYER                         │
│                                                                   │
│  Flag Generator Utility:          Flag Types:                    │
│  • generateGUID()                 • GUID                         │
│  • generateTeamHash()             • TEAM_HASH                    │
│  • applyLeetSpeak()               • LEET                         │
│  • validateFlag()                 • CLEET                        │
│  • calculateEntropy()                                            │
└────────────┬──────────────────────────────┬─────────────────────┘
             │                               │
             │ ③ Store (24h)    ⑦ Check     │ ⑧ Fallback
             ↓                  ↓            ↓
┌─────────────────────────────────────────────────────────────────┐
│                    💾 DATABASE LAYER (MongoDB)                   │
│                                                                   │
│  DynamicFlag         Question            UserQuestion            │
│  • userId            • _id               • userId                │
│  • questionId        • flag (template)   • questionId            │
│  • flag              • points            • solved                │
│  • expiresAt (24h)   • category          • pointsEarned         │
└─────────────────────────────────────────────────────────────────┘
             │                               │
             │ ④ Return Flag                 │ ⑨ Save Solution
             ↓                               ↓
             └───────────────┬───────────────┘
                             │
                             │ ⑩ Success!
                             ↓
                        👤 USER LAYER
```

## Detailed Flow Description

### Flag Generation Flow (Steps 1-4)

1. **User Starts Challenge**
   - User clicks "Start Challenge" button
   - Frontend calls `POST /api/problems/dynamic-flag`

2. **API Processes Request**
   - Validates user session
   - Checks if flag already exists for this user+question
   - If exists, returns existing flag
   - If not, proceeds to generation

3. **Flag Generation**
   - Reads question's flag template
   - Determines flag type (GUID, TEAM_HASH, LEET, CLEET)
   - Generates unique flag using:
     - Random UUID for GUID
     - SHA256(salt + userId + questionId) for TEAM_HASH
     - Leet speak transformation for LEET/CLEET
   - Validates entropy (minimum 32 bits)

4. **Storage & Return**
   - Saves to DynamicFlag collection with:
     - userId (unique to this user)
     - questionId
     - generated flag
     - expiresAt (current time + 24 hours)
   - Returns flag to user with expiration info

### Flag Validation Flow (Steps 5-10)

5. **User Submits Flag**
   - User enters flag and submits
   - Frontend calls `POST /api/problems/[id]`

6. **Validation Process**
   - API receives submitted flag
   - Validates user session
   - Checks if user already solved this question

7. **Check Dynamic Flag**
   - Queries DynamicFlag collection for:
     - userId = current user
     - questionId = submitted question
     - expiresAt > current time
   - If found, validates against dynamic flag

8. **Fallback to Static**
   - If no dynamic flag found
   - Falls back to question's static flag
   - Ensures backward compatibility

9. **Save Solution**
   - If flag is correct:
     - Creates UserQuestion record
     - Updates user's total score
     - Deletes used dynamic flag
     - Awards points (minus hint penalties)

10. **Return Success**
    - Sends success response to user
    - Includes points earned
    - Updates leaderboard

## Key Components

### Models

- **DynamicFlag**: Stores user-specific flags with TTL
- **Question**: Contains flag templates and points
- **UserQuestion**: Tracks solved challenges

### Utilities

- **flagGenerator.ts**: Core flag generation logic
  - GUID generation
  - Team hash calculation
  - Leet speak transformation
  - Entropy validation

### API Endpoints

- **POST /api/problems/dynamic-flag**: Generate/retrieve flags
- **POST /api/problems/[id]**: Submit and validate flags

## Security Features

🔒 **User Isolation**: Flags tied to specific user IDs
🔒 **Time-Limited**: 24-hour expiration with auto-cleanup
🔒 **Salted Hashing**: SHA256 with secret salt
🔒 **Entropy Validation**: Minimum 32-bit security
🔒 **One-Time Use**: Flags deleted after successful submission

## Database Indexes

- **Compound Index**: (userId, questionId) for fast lookups
- **TTL Index**: expiresAt for automatic cleanup
- **Single Field**: userId, questionId for queries

## Example Flag Types

```javascript
// GUID (Random)
"flag{1bab71b8-117f-4dea-a047-340b72101d7b}"

// TEAM_HASH (User+Question specific)
"flag{hello_world_5418ce4d815c}"

// LEET (Leet speak)
"flag{H3ll0_W0r1d}"

// CLEET (Complex leet with special chars)
"flag{H3!!0_W0r!d}"
```

## Configuration

Required environment variable:
```env
FLAG_SALT=your-secret-random-salt-here
```

## Benefits

✅ **Prevents Flag Sharing**: Each user has unique flag
✅ **Time-Limited**: Flags expire automatically
✅ **Flexible**: Multiple flag generation methods
✅ **Secure**: Cryptographic hashing with salt
✅ **Scalable**: Efficient database queries with indexes
✅ **Compatible**: Works with existing static flags
