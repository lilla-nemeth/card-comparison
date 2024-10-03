import Navbar from "../organisms/Navbar";

export default function AuthenticatedPage({ children }: any) {
  return (
    <div>
      <Navbar />
      {children}
    </div>
  );
}
