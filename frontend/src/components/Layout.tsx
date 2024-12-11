// import { useState } from 'react';
// import { Link, useLocation, useNavigate } from 'react-router-dom';
// import {
//   Users,
//   FileText,
//   Plane,
//   Languages,
//   CreditCard,
//   Palette,
//   Calendar,
//   Settings,
//   LogOut,
//   StickyNote,
//   Briefcase,
//   CreditCard as AccountsIcon,
//   Menu,
//   X,
//   Search as SearchIcon
// } from 'lucide-react';
// // import { useAuth } from '../App';
// import { useAdminStore } from '../store/adminStore';
// import GlobalSearch from './GlobalSearch';
// import NotesPanel from './notes/NotesPanel';

// const getMenuItems = (isSuper: boolean) => {
//   const baseItems = [
//     { icon: Users, label: 'Clients', path: '/dashboard/clients' },
//     { icon: FileText, label: 'Visa Applicants', path: '/dashboard/applications' },
//     { icon: Plane, label: 'Japan Visit', path: '/dashboard/japan-visit' },
//     { icon: Languages, label: 'Document Translation', path: '/dashboard/translations' },
//     { icon: CreditCard, label: 'ePassport', path: '/dashboard/epassport' },
//     { icon: Briefcase, label: 'Other Services', path: '/dashboard/other-services' },
//     { icon: Palette, label: 'Graphic Design', path: '/dashboard/graphic-design' },
//     { icon: Calendar, label: 'Appointments', path: '/dashboard/appointment' },
//     { icon: AccountsIcon, label: 'Accounts & Tasks', path: '/dashboard/accounts' },
//   ];

//   if (isSuper) {
//     baseItems.splice(9, 0, { icon: Calendar, label: 'Reports', path: '/dashboard/reports' });
//   }

//   return baseItems;
// };

// export default function Layout({ children }: { children: React.ReactNode }) {
//   const location = useLocation();
//   const navigate = useNavigate();
//   // const { logout } = useAuth();
//   const { currentAdmin } = useAdminStore();
//   const [showMobileMenu, setShowMobileMenu] = useState(false);
//   const [showSearch, setShowSearch] = useState(false);
//   const [showNotes, setShowNotes] = useState(false);
  
//   if (!currentAdmin) return null;

//   const isSuper = currentAdmin.role === 'super_admin';
//   const menuItems = getMenuItems(isSuper);

//   const handleLogout = () => {
//     // logout();
//     navigate('/login');
//   };

//   const isActive = (path: string) => {
//     if (path === '/dashboard/clients' && location.pathname === '/dashboard') {
//       return false;
//     }
//     return location.pathname.startsWith(path);
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Fixed Header */}
//       <header className="fixed top-0 left-0 right-0 h-16 bg-brand-black border-b border-gray-800 z-50">
//         <div className="h-full px-4 flex items-center justify-between">
//           {/* Left side */}
//           <div className="flex items-center">
//             <button
//               onClick={() => setShowMobileMenu(!showMobileMenu)}
//               className="lg:hidden header-icon-button"
//             >
//               {showMobileMenu ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
//             </button>
            
//             <Link to="/dashboard" className="flex-shrink-0 flex items-center pl-2">
//               <span className="text-xl font-bold text-white tracking-tight sm:hidden">
//                 Dashboard
//               </span>
//               <div className="hidden sm:flex sm:items-center">
//                 <FileText className="h-8 w-8 text-brand-yellow" />
//                 <span className="ml-2 text-2xl font-bold text-white tracking-tight">
//                   Zoom Dashboard
//                 </span>
//               </div>
//             </Link>
//           </div>

//           {/* Right side */}
//           <div className="flex items-center gap-2">
//             {/* Search Icon/Button */}
//             <button
//               onClick={() => setShowSearch(!showSearch)}
//               className="header-icon-button"
//               title="Search"
//             >
//               <SearchIcon className="h-6 w-6" />
//             </button>

//             {/* Profile Info - Only show on large screens */}
//             <div className="profile-section">
//               {currentAdmin.profilePhoto ? (
//                 <img
//                   src={currentAdmin.profilePhoto}
//                   alt={currentAdmin.name}
//                   className="h-8 w-8 rounded-full object-cover ring-2 ring-brand-yellow"
//                 />
//               ) : (
//                 <div className="h-8 w-8 rounded-full bg-brand-yellow/10 flex items-center justify-center ring-2 ring-brand-yellow">
//                   <span className="text-brand-yellow font-medium">
//                     {currentAdmin.name ? currentAdmin.name[0] : '?'}
//                   </span>
//                 </div>
//               )}
//               <span className="text-sm text-white font-medium">{currentAdmin.name}</span>
//             </div>

//             {/* Notes Icon */}
//             <button
//               onClick={() => setShowNotes(!showNotes)}
//               className="header-icon-button"
//               title="My Notes"
//             >
//               <StickyNote className="h-6 w-6" />
//             </button>

//             {/* Logout Button */}
//             <button
//               onClick={handleLogout}
//               className="header-icon-button"
//               title="Sign Out"
//             >
//               <LogOut className="h-6 w-6" />
//             </button>
//           </div>
//         </div>

//         {/* Global Search */}
//         <GlobalSearch isOpen={showSearch} onClose={() => setShowSearch(false)} />
//       </header>

//       {/* Main Content with Fixed Sidebar */}
//       <div className="flex pt-16">
//         {/* Fixed Sidebar */}
//         <aside className={`fixed top-16 bottom-0 w-64 bg-brand-black transition-transform duration-200 ease-in-out z-40 ${
//           showMobileMenu ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
//         }`}>
//           {/* Main Menu Items */}
//           <nav className="h-full overflow-y-auto py-5 px-2 space-y-1">
//             {menuItems.map((item) => {
//               const Icon = item.icon;
//               const active = isActive(item.path);
//               return (
//                 <Link
//                   key={item.path}
//                   to={item.path}
//                   className={`nav-item ${active ? 'nav-item-active' : 'nav-item-inactive'}`}
//                   onClick={() => setShowMobileMenu(false)}
//                 >
//                   <Icon
//                     className={`mr-3 h-5 w-5 ${
//                       active ? 'text-brand-black' : 'text-gray-400 group-hover:text-brand-yellow'
//                     }`}
//                   />
//                   {item.label}
//                 </Link>
//               );
//             })}

//             {/* Settings at Bottom */}
//             <Link
//               to="/dashboard/settings"
//               className={`nav-item ${
//                 isActive('/dashboard/settings') ? 'nav-item-active' : 'nav-item-inactive'
//               }`}
//               onClick={() => setShowMobileMenu(false)}
//             >
//               <Settings
//                 className={`mr-3 h-5 w-5 ${
//                   isActive('/dashboard/settings')
//                     ? 'text-brand-black'
//                     : 'text-gray-400 group-hover:text-brand-yellow'
//                 }`}
//               />
//               Settings
//             </Link>
//           </nav>
//         </aside>

//         {/* Mobile Menu Overlay */}
//         {showMobileMenu && (
//           <div
//             className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
//             onClick={() => setShowMobileMenu(false)}
//           />
//         )}

//         {/* Main Content */}
//         <main className="flex-1 min-h-screen pl-0 lg:pl-64 bg-gray-50">
//           <div className="p-6">
//             {children}
//           </div>
//         </main>

//         {/* Notes Panel */}
//         <NotesPanel isOpen={showNotes} onClose={() => setShowNotes(false)} />
//       </div>
//     </div>
//   );
// }




// ********************NEW CODE***********


import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Users,
  FileText,
  Plane,
  Languages,
  CreditCard,
  Palette,
  Calendar,
  Settings,
  LogOut,
  StickyNote,
  Briefcase,
  Menu,
  X,
  Search as SearchIcon,
  ReceiptPoundSterlingIcon
} from 'lucide-react';
import GlobalSearch from './GlobalSearch';
import NotesPanel from './notes/NotesPanel';

const getMenuItems = () => {
  return [
    { icon: Users, label: 'Clients', path: '/dashboard/clients' },
    { icon: FileText, label: 'Visa Applicants', path: '/dashboard/applications' },
    { icon: Plane, label: 'Japan Visit', path: '/dashboard/japan-visit' },
    { icon: Languages, label: 'Document Translation', path: '/dashboard/translations' },
    { icon: CreditCard, label: 'ePassport', path: '/dashboard/epassport' },
    { icon: Briefcase, label: 'Other Services', path: '/dashboard/other-services' },
    { icon: Palette, label: 'Graphic Design', path: '/dashboard/graphic-design' },
    { icon: Calendar, label: 'Appointments', path: '/dashboard/appointment' },
    { icon: ReceiptPoundSterlingIcon, label: 'Reports', path: '/dashboard/reports' },
    { icon: CreditCard, label: 'Accounts & Tasks', path: '/dashboard/accounts' },
  ];
};

export default function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showNotes, setShowNotes] = useState(false);

  const menuItems = getMenuItems();

  const handleLogout = () => {
    navigate('/login');
  };

  const isActive = (path: string) => {
    if (path === '/dashboard/clients' && location.pathname === '/dashboard') {
      return false;
    }
    return location.pathname.startsWith(path);
  };

// const isActive = (path: string) => {
//   return location.pathname.startsWith(path);  // This should work for nested routes
// };


  return (
    <div className="min-h-screen bg-gray-50">
      {/* Fixed Header */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-brand-black border-b border-gray-800 z-50">
        <div className="h-full px-4 flex items-center justify-between">
          {/* Left side */}
          <div className="flex items-center">
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="lg:hidden header-icon-button"
            >
              {showMobileMenu ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
            
            <Link to="/dashboard" className="flex-shrink-0 flex items-center pl-2">
              <span className="text-xl font-bold text-white tracking-tight sm:hidden">
                Dashboard
              </span>
              <div className="hidden sm:flex sm:items-center">
                <FileText className="h-8 w-8 text-brand-yellow" />
                <span className="ml-2 text-2xl font-bold text-white tracking-tight">
                  Zoom Dashboard
                </span>
              </div>
            </Link>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {/* Search Icon/Button */}
            <button
              onClick={() => setShowSearch(!showSearch)}
              className="header-icon-button"
              title="Search"
            >
              <SearchIcon className="h-6 w-6" />
            </button>

            {/* Notes Icon */}
            <button
              onClick={() => setShowNotes(!showNotes)}
              className="header-icon-button"
              title="My Notes"
            >
              <StickyNote className="h-6 w-6" />
            </button>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="header-icon-button"
              title="Sign Out"
            >
              <LogOut className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Global Search */}
        <GlobalSearch isOpen={showSearch} onClose={() => setShowSearch(false)} />
      </header>

      {/* Main Content with Fixed Sidebar */}
      <div className="flex pt-16">
        {/* Fixed Sidebar */}
        <aside className={`fixed top-16 bottom-0 w-64 bg-brand-black transition-transform duration-200 ease-in-out z-40 ${showMobileMenu ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
          {/* Main Menu Items */}
          <nav className="h-full overflow-y-auto py-5 px-2 space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`nav-item ${active ? 'nav-item-active' : 'nav-item-inactive'}`}
                  onClick={() => setShowMobileMenu(false)}
                >
                  <Icon
                    className={`mr-3 h-5 w-5 ${active ? 'text-brand-black' : 'text-gray-400 group-hover:text-brand-yellow'}`}
                  />
                  {item.label}
                </Link>
              );
            })}

            {/* Settings at Bottom */}
            <Link
              to="/dashboard/settings"
              className={`nav-item ${isActive('/dashboard/settings') ? 'nav-item-active' : 'nav-item-inactive'}`}
              onClick={() => setShowMobileMenu(false)}
            >
              <Settings
                className={`mr-3 h-5 w-5 ${isActive('/dashboard/settings') ? 'text-brand-black' : 'text-gray-400 group-hover:text-brand-yellow'}`}
              />
              Settings
            </Link>
          </nav>
        </aside>

        {/* Mobile Menu Overlay */}
        {showMobileMenu && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
            onClick={() => setShowMobileMenu(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 min-h-screen pl-0 lg:pl-64 bg-gray-50">
          <div className="p-6">
            {children}
          </div>
        </main>

        {/* Notes Panel */}
        <NotesPanel isOpen={showNotes} onClose={() => setShowNotes(false)} />
      </div>
    </div>
  );
}


