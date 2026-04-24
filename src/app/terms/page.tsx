export default function TermsPage() {
  return (
    <div className="min-h-screen py-24 px-6 lg:px-12 max-w-4xl mx-auto">
      <h1 className="text-4xl font-black mb-8">Terms of Service</h1>
      <p className="text-zinc-500">Last updated: {new Date().toLocaleDateString()}</p>
      <div className="mt-8 space-y-6 text-zinc-400">
        <p>By accessing the Aurora Ecosystem, you agree to abide by these terms of service.</p>
        {/* Placeholder content */}
        <p>Our complete terms of service will be available here soon.</p>
      </div>
    </div>
  );
}
