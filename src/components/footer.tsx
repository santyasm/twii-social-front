export default function Footer() {
  return (
    <div className="space-y-2">
      <span className="text-gray-400 text-xs">
        {`© ${new Date().getFullYear()} Twii | All rights reserved.`}
      </span>
    </div>
  );
}
