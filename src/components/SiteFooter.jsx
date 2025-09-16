export default function SiteFooter() {
  return (
    <footer className="mt-10">
      <img
        src="/Footer.png"
        alt="Footer"
        className="w-full max-h-44 object-cover"
      />
      <div className="bg-white border-t">
        <div className="mx-auto max-w-6xl px-4 py-3 text-sm text-gray-500 flex items-center justify-between">
          <span>© {new Date().getFullYear()} The Subramanyan Team</span>
          <span>Success is a journey, not a destination!</span>
        </div>
      </div>
    </footer>
  );
}