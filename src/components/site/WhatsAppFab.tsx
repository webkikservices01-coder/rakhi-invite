import { COMPANY } from "@/data/company";

export function WhatsAppFab() {
  return (
    <a
      href={`https://wa.me/${COMPANY.whatsappHref}`}
      target="_blank"
      rel="noreferrer"
      aria-label={`Chat with us on WhatsApp: ${COMPANY.whatsapp}`}
      className="fixed right-4 z-50 flex items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform hover:scale-110 active:scale-95 sm:right-6"
      style={{
        bottom: "calc(1rem + env(safe-area-inset-bottom, 0px))",
        width: "3.25rem",
        height: "3.25rem",
      }}
    >
      <span className="absolute inset-0 rounded-full animate-wa-ring" />
      <svg viewBox="0 0 32 32" width="26" height="26" fill="currentColor" aria-hidden="true">
        <path d="M16.004 3C9.377 3 4 8.373 4 15c0 2.34.673 4.523 1.838 6.372L4 29l7.828-1.79A11.94 11.94 0 0 0 16.004 27C22.63 27 28 21.627 28 15S22.63 3 16.004 3Zm0 21.818a9.78 9.78 0 0 1-4.986-1.362l-.358-.213-4.646 1.062 1.08-4.53-.234-.372A9.77 9.77 0 0 1 5.2 15c0-5.966 4.855-10.818 10.804-10.818 5.948 0 10.803 4.852 10.803 10.818 0 5.965-4.855 10.818-10.803 10.818Zm5.94-8.096c-.325-.163-1.924-.95-2.222-1.058-.298-.108-.515-.163-.732.163-.216.325-.84 1.058-1.03 1.276-.19.217-.379.244-.703.081-.325-.163-1.372-.505-2.613-1.608-.966-.86-1.618-1.923-1.808-2.248-.19-.325-.02-.5.143-.663.146-.146.325-.38.488-.57.163-.19.217-.325.325-.542.108-.217.054-.407-.027-.57-.081-.163-.732-1.762-1.003-2.414-.264-.634-.532-.548-.732-.558l-.624-.011c-.217 0-.57.081-.868.407-.298.325-1.138 1.112-1.138 2.71 0 1.6 1.165 3.145 1.327 3.362.163.217 2.293 3.502 5.557 4.912.777.335 1.383.535 1.856.685.78.248 1.489.213 2.05.13.625-.093 1.924-.786 2.195-1.546.271-.76.271-1.412.19-1.547-.081-.135-.298-.217-.623-.38Z" />
      </svg>
    </a>
  );
}
