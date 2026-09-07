export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <span>© {new Date().getFullYear()} Crocs Store</span>
        <span className="text-faint"></span>
      </div>
    </footer>
  );
}
