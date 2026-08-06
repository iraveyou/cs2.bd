Payment workflow (manual verification) — implementation notes

Goal: persist buyer payment proof, reserve order atomically, and create admin verification queue.

Server-side behavior (app/api/payments/route.ts)
- Accept multipart/form-data with fields: listingId, amount, method, senderNumber, transactionId, screenshot (file)
- Validate inputs and listing availability
- Save screenshot to protected media storage (Cloudinary or local uploads for dev) and create Media record
- Atomically decrement listing stock, create Order with status RESERVED, create OrderItem snapshot, create Payment with status SUBMITTED and link to order
- Set reservedUntil timestamp (30 minutes)
- Create AuditLog entry for ORDER_RESERVE

Admin verification queue
- Payments with status SUBMITTED should be listed in admin dashboard (/admin/payments)
- Admin actions: Verify, Reject, Request More Info
- Verifying sets Payment.status=VERIFIED, Order.status=AWAITING_DELIVERY, notifies seller and buyer
- Rejecting sets Payment.status=REJECTED and increments listing.stock by 1 (release reservation)

Fraud detection / dedup
- Basic duplicate detection: detect same transactionId or same senderNumber+amount within recent window
- Flag duplicates by setting Payment.status=DUPLICATE and create Report

Notes
- Current implementation persists to local public/uploads for screenshots (dev). For production, replace with Cloudinary / UploadThing and scan images.
- Buyer/seller association: buyerId and sellerId are left null for anonymous demo flows; integrate with NextAuth once auth is implemented.
- Ensure proper access controls on admin endpoints and rate-limit the payments API.
