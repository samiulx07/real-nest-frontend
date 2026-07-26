import PublicHeaderMenu from "@/menus/publicHeaderMenu/PublicHeaderMenu";
import PublicFooterMenu from "@/menus/publicFooterMenu/PublicFooterMenu";

export default function FrontendLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <PublicHeaderMenu />
      <main className="flex-1">{children}</main>
      <PublicFooterMenu />
    </>
  );
}
