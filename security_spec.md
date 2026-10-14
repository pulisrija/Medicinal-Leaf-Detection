# Security Specification: HerbVision AI

## 1. Data Invariants
- **User Integrity**: Users can only create and update their own profile document (`/users/{userId}` where `userId == request.auth.uid`). No unauthorized modifications to counters or external profile spoofing.
- **Scan Ownership**: Users can only create, read, update, and delete their own leaf identification scans (`/scans/{scanId}` where `resource.data.userId == request.auth.uid` or `incoming().userId == request.auth.uid`).
- **Scan List Security**: Scans cannot be read with a blanket query; `allow list` requires `resource.data.userId == request.auth.uid`.
- **Saved Plant Ownership**: Users can only create, read, and delete their own bookmarked plants (`/saved_plants/{savedId}` where `resource.data.userId == request.auth.uid`).
- **Community Notes Integrity**: Community notes are readable by anyone (public botanical field research). Creating or deleting notes requires being the authenticated author (`request.auth.uid == incoming().authorId`). Updates are restricted to the author.
- **Input Validation**: Strict string length limits, valid document IDs conforming to `^[a-zA-Z0-9_\-]+$`, and valid numbers for confidence scores and counters.
- **Temporal Integrity**: `createdAt` and `updatedAt` timestamps must match `request.time`.

## 2. Dirty Dozen Payloads (Rejection Targets)
1. Unauthenticated write to `/users/any-id`
2. Authenticated user `user_A` attempting to write to `/users/user_B`
3. Setting an oversized `displayName` (> 100 characters)
4. Setting a negative or non-number `confidence` in a scan
5. User `user_A` attempting to read `user_B`'s private leaf scans in `/scans/{scanId}`
6. Blanket `list` query to `/scans` without user isolation
7. Writing a scan with spoofed `userId` different from `request.auth.uid`
8. Writing a community note with spoofed `authorId`
9. Updating another user's community note
10. Attempting to inject malicious path characters or excessive size (>128 chars) into a document ID
11. Updating immutable fields like `createdAt` or `scanId` in an existing scan
12. Attempting to bypass schema with unknown arbitrary ghost fields ("Shadow Update")

## 3. Test Runner Design
Unit tests enforce security boundaries using the `@firebase/rules-unit-testing` standard, ensuring that all 12 dirty payloads trigger `PERMISSION_DENIED`.
