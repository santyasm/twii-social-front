const footerLinks = [
  ["Sobre"]
];

export default function Footer() {
  return (
    <div className="space-y-2">
      {footerLinks.map((row, i) => (
        <div key={i} className="flex flex-wrap gap-x-3 gap-y-1">
          {row.map((link) => (
            <button
              key={link}
              className="text-gray-500 text-xs hover:text-gray-400 transition-colors"
            >
              {link}
            </button>
          ))}
        </div>
      ))}
    </div>
  );
}
