import { useState, useEffect } from "react";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  Timestamp,
} from "firebase/firestore";
import { db, auth } from "../../lib/firebase";
import { useAdmin } from "../../hooks/useAdmin";
import { useSettings } from "../../hooks/useSettings";
import { useDataWipe } from "../../hooks/useDataWipe";
import { useProfile } from "../../hooks/useProfile";
import { useDeleteAccount } from "../../hooks/useDeleteAccount";
import {
  ShieldAlert,
  Loader2,
  Users,
  MessageSquare,
  Briefcase,
  Settings as SettingsIcon,
  Store,
  Wallet,
  AlertTriangle,
  Trash2,
  Save,
  ChevronDown,
  Check,
  LifeBuoy,
  User,
  Phone,
  FileText,
  Mail,
} from "lucide-react";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { AdminUserInspector } from "../../components/dashboard/AdminUserInspector";

interface UserDoc {
  id: string;
  email: string;
  fullName: string;
  shopName: string;
  phone: string;
  createdAt: Timestamp;
  isAdmin?: boolean;
}

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  createdAt: Timestamp;
}

export default function Settings() {
  const { isAdmin } = useAdmin();
  const { settings, updateSettings, isLoading: isSettingsLoading } = useSettings();
  const { wipeInventory, wipeSales, wipeDebtors } = useDataWipe();
  const { profile, updateProfile, isLoading: isProfileLoading } = useProfile();
  const { deleteAccount, isDeleting: isDeletingAccount } = useDeleteAccount();

  // Super Admin Data States
  const [users, setUsers] = useState<UserDoc[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [isSuperAdminDataLoading, setIsSuperAdminDataLoading] = useState(false);
  const [inspectedUser, setInspectedUser] = useState<UserDoc | null>(null);

  // Settings Forms States
  const [bName, setBName] = useState("");
  const [currency, setCurrency] = useState<"₦" | "$" | "£" | "€">("₦");
  const [isSavingSettings, setIsSavingSettings] = useState(false);

  // Profile Form States
  const [fName, setFName] = useState("");
  const [telephone, setTelephone] = useState("");
  const [sName, setSName] = useState("");
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  // Currency Dropdown State
  const [isCurrencyDropdownOpen, setIsCurrencyDropdownOpen] = useState(false);
  const CURRENCIES = [
    { value: "₦", label: "Nigerian Naira (₦)" },
    { value: "$", label: "US Dollar ($)" },
    { value: "£", label: "British Pound (£)" },
    { value: "€", label: "Euro (€)" },
  ];

  // Danger Zone States
  const [wipeTarget, setWipeTarget] = useState<"inventory" | "sales" | "debtors" | null>(null);
  const [wipeConfirmText, setWipeConfirmText] = useState("");
  const [isWiping, setIsWiping] = useState(false);

  // Delete Account States
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [deletePassword, setDeletePassword] = useState("");
  const isEmailUser = auth.currentUser?.providerData[0]?.providerId === "password";

  useEffect(() => {
    if (settings) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setBName(settings.businessName);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCurrency(settings.currencySymbol);
    }
  }, [settings]);

  useEffect(() => {
    if (profile) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFName(profile.fullName || "");
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setTelephone(profile.phone || "");
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSName(profile.shopName || "");
    }
  }, [profile]);

  useEffect(() => {
    if (!isAdmin) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsSuperAdminDataLoading(true);

    const usersQuery = query(collection(db, "users"), orderBy("createdAt", "desc"));
    const unsubUsers = onSnapshot(
      usersQuery,
      (snapshot) => {
        const usersData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data({ serverTimestamps: "estimate" }),
        })) as UserDoc[];
        setUsers(usersData);
      },
      (err) => {
        console.error("SuperAdmin Users Error:", err);
        toast.error("Failed to load Super Admin logs (Check Firestore rules)");
        setIsSuperAdminDataLoading(false);
      }
    );

    const msgsQuery = query(collection(db, "contact_messages"), orderBy("createdAt", "desc"));
    const unsubMsgs = onSnapshot(
      msgsQuery,
      (snapshot) => {
        const msgsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data({ serverTimestamps: "estimate" }),
        })) as ContactMessage[];
        setMessages(msgsData);
        setIsSuperAdminDataLoading(false);
      },
      (err) => {
        console.error("SuperAdmin Messages Error:", err);
        setIsSuperAdminDataLoading(false);
      }
    );

    return () => {
      unsubUsers();
      unsubMsgs();
    };
  }, [isAdmin]);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bName.trim()) return toast.error("Business name is required");
    setIsSavingSettings(true);
    await updateSettings({ businessName: bName, currencySymbol: currency });
    setIsSavingSettings(false);
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fName.trim()) return toast.error("Full name is required");
    setIsSavingProfile(true);
    await updateProfile({ fullName: fName, phone: telephone, shopName: sName });
    setIsSavingProfile(false);
  };

  const executeWipe = async () => {
    if (wipeConfirmText !== "CONFIRM WIPE") {
      toast.error("You must type exactly CONFIRM WIPE");
      return;
    }

    setIsWiping(true);
    if (wipeTarget === "inventory") await wipeInventory();
    if (wipeTarget === "sales") await wipeSales();
    if (wipeTarget === "debtors") await wipeDebtors();
    
    setIsWiping(false);
    setWipeTarget(null);
    setWipeConfirmText("");
  };

  if (isSettingsLoading || isProfileLoading) {
    return (
      <div className="flex-1 p-8 flex flex-col items-center justify-center h-full">
        <Loader2 className="w-10 h-10 animate-spin text-emerald-500 mb-4" />
        <p className="text-slate-500 font-medium">Loading settings...</p>
      </div>
    );
  }

  return (
    <div className="flex-1 p-4 sm:p-8 overflow-y-auto">
      <div className="max-w-5xl mx-auto space-y-6 lg:space-y-8">
        
        {/* Header Setup */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-xl shadow-slate-900/10 relative overflow-hidden shrink-0">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
          
          <div className="relative z-10 flex items-center gap-4 sm:gap-5">
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-linear-to-br from-slate-100 to-slate-200 rounded-2xl flex items-center justify-center shadow-lg border border-slate-300/20 shrink-0">
              <SettingsIcon className="w-7 h-7 sm:w-8 sm:h-8 text-slate-800 drop-shadow-md" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Store Settings
              </h1>
              <p className="text-slate-400 font-medium mt-0.5 text-sm sm:text-lg">
                Manage your profile and app preferences
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          
          {/* Left Column: Forms */}
          <div className="space-y-6 lg:space-y-8">
            
            {/* Section 1: Business Profile */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200">
              <div className="flex items-center gap-3 mb-6">
                <User className="w-5 h-5 text-emerald-500" />
                <h2 className="text-xl font-bold text-slate-800">Personal Profile</h2>
              </div>
              
              <form onSubmit={handleSaveProfile} className="space-y-5">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">Full Name</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <User className="w-5 h-5 text-slate-400" />
                    </div>
                    <input
                      type="text"
                      value={fName}
                      onChange={(e) => setFName(e.target.value)}
                      className="w-full pl-10 bg-slate-50 border border-slate-200 text-slate-800 text-sm rounded-xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 block p-3.5 transition-all outline-none font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">Shop Name</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <Store className="w-5 h-5 text-slate-400" />
                    </div>
                    <input
                      type="text"
                      value={sName}
                      onChange={(e) => setSName(e.target.value)}
                      className="w-full pl-10 bg-slate-50 border border-slate-200 text-slate-800 text-sm rounded-xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 block p-3.5 transition-all outline-none font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">Phone Number</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <Phone className="w-5 h-5 text-slate-400" />
                    </div>
                    <input
                      type="tel"
                      value={telephone}
                      onChange={(e) => setTelephone(e.target.value)}
                      placeholder="+234 800 000 0000"
                      className="w-full pl-10 bg-slate-50 border border-slate-200 text-slate-800 text-sm rounded-xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 block p-3.5 transition-all outline-none font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">Login Email</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <Mail className="w-5 h-5 text-slate-400" />
                    </div>
                    <input
                      type="email"
                      value={profile?.email || ""}
                      readOnly
                      disabled
                      className="w-full pl-10 bg-slate-100 border border-slate-200 text-slate-500 text-sm rounded-xl block p-3.5 font-medium cursor-not-allowed"
                    />
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1 font-medium">To change your email, please contact customer support.</p>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSavingProfile}
                    className="w-full bg-emerald-600 text-white font-bold rounded-xl px-6 py-3.5 flex items-center justify-center gap-2 hover:bg-emerald-700 transition-colors disabled:opacity-70 active:scale-95 shadow-lg shadow-emerald-600/20"
                  >
                    {isSavingProfile ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                    Save Profile
                  </button>
                </div>
              </form>
            </div>

            {/* Section 2: Store Preferences */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200">
              <div className="flex items-center gap-3 mb-6">
                <SettingsIcon className="w-5 h-5 text-emerald-500" />
                <h2 className="text-xl font-bold text-slate-800">App Preferences</h2>
              </div>
              
              <form onSubmit={handleSaveSettings} className="space-y-5">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">Receipt Business Name</label>
                  <input
                    type="text"
                    value={bName}
                    onChange={(e) => setBName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-sm rounded-xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 block p-3.5 transition-all outline-none font-medium"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">Default Currency</label>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setIsCurrencyDropdownOpen(!isCurrencyDropdownOpen)}
                      className="w-full flex items-center justify-between bg-slate-50 border border-slate-200 text-slate-800 text-sm rounded-xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 p-3.5 transition-all outline-none font-medium text-left"
                    >
                      <div className="flex items-center gap-2">
                        <Wallet className="w-5 h-5 text-slate-400" />
                        <span>{CURRENCIES.find(c => c.value === currency)?.label || currency}</span>
                      </div>
                      <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform duration-200 ${isCurrencyDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>
                    
                    <AnimatePresence>
                      {isCurrencyDropdownOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.15 }}
                          className="absolute z-20 top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden"
                        >
                          {CURRENCIES.map((c) => (
                            <button
                              key={c.value}
                              type="button"
                              onClick={() => {
                                setCurrency(c.value as "₦" | "$" | "£" | "€");
                                setIsCurrencyDropdownOpen(false);
                              }}
                              className={`w-full text-left px-4 py-3 flex items-center justify-between hover:bg-slate-50 transition-colors ${
                                currency === c.value 
                                  ? 'bg-emerald-50 text-emerald-700 font-bold' 
                                  : 'text-slate-700 font-medium'
                              }`}
                            >
                              {c.label}
                              {currency === c.value && <Check className="w-4 h-4 text-emerald-600" />}
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSavingSettings}
                    className="w-full bg-slate-900 text-white font-bold rounded-xl px-6 py-3.5 flex items-center justify-center gap-2 hover:bg-slate-800 transition-colors disabled:opacity-70 active:scale-95"
                  >
                    {isSavingSettings ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                    Save Preferences
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6 lg:space-y-8">
            
            {/* Section 3: Support Center */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                  <LifeBuoy className="w-5 h-5 text-blue-600" />
                </div>
                <h2 className="text-xl font-bold text-slate-800">Support Center</h2>
              </div>
              <p className="text-sm text-slate-500 mb-6 leading-relaxed">
                Need help with your store or encountering a bug? Reach out directly to our dedicated technical support team. We reply within 24 hours.
              </p>
              <div className="space-y-3">
                <a
                  href="https://wa.me/2348000000000" // Replace with actual WhatsApp number
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 bg-[#25D366]/10 border border-[#25D366]/20 text-[#25D366] font-bold rounded-xl px-6 py-3.5 hover:bg-[#25D366]/20 transition-colors"
                >
                  <MessageSquare className="w-5 h-5" />
                  Contact us via WhatsApp
                </a>
                <a
                  href="mailto:support@kudiflow.com"
                  className="w-full flex items-center justify-center gap-2 bg-blue-50 border border-blue-100 text-blue-600 font-bold rounded-xl px-6 py-3.5 hover:bg-blue-100 hover:text-blue-700 transition-colors"
                >
                  <Mail className="w-5 h-5" />
                  Contact us via Email
                </a>
              </div>
            </div>

             {/* Section 4: The Danger Zone */}
             <div className="bg-rose-50/50 rounded-3xl p-6 sm:p-8 shadow-sm border border-rose-100">
               <div className="flex items-center gap-3 mb-4">
                 <ShieldAlert className="w-6 h-6 text-rose-500" />
                 <h2 className="text-xl font-bold text-rose-700">The Danger Zone</h2>
               </div>
               <p className="text-sm text-rose-600/80 font-medium mb-6 leading-relaxed">
                 God-Mode actions below are irreversible. Deleting this data will permanently wipe it from the cloud for your account. Please proceed with extreme caution.
               </p>

               <div className="space-y-3">
                 <button
                   onClick={() => setWipeTarget("inventory")}
                   className="w-full flex items-center justify-between p-4 bg-white border border-rose-200 rounded-2xl text-left hover:bg-rose-50 transition-colors group"
                 >
                   <span className="font-bold text-slate-700 group-hover:text-rose-700 transition-colors">Wipe All Inventory</span>
                   <AlertTriangle className="w-5 h-5 text-rose-400" />
                 </button>
                 <button
                   onClick={() => setWipeTarget("sales")}
                   className="w-full flex items-center justify-between p-4 bg-white border border-rose-200 rounded-2xl text-left hover:bg-rose-50 transition-colors group"
                 >
                   <span className="font-bold text-slate-700 group-hover:text-rose-700 transition-colors">Clear All Sales History</span>
                   <AlertTriangle className="w-5 h-5 text-rose-400" />
                 </button>
                 <button
                   onClick={() => setWipeTarget("debtors")}
                   className="w-full flex items-center justify-between p-4 bg-white border border-rose-200 rounded-2xl text-left hover:bg-rose-50 transition-colors group"
                 >
                   <span className="font-bold text-slate-700 group-hover:text-rose-700 transition-colors">Reset Debtors Ledger</span>
                   <AlertTriangle className="w-5 h-5 text-rose-400" />
                 </button>
                  
                  {/* Divider */}
                  <div className="border-t border-rose-200 my-1" />
                  
                  {/* Delete Account — most destructive action */}
                  <button
                    onClick={() => setShowDeleteModal(true)}
                    className="w-full flex items-center justify-between p-4 bg-rose-600 border border-rose-700 rounded-2xl text-left hover:bg-rose-700 transition-all group"
                  >
                    <span className="font-bold text-white">Delete My Account Permanently</span>
                    <Trash2 className="w-5 h-5 text-rose-200" />
                  </button>
               </div>
             </div>
          </div>

        </div>

        {/* Section 4: Super Admin God-Mode Views (Conditional) */}
        {isAdmin && (
          <div className="mt-8 pt-6 border-t border-slate-200">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <ShieldAlert className="w-6 h-6 text-emerald-600" />
                <h2 className="text-2xl font-black text-slate-800 tracking-tight">Super Admin Command Center</h2>
              </div>
              <Link
                to="/dashboard/settings/cms"
                className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2.5 rounded-xl text-sm font-bold shadow-[0_4px_14px_0_rgba(15,23,42,0.39)] hover:shadow-[0_6px_20px_rgba(15,23,42,0.23)] hover:bg-slate-800 transition-all group"
              >
                <FileText className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
                Open Content CMS
              </Link>
            </div>
            
            {isSuperAdminDataLoading ? (
              <div className="flex items-center justify-center p-8">
                <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
              </div>
            ) : (
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8">
                {/* Users Registered */}
                <div className="bg-white rounded-3xl shadow-sm border border-slate-200 flex flex-col h-[500px]">
                  <div className="p-5 border-b border-slate-100 flex items-center gap-3 bg-slate-50/50 shrink-0">
                    <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center">
                      <Users className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-800 tracking-tight">Merchants</h3>
                      <p className="text-xs text-slate-500 font-medium">{users.length} Total Users</p>
                    </div>
                  </div>
                  <div className="overflow-y-auto flex-1 p-0">
                    <ul className="divide-y divide-slate-100">
                      {users.map((u) => (
                        <li 
                          key={u.id} 
                          className="p-5 hover:bg-slate-50 transition-colors cursor-pointer group"
                          onClick={() => setInspectedUser(u)}
                        >
                          <div className="flex justify-between items-start gap-3">
                            <div className="min-w-0">
                              <p className="text-sm font-bold text-slate-900 flex items-center gap-2 truncate group-hover:text-emerald-700 transition-colors">
                                {u.fullName}
                                {u.isAdmin && (
                                  <span className="shrink-0 px-2 py-0.5 rounded-md bg-rose-100 text-rose-700 text-[10px] uppercase font-black tracking-wider">
                                    Admin
                                  </span>
                                )}
                              </p>
                              <p className="text-sm text-slate-500 flex items-center gap-1.5 mt-1 truncate">
                                <Briefcase className="w-4 h-4 text-emerald-500 shrink-0" /> {u.shopName || "N/A"}
                              </p>
                              <p className="text-xs text-slate-400 mt-1 truncate">{u.email}</p>
                            </div>
                            <div className="text-right shrink-0">
                              <p className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded-full whitespace-nowrap">
                                {u.createdAt?.toDate ? format(u.createdAt.toDate(), "MMM dd, yyyy") : "Unknown"}
                              </p>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Contact Inquiries */}
                <div className="bg-white rounded-3xl shadow-sm border border-slate-200 flex flex-col h-[500px]">
                  <div className="p-5 border-b border-slate-100 flex items-center gap-3 bg-slate-50/50 shrink-0">
                    <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center">
                      <MessageSquare className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-800 tracking-tight">Inquiries</h3>
                      <p className="text-xs text-slate-500 font-medium">{messages.length} Messages</p>
                    </div>
                  </div>
                  <div className="overflow-y-auto flex-1 p-0">
                    <ul className="divide-y divide-slate-100">
                      {messages.map((msg) => (
                        <li key={msg.id} className="p-5 hover:bg-slate-50 transition-colors">
                          <div className="flex justify-between mb-2 items-center">
                            <p className="text-sm font-bold text-slate-900 truncate pr-2">{msg.name}</p>
                            <p className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-1 flex items-center gap-1 rounded-full whitespace-nowrap shrink-0">
                              {msg.createdAt?.toDate ? format(msg.createdAt.toDate(), "MMM dd 'at' h:mm a") : "Unknown"}
                            </p>
                          </div>
                          <div className="flex flex-col sm:flex-row gap-2 mb-3 text-xs font-medium">
                            <a href={`mailto:${msg.email}`} className="text-blue-600 bg-blue-50 px-2 py-1 rounded-lg w-fit truncate">
                              {msg.email}
                            </a>
                            {msg.phone && (
                              <a href={`tel:${msg.phone}`} className="text-slate-600 bg-slate-100 px-2 py-1 rounded-lg w-fit truncate">
                                {msg.phone}
                              </a>
                            )}
                          </div>
                          <p className="text-sm text-slate-700 bg-white border border-slate-200 p-3.5 rounded-2xl shadow-sm italic leading-relaxed">
                            "{msg.message}"
                          </p>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

              </div>
            )}
          </div>
        )}
      </div>

      {/* Danger Zone Wipe Modal */}
      <AnimatePresence>
        {wipeTarget && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl border border-slate-200"
            >
              <div className="p-6 sm:p-8">
                <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mb-6 mx-auto">
                  <AlertTriangle className="w-8 h-8 text-rose-600" />
                </div>
                <h2 className="text-2xl font-black text-slate-800 text-center mb-2">
                  Are you absolutely sure?
                </h2>
                <p className="text-slate-500 text-center mb-6 text-sm leading-relaxed">
                  You are about to irreversibly wipe your{" "}
                  <span className="font-bold text-slate-800 uppercase">{wipeTarget}</span>. 
                  This action cannot be undone. To proceed, type <span className="font-mono bg-rose-100 text-rose-700 px-1 py-0.5 rounded font-bold">CONFIRM WIPE</span> below.
                </p>
                <input
                  type="text"
                  placeholder="CONFIRM WIPE"
                  value={wipeConfirmText}
                  onChange={(e) => setWipeConfirmText(e.target.value)}
                  className="w-full text-center bg-slate-50 border border-slate-200 text-slate-800 text-sm rounded-xl focus:ring-4 focus:ring-rose-500/10 focus:border-rose-500 block p-3.5 outline-none font-bold uppercase mb-6"
                />
                
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setWipeTarget(null);
                      setWipeConfirmText("");
                    }}
                    className="flex-1 bg-slate-100 text-slate-700 font-bold py-3.5 rounded-xl hover:bg-slate-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={executeWipe}
                    disabled={isWiping || wipeConfirmText !== "CONFIRM WIPE"}
                    className="flex-1 bg-rose-600 text-white font-bold py-3.5 rounded-xl hover:bg-rose-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isWiping ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      "Delete Data"
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Account Modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl border border-slate-200"
            >
              <div className="p-6 sm:p-8">
                {/* Icon */}
                <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mb-6 mx-auto">
                  <Trash2 className="w-8 h-8 text-rose-600" />
                </div>

                <h2 className="text-2xl font-black text-slate-800 text-center mb-2">
                  Delete Your Account?
                </h2>
                <p className="text-slate-500 text-center mb-6 text-sm leading-relaxed">
                  This will <span className="font-bold text-rose-600">permanently erase</span> your
                  profile, all sales history, inventory, and debtor records.
                  This action <span className="font-bold text-slate-800">cannot be undone</span>.
                  Type <span className="font-mono bg-rose-100 text-rose-700 px-1.5 py-0.5 rounded font-bold">DELETE</span> to confirm.
                </p>

                {/* Confirmation text — NO uppercase CSS so e.target.value matches raw user input */}
                <input
                  type="text"
                  placeholder="Type DELETE to confirm"
                  value={deleteConfirmText}
                  autoComplete="off"
                  autoCorrect="off"
                  spellCheck={false}
                  onChange={(e) => setDeleteConfirmText(e.target.value)}
                  className={`w-full text-center text-slate-800 text-sm font-bold rounded-xl focus:ring-4 block p-3.5 outline-none mb-3 border-2 transition-colors ${
                    deleteConfirmText.length === 0
                      ? "bg-slate-50 border-slate-200 focus:ring-rose-500/10 focus:border-rose-400"
                      : deleteConfirmText.toUpperCase() === "DELETE"
                      ? "bg-emerald-50 border-emerald-400 focus:ring-emerald-500/10 text-emerald-700"
                      : "bg-rose-50 border-rose-300 focus:ring-rose-500/10"
                  }`}
                />

                {/* Re-authentication — differs per sign-in method */}
                {isEmailUser ? (
                  <div className="mb-6">
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 text-left">
                      Confirm your password
                    </label>
                    <input
                      type="password"
                      placeholder="Enter your account password"
                      value={deletePassword}
                      onChange={(e) => setDeletePassword(e.target.value)}
                      className="w-full bg-slate-50 border-2 border-slate-200 text-slate-800 text-sm rounded-xl focus:ring-4 focus:ring-rose-500/10 focus:border-rose-400 block p-3.5 outline-none"
                    />
                  </div>
                ) : (
                  <div className="mb-6 flex items-start gap-3 bg-blue-50 border border-blue-100 rounded-2xl p-4 text-left">
                    <svg className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                    <div>
                      <p className="text-sm font-bold text-slate-700">Google verification required</p>
                      <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                        You signed in with Google. When you click &quot;Delete Forever&quot;, a Google sign-in window will open to verify it&apos;s really you. No password needed.
                      </p>
                    </div>
                  </div>
                )}


                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setShowDeleteModal(false);
                      setDeleteConfirmText("");
                      setDeletePassword("");
                    }}
                    className="flex-1 bg-slate-100 text-slate-700 font-bold py-3.5 rounded-xl hover:bg-slate-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={async () => {
                      if (deleteConfirmText.toUpperCase() !== "DELETE") {
                        return;
                      }
                      await deleteAccount(isEmailUser ? deletePassword : undefined);
                      setShowDeleteModal(false);
                    }}
                    disabled={
                      isDeletingAccount ||
                      deleteConfirmText.toUpperCase() !== "DELETE" ||
                      (isEmailUser && !deletePassword.trim())
                    }
                    className="flex-1 bg-rose-600 text-white font-bold py-3.5 rounded-xl hover:bg-rose-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isDeletingAccount ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      "Delete Forever"
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* God-Mode Inspector Modal Overlay */}
      {inspectedUser && (
        <AdminUserInspector
          userId={inspectedUser.id}
          userName={inspectedUser.fullName}
          shopName={inspectedUser.shopName}
          onClose={() => setInspectedUser(null)}
        />
      )}

    </div>
  );
}
