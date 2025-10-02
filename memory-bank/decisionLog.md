# Decision Log

This file records architectural and implementation decisions using a list format.
2025-10-02 10:52:53 - Log of updates made.

*

## [2025-10-02 11:12:09] API Authentication Strategy

### Decision
Use browser session cookies (credentials: 'include') for API authentication instead of explicit OAuth token management in React code.

### Rationale
1. **Security:** OAuth tokens never exposed in client-side JavaScript
2. **Simplicity:** Browser automatically manages cookies and CORS
3. **Production Pattern:** Matches how original app.shearstreaming.com handles authentication
4. **Session Management:** OAuth tokens managed by Keycloak on backend
5. **Development Flow:** Can test by logging into app.shearstreaming.com first, then our app uses same session

### Implementation Details
- Added `credentials: 'include'` to all fetch requests in API service
- Implemented proper error handling for 401 (authentication required)
- No localStorage token management needed
- CORS properly configured on production.api.shearstreaming.com
- Alternative (explicit token management) rejected due to security concerns

### Future Consideration
If deploying to different domain than production.api.shearstreaming.com, may need to implement explicit OAuth token flow.

---

## [2025-10-02 11:09:48] Real-Time Polling with React Query

### Decision
Use React Query (TanStack Query) with 2-second refetchInterval for real-time timeseries data.

### Rationale
1. **Automatic Polling:** React Query handles interval logic automatically
2. **Cache Management:** Built-in stale-time and cache invalidation
3. **Loading States:** Automatic loading, error, and success states
4. **Deduplication:** Prevents duplicate requests during polling
5. **Production Pattern:** Matches observed 2-second polling in original app

### Implementation Details
- Created useTimeseriesData hook with refetchInterval: 2000
- Implemented conditional fetching based on enabled flag and channel selection
- Added staleTime: 5 minutes for metadata (doesn't change often)
- Query keys include all dependencies for proper cache invalidation