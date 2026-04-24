export default function PrivacyPage() {
  return (
    <div className="min-h-screen py-24 px-6 lg:px-12 max-w-4xl mx-auto">
      <h1 className="text-4xl font-black mb-8">Privacy Policy</h1>
      <p className="text-zinc-500">Last updated: {new Date().toLocaleDateString()}</p>
      <div className="mt-8 space-y-6 text-zinc-400">
        <p>Your privacy is important to us. This policy outlines how we handle your data.</p>
        {/* Placeholder content */}
        <p>Our complete privacy policy will be available here soon.</p>
      </div>
    </div>
  );
}
