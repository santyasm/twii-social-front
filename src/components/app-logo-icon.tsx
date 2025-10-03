import { SVGAttributes } from "react";

export default function AppLogoIcon(props: SVGAttributes<SVGElement>) {
  return (
    <svg
      {...props}
      width="40"
      height="40"
      viewBox="0 0 95 95"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="51.4583" y="43.542" width="43.5417" height="51.4583" rx="3" />
      <rect y="59.375" width="43.5417" height="35.625" rx="3" />
      <rect width="43.5417" height="51.4583" rx="3" />
      <rect x="51.4583" width="43.5417" height="35.625" rx="3" />
    </svg>
  );
}
