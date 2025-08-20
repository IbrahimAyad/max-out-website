export default function TestPage() {
  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold mb-4">Test Page</h1>
      <p>If you can see this, the server is working!</p>
      <div className="mt-4 p-4 bg-gold text-black rounded">
        Gold background test
      </div>
      <div className="mt-4 p-4 bg-black text-white rounded">
        Black background test
      </div>
    </div>
  );
}