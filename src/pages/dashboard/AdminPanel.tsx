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
import {
  ShieldAlert,
  Loader2,
  Users,
  MessageSquare,
  Briefcase,
} from "lucide-react";
import { format } from "date-fns";

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

export default function AdminPanel() {
  const { isAdmin, isLoading: isAdminLoading } = useAdmin();
  const [users, setUsers] = useState<UserDoc[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isAdmin) return;

    // 1. Fetch Users
    const usersQuery = query(
      collection(db, "users"),
      orderBy("createdAt", "desc")
    );
    const unsubUsers = onSnapshot(usersQuery, (snapshot) => {
      const usersData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data({ serverTimestamps: "estimate" }),
      })) as UserDoc[];
      setUsers(usersData);
    });

    // 2. Fetch Contact Messages
    const msgsQuery = query(
      collection(db, "contact_messages"),
      orderBy("createdAt", "desc")
    );
    const unsubMsgs = onSnapshot(msgsQuery, (snapshot) => {
      const msgsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data({ serverTimestamps: "estimate" }),
      })) as ContactMessage[];
      setMessages(msgsData);
      setIsLoading(false);
    });

    return () => {
      unsubUsers();
      unsubMsgs();
    };
  }, [isAdmin]);

  if (isAdminLoading) {
    return (
      <div className="flex-1 p-8 flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="w-10 h-10 animate-spin text-emerald-500 mb-4" />
        <p className="text-slate-500 font-medium">
          Verifying God-Mode clearance...
        </p>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="flex-1 p-8 flex flex-col items-center justify-center min-h-[60vh] text-center max-w-md mx-auto">
        <div className="w-20 h-20 bg-rose-100 rounded-full flex items-center justify-center mb-6 border-4 border-rose-50">
          <ShieldAlert className="w-10 h-10 text-rose-500" />
        </div>
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
          Access Restricted
        </h2>
        <p className="text-slate-500 font-medium text-lg leading-relaxed">
          This sector is strictly reserved for the Founder & Admin. Your
          unauthorized access attempt has been logged.
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 p-4 sm:p-8 overflow-y-auto">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 bg-slate-900 rounded-3xl p-8 sm:p-10 shadow-xl shadow-slate-900/10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3"></div>

          <div className="relative z-10 flex items-center gap-5">
            <div className="w-16 h-16 bg-linear-to-br from-emerald-400 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/30 border border-emerald-400/20">
              <ShieldAlert className="w-8 h-8 text-white drop-shadow-md" />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold text-white tracking-tight">
                God-Mode Panel
              </h1>
              <p className="text-slate-400 font-medium mt-1 text-lg">
                Central Command Station
              </p>
            </div>
          </div>

          <div className="relative z-10 hidden sm:flex items-center gap-8 bg-slate-800/50 backdrop-blur-sm px-6 py-4 rounded-2xl border border-slate-700/50">
            <div className="flex flex-col">
              <span className="text-3xl font-black text-white">
                {users.length}
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 mt-1">
                Total Users
              </span>
            </div>
            <div className="w-px h-10 bg-slate-700"></div>
            <div className="flex flex-col">
              <span className="text-3xl font-black text-white">
                {messages.length}
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-400 mt-1">
                Inquiries
              </span>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            {/* Users Registered DB */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
              <div className="p-6 border-b border-slate-100 flex items-center gap-3 bg-slate-50/50">
                <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center">
                  <Users className="w-5 h-5" />
                </div>
                <h2 className="text-xl font-bold text-slate-800 tracking-tight">
                  Registered Merchants
                </h2>
              </div>

              <div className="p-0 overflow-y-auto max-h-[600px] flex-1">
                {users.length === 0 ? (
                  <div className="p-12 text-center text-slate-500 text-sm">
                    No users registered yet...
                  </div>
                ) : (
                  <ul className="divide-y divide-slate-100">
                    {users.map((u) => (
                      <li
                        key={u.id}
                        className="p-5 hover:bg-slate-50 transition-colors"
                      >
                        <div className="flex justify-between items-start gap-4">
                          <div>
                            <p className="text-sm font-bold text-slate-900 flex items-center gap-2">
                              {u.fullName}
                              {u.isAdmin && (
                                <span className="px-2 py-0.5 rounded-md bg-rose-100 text-rose-700 text-[10px] uppercase font-black tracking-wider">
                                  Admin
                                </span>
                              )}
                            </p>
                            <div className="flex items-center gap-4 mt-2">
                              <p className="text-sm text-slate-500 flex items-center gap-1.5">
                                <Briefcase className="w-4 h-4 text-emerald-500" />{" "}
                                {u.shopName || "N/A"}
                              </p>
                            </div>
                            <p className="text-sm text-slate-500 mt-1 cursor-all-scroll">
                              {u.email}
                            </p>
                          </div>
                          <div className="text-right flex flex-col items-end">
                            <p className="text-xs font-semibold text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full">
                              {u.createdAt?.toDate
                                ? format(u.createdAt.toDate(), "MMM dd, yyyy")
                                : "Unknown"}
                            </p>
                            <p className="text-xs text-slate-400 mt-2 font-mono tracking-tighter">
                              {u.id}
                            </p>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            {/* Landing Page Messages DB */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
              <div className="p-6 border-b border-slate-100 flex items-center gap-3 bg-slate-50/50">
                <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <h2 className="text-xl font-bold text-slate-800 tracking-tight">
                  Contact Inquiries
                </h2>
              </div>

              <div className="p-0 overflow-y-auto max-h-[600px] flex-1">
                {messages.length === 0 ? (
                  <div className="p-12 text-center text-slate-500 text-sm">
                    No messages received yet.
                  </div>
                ) : (
                  <ul className="divide-y divide-slate-100">
                    {messages.map((msg) => (
                      <li
                        key={msg.id}
                        className="p-6 hover:bg-slate-50 transition-colors group"
                      >
                        <div className="flex justify-between mb-3 items-center">
                          <p className="text-sm font-bold text-slate-900">
                            {msg.name}
                          </p>
                          <p className="text-xs font-semibold text-slate-500 flex items-center gap-1.5">
                            {msg.createdAt?.toDate
                              ? format(
                                  msg.createdAt.toDate(),
                                  "MMM dd 'at' h:mm a"
                                )
                              : "Unknown"}
                          </p>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-2 sm:gap-6 mb-3 text-xs font-medium">
                          <a
                            href={`mailto:${msg.email}`}
                            className="text-blue-600 hover:text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg w-fit transition-colors"
                          >
                            {msg.email}
                          </a>
                          {msg.phone && (
                            <a
                              href={`tel:${msg.phone}`}
                              className="text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg w-fit hover:bg-slate-200 transition-colors"
                            >
                              {msg.phone}
                            </a>
                          )}
                        </div>
                        <p className="text-sm text-slate-700 bg-white border border-slate-200 p-4 rounded-2xl shadow-sm italic leading-relaxed">
                          "{msg.message}"
                        </p>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
