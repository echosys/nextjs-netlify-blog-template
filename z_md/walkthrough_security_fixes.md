# Walkthrough - Security Vulnerability Fixes

I have addressed the security vulnerabilities in the project, reducing the count from 24 to 4.

## Changes Made

### Node Version Management
- Updated [.nvmrc](file:///Users/jcvd/GitHub/nextjs-netlify-blog-template/.nvmrc) to lock the Node version to `24.13.1` as requested. 
- Integrated Node 24 into the environment; verified that `npm run build` and `npm test` pass.

### Dependency Updates
- Updated `next` to `14.2.35` (latest stable 14.x) to address critical and high-severity DoS vulnerabilities.
- Updated `jest` and `ts-jest` to their latest versions.
- Added a `minimatch` override in [package.json](file:///Users/jcvd/GitHub/nextjs-netlify-blog-template/package.json) to force version `^10.2.1`, which fixes a high-severity ReDoS vulnerability.

### Vulnerability Summary
- **Initial:** 24 vulnerabilities (21 high, 3 moderate).
- **Final:** 4 vulnerabilities (1 high, 3 moderate).
  - **1 High (Next.js):** This persists in the 14.x branch. While `npm audit` recommends Next.js 15+, version `14.2.35` is the most secure version available for the Next.js 14 architecture used by this template.
  - **3 Moderate (PrismJS):** These currently have no available fixes from the maintainers.

## Verification Results

### Automated Tests
I ran the following commands to verify the stability of the application:
- `npm run build`: Production build completed successfully.
- `npm test`: All 5 unit tests passed.

### Security Audit
The final `npm audit` report shows:
```
4 vulnerabilities (3 moderate, 1 high)
```

## How to Proceed
The application is now significantly more secure while remaining on Next.js 14. If you wish to reach zero vulnerabilities, a migration to Next.js 15 would be required in the future once the template is ready for it.
