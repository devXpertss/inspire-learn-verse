import { Link } from "react-router-dom";
import { useSiteContent } from "@/hooks/useFirebase";
import { defaultSiteContent } from "@/lib/defaultSiteContent";

export function SiteFooter() {
  const { data: siteContentData } = useSiteContent();
  const siteContent = siteContentData ?? defaultSiteContent;
  const { brand, footer } = siteContent;

  const renderLink = (item: { label: string; path: string; external?: boolean }) => {
    if (item.external || item.path.startsWith("http")) {
      return (
        <a key={item.label} href={item.path} target="_blank" rel="noopener noreferrer" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
          {item.label}
        </a>
      );
    }

    return (
      <Link key={item.label} to={item.path} className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
        {item.label}
      </Link>
    );
  };

  return (
    <footer className="border-t border-border py-12 mt-8">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <img src={brand.logoUrl} alt={brand.logoAlt} className="w-8 h-8 rounded-lg object-cover" loading="lazy" />
              <span className="font-heading text-xl font-bold text-gradient">{brand.name}</span>
            </div>
            <p className="text-sm text-muted-foreground">{footer.description}</p>
          </div>
          <div>
            <h4 className="font-heading font-semibold mb-3">Learn</h4>
            <div className="space-y-2">{footer.learnLinks.map(renderLink)}</div>
          </div>
          <div>
            <h4 className="font-heading font-semibold mb-3">Connect</h4>
            <div className="space-y-2">{footer.connectLinks.map(renderLink)}</div>
          </div>
          <div>
            <h4 className="font-heading font-semibold mb-3">Resources</h4>
            <div className="space-y-2">{footer.resourceLinks.map(renderLink)}</div>
          </div>
        </div>
        <div className="border-t border-border pt-8 text-center text-sm text-muted-foreground">
          <p>{footer.copyright}</p>
        </div>
      </div>
    </footer>
  );
}