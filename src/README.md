# Ka-Eco - Urban Wetlands Monitoring System

A comprehensive web-based platform for monitoring, analyzing, and visualizing real-time environmental data for sustainable wetland management in Rwanda.

**Project Lead:** Kamanzi Divin, Mount Kenya University

## 🌟 Features

### Authentication & User Management
- **JWT-based authentication** with role-based access control
- **Three user roles:** Admin, Researcher, Public Viewer
- **Secure login/registration** system
- **Demo accounts available** for testing

### Interactive Dashboard
- **Real-time sensor data visualization** with interactive charts
- **Wetland location mapping** with status indicators
- **Key environmental metrics** (temperature, pH, water quality, dissolved oxygen)
- **Critical alerts system** for immediate attention items
- **Responsive design** for mobile and desktop

### Wetland Management (CRUD)
- **Complete wetland lifecycle management**
- **Add, edit, and delete wetland sites**
- **GPS coordinate tracking**
- **Sensor assignment and monitoring**
- **Status tracking** (Healthy, Degraded, Critical)

### Advanced Reporting
- **Custom date range reports**
- **PDF and CSV export capabilities**
- **Environmental trend analysis**
- **Alert distribution charts**
- **Comprehensive wetland profiles**

### Admin Panel (Admin only)
- **User management system**
- **System statistics and health monitoring**
- **Configuration management**
- **Database and API status monitoring**

### Real-time Data Simulation
- **Mock sensor readings** for temperature, pH, dissolved oxygen, and water quality
- **Automatic data generation** every 30 seconds
- **Realistic environmental data patterns**
- **Status-based alerting** (Normal, Warning, Critical)

## 🏗️ Architecture

### Frontend Stack
- **React 18** with TypeScript
- **Tailwind CSS v4** for styling
- **Shadcn/ui** component library
- **Recharts** for data visualization
- **Lucide React** for icons
- **Context API** for state management

### Backend Simulation
- **Mock authentication system** with localStorage persistence
- **Simulated REST API endpoints**
- **Real-time data generation**
- **File export functionality**

### Project Structure
```
ka-eco/
├── components/
│   ├── auth/               # Authentication components
│   │   ├── AuthWrapper.tsx
│   │   ├── LoginForm.tsx
│   │   └── RegisterForm.tsx
│   ├── dashboard/          # Dashboard components
│   │   ├── Dashboard.tsx
│   │   ├── SensorChart.tsx
│   │   └── WetlandMap.tsx
│   ├── wetlands/           # Wetland management
│   │   ├── WetlandManagement.tsx
│   │   └── WetlandForm.tsx
│   ├── reports/            # Reporting system
│   │   ├── Reports.tsx
│   │   └── ReportPreview.tsx
│   ├── admin/              # Admin panel
│   │   ├── AdminPanel.tsx
│   │   ├── UserManagement.tsx
│   │   └── SystemStats.tsx
│   ├── layout/             # Layout components
│   │   └── Layout.tsx
│   └── ui/                 # Shadcn UI components
├── contexts/               # React Context providers
│   ├── AuthContext.tsx    # Authentication state
│   └── DataContext.tsx    # Application data state
├── styles/
│   └── globals.css        # Global styles and Tailwind config
└── App.tsx               # Main application component
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm/yarn
- Modern web browser (Chrome, Firefox, Safari, Edge)

### Installation
1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/ka-eco.git
   cd ka-eco
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open your browser:**
   Navigate to `http://localhost:3000`

### Demo Accounts
The application includes pre-configured demo accounts:

| Role | Email | Password | Permissions |
|------|-------|----------|-------------|
| **Admin** | admin@ka-eco.rw | admin123 | Full system access |
| **Researcher** | researcher@ka-eco.rw | research123 | Data management |
| **Public** | public@ka-eco.rw | public123 | Read-only access |

## 🔧 Configuration

### Environment Variables
Create a `.env.local` file for production deployment:

```env
# API Configuration (for future backend integration)
NEXT_PUBLIC_API_URL=https://api.ka-eco.rw
NEXT_PUBLIC_MAP_API_KEY=your_mapbox_api_key

# Authentication (for production)
JWT_SECRET=your_super_secure_jwt_secret
JWT_EXPIRES_IN=24h

# Database (for production)
DATABASE_URL=postgresql://username:password@host:port/ka_eco_db

# Email Notifications (for production)
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=alerts@ka-eco.rw
SMTP_PASS=your_smtp_password
```

### Customization
- **Branding:** Update colors and logos in `styles/globals.css`
- **Data Sources:** Modify `contexts/DataContext.tsx` for real API integration
- **Authentication:** Replace mock auth in `contexts/AuthContext.tsx`

## 📊 Data Models

### Wetland
```typescript
interface Wetland {
  id: string;
  name: string;
  location: { lat: number; lng: number };
  area: number; // hectares
  type: 'permanent' | 'seasonal' | 'artificial';
  status: 'healthy' | 'degraded' | 'critical';
  description: string;
  sensors: string[];
  lastUpdated: string;
}
```

### Sensor Reading
```typescript
interface SensorReading {
  id: string;
  wetlandId: string;
  sensorType: 'water_quality' | 'vegetation' | 'pollution' | 'temperature' | 'ph' | 'dissolved_oxygen';
  value: number;
  unit: string;
  timestamp: string;
  status: 'normal' | 'warning' | 'critical';
}
```

### User
```typescript
interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'researcher' | 'public';
  organization?: string;
}
```

## 🔗 Future Integration

### IoT Sensor Integration
The system is designed to easily integrate with real IoT sensors:

1. **Replace mock data generation** in `DataContext.tsx`
2. **Add WebSocket connections** for real-time updates
3. **Implement sensor registration** and calibration features
4. **Add sensor health monitoring**

### Real Backend Integration
Ready for backend connection:

1. **Replace AuthContext** with real JWT authentication
2. **Update DataContext** to use REST API calls
3. **Add proper error handling** and loading states
4. **Implement data caching** and synchronization

### Recommended Backend Stack
- **Node.js/Express** or **Python/Django** for API
- **PostgreSQL** with **PostGIS** for spatial data
- **Redis** for caching and sessions
- **InfluxDB** for time-series sensor data
- **AWS IoT Core** or **Azure IoT Hub** for device management

### Mapping Integration
For production deployment, integrate with:
- **Mapbox GL JS** for interactive mapping
- **Leaflet.js** for lightweight mapping
- **Rwanda GIS data** for accurate geographic context

## 🔒 Security Considerations

### Current Implementation (Development)
- Client-side authentication (not production-ready)
- Local storage for session management
- Mock user database

### Production Requirements
- Server-side JWT validation
- Encrypted password storage (bcrypt)
- HTTPS enforcement
- Rate limiting on API endpoints
- Input validation and sanitization
- Database security (parameterized queries)

## 📈 Performance Optimization

### Current Features
- Efficient React Context usage
- Memoized chart data processing
- Responsive image loading
- Component code splitting ready

### Production Enhancements
- **Redis caching** for API responses
- **CDN integration** for static assets
- **Database indexing** for sensor data queries
- **WebSocket optimization** for real-time updates

## 🧪 Testing Strategy

### Recommended Testing Stack
- **Jest** + **React Testing Library** for unit tests
- **Cypress** for end-to-end testing
- **MSW** for API mocking
- **Lighthouse** for performance testing

### Test Coverage Areas
- Authentication flows
- Data visualization accuracy
- CRUD operations
- Report generation
- Responsive design
- Accessibility compliance

## 🚀 Deployment

### Frontend Deployment Options
- **Vercel** (recommended for React)
- **Netlify** for static hosting
- **AWS S3 + CloudFront**
- **Azure Static Web Apps**

### Full-Stack Deployment
- **Docker** containerization
- **Kubernetes** for orchestration
- **AWS ECS** or **Azure Container Instances**
- **CI/CD** with GitHub Actions

## 📞 Support & Contributing

### Getting Help
- **GitHub Issues:** Report bugs and request features
- **Documentation:** Comprehensive inline code comments
- **Demo Environment:** Live demo available for testing

### Contributing Guidelines
1. Fork the repository
2. Create a feature branch
3. Write tests for new features
4. Ensure all tests pass
5. Submit a pull request

### Development Workflow
```bash
# Start development server
npm run dev

# Run tests
npm run test

# Build for production
npm run build

# Start production server
npm run start
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Mount Kenya University** for project support
- **Rwanda Environment Management Authority** for domain expertise
- **Figma Make Platform** for rapid prototyping capabilities
- **Open source community** for excellent tooling and libraries

---

**Ka-Eco** - Supporting sustainable wetland management in Rwanda through technology innovation.

For questions or collaboration opportunities, contact: [Kamanzi Divin](mailto:kamanzi@mku.ac.ke)