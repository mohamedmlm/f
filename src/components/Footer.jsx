export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <span>© {new Date().getFullYear()} Crocs</span>
        <span className="text-faint"></span>
      </div>
    </footer>
  );
}
