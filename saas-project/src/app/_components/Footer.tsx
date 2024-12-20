export default function Footer() {
  return (
    <footer className="w-full py-6 bg-muted/50 border-t border-border text-muted-foreground">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-sm">
            &copy; 2024 XRPlatform. All rights reserved.
          </div>
          <div className="flex gap-4 text-sm">
            <a href="#" className="hover:text-primary transition-colors duration-200">Privacy Policy</a>
            <a href="#" className="hover:text-primary transition-colors duration-200">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}