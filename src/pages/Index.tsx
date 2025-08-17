import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { LandingPage } from "@/components/LandingPage";
import { SEOComponent } from "@/components/SEO/SEOComponent";
import { generateNigerianMetaTitle, generateNigerianMetaDescription, NIGERIAN_KEYWORDS } from "@/lib/nigerianSEO";
import { Loader2 } from 'lucide-react';

const Index = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

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
