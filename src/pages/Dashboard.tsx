import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { SEOComponent } from '@/components/SEO/SEOComponent';
import { generateNigerianMetaTitle, generateNigerianMetaDescription } from '@/lib/nigerianSEO';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MessageCircle, Settings, Headphones, LogOut } from 'lucide-react';
import VoiceChatWidget from '@/components/VoiceChatWidget';
import { whatsappLauncher } from '@/lib/whatsapp';

const Dashboard = () => {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) navigate('/auth');
  }, [user, loading, navigate]);

  const openWhatsApp = (template: Parameters<typeof whatsappLauncher.getMessageTemplate>[0]) => {
    whatsappLauncher.launch({ message: whatsappLauncher.getMessageTemplate(template), context: `dashboard_${template}` });
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <SEOComponent
        page="home"
        title={generateNigerianMetaTitle('home', 'Lagos')}
        description={generateNigerianMetaDescription('home')}
      />

      {/* Header */}
      <header className="border-b border-border bg-card/60 backdrop-blur px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-foreground">LexiPay AI Dashboard</h1>
          <p className="text-sm text-muted-foreground">Welcome, {user.email}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => openWhatsApp('support')}>
            <Headphones className="w-4 h-4 mr-2" /> Support
          </Button>
          <Button variant="secondary" size="sm" onClick={() => openWhatsApp('business')}>
            <MessageCircle className="w-4 h-4 mr-2" /> WhatsApp
          </Button>
          <Button variant="ghost" size="icon" onClick={signOut} aria-label="Sign out">
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </header>

      <section className="container mx-auto px-6 py-8">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="agents">Agents</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6 space-y-6">
            <div className="grid gap-6 md:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle>Get Started</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full" onClick={() => openWhatsApp('trial')}>Start Free Trial in WhatsApp</Button>
                  <Button variant="outline" className="w-full" onClick={() => openWhatsApp('demo')}>See Live Demo</Button>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Voice Conversation</CardTitle>
                </CardHeader>
                <CardContent>
                  <VoiceChatWidget />
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Shortcuts</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 gap-2">
                  <Button variant="secondary" onClick={() => openWhatsApp('pricing')}>Ask About Pricing</Button>
                  <Button variant="outline" onClick={() => openWhatsApp('upgrade')}>Upgrade to Agent Lexi</Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="agents" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Your AI Agents</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                  <p className="font-medium text-foreground">LexiPay AI</p>
                  <p className="text-sm text-muted-foreground">WhatsApp Financial Assistant • Status: Active</p>
                </div>
                <div className="flex gap-2">
                  <Button onClick={() => openWhatsApp('business')}>Open in WhatsApp</Button>
                  <Button variant="outline" onClick={() => openWhatsApp('support')}>
                    <Settings className="w-4 h-4 mr-2" /> Configure
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Account & Billing</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">Manage your plan, billing and support via WhatsApp.</p>
                <Button onClick={() => openWhatsApp('pricing')}>Manage Billing</Button>
                <Button variant="outline" onClick={() => openWhatsApp('support')}>Contact Support</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </section>
    </main>
  );
};

export default Dashboard;
