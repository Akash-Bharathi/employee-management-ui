
## Backend Changes

### New API Endpoints
- **Dashboard Management**: Routes for fetching admin and user dashboard data with statistics
- **Security Monitoring**: Endpoints for:
  - Security alerts summary
  - Top risk users detection
  - Top risk companies detection
  - Recent security events tracking
- **Subscription Management**: Endpoints for subscription plans and user subscriptions
- **Settings**: API routes for user preferences and configurations

### Database
- Updated users.db with new tables and indices for security events and subscriptions

## Frontend Changes

#### Services Created
- **securityService.js**: API calls for security monitoring
  - `getSecuritySummary()`
  - `getTopRiskUsers()`
  - `getTopRiskCompanies()`
  - `getRecentSecurityEvents()`

- **subscriptionService.js**: API calls for subscription management

## Key Features Implemented

 **Role-Based Access Control**
- Admin-only menu items and routes
- Protected security monitoring page

 **Security Monitoring Dashboard**
- Real-time security alerts
- Risk scoring for users and companies
- Security event logging and timeline

 **Subscription Management**
- Subscription plan display
- User subscription tracking
- Plan selection interface

 **Improved Dashboard**
- Separate admin and user dashboards
- Role-based data filtering
- Enhanced statistics display

 **Settings Management**
- User preferences configuration
- Account settings interface

<img width="1920" height="1675" alt="Screenshot 2026-06-18 at 19-28-53 employee-management" src="https://github.com/user-attachments/assets/2274558f-687a-4e80-8418-c3fe0fe63b22" />
<img width="1920" height="913" alt="Screenshot 2026-06-18 at 18-46-49 Employee Management API - Swagger UI" src="https://github.com/user-attachments/assets/9ca279c0-3946-466c-b1c4-ca145070ede6" />
<img width="1920" height="913" alt="Screenshot 2026-06-18 at 18-01-36 Employee Management API - Swagger UI" src="https://github.com/user-attachments/assets/34a72b67-24a0-4b3c-a329-5960bb570355" />
<img width="1920" height="913" alt="Screenshot 2026-06-18 at 18-01-30 Employee Management API - Swagger UI" src="https://github.com/user-attachments/assets/82f4c0fc-5251-4f0c-9606-0c1c455034fb" />
<img width="1288" height="762" alt="Screenshot 2026-06-18 174612" src="https://github.com/user-attachments/assets/e7903ed9-98d2-4499-a339-362e6e5f10b6" />
<img width="1920" height="913" alt="Screenshot 2026-06-18 at 17-45-05 employee-management" src="https://github.com/user-attachments/assets/17d8a134-cdd3-45b1-bc1a-d546bb40f1c8" />
<img width="1920" height="913" alt="Screenshot 2026-06-18 at 16-17-19 employee-management" src="https://github.com/user-attachments/assets/d7cc9bfa-fba6-4b6a-943a-2412e6ed25d1" />
<img width="1920" height="913" alt="Screenshot 2026-06-18 at 16-17-28 employee-management" src="https://github.com/user-attachments/assets/7a964ffd-65c6-4b37-82b0-e7faf92fb6a1" />
<img width="1920" height="1107" alt="Screenshot 2026-06-18 at 16-17-39 employee-management" src="https://github.com/user-attachments/assets/2e3cdd7d-13bc-482f-96dc-d70efdf183ba" />
<img width="1920" height="1521" alt="Screenshot 2026-06-18 at 16-17-51 employee-management" src="https://github.com/user-attachments/assets/ba07d0ac-9370-4d8a-83b7-6a3bdd2bcd01" />
<img width="1920" height="1107" alt="Screenshot 2026-06-18 at 16-18-04 employee-management" src="https://github.com/user-attachments/assets/aa32f00e-fac0-405a-9e4e-d2248f842b95" />
