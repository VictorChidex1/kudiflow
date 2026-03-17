import { useState, useEffect } from "react";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  Timestamp,
} from "firebase/firestore";
import { db } from "../../lib/firebase";
import { useAdmin } from "../../hooks/useAdmin";
import { useSettings } from "../../hooks/useSettings";
import { useDataWipe } from "../../hooks/useDataWipe";
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
  Save,
} from "lucide-react";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

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

  // Super Admin Data States
  const [users, setUsers] = useState<UserDoc[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [isSuperAdminDataLoading, setIsSuperAdminDataLoading] = useState(false);

  // Settings Forms States
  const [bName, setBName] = useState("");
  const [currency, setCurrency] = useState<"₦" | "$" | "£" | "€">("₦");
  const [isSaving, setIsSaving] = useState(false);

  // Danger Zone States
  const [wipeTarget, setWipeTarget] = useState<"inventory" | "sales" | "debtors" | null>(null);
  const [wipeConfirmText, setWipeConfirmText] = useState("");
  const [isWiping, setIsWiping] = useState(false);

  useEffect(() => {
    if (settings) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setBName(settings.businessName);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCurrency(settings.currencySymbol);
    }
  }, [settings]);

  useEffect(() => {
    if (!isAdmin) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsSuperAdminDataLoading(true);

    const usersQuery = query(collection(db, "users"), orderBy("createdAt", "desc"));
    const unsubUsers = onSnapshot(usersQuery, (snapshot) => {
      const usersData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data({ serverTimestamps: "estimate" }),
      })) as UserDoc[];
      setUsers(usersData);
    });

    const msgsQuery = query(collection(db, "contact_messages"), orderBy("createdAt", "desc"));
    const unsubMsgs = onSnapshot(msgsQuery, (snapshot) => {
      const msgsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data({ serverTimestamps: "estimate" }),
      })) as ContactMessage[];
      setMessages(msgsData);
      setIsSuperAdminDataLoading(false);
    });

    return () => {
      unsubUsers();
      unsubMsgs();
    };
  }, [isAdmin]);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bName.trim()) return toast.error("Business name is required");
    setIsSaving(true);
    await updateSettings({ businessName: bName, currencySymbol: currency });
    setIsSaving(false);
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

  if (isSettingsLoading) {
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
          
          {/* Section 1 & 2: Store Preferences */}
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200">
              <div className="flex items-center gap-3 mb-6">
                <Store className="w-5 h-5 text-emerald-500" />
                <h2 className="text-xl font-bold text-slate-800">Business Setup</h2>
              </div>
              
              <form onSubmit={handleSaveSettings} className="space-y-5">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">Business Name</label>
                  <input
                    type="text"
                    value={bName}
                    onChange={(e) => setBName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-sm rounded-xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 block p-3.5 transition-all outline-none font-medium"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">Default Currency</label>
                  <div className="flex items-center gap-2">
                    <Wallet className="w-5 h-5 text-slate-400" />
                    <select
                      value={currency}
                      onChange={(e) => setCurrency(e.target.value as "₦" | "$" | "£" | "€")}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-sm rounded-xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 block p-3.5 transition-all outline-none font-medium appearance-none"
                    >
                      <option value="₦">Nigerian Naira (₦)</option>
                      <option value="$">US Dollar ($)</option>
                      <option value="£">British Pound (£)</option>
                      <option value="€">Euro (€)</option>
                    </select>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="w-full sm:w-auto bg-slate-900 text-white font-bold rounded-xl px-6 py-3.5 flex items-center justify-center gap-2 hover:bg-slate-800 transition-colors disabled:opacity-70"
                  >
                    {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                    Save Preferences
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Section 3: The Danger Zone */}
          <div className="space-y-6">
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
               </div>
             </div>
          </div>

        </div>

        {/* Section 4: Super Admin God-Mode Views (Conditional) */}
        {isAdmin && (
          <div className="mt-8 pt-6 border-t border-slate-200">
            <div className="flex items-center gap-3 mb-6">
              <ShieldAlert className="w-6 h-6 text-emerald-600" />
              <h2 className="text-2xl font-black text-slate-800 tracking-tight">Super Admin Logs</h2>
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
                        <li key={u.id} className="p-5 hover:bg-slate-50 transition-colors">
                          <div className="flex justify-between items-start gap-3">
                            <div className="min-w-0">
                              <p className="text-sm font-bold text-slate-900 flex items-center gap-2 truncate">
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

    </div>
  );
}
