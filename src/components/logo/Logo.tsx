import React from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./logo.module.css";

interface LogoProps {
  width?: number;
  height?: number;
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ width = 150, height = 40, className = "" }) => {
  return (
    <Link href="/" className={`${styles.logoLink} ${className}`}>
      <Image
        src="/logo.png"
        alt="RealNest Logo"
        width={width}
        height={height}
        className="object-contain"
        priority
      />
    </Link>
  );
};

export default Logo;
