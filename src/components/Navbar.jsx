// أضف هذه الدالة للتحقق من حجم الشاشة
const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 900);

useEffect(() => {
  const handleResize = () => {
    setIsDesktop(window.innerWidth >= 900);
    if (window.innerWidth >= 900) {
      setMenuOpen(false); // إغلاق القائمة عند التكبير
    }
  };
  
  window.addEventListener('resize', handleResize);
  return () => window.removeEventListener('resize', handleResize);
}, []);

// ثم في الـ JSX:
{(menuOpen || isDesktop) && (
  <nav ref={navLinksRef} className={`nav-links${menuOpen ? " open" : ""}`}>
    {/* ... */}
  </nav>
)}