# Koupreng Admin Frontend Setup Guide

## Overview
This admin dashboard provides a complete management interface for the Koupreng Invitation platform. It includes user management, invitation tracking, template management, and system settings.

## Project Structure
```
app/
├── admin/
│   ├── login/             # Admin login page
│   ├── dashboard/         # Main dashboard with stats & charts
│   ├── invitations/       # Invitations management
│   ├── users/            # User management
│   ├── templates/        # Template management
│   ├── settings/         # System settings
│   └── page.tsx          # Admin root (redirects to dashboard)
│
components/
├── admin/
│   ├── Sidebar.tsx       # Navigation menu
│   ├── Topbar.tsx        # Header with user menu
│   └── AdminLayout.tsx   # Layout wrapper
├── AdminGuard.tsx        # Protected route wrapper
│
context/
├── AdminContext.tsx      # Auth state management
└── AdminProvider.tsx     # Auth context provider
│
services/
└── adminService.ts       # API integration layer
│
api/
└── admin/
    └── auth/
        └── login/route.ts # Demo login endpoint
```

## Features

### 1. **Authentication**
- JWT-based login system
- Role-based access control (ADMIN, SUPER_ADMIN)
- Protected routes with AdminGuard component
- Automatic token refresh and expiration handling

**Demo Credentials:**
```
Email: admin@koupreng.com
Password: password123
```

### 2. **Dashboard**
- Overview statistics cards
- Invitations trend chart
- User growth chart
- Recent invitations table

### 3. **Invitations Management**
- View all invitations with status filtering
- Search by email or invitation link
- Copy invitation links
- Delete invitations
- Status tracking (pending, accepted, declined)

### 4. **Users Management**
- View admin users
- Filter by role (ADMIN, SUPER_ADMIN)
- Edit user permissions
- Deactivate/activate users
- Delete users

### 5. **Templates Management**
- Browse invitation templates by category
- Preview templates
- Edit template content
- Track template usage
- Upload new templates

### 6. **Settings**
- General site configuration
- Email notification preferences
- Security settings (2FA toggle)
- Customizable brand colors

## Integration with Spring Boot Backend

### Current State
The admin frontend currently uses mock data for demonstration. To connect to your Spring Boot backend:

### 1. **Configure API Base URL**
Create a `.env.local` file in the project root:
```env
NEXT_PUBLIC_API_URL=http://localhost:8080/api
```

### 2. **Backend API Endpoints Required**

#### Authentication
```
POST /api/auth/login
- Body: { email, password }
- Response: { token, user: { id, email, name, role } }
```

#### Invitations
```
GET    /api/admin/invitations          # List all
GET    /api/admin/invitations/:id      # Get one
POST   /api/admin/invitations          # Create
PUT    /api/admin/invitations/:id      # Update
DELETE /api/admin/invitations/:id      # Delete
```

#### Users
```
GET    /api/admin/users                # List all
GET    /api/admin/users/:id            # Get one
POST   /api/admin/users                # Create
PUT    /api/admin/users/:id            # Update
DELETE /api/admin/users/:id            # Delete
```

#### Templates
```
GET    /api/admin/templates            # List all
GET    /api/admin/templates/:id        # Get one
POST   /api/admin/templates            # Create
PUT    /api/admin/templates/:id        # Update
DELETE /api/admin/templates/:id        # Delete
```

#### Dashboard
```
GET    /api/admin/dashboard/stats      # Dashboard statistics
GET    /api/admin/dashboard/charts     # Chart data
```

### 3. **Using the API Service Layer**

The `services/adminService.ts` file contains pre-built methods:

```typescript
import {
  authService,
  invitationService,
  userService,
  templateService,
  dashboardService
} from '@/services/adminService';

// Example: Fetch invitations
const invitations = await invitationService.getAll();

// Example: Create invitation
const newInvitation = await invitationService.create({
  recipientEmail: 'user@example.com',
  templateId: 1
});

// Example: Delete user
await userService.delete('user-id');
```

## Running the Project

### Development
```bash
pnpm install
pnpm dev
```
Visit `http://localhost:3000/admin/login`

### Build for Production
```bash
pnpm build
pnpm start
```

## Authentication Flow

1. User visits `/admin/login`
2. Enters email and password
3. Frontend calls `/api/admin/auth/login`
4. Backend validates credentials and returns JWT token
5. Token stored in localStorage
6. User redirected to dashboard
7. Token automatically attached to all API requests
8. On logout, token is cleared and user redirected to login

## Customization

### Changing Colors
Edit the Tailwind color classes in components:
- Primary color: `bg-blue-600`, `text-blue-600`, etc.
- Success: `bg-green-*`
- Warning: `bg-yellow-*`
- Error: `bg-red-*`

### Adding Menu Items
Edit `components/admin/Sidebar.tsx`:
```typescript
const menuItems = [
  // Add new item here
  {
    label: "Reports",
    href: "/admin/reports",
    icon: BarChart3,
  },
];
```

### Creating New Pages
1. Create folder: `app/admin/[page-name]/`
2. Create file: `page.tsx`
3. Wrap with `AdminGuard` and `AdminLayout`
4. Add to sidebar menu

## Environment Variables

Required for production:
```env
NEXT_PUBLIC_API_URL=https://your-api.com/api
```

## Security Considerations

1. **JWT Tokens**: Store in localStorage (consider httpOnly cookies for enhanced security)
2. **CORS**: Configure Spring Boot CORS to allow frontend domain
3. **Role-Based Access**: Implement on both frontend and backend
4. **Rate Limiting**: Add rate limiting on backend login endpoint
5. **HTTPS**: Use in production only

## Next Steps

1. **Connect to Spring Boot Backend**
   - Update `NEXT_PUBLIC_API_URL` environment variable
   - Implement your authentication logic in Spring Security
   - Create required API endpoints

2. **Implement Real Data**
   - Replace mock data in pages with actual API calls
   - Use React Query or SWR for data fetching

3. **Add Features**
   - Bulk actions for invitations
   - Advanced filtering and search
   - Export reports to CSV/PDF
   - Activity logs

4. **Enhance Security**
   - Implement 2FA
   - Add activity audit logs
   - Session timeout management
   - Rate limiting

## Troubleshooting

### Login not working
- Check if backend is running
- Verify `NEXT_PUBLIC_API_URL` is correct
- Check browser console for errors

### Styling issues
- Ensure Tailwind CSS is properly configured
- Clear Next.js cache: `rm -rf .next`
- Restart dev server

### API errors
- Check backend logs
- Verify JWT token is being sent in Authorization header
- Check CORS configuration on backend

## Support

For issues or questions about the admin dashboard, refer to your project documentation or contact your development team.
