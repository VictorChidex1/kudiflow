import { MessageCircle } from "lucide-react";

interface Props {
  debtorName: string;
  debtorPhone: string | undefined;
  balanceOwed: number;
  shopName?: string;
}

export function WhatsAppReminderButton({
  debtorName,
  debtorPhone,
  balanceOwed,
  shopName,
}: Props) {
  const handleWhatsAppRedirect = () => {
    if (!debtorPhone) {
      alert("This customer does not have a phone number saved.");
      return;
    }

    // 1. Format the phone number string securely
    let cleanPhone = debtorPhone.replace(/\D/g, ""); // Remove non-numeric characters like spaces/dashes

    if (cleanPhone.startsWith("0")) {
      // e.g. 08012345678 becomes 2348012345678
      cleanPhone = "234" + cleanPhone.slice(1);
    } else if (!cleanPhone.startsWith("234") && cleanPhone.length >= 10) {
      // In case they just typed 8012345678 without the leading '0' or '+234'
      cleanPhone = "234" + cleanPhone;
    }

    // 2. Construct the smart template message
    const formattedBalance = balanceOwed.toLocaleString();
    const sender = shopName ? shopName : "our shop";
    const textMessage = `Hello ${debtorName},

This is a polite reminder from ${sender}.
Your current outstanding balance is ₦${formattedBalance}.

Please let us know when you will be able to settle this. Thank you for your continued patronage! 🙏🏾`;

    // 3. Encode and build the exact Deep Link URL
    const encodedMessage = encodeURIComponent(textMessage);
    const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodedMessage}`;

    // 4. Launch Native OS window / application
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <button
      onClick={handleWhatsAppRedirect}
      title="Send Polite Reminder on WhatsApp"
      className="flex items-center justify-center gap-2 bg-[#25D366] text-white px-5 py-2.5 w-full sm:w-auto rounded-xl font-bold text-sm hover:bg-[#20bd5a] transition-all shadow-md shadow-[#25D366]/20 active:scale-95"
    >
      <MessageCircle className="w-4 h-4" /> Send Reminder
    </button>
  );
}
