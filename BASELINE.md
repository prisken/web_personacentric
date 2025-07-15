# Site Baseline & Change Impact Guide

## 🏗️ **Baseline Site Structure**

### Frontend (React)
```
client/
├── public/
│   ├── index.html
│   └── favicon.ico
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.js
│   │   │   ├── Footer.js
│   │   │   └── Layout.js
│   │   ├── auth/
│   │   │   ├── LoginForm.js
│   │   │   └── RegisterForm.js
│   │   └── common/
│   │       ├── Button.js
│   │       └── Loading.js
│   ├── pages/
│   │   ├── HomePage.js
│   │   ├── AboutPage.js
│   │   ├── EventsPage.js
│   │   ├── DashboardPage.js
│   │   └── LoginPage.js
│   ├── services/
│   │   ├── api.js
│   │   └── auth.js
│   ├── contexts/
│   │   └── AuthContext.js
│   ├── utils/
│   │   ├── translations.js
│   │   ├── languageContext.js
│   │   └── i18n.js
│   ├── App.js
│   └── index.js
├── package.json
└── tailwind.config.js
```

### Backend (Node.js/Express)
```
server/
├── config/
│   └── database.js
├── middleware/
│   ├── auth.js
│   └── validation.js
├── routes/
│   ├── auth.js
│   ├── events.js
│   ├── users.js
│   └── admin.js
├── models/
│   ├── User.js
│   └── Event.js
├── utils/
│   └── helpers.js
├── index.js
└── package.json
```

### Database
```
- Users table (id, name, email, role, created_at)
- Events table (id, title, description, date, location, created_by)
- Relationships and constraints
```

### Language System (Chinese-First)
```
- Default language: Traditional Chinese (zh-TW)
- Secondary language: English (en)
- Language switching: User preference stored in localStorage
- All content: Chinese first, English as fallback
- UI elements: Chinese labels with English tooltips
```

---

## 📊 **Change Impact Analysis**

### 🔧 **Frontend Changes**

#### **Component Changes**
- **Header/Footer** → Affects ALL pages
- **Layout** → Global UI structure impact
- **Auth Components** → Login/Register flow impact
- **Common Components** → Reusable across multiple pages

#### **Page Changes**
- **HomePage** → Landing page experience
- **AboutPage** → Company information
- **EventsPage** → Event listing functionality
- **DashboardPage** → User dashboard experience
- **LoginPage** → Authentication flow

#### **Service Changes**
- **api.js** → ALL API communication
- **auth.js** → Authentication state management
- **translations.js** → Multi-language support
- **languageContext.js** → Language switching functionality
- **i18n.js** → Internationalization utilities

### 🔧 **Backend Changes**

#### **Route Changes**
- **auth.js** → Login/Register/Logout functionality
- **events.js** → Event CRUD operations
- **users.js** → User management
- **admin.js** → Admin-only operations

#### **Middleware Changes**
- **auth.js** → ALL protected routes
- **validation.js** → Data validation across routes

#### **Database Changes**
- **Schema changes** → Data structure impact
- **New tables** → Feature expansion
- **Index changes** → Performance impact

---

## 🎯 **Change Categories & Impact**

### **Critical Changes** (High Impact)
- [ ] **Authentication system** → Affects ALL users
- [ ] **Database schema** → Data integrity risk
- [ ] **API endpoints** → Frontend-backend communication
- [ ] **Security middleware** → User data protection

### **High Priority Changes** (Medium Impact)
- [ ] **User dashboard** → Core user experience
- [ ] **Event management** → Core business functionality
- [ ] **Admin features** → Business operations
- [ ] **Language system** → Chinese-first with English option

### **Medium Priority Changes** (Low Impact)
- [ ] **UI styling** → Visual improvements
- [ ] **Performance optimization** → Speed improvements
- [ ] **Code refactoring** → Maintainability
- [ ] **Documentation** → Developer experience

### **Low Priority Changes** (Minimal Impact)
- [ ] **Minor UI tweaks** → Cosmetic changes
- [ ] **Code comments** → Developer experience
- [ ] **File organization** → Project structure

---

## ⚠️ **Risk Assessment**

### **High Risk Changes**
- Database schema modifications
- Authentication system updates
- Core API endpoint changes
- Security-related modifications

### **Medium Risk Changes**
- New feature additions
- UI/UX redesigns
- Performance optimizations
- Third-party integrations

### **Low Risk Changes**
- Text content updates
- Styling modifications
- Documentation updates
- Code formatting

---

## 📝 **Change Documentation Template**

```
## Change: [Brief Description]
**Category:** [Bug Fix/Feature/Refactor/etc.]
**Priority:** [Critical/High/Medium/Low]
**Risk Level:** [High/Medium/Low]

### Impact Analysis
- **Frontend Impact:** [What frontend changes are needed]
- **Backend Impact:** [What backend changes are needed]
- **Database Impact:** [What database changes are needed]
- **User Impact:** [How this affects users]

### Testing Requirements
- [ ] Unit tests
- [ ] Integration tests
- [ ] User acceptance testing
- [ ] Cross-browser testing

### Rollback Plan
- [How to revert if issues occur]

### Dependencies
- [What other changes are needed first]
```

---

## 🚀 **Ready for Development**

This baseline provides:
- ✅ **Clear structure** for all components
- ✅ **Impact analysis** for any changes
- ✅ **Risk assessment** framework
- ✅ **Documentation standards**

**Ready to start building! What's your first change?** 