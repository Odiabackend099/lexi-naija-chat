import { LandingPage } from "@/components/LandingPage";
import { SEOComponent } from "@/components/SEO/SEOComponent";
import { generateNigerianMetaTitle, generateNigerianMetaDescription, NIGERIAN_KEYWORDS } from "@/lib/nigerianSEO";

const Index = () => {
  return (
    <>
      <SEOComponent 
        page="home"
        title={generateNigerianMetaTitle('home', 'Lagos')}
        description={generateNigerianMetaDescription('home')}
        keywords={[...NIGERIAN_KEYWORDS.financial, ...NIGERIAN_KEYWORDS.banking]}
      />
      <LandingPage />
    </>
  );
};

export default Index;
